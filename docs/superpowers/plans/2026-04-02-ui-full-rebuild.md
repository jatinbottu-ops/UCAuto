# UI Full Rebuild — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild every page of UC Auto Connect with a Clean & Trustworthy design system — navy-only palette, Plus Jakarta Sans + Inter typography, no gradients or glassmorphism, intentional component styles that replace all orange and rounded-blob shadcn defaults.

**Architecture:** Work outside-in: design tokens first → shared components → pages in order of user impact. All changes are className/JSX replacements — zero changes to API routes, auth, database, or business logic.

**Tech Stack:** Next.js 16.2.1, React 19, Tailwind CSS v4 (CSS-first `@theme inline`), TypeScript 5, shadcn/ui (kept as headless base), Plus Jakarta Sans + Inter via `next/font/google`, lucide-react

> ⚠️ **AGENTS.md warning:** This Next.js version has breaking changes. Before writing any code, skim `node_modules/next/dist/docs/` for relevant guide (font loading, Image, Link APIs). Heed deprecation notices.

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/app/globals.css` | Modify | Design tokens, remove orange, fix radius, remove card-hover transform |
| `src/app/layout.tsx` | Modify | Add Plus Jakarta Sans font variable |
| `src/components/layout/Navbar.tsx` | Modify | Remove backdrop-blur, remove orange, navy CTA |
| `src/components/layout/Footer.tsx` | Modify | Darker navy bg, cleaner layout |
| `src/components/vehicles/AvailabilityBadge.tsx` | Modify | 4px radius, correct spec colors |
| `src/components/vehicles/VehicleCard.tsx` | Modify | Remove orange, fix radius, updated hover |
| `src/components/vehicles/HeroVehicleCards.tsx` | Create | Two stacked horizontal hero cards |
| `src/app/page.tsx` | Modify | Full home page rebuild per spec |
| `src/app/cars/page.tsx` | Modify | Listing page sidebar + card grid rebuild |
| `src/app/cars/[slug]/page.tsx` | Modify | Detail page two-column rebuild |
| `src/app/apply/[vehicleId]/page.tsx` | Modify | Wizard step styling rebuild |
| `src/app/(auth)/login/page.tsx` | Modify | Centered card layout, updated inputs |
| `src/app/(auth)/signup/page.tsx` | Modify | Same pattern as login |
| `src/app/dashboard/layout.tsx` | Modify | Sidebar nav with navy active states |
| `src/app/dashboard/page.tsx` | Modify | Dashboard home content |
| `src/app/admin/layout.tsx` | Modify | Admin sidebar (same pattern) |
| `src/app/admin/page.tsx` | Modify | Admin dashboard home |
| `src/app/how-it-works/page.tsx` | Modify | Card-based 4-step layout |
| `src/app/requirements/page.tsx` | Modify | Checklist layout |
| `src/app/faq/page.tsx` | Modify | Accordion page |
| `src/app/contact/page.tsx` | Modify | Form layout |
| `src/app/waitlist/[vehicleId]/page.tsx` | Modify | Centered card layout |

---

## Task 1: Read Next.js 16 docs

**Files:**
- Read: `node_modules/next/dist/docs/` (find font and image guide)

- [ ] **Step 1: Find the relevant docs**

```bash
ls "node_modules/next/dist/docs/"
```

Look for guides on: `next/font`, `next/image`, `next/link`. Read any that cover font loading — the API may differ from Next.js 13/14.

- [ ] **Step 2: Note any breaking changes**

Specifically check: does `next/font/google` still accept `variable` option? Does `<Link>` still work without `<a>` child? Does `<Image>` require `sizes`?

- [ ] **Step 3: No commit needed — this is a read-only task**

---

## Task 2: Design tokens — globals.css

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace globals.css with the updated version**

Replace the entire file content with:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  /* Shadcn token remappings — keep these */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-geist-mono);
  --font-heading: var(--font-heading);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) - 2px);
  --radius-md: var(--radius);
  --radius-lg: calc(var(--radius) + 2px);
  --radius-xl: calc(var(--radius) + 4px);

  /* Brand design tokens */
  --color-navy: #1A3A6B;
  --color-navy-dark: #122A52;
  --color-navy-tint: #E8F0FE;
  --color-ink: #0D1F3C;
  --color-body-text: #64748B;
  --color-muted-text: #94A3B8;
  --color-border-base: #E2E8F0;
  --color-surface: #FFFFFF;
  --color-surface-alt: #F7F9FC;
  --color-status-green: #16A34A;
  --color-status-green-tint: #DCFCE7;
  --color-status-amber-text: #854D0E;
  --color-status-amber-tint: #FEF9C3;
  --color-status-red: #DC2626;
  --color-status-red-tint: #FEE2E2;
}

:root {
  /* Shadcn base — updated to use navy as primary */
  --background: oklch(1 0 0);
  --foreground: oklch(0.13 0.03 254);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.13 0.03 254);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.13 0.03 254);
  --primary: oklch(0.32 0.1 255);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.13 0.03 254);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.13 0.03 254);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.32 0.1 255);
  --chart-1: oklch(0.32 0.1 255);
  --chart-2: oklch(0.556 0 0);
  --chart-3: oklch(0.439 0 0);
  --chart-4: oklch(0.371 0 0);
  --chart-5: oklch(0.269 0 0);
  --radius: 0.5rem;
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.13 0.03 254);
  --sidebar-primary: oklch(0.32 0.1 255);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: var(--color-navy-tint);
  --sidebar-accent-foreground: oklch(0.32 0.1 255);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.32 0.1 255);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
    font-family: var(--font-sans), sans-serif;
  }
  html {
    @apply font-sans;
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd "/Users/jatinbottu/car rental website/uc-auto-connect" && npx tsc --noEmit
```

Expected: no errors (CSS change has no TS impact, but confirms project still builds).

- [ ] **Step 3: Commit**

```bash
cd "/Users/jatinbottu/car rental website/uc-auto-connect"
git add src/app/globals.css
git commit -m "design: overhaul CSS design tokens, navy-only palette, 8px base radius"
```

---

