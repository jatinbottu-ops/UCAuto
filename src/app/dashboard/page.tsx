"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import {
  Car,
  FileText,
  CreditCard,
  Clock,
  ArrowRight,
  Upload,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  X,
} from "lucide-react";

interface Application {
  id: string;
  status: string;
  vehicle: { make: string; model: string; year: number };
  payments: Array<{ status: string; amountCents: number; type: string }>;
}

interface UserProfile {
  idDocumentKey: string | null;
  idVerified: boolean;
  insuranceDocumentKey: string | null;
  insuranceVerified: boolean;
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  draft: { label: "Draft", color: "text-[#64748B]", bg: "bg-[#F1F5F9]" },
  submitted: { label: "Submitted", color: "text-[#D97706]", bg: "bg-[#FFF7ED]" },
  under_review: { label: "Under Review", color: "text-[#D97706]", bg: "bg-[#FFF7ED]" },
  approved: { label: "Approved", color: "text-[#1A3A6B]", bg: "bg-[#E8F0FE]" },
  payment_pending: { label: "Payment Pending", color: "text-[#D97706]", bg: "bg-[#FFF7ED]" },
  active: { label: "Active", color: "text-[#15803D]", bg: "bg-[#DCFCE7]" },
  waitlisted: { label: "Waitlisted", color: "text-[#64748B]", bg: "bg-[#F1F5F9]" },
  rejected: { label: "Rejected", color: "text-[#DC2626]", bg: "bg-[#FEE2E2]" },
};

type UploadStatus = "idle" | "uploading" | "done" | "error";

