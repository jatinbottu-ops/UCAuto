import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-middleware";
import { sendApplicationSubmittedEmail } from "@/lib/email";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await params;
    const application = await prisma.application.findFirst({
      where: { id, userId: auth.payload.userId },
      include: { vehicle: true, user: true },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (application.status !== "draft") {
      return NextResponse.json({ error: "Application already submitted" }, { status: 400 });
    }

    if (!application.licenseDocKey || !application.insuranceDocKey || !application.personalInfo) {
      return NextResponse.json(
        { error: "Please complete all required fields before submitting" },
        { status: 400 }
      );
    }

    const updated = await prisma.application.update({
      where: { id },
      data: {
        status: "submitted",
        submittedAt: new Date(),
      },
    });

    try {
      await sendApplicationSubmittedEmail(
        application.user.email,
        application.user.firstName,
        `${application.vehicle.year} ${application.vehicle.make} ${application.vehicle.model}`
      );
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
    }

    return NextResponse.json({ application: updated });
  } catch (error) {
    console.error("Submit application error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
