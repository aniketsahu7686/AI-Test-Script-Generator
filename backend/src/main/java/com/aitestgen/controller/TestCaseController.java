package com.aitestgen.controller;

import com.aitestgen.dto.TestCaseRequest;
import com.aitestgen.dto.TestCaseResponse;
import com.aitestgen.model.ExecutionResult;
import com.aitestgen.model.TestCase;
import com.aitestgen.service.TestGeneratorService;
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


}