function UploadButton({
  label,
  uploading,
  onSelect,
}: {
  label: string;
  uploading: boolean;
  onSelect: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-[#E8F0FE] text-[#1A3A6B] rounded hover:bg-[#E2E8F0] transition-colors disabled:opacity-50"
      >
        <Upload className="h-3.5 w-3.5" />
        {uploading ? "Uploading..." : label}
      </button>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/*,.pdf"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onSelect(f);
          e.target.value = "";
        }}
      />
    </>
  );
}

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [idStatus, setIdStatus] = useState<UploadStatus>("idle");
  const [idError, setIdError] = useState<string | null>(null);
  const [insuranceStatus, setInsuranceStatus] = useState<UploadStatus>("idle");
  const [insuranceError, setInsuranceError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      fetch("/api/applications", { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch("/api/user/profile", { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
    ])
      .then(([appData, profileData]) => {
        setApplications(appData.applications || []);
        setProfile(profileData.user || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  const uploadFile = async (file: File, type: "id" | "insurance") => {
    const setStatus = type === "id" ? setIdStatus : setInsuranceStatus;
    const setError = type === "id" ? setIdError : setInsuranceError;
    const endpoint = type === "id" ? "/api/user/upload-id" : "/api/user/upload-insurance";

    setStatus("uploading");
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed");
        setStatus("error");
        return;
      }
      setStatus("done");
      // Refresh profile
      const profileRes = await fetch("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profileData = await profileRes.json();
      setProfile(profileData.user || null);
    } catch {
      setError("Upload failed. Please try again.");
      setStatus("error");
    }
  };

  const activeApp = applications.find((a) => a.status === "active");
  const pendingApp = applications.find((a) =>
    ["submitted", "under_review", "approved", "payment_pending"].includes(a.status)
  );
  const latestApp = applications[0];

  const idUploaded = !!profile?.idDocumentKey;
  const idVerified = !!profile?.idVerified;
  const insuranceUploaded = !!profile?.insuranceDocumentKey;
  const insuranceVerified = !!profile?.insuranceVerified;
  const fullyVerified = idVerified && insuranceVerified;

  return (
    <>
      <Navbar />
      <div className="pt-16 lg:pt-20 min-h-screen bg-[#F7F9FC]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Welcome */}
          <div className="mb-7">
            <h1
              className="text-xl font-extrabold text-[#0D1F3C] tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-sm text-[#94A3B8] mt-0.5">Manage your rental applications and account.</p>
          </div>

          {/* Verification banner */}
          {!loading && !fullyVerified && (
            <div className="mb-6 bg-white border border-[#E2E8F0] rounded-lg p-5 flex items-start gap-4">
              <ShieldAlert className="h-6 w-6 text-[#1A3A6B] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#0D1F3C]">Verification required to rent</p>
                <p className="text-sm text-[#94A3B8] mt-0.5">
                  You must upload your ID and insurance documents and have them verified by our team before you can apply for a vehicle.
                </p>
              </div>
            </div>
          )}

          {/* Status cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white border border-[#E2E8F0] rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-[#E8F0FE] flex items-center justify-center">
                  <FileText className="h-5 w-5 text-[#1A3A6B]" />
                </div>
                <span className="text-sm text-[#64748B]">Applications</span>
              </div>
              <p className="text-2xl font-bold text-[#0D1F3C]">{applications.length}</p>
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-[#DCFCE7] flex items-center justify-center">
                  <Car className="h-5 w-5 text-[#15803D]" />
                </div>
                <span className="text-sm text-[#64748B]">Active Rental</span>
              </div>
              <p className="text-2xl font-bold text-[#0D1F3C]">{activeApp ? "Yes" : "None"}</p>
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-[#FFF7ED] flex items-center justify-center">
                  <Clock className="h-5 w-5 text-[#D97706]" />
                </div>
                <span className="text-sm text-[#64748B]">Pending</span>
              </div>
              <p className="text-2xl font-bold text-[#0D1F3C]">{pendingApp ? "1" : "0"}</p>
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-[#E8F0FE] flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-[#1A3A6B]" />
                </div>
                <span className="text-sm text-[#64748B]">Total Payments</span>
              </div>
              <p className="text-2xl font-bold text-[#0D1F3C]">
                {applications.reduce(
                  (sum, a) => sum + a.payments.filter((p) => p.status === "succeeded").length,
                  0
                )}
              </p>
            </div>
          </div>

          {/* Verification section */}
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-5">
              <ShieldCheck className="h-5 w-5 text-[#1A3A6B]" />
              <h2 className="font-bold text-[#0D1F3C]">Identity &amp; Insurance Verification</h2>
              {fullyVerified && (
                <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded bg-[#DCFCE7] text-[#15803D] flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" /> Verified
                </span>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* ID card */}
              <div className="border border-[#E2E8F0] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-sm text-[#0D1F3C]">Government-Issued ID</p>
                  {idVerified ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded">
                      <CheckCircle className="h-3.5 w-3.5" /> Verified
                    </span>
                  ) : idUploaded ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#D97706] bg-[#FFF7ED] px-2 py-0.5 rounded">
                      <Clock className="h-3.5 w-3.5" /> Pending review
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded">
                      <AlertCircle className="h-3.5 w-3.5" /> Not uploaded
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#94A3B8] mb-3">
                  Driver&apos;s license or state ID (front). Images or PDF accepted.
                </p>
                {idError && (
                  <p className="text-xs text-[#DC2626] mb-2 flex items-center gap-1">
                    <X className="h-3.5 w-3.5" /> {idError}
                  </p>
                )}
                {!idVerified && (
                  <UploadButton
                    label={idUploaded ? "Replace ID" : "Upload ID"}
                    uploading={idStatus === "uploading"}
                    onSelect={(f) => uploadFile(f, "id")}
                  />
                )}
                {idStatus === "done" && (
                  <p className="text-xs text-[#15803D] mt-1.5">Uploaded — pending admin review.</p>
                )}
              </div>

              {/* Insurance card */}
              <div className="border border-[#E2E8F0] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-sm text-[#0D1F3C]">Auto Insurance</p>
                  {insuranceVerified ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded">
                      <CheckCircle className="h-3.5 w-3.5" /> Verified
                    </span>
                  ) : insuranceUploaded ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#D97706] bg-[#FFF7ED] px-2 py-0.5 rounded">
                      <Clock className="h-3.5 w-3.5" /> Pending review
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded">
                      <AlertCircle className="h-3.5 w-3.5" /> Not uploaded
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#94A3B8] mb-3">
                  Insurance card or declarations page. Must show current coverage.
                </p>
                {insuranceError && (
                  <p className="text-xs text-[#DC2626] mb-2 flex items-center gap-1">
                    <X className="h-3.5 w-3.5" /> {insuranceError}
                  </p>
                )}
                {!insuranceVerified && (
                  <UploadButton
                    label={insuranceUploaded ? "Replace Insurance" : "Upload Insurance"}
                    uploading={insuranceStatus === "uploading"}
                    onSelect={(f) => uploadFile(f, "insurance")}
                  />
                )}
                {insuranceStatus === "done" && (
                  <p className="text-xs text-[#15803D] mt-1.5">Uploaded — pending admin review.</p>
                )}
              </div>
            </div>
          </div>

          {/* Current application */}
          {latestApp && (
            <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 mb-6">
              <h2
                className="text-xl font-extrabold text-[#0D1F3C] tracking-tight mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Latest Application
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-[#0D1F3C]">
                    {latestApp.vehicle.year} {latestApp.vehicle.make} {latestApp.vehicle.model}
                  </p>
                  <div className="mt-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        statusConfig[latestApp.status]?.bg
                      } ${statusConfig[latestApp.status]?.color}`}
                    >
                      {statusConfig[latestApp.status]?.label || latestApp.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  {latestApp.status === "draft" && (
                    <Link
                      href={`/apply/${latestApp.id}`}
                      className="inline-flex items-center px-4 py-2 bg-[#1A3A6B] text-white text-sm font-semibold rounded-md hover:bg-[#122A52] transition-colors"
                    >
                      Continue Application
                    </Link>
                  )}
                  {latestApp.status === "approved" && (
                    <Link
                      href={`/checkout/${latestApp.id}`}
                      className="inline-flex items-center px-4 py-2 bg-[#1B7A3E] text-white text-sm font-semibold rounded-md hover:bg-[#155f30] transition-colors"
                    >
                      Complete Payment
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Quick actions */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <Link
              href="/cars"
              className="flex items-center justify-between bg-white rounded-lg border border-[#E2E8F0] p-5 hover:border-[#1A3A6B] transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Car className="h-5 w-5 text-[#1A3A6B]" />
                <span className="font-medium text-[#0D1F3C]">Browse Cars</span>
              </div>
              <ArrowRight className="h-4 w-4 text-[#94A3B8] group-hover:text-[#1A3A6B] transition-colors" />
            </Link>
            <Link
              href="/dashboard/applications"
              className="flex items-center justify-between bg-white rounded-lg border border-[#E2E8F0] p-5 hover:border-[#1A3A6B] transition-colors group"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-[#1A3A6B]" />
                <span className="font-medium text-[#0D1F3C]">My Applications</span>
              </div>
              <ArrowRight className="h-4 w-4 text-[#94A3B8] group-hover:text-[#1A3A6B] transition-colors" />
            </Link>
            <Link
              href="/dashboard/payments"
              className="flex items-center justify-between bg-white rounded-lg border border-[#E2E8F0] p-5 hover:border-[#1A3A6B] transition-colors group"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-[#1A3A6B]" />
                <span className="font-medium text-[#0D1F3C]">Payment History</span>
              </div>
              <ArrowRight className="h-4 w-4 text-[#94A3B8] group-hover:text-[#1A3A6B] transition-colors" />
            </Link>
          </div>

          {/* No applications CTA */}
          {!loading && applications.length === 0 && (
            <div className="bg-white border border-[#E2E8F0] rounded-lg p-12 text-center">
              <div className="w-16 h-16 rounded-lg bg-[#E8F0FE] flex items-center justify-center mx-auto mb-4">
                <Car className="h-8 w-8 text-[#1A3A6B]" />
              </div>
              <p className="text-sm font-semibold text-[#0D1F3C] mb-1">No applications yet</p>
              <p className="text-xs text-[#94A3B8] mb-4">Browse our fleet and apply for a rental vehicle.</p>
              <Link
                href="/cars"
                className="text-sm font-semibold text-[#1A3A6B] hover:text-[#122A52] transition-colors"
              >
                Browse Cars →
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
