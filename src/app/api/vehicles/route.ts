import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-middleware";

const vehicleSchema = z.object({
  slug: z.string(),
  make: z.string(),
  model: z.string(),
  year: z.number().int(),
  type: z.enum(["sedan", "suv", "minivan", "truck", "compact"]),
  status: z.enum(["available", "limited", "rented", "waitlist"]).optional(),
  weeklyPrice: z.number().int(),
  depositAmount: z.number().int(),
  transmission: z.enum(["automatic", "manual"]),
  fuelType: z.enum(["gas", "hybrid", "electric"]),
  seats: z.number().int(),
  mpgCity: z.number().int().optional(),
  mpgHighway: z.number().int().optional(),
  mileagePolicy: z.string(),
  minRentalDays: z.number().int().optional(),
  features: z.array(z.string()).optional(),
  uberEligible: z.boolean().optional(),
  lyftEligible: z.boolean().optional(),
  deliveryEligible: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const where: Record<string, unknown> = {};

    const status = searchParams.get("status");
    if (status) where.status = status;

    const type = searchParams.get("type");
    if (type) where.type = type;

    const fuelType = searchParams.get("fuelType");
    if (fuelType) where.fuelType = fuelType;

    if (searchParams.get("uberEligible") === "true") where.uberEligible = true;
    if (searchParams.get("lyftEligible") === "true") where.lyftEligible = true;
    if (searchParams.get("deliveryEligible") === "true") where.deliveryEligible = true;
    if (searchParams.get("featured") === "true") where.isFeatured = true;

    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice || maxPrice) {
      where.weeklyPrice = {
        ...(minPrice ? { gte: parseInt(minPrice) } : {}),
        ...(maxPrice ? { lte: parseInt(maxPrice) } : {}),
      };
    }

    const sort = searchParams.get("sort") || "weeklyPrice";
    const order = searchParams.get("order") || "asc";
    const limit = parseInt(searchParams.get("limit") || "50");

    const vehicles = await prisma.vehicle.findMany({
      where,
      orderBy: { [sort]: order },
      take: limit,
    });

    return NextResponse.json({ vehicles });
  } catch (error) {
    console.error("GET /api/vehicles error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const parsed = vehicleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }

    const vehicle = await prisma.vehicle.create({ data: parsed.data });
    return NextResponse.json({ vehicle }, { status: 201 });
  } catch (error) {
    console.error("POST /api/vehicles error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
