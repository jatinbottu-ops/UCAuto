import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-middleware";

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
    const filename = `${auth.payload.userId}-${Date.now()}.${ext}`;
    const dir = join(process.cwd(), "public", "uploads", "ids");
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, filename), buffer);

    const docKey = `/uploads/ids/${filename}`;

    await prisma.user.update({
      where: { id: auth.payload.userId },
      data: {
        idDocumentKey: docKey,
        idVerified: false,
        idVerifiedAt: null,
      },
    });

    return NextResponse.json({ docKey });
  } catch (error) {
    console.error("ID upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
