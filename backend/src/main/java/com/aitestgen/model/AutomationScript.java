package com.aitestgen.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AutomationScript {
    private String testCaseId;
    private String scenario;
    private String scriptContent;
}
