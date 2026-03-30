// src/lib/utils/document-generator.ts
// Generates PDF and DOCX from structured resume content

import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont } from "pdf-lib";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "docx";
import { StructuredProfile } from "@/lib/ai/pipeline";

// ─── PDF Generation ───────────────────────────────────────────────────────────

export async function generatePDF(resume: StructuredProfile): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const PAGE_WIDTH = 612;
  const PAGE_HEIGHT = 792;
  const LEFT_MARGIN = 50;
  const RIGHT_MARGIN = PAGE_WIDTH - 50;
  const TOP_MARGIN = 40;
  const BOTTOM_MARGIN = 40;
  const LINE_HEIGHT = 14;

  let page: PDFPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - TOP_MARGIN;

  // Helper: add a new page and reset y
  const newPage = () => {
    page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    y = PAGE_HEIGHT - TOP_MARGIN;
  };

  // Helper: ensure there's room; if not, create a new page
  const ensureSpace = (needed: number) => {
    if (y - needed < BOTTOM_MARGIN) newPage();
  };

  const drawText = (
    text: string,
    x: number,
    yPos: number,
    font: PDFFont,
    size: number,
    color = rgb(0.1, 0.1, 0.1)
  ) => {
    page.drawText(text, { x, y: yPos, size, font, color, maxWidth: RIGHT_MARGIN - x });
  };

  const drawLine = (yPos: number) => {
    page.drawLine({
      start: { x: LEFT_MARGIN, y: yPos },
      end: { x: RIGHT_MARGIN, y: yPos },
      thickness: 0.5,
      color: rgb(0.7, 0.7, 0.7),
    });
  };

  const addSection = (title: string) => {
    ensureSpace(LINE_HEIGHT * 3);
    y -= 8;
    drawText(title.toUpperCase(), LEFT_MARGIN, y, boldFont, 9, rgb(0.2, 0.4, 0.8));
    y -= 4;
    drawLine(y);
    y -= LINE_HEIGHT;
  };

  // ── Header ──
  ensureSpace(40);
  drawText(resume.name, LEFT_MARGIN, y, boldFont, 22, rgb(0.05, 0.05, 0.15));
  y -= 20;

  const contactParts = [resume.email, resume.phone, resume.location, resume.linkedin].filter(Boolean);
  drawText(contactParts.join("  |  "), LEFT_MARGIN, y, regularFont, 8, rgb(0.4, 0.4, 0.4));
  y -= LINE_HEIGHT * 1.5;

  // ── Summary ──
  if (resume.summary) {
    addSection("Professional Summary");
    const summaryLines = wrapText(resume.summary, 95);
    for (const line of summaryLines) {
      ensureSpace(LINE_HEIGHT);
      drawText(line, LEFT_MARGIN, y, regularFont, 9);
      y -= LINE_HEIGHT;
    }
  }

  // ── Experience ──
  if (resume.experiences.length > 0) {
    addSection("Experience");
    for (const exp of resume.experiences) {
      ensureSpace(LINE_HEIGHT * 2);
      drawText(exp.title, LEFT_MARGIN, y, boldFont, 10);
      drawText(
        `${exp.startDate} – ${exp.endDate || "Present"}`,
        RIGHT_MARGIN - 80,
        y,
        regularFont,
        9,
        rgb(0.4, 0.4, 0.4)
      );
      y -= LINE_HEIGHT;
      drawText(exp.company, LEFT_MARGIN, y, regularFont, 9, rgb(0.3, 0.3, 0.3));
      y -= LINE_HEIGHT;

      for (const bullet of exp.bullets.slice(0, 5)) {
        const bulletLines = wrapText(`• ${bullet}`, 90);
        for (const line of bulletLines) {
          ensureSpace(LINE_HEIGHT);
          drawText(line, LEFT_MARGIN + 8, y, regularFont, 8.5);
          y -= LINE_HEIGHT - 1;
        }
      }
      y -= 4;
    }
  }

  // ── Projects ──
  if (resume.projects.length > 0) {
    addSection("Projects");
    for (const proj of resume.projects.slice(0, 3)) {
      ensureSpace(LINE_HEIGHT * 2);
      const projHeader = proj.url ? `${proj.name} — ${proj.url}` : proj.name;
      drawText(projHeader, LEFT_MARGIN, y, boldFont, 9.5);
      y -= LINE_HEIGHT;
      drawText(proj.techStack.join(", "), LEFT_MARGIN, y, regularFont, 8, rgb(0.4, 0.4, 0.4));
      y -= LINE_HEIGHT;
      for (const bullet of proj.bullets.slice(0, 3)) {
        const lines = wrapText(`• ${bullet}`, 92);
        for (const line of lines) {
          ensureSpace(LINE_HEIGHT);
          drawText(line, LEFT_MARGIN + 8, y, regularFont, 8.5);
          y -= LINE_HEIGHT - 1;
        }
      }
      y -= 4;
    }
  }

  // ── Skills ──
  if (resume.skills.length > 0) {
    addSection("Skills");
    for (const skillGroup of resume.skills) {
      const skillLine = `${skillGroup.category}: ${skillGroup.items.join(", ")}`;
      const lines = wrapText(skillLine, 90);
      ensureSpace(LINE_HEIGHT);
      drawText(lines[0], LEFT_MARGIN, y, regularFont, 9);
      y -= LINE_HEIGHT;
    }
  }

  // ── Education ──
  if (resume.education.length > 0) {
    addSection("Education");
    for (const edu of resume.education) {
      ensureSpace(LINE_HEIGHT * 2);
      drawText(`${edu.degree} in ${edu.field}`, LEFT_MARGIN, y, boldFont, 9.5);
      drawText(edu.year || "", RIGHT_MARGIN - 40, y, regularFont, 9, rgb(0.4, 0.4, 0.4));
      y -= LINE_HEIGHT;
      drawText(edu.institution, LEFT_MARGIN, y, regularFont, 9, rgb(0.3, 0.3, 0.3));
      y -= LINE_HEIGHT + 2;
    }
  }

  return pdfDoc.save();
}

