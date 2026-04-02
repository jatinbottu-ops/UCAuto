import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle, XCircle } from "lucide-react";

const qualifications = [
  { req: "Valid U.S. Driver's License (minimum 2 years)", required: true },
  { req: "Must be 21 years of age or older", required: true },
  { req: "Active Uber, Lyft, or delivery platform account", required: true },
  { req: "Clean driving record (no major violations in last 3 years)", required: true },
  { req: "No DUI/DWI convictions in last 7 years", required: true },
  { req: "Pass background check", required: true },
  { req: "Proof of personal auto insurance", required: true },
  { req: "Atlanta metro area resident", required: true },
  { req: "No at-fault accidents in last 2 years", required: true },
  { req: "No suspended or revoked license", required: true },
];

const disqualifiers = [
  "DUI/DWI in the past 7 years",
  "Suspended or revoked license",
  "More than 2 at-fault accidents in 3 years",
  "Reckless driving conviction in last 3 years",
  "Felony conviction in last 7 years",
  "Under 21 years of age",
];

const documents = [
  { doc: "Valid Driver's License (front & back)", notes: "Must be current, not expired" },
  { doc: "Proof of Auto Insurance", notes: "Must cover the rental period" },
  { doc: "Active Rideshare/Delivery Account", notes: "Screenshot or account confirmation" },
  { doc: "Proof of Atlanta Residency", notes: "Utility bill, lease, or bank statement" },
];

export default function RequirementsPage() {
  return (
    <>
      <Navbar />
      <div className="pt-16 lg:pt-20">
        {/* Header */}
        <section className="bg-[#1A3A6B] py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4">
              Rental Requirements
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Here&apos;s everything you need to qualify for a rental vehicle with U&amp;C Auto Connect.
            </p>
          </div>
        </section>

        {/* Requirements */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Qualifications */}
              <div>
                <h2 className="text-2xl font-bold text-[#1A3A6B] mb-6">Qualifications</h2>
                <div className="space-y-3">
                  {qualifications.map((item) => (
                    <div key={item.req} className="flex items-start gap-3 bg-[#ECFDF5] rounded-xl p-4">
                      <CheckCircle className="h-5 w-5 text-[#1B7A3E] flex-shrink-0 mt-0.5" />
                      <span className="text-[#1E293B] text-sm">{item.req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disqualifiers */}
              <div>
                <h2 className="text-2xl font-bold text-[#B91C1C] mb-6">Disqualifiers</h2>
                <div className="space-y-3">
                  {disqualifiers.map((item) => (
                    <div key={item} className="flex items-start gap-3 bg-[#FEF2F2] rounded-xl p-4">
                      <XCircle className="h-5 w-5 text-[#B91C1C] flex-shrink-0 mt-0.5" />
                      <span className="text-[#1E293B] text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Documents */}
        <section className="py-16 bg-[#F7F9FC]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#1A3A6B] mb-8 text-center">
              Required Documents
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {documents.map((doc, i) => (
                <div key={i} className="bg-white rounded-xl border border-[#E2E8F0] p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#EBF0F8] flex items-center justify-center flex-shrink-0">
                      <span className="text-[#1A3A6B] font-bold text-sm">{i + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1E293B] mb-1">{doc.doc}</h3>
                      <p className="text-[#64748B] text-sm">{doc.notes}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Insurance note */}
        <section className="py-12 bg-[#FFF7ED]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#D97706]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[#D97706] font-bold">!</span>
              </div>
              <div>
                <h3 className="font-bold text-[#1E293B] mb-2">Insurance Note</h3>
                <p className="text-[#64748B] text-sm leading-relaxed">
                  You must maintain your own personal auto insurance while renting from us. Our vehicles are not covered under commercial rideshare insurance — you are responsible for obtaining rideshare endorsement coverage if your personal insurer requires it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-[#1A3A6B]">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Meet the requirements?</h2>
            <p className="text-white/80 mb-8">Apply online today. Fast approval, no hidden fees.</p>
            <Link
              href="/cars"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#E87722] text-white font-bold rounded-lg hover:bg-[#C45F10] transition-colors"
            >
              Browse & Apply
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
