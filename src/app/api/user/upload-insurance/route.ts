import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-middleware";
import { uploadFile } from "@/lib/storage";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
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
    const key = `insurance/${auth.payload.userId}-${Date.now()}.${ext}`;

    const docKey = await uploadFile(buffer, key, file.type);

    await prisma.user.update({
      where: { id: auth.payload.userId },
      data: {
        insuranceDocumentKey: docKey,
        insuranceVerified: false,
        insuranceVerifiedAt: null,
      },
    });

    return NextResponse.json({ docKey });
  } catch (error) {
    console.error("Insurance upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
