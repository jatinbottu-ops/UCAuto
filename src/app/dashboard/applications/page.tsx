"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { AvailabilityBadge } from "@/components/vehicles/AvailabilityBadge";

interface Application {
  id: string;
  status: string;
  createdAt: string;
  submittedAt?: string;
  vehicle: { make: string; model: string; year: number; weeklyPrice: number };
}

const statusMap: Record<string, "available" | "limited" | "rented" | "waitlist"> = {
  active: "available",
  approved: "available",
  submitted: "limited",
  under_review: "limited",
  payment_pending: "limited",
  waitlisted: "waitlist",
  rejected: "rented",
  draft: "waitlist",
};

export default function ApplicationsPage() {
  const { token } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch("/api/applications", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => { setApplications(data.applications || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  return (
    <>
      <Navbar />
      <div className="pt-16 lg:pt-20 min-h-screen bg-[#F7F9FC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Page heading */}
          <div className="mb-7 flex items-start justify-between gap-4">
            <div>
              <h1
                className="text-xl font-extrabold text-[#0D1F3C] tracking-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                My Applications
              </h1>
              <p className="text-sm text-[#94A3B8] mt-0.5">Track the status of all your rental applications.</p>
            </div>
            <Link
              href="/cars"
              className="inline-flex items-center px-4 py-2 bg-[#1A3A6B] text-white text-sm font-semibold rounded-md hover:bg-[#122A52] transition-colors"
            >
              Apply for a Car
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12 text-[#94A3B8] text-sm">Loading...</div>
          ) : applications.length === 0 ? (
            <div className="bg-white border border-[#E2E8F0] rounded-lg p-12 text-center">
              <p className="text-sm font-semibold text-[#0D1F3C] mb-1">No applications yet</p>
              <p className="text-xs text-[#94A3B8] mb-4">Find a car you like and submit your first application.</p>
              <Link
                href="/cars"
                className="text-sm font-semibold text-[#1A3A6B] hover:text-[#122A52] transition-colors"
              >
                Browse available cars →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="bg-white border border-[#E2E8F0] rounded-lg p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-[#0D1F3C]">
                        {app.vehicle.year} {app.vehicle.make} {app.vehicle.model}
                      </h3>
                      <p className="text-sm text-[#64748B] mt-1">
                        ${(app.vehicle.weeklyPrice / 100).toFixed(0)}/week ·{" "}
                        Applied {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <AvailabilityBadge status={statusMap[app.status] || "waitlist"} />
                      {app.status === "draft" && (
                        <Link
                          href={`/apply/${app.id}`}
                          className="inline-flex items-center px-4 py-2 bg-[#1A3A6B] text-white text-sm font-semibold rounded-md hover:bg-[#122A52] transition-colors"
                        >
                          Continue
                        </Link>
                      )}
                      {app.status === "approved" && (
                        <Link
                          href={`/checkout/${app.id}`}
                          className="inline-flex items-center px-4 py-2 bg-[#1B7A3E] text-white text-sm font-semibold rounded-md hover:bg-[#155f30] transition-colors"
                        >
                          Pay Now
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
