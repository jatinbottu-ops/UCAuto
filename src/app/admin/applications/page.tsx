"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronRight } from "lucide-react";

interface Application {
  id: string;
  status: string;
  submittedAt?: string;
  createdAt: string;
  adminNotes?: string;
  personalInfo?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    dateOfBirth?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  } | null;
  licenseDocKey?: string | null;
  insuranceDocKey?: string | null;
  user: { firstName: string; lastName: string; email: string; phone?: string };
  vehicle: { make: string; model: string; year: number; weeklyPrice: number };
}

const statuses = ["submitted", "under_review", "approved", "payment_pending", "active", "waitlisted", "rejected"];

const statusColors: Record<string, string> = {
  submitted: "bg-[#FEF9C3] text-[#854D0E]",
  under_review: "bg-[#FEF9C3] text-[#854D0E]",
  approved: "bg-[#E8F0FE] text-[#1A3A6B]",
  payment_pending: "bg-[#FEF9C3] text-[#854D0E]",
  active: "bg-[#DCFCE7] text-[#15803D]",
  waitlisted: "bg-[#E8F0FE] text-[#1A3A6B]",
  rejected: "bg-[#FEE2E2] text-[#DC2626]",
  draft: "bg-[#F1F5F9] text-[#64748B]",
};

