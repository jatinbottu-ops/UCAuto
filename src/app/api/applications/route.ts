import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-middleware";

export const dynamic = 'force-dynamic';

const createSchema = z.object({
  vehicleId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { vehicleId } = parsed.data;

    // Check vehicle exists
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    // Check for existing active application
    const existing = await prisma.application.findFirst({
      where: {
        userId: auth.payload.userId,
        vehicleId,
        status: { notIn: ["rejected"] },
      },
    });
    if (existing) {
      return NextResponse.json({ application: existing });
    }

    const application = await prisma.application.create({
      data: {
        userId: auth.payload.userId,
        vehicleId,
        status: "draft",
      },
      include: { vehicle: true },
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    console.error("POST /api/applications error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const applications = await prisma.application.findMany({
      where: { userId: auth.payload.userId },
      include: { vehicle: true, payments: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("GET /api/applications error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
