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
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="text-center py-3 border border-white/20 text-white rounded-md font-semibold hover:bg-white/10 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    Admin
                  </Link>
                )}
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
