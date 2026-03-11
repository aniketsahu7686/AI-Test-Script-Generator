package com.aitestgen.controller;

import com.aitestgen.model.TestCase;
import com.aitestgen.service.ExportService;
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
@RequestMapping("/api/export")
@RequiredArgsConstructor
public class ExportController {

    private final ExportService exportService;
    private final TestGeneratorService testGeneratorService;

    @GetMapping("/docx")
    public ResponseEntity<byte[]> exportDocx() {
        List<TestCase> testCases = testGeneratorService.getCurrentTestCases();
        if (testCases.isEmpty()) {
            throw new RuntimeException("No test cases available. Generate test cases first.");
        }

        byte[] docxBytes = exportService.exportToDocx(testCases);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=test-cases.docx")
                .contentType(MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"))
                .body(docxBytes);
    }

    @GetMapping("/pdf")
    public ResponseEntity<byte[]> exportPdf() {
        List<TestCase> testCases = testGeneratorService.getCurrentTestCases();
        if (testCases.isEmpty()) {
            throw new RuntimeException("No test cases available. Generate test cases first.");
        }

        byte[] pdfBytes = exportService.exportToPdf(testCases);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=test-cases.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
