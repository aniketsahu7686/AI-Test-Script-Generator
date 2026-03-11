package com.aitestgen.service;

import com.aitestgen.model.ExecutionResult;
import com.aitestgen.model.ExecutionStatus;
import com.aitestgen.model.TestCase;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class TestExecutionSimulatorService {

    private final SecureRandom random = new SecureRandom();

    /**
     * Simulates test execution by randomly assigning PASS or FAIL to each test case.
     *
     * @param testCases the test cases to simulate execution for
     * @return list of ExecutionResult with testCaseId and status
     */
    public List<ExecutionResult> simulateExecution(List<TestCase> testCases) {
        log.info("Simulating execution for {} test cases", testCases.size());

        List<ExecutionResult> results = new ArrayList<>();
        for (TestCase tc : testCases) {
            ExecutionStatus status = random.nextInt(100) < 70 ? ExecutionStatus.PASS : ExecutionStatus.FAIL;
            tc.setExecutionStatus(status);
            results.add(ExecutionResult.builder()
                    .testCaseId(tc.getId())
                    .status(status)
                    .build());
        }

        log.info("Simulation complete — PASS: {}, FAIL: {}",
                results.stream().filter(r -> r.getStatus() == ExecutionStatus.PASS).count(),
                results.stream().filter(r -> r.getStatus() == ExecutionStatus.FAIL).count());

        return results;
    }
}
