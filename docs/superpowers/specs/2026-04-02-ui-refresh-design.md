# UI Refresh — Full Rebuild Design Spec
**Date:** 2026-04-02  
**Project:** UC Auto Connect — Car Rental for Rideshare Drivers, Atlanta  
**Scope:** Full rebuild of all pages (public, auth, dashboard, admin)

---

## 1. Goals & Audience

**Target audience:** Rideshare and delivery drivers in Atlanta (Uber, Lyft, DoorDash) who need a vehicle to work. They are mobile-first, value trust and speed, and need to understand the process immediately. Many are first-time applicants who need to feel confident before committing.

**Design goals:**
- Build trust instantly — this site handles money and documents
- Make the process feel simple and fast
- Look professional and intentional, not AI-generated or template-based
- Stand out from generic shadcn/Tailwind defaults

---

## 2. Design Personality

**Clean & Trustworthy** — light surfaces, strong typographic hierarchy, clear information structure. Feels closer to a credible financial product than a car rental startup. Spacious, not cluttered.

**Explicitly avoided:**
- Gradients on UI elements
- Glassmorphism / backdrop blur effects
- Large rounded blobs (border-radius > 16px on any UI element)
- Generic shadcn gray palette as-is
- Box shadows with spread > 24px
- Decorative background patterns or shapes

---

## 3. Design System

### 3.1 Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-navy` | `#1A3A6B` | Primary — buttons, links, headings, sidebar |
| `--color-navy-dark` | `#122A52` | Hover state, footer background |
| `--color-navy-tint` | `#E8F0FE` | Surface tint, tag backgrounds, section alternates |
| `--color-ink` | `#0D1F3C` | Headings, high-contrast text |
| `--color-body` | `#64748B` | Body text, secondary labels |
| `--color-muted` | `#94A3B8` | Placeholder, captions, timestamps |
| `--color-border` | `#E2E8F0` | All borders, dividers |
| `--color-surface` | `#FFFFFF` | Card backgrounds, inputs |
| `--color-surface-alt` | `#F7F9FC` | Page background, alternate sections |
| `--color-green` | `#16A34A` | Available status, success states |
| `--color-green-tint` | `#DCFCE7` | Available badge background |
| `--color-amber` | `#854D0E` | Limited status text |
| `--color-amber-tint` | `#FEF9C3` | Limited badge background |
| `--color-red` | `#DC2626` | Rented status, errors |
| `--color-red-tint` | `#FEE2E2` | Error badge background, error input bg |

**No orange accent color.** All CTAs use navy fill or navy outline. The ink dark (`#0D1F3C`) footer CTA uses a white button.

### 3.2 Typography

**Font stack:** Plus Jakarta Sans (headings) + Inter (body, UI)  
Import via Google Fonts: `Plus+Jakarta+Sans:wght@600;700;800` and `Inter:wght@400;500;600`

| Style | Font | Weight | Size | Line Height | Letter Spacing |
|-------|------|--------|------|-------------|----------------|
| Display | Plus Jakarta Sans | 800 | 48px | 1.05 | -1.5px |
| H1 | Plus Jakarta Sans | 700 | 32px | 1.1 | -1px |
| H2 | Plus Jakarta Sans | 700 | 24px | 1.2 | -0.5px |
| H3 | Plus Jakarta Sans | 600 | 20px | 1.3 | 0 |
| Body Large | Inter | 400 | 16px | 1.7 | 0 |
| Body | Inter | 400 | 14px | 1.65 | 0 |
| Body Small | Inter | 400 | 12px | 1.6 | 0 |
| Label | Inter | 600 | 11px | 1 | 1.5px (uppercase) |
| Caption | Inter | 400 | 10px | 1.5 | 0 |

### 3.3 Spacing

8px base unit. Section vertical padding: 72px desktop, 48px mobile.

### 3.4 Border Radius

| Context | Radius |
|---------|--------|
| Badges, tags | 4px |
| Buttons, inputs | 6px |
| Cards, modals, dropdowns | 8px |
| Page-level containers | 12px |

