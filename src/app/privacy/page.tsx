import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1
            className="text-3xl font-extrabold text-[#0D1F3C] tracking-tight mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Privacy Policy
          </h1>
          <p className="text-sm text-[#94A3B8] mb-10">Last updated: January 1, 2025</p>

          <div className="prose prose-slate max-w-none space-y-8 text-sm text-[#475569] leading-relaxed">

            <section>
              <h2 className="text-lg font-bold text-[#0D1F3C] mb-3">1. Information We Collect</h2>
              <p>
                U&amp;C Auto Connect ("we," "us," or "our") collects information you provide directly to us when you
                create an account, submit a rental application, or contact us. This includes your name, email address,
                phone number, date of birth, driver's license, and proof of auto insurance.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0D1F3C] mb-3">2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Process and manage your rental applications</li>
                <li>Verify your identity and driver eligibility</li>
                <li>Communicate with you about your account and rentals</li>
                <li>Process payments and prevent fraud</li>
                <li>Comply with legal obligations</li>
                <li>Improve our services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0D1F3C] mb-3">3. Information Sharing</h2>
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share your information
                with service providers who assist us in operating our platform (such as payment processors), to the
                extent necessary to perform their services, and subject to confidentiality obligations.
              </p>
              <p className="mt-2">
                We may also disclose your information when required by law, to protect our rights, or to comply with a
                judicial proceeding or court order.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0D1F3C] mb-3">4. Document Storage</h2>
              <p>
                Uploaded documents (driver's license, insurance cards) are stored securely and used solely for
                verification purposes. Documents are retained for the duration of your account and for a reasonable
                period thereafter to comply with our legal obligations.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0D1F3C] mb-3">5. Data Security</h2>
              <p>
                We implement reasonable administrative, technical, and physical safeguards to protect your personal
                information. However, no method of transmission over the internet is 100% secure, and we cannot
                guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0D1F3C] mb-3">6. Your Rights</h2>
              <p>You may request access to, correction of, or deletion of your personal information by contacting us at
                the address below. We will respond to reasonable requests within 30 days.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0D1F3C] mb-3">7. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes by
                posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0D1F3C] mb-3">8. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at:{" "}
                <a href="/contact" className="text-[#1A3A6B] hover:underline font-medium">
                  our contact page
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
