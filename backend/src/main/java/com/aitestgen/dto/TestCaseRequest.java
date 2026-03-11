package com.aitestgen.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestCaseRequest {

    @NotBlank(message = "Requirement text must not be blank")
    @Size(min = 10, max = 5000, message = "Requirement text must be between 10 and 5000 characters")
    private String requirementText;
}
