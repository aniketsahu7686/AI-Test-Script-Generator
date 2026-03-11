package com.aitestgen.dto;

import com.aitestgen.model.TestCase;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScriptRequest {

    @NotEmpty(message = "Test cases list must not be empty")
    private List<TestCase> testCases;
}
