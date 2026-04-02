"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle, Clock, XCircle } from "lucide-react";

interface Payment {
  id: string; type: string; amountCents: number; status: string;
  paidAt?: string; createdAt: string;
  user: { firstName: string; lastName: string; email: string };
  application: { vehicle: { make: string; model: string; year: number } };
}

export default function AdminPaymentsPage() {
  const { token } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    // In a full implementation, add admin payments endpoint
    // For now use empty state
    setLoading(false);
  }, [token]);

  const total = payments.filter((p) => p.status === "succeeded").reduce((s, p) => s + p.amountCents, 0);

  return (
    <div>
      <div className="mb-7 flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-[#0D1F3C] tracking-tight"
          style={{ fontFamily: "var(--font-heading)" }}>
          Payments
        </h1>
        {total > 0 && (
          <div className="bg-[#DCFCE7] border border-[#15803D]/20 rounded-lg px-4 py-2">
            <p className="text-sm text-[#15803D] font-semibold">Total Received: ${(total / 100).toFixed(2)}</p>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-[#64748B]">Loading...</div>
      ) : payments.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-12 text-center">
          <p className="text-sm text-[#64748B]">No payment records yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F7F9FC]">
                <th className="text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider py-3 px-4 pr-4">Customer</th>
                <th className="text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider py-3 pr-4 hidden md:table-cell">Vehicle</th>
                <th className="text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider py-3 pr-4">Amount</th>
                <th className="text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider py-3 pr-4">Status</th>
                <th className="text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider py-3 pr-4 hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F7F9FC]">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-[#F7F9FC] transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-[#0D1F3C]">{p.user.firstName} {p.user.lastName}</p>
                    <p className="text-xs text-[#64748B]">{p.user.email}</p>
                  </td>
                  <td className="py-3 pr-4 text-sm text-[#64748B] hidden md:table-cell">
                    {p.application.vehicle.year} {p.application.vehicle.make}
                  </td>
                  <td className="py-3 pr-4 text-sm font-semibold text-[#0D1F3C]">
                    ${(p.amountCents / 100).toFixed(2)}
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                      p.status === "succeeded" ? "bg-[#DCFCE7] text-[#15803D]" :
                      p.status === "failed" ? "bg-[#FEE2E2] text-[#DC2626]" :
                      "bg-[#FEF9C3] text-[#854D0E]"
                    }`}>
                      {p.status === "succeeded" ? <CheckCircle className="inline h-3 w-3 mr-0.5" /> :
                       p.status === "failed" ? <XCircle className="inline h-3 w-3 mr-0.5" /> :
                       <Clock className="inline h-3 w-3 mr-0.5" />}
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-sm text-[#64748B] hidden lg:table-cell">
                    {new Date(p.paidAt || p.createdAt).toLocaleDateString()}
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
