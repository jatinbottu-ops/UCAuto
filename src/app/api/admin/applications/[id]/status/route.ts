import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-middleware";
import {
  sendApplicationApprovedEmail,
  sendApplicationRejectedEmail,
} from "@/lib/email";

export const dynamic = 'force-dynamic';

const schema = z.object({
  status: z.enum(["submitted", "under_review", "approved", "payment_pending", "active", "waitlisted", "rejected"]),
  adminNotes: z.string().optional(),
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

    const { status, adminNotes } = parsed.data;

    const application = await prisma.application.update({
      where: { id },
      data: {
        status,
        adminNotes,
        reviewedAt: new Date(),
        reviewedById: auth.payload.userId,
      },
      include: {
        user: true,
        vehicle: true,
      },
    });

    try {
      const vehicleName = `${application.vehicle.year} ${application.vehicle.make} ${application.vehicle.model}`;
      if (status === "approved") {
        await sendApplicationApprovedEmail(
          application.user.email,
          application.user.firstName,
          vehicleName,
          application.id
        );
      } else if (status === "rejected") {
        await sendApplicationRejectedEmail(
          application.user.email,
          application.user.firstName,
          vehicleName
        );
      }
    } catch (emailErr) {
      console.error("Status change email failed:", emailErr);
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.error("Admin status change error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
