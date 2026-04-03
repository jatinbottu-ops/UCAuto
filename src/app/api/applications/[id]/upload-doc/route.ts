import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-middleware";
import { uploadFile } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await params;

    const application = await prisma.application.findFirst({
      where: { id, userId: auth.payload.userId },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (application.status !== "draft") {
      return NextResponse.json({ error: "Cannot modify a submitted application" }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const docType = formData.get("docType") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!["license", "insurance"].includes(docType ?? "")) {
      return NextResponse.json({ error: "Invalid docType" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Please upload an image or PDF." }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "jpg";
    const key = `applications/${id}/${docType}-${Date.now()}.${ext}`;

    const docUrl = await uploadFile(buffer, key, file.type);

    return NextResponse.json({ key: docUrl });
  } catch (error) {
    console.error("Application doc upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
