import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-middleware";

export const dynamic = 'force-dynamic';

const schema = z.object({
  status: z.enum(["available", "limited", "rented", "waitlist"]),
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
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: { status: parsed.data.status },
    });

    return NextResponse.json({ vehicle });
  } catch (error) {
    console.error("PATCH status error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
