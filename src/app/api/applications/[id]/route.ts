import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-middleware";

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await params;
    const application = await prisma.application.findFirst({
      where: { id, userId: auth.payload.userId },
      include: { vehicle: true, payments: true },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.error("GET application error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await params;
    const body = await request.json();

    const application = await prisma.application.findFirst({
      where: { id, userId: auth.payload.userId },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (application.status !== "draft") {
      return NextResponse.json(
        { error: "Cannot modify a submitted application" },
        { status: 400 }
      );
    }

    const updated = await prisma.application.update({
      where: { id },
      data: {
        personalInfo: body.personalInfo,
        licenseDocKey: body.licenseDocKey,
        insuranceDocKey: body.insuranceDocKey,
      },
    });

    return NextResponse.json({ application: updated });
  } catch (error) {
    console.error("PATCH application error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
