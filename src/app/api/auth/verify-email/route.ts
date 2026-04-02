import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAccessToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }

    const payload = verifyAccessToken(token);
    await prisma.user.update({
      where: { id: payload.userId },
      data: { emailVerified: true, emailVerifiedAt: new Date() },
    });

    return NextResponse.redirect(new URL("/dashboard?verified=true", request.url));
  } catch {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
  }
}