## Task 3: Font system — layout.tsx

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Update layout.tsx to add Plus Jakarta Sans**

```tsx
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
```

- [ ] **Step 2: Verify**

```bash
cd "/Users/jatinbottu/car rental website/uc-auto-connect" && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "design: add Plus Jakarta Sans heading font, set ink body color"
```

---

## Task 4: AvailabilityBadge component

**Files:**
- Modify: `src/components/vehicles/AvailabilityBadge.tsx`

- [ ] **Step 1: Read the current file**

```bash
cat "src/components/vehicles/AvailabilityBadge.tsx"
```

- [ ] **Step 2: Replace with updated version**

```tsx
interface AvailabilityBadgeProps {
  status: "available" | "limited" | "rented" | "waitlist";
}

const config = {
  available: {
    label: "Available",
    className: "bg-[#DCFCE7] text-[#15803D]",
  },
  limited: {
    label: "Limited",
    className: "bg-[#FEF9C3] text-[#854D0E]",
  },
  rented: {
    label: "Rented",
    className: "bg-[#FEE2E2] text-[#DC2626]",
  },
  waitlist: {
    label: "Waitlist",
    className: "bg-[#F1F5F9] text-[#64748B]",
  },
} as const;

export function AvailabilityBadge({ status }: AvailabilityBadgeProps) {
  const { label, className } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
```

- [ ] **Step 3: Verify**

```bash
cd "/Users/jatinbottu/car rental website/uc-auto-connect" && npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/components/vehicles/AvailabilityBadge.tsx
git commit -m "design: update AvailabilityBadge to flat 4px radius badges"
```

---

## Task 5: VehicleCard component

**Files:**
- Modify: `src/components/vehicles/VehicleCard.tsx`

- [ ] **Step 1: Replace with updated VehicleCard**

```tsx
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AvailabilityBadge } from "./AvailabilityBadge";

interface Vehicle {
  id: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  type: string;
  status: "available" | "limited" | "rented" | "waitlist";
  weeklyPrice: number;
  depositAmount: number;
  transmission: string;
  fuelType: string;
  seats: number;
  uberEligible: boolean;
  lyftEligible: boolean;
  deliveryEligible: boolean;
  images: string[];
}

interface VehicleCardProps {
  vehicle: Vehicle;
  className?: string;
}

export function VehicleCard({ vehicle, className }: VehicleCardProps) {
  const pricePerWeek = (vehicle.weeklyPrice / 100).toFixed(0);
  const deposit = (vehicle.depositAmount / 100).toFixed(0);
  const isAvailable =
    vehicle.status === "available" || vehicle.status === "limited";

  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-[#E2E8F0] overflow-hidden",
        "transition-shadow duration-200",
        "hover:shadow-[0_2px_8px_rgba(0,0,0,0.06),_0_8px_24px_rgba(26,58,107,0.08)]",
        "shadow-[0_1px_4px_rgba(0,0,0,0.04),_0_4px_16px_rgba(26,58,107,0.05)]",
        className
      )}
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden bg-[#E8F0FE]">
        {vehicle.images && vehicle.images.length > 0 ? (
          <Image
            src={vehicle.images[0]}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-14 h-14 text-[#1A3A6B] opacity-20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 9l-7 2-7-2V5l7-2 7 2v4zM5 9v6l7 2 7-2V9"
              />
            </svg>
          </div>
        )}
        <div className="absolute top-2.5 left-2.5">
          <AvailabilityBadge status={vehicle.status} />
        </div>
      </div>

      {/* Card body */}
      <div className="p-4">
        {/* Name + price */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-bold text-[#0D1F3C] text-sm leading-snug tracking-tight">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5 capitalize">
              {vehicle.type} · {vehicle.transmission}
            </p>
          </div>
          <div className="text-right shrink-0 ml-3">
            <span className="text-lg font-extrabold text-[#1A3A6B] tracking-tight">
              ${pricePerWeek}
            </span>
            <span className="text-xs text-[#94A3B8]">/wk</span>
          </div>
        </div>

        {/* Platform tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {vehicle.uberEligible && (
            <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#E8F0FE] text-[#1A3A6B] rounded">
              Uber
            </span>
          )}
          {vehicle.lyftEligible && (
            <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#E8F0FE] text-[#1A3A6B] rounded">
              Lyft
            </span>
          )}
          {vehicle.deliveryEligible && (
            <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#FFF7ED] text-[#C2410C] rounded">
              Delivery
            </span>
          )}
        </div>

        {/* CTA */}
        <Link
          href={isAvailable ? `/cars/${vehicle.slug}` : `/waitlist/${vehicle.id}`}
          className={cn(
            "block w-full text-center py-2.5 px-4 rounded-md font-semibold text-sm transition-colors",
            isAvailable
              ? "bg-[#1A3A6B] text-white hover:bg-[#122A52]"
              : "border border-[#E2E8F0] text-[#64748B] hover:border-[#1A3A6B] hover:text-[#1A3A6B]"
          )}
        >
          {isAvailable ? "View Details" : "Join Waitlist"}
        </Link>
        <p className="text-center text-[10px] text-[#94A3B8] mt-1.5">
          ${deposit} deposit · No credit check
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

```bash
cd "/Users/jatinbottu/car rental website/uc-auto-connect" && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/vehicles/VehicleCard.tsx
git commit -m "design: VehicleCard navy-only, 8px radius, flat hover shadow"
```

---

## Task 6: HeroVehicleCards — new component

**Files:**
- Create: `src/components/vehicles/HeroVehicleCards.tsx`

- [ ] **Step 1: Create the component**

```tsx
import Link from "next/link";
import Image from "next/image";
import { AvailabilityBadge } from "./AvailabilityBadge";

interface HeroVehicle {
  id: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  type: string;
  status: "available" | "limited" | "rented" | "waitlist";
  weeklyPrice: number;
  depositAmount: number;
  uberEligible: boolean;
  lyftEligible: boolean;
  deliveryEligible: boolean;
  images: string[];
}

interface HeroVehicleCardsProps {
  vehicles: HeroVehicle[];
  totalCount?: number;
}

