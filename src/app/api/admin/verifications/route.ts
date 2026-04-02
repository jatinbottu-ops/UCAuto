import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-middleware";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter"); // "pending" | "verified" | "all"

    const whereConditions = filter === "pending"
      ? {
          OR: [
            { idDocumentKey: { not: null }, idVerified: false },
            { insuranceDocumentKey: { not: null }, insuranceVerified: false },
          ],
        }
      : filter === "verified"
      ? { idVerified: true, insuranceVerified: true }
      : {
          OR: [
            { idDocumentKey: { not: null } },
            { insuranceDocumentKey: { not: null } },
          ],
        };

    const users = await prisma.user.findMany({
      where: whereConditions,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        createdAt: true,
        idDocumentKey: true,
        idVerified: true,
        idVerifiedAt: true,
        insuranceDocumentKey: true,
        insuranceVerified: true,
        insuranceVerifiedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("GET /api/admin/verifications error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
