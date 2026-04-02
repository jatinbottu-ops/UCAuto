"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Mail, Clock } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Please provide more detail"),
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    console.log("Contact form submitted:", data);
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <div className="pt-16 lg:pt-20">
        {/* Header */}
        <section className="bg-[#1A3A6B] py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold text-white mb-4">Contact Us</h1>
            <p className="text-white/80 text-lg">
              Have a question? We&apos;re here to help.
            </p>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-bold text-[#1A3A6B] mb-6">Get in Touch</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#EBF0F8] flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-[#1A3A6B]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1E293B]">Location</p>
                      <p className="text-[#64748B] text-sm">Atlanta, Georgia and surrounding areas</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#EBF0F8] flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-[#1A3A6B]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1E293B]">Email</p>
                      <a href="mailto:info@ucautoconnect.com" className="text-[#E87722] text-sm hover:underline">
                        info@ucautoconnect.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#EBF0F8] flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-[#1A3A6B]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1E293B]">Business Hours</p>
                      <p className="text-[#64748B] text-sm">Monday–Friday: 9am–6pm EST</p>
                      <p className="text-[#64748B] text-sm">Saturday: 10am–4pm EST</p>
                      <p className="text-[#64748B] text-sm">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-[#ECFDF5] flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">✓</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#1E293B] mb-2">Message Sent!</h3>
                    <p className="text-[#64748B]">
                      We&apos;ll get back to you within 1 business day.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                      {errors.name && (
                        <p className="mt-1 text-sm text-[#B91C1C]">{errors.name.message}</p>
                      )}
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
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-[#B91C1C]">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone" className="block text-sm font-medium text-[#1E293B] mb-1">
                        Phone (optional)
                      </Label>
                      <Input id="phone" {...register("phone")} placeholder="(404) 555-0100" />
                    </div>

                    <div>
                      <Label htmlFor="subject" className="block text-sm font-medium text-[#1E293B] mb-1">
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        {...register("subject")}
                        className={errors.subject ? "border-[#B91C1C]" : ""}
                        placeholder="Vehicle availability question"
                      />
                      {errors.subject && (
                        <p className="mt-1 text-sm text-[#B91C1C]">{errors.subject.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="message" className="block text-sm font-medium text-[#1E293B] mb-1">
                        Message
                      </Label>
                      <textarea
                        id="message"
                        {...register("message")}
                        rows={5}
                        className={`w-full px-3 py-2 border rounded-lg text-sm text-[#1E293B] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#1A3A6B] ${
                          errors.message ? "border-[#B91C1C]" : "border-[#E2E8F0]"
                        }`}
                        placeholder="Tell us how we can help..."
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-[#B91C1C]">{errors.message.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-[#E87722] text-white font-semibold rounded-lg hover:bg-[#C45F10] transition-colors disabled:opacity-50"
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
