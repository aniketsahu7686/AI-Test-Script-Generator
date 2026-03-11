package com.aitestgen.controller;

import com.aitestgen.model.TestCase;
import com.aitestgen.service.DownloadService;
import com.aitestgen.service.TestGeneratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/download/testcases")
@RequiredArgsConstructor
public class ExportController {

    private final DownloadService downloadService;
    private final TestGeneratorService testGeneratorService;

    @GetMapping("/docx")
    public ResponseEntity<byte[]> downloadDocx() {
        List<TestCase> testCases = getTestCasesOrThrow();
        byte[] docxBytes = downloadService.exportToDocx(testCases);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=test-cases.docx")
                .contentType(MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"))
                .body(docxBytes);
    }

    @GetMapping("/pdf")
    public ResponseEntity<byte[]> downloadPdf() {
        List<TestCase> testCases = getTestCasesOrThrow();
        byte[] pdfBytes = downloadService.exportToPdf(testCases);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=test-cases.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    @GetMapping("/json")
    public ResponseEntity<byte[]> downloadJson() {
        List<TestCase> testCases = getTestCasesOrThrow();
        byte[] jsonBytes = downloadService.exportToJson(testCases);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=test-cases.json")
                .contentType(MediaType.APPLICATION_JSON)
                .body(jsonBytes);
    }

    private List<TestCase> getTestCasesOrThrow() {
        List<TestCase> testCases = testGeneratorService.getCurrentTestCases();
        if (testCases.isEmpty()) {
            throw new RuntimeException("No test cases available. Generate test cases first.");
        }
        return testCases;
    }
}
