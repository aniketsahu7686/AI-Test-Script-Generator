package com.aitestgen.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestCase {
    private String id;
    private String scenario;
    private List<String> steps;
    private String expectedResult;
    private TestType testType;
    private ExecutionStatus executionStatus;
}
