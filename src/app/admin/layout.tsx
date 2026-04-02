"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

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
            <span className="text-xs font-extrabold text-[#0D1F3C] tracking-tight">Admin</span>
          </Link>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {[
            { href: "/admin", label: "Overview", icon: "⊞", exact: true },
            { href: "/admin/applications", label: "Applications", icon: "📋" },
            { href: "/admin/inventory", label: "Inventory", icon: "🚗" },
            { href: "/admin/payments", label: "Payments", icon: "💳" },
            { href: "/admin/verifications", label: "Verifications", icon: "✅" },
            { href: "/admin/waitlist", label: "Waitlist", icon: "⏳" },
          ].map(({ href, label, icon, exact }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                exact ? pathname === href : pathname.startsWith(href)
                  ? "bg-[#E8F0FE] text-[#1A3A6B] font-semibold"
                  : "text-[#64748B] hover:bg-[#E8F0FE] hover:text-[#1A3A6B]"
              }`}
            >
              <span>{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        {/* User + sign out */}
        <div className="px-4 py-4 border-t border-[#E2E8F0] space-y-3">
          {user && (
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#E8F0FE] flex items-center justify-center text-xs font-bold text-[#1A3A6B]">
                {user.firstName?.[0]}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#0D1F3C] truncate">{user.firstName} {user.lastName}</p>
                <p className="text-[10px] text-[#94A3B8]">Admin</p>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            className="text-xs font-medium text-[#94A3B8] hover:text-[#1A3A6B] transition-colors"
          >
            Sign out
          </button>
          <div>
            <Link
              href="/"
              className="text-xs font-medium text-[#94A3B8] hover:text-[#1A3A6B] transition-colors"
            >
              ← Back to site
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="lg:hidden bg-white border-b border-[#E2E8F0] px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-bold text-[#0D1F3C]">Admin</span>
          <button
            onClick={logout}
            className="text-xs font-medium text-[#94A3B8] hover:text-[#1A3A6B] transition-colors"
          >
            Sign out
          </button>
        </div>
        <div className="px-4 sm:px-8 py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
