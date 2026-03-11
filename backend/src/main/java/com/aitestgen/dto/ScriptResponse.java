package com.aitestgen.dto;

import com.aitestgen.model.AutomationScript;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScriptResponse {
    private List<AutomationScript> scripts;
}
