import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-middleware";

export const dynamic = 'force-dynamic';

const schema = z.object({
  idVerified: z.boolean().optional(),
  insuranceVerified: z.boolean().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { idVerified, insuranceVerified } = parsed.data;

    const updateData: Record<string, unknown> = {};
    if (idVerified !== undefined) {
      updateData.idVerified = idVerified;
      updateData.idVerifiedAt = idVerified ? new Date() : null;
    }
    if (insuranceVerified !== undefined) {
      updateData.insuranceVerified = insuranceVerified;
      updateData.insuranceVerifiedAt = insuranceVerified ? new Date() : null;
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        idDocumentKey: true,
        idVerified: true,
        idVerifiedAt: true,
        insuranceDocumentKey: true,
        insuranceVerified: true,
        insuranceVerifiedAt: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("PATCH /api/admin/users/[id]/verify error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