export default function AdminApplicationsPage() {
  const { token } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  const openApplication = (app: Application) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setNotes(app.adminNotes || "");
  };

  const formatDocumentName = (documentKey?: string | null) => {
    if (!documentKey) return null;

    const pathPart = documentKey.split("/").pop() || documentKey;
    const dashIndex = pathPart.indexOf("-");

    return dashIndex >= 0 ? pathPart.slice(dashIndex + 1) : pathPart;
  };

  useEffect(() => {
    if (!token) return;
    const url = filterStatus
      ? `/api/admin/applications?status=${filterStatus}`
      : "/api/admin/applications";
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => { setApplications(data.applications || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token, filterStatus]);

  const updateStatus = async () => {
    if (!selectedApp || !newStatus || !token) return;
    setUpdating(true);
    const res = await fetch(`/api/admin/applications/${selectedApp.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: newStatus, adminNotes: notes }),
    });
    if (res.ok) {
      setApplications((prev) =>
        prev.map((a) => a.id === selectedApp.id ? { ...a, status: newStatus, adminNotes: notes } : a)
      );
      setSelectedApp(null);
      setNewStatus("");
      setNotes("");
    }
    setUpdating(false);
  };

  return (
    <div>
      <div className="mb-7 flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-[#0D1F3C] tracking-tight"
          style={{ fontFamily: "var(--font-heading)" }}>
          Applications
        </h1>
        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setLoading(true); }}
          className="px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] bg-white"
        >
          <option value="">All Statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s} className="capitalize">{s.replace("_", " ")}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-[#64748B]">Loading...</div>
      ) : (
        <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F7F9FC]">
                <th className="text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider py-3 px-4 pr-4">Applicant</th>
                <th className="text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider py-3 pr-4 hidden md:table-cell">Vehicle</th>
                <th className="text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider py-3 pr-4">Status</th>
                <th className="text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider py-3 pr-4 hidden lg:table-cell">Date</th>
                <th className="text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider py-3 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F7F9FC]">
              {applications.map((app) => (
                <tr
                  key={app.id}
                  onClick={() => openApplication(app)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openApplication(app);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Review application from ${app.user.firstName} ${app.user.lastName}`}
                  className="hover:bg-[#F7F9FC] transition-colors cursor-pointer focus-visible:bg-[#F7F9FC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1A3A6B]"
                >
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-[#0D1F3C]">{app.user.firstName} {app.user.lastName}</p>
                    <p className="text-xs text-[#64748B]">{app.user.email}</p>
                  </td>
                  <td className="py-3 pr-4 text-sm text-[#64748B] hidden md:table-cell">
                    {app.vehicle.year} {app.vehicle.make} {app.vehicle.model}
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${statusColors[app.status] || "bg-[#F1F5F9] text-[#64748B]"}`}>
                      {app.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-sm text-[#64748B] hidden lg:table-cell">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 pr-4">
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        openApplication(app);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#1A3A6B] hover:text-[#122A52] transition-colors"
                    >
                      Open
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-[#64748B]">No applications found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Side drawer */}
      {selectedApp && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedApp(null)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl overflow-y-auto">
            <div className="p-6 border-b border-[#E2E8F0]">
              <h2 className="font-bold text-[#0D1F3C] text-lg">
                {selectedApp.user.firstName} {selectedApp.user.lastName}
              </h2>
              <p className="text-[#64748B] text-sm">{selectedApp.user.email}</p>
            </div>

            <div className="p-6 space-y-5">
              <div className="bg-white border border-[#E2E8F0] rounded-lg p-4">
                <h3 className="font-semibold text-[#0D1F3C] mb-3 text-sm">Applicant Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-[#64748B]">Name</span>
                    <span className="text-right text-[#0D1F3C] font-medium">
                      {selectedApp.personalInfo?.firstName || selectedApp.user.firstName} {selectedApp.personalInfo?.lastName || selectedApp.user.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#64748B]">Email</span>
                    <span className="text-right text-[#0D1F3C]">{selectedApp.user.email}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#64748B]">Phone</span>
                    <span className="text-right text-[#0D1F3C]">
                      {selectedApp.personalInfo?.phone || selectedApp.user.phone || "Not provided"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#64748B]">Date of Birth</span>
                    <span className="text-right text-[#0D1F3C]">
                      {selectedApp.personalInfo?.dateOfBirth || "Not provided"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 items-start">
                    <span className="text-[#64748B]">Address</span>
                    <span className="text-right text-[#0D1F3C]">
                      {selectedApp.personalInfo?.address
                        ? `${selectedApp.personalInfo.address}, ${selectedApp.personalInfo.city || ""}${selectedApp.personalInfo.city ? ", " : ""}${selectedApp.personalInfo.state || ""} ${selectedApp.personalInfo.zip || ""}`.trim()
                        : "Not provided"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#E2E8F0] rounded-lg p-4">
                <h3 className="font-semibold text-[#0D1F3C] mb-2 text-sm">Vehicle</h3>
                <p className="text-[#64748B] text-sm">
                  {selectedApp.vehicle.year} {selectedApp.vehicle.make} {selectedApp.vehicle.model}
                </p>
                <p className="text-sm font-semibold text-[#1A3A6B]">
                  ${(selectedApp.vehicle.weeklyPrice / 100).toFixed(0)}/week
                </p>
              </div>

              <div className="bg-white border border-[#E2E8F0] rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-[#0D1F3C] text-sm">Documents</h3>
                  <span className="text-xs text-[#64748B]">Demo upload references</span>
                </div>
                <div className="space-y-3">
                  <div className="rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] p-3">
                    <p className="text-sm font-medium text-[#0D1F3C]">Driver&apos;s License</p>
                    {selectedApp.licenseDocKey ? (
                      <>
                        <p className="text-sm text-[#1A3A6B] mt-1">{formatDocumentName(selectedApp.licenseDocKey)}</p>
                        <p className="text-xs text-[#64748B] mt-1 break-all">{selectedApp.licenseDocKey}</p>
                      </>
                    ) : (
                      <p className="text-sm text-[#64748B] mt-1">Not uploaded</p>
                    )}
                  </div>
                  <div className="rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] p-3">
                    <p className="text-sm font-medium text-[#0D1F3C]">Insurance Document</p>
                    {selectedApp.insuranceDocKey ? (
                      <>
                        <p className="text-sm text-[#1A3A6B] mt-1">{formatDocumentName(selectedApp.insuranceDocKey)}</p>
                        <p className="text-xs text-[#64748B] mt-1 break-all">{selectedApp.insuranceDocKey}</p>
                      </>
                    ) : (
                      <p className="text-sm text-[#64748B] mt-1">Not uploaded</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#E2E8F0] rounded-lg p-4">
                <h3 className="font-semibold text-[#0D1F3C] mb-3 text-sm">Submission</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-[#64748B]">Created</span>
                    <span className="text-right text-[#0D1F3C]">{new Date(selectedApp.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#64748B]">Submitted</span>
                    <span className="text-right text-[#0D1F3C]">
                      {selectedApp.submittedAt ? new Date(selectedApp.submittedAt).toLocaleString() : "Not submitted yet"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0D1F3C] mb-1">Update Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s} className="capitalize">{s.replace("_", " ")}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0D1F3C] mb-1">Admin Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3A6B]"
                  placeholder="Internal notes..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="flex-1 py-2.5 border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#0D1F3C] hover:bg-[#F7F9FC]"
                >
                  Cancel
                </button>
                <button
                  onClick={updateStatus}
                  disabled={updating}
                  className="flex-1 py-2.5 bg-[#1A3A6B] text-white rounded-lg text-sm font-medium hover:bg-[#122A52] disabled:opacity-50"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
