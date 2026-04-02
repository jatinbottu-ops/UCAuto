import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle, Car, FileText, Clock, Key, Shield, Zap } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Car,
    title: "Browse & Choose Your Vehicle",
    description:
      "Start by browsing our fleet of rideshare-ready vehicles. Each listing shows availability, weekly price, platform eligibility (Uber, Lyft, delivery), and full specs. Filter by vehicle type, fuel type, and platform to find your perfect match.",
    details: [
      "View real-time availability",
      "Compare weekly rates and deposits",
      "See which platforms each car qualifies for",
      "Read full vehicle specs and features",
    ],
  },
  {
    number: "02",
    icon: FileText,
    title: "Submit Your Application",
    description:
      "Complete our simple online application in minutes. No need to visit our office. Upload your documents directly through our secure portal.",
    details: [
      "Create your account online",
      "Fill in personal and contact information",
      "Upload driver's license",
      "Upload proof of insurance",
      "Review and submit",
    ],
  },
  {
    number: "03",
    icon: Clock,
    title: "Wait for Approval",
    description:
      "Our team reviews your application within 1-2 business days. We verify your license, check your driving record, and confirm platform eligibility. You'll receive an email notification with your decision.",
    details: [
      "License verification",
      "Driving record check",
      "Background screening",
      "Platform account confirmation",
    ],
  },
  {
    number: "04",
    icon: Key,
    title: "Complete Payment & Pick Up",
    description:
      "Once approved, you'll receive a payment link. Pay your deposit and first week's rental fee securely online via Stripe. Then schedule your pickup time and you're ready to start earning!",
    details: [
      "Secure Stripe payment",
      "Pay deposit + first week",
      "Schedule convenient pickup",
      "Start driving immediately",
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <div className="pt-16 lg:pt-20">
        {/* Header */}
        <section className="bg-[#1A3A6B] py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4">
              How It Works
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Getting a rental car for rideshare or delivery driving in Atlanta is simple with U&amp;C Auto Connect. Here&apos;s the complete process.
            </p>
          </div>
        </section>

        {/* Steps */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-16">
              {steps.map((step, index) => (
                <div key={step.number} className="relative">
                  {index < steps.length - 1 && (
                    <div className="absolute left-10 top-24 bottom-0 w-0.5 bg-[#E2E8F0] hidden lg:block" />
                  )}
                  <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-full bg-[#1A3A6B] flex items-center justify-center shadow-lg">
                        <span className="text-white text-2xl font-bold">{step.number}</span>
                      </div>
                    </div>
                    <div className="flex-1 pb-8">
                      <h2 className="text-2xl font-bold text-[#1A3A6B] mb-3">{step.title}</h2>
                      <p className="text-[#64748B] leading-relaxed mb-6">{step.description}</p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {step.details.map((detail) => (
                          <div key={detail} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-[#1B7A3E] flex-shrink-0" />
                            <span className="text-[#1E293B] text-sm">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust section */}
        <section className="py-16 bg-[#F7F9FC]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1A3A6B]">
                Why Drivers Choose Us
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Zap, title: "Fast Approval", desc: "1-2 business day review. No waiting weeks to get on the road." },
                { icon: Shield, title: "No Hidden Fees", desc: "Transparent weekly pricing. The price you see is what you pay." },
                { icon: Car, title: "Rideshare-Ready", desc: "All vehicles meet Uber and Lyft vehicle requirements." },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-xl p-6 border border-[#E2E8F0]">
                  <item.icon className="h-8 w-8 text-[#E87722] mb-4" />
                  <h3 className="font-bold text-[#1E293B] mb-2">{item.title}</h3>
                  <p className="text-[#64748B] text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-[#1A3A6B]">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
            <p className="text-white/80 mb-8">Browse our available vehicles and submit your application today.</p>
            <Link
              href="/cars"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#E87722] text-white font-bold rounded-lg hover:bg-[#C45F10] transition-colors"
            >
              Browse Cars
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