**Hard cap: nothing uses more than 12px radius except avatar/logo icons.**

### 3.5 Shadows

| Name | Value | Usage |
|------|-------|-------|
| `shadow-card` | `0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(26,58,107,0.05)` | Vehicle cards, content cards |
| `shadow-card-hover` | `0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(26,58,107,0.08)` | Card hover state |
| `shadow-hero-card` | `0 2px 10px rgba(26,58,107,0.08)` | Hero section card |

### 3.6 Components

#### Buttons
- **Primary:** `bg-navy text-white`, 6px radius, `font-semibold text-sm`, padding `11px 22px`
- **Outline:** `border-1.5 border-slate-300 text-slate-500`, same sizing
- **Ghost/link:** `text-navy font-semibold`, no border, inline with arrow `→`
- **No gradients, no shadows on buttons**

#### Inputs
- **Default:** `bg-[#FAFBFC] border border-slate-300 rounded-md`, 11px 14px padding, icon prefix slot
- **Focus:** `border-navy ring-2 ring-navy/8 bg-white`
- **Error:** `border-red-500 bg-red-50`
- Label: `text-sm font-medium text-slate-700`, weight reduced vs current shadcn default
- Helper/error text: `text-xs` below input

#### Vehicle Card
- White background, `border border-slate-200`, 8px radius, `shadow-card`
- Photo area: `bg-navy-tint` placeholder, full width, 160px tall (listing page), 110px (compact)
- Availability badge: overlaid top-left on photo
- Info row: name + platform tags left, price right
- CTA: full-width navy button at card bottom
- Sub-text: `$X deposit · No credit check` in muted caption

#### Badges
- Flat colored bg, 4px radius, `text-[10px] font-bold`
- Available: green tint bg / green text
- Limited: amber tint bg / amber text
- Rented: red tint bg / red text
- Platform tags (Uber/Lyft/Delivery): navy tint bg / navy text, `font-semibold`

#### Navigation
- Sticky, white bg, `border-b border-slate-200`, 60px height
- Logo: icon square (28px, navy bg) + wordmark
- Links: `text-sm font-medium text-slate-500`, hover `text-ink`
- CTA: navy primary button

---

## 4. Page-by-Page Layout

### 4.1 Home Page (`/`)

**Sections in order:**

1. **Nav** — sticky white, logo + nav links + Sign In text link + Apply Now button
2. **Hero** — `bg-surface-alt`, 72px vertical padding, two-column split:
   - Left (flex 1): eyebrow pill (navy tint, dot + uppercase label), display headline with navy color on second line, body copy, primary + outline buttons, 3 trust checkmarks (green ✓)
   - Right (flex 1.05): two stacked horizontal vehicle cards
     - Top card: navy border (1.5px), highlighted — landscape layout (photo left 40%, info right 60%), platform tags, Apply button
     - Bottom card: standard border, same layout, outline "View Car" button
     - Below cards: `+ X more vehicles available` in muted caption
3. **Stats Bar** — white bg, `border-y border-slate-200`, 4 stats with vertical dividers: Drivers Served / Vehicles / Avg Approval / ATL Locally Operated
4. **How It Works** — `bg-surface-alt`, centered section header (label + H1), 4-column card grid, numbered icon squares (1-3 navy tint, 4 navy fill)
5. **Featured Vehicles** — white bg, section header left-aligned + "View All Cars →" outline button right, 3-column vehicle card grid
6. **Requirements** — `bg-surface-alt`, two columns: left = checklist with green icon squares, right = white card with numbered steps + navy CTA
7. **FAQ** — white bg, centered header, accordion (shadcn Accordion, border-based, no background on trigger)
8. **Footer CTA Banner** — `bg-ink`, centered headline + caption + white button
9. **Footer** — `bg-navy-dark`, logo + tagline left, two link columns right

### 4.2 Cars Listing Page (`/cars`)

