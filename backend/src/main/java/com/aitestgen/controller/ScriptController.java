package com.aitestgen.controller;

import com.aitestgen.dto.ScriptRequest;
import com.aitestgen.dto.ScriptResponse;
import com.aitestgen.model.AutomationScript;
import com.aitestgen.service.AutomationScriptService;
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
    private final AutomationScriptService automationScriptService;

    @PostMapping("/generate")
    public ResponseEntity<ScriptResponse> generateScripts(
            @Valid @RequestBody ScriptRequest request) {
        ScriptResponse response = testGeneratorService.generateScripts(request.getTestCases());
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/scripts/generate-scripts
     * Generates Playwright Python scripts via AutomationScriptService.
     */
    @PostMapping("/generate-scripts")
    public ResponseEntity<ScriptResponse> generateAutomationScripts(
            @Valid @RequestBody ScriptRequest request) {
        List<AutomationScript> scripts = automationScriptService.generateScripts(request.getTestCases());
        return ResponseEntity.ok(ScriptResponse.builder().scripts(scripts).build());
    }

    @GetMapping
    public ResponseEntity<List<AutomationScript>> getCurrentScripts() {
        return ResponseEntity.ok(testGeneratorService.getCurrentScripts());
    }

    @GetMapping("/download/{testCaseId}")
    public ResponseEntity<String> downloadScript(@PathVariable String testCaseId) {
        AutomationScript script = automationScriptService.getGeneratedScripts().stream()
                .filter(s -> s.getTestCaseId().equals(testCaseId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Script not found for: " + testCaseId));

        return ResponseEntity.ok()
                .header("Content-Disposition",
                        "attachment; filename=test_" + testCaseId.toLowerCase().replace(" ", "_") + ".py")
                .header("Content-Type", "text/x-python")
                .body(script.getScriptContent());
    }

    /**
     * GET /api/scripts/download-all
     * Downloads all scripts as a combined .py file.
     */
    @GetMapping("/download-all")
    public ResponseEntity<String> downloadAllScripts() {
        String combined = automationScriptService.buildCombinedPythonFile();
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=automation_scripts.py")
                .header("Content-Type", "text/x-python")
                .body(combined);
    }

    /**
     * GET /api/scripts/download/scripts/python
     * Downloads all generated scripts as a single .py file.
     */
    @GetMapping("/download/scripts/python")
    public ResponseEntity<String> downloadScriptsPython() {
        String combined = automationScriptService.buildCombinedPythonFile();
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=playwright_scripts.py")
                .header("Content-Type", "text/x-python")
                .body(combined);
    }
}
