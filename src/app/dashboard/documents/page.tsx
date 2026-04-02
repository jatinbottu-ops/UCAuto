"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  ShieldCheck,
  X,
  ExternalLink,
} from "lucide-react";

interface UserProfile {
  idDocumentKey: string | null;
  idVerified: boolean;
  idVerifiedAt: string | null;
  insuranceDocumentKey: string | null;
  insuranceVerified: boolean;
  insuranceVerifiedAt: string | null;
}

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

export default function DocumentsPage() {
  const { token } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [idStatus, setIdStatus] = useState<UploadStatus>("idle");
  const [idError, setIdError] = useState<string | null>(null);
  const [insuranceStatus, setInsuranceStatus] = useState<UploadStatus>("idle");
  const [insuranceError, setInsuranceError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch("/api/user/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        setProfile(data.user || null);
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

  const idUploaded = !!profile?.idDocumentKey;
  const idVerified = !!profile?.idVerified;
  const insuranceUploaded = !!profile?.insuranceDocumentKey;
  const insuranceVerified = !!profile?.insuranceVerified;

  return (
    <div>
      <div className="mb-7">
        <h1
          className="text-xl font-extrabold text-[#0D1F3C] tracking-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Documents
        </h1>
        <p className="text-sm text-[#94A3B8] mt-0.5">
          Upload and manage your identity and insurance documents.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-[#64748B]">Loading...</div>
      ) : (
        <div className="space-y-4">
          {/* Government-issued ID */}
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#E8F0FE] flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-[#1A3A6B]" />
                </div>
                <div>
                  <h2 className="font-semibold text-[#0D1F3C]">Government-Issued ID</h2>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    Driver's license or state ID (front). Images or PDF accepted.
                  </p>
                </div>
              </div>
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

            {idUploaded && profile?.idDocumentKey && (
              <div className="mb-4 p-3 bg-[#F7F9FC] border border-[#E2E8F0] rounded-lg">
                {/\.(jpg|jpeg|png|webp|gif)$/i.test(profile.idDocumentKey) && (
                  <img
                    src={profile.idDocumentKey}
                    alt="ID document"
                    className="max-h-40 object-contain rounded mb-3 w-full bg-white border border-[#E2E8F0]"
                  />
                )}
                <a
                  href={profile.idDocumentKey}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-[#1A3A6B] hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View uploaded document
                </a>
                {profile.idVerifiedAt && (
                  <p className="text-xs text-[#64748B] mt-1">
                    Verified {new Date(profile.idVerifiedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}

            {idError && (
              <p className="text-xs text-[#DC2626] mb-3 flex items-center gap-1">
                <X className="h-3.5 w-3.5" /> {idError}
              </p>
            )}
            {idStatus === "done" && (
              <p className="text-xs text-[#15803D] mb-3">Uploaded — pending admin review.</p>
            )}
            {!idVerified && (
              <UploadButton
                label={idUploaded ? "Replace ID" : "Upload ID"}
                uploading={idStatus === "uploading"}
                onSelect={(f) => uploadFile(f, "id")}
              />
            )}
          </div>

          {/* Auto Insurance */}
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#E8F0FE] flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-[#1A3A6B]" />
                </div>
                <div>
                  <h2 className="font-semibold text-[#0D1F3C]">Auto Insurance</h2>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    Insurance card or declarations page. Must show current coverage.
                  </p>
                </div>
              </div>
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

            {insuranceUploaded && profile?.insuranceDocumentKey && (
              <div className="mb-4 p-3 bg-[#F7F9FC] border border-[#E2E8F0] rounded-lg">
                {/\.(jpg|jpeg|png|webp|gif)$/i.test(profile.insuranceDocumentKey) && (
                  <img
                    src={profile.insuranceDocumentKey}
                    alt="Insurance document"
                    className="max-h-40 object-contain rounded mb-3 w-full bg-white border border-[#E2E8F0]"
                  />
                )}
                <a
                  href={profile.insuranceDocumentKey}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-[#1A3A6B] hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View uploaded document
                </a>
                {profile.insuranceVerifiedAt && (
                  <p className="text-xs text-[#64748B] mt-1">
                    Verified {new Date(profile.insuranceVerifiedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}

            {insuranceError && (
              <p className="text-xs text-[#DC2626] mb-3 flex items-center gap-1">
                <X className="h-3.5 w-3.5" /> {insuranceError}
              </p>
            )}
            {insuranceStatus === "done" && (
              <p className="text-xs text-[#15803D] mb-3">Uploaded — pending admin review.</p>
            )}
            {!insuranceVerified && (
              <UploadButton
                label={insuranceUploaded ? "Replace Insurance" : "Upload Insurance"}
                uploading={insuranceStatus === "uploading"}
                onSelect={(f) => uploadFile(f, "insurance")}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
