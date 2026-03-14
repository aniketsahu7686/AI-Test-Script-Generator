package com.aitestgen.controller;

import com.aitestgen.dto.ScriptRequest;
import com.aitestgen.dto.TestCaseRequest;
import com.aitestgen.dto.TestCaseResponse;
import com.aitestgen.model.ExecutionResult;
import com.aitestgen.model.TestCase;
import com.aitestgen.service.TestExecutionSimulatorService;
import com.aitestgen.service.TestGeneratorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "https://69b51ed---qa-testingproject.netlify.app")
@RequiredArgsConstructor
public class TestCaseController {

    private final TestGeneratorService testGeneratorService;
    private final TestExecutionSimulatorService testExecutionSimulatorService;

    @PostMapping("/generate")
    public ResponseEntity<TestCaseResponse> generateTestCases(
            @Valid @RequestBody TestCaseRequest request) {
        TestCaseResponse response = testGeneratorService.generateTestCases(request.getRequirement());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/test-cases")
    public ResponseEntity<List<TestCase>> getCurrentTestCases() {
        return ResponseEntity.ok(testGeneratorService.getCurrentTestCases());
    }

    @PostMapping("/test-cases/simulate")
    public ResponseEntity<List<TestCase>> simulateExecution() {
        testGeneratorService.simulateExecution();
        return ResponseEntity.ok(testGeneratorService.getCurrentTestCases());
    }

    /**
     * POST /api/test-cases/simulate-execution
     * Accepts a list of test cases and returns simulated execution results.
     */
    @PostMapping("/test-cases/simulate-execution")
    public ResponseEntity<List<ExecutionResult>> simulateExecutionWithInput(
            @Valid @RequestBody ScriptRequest request) {
        List<ExecutionResult> results = testExecutionSimulatorService.simulateExecution(request.getTestCases());
        return ResponseEntity.ok(results);
    }
}
