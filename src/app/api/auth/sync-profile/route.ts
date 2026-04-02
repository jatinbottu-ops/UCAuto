import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { stackServerApp } from "@/stack";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const stackUser = await stackServerApp.getUser({ or: "return-null" });
  if (!stackUser || !stackUser.primaryEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { firstName, lastName, phone } = parsed.data;

  try {
    const user = await prisma.user.upsert({
      where: { stackAuthId: stackUser.id },
      create: {
        stackAuthId: stackUser.id,
        email: stackUser.primaryEmail,
        firstName,
        lastName,
        phone: phone ?? null,
        role: "customer",
      },
      update: {},
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("sync-profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
