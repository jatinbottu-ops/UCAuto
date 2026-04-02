import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "U&C Auto Connect - Rental Cars for Rideshare Drivers in Atlanta",
  description:
    "Rental cars for Uber, Lyft & delivery drivers in Atlanta, GA. Fast approval, no hidden fees, secure online application.",
  keywords: "car rental, rideshare, Uber, Lyft, Atlanta, gig driver",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F7F9FC] text-[#0D1F3C]">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
