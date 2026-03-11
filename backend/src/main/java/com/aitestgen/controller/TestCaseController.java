package com.aitestgen.controller;

import com.aitestgen.dto.TestCaseRequest;
import com.aitestgen.dto.TestCaseResponse;
import com.aitestgen.model.ExecutionResult;
import com.aitestgen.model.TestCase;
import com.aitestgen.service.TestGeneratorService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test-cases")
@RequiredArgsConstructor
public class TestCaseController {

    private final TestGeneratorService testGeneratorService;
    private final ObjectMapper objectMapper;

    @PostMapping("/generate")
    public ResponseEntity<TestCaseResponse> generateTestCases(
            @Valid @RequestBody TestCaseRequest request) {
        TestCaseResponse response = testGeneratorService.generateTestCases(request.getRequirementText());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<TestCase>> getCurrentTestCases() {
        return ResponseEntity.ok(testGeneratorService.getCurrentTestCases());
    }

    @PostMapping("/simulate")
    public ResponseEntity<List<ExecutionResult>> simulateExecution() {
        return ResponseEntity.ok(testGeneratorService.simulateExecution());
    }

    @GetMapping("/json")
    public ResponseEntity<String> downloadJson() {
        try {
            List<TestCase> testCases = testGeneratorService.getCurrentTestCases();
            String json = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(testCases);
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=test-cases.json")
                    .header("Content-Type", "application/json")
                    .body(json);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate JSON export");
        }
    }
}
