package com.aitestgen.service;

import com.aitestgen.model.TestCase;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.xwpf.usermodel.*;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DownloadService {

    private final ObjectMapper objectMapper;

    /**
     * Exports test cases as a DOCX document using Apache POI.
     * Includes: Test Case ID, Scenario, Steps, Expected Result, Test Type.
     */
    public byte[] exportToDocx(List<TestCase> testCases) {
        try (XWPFDocument document = new XWPFDocument();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            // Title
            XWPFParagraph title = document.createParagraph();
            title.setAlignment(ParagraphAlignment.CENTER);
            XWPFRun titleRun = title.createRun();
            titleRun.setText("AI Generated Test Cases");
            titleRun.setBold(true);
            titleRun.setFontSize(18);
            titleRun.addBreak();

            // Subtitle with count
            XWPFParagraph subtitle = document.createParagraph();
            subtitle.setAlignment(ParagraphAlignment.CENTER);
            XWPFRun subRun = subtitle.createRun();
            subRun.setText("Total Test Cases: " + testCases.size());
            subRun.setFontSize(11);
            subRun.setColor("666666");
            subRun.addBreak();

            // Table
            XWPFTable table = document.createTable(testCases.size() + 1, 5);
            table.setWidth("100%");

            // Header row
            setDocxCell(table.getRow(0).getCell(0), "Test Case ID", true);
            setDocxCell(table.getRow(0).getCell(1), "Scenario", true);
            setDocxCell(table.getRow(0).getCell(2), "Steps", true);
            setDocxCell(table.getRow(0).getCell(3), "Expected Result", true);
            setDocxCell(table.getRow(0).getCell(4), "Test Type", true);

            // Data rows
            for (int i = 0; i < testCases.size(); i++) {
                TestCase tc = testCases.get(i);
                XWPFTableRow row = table.getRow(i + 1);
                setDocxCell(row.getCell(0), tc.getId(), false);
                setDocxCell(row.getCell(1), tc.getScenario(), false);
                setDocxCell(row.getCell(2), formatSteps(tc.getSteps()), false);
                setDocxCell(row.getCell(3), tc.getExpectedResult(), false);
                setDocxCell(row.getCell(4), tc.getTestType() != null ? tc.getTestType().name() : "", false);
            }

            document.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Failed to generate DOCX: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate DOCX file");
        }
    }

    /**
     * Exports test cases as a PDF document using OpenPDF.
     * Includes: Test Case ID, Scenario, Steps, Expected Result, Test Type.
     */
    public byte[] exportToPdf(List<TestCase> testCases) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(document, out);
            document.open();

            // Title
            Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
            Paragraph title = new Paragraph("AI Generated Test Cases", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(5);
            document.add(title);

            // Subtitle
            Font subtitleFont = new Font(Font.HELVETICA, 11, Font.NORMAL, Color.GRAY);
            Paragraph subtitle = new Paragraph("Total Test Cases: " + testCases.size(), subtitleFont);
            subtitle.setAlignment(Element.ALIGN_CENTER);
            subtitle.setSpacingAfter(20);
            document.add(subtitle);

            // Table
            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{1f, 2.5f, 3f, 2.5f, 1.2f});

            Font headerFont = new Font(Font.HELVETICA, 10, Font.BOLD, Color.WHITE);
            Font cellFont = new Font(Font.HELVETICA, 9);

            // Headers
            addPdfHeaderCell(table, "Test Case ID", headerFont);
            addPdfHeaderCell(table, "Scenario", headerFont);
            addPdfHeaderCell(table, "Steps", headerFont);
            addPdfHeaderCell(table, "Expected Result", headerFont);
            addPdfHeaderCell(table, "Test Type", headerFont);

            // Data
            for (TestCase tc : testCases) {
                addPdfCell(table, tc.getId(), cellFont);
                addPdfCell(table, tc.getScenario(), cellFont);
                addPdfCell(table, formatSteps(tc.getSteps()), cellFont);
                addPdfCell(table, tc.getExpectedResult(), cellFont);
                addPdfCell(table, tc.getTestType() != null ? tc.getTestType().name() : "", cellFont);
            }

            document.add(table);
            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Failed to generate PDF: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate PDF file");
        }
    }

    /**
     * Exports test cases as pretty-printed JSON bytes.
     * Returns the raw structured data with all fields.
     */
    public byte[] exportToJson(List<TestCase> testCases) {
        try {
            String json = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(testCases);
            return json.getBytes(StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.error("Failed to generate JSON: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate JSON file");
        }
    }

    private String formatSteps(List<String> steps) {
        if (steps == null || steps.isEmpty()) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < steps.size(); i++) {
            sb.append(i + 1).append(". ").append(steps.get(i));
            if (i < steps.size() - 1) {
                sb.append("\n");
            }
        }
        return sb.toString();
    }

    private void setDocxCell(XWPFTableCell cell, String text, boolean bold) {
        cell.removeParagraph(0);
        XWPFParagraph para = cell.addParagraph();
        XWPFRun run = para.createRun();
        run.setText(text != null ? text : "");
        run.setBold(bold);
        run.setFontSize(bold ? 10 : 9);
    }

    private void addPdfHeaderCell(PdfPTable table, String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBackgroundColor(new Color(44, 62, 80));
        cell.setPadding(6);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(cell);
    }

    private void addPdfCell(PdfPTable table, String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text != null ? text : "", font));
        cell.setPadding(5);
        table.addCell(cell);
    }
}
