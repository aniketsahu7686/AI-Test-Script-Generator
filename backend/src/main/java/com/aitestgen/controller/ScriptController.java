package com.aitestgen.controller;

import com.aitestgen.dto.ScriptRequest;
import com.aitestgen.dto.ScriptResponse;
import com.aitestgen.model.AutomationScript;
import com.aitestgen.service.TestGeneratorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scripts")
@RequiredArgsConstructor
public class ScriptController {

    private final TestGeneratorService testGeneratorService;

    @PostMapping("/generate")
    public ResponseEntity<ScriptResponse> generateScripts(
            @Valid @RequestBody ScriptRequest request) {
        ScriptResponse response = testGeneratorService.generateScripts(request.getTestCases());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<AutomationScript>> getCurrentScripts() {
        return ResponseEntity.ok(testGeneratorService.getCurrentScripts());
    }

    @GetMapping("/download/{testCaseId}")
    public ResponseEntity<String> downloadScript(@PathVariable String testCaseId) {
        AutomationScript script = testGeneratorService.getCurrentScripts().stream()
                .filter(s -> s.getTestCaseId().equals(testCaseId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Script not found for: " + testCaseId));

        return ResponseEntity.ok()
                .header("Content-Disposition",
                        "attachment; filename=test_" + testCaseId.toLowerCase().replace(" ", "_") + ".py")
                .header("Content-Type", "text/x-python")
                .body(script.getScriptContent());
    }

    @GetMapping("/download-all")
    public ResponseEntity<String> downloadAllScripts() {
        List<AutomationScript> scripts = testGeneratorService.getCurrentScripts();
        StringBuilder combined = new StringBuilder();
        combined.append("# ==============================================\n");
        combined.append("# AI Generated Playwright Automation Scripts\n");
        combined.append("# ==============================================\n\n");

        for (AutomationScript script : scripts) {
            combined.append("# --- ").append(script.getTestCaseId())
                    .append(": ").append(script.getScenario()).append(" ---\n\n");
            combined.append(script.getScriptContent());
            combined.append("\n\n");
        }

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=automation_scripts.py")
                .header("Content-Type", "text/x-python")
                .body(combined.toString());
    }
}
