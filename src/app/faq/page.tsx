import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqCategories = [
  {
    category: "Pricing & Fees",
    faqs: [
      {
        q: "How much does it cost to rent a vehicle?",
        a: "Our vehicles range from $250–$400/week depending on the vehicle type. A refundable deposit ($400–$600) is required at the time of payment. There are no hidden fees — the weekly price and deposit are clearly listed on each vehicle's page.",
      },
      {
        q: "Is the deposit refundable?",
        a: "Yes. The deposit is fully refundable at the end of your rental period, provided the vehicle is returned in the same condition with no unreported damage.",
      },
      {
        q: "Are there mileage limits?",
        a: "Most of our vehicles include unlimited mileage. Any exceptions are clearly noted on the vehicle listing page.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit and debit cards through our secure Stripe payment system. We also offer a Venmo payment option — contact us for details.",
      },
    ],
  },
  {
    category: "Application & Approval",
    faqs: [
      {
        q: "How do I apply?",
        a: "Select a vehicle from our catalog, click 'Apply Now', create an account, fill in your personal info, upload your license and insurance, and submit. The whole process takes about 10 minutes.",
      },
      {
        q: "How long does approval take?",
        a: "Most applications are reviewed within 1-2 business days. You'll receive an email when your status changes.",
      },
      {
        q: "What if my application is rejected?",
        a: "If we're unable to approve your application, you'll receive an email with the reason. Common reasons include a driving record issue or incomplete documentation. You're welcome to reapply after resolving the issue.",
      },
      {
        q: "Can I apply for multiple vehicles at once?",
        a: "You can have one active application at a time. If you'd like to switch vehicles, contact us.",
      },
    ],
  },
  {
    category: "Vehicles & Eligibility",
    faqs: [
      {
        q: "Which vehicles are Uber/Lyft eligible?",
        a: "Each vehicle listing clearly shows Uber and/or Lyft eligibility badges. Generally, vehicles 10 years old or newer with 4 doors qualify. Check each listing for specifics.",
      },
      {
        q: "Can I use the vehicle for food delivery (DoorDash, Instacart, etc.)?",
        a: "Yes! Vehicles marked 'Delivery Eligible' can be used for food and package delivery platforms. Not all vehicles qualify — check the listing.",
      },
      {
        q: "What happens if I need a different vehicle?",
        a: "Contact us and we'll work with you to switch to a different available vehicle.",
      },
      {
        q: "What if the vehicle I want is not available?",
        a: "Join the waitlist! We'll notify you by email as soon as a spot opens up.",
      },
    ],
  },
  {
    category: "Maintenance & Support",
    faqs: [
      {
        q: "Who is responsible for maintenance?",
        a: "We handle all scheduled maintenance. If you experience a mechanical issue, contact us immediately and we'll arrange a solution or replacement vehicle.",
      },
      {
        q: "What do I do in case of an accident?",
        a: "Contact emergency services first if needed, then notify us immediately. Document everything with photos. Your personal insurance will handle coverage.",
      },
      {
        q: "How do I contact support?",
        a: "Use our contact form, email us, or call during business hours. We aim to respond to all inquiries within a few hours.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <div className="pt-16 lg:pt-20">
        {/* Header */}
        <section className="bg-[#1A3A6B] py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Everything you need to know about renting with U&amp;C Auto Connect.
            </p>
          </div>
        </section>

        {/* FAQ sections */}
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              {faqCategories.map((cat) => (
                <div key={cat.category}>
                  <h2 className="text-xl font-bold text-[#1A3A6B] mb-6 pb-3 border-b border-[#E2E8F0]">
                    {cat.category}
                  </h2>
                  <Accordion type="single" collapsible className="space-y-3">
                    {cat.faqs.map((faq, i) => (
                      <AccordionItem
                        key={i}
                        value={`${cat.category}-${i}`}
                        className="border border-[#E2E8F0] rounded-xl px-4"
                      >
                        <AccordionTrigger className="hover:no-underline text-left font-semibold text-[#1E293B]">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-[#64748B] pb-4 leading-relaxed">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Still have questions */}
        <section className="py-16 bg-[#F7F9FC]">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-[#1A3A6B] mb-3">Still have questions?</h2>
            <p className="text-[#64748B] mb-6">
              Our team is happy to help. Reach out through our contact form.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#E87722] text-white font-semibold rounded-lg hover:bg-[#C45F10] transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
