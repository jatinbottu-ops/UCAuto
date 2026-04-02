"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Bell, CheckCircle } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function WaitlistPage({ params }: { params: Promise<{ vehicleId: string }> }) {
  const { vehicleId } = use(params);
  const [submitted, setSubmitted] = useState(false);
  const [position, setPosition] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, vehicleId }),
      });
      const json = await res.json();
      if (res.ok) {
        setPosition(json.position);
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="pt-16 lg:pt-20 min-h-screen bg-[#F7F9FC]">
        <div className="max-w-lg mx-auto px-4 py-16">
          {submitted ? (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 text-center shadow-sm">
              <div className="w-16 h-16 rounded-full bg-[#ECFDF5] flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-[#1B7A3E]" />
              </div>
              <h2 className="text-2xl font-bold text-[#1E293B] mb-2">You&apos;re on the List!</h2>
              <p className="text-[#64748B] mb-2">
                You&apos;re position <strong className="text-[#1A3A6B]">#{position}</strong> in the waitlist.
              </p>
              <p className="text-[#64748B] text-sm mb-6">
                We&apos;ll notify you by email as soon as this vehicle becomes available.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/cars"
                  className="px-6 py-3 bg-[#E87722] text-white font-semibold rounded-lg hover:bg-[#C45F10] transition-colors text-center"
                >
                  Browse Other Cars
                </Link>
                <Link
                  href="/"
                  className="text-sm text-[#64748B] hover:text-[#1A3A6B] transition-colors text-center"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 shadow-sm">
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-full bg-[#EBF0F8] flex items-center justify-center mx-auto mb-3">
                  <Bell className="h-7 w-7 text-[#1A3A6B]" />
                </div>
                <h1 className="text-2xl font-bold text-[#1A3A6B]">Join the Waitlist</h1>
                <p className="text-[#64748B] mt-2 text-sm">
                  This vehicle isn&apos;t available right now. Get notified when it opens up.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="block text-sm font-medium text-[#1E293B] mb-1">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    className={errors.name ? "border-[#B91C1C]" : ""}
                    placeholder="John Smith"
                  />
                  {errors.name && <p className="text-xs text-[#B91C1C] mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="email" className="block text-sm font-medium text-[#1E293B] mb-1">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    className={errors.email ? "border-[#B91C1C]" : ""}
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="text-xs text-[#B91C1C] mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <Label htmlFor="phone" className="block text-sm font-medium text-[#1E293B] mb-1">
                    Phone (optional)
                  </Label>
                  <Input id="phone" {...register("phone")} placeholder="(404) 555-0100" />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#E87722] text-white font-bold rounded-lg hover:bg-[#C45F10] transition-colors disabled:opacity-50 mt-2"
                >
                  {loading ? "Adding to waitlist..." : "Join Waitlist"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
