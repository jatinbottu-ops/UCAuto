"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, Lock } from "lucide-react";

interface Application {
  id: string;
  status: string;
  vehicle: {
    make: string; model: string; year: number;
    weeklyPrice: number; depositAmount: number;
    images: string[];
  };
}

export default function CheckoutPage({ params }: { params: Promise<{ applicationId: string }> }) {
  const { applicationId } = use(params);
  const { token } = useAuth();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<"summary" | "payment" | "success">("summary");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  });

  useEffect(() => {
    if (!token) return;
    fetch(`/api/applications/${applicationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { setApplication(data.application); setLoading(false); })
      .catch(() => setLoading(false));
  }, [applicationId, token]);

  const handlePayment = async () => {
    if (!token) return;
    setProcessing(true);

    try {
      // Create payment intent
      const res = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ applicationId, type: "deposit" }),
      });

      if (res.ok) {
        // In production, use Stripe Elements to handle payment
        // For demo, simulate success
        await new Promise((r) => setTimeout(r, 2000));
        setStep("success");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-[#64748B]">Loading...</div>;
  }

  if (!application) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-[#64748B] mb-4">Application not found</p>
        <Link href="/dashboard" className="text-[#E87722] font-medium">Go to Dashboard →</Link>
      </div>
    );
  }

  const weekly = (application.vehicle.weeklyPrice / 100).toFixed(0);
  const deposit = (application.vehicle.depositAmount / 100).toFixed(0);
  const total = ((application.vehicle.weeklyPrice + application.vehicle.depositAmount) / 100).toFixed(0);

  if (step === "success") {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 max-w-md w-full text-center shadow-lg">
          <div className="w-16 h-16 rounded-full bg-[#ECFDF5] flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-[#1B7A3E]" />
          </div>
          <h2 className="text-2xl font-bold text-[#1E293B] mb-2">Payment Successful!</h2>
          <p className="text-[#64748B] mb-6">
            Your payment for the {application.vehicle.year} {application.vehicle.make}{" "}
            {application.vehicle.model} has been processed. We&apos;ll be in touch shortly.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-8 py-3 bg-[#E87722] text-white font-bold rounded-lg hover:bg-[#C45F10] transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Header */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-[#1A3A6B]">U&C Auto Connect</Link>
          <div className="flex items-center gap-2 text-sm text-[#64748B]">
            <Lock className="h-4 w-4" />
            Secured by Stripe
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order summary */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
            <h2 className="font-bold text-[#1A3A6B] text-lg mb-5">Order Summary</h2>

            <div className="bg-[#F7F9FC] rounded-xl overflow-hidden mb-5">
              {application.vehicle.images && application.vehicle.images.length > 0 && (
                <div className="relative w-full h-40 bg-[#E8F0FE]">
                  <Image
                    src={application.vehicle.images[0]}
                    alt={`${application.vehicle.year} ${application.vehicle.make} ${application.vehicle.model}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              )}
              <div className="p-5">
                <h3 className="font-semibold text-[#1E293B]">
                  {application.vehicle.year} {application.vehicle.make} {application.vehicle.model}
                </h3>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-[#64748B]">First week&apos;s rental</span>
                <span className="font-medium text-[#1E293B]">${weekly}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#64748B]">Refundable deposit</span>
                <span className="font-medium text-[#1E293B]">${deposit}</span>
              </div>
              <div className="border-t border-[#E2E8F0] pt-3 flex justify-between">
                <span className="font-bold text-[#1E293B]">Total due today</span>
                <span className="font-bold text-[#E87722] text-lg">${total}</span>
              </div>
            </div>

            <div className="bg-[#ECFDF5] rounded-lg p-3 text-sm text-[#1B7A3E]">
              Deposit of ${deposit} is fully refundable at end of rental period
            </div>
          </div>

          {/* Payment form */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
            <h2 className="font-bold text-[#1A3A6B] text-lg mb-5">Payment Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-1">Name on Card</label>
                <input
                  type="text"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3A6B]"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardDetails.number}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                    const formatted = v.replace(/(.{4})/g, "$1 ").trim();
                    setCardDetails({ ...cardDetails, number: formatted });
                  }}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3A6B]"
                  placeholder="4242 4242 4242 4242"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-1">Expiry</label>
                  <input
                    type="text"
                    value={cardDetails.expiry}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                      const formatted = v.length > 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v;
                      setCardDetails({ ...cardDetails, expiry: formatted });
                    }}
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3A6B]"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-1">CVC</label>
                  <input
                    type="text"
                    value={cardDetails.cvc}
                    onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3A6B]"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={processing}
              className="w-full mt-6 py-4 bg-[#E87722] text-white font-bold rounded-lg hover:bg-[#C45F10] transition-colors disabled:opacity-50 text-base"
            >
              {processing ? "Processing..." : `Complete Payment — $${total}`}
            </button>

            <div className="flex items-center justify-center gap-2 mt-4 text-[#64748B] text-sm">
              <Lock className="h-4 w-4" />
              <span>Secured by Stripe · 256-bit SSL</span>
            </div>

            <div className="mt-6 border-t border-[#E2E8F0] pt-5">
              <p className="text-sm font-medium text-[#1E293B] mb-2">Other Payment Options</p>
              <p className="text-sm text-[#64748B]">
                Prefer Venmo? Contact us at{" "}
                <a href="mailto:payments@ucautoconnect.com" className="text-[#E87722] hover:underline">
                  payments@ucautoconnect.com
                </a>{" "}
                to arrange an alternative payment method.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