- `bg-surface-alt` page background
- **Desktop:** fixed left sidebar (filters) + right content area (sort bar + card grid)
  - Sidebar: white bg, `border-r border-slate-200`, filter sections with checkboxes styled to match design system
  - Grid: 3 columns, vehicle cards with full hover shadow transition
- **Mobile:** sticky filter/sort bar at top, single column cards
- Filter categories: Availability, Vehicle Type, Fuel Type, Platform Eligibility
- Sort dropdown: navy outline button with chevron
- Empty state: centered muted icon (e.g. car outline) + "No vehicles match your filters" heading + "Clear filters" text link. No illustration asset needed.

### 4.3 Car Detail Page (`/cars/[slug]`)

- Breadcrumb: `Home → Browse Cars → [Vehicle Name]`
- **Desktop two-column:**
  - Left (60%): large photo area (navy tint placeholder, 360px), specs table (two-column grid of icon + label + value), features list (green checkmarks), description
  - Right (40%): sticky pricing sidebar — price + period, deposit info, platform eligibility tags, availability badge, Apply CTA (full width navy), sub-text, "Join waitlist" text link if unavailable
- **Mobile:** photo → sticky bottom bar (price + Apply button), sections stacked below

### 4.4 Application Wizard (`/apply/[vehicleId]`)

- Clean centered layout, max-width 640px
- **Progress bar:** step dots (1–5) with navy fill for completed, navy ring for current, slate for upcoming. Step label below active dot.
- **Steps:**
  1. Vehicle confirmation — card summary of selected vehicle
  2. Personal information — form fields using updated input style
  3. License upload — drag-and-drop zone with dashed border, icon, instructions
  4. Insurance upload — same pattern
  5. Review & submit — summary of all entered info, acknowledgment checkbox, submit button
- Navigation: Back (ghost) left, Continue (navy primary) right
- No decorative elements between steps

### 4.5 Auth Pages (`/(auth)/login` and `/signup`)

- Centered card layout, max-width 400px, `bg-surface-alt` page
- White card, 8px radius, `shadow-card`, 32px padding
- Logo at top of card
- Headline + sub-label
- Form fields with updated input style
- Primary navy button full width
- Switch link: "Don't have an account? Sign up →"
- No social auth — JWT/email only

### 4.6 User Dashboard (`/dashboard`)

- **Sidebar nav:** white bg, `border-r border-slate-200`, logo top, nav items with active state (navy tint bg + navy text), user avatar bottom
- **Content area:** `bg-surface-alt`, page title + breadcrumb, content cards white bg

### 4.7 Admin Panel (`/admin`)

- Same sidebar pattern as user dashboard
- Table components: clean `border border-slate-200` tables, alternating `bg-surface-alt` rows, navy action buttons
- Status badges consistent with global badge system

### 4.8 Waitlist Page (`/waitlist/[vehicleId]`)

- Centered card layout similar to auth pages
- Vehicle summary card at top
- Simple email + phone form
- Navy submit button

---

## 5. Responsive Behavior

- **Breakpoints:** `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`
- Hero: stacked (mobile) → split (lg+)
- Vehicle grid: 1 col (mobile) → 2 col (md) → 3 col (lg)
- How It Works: 1 col accordion (mobile) → 4 col cards (lg)
- Nav: hamburger sheet (mobile) → inline (md+)
- Car detail: stacked (mobile) → two-column (lg+), sticky bottom CTA bar on mobile

---

## 6. Implementation Notes

- **Next.js version note:** This project uses a Next.js version with breaking changes. Before writing any code, read the relevant guide in `node_modules/next/dist/docs/`. APIs and conventions may differ from standard Next.js.
- Replace `globals.css` with new CSS custom properties for all tokens
- Override shadcn component defaults via `components.json` and direct className overrides — do not fork shadcn source files
- Google Fonts loaded via `next/font/google` in `layout.tsx`
- All page sections use semantic HTML (`<section>`, `<nav>`, `<main>`, `<footer>`)
- Images: use `next/image` with `priority` on hero vehicle image
- Animations: `transition-shadow duration-200` on card hover only — no entrance animations, no scroll reveals
