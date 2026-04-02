"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Car, FileText, Users, CreditCard, CheckCircle, Clock, AlertTriangle } from "lucide-react";

interface Stats {
  totalVehicles: number;
  availableVehicles: number;
  pendingApplications: number;
  activeRentals: number;
  waitlistCount: number;
  revenueThisMonth: number;
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalVehicles: 0, availableVehicles: 0, pendingApplications: 0,
    activeRentals: 0, waitlistCount: 0, revenueThisMonth: 0,
  });
  const [recentApps, setRecentApps] = useState<Array<{
    id: string; status: string; createdAt: string;
    user: { firstName: string; lastName: string; email: string };
    vehicle: { make: string; model: string; year: number };
  }>>([]);

  useEffect(() => {
    if (!token) return;

    // Fetch applications for stats
    fetch("/api/admin/applications", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        const apps = data.applications || [];
        setRecentApps(apps.slice(0, 5));
        setStats((prev) => ({
          ...prev,
          pendingApplications: apps.filter((a: { status: string }) =>
            ["submitted", "under_review"].includes(a.status)
          ).length,
          activeRentals: apps.filter((a: { status: string }) => a.status === "active").length,
        }));
      });

    // Fetch vehicles for stats
    fetch("/api/vehicles", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        const vehicles = data.vehicles || [];
        setStats((prev) => ({
          ...prev,
          totalVehicles: vehicles.length,
          availableVehicles: vehicles.filter((v: { status: string }) =>
            ["available", "limited"].includes(v.status)
          ).length,
        }));
      });
  }, [token]);

  const statusConfig: Record<string, { label: string; icon: React.ReactNode; badgeClass: string }> = {
    submitted: { label: "Submitted", icon: <Clock className="h-3 w-3" />, badgeClass: "bg-[#FEF9C3] text-[#854D0E]" },
    under_review: { label: "Under Review", icon: <AlertTriangle className="h-3 w-3" />, badgeClass: "bg-[#FEF9C3] text-[#854D0E]" },
    approved: { label: "Approved", icon: <CheckCircle className="h-3 w-3" />, badgeClass: "bg-[#E8F0FE] text-[#1A3A6B]" },
    active: { label: "Active", icon: <CheckCircle className="h-3 w-3" />, badgeClass: "bg-[#DCFCE7] text-[#15803D]" },
    rejected: { label: "Rejected", icon: <AlertTriangle className="h-3 w-3" />, badgeClass: "bg-[#FEE2E2] text-[#DC2626]" },
    draft: { label: "Draft", icon: <Clock className="h-3 w-3" />, badgeClass: "bg-[#F1F5F9] text-[#64748B]" },
  };

  const metricCards = [
    { label: "Total Vehicles", value: stats.totalVehicles, icon: Car, bg: "bg-[#E8F0FE]", color: "text-[#1A3A6B]" },
    { label: "Available", value: stats.availableVehicles, icon: CheckCircle, bg: "bg-[#DCFCE7]", color: "text-[#15803D]" },
    { label: "Pending Review", value: stats.pendingApplications, icon: FileText, bg: "bg-[#FEF9C3]", color: "text-[#854D0E]" },
    { label: "Active Rentals", value: stats.activeRentals, icon: Car, bg: "bg-[#DCFCE7]", color: "text-[#15803D]" },
    { label: "Waitlisted", value: stats.waitlistCount, icon: Users, bg: "bg-[#E8F0FE]", color: "text-[#1A3A6B]" },
    { label: "Revenue (Mo.)", value: `$${(stats.revenueThisMonth / 100).toFixed(0)}`, icon: CreditCard, bg: "bg-[#DCFCE7]", color: "text-[#15803D]" },
  ];

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-xl font-extrabold text-[#0D1F3C] tracking-tight"
          style={{ fontFamily: "var(--font-heading)" }}>
          Admin Overview
        </h1>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {metricCards.map((m) => (
          <div key={m.label} className="bg-white border border-[#E2E8F0] rounded-lg p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-md ${m.bg} flex items-center justify-center`}>
                <m.icon className={`h-4 w-4 ${m.color}`} />
              </div>
              <span className="text-xs font-medium text-[#64748B]">{m.label}</span>
            </div>
            <p className="text-2xl font-bold text-[#0D1F3C]">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg">
        <div className="px-6 py-4 border-b border-[#E2E8F0]">
          <h2 className="text-sm font-bold text-[#0D1F3C]">Recent Applications</h2>
        </div>
        {recentApps.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-[#64748B]">No applications yet</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-[#F7F9FC]">
                <th className="text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider py-3 px-6 pr-4">Applicant</th>
                <th className="text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider py-3 pr-4 hidden md:table-cell">Vehicle</th>
                <th className="text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider py-3 pr-4">Status</th>
                <th className="text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider py-3 pr-4 hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F7F9FC]">
              {recentApps.map((app) => {
                const sc = statusConfig[app.status] || { label: app.status, icon: null, badgeClass: "bg-[#F1F5F9] text-[#64748B]" };
                return (
                  <tr key={app.id} className="hover:bg-[#F7F9FC] transition-colors">
                    <td className="py-3 px-6 pr-4">
                      <p className="text-sm font-medium text-[#0D1F3C]">
                        {app.user.firstName} {app.user.lastName}
                      </p>
                      <p className="text-xs text-[#64748B]">{app.user.email}</p>
                    </td>
                    <td className="py-3 pr-4 text-sm text-[#64748B] hidden md:table-cell">
                      {app.vehicle.year} {app.vehicle.make} {app.vehicle.model}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${sc.badgeClass}`}>
                        {sc.label}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-sm text-[#64748B] hidden lg:table-cell">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
