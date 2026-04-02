import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-middleware";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");

const schema = z.object({
  applicationId: z.string().uuid(),
  type: z.enum(["deposit", "reservation_fee", "first_period"]),
});

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { applicationId, type } = parsed.data;

    const application = await prisma.application.findFirst({
      where: { id: applicationId, userId: auth.payload.userId },
      include: { vehicle: true, user: true },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (application.status !== "approved" && application.status !== "payment_pending") {
      return NextResponse.json({ error: "Application not approved for payment" }, { status: 400 });
    }

    const amountCents =
      type === "deposit"
        ? application.vehicle.depositAmount
        : application.vehicle.weeklyPrice;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: "usd",
      metadata: {
        applicationId,
        userId: auth.payload.userId,
        type,
      },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        applicationId,
        userId: auth.payload.userId,
        type,
        amountCents,
        status: "pending",
        stripePaymentIntentId: paymentIntent.id,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Create payment intent error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
