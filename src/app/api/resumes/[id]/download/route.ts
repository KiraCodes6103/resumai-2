// src/app/api/resumes/[id]/download/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generatePDF, generateDOCX } from "@/lib/utils/document-generator";
import { StructuredProfile } from "@/lib/ai/pipeline";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const resume = await prisma.resume.findFirst({
    where: { id: params.id, userId: user.id },
    include: { jobApplication: true },
  });

  if (!resume) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

  const format = req.nextUrl.searchParams.get("format") || "pdf";
  const content = resume.content as unknown as StructuredProfile;
  const company = resume.jobApplication.company || "Company";
  const filename = `Resume_${content.name?.replace(/\s/g, "_")}_${company}_v${resume.variantNumber}`;

  if (format === "pdf") {
    const pdfBytes = await generatePDF(content);
    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}.pdf"`,
      },
    });
  }

  if (format === "docx") {
    const docxBuffer = await generateDOCX(content);
    return new NextResponse(docxBuffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}.docx"`,
      },
    });
  }

  return NextResponse.json({ error: "Invalid format. Use ?format=pdf or ?format=docx" }, { status: 400 });
}
