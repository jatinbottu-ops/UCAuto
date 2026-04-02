import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1
            className="text-3xl font-extrabold text-[#0D1F3C] tracking-tight mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Terms of Service
          </h1>
          <p className="text-sm text-[#94A3B8] mb-10">Last updated: January 1, 2025</p>

          <div className="prose prose-slate max-w-none space-y-8 text-sm text-[#475569] leading-relaxed">

            <section>
              <h2 className="text-lg font-bold text-[#0D1F3C] mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing or using the U&amp;C Auto Connect platform ("Service"), you agree to be bound by these
                Terms of Service. If you do not agree to these terms, please do not use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0D1F3C] mb-3">2. Eligibility</h2>
              <p>To rent a vehicle through our Service, you must:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Be at least 23 years of age</li>
                <li>Hold a valid, unrestricted driver's license</li>
                <li>Maintain active auto insurance with rideshare endorsement</li>
                <li>Have an active account on at least one rideshare or delivery platform</li>
                <li>Have no major traffic violations in the past 3 years</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0D1F3C] mb-3">3. Rental Agreements</h2>
              <p>
                Each rental is governed by a separate rental agreement provided at the time of vehicle pickup. Rental
                periods are weekly. Vehicles must be used lawfully and only for rideshare or delivery purposes as
                approved. Unauthorized use, subletting, or transfer of the vehicle is strictly prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0D1F3C] mb-3">4. Payments &amp; Fees</h2>
              <p>
                Weekly rental fees are charged in advance. A refundable security deposit is collected at the start of
                the rental. Late payments may incur additional fees. We reserve the right to repossess the vehicle for
                non-payment.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0D1F3C] mb-3">5. Cancellations</h2>
              <p>
                You may cancel your rental at any time with at least 48 hours' notice prior to the next billing cycle.
                Security deposits are refunded within 5–7 business days after vehicle return and inspection, subject to
                any deductions for damage or outstanding fees.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0D1F3C] mb-3">6. Vehicle Condition &amp; Liability</h2>
              <p>
                You are responsible for returning the vehicle in the same condition as received, normal wear and tear
                excepted. You are liable for any damage, traffic violations, tolls, or parking fines incurred during
                your rental period. You must report any accidents or incidents to us within 24 hours.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0D1F3C] mb-3">7. Termination</h2>
              <p>
                We reserve the right to terminate your account and rental agreement immediately for violation of these
                Terms, fraudulent activity, unsafe driving behavior, or failure to maintain required insurance coverage.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0D1F3C] mb-3">8. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, U&amp;C Auto Connect shall not be liable for any indirect,
                incidental, special, or consequential damages arising from your use of the Service or any rented
                vehicle.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0D1F3C] mb-3">9. Governing Law</h2>
              <p>
                These Terms are governed by the laws of the State of Georgia. Any disputes shall be resolved in the
                courts of Fulton County, Georgia.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0D1F3C] mb-3">10. Contact</h2>
              <p>
                Questions about these Terms may be directed to us via our{" "}
                <a href="/contact" className="text-[#1A3A6B] hover:underline font-medium">
                  contact page
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
