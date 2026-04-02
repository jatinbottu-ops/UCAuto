"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle, Clock, XCircle } from "lucide-react";

interface Payment {
  id: string;
  type: string;
  amountCents: number;
  status: string;
  paidAt?: string;
  createdAt: string;
  application: { vehicle: { make: string; model: string; year: number } };
}

const statusIcon = {
  succeeded: <CheckCircle className="h-4 w-4 text-[#15803D]" />,
  pending: <Clock className="h-4 w-4 text-[#D97706]" />,
  failed: <XCircle className="h-4 w-4 text-[#DC2626]" />,
  processing: <Clock className="h-4 w-4 text-[#D97706]" />,
  refunded: <CheckCircle className="h-4 w-4 text-[#64748B]" />,
};

export default function PaymentsPage() {
  const { token } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch("/api/payments/my", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => { setPayments(data.payments || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  const total = payments.filter((p) => p.status === "succeeded").reduce((s, p) => s + p.amountCents, 0);

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
                Payment History
              </h1>
              <p className="text-sm text-[#94A3B8] mt-0.5">All charges and payments for your rentals.</p>
            </div>
            {total > 0 && (
              <p className="text-sm text-[#64748B] shrink-0">
                Total paid:{" "}
                <strong className="text-[#0D1F3C] font-bold">${(total / 100).toFixed(2)}</strong>
              </p>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12 text-[#94A3B8] text-sm">Loading...</div>
          ) : payments.length === 0 ? (
            <div className="bg-white border border-[#E2E8F0] rounded-lg p-12 text-center">
              <p className="text-sm font-semibold text-[#0D1F3C] mb-1">No payments yet</p>
              <p className="text-xs text-[#94A3B8] mb-4">Your payment history will appear here once you complete a rental payment.</p>
            </div>
          ) : (
            <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#F1F5F9]">
                    <th className="text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider py-3 px-6 pr-4">
                      Vehicle
                    </th>
                    <th className="text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider py-3 pr-4">
                      Type
                    </th>
                    <th className="text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider py-3 pr-4">
                      Amount
                    </th>
                    <th className="text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider py-3 pr-4">
                      Status
                    </th>
                    <th className="text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider py-3 pr-4">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F7F9FC]">
                  {payments.map((p) => (
                    <tr key={p.id}>
                      <td className="py-3 px-6 pr-4 text-sm text-[#0D1F3C]">
                        {p.application.vehicle.year} {p.application.vehicle.make} {p.application.vehicle.model}
                      </td>
                      <td className="py-3 pr-4 text-sm text-[#64748B] capitalize">{p.type.replace("_", " ")}</td>
                      <td className="py-3 pr-4 text-sm font-semibold text-[#0D1F3C]">
                        ${(p.amountCents / 100).toFixed(2)}
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-1.5">
                          {statusIcon[p.status as keyof typeof statusIcon]}
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              p.status === "succeeded"
                                ? "bg-[#DCFCE7] text-[#15803D]"
                                : p.status === "failed"
                                ? "bg-[#FEE2E2] text-[#DC2626]"
                                : "bg-[#F1F5F9] text-[#64748B]"
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-sm text-[#64748B]">
                        {new Date(p.paidAt || p.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
