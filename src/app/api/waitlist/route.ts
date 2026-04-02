import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendWaitlistJoinedEmail } from "@/lib/email";

const schema = z.object({
  vehicleId: z.string().uuid(),
  name: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  userId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { vehicleId, name, email, phone, userId } = parsed.data;

    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    // Check if already in waitlist
    const existing = await prisma.waitlist.findFirst({
      where: { vehicleId, email },
    });
    if (existing) {
      return NextResponse.json({ waitlist: existing, position: existing.position });
    }

    const count = await prisma.waitlist.count({ where: { vehicleId } });
    const position = count + 1;

    const entry = await prisma.waitlist.create({
      data: { vehicleId, name, email, phone, userId, position },
    });

    try {
      await sendWaitlistJoinedEmail(
        email,
        name || email,
        `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
        position
      );
    } catch (emailErr) {
      console.error("Waitlist email failed:", emailErr);
    }

    return NextResponse.json({ waitlist: entry, position }, { status: 201 });
  } catch (error) {
    console.error("POST /api/waitlist error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get("vehicleId");

    const where = vehicleId ? { vehicleId } : {};
    const entries = await prisma.waitlist.findMany({
      where,
      orderBy: { position: "asc" },
      include: { vehicle: true },
    });

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("GET /api/waitlist error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
