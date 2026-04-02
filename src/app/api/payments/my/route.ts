import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-middleware";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const payments = await prisma.payment.findMany({
      where: { userId: auth.payload.userId },
      include: { application: { include: { vehicle: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ payments });
  } catch (error) {
    console.error("GET /api/payments/my error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
