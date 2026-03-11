package com.aitestgen.service;

import com.aitestgen.model.ExecutionStatus;
import com.aitestgen.model.TestCase;
import com.aitestgen.model.TestType;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Service responsible for communicating with the OpenAI API to generate
 * structured test cases and Playwright automation scripts from requirements.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OpenAiService {

    private final WebClient openAiWebClient;
    private final ObjectMapper objectMapper;

    @Value("${openai.api.model}")
    private String model;

    private static final String TEST_CASE_SYSTEM_PROMPT = """
            You are a senior QA engineer with deep expertise in software testing.
            Given a software requirement or user story, generate comprehensive structured test cases.

            You MUST return a JSON array where each object has exactly these fields:
            {
              "id": "TC_001",
              "scenario": "Brief description of the test scenario",
              "steps": ["Step 1 description", "Step 2 description", "Step 3 description"],
              "expectedResult": "What should happen when the test passes",
              "testType": "POSITIVE"
            }

            Rules:
            1. Generate at least 2 POSITIVE test cases (valid/happy-path flows).
            2. Generate at least 2 NEGATIVE test cases (invalid inputs, unauthorized access, error paths).
            3. Generate at least 1 EDGE case (boundary values, empty fields, special characters, extremes).
            4. The "id" must follow the pattern TC_001, TC_002, etc.
            5. The "steps" field MUST be a JSON array of strings, one step per element.
            6. The "testType" field MUST be exactly one of: "POSITIVE", "NEGATIVE", "EDGE".
            7. Return ONLY the raw JSON array. No markdown, no code fences, no explanation.
            """;

    private static final String AUTOMATION_SCRIPT_SYSTEM_PROMPT = """
            You are a senior test automation engineer. Convert the given test case into a
            Playwright Python automation script.

            The script must:
            - Use playwright.sync_api (from playwright.sync_api import sync_playwright)
            - Open a Chromium browser
            - Navigate to a relevant page (use https://example.com as placeholder)
            - Perform actions described in the test steps
            - Assert expected results
            - Close the browser properly using a context manager or try/finally
            - Be a complete, runnable Python script

            Return ONLY the Python code. No markdown, no code fences, no additional text.
            """;

    /**
     * Sends the requirement text to OpenAI and returns parsed TestCase objects.
     *
     * @param requirement the business requirement or user story
     * @return list of structured test cases covering positive, negative, and edge scenarios
     */
    public List<TestCase> generateTestCases(String requirement) {
        log.info("Generating test cases for requirement (length={})", requirement.length());

        String userPrompt = "Generate test cases for the following requirement:\n\n" + requirement;
        String response = callOpenAi(TEST_CASE_SYSTEM_PROMPT, userPrompt);
        List<TestCase> testCases = parseTestCases(response);

        // Post-parse: ensure every test case has defaults for missing fields
        AtomicInteger counter = new AtomicInteger(1);
        testCases.forEach(tc -> {
            if (tc.getId() == null || tc.getId().isBlank()) {
                tc.setId(String.format("TC_%03d", counter.getAndIncrement()));
            }
            if (tc.getSteps() == null) {
                tc.setSteps(List.of());
            }
            if (tc.getTestType() == null) {
                tc.setTestType(TestType.POSITIVE);
            }
            tc.setExecutionStatus(ExecutionStatus.NOT_EXECUTED);
        });

        log.info("Generated {} test cases (P:{}, N:{}, E:{})",
                testCases.size(),
                testCases.stream().filter(tc -> tc.getTestType() == TestType.POSITIVE).count(),
                testCases.stream().filter(tc -> tc.getTestType() == TestType.NEGATIVE).count(),
                testCases.stream().filter(tc -> tc.getTestType() == TestType.EDGE).count());

        return testCases;
    }

    /**
     * Sends a test case to OpenAI and returns a Playwright Python automation script.
     *
     * @param testCase the test case to convert into an automation script
     * @return the generated Python script as a string
     */
    public String generateAutomationScript(TestCase testCase) {
        log.info("Generating automation script for test case: {}", testCase.getId());

        String testCaseInfo = String.format(
                "Test Case ID: %s\nScenario: %s\nSteps:\n%s\nExpected Result: %s\nTest Type: %s",
                testCase.getId(),
                testCase.getScenario(),
                formatSteps(testCase.getSteps()),
                testCase.getExpectedResult(),
                testCase.getTestType()
        );

        return callOpenAi(AUTOMATION_SCRIPT_SYSTEM_PROMPT, testCaseInfo);
    }

    /**
     * Calls the OpenAI chat completions API with the given system and user prompts.
     */
    private String callOpenAi(String systemPrompt, String userMessage) {
        Map<String, Object> requestBody = Map.of(
                "model", model,
                "messages", List.of(
                        Map.of("role", "system", "content", systemPrompt),
                        Map.of("role", "user", "content", userMessage)
                ),
                "temperature", 0.7,
                "max_tokens", 3000
        );

        try {
            String responseJson = openAiWebClient.post()
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            if (responseJson == null || responseJson.isBlank()) {
                throw new RuntimeException("Empty response received from AI service");
            }

            JsonNode root = objectMapper.readTree(responseJson);
            JsonNode choices = root.path("choices");
            if (choices.isMissingNode() || !choices.isArray() || choices.isEmpty()) {
                throw new RuntimeException("Invalid response structure from AI service");
            }

            return choices.get(0).path("message").path("content").asText();

        } catch (WebClientResponseException e) {
            log.error("OpenAI API returned HTTP {}: {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("AI service returned an error (HTTP " + e.getStatusCode() + ")");
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            log.error("OpenAI API call failed: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to communicate with AI service: " + e.getMessage());
        }
    }

    /**
     * Parses the raw AI response string into a list of TestCase objects.
     * Handles markdown code fences and extracts the JSON array.
     */
    private List<TestCase> parseTestCases(String response) {
        try {
            String json = extractJson(response);
            List<TestCase> testCases = objectMapper.readValue(json, new TypeReference<List<TestCase>>() {});

            if (testCases == null || testCases.isEmpty()) {
                log.warn("AI returned empty test case list, using fallback");
                return generateFallbackTestCases();
            }

            return testCases;
        } catch (Exception e) {
            log.error("Failed to parse test cases from AI response: {}", e.getMessage());
            log.debug("Raw AI response: {}", response);
            return generateFallbackTestCases();
        }
    }

    /**
     * Extracts a JSON array from the AI response, stripping any markdown
     * code fences or surrounding text.
     */
    private String extractJson(String response) {
        if (response == null) {
            return "[]";
        }

        String cleaned = response.trim();

        // Strip markdown code fences: ```json ... ``` or ``` ... ```
        Pattern codeFencePattern = Pattern.compile("```(?:json)?\\s*(\\[.*?])\\s*```", Pattern.DOTALL);
        Matcher matcher = codeFencePattern.matcher(cleaned);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }

        // Try to find a raw JSON array in the response
        int start = cleaned.indexOf('[');
        int end = cleaned.lastIndexOf(']');
        if (start != -1 && end != -1 && end > start) {
            return cleaned.substring(start, end + 1);
        }

        // Return as-is and let Jackson handle the error
        return cleaned;
    }

    /**
     * Formats a list of steps into a numbered string for the AI prompt.
     */
    private String formatSteps(List<String> steps) {
        if (steps == null || steps.isEmpty()) {
            return "No steps provided";
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < steps.size(); i++) {
            sb.append(i + 1).append(". ").append(steps.get(i));
            if (i < steps.size() - 1) {
                sb.append("\n");
            }
        }
        return sb.toString();
    }

    /**
     * Generates fallback test cases when the AI response cannot be parsed.
     */
    private List<TestCase> generateFallbackTestCases() {
        List<TestCase> fallback = new ArrayList<>();

        fallback.add(TestCase.builder()
                .id("TC_001")
                .scenario("Verify successful operation with valid input")
                .steps(List.of(
                        "Open the application",
                        "Enter valid data in all required fields",
                        "Click Submit"))
                .expectedResult("Operation completes successfully with confirmation")
                .testType(TestType.POSITIVE)
                .executionStatus(ExecutionStatus.NOT_EXECUTED)
                .build());

        fallback.add(TestCase.builder()
                .id("TC_002")
                .scenario("Verify operation fails with invalid input")
                .steps(List.of(
                        "Open the application",
                        "Enter invalid data in required fields",
                        "Click Submit"))
                .expectedResult("Appropriate error message is displayed")
                .testType(TestType.NEGATIVE)
                .executionStatus(ExecutionStatus.NOT_EXECUTED)
                .build());

        fallback.add(TestCase.builder()
                .id("TC_003")
                .scenario("Verify operation handles empty input")
                .steps(List.of(
                        "Open the application",
                        "Leave all fields empty",
                        "Click Submit"))
                .expectedResult("Validation error is shown for required fields")
                .testType(TestType.EDGE)
                .executionStatus(ExecutionStatus.NOT_EXECUTED)
                .build());

        return fallback;
    }
}
