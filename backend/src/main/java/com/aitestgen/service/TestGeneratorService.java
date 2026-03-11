package com.aitestgen.service;

import com.aitestgen.dto.*;
import com.aitestgen.model.AutomationScript;
import com.aitestgen.model.DashboardStats;
import com.aitestgen.model.ExecutionResult;
import com.aitestgen.model.ExecutionStatus;
import com.aitestgen.model.TestCase;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
@RequiredArgsConstructor
@Slf4j
public class TestGeneratorService {

    private final OpenAiService openAiService;
    private final List<TestCase> currentTestCases = new CopyOnWriteArrayList<>();
    private final List<AutomationScript> currentScripts = new CopyOnWriteArrayList<>();
    private final SecureRandom random = new SecureRandom();

    public TestCaseResponse generateTestCases(String requirement) {
        log.info("Generating test cases for requirement: {}", requirement);

        List<TestCase> testCases = openAiService.generateTestCases(requirement);

        // Set initial execution status
        testCases.forEach(tc -> {
            if (tc.getExecutionStatus() == null) {
                tc.setExecutionStatus(ExecutionStatus.NOT_EXECUTED);
            }
        });

        currentTestCases.clear();
        currentTestCases.addAll(testCases);

        return TestCaseResponse.builder()
                .testCases(testCases)
                .build();
    }

    public ScriptResponse generateScripts(List<TestCase> testCases) {
        log.info("Generating automation scripts for {} test cases", testCases.size());

        List<AutomationScript> scripts = new ArrayList<>();
        for (TestCase tc : testCases) {
            String scriptContent = openAiService.generateAutomationScript(tc);
            scripts.add(AutomationScript.builder()
                    .testCaseId(tc.getId())
                    .scenario(tc.getScenario())
                    .scriptContent(scriptContent)
                    .build());
        }

        currentScripts.clear();
        currentScripts.addAll(scripts);

        return ScriptResponse.builder().scripts(scripts).build();
    }

    public List<ExecutionResult> simulateExecution() {
        log.info("Simulating test execution for {} test cases", currentTestCases.size());

        List<ExecutionResult> results = new ArrayList<>();
        for (TestCase tc : currentTestCases) {
            ExecutionStatus status = random.nextInt(100) < 70 ? ExecutionStatus.PASS : ExecutionStatus.FAIL;
            tc.setExecutionStatus(status);
            results.add(ExecutionResult.builder()
                    .testCaseId(tc.getId())
                    .status(status)
                    .build());
        }

        return results;
    }

    public DashboardResponse getDashboard() {
        long passed = currentTestCases.stream()
                .filter(tc -> ExecutionStatus.PASS == tc.getExecutionStatus()).count();
        long failed = currentTestCases.stream()
                .filter(tc -> ExecutionStatus.FAIL == tc.getExecutionStatus()).count();
        long notExecuted = currentTestCases.stream()
                .filter(tc -> ExecutionStatus.NOT_EXECUTED == tc.getExecutionStatus()).count();

        DashboardStats stats = DashboardStats.builder()
                .totalTests(currentTestCases.size())
                .passedTests((int) passed)
                .failedTests((int) failed)
                .notExecuted((int) notExecuted)
                .build();

        return DashboardResponse.builder()
                .stats(stats)
                .testCases(new ArrayList<>(currentTestCases))
                .build();
    }

    public List<TestCase> getCurrentTestCases() {
        return new ArrayList<>(currentTestCases);
    }

    public List<AutomationScript> getCurrentScripts() {
        return new ArrayList<>(currentScripts);
    }
}