function HeroCard({
  vehicle,
  highlighted,
}: {
  vehicle: HeroVehicle;
  highlighted: boolean;
}) {
  const price = (vehicle.weeklyPrice / 100).toFixed(0);
  const isAvailable =
    vehicle.status === "available" || vehicle.status === "limited";

  return (
    <div
      className={`bg-white rounded-lg overflow-hidden ${
        highlighted
          ? "border-[1.5px] border-[#1A3A6B] shadow-[0_2px_12px_rgba(26,58,107,0.12)]"
          : "border border-[#E2E8F0] shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
      }`}
    >
      <div className="flex">
        {/* Photo strip */}
        <div className="relative w-28 shrink-0 bg-[#E8F0FE]">
          {vehicle.images && vehicle.images.length > 0 ? (
            <Image
              src={vehicle.images[0]}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              fill
              className="object-cover"
              sizes="112px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-[#1A3A6B] opacity-20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 9l-7 2-7-2V5l7-2 7 2v4zM5 9v6l7 2 7-2V9"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 p-3">
          <div className="flex items-start justify-between mb-1.5">
            <div>
              <p className="text-sm font-bold text-[#0D1F3C] leading-tight tracking-tight">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </p>
              <p className="text-[10px] text-[#94A3B8] mt-0.5 capitalize">
                {vehicle.type}
              </p>
            </div>
            <div className="text-right shrink-0 ml-2">
              <span className="text-base font-extrabold text-[#1A3A6B] tracking-tight">
                ${price}
              </span>
              <span className="text-[10px] text-[#94A3B8]">/wk</span>
            </div>
          </div>

          <div className="flex gap-1 mb-2.5">
            <AvailabilityBadge status={vehicle.status} />
            {vehicle.uberEligible && (
              <span className="text-[9px] font-semibold px-1.5 py-0.5 bg-[#E8F0FE] text-[#1A3A6B] rounded">
                Uber
              </span>
            )}
            {vehicle.lyftEligible && (
              <span className="text-[9px] font-semibold px-1.5 py-0.5 bg-[#E8F0FE] text-[#1A3A6B] rounded">
                Lyft
              </span>
            )}
          </div>

          <Link
            href={isAvailable ? `/cars/${vehicle.slug}` : `/waitlist/${vehicle.id}`}
            className={`block w-full text-center py-1.5 rounded text-[11px] font-bold transition-colors ${
              highlighted
                ? "bg-[#1A3A6B] text-white hover:bg-[#122A52]"
                : "border border-[#CBD5E1] text-[#64748B] hover:border-[#1A3A6B] hover:text-[#1A3A6B]"
            }`}
          >
            {isAvailable ? "Apply →" : "Join Waitlist"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export function HeroVehicleCards({
  vehicles,
  totalCount,
}: HeroVehicleCardsProps) {
  const [first, second] = vehicles;

  return (
    <div className="flex flex-col gap-3">
      {first && <HeroCard vehicle={first} highlighted />}
      {second && <HeroCard vehicle={second} highlighted={false} />}
      {totalCount && totalCount > 2 && (
        <p className="text-center text-xs text-[#94A3B8]">
          + {totalCount - 2} more vehicles available
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify**

```bash
cd "/Users/jatinbottu/car rental website/uc-auto-connect" && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/vehicles/HeroVehicleCards.tsx
git commit -m "design: add HeroVehicleCards stacked component for hero section"
```

---

## Task 7: Navbar

**Files:**
- Modify: `src/components/layout/Navbar.tsx`

- [ ] **Step 1: Replace Navbar**

```tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/cars", label: "Browse Cars" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/requirements", label: "Requirements" },
  { href: "/faq", label: "FAQ" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E2E8F0] transition-shadow duration-200",
          scrolled ? "shadow-[0_1px_8px_rgba(0,0,0,0.06)]" : "shadow-none"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#1A3A6B] rounded-md flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                </svg>
              </div>
              <span className="text-sm font-extrabold text-[#0D1F3C] tracking-tight leading-none">
                U&C Auto Connect
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-[#64748B] hover:text-[#0D1F3C] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop right actions */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <>
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="text-sm font-medium text-[#64748B] hover:text-[#0D1F3C] transition-colors"
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-[#64748B] hover:text-[#0D1F3C] transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="text-sm font-semibold px-4 py-2 rounded-md border border-[#E2E8F0] text-[#64748B] hover:border-[#1A3A6B] hover:text-[#1A3A6B] transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-semibold text-[#64748B] hover:text-[#0D1F3C] transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/cars"
                    className="text-sm font-semibold px-4 py-2 rounded-md bg-[#1A3A6B] text-white hover:bg-[#122A52] transition-colors"
                  >
                    Apply Now
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-[#64748B]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#0D1F3C] flex flex-col pt-16 px-6">
          <nav className="flex flex-col gap-1 mt-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/80 text-xl font-semibold py-3 border-b border-white/10 hover:text-white transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-3 mt-8">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-center py-3 border border-white/20 text-white rounded-md font-semibold hover:bg-white/10 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="py-3 border border-white/20 text-white rounded-md font-semibold hover:bg-white/10 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-center py-3 border border-white/20 text-white rounded-md font-semibold hover:bg-white/10 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/cars"
                  className="text-center py-3 bg-[#1A3A6B] text-white rounded-md font-semibold hover:bg-[#122A52] transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Apply Now
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Verify**

```bash
cd "/Users/jatinbottu/car rental website/uc-auto-connect" && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Navbar.tsx
git commit -m "design: Navbar — remove backdrop-blur/orange, navy CTA, clean mobile menu"
```

---

## Task 8: Footer

**Files:**
- Modify: `src/components/layout/Footer.tsx`

- [ ] **Step 1: Replace Footer**

```tsx
import Link from "next/link";

const footerLinks = {
  Drivers: [
    { href: "/cars", label: "Browse Cars" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/requirements", label: "Requirements" },
  ],
  Company: [
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#122A52] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-white/15 rounded-md flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                </svg>
              </div>
              <span className="text-sm font-extrabold tracking-tight">U&C Auto Connect</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Atlanta's rideshare vehicle rental platform. Drive more. Earn more.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[2px] mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white/80 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mt-12 pt-8">
          <p className="text-white/30 text-xs">
            &copy; {new Date().getFullYear()} U&C Auto Connect. All rights reserved. Atlanta, Georgia.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Verify**

```bash
cd "/Users/jatinbottu/car rental website/uc-auto-connect" && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Footer.tsx
git commit -m "design: Footer — darker navy bg, cleaner two-column link layout"
```

---

## Task 9: Home page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace page.tsx**

```tsx
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
```

- [ ] **Step 2: Verify**

```bash
cd "/Users/jatinbottu/car rental website/uc-auto-connect" && npx tsc --noEmit
```

- [ ] **Step 3: Run dev server and visually confirm home page**

```bash
npm run dev
```

Open http://localhost:3000. Check: hero layout, stats bar, how it works cards, vehicle cards, requirements, FAQ, footer CTA.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "design: home page full rebuild — split hero, stats bar, card sections, navy-only"
```

---

## Task 10: Cars listing page

**Files:**
- Modify: `src/app/cars/page.tsx`

- [ ] **Step 1: Read the full current file**

```bash
cat "src/app/cars/page.tsx"
```

- [ ] **Step 2: Replace the page JSX (keep all state/fetch logic, replace only the returned JSX)**

Find the `return (` statement and replace everything inside with:

```tsx
return (
  <>
    <Navbar />
    <main className="pt-16 min-h-screen bg-[#F7F9FC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-extrabold text-[#0D1F3C] tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Browse Vehicles
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            {filtered.length} vehicle{filtered.length !== 1 ? "s" : ""} available
          </p>
        </div>

        <div className="flex gap-8 items-start">

          {/* ── Sidebar (desktop) ── */}
          <aside className="hidden lg:block w-56 shrink-0 bg-white border border-[#E2E8F0] rounded-lg p-5 sticky top-20">
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-bold text-[#0D1F3C] uppercase tracking-wider">
                Filters
              </span>
              {(selectedTypes.length > 0 ||
                selectedFuels.length > 0 ||
                selectedStatuses.length > 0 ||
                uberOnly || lyftOnly || deliveryOnly) && (
                <button
                  onClick={() => {
                    setSelectedTypes([]);
                    setSelectedFuels([]);
                    setSelectedStatuses([]);
                    setUberOnly(false);
                    setLyftOnly(false);
                    setDeliveryOnly(false);
                  }}
                  className="text-[10px] font-semibold text-[#1A3A6B] hover:text-[#122A52] transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Availability */}
            <div className="mb-5">
              <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-3">
                Availability
              </p>
              {statusOptions.map((s) => (
                <label key={s} className="flex items-center gap-2.5 py-1 cursor-pointer">
                  <Checkbox
                    id={`status-${s}`}
                    checked={selectedStatuses.includes(s)}
                    onCheckedChange={(v) =>
                      setSelectedStatuses((prev) =>
                        v ? [...prev, s] : prev.filter((x) => x !== s)
                      )
                    }
                    className="rounded border-[#CBD5E1] data-[state=checked]:bg-[#1A3A6B] data-[state=checked]:border-[#1A3A6B]"
                  />
                  <Label htmlFor={`status-${s}`} className="text-sm text-[#64748B] capitalize cursor-pointer">
                    {s}
                  </Label>
                </label>
              ))}
            </div>

            {/* Vehicle type */}
            <div className="mb-5">
              <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-3">
                Vehicle Type
              </p>
              {vehicleTypes.map((t) => (
                <label key={t} className="flex items-center gap-2.5 py-1 cursor-pointer">
                  <Checkbox
                    id={`type-${t}`}
                    checked={selectedTypes.includes(t)}
                    onCheckedChange={(v) =>
                      setSelectedTypes((prev) =>
                        v ? [...prev, t] : prev.filter((x) => x !== t)
                      )
                    }
                    className="rounded border-[#CBD5E1] data-[state=checked]:bg-[#1A3A6B] data-[state=checked]:border-[#1A3A6B]"
                  />
                  <Label htmlFor={`type-${t}`} className="text-sm text-[#64748B] capitalize cursor-pointer">
                    {t}
                  </Label>
                </label>
              ))}
            </div>

            {/* Fuel type */}
            <div className="mb-5">
              <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-3">
                Fuel Type
              </p>
              {fuelTypes.map((f) => (
                <label key={f} className="flex items-center gap-2.5 py-1 cursor-pointer">
                  <Checkbox
                    id={`fuel-${f}`}
                    checked={selectedFuels.includes(f)}
                    onCheckedChange={(v) =>
                      setSelectedFuels((prev) =>
                        v ? [...prev, f] : prev.filter((x) => x !== f)
                      )
                    }
                    className="rounded border-[#CBD5E1] data-[state=checked]:bg-[#1A3A6B] data-[state=checked]:border-[#1A3A6B]"
                  />
                  <Label htmlFor={`fuel-${f}`} className="text-sm text-[#64748B] capitalize cursor-pointer">
                    {f}
                  </Label>
                </label>
              ))}
            </div>

            {/* Platform eligibility */}
            <div>
              <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-3">
                Platform
              </p>
              {[
                { key: "uber", label: "Uber Eligible", value: uberOnly, setter: setUberOnly },
                { key: "lyft", label: "Lyft Eligible", value: lyftOnly, setter: setLyftOnly },
                { key: "delivery", label: "Delivery", value: deliveryOnly, setter: setDeliveryOnly },
              ].map(({ key, label, value, setter }) => (
                <label key={key} className="flex items-center gap-2.5 py-1 cursor-pointer">
                  <Checkbox
                    id={key}
                    checked={value}
                    onCheckedChange={(v) => setter(!!v)}
                    className="rounded border-[#CBD5E1] data-[state=checked]:bg-[#1A3A6B] data-[state=checked]:border-[#1A3A6B]"
                  />
                  <Label htmlFor={key} className="text-sm text-[#64748B] cursor-pointer">
                    {label}
                  </Label>
                </label>
              ))}
            </div>
          </aside>

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">

            {/* Sort bar */}
            <div className="flex items-center justify-between mb-5">
              {/* Mobile filter button */}
              <button
                className="lg:hidden flex items-center gap-2 text-sm font-semibold px-3 py-2 border border-[#E2E8F0] rounded-md text-[#64748B] hover:border-[#1A3A6B] hover:text-[#1A3A6B] transition-colors"
                onClick={() => setFilterOpen(true)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="ml-auto text-sm font-medium text-[#64748B] border border-[#E2E8F0] rounded-md px-3 py-2 bg-white hover:border-[#1A3A6B] transition-colors focus:outline-none focus:border-[#1A3A6B] focus:ring-2 focus:ring-[#1A3A6B]/10"
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            {/* Loading */}
            {loading && (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg border border-[#E2E8F0] h-64 animate-pulse"
                  />
                ))}
              </div>
            )}

            {/* Error */}
            {!loading && loadError && (
              <div className="text-center py-16">
                <p className="text-sm text-[#DC2626] mb-3">{loadError}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-sm font-semibold text-[#1A3A6B] hover:underline"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Empty state */}
            {!loading && !loadError && filtered.length === 0 && (
              <div className="text-center py-20">
                <svg
                  className="w-10 h-10 text-[#CBD5E1] mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 9l-7 2-7-2V5l7-2 7 2v4zM5 9v6l7 2 7-2V9"
                  />
                </svg>
                <p className="text-sm font-semibold text-[#0D1F3C] mb-1">
                  No vehicles match your filters
                </p>
                <button
                  onClick={() => {
                    setSelectedTypes([]);
                    setSelectedFuels([]);
                    setSelectedStatuses([]);
                    setUberOnly(false);
                    setLyftOnly(false);
                    setDeliveryOnly(false);
                  }}
                  className="text-sm font-semibold text-[#1A3A6B] hover:text-[#122A52] transition-colors"
                >
                  Clear filters
                </button>
              </div>
            )}

            {/* Grid */}
            {!loading && !loadError && filtered.length > 0 && (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((v) => (
                  <VehicleCard key={v.id} vehicle={v} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setFilterOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white overflow-y-auto p-5 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-bold text-[#0D1F3C]">Filters</span>
              <button onClick={() => setFilterOpen(false)}>
                <X className="w-5 h-5 text-[#64748B]" />
              </button>
            </div>
            {statusOptions.map((s) => (
              <label key={s} className="flex items-center gap-2.5 py-1 cursor-pointer">
                <Checkbox id={`m-status-${s}`} checked={selectedStatuses.includes(s)}
                  onCheckedChange={(v) => setSelectedStatuses((p) => v ? [...p, s] : p.filter((x) => x !== s))}
                  className="rounded border-[#CBD5E1] data-[state=checked]:bg-[#1A3A6B] data-[state=checked]:border-[#1A3A6B]" />
                <Label htmlFor={`m-status-${s}`} className="text-sm text-[#64748B] capitalize cursor-pointer">{s}</Label>
              </label>
            ))}
            {vehicleTypes.map((t) => (
              <label key={t} className="flex items-center gap-2.5 py-1 cursor-pointer">
                <Checkbox id={`m-type-${t}`} checked={selectedTypes.includes(t)}
                  onCheckedChange={(v) => setSelectedTypes((p) => v ? [...p, t] : p.filter((x) => x !== t))}
                  className="rounded border-[#CBD5E1] data-[state=checked]:bg-[#1A3A6B] data-[state=checked]:border-[#1A3A6B]" />
                <Label htmlFor={`m-type-${t}`} className="text-sm text-[#64748B] capitalize cursor-pointer">{t}</Label>
              </label>
            ))}
            <button onClick={() => setFilterOpen(false)}
              className="w-full mt-6 py-2.5 bg-[#1A3A6B] text-white text-sm font-semibold rounded-md hover:bg-[#122A52] transition-colors">
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </main>
    <Footer />
  </>
);
```

- [ ] **Step 3: Verify**

```bash
cd "/Users/jatinbottu/car rental website/uc-auto-connect" && npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/app/cars/page.tsx
git commit -m "design: cars listing page — navy sidebar filters, clean sort bar, updated empty state"
```

---

## Task 11: Car detail page

**Files:**
- Modify: `src/app/cars/[slug]/page.tsx`
- Read first: `src/app/cars/[slug]/page.tsx`

- [ ] **Step 1: Read the current file**

```bash
cat "src/app/cars/[slug]/page.tsx"
```

- [ ] **Step 2: Update the page styling**

Keep all data fetching and business logic. Replace the JSX return with the following structure:

```tsx
// In the returned JSX, replace all className strings with these patterns:

// Page wrapper
<main className="pt-16 min-h-screen bg-[#F7F9FC]">
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
        {/* Photo area */}
        <div className="bg-[#E8F0FE] rounded-lg h-72 lg:h-96 flex items-center justify-center mb-6 relative overflow-hidden border border-[#E2E8F0]">
          {/* photo or placeholder */}
        </div>

        {/* Specs table */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 mb-5">
          <h2 className="text-sm font-bold text-[#0D1F3C] mb-4 uppercase tracking-wide">
            Specifications
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {/* Each spec row: */}
            <div className="flex items-center gap-2">
              <span className="text-[#94A3B8] text-xs">Transmission</span>
              <span className="text-sm font-semibold text-[#0D1F3C] ml-auto capitalize">{vehicle.transmission}</span>
            </div>
            {/* ... other specs */}
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

      {/* Right: sticky pricing sidebar */}
      <div className="lg:sticky lg:top-24">
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          {/* Vehicle name */}
          <h1 className="text-xl font-extrabold text-[#0D1F3C] tracking-tight mb-1"
            style={{ fontFamily: "var(--font-heading)" }}>
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
                ${(vehicle.weeklyPrice / 100).toFixed(0)}
              </span>
              <span className="text-sm text-[#94A3B8]">/week</span>
            </div>
            <p className="text-xs text-[#94A3B8] mt-1">
              ${(vehicle.depositAmount / 100).toFixed(0)} refundable deposit
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
                We'll notify you when it's available
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
</main>
```

- [ ] **Step 3: Verify**

```bash
cd "/Users/jatinbottu/car rental website/uc-auto-connect" && npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/app/cars/[slug]/page.tsx
git commit -m "design: car detail page — sticky pricing sidebar, specs table, navy CTA"
```

---

## Task 12: Application wizard

**Files:**
- Modify: `src/app/apply/[vehicleId]/page.tsx`
- Read first: `src/app/apply/[vehicleId]/page.tsx`

- [ ] **Step 1: Read the current file**

```bash
cat "src/app/apply/[vehicleId]/page.tsx"
```

- [ ] **Step 2: Restyle wizard wrapper and progress indicator**

Keep all form logic, state, and step data. Replace the wrapper and progress bar JSX:

```tsx
// Page wrapper
<main className="min-h-screen bg-[#F7F9FC] pt-16 pb-16">
  <Navbar />
  <div className="max-w-xl mx-auto px-4 sm:px-6 py-10">

    {/* Progress dots */}
    <div className="flex items-center justify-center gap-3 mb-10">
      {steps.map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
            i < currentStep
              ? "bg-[#1A3A6B] text-white"
              : i === currentStep
              ? "bg-white border-2 border-[#1A3A6B] text-[#1A3A6B]"
              : "bg-white border border-[#E2E8F0] text-[#CBD5E1]"
          }`}>
            {i < currentStep ? "✓" : i + 1}
          </div>
          {i === currentStep && (
            <span className="text-[9px] font-semibold text-[#1A3A6B] uppercase tracking-wider">
              {steps[i].label}
            </span>
          )}
        </div>
      ))}
    </div>

    {/* Step card */}
    <div className="bg-white border border-[#E2E8F0] rounded-lg p-7 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      {/* Step content renders here */}
      {renderCurrentStep()}
    </div>

    {/* Navigation */}
    <div className="flex items-center justify-between mt-5">
      {currentStep > 0 ? (
        <button
          onClick={handleBack}
          className="text-sm font-semibold text-[#64748B] hover:text-[#0D1F3C] transition-colors"
        >
          ← Back
        </button>
      ) : <div />}
      <button
        onClick={handleNext}
        disabled={isSubmitting}
        className="px-6 py-2.5 bg-[#1A3A6B] text-white text-sm font-semibold rounded-md hover:bg-[#122A52] disabled:opacity-50 transition-colors"
      >
        {currentStep === steps.length - 1 ? "Submit Application" : "Continue →"}
      </button>
    </div>
  </div>
</main>
```

Also update all form inputs in each step to use the new input style:
```tsx
// Input field pattern for all step forms
<div>
  <label className="block text-sm font-medium text-[#64748B] mb-1.5">
    {label}
  </label>
  <input
    {...register(fieldName)}
    className="w-full bg-[#FAFBFC] border border-[#CBD5E1] rounded-md px-3.5 py-2.5 text-sm text-[#0D1F3C] placeholder:text-[#CBD5E1] focus:outline-none focus:border-[#1A3A6B] focus:ring-2 focus:ring-[#1A3A6B]/8 focus:bg-white transition-all"
  />
  {errors[fieldName] && (
    <p className="text-xs text-[#DC2626] mt-1">{errors[fieldName]?.message}</p>
  )}
</div>

// Upload zone pattern
<div className="border-2 border-dashed border-[#E2E8F0] rounded-lg p-8 text-center hover:border-[#1A3A6B] transition-colors">
  <div className="w-10 h-10 bg-[#E8F0FE] rounded-lg flex items-center justify-center mx-auto mb-3">
    <Upload className="w-5 h-5 text-[#1A3A6B]" />
  </div>
  <p className="text-sm font-semibold text-[#0D1F3C] mb-1">Upload document</p>
  <p className="text-xs text-[#94A3B8]">PDF, JPG, or PNG — max 10MB</p>
</div>
```

- [ ] **Step 3: Verify**

```bash
cd "/Users/jatinbottu/car rental website/uc-auto-connect" && npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/app/apply/[vehicleId]/page.tsx
git commit -m "design: apply wizard — navy progress dots, updated inputs and upload zones"
```

---

## Task 13: Auth pages

**Files:**
- Modify: `src/app/(auth)/login/page.tsx`
- Modify: `src/app/(auth)/signup/page.tsx`
- Read first: both files

- [ ] **Step 1: Read both files**

```bash
cat "src/app/(auth)/login/page.tsx"
cat "src/app/(auth)/signup/page.tsx"
```

- [ ] **Step 2: Replace login page JSX**

Keep all form logic (`useForm`, `onSubmit`, state). Replace the return with:

```tsx
return (
  <main className="min-h-screen bg-[#F7F9FC] flex items-center justify-center px-4 py-16">
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-8 h-8 bg-[#1A3A6B] rounded-md flex items-center justify-center mx-auto">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
            </svg>
          </div>
        </Link>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-lg p-8 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <h1 className="text-xl font-extrabold text-[#0D1F3C] tracking-tight mb-1"
          style={{ fontFamily: "var(--font-heading)" }}>
          Sign in
        </h1>
        <p className="text-sm text-[#94A3B8] mb-7">Welcome back to U&C Auto Connect</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#64748B] mb-1.5">
              Email address
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              className="w-full bg-[#FAFBFC] border border-[#CBD5E1] rounded-md px-3.5 py-2.5 text-sm text-[#0D1F3C] placeholder:text-[#CBD5E1] focus:outline-none focus:border-[#1A3A6B] focus:ring-2 focus:ring-[#1A3A6B]/8 focus:bg-white transition-all"
            />
            {errors.email && (
              <p className="text-xs text-[#DC2626] mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#64748B] mb-1.5">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className="w-full bg-[#FAFBFC] border border-[#CBD5E1] rounded-md px-3.5 py-2.5 text-sm text-[#0D1F3C] placeholder:text-[#CBD5E1] focus:outline-none focus:border-[#1A3A6B] focus:ring-2 focus:ring-[#1A3A6B]/8 focus:bg-white transition-all"
            />
            {errors.password && (
              <p className="text-xs text-[#DC2626] mt-1">{errors.password.message}</p>
            )}
          </div>

          {serverError && (
            <p className="text-xs text-[#DC2626] bg-[#FEE2E2] px-3 py-2 rounded">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#1A3A6B] text-white text-sm font-semibold rounded-md hover:bg-[#122A52] disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-[#94A3B8] mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-[#1A3A6B] hover:text-[#122A52] transition-colors">
            Sign up →
          </Link>
        </p>
      </div>
    </div>
  </main>
);
```

- [ ] **Step 3: Apply same pattern to signup page**

Same outer structure (`bg-[#F7F9FC]`, centered card), same input styles, same button. Change title to "Create account", change footer link to "Already have an account? Sign in →".

- [ ] **Step 4: Verify**

```bash
cd "/Users/jatinbottu/car rental website/uc-auto-connect" && npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add "src/app/(auth)/login/page.tsx" "src/app/(auth)/signup/page.tsx"
git commit -m "design: auth pages — centered card layout, updated inputs, navy CTA"
```

---

## Task 14: Dashboard layout & sidebar

**Files:**
- Modify: `src/app/dashboard/layout.tsx`
- Read first: `src/app/dashboard/layout.tsx`

- [ ] **Step 1: Read the current layout**

```bash
cat "src/app/dashboard/layout.tsx"
```

- [ ] **Step 2: Replace with updated sidebar layout**

Keep auth redirect logic. Add `"use client"` at the top if not already present. Add `usePathname` import:

```tsx
"use client";
import { usePathname } from "next/navigation";
// ... other imports

export default function DashboardLayout(...) {
  const pathname = usePathname();
  // rest of component
}
```

Then in the nav items, use `pathname` to apply active state:

```tsx
className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
  pathname === href
    ? "bg-[#E8F0FE] text-[#1A3A6B] font-semibold"
    : "text-[#64748B] hover:bg-[#E8F0FE] hover:text-[#1A3A6B]"
}`}
```

Replace the JSX return with:

```tsx
return (
  <div className="min-h-screen bg-[#F7F9FC] flex">
    {/* Sidebar */}
    <aside className="hidden lg:flex flex-col w-56 shrink-0 bg-white border-r border-[#E2E8F0] min-h-screen sticky top-0 h-screen">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#E2E8F0]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#1A3A6B] rounded flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
            </svg>
          </div>
          <span className="text-xs font-extrabold text-[#0D1F3C] tracking-tight">
            U&C Auto Connect
          </span>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {[
          { href: "/dashboard", label: "Overview", icon: "⊞" },
          { href: "/dashboard/applications", label: "Applications", icon: "📋" },
          { href: "/dashboard/payments", label: "Payments", icon: "💳" },
          { href: "/dashboard/documents", label: "Documents", icon: "📄" },
        ].map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-[#64748B] hover:bg-[#E8F0FE] hover:text-[#1A3A6B] transition-colors"
          >
            <span className="text-base">{icon}</span>
            {label}
          </Link>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t border-[#E2E8F0]">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-7 h-7 rounded-full bg-[#E8F0FE] flex items-center justify-center text-[#1A3A6B] text-xs font-bold">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#0D1F3C] truncate">
              {user?.firstName} {user?.lastName}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full text-left text-xs font-medium text-[#94A3B8] hover:text-[#DC2626] transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>

    {/* Main content */}
    <div className="flex-1 min-w-0">
      {/* Mobile top bar */}
      <div className="lg:hidden bg-white border-b border-[#E2E8F0] px-4 py-3 flex items-center justify-between">
        <span className="text-sm font-bold text-[#0D1F3C]">Dashboard</span>
        <Link href="/cars" className="text-xs font-semibold text-[#1A3A6B]">
          Browse Cars
        </Link>
      </div>

      <div className="px-4 sm:px-8 py-8">
        {children}
      </div>
    </div>
  </div>
);
```

- [ ] **Step 3: Verify**

```bash
cd "/Users/jatinbottu/car rental website/uc-auto-connect" && npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/app/dashboard/layout.tsx
git commit -m "design: dashboard sidebar — white bg, navy active states, clean user footer"
```

---

## Task 15: Dashboard pages

**Files:**
- Modify: `src/app/dashboard/page.tsx`
- Modify: `src/app/dashboard/applications/page.tsx`
- Modify: `src/app/dashboard/payments/page.tsx`
- Modify: `src/app/dashboard/documents/page.tsx`
- Read each first

- [ ] **Step 1: Read all four files**

```bash
cat "src/app/dashboard/page.tsx"
cat "src/app/dashboard/applications/page.tsx"
cat "src/app/dashboard/payments/page.tsx"
cat "src/app/dashboard/documents/page.tsx"
```

- [ ] **Step 2: Apply consistent card pattern across all dashboard pages**

For every content card in these pages, replace `rounded-2xl`, orange colors, and `card-hover` with:

```tsx
// Content card
<div className="bg-white border border-[#E2E8F0] rounded-lg p-6">

// Page heading pattern
<div className="mb-7">
  <h1 className="text-xl font-extrabold text-[#0D1F3C] tracking-tight"
    style={{ fontFamily: "var(--font-heading)" }}>
    {pageTitle}
  </h1>
  <p className="text-sm text-[#94A3B8] mt-0.5">{subtitle}</p>
</div>

// Status badge (applications)
<span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
  status === "active" ? "bg-[#DCFCE7] text-[#15803D]" :
  status === "approved" ? "bg-[#E8F0FE] text-[#1A3A6B]" :
  status === "rejected" ? "bg-[#FEE2E2] text-[#DC2626]" :
  "bg-[#F1F5F9] text-[#64748B]"
}`}>
  {status}
</span>

// Table pattern
<table className="w-full text-sm">
  <thead>
    <tr className="border-b border-[#F1F5F9]">
      <th className="text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider py-3 pr-4">
        Column
      </th>
    </tr>
  </thead>
  <tbody className="divide-y divide-[#F7F9FC]">
    <tr>
      <td className="py-3 pr-4 text-sm text-[#64748B]">value</td>
    </tr>
  </tbody>
</table>

// Primary action button
<Link
  href="/cars"
  className="inline-flex items-center px-4 py-2 bg-[#1A3A6B] text-white text-sm font-semibold rounded-md hover:bg-[#122A52] transition-colors"
>
  Browse Cars
</Link>
```

Replace any orange (`#E87722`, `#C45F10`) with navy (`#1A3A6B`, `#122A52`) throughout.

- [ ] **Step 3: Verify**

```bash
cd "/Users/jatinbottu/car rental website/uc-auto-connect" && npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/app/dashboard/
git commit -m "design: dashboard pages — white cards, navy actions, clean table styles"
```

---

## Task 16: Admin layout & pages

**Files:**
- Modify: `src/app/admin/layout.tsx`
- Modify: `src/app/admin/page.tsx`
- Modify: `src/app/admin/applications/page.tsx`
- Modify: `src/app/admin/inventory/page.tsx`
- Modify: `src/app/admin/payments/page.tsx`
- Modify: `src/app/admin/verifications/page.tsx`
- Modify: `src/app/admin/waitlist/page.tsx`
- Read each first

- [ ] **Step 1: Read the admin layout**

```bash
cat "src/app/admin/layout.tsx"
```

- [ ] **Step 2: Apply same sidebar pattern as dashboard**

Admin sidebar is identical to the dashboard sidebar pattern from Task 14, with these nav items instead:

```tsx
{[
  { href: "/admin", label: "Overview", icon: "⊞" },
  { href: "/admin/applications", label: "Applications", icon: "📋" },
  { href: "/admin/inventory", label: "Inventory", icon: "🚗" },
  { href: "/admin/payments", label: "Payments", icon: "💳" },
  { href: "/admin/verifications", label: "Verifications", icon: "✅" },
  { href: "/admin/waitlist", label: "Waitlist", icon: "⏳" },
].map(({ href, label, icon }) => (
  <Link
    key={href}
    href={href}
    className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-[#64748B] hover:bg-[#E8F0FE] hover:text-[#1A3A6B] transition-colors"
  >
    <span>{icon}</span>
    {label}
  </Link>
))}
```

- [ ] **Step 3: Read and restyle each admin page**

```bash
cat "src/app/admin/page.tsx"
cat "src/app/admin/applications/page.tsx"
cat "src/app/admin/inventory/page.tsx"
```

Apply the same card/table patterns from Task 15. Replace all orange with navy throughout.

- [ ] **Step 4: Verify**

```bash
cd "/Users/jatinbottu/car rental website/uc-auto-connect" && npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/
git commit -m "design: admin layout and pages — dashboard sidebar pattern, navy tables"
```

---

## Task 17: Secondary public pages

**Files:**
- Modify: `src/app/how-it-works/page.tsx`
- Modify: `src/app/requirements/page.tsx`
- Modify: `src/app/faq/page.tsx`
- Modify: `src/app/contact/page.tsx`
- Modify: `src/app/waitlist/[vehicleId]/page.tsx`
- Read each first

- [ ] **Step 1: Read all five files**

```bash
cat "src/app/how-it-works/page.tsx"
cat "src/app/requirements/page.tsx"
cat "src/app/faq/page.tsx"
cat "src/app/contact/page.tsx"
cat "src/app/waitlist/[vehicleId]/page.tsx"
```

- [ ] **Step 2: Apply consistent patterns**

For each page, apply:
- `bg-[#F7F9FC]` page background
- `pt-16` for nav offset
- Section headings use `font-extrabold text-[#0D1F3C] tracking-tight` with `fontFamily: "var(--font-heading)"`
- Section eyebrow labels: `text-xs font-bold text-[#1A3A6B] tracking-[2px] uppercase`
- Content cards: `bg-white border border-[#E2E8F0] rounded-lg p-6`
- All orange → navy
- All `rounded-2xl` → `rounded-lg`
- All `rounded-full` on tags → `rounded`

**How It Works page:** Use the same 4-card grid from the home page How It Works section.

**Requirements page:** Use the same 2-column checklist + process card pattern from the home page Requirements section.

**FAQ page:** Use the same Accordion pattern from the home page FAQ section, but show all FAQs.

**Contact page:** Form with updated input styles (same as auth page inputs). Submit button: navy full-width.

**Waitlist page:** Centered card (same pattern as auth pages), vehicle summary card at top, email + phone form, navy submit button.

- [ ] **Step 3: Verify**

```bash
cd "/Users/jatinbottu/car rental website/uc-auto-connect" && npx tsc --noEmit
```

- [ ] **Step 4: Full build check**

```bash
npm run build
```

Expected: BUILD SUCCESSFUL with no errors or warnings.

- [ ] **Step 5: Commit**

```bash
git add src/app/how-it-works/ src/app/requirements/ src/app/faq/ src/app/contact/ src/app/waitlist/
git commit -m "design: secondary pages — consistent nav offset, card patterns, all orange removed"
```

---

## Task 18: Final build verification

**Files:** All

- [ ] **Step 1: TypeScript full check**

```bash
cd "/Users/jatinbottu/car rental website/uc-auto-connect" && npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 2: Production build**

```bash
npm run build
```

Expected: BUILD SUCCESSFUL. Note any warnings and fix them.

- [ ] **Step 3: Run dev server and do a visual pass**

```bash
npm run dev
```

Visit each route and confirm:
- `http://localhost:3000` — Home page
- `http://localhost:3000/cars` — Listing page
- `http://localhost:3000/how-it-works` — How it works
- `http://localhost:3000/login` — Login
- `http://localhost:3000/signup` — Signup

Check for: any remaining orange (`#E87722`), any `rounded-full` on tags, any `backdrop-blur`, any `transform: translateY` hover effects.

- [ ] **Step 4: Search for any remaining orange in JSX**

```bash
grep -r "E87722\|C45F10\|btn-accent" src/app/ src/components/
```

Expected: 0 matches.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "design: final build verification — full UI rebuild complete"
```
