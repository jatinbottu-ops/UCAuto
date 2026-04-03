import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AvailabilityBadge } from "@/components/vehicles/AvailabilityBadge";
import { prisma } from "@/lib/db";

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const vehicle = await prisma.vehicle.findUnique({
    where: { slug },
  });

  if (!vehicle) notFound();

  const pricePerWeek = (vehicle.weeklyPrice / 100).toFixed(0);
  const deposit = (vehicle.depositAmount / 100).toFixed(0);

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-[#F7F9FC] pb-24 lg:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-[#94A3B8] mb-6">
            <Link href="/" className="hover:text-[#1A3A6B] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/cars" className="hover:text-[#1A3A6B] transition-colors">Browse Cars</Link>
            <span>/</span>
            <span className="text-[#0D1F3C] font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</span>
          </nav>

          {/* Two-column layout */}
          <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">

            {/* Left: photos + specs */}
            <div>
              {/* Mobile: vehicle name + price summary (shown above image on mobile only) */}
              <div className="lg:hidden bg-white border border-[#E2E8F0] rounded-lg p-4 mb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h1
                      className="text-lg font-extrabold text-[#0D1F3C] tracking-tight leading-snug"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h1>
                    <p className="text-xs text-[#94A3B8] capitalize mt-0.5">{vehicle.type}</p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <span className="text-2xl font-extrabold text-[#1A3A6B] tracking-tight">${pricePerWeek}</span>
                    <span className="text-xs text-[#94A3B8]">/wk</span>
                    <p className="text-[10px] text-[#94A3B8]">${deposit} deposit</p>
                  </div>
                </div>
                <div className="flex gap-1.5 flex-wrap mt-2">
                  <AvailabilityBadge status={vehicle.status} />
                  {vehicle.uberEligible && <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#E8F0FE] text-[#1A3A6B] rounded">Uber</span>}
                  {vehicle.lyftEligible && <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#E8F0FE] text-[#1A3A6B] rounded">Lyft</span>}
                  {vehicle.deliveryEligible && <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#FFF7ED] text-[#C2410C] rounded">Delivery</span>}
                </div>
              </div>

              {/* Photo area */}
              <div className="bg-[#E8F0FE] rounded-lg h-64 sm:h-72 lg:h-96 flex items-center justify-center mb-6 relative overflow-hidden border border-[#E2E8F0]">
                {vehicle.images && vehicle.images.length > 0 ? (
                  <Image
                    src={vehicle.images[0]}
                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, calc(100vw - 400px)"
                  />
                ) : (
                  <svg className="w-16 h-16 text-[#1A3A6B] opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 9l-7 2-7-2V5l7-2 7 2v4zM5 9v6l7 2 7-2V9" />
                  </svg>
                )}
              </div>

              {/* Specs table */}
              <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 mb-5">
                <h2 className="text-sm font-bold text-[#0D1F3C] mb-4 uppercase tracking-wide">
                  Specifications
                </h2>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                  {[
                    { label: "Transmission", value: vehicle.transmission },
                    { label: "Fuel Type", value: vehicle.fuelType },
                    { label: "Seats", value: vehicle.seats },
                    { label: "Year", value: vehicle.year },
                    { label: "Type", value: vehicle.type },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between border-b border-[#F7F9FC] pb-2">
                      <span className="text-xs text-[#94A3B8]">{label}</span>
                      <span className="text-sm font-semibold text-[#0D1F3C] capitalize">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              {vehicle.features && vehicle.features.length > 0 && (
                <div className="bg-white border border-[#E2E8F0] rounded-lg p-6">
                  <h2 className="text-sm font-bold text-[#0D1F3C] mb-4 uppercase tracking-wide">
                    Features
                  </h2>
                  <div className="grid grid-cols-2 gap-2">
                    {vehicle.features.map((f: string) => (
                      <div key={f} className="flex items-center gap-2">
                        <span className="text-[#16A34A] text-xs font-bold">✓</span>
                        <span className="text-sm text-[#64748B]">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: sticky pricing sidebar (desktop only) */}
            <div className="hidden lg:block lg:sticky lg:top-24">
              <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                {/* Vehicle name */}
                <h1
                  className="text-xl font-extrabold text-[#0D1F3C] tracking-tight mb-1"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h1>
                <p className="text-xs text-[#94A3B8] capitalize mb-4">{vehicle.type}</p>

                {/* Availability badge */}
                <div className="mb-4">
                  <AvailabilityBadge status={vehicle.status} />
                </div>

                {/* Price */}
                <div className="mb-4 pb-4 border-b border-[#F1F5F9]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-[#1A3A6B] tracking-tight">
                      ${pricePerWeek}
                    </span>
                    <span className="text-sm text-[#94A3B8]">/week</span>
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-1">
                    ${deposit} refundable deposit
                  </p>
                </div>

                {/* Platform tags */}
                <div className="flex gap-2 flex-wrap mb-5">
                  {vehicle.uberEligible && (
                    <span className="text-[10px] font-semibold px-2 py-1 bg-[#E8F0FE] text-[#1A3A6B] rounded">
                      Uber Eligible
                    </span>
                  )}
                  {vehicle.lyftEligible && (
                    <span className="text-[10px] font-semibold px-2 py-1 bg-[#E8F0FE] text-[#1A3A6B] rounded">
                      Lyft Eligible
                    </span>
                  )}
                  {vehicle.deliveryEligible && (
                    <span className="text-[10px] font-semibold px-2 py-1 bg-[#FFF7ED] text-[#C2410C] rounded">
                      Delivery
                    </span>
                  )}
                </div>

                {/* CTA */}
                {vehicle.status !== "rented" ? (
                  <>
                    <Link
                      href={`/apply/${vehicle.id}`}
                      className="block w-full text-center py-3 bg-[#1A3A6B] text-white text-sm font-semibold rounded-md hover:bg-[#122A52] transition-colors mb-2"
                    >
                      Apply for This Car →
                    </Link>
                    <p className="text-center text-[10px] text-[#94A3B8]">
                      No credit check · Cancel anytime
                    </p>
                  </>
                ) : (
                  <>
                    <Link
                      href={`/waitlist/${vehicle.id}`}
                      className="block w-full text-center py-3 border border-[#E2E8F0] text-[#64748B] text-sm font-semibold rounded-md hover:border-[#1A3A6B] hover:text-[#1A3A6B] transition-colors mb-2"
                    >
                      Join Waitlist
                    </Link>
                    <p className="text-center text-[10px] text-[#94A3B8]">
                      We&apos;ll notify you when it&apos;s available
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile sticky bottom CTA bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E2E8F0] px-4 py-3 shadow-[0_-2px_12px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#94A3B8] truncate">{vehicle.year} {vehicle.make} {vehicle.model}</p>
            <p className="text-base font-extrabold text-[#1A3A6B] leading-tight">${pricePerWeek}<span className="text-xs font-normal text-[#94A3B8]">/wk</span></p>
          </div>
          {vehicle.status !== "rented" ? (
            <Link
              href={`/apply/${vehicle.id}`}
              className="shrink-0 px-5 py-2.5 bg-[#1A3A6B] text-white text-sm font-semibold rounded-md hover:bg-[#122A52] transition-colors"
            >
              Apply Now →
            </Link>
          ) : (
            <Link
              href={`/waitlist/${vehicle.id}`}
              className="shrink-0 px-5 py-2.5 border border-[#E2E8F0] text-[#64748B] text-sm font-semibold rounded-md hover:border-[#1A3A6B] hover:text-[#1A3A6B] transition-colors"
            >
              Join Waitlist
            </Link>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
