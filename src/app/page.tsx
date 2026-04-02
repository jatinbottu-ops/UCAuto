import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { HeroVehicleCards } from "@/components/vehicles/HeroVehicleCards";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, FileText, CheckCircle, Car } from "lucide-react";

const howItWorksSteps = [
  {
    number: 1,
    icon: Search,
    title: "Browse Vehicles",
    description: "Filter by type, eligibility, and availability to find your car.",
  },
  {
    number: 2,
    icon: FileText,
    title: "Submit Application",
    description: "Upload your license and insurance. Takes under 5 minutes.",
  },
  {
    number: 3,
    icon: CheckCircle,
    title: "Get Approved",
    description: "We review your documents and notify you within 24 hours.",
  },
  {
    number: 4,
    icon: Car,
    title: "Start Driving",
    description: "Pay weekly. No long-term lease. Drive for Uber, Lyft, or delivery.",
  },
];

const faqs = [
  {
    question: "What documents do I need to rent?",
    answer:
      "You need a valid driver's license and proof of current auto insurance. Both can be uploaded directly through our secure online application.",
  },
  {
    question: "How fast is the approval process?",
    answer:
      "Most applications are reviewed within 24 hours. You'll receive an email notification as soon as your status changes.",
  },
  {
    question: "Do all cars qualify for Uber and Lyft?",
    answer:
      "Many of our vehicles meet Uber and Lyft requirements. Each listing clearly shows which platforms the vehicle is approved for.",
  },
  {
    question: "Is a deposit required?",
    answer:
      "Yes, a refundable security deposit is required at checkout. The deposit amount is shown on each vehicle listing.",
  },
  {
    question: "What if the car I want is unavailable?",
    answer:
      "You can join the waitlist for any vehicle — no account required. We'll email you as soon as it becomes available.",
  },
];

const requirements = [
  { title: "Valid driver's license", sub: "Must be at least 23 years old" },
  { title: "Active rideshare account", sub: "Uber, Lyft, or delivery platform" },
  { title: "Clean driving record", sub: "No major violations in past 3 years" },
  { title: "Proof of insurance", sub: "Rideshare-endorsed policy required" },
];

