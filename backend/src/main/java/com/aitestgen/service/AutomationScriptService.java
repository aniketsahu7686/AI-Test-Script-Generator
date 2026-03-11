package com.aitestgen.service;

import com.aitestgen.model.AutomationScript;
import com.aitestgen.model.TestCase;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
@RequiredArgsConstructor
@Slf4j
public class AutomationScriptService {

    private final OpenAiService openAiService;
    private final List<AutomationScript> generatedScripts = new CopyOnWriteArrayList<>();

    /**
     * Generates Playwright Python automation scripts for each test case
     * by delegating to OpenAiService.
     */
    public List<AutomationScript> generateScripts(List<TestCase> testCases) {
        log.info("Generating Playwright automation scripts for {} test cases", testCases.size());

        List<AutomationScript> scripts = new ArrayList<>();
        for (TestCase tc : testCases) {
            String scriptContent;
            try {
                scriptContent = openAiService.generateAutomationScript(tc);
            } catch (Exception e) {
                log.warn("AI script generation failed for {}, using placeholder: {}", tc.getId(), e.getMessage());
                scriptContent = generateFallbackScript(tc);
            }
            scripts.add(AutomationScript.builder()
                    .testCaseId(tc.getId())
                    .scenario(tc.getScenario())
                    .scriptContent(scriptContent)
                    .build());
        }

        generatedScripts.clear();
        generatedScripts.addAll(scripts);

        log.info("Successfully generated {} automation scripts", scripts.size());
        return scripts;
    }

    /**
     * Builds a combined Python file containing all generated scripts,
     * separated by comment headers.
     */
    public String buildCombinedPythonFile() {
        StringBuilder combined = new StringBuilder();
        combined.append("# ==============================================\n");
        combined.append("# AI Generated Playwright Automation Scripts\n");
        combined.append("# ==============================================\n\n");

        for (AutomationScript script : generatedScripts) {
            combined.append("# --- ").append(script.getTestCaseId())
                    .append(": ").append(script.getScenario()).append(" ---\n\n");
            combined.append(script.getScriptContent());
            combined.append("\n\n");
        }

        return combined.toString();
    }

    public List<AutomationScript> getGeneratedScripts() {
        return new ArrayList<>(generatedScripts);
    }

    private String generateFallbackScript(TestCase tc) {
        return String.format("""
                from playwright.sync_api import sync_playwright

                def test_%s():
                    \"\"\"%s\"\"\"
                    with sync_playwright() as p:
                        browser = p.chromium.launch(headless=True)
                        page = browser.new_page()
                        page.goto("https://example.com")
                        # TODO: Implement test steps
                        # Expected: %s
                        browser.close()

                if __name__ == "__main__":
                    test_%s()
                """,
                tc.getId().toLowerCase().replace("-", "_"),
                tc.getScenario(),
                tc.getExpectedResult(),
                tc.getId().toLowerCase().replace("-", "_"));
    }
}
