"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Bell } from "lucide-react";

interface WaitlistEntry {
  id: string; position: number; name?: string; email: string;
  phone?: string; createdAt: string; notifiedAt?: string;
  vehicle: { make: string; model: string; year: number };
}

export default function AdminWaitlistPage() {
  const { token } = useAuth();
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch("/api/waitlist", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => { setEntries(data.entries || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-xl font-extrabold text-[#0D1F3C] tracking-tight"
          style={{ fontFamily: "var(--font-heading)" }}>
          Waitlist
        </h1>
        <p className="text-xs text-[#64748B] mt-1">{entries.length} total entries</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-[#64748B]">Loading...</div>
      ) : entries.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-12 text-center">
          <Bell className="h-8 w-8 text-[#94A3B8] mx-auto mb-3" />
          <p className="text-sm text-[#64748B]">No waitlist entries</p>
        </div>
      ) : (
        <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F7F9FC]">
                <th className="text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider py-3 px-4 pr-4">#</th>
                <th className="text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider py-3 pr-4">Contact</th>
                <th className="text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider py-3 pr-4 hidden md:table-cell">Vehicle</th>
                <th className="text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider py-3 pr-4 hidden lg:table-cell">Joined</th>
                <th className="text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider py-3 pr-4">Notified</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F7F9FC]">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-[#F7F9FC] transition-colors">
                  <td className="px-4 py-3 text-sm font-semibold text-[#1A3A6B]">#{entry.position}</td>
                  <td className="py-3 pr-4">
                    <p className="text-sm font-medium text-[#0D1F3C]">{entry.name || "—"}</p>
                    <p className="text-xs text-[#64748B]">{entry.email}</p>
                    {entry.phone && <p className="text-xs text-[#64748B]">{entry.phone}</p>}
                  </td>
                  <td className="py-3 pr-4 text-sm text-[#64748B] hidden md:table-cell">
                    {entry.vehicle.year} {entry.vehicle.make} {entry.vehicle.model}
                  </td>
                  <td className="py-3 pr-4 text-sm text-[#64748B] hidden lg:table-cell">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 pr-4">
                    {entry.notifiedAt ? (
                      <span className="text-[10px] font-bold bg-[#DCFCE7] text-[#15803D] px-2 py-0.5 rounded">Notified</span>
                    ) : (
                      <span className="text-[10px] font-bold bg-[#F1F5F9] text-[#64748B] px-2 py-0.5 rounded">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