const staticVehicles = [
  {
    id: "1",
    slug: "2023-toyota-camry",
    make: "Toyota",
    model: "Camry",
    year: 2023,
    type: "sedan",
    status: "available" as const,
    weeklyPrice: 30000,
    depositAmount: 50000,
    transmission: "automatic",
    fuelType: "gas",
    seats: 5,
    uberEligible: true,
    lyftEligible: true,
    deliveryEligible: false,
    images: [],
  },
  {
    id: "2",
    slug: "2022-honda-crv",
    make: "Honda",
    model: "CR-V",
    year: 2022,
    type: "suv",
    status: "available" as const,
    weeklyPrice: 35000,
    depositAmount: 50000,
    transmission: "automatic",
    fuelType: "hybrid",
    seats: 5,
    uberEligible: true,
    lyftEligible: true,
    deliveryEligible: true,
    images: [],
  },
  {
    id: "3",
    slug: "2022-toyota-sienna",
    make: "Toyota",
    model: "Sienna",
    year: 2022,
    type: "minivan",
    status: "limited" as const,
    weeklyPrice: 40000,
    depositAmount: 60000,
    transmission: "automatic",
    fuelType: "hybrid",
    seats: 8,
    uberEligible: true,
    lyftEligible: true,
    deliveryEligible: false,
    images: [],
  },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">

        {/* ── Hero ──────────────────────────────────────── */}
        <section className="bg-[#F7F9FC] pt-16 pb-14 lg:pt-20 lg:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

              {/* Copy */}
              <div>
                <div className="inline-flex items-center gap-2 bg-[#E8F0FE] rounded px-3 py-1.5 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1A3A6B]" />
                  <span className="text-[#1A3A6B] text-xs font-bold tracking-wider uppercase">
                    Atlanta · Rideshare Rentals
                  </span>
                </div>

                <h1
                  className="text-4xl lg:text-5xl font-extrabold text-[#0D1F3C] leading-[1.05] tracking-tight mb-5"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Drive for Uber & Lyft.{" "}
                  <span className="text-[#1A3A6B]">We handle the car.</span>
                </h1>

                <p className="text-[#64748B] text-base leading-relaxed mb-8 max-w-md">
                  Weekly rentals for rideshare and delivery drivers. No long-term
                  lease, no credit check. Apply in minutes, approved in 24 hours.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-7">
                  <Link
                    href="/cars"
                    className="inline-flex items-center justify-center px-6 py-3 bg-[#1A3A6B] text-white font-semibold rounded-md hover:bg-[#122A52] transition-colors text-sm"
                  >
                    Browse Available Cars →
                  </Link>
                  <Link
                    href="/how-it-works"
                    className="inline-flex items-center justify-center px-6 py-3 border border-[#CBD5E1] text-[#64748B] font-semibold rounded-md hover:border-[#1A3A6B] hover:text-[#1A3A6B] transition-colors text-sm"
                  >
                    How It Works
                  </Link>
                </div>

                <div className="flex flex-wrap gap-5">
                  {[
                    "No credit check",
                    "Cancel anytime",
                    "Drive this week",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-1.5">
                      <span className="text-[#16A34A] text-xs font-bold">✓</span>
                      <span className="text-xs text-[#94A3B8]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stacked hero cards */}
              <div className="hidden lg:block">
                <HeroVehicleCards
                  vehicles={staticVehicles.slice(0, 2)}
                  totalCount={staticVehicles.length}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats Bar ─────────────────────────────────── */}
        <section className="bg-white border-y border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-[#E2E8F0]">
              {[
                { value: "500+", label: "Drivers Served" },
                { value: "50+", label: "Vehicles" },
                { value: "24hr", label: "Avg. Approval" },
                { value: "ATL", label: "Locally Operated" },
              ].map((stat) => (
                <div key={stat.label} className="text-center px-6 py-2">
                  <p className="text-2xl font-extrabold text-[#1A3A6B] tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-[10px] text-[#94A3B8] uppercase tracking-[1.5px] mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ──────────────────────────────── */}
        <section className="bg-[#F7F9FC] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-xs font-bold text-[#1A3A6B] tracking-[2px] uppercase mb-3">
                Simple Process
              </p>
              <h2
                className="text-3xl font-extrabold text-[#0D1F3C] tracking-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                How it works
              </h2>
            </div>

            {/* Desktop: 4 cards */}
            <div className="hidden lg:grid grid-cols-4 gap-5">
              {howItWorksSteps.map((step) => (
                <div
                  key={step.number}
                  className="bg-white border border-[#E2E8F0] rounded-lg p-6"
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center mb-4 ${
                      step.number === 4
                        ? "bg-[#1A3A6B]"
                        : "bg-[#E8F0FE]"
                    }`}
                  >
                    <step.icon
                      className={`w-4 h-4 ${
                        step.number === 4 ? "text-white" : "text-[#1A3A6B]"
                      }`}
                    />
                  </div>
                  <p className="text-sm font-bold text-[#0D1F3C] mb-2">
                    {step.title}
                  </p>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Mobile: accordion */}
            <div className="lg:hidden">
              <Accordion type="single" collapsible className="space-y-2">
                {howItWorksSteps.map((step, i) => (
                  <AccordionItem
                    key={step.number}
                    value={`step-${i}`}
                    className="bg-white border border-[#E2E8F0] rounded-lg px-4"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#E8F0FE] flex items-center justify-center shrink-0">
                          <step.icon className="w-4 h-4 text-[#1A3A6B]" />
                        </div>
                        <span className="font-semibold text-sm text-[#0D1F3C]">
                          {step.title}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-xs text-[#94A3B8] pb-4 pl-11 leading-relaxed">
                      {step.description}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* ── Featured Vehicles ─────────────────────────── */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-9">
              <div>
                <p className="text-xs font-bold text-[#1A3A6B] tracking-[2px] uppercase mb-2">
                  Fleet
                </p>
                <h2
                  className="text-3xl font-extrabold text-[#0D1F3C] tracking-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Available now
                </h2>
              </div>
              <Link
                href="/cars"
                className="hidden sm:inline-flex items-center gap-1 border border-[#CBD5E1] text-[#64748B] text-sm font-semibold px-4 py-2 rounded-md hover:border-[#1A3A6B] hover:text-[#1A3A6B] transition-colors"
              >
                View All Cars →
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {staticVehicles.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>

            <div className="text-center mt-7 sm:hidden">
              <Link
                href="/cars"
                className="text-sm font-semibold text-[#1A3A6B] hover:text-[#122A52] transition-colors"
              >
                View All Cars →
              </Link>
            </div>
          </div>
        </section>

        {/* ── Requirements ──────────────────────────────── */}
        <section className="bg-[#F7F9FC] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              <div>
                <p className="text-xs font-bold text-[#1A3A6B] tracking-[2px] uppercase mb-3">
                  Eligibility
                </p>
                <h2
                  className="text-3xl font-extrabold text-[#0D1F3C] tracking-tight mb-8"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Do you qualify?
                </h2>
                <div className="space-y-4">
                  {requirements.map((req) => (
                    <div key={req.title} className="flex gap-3 items-start">
                      <div className="w-5 h-5 rounded bg-[#DCFCE7] flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[#15803D] text-[10px] font-bold">✓</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0D1F3C]">
                          {req.title}
                        </p>
                        <p className="text-xs text-[#94A3B8] mt-0.5">{req.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-[#E2E8F0] rounded-lg p-7">
                <p className="text-sm font-bold text-[#0D1F3C] mb-5">
                  Ready to apply?
                </p>
                <div className="space-y-4 mb-7">
                  {[
                    "Browse and pick a vehicle",
                    "Complete 5-minute application",
                    "Get approved within 24 hours",
                    "Pay deposit and start driving",
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#1A3A6B] flex items-center justify-center shrink-0">
                        <span className="text-white text-[11px] font-bold">
                          {i + 1}
                        </span>
                      </div>
                      <p className="text-sm text-[#64748B]">{step}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href="/cars"
                  className="block w-full text-center py-3 bg-[#1A3A6B] text-white text-sm font-semibold rounded-md hover:bg-[#122A52] transition-colors"
                >
                  Check My Eligibility →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────── */}
        <section className="bg-white py-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-xs font-bold text-[#1A3A6B] tracking-[2px] uppercase mb-3">
                FAQ
              </p>
              <h2
                className="text-3xl font-extrabold text-[#0D1F3C] tracking-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Common questions
              </h2>
            </div>

            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="bg-[#F7F9FC] border border-[#E2E8F0] rounded-lg px-5"
                >
                  <AccordionTrigger className="hover:no-underline text-left font-semibold text-sm text-[#0D1F3C] py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-[#64748B] pb-4 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="text-center mt-7">
              <Link
                href="/faq"
                className="text-sm font-semibold text-[#1A3A6B] hover:text-[#122A52] transition-colors"
              >
                View all FAQs →
              </Link>
            </div>
          </div>
        </section>

        {/* ── Footer CTA ────────────────────────────────── */}
        <section className="bg-[#0D1F3C] py-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <h2
              className="text-3xl font-extrabold text-white tracking-tight mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Start driving as soon as this week.
            </h2>
            <p className="text-white/50 text-sm mb-8">
              No long-term commitment. Cancel when you want.
            </p>
            <Link
              href="/cars"
              className="inline-flex items-center justify-center px-7 py-3.5 bg-white text-[#1A3A6B] font-bold text-sm rounded-md hover:bg-[#F0F4FF] transition-colors"
            >
              Browse Available Cars →
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
