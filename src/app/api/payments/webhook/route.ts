import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";
import { sendPaymentConfirmedEmail } from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || "whsec_placeholder"
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    try {
      const payment = await prisma.payment.findFirst({
        where: { stripePaymentIntentId: paymentIntent.id },
        include: {
          user: true,
          application: { include: { vehicle: true } },
        },
      });

      if (payment) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "succeeded",
            paidAt: new Date(),
            stripeChargeId: paymentIntent.latest_charge as string,
          },
        });

        await prisma.application.update({
          where: { id: payment.applicationId },
          data: { status: "active" },
        });

        try {
          await sendPaymentConfirmedEmail(
            payment.user.email,
            payment.user.firstName,
            `${payment.application.vehicle.year} ${payment.application.vehicle.make} ${payment.application.vehicle.model}`,
            payment.amountCents
          );
        } catch (emailErr) {
          console.error("Payment email failed:", emailErr);
        }
      }
    } catch (dbErr) {
      console.error("DB update after payment succeeded:", dbErr);
    }
  }

  return NextResponse.json({ received: true });
}
