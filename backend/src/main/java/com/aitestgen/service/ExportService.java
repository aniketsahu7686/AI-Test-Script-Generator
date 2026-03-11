package com.aitestgen.service;

import com.aitestgen.model.TestCase;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.xwpf.usermodel.*;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
@Slf4j
public class ExportService {

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
                setDocxCell(row.getCell(2), String.join("\n", tc.getSteps()), false);
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

    public byte[] exportToPdf(List<TestCase> testCases) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(document, out);
            document.open();

            // Title
            Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
            Paragraph title = new Paragraph("AI Generated Test Cases", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

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
                addPdfCell(table, String.join("\n", tc.getSteps()), cellFont);
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