// ─── DOCX Generation ──────────────────────────────────────────────────────────

export async function generateDOCX(resume: StructuredProfile): Promise<Buffer> {
  const children: Paragraph[] = [];

  // Header
  children.push(
    new Paragraph({
      children: [new TextRun({ text: resume.name, bold: true, size: 36, color: "0D1117" })],
      alignment: AlignmentType.CENTER,
    })
  );

  const contactLine = [resume.email, resume.phone, resume.location, resume.linkedin]
    .filter(Boolean)
    .join("  |  ");

  children.push(
    new Paragraph({
      children: [new TextRun({ text: contactLine, size: 18, color: "555555" })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    })
  );

  // Summary
  if (resume.summary) {
    children.push(sectionHeader("Professional Summary"));
    children.push(
      new Paragraph({
        children: [new TextRun({ text: resume.summary, size: 20 })],
        spacing: { after: 160 },
      })
    );
  }

  // Experience
  if (resume.experiences.length > 0) {
    children.push(sectionHeader("Experience"));
    for (const exp of resume.experiences) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.title, bold: true, size: 22 }),
            new TextRun({ text: `  |  ${exp.company}`, size: 20, color: "555555" }),
            new TextRun({
              text: `  ${exp.startDate} – ${exp.endDate || "Present"}`,
              size: 18,
              color: "888888",
            }),
          ],
          spacing: { before: 120 },
        })
      );
      for (const bullet of exp.bullets) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: `• ${bullet}`, size: 19 })],
            indent: { left: 360 },
          })
        );
      }
    }
  }

  // Projects
  if (resume.projects.length > 0) {
    children.push(sectionHeader("Projects"));
    for (const proj of resume.projects.slice(0, 4)) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: proj.name, bold: true, size: 22 }),
            new TextRun({ text: `  ${proj.techStack.join(", ")}`, size: 18, color: "555555" }),
          ],
          spacing: { before: 120 },
        })
      );
      for (const bullet of proj.bullets) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: `• ${bullet}`, size: 19 })],
            indent: { left: 360 },
          })
        );
      }
    }
  }

  // Skills
  if (resume.skills.length > 0) {
    children.push(sectionHeader("Skills"));
    for (const group of resume.skills) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${group.category}: `, bold: true, size: 19 }),
            new TextRun({ text: group.items.join(", "), size: 19 }),
          ],
        })
      );
    }
  }

  // Education
  if (resume.education.length > 0) {
    children.push(sectionHeader("Education"));
    for (const edu of resume.education) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${edu.degree} in ${edu.field}`, bold: true, size: 21 }),
            new TextRun({ text: `  —  ${edu.institution}  (${edu.year})`, size: 19 }),
          ],
          spacing: { before: 100 },
        })
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 900, right: 900 },
          },
        },
        children,
      },
    ],
  });

  return Packer.toBuffer(doc);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sectionHeader(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 20,
        color: "1A56DB",
      }),
    ],
    spacing: { before: 240, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "DDDDDD" } },
  });
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length <= maxChars) {
      current = (current + " " + word).trim();
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}
