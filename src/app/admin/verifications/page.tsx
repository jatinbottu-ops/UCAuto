"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle, Clock, AlertCircle, ChevronRight, ExternalLink } from "lucide-react";

interface UserVerification {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  createdAt: string;
  idDocumentKey: string | null;
  idVerified: boolean;
  idVerifiedAt: string | null;
  insuranceDocumentKey: string | null;
  insuranceVerified: boolean;
  insuranceVerifiedAt: string | null;
}

type Filter = "pending" | "verified" | "all";

export default function AdminVerificationsPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<UserVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("pending");
  const [selected, setSelected] = useState<UserVerification | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch(`/api/admin/verifications?filter=${filter}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token, filter]);

  const verify = async (
    userId: string,
    field: "idVerified" | "insuranceVerified",
    value: boolean
  ) => {
    setSaving(true);
    const res = await fetch(`/api/admin/users/${userId}/verify`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ [field]: value }),
    });
    if (res.ok) {
      const { user: updated } = await res.json();
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...updated } : u)));
      setSelected((prev) => (prev?.id === userId ? { ...prev, ...updated } : prev));
    }
    setSaving(false);
  };

  const getOverallStatus = (u: UserVerification) => {
    if (u.idVerified && u.insuranceVerified) return "verified";
    if (u.idDocumentKey || u.insuranceDocumentKey) return "pending";
    return "none";
  };

  return (
    <div>
      <div className="mb-7 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-[#0D1F3C] tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}>
            Verifications
          </h1>
          <p className="text-xs text-[#64748B] mt-1">Review and verify customer ID and insurance documents.</p>
        </div>
        <div className="flex gap-2">
          {(["pending", "verified", "all"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setSelected(null); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                filter === f
                  ? "bg-[#1A3A6B] text-white"
                  : "bg-white border border-[#E2E8F0] text-[#0D1F3C] hover:bg-[#F7F9FC]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-[#64748B]">Loading...</div>
      ) : (
        <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F7F9FC]">
                <th className="text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider py-3 px-4 pr-4">Customer</th>
                <th className="text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider py-3 pr-4 hidden md:table-cell">ID</th>
                <th className="text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider py-3 pr-4 hidden md:table-cell">Insurance</th>
                <th className="text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider py-3 pr-4">Status</th>
                <th className="text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider py-3 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F7F9FC]">
              {users.map((u) => {
                const overall = getOverallStatus(u);
                return (
                  <tr
                    key={u.id}
                    className="hover:bg-[#F7F9FC] transition-colors cursor-pointer"
                    onClick={() => setSelected(u)}
                  >
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-[#0D1F3C]">{u.firstName} {u.lastName}</p>
                      <p className="text-xs text-[#64748B]">{u.email}</p>
                    </td>
                    <td className="py-3 pr-4 hidden md:table-cell">
                      {u.idDocumentKey ? (
                        u.idVerified
                          ? <span className="flex items-center gap-1 text-xs text-[#15803D]"><CheckCircle className="h-3.5 w-3.5" /> Verified</span>
                          : <span className="flex items-center gap-1 text-xs text-[#854D0E]"><Clock className="h-3.5 w-3.5" /> Pending</span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-[#64748B]"><AlertCircle className="h-3.5 w-3.5" /> None</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 hidden md:table-cell">
                      {u.insuranceDocumentKey ? (
                        u.insuranceVerified
                          ? <span className="flex items-center gap-1 text-xs text-[#15803D]"><CheckCircle className="h-3.5 w-3.5" /> Verified</span>
                          : <span className="flex items-center gap-1 text-xs text-[#854D0E]"><Clock className="h-3.5 w-3.5" /> Pending</span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-[#64748B]"><AlertCircle className="h-3.5 w-3.5" /> None</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        overall === "verified"
                          ? "bg-[#DCFCE7] text-[#15803D]"
                          : overall === "pending"
                          ? "bg-[#FEF9C3] text-[#854D0E]"
                          : "bg-[#F1F5F9] text-[#64748B]"
                      }`}>
                        {overall === "verified" ? "Fully Verified" : overall === "pending" ? "Pending Review" : "No Documents"}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelected(u); }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#1A3A6B] hover:text-[#122A52] transition-colors"
                      >
                        Review <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-[#64748B]">
                    No customers found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Side drawer */}
      {selected && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl overflow-y-auto">
            <div className="p-6 border-b border-[#E2E8F0]">
              <h2 className="font-bold text-[#0D1F3C] text-lg">{selected.firstName} {selected.lastName}</h2>
              <p className="text-[#64748B] text-sm">{selected.email}</p>
              {selected.phone && <p className="text-[#64748B] text-sm">{selected.phone}</p>}
            </div>

            <div className="p-6 space-y-5">
              {/* ID document */}
              <div className="bg-white border border-[#E2E8F0] rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-[#0D1F3C] text-sm">Government-Issued ID</h3>
                  {selected.idVerified ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded">
                      <CheckCircle className="h-3 w-3" /> Verified
                    </span>
                  ) : selected.idDocumentKey ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#854D0E] bg-[#FEF9C3] px-2 py-0.5 rounded">
                      <Clock className="h-3 w-3" /> Pending
                    </span>
                  ) : null}
                </div>

                {selected.idDocumentKey ? (
                  <>
                    <a
                      href={selected.idDocumentKey}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-[#1A3A6B] hover:underline mb-4"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View ID Document
                    </a>
                    {/\.(jpg|jpeg|png|webp|gif)$/i.test(selected.idDocumentKey) && (
                      <img
                        src={selected.idDocumentKey}
                        alt="ID document"
                        className="rounded-lg border border-[#E2E8F0] max-h-48 object-contain mb-4 w-full bg-[#F7F9FC]"
                      />
                    )}
                    <div className="flex gap-2">
                      <button
                        disabled={saving || selected.idVerified}
                        onClick={() => verify(selected.id, "idVerified", true)}
                        className="flex-1 py-2 bg-[#1A3A6B] text-white text-sm font-semibold rounded-lg hover:bg-[#122A52] disabled:opacity-50 transition-colors"
                      >
                        {selected.idVerified ? "Verified" : "Approve ID"}
                      </button>
                      {selected.idVerified && (
                        <button
                          disabled={saving}
                          onClick={() => verify(selected.id, "idVerified", false)}
                          className="flex-1 py-2 border border-[#E2E8F0] text-[#DC2626] text-sm font-semibold rounded-lg hover:bg-[#FEE2E2] disabled:opacity-50 transition-colors"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                    {selected.idVerifiedAt && (
                      <p className="text-xs text-[#64748B] mt-2">
                        Verified {new Date(selected.idVerifiedAt).toLocaleString()}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-[#64748B]">No document uploaded yet.</p>
                )}
              </div>

              {/* Insurance document */}
              <div className="bg-white border border-[#E2E8F0] rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-[#0D1F3C] text-sm">Auto Insurance</h3>
                  {selected.insuranceVerified ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded">
                      <CheckCircle className="h-3 w-3" /> Verified
                    </span>
                  ) : selected.insuranceDocumentKey ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#854D0E] bg-[#FEF9C3] px-2 py-0.5 rounded">
                      <Clock className="h-3 w-3" /> Pending
                    </span>
                  ) : null}
                </div>

                {selected.insuranceDocumentKey ? (
                  <>
                    <a
                      href={selected.insuranceDocumentKey}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-[#1A3A6B] hover:underline mb-4"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Insurance Document
                    </a>
                    {/\.(jpg|jpeg|png|webp|gif)$/i.test(selected.insuranceDocumentKey) && (
                      <img
                        src={selected.insuranceDocumentKey}
                        alt="Insurance document"
                        className="rounded-lg border border-[#E2E8F0] max-h-48 object-contain mb-4 w-full bg-[#F7F9FC]"
                      />
                    )}
                    <div className="flex gap-2">
                      <button
                        disabled={saving || selected.insuranceVerified}
                        onClick={() => verify(selected.id, "insuranceVerified", true)}
                        className="flex-1 py-2 bg-[#1A3A6B] text-white text-sm font-semibold rounded-lg hover:bg-[#122A52] disabled:opacity-50 transition-colors"
                      >
                        {selected.insuranceVerified ? "Verified" : "Approve Insurance"}
                      </button>
                      {selected.insuranceVerified && (
                        <button
                          disabled={saving}
                          onClick={() => verify(selected.id, "insuranceVerified", false)}
                          className="flex-1 py-2 border border-[#E2E8F0] text-[#DC2626] text-sm font-semibold rounded-lg hover:bg-[#FEE2E2] disabled:opacity-50 transition-colors"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                    {selected.insuranceVerifiedAt && (
                      <p className="text-xs text-[#64748B] mt-2">
                        Verified {new Date(selected.insuranceVerifiedAt).toLocaleString()}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-[#64748B]">No document uploaded yet.</p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelected(null)}
                  className="flex-1 py-2.5 border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#0D1F3C] hover:bg-[#F7F9FC]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
