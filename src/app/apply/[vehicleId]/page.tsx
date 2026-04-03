"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle, Upload, X, ShieldAlert } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

const STEPS = [
  { label: "Vehicle" },
  { label: "Personal Info" },
  { label: "License" },
  { label: "Insurance" },
  { label: "Review" },
];

const personalSchema = z.object({
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  phone: z.string().min(10, "Valid phone required"),
  dateOfBirth: z.string().min(1, "Date of birth required"),
  address: z.string().min(1, "Address required"),
  city: z.string().min(1, "City required"),
  state: z.string().min(1, "State required"),
  zip: z.string().min(5, "ZIP code required"),
});

type PersonalData = z.infer<typeof personalSchema>;

interface UploadState {
  status: "idle" | "uploading" | "success" | "error";
  progress: number;
  filename?: string;
  key?: string;
  error?: string;
}

function DocumentUpload({
  label,
  accept,
  onUpload,
  uploadState,
}: {
  label: string;
  accept: string;
  onUpload: (file: File) => void;
  uploadState: UploadState;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
  };

  return (
    <div className="border-2 border-dashed border-[#E2E8F0] rounded-lg p-8 text-center hover:border-[#1A3A6B] transition-colors">
      {uploadState.status === "idle" && (
        <>
          <Upload className="h-10 w-10 text-[#64748B] mx-auto mb-3" />
          <p className="text-[#1E293B] font-medium mb-1">{label}</p>
          <p className="text-[#64748B] text-sm mb-4">Drag & drop or tap to select</p>
          <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-[#EBF0F8] text-[#1A3A6B] rounded-lg text-sm font-medium hover:bg-[#E2E8F0] transition-colors">
            Select File
            <input type="file" accept={accept} onChange={handleChange} className="hidden" />
          </label>
        </>
      )}

      {uploadState.status === "uploading" && (
        <>
          <div className="mb-3 text-[#64748B]">Uploading...</div>
          <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1A3A6B] rounded-full transition-all"
              style={{ width: `${uploadState.progress}%` }}
            />
          </div>
        </>
      )}

      {uploadState.status === "success" && (
        <>
          <CheckCircle className="h-10 w-10 text-[#1B7A3E] mx-auto mb-3" />
          <p className="text-[#1B7A3E] font-medium">{uploadState.filename}</p>
          <p className="text-[#64748B] text-sm">Uploaded successfully</p>
        </>
      )}

      {uploadState.status === "error" && (
        <>
          <X className="h-10 w-10 text-[#B91C1C] mx-auto mb-3" />
          <p className="text-[#B91C1C] font-medium">Upload failed</p>
          <p className="text-[#64748B] text-sm mb-3">{uploadState.error}</p>
          <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-[#EBF0F8] text-[#1A3A6B] rounded-lg text-sm font-medium hover:bg-[#E2E8F0]">
            Retry
            <input type="file" accept={accept} onChange={handleChange} className="hidden" />
          </label>
        </>
      )}
    </div>
  );
}

interface VerificationStatus {
  idVerified: boolean;
  insuranceVerified: boolean;
}

const inputClass =
  "w-full bg-[#FAFBFC] border border-[#CBD5E1] rounded-md px-3.5 py-2.5 text-sm text-[#0D1F3C] placeholder:text-[#CBD5E1] focus:outline-none focus:border-[#1A3A6B] focus:ring-2 focus:ring-[#1A3A6B]/8 focus:bg-white transition-all";
const inputErrorClass =
  "w-full bg-[#FAFBFC] border border-[#B91C1C] rounded-md px-3.5 py-2.5 text-sm text-[#0D1F3C] placeholder:text-[#CBD5E1] focus:outline-none focus:border-[#B91C1C] focus:ring-2 focus:ring-[#B91C1C]/8 focus:bg-white transition-all";

export default function ApplyPage({ params }: { params: Promise<{ vehicleId: string }> }) {
  const { vehicleId } = use(params);
  const router = useRouter();
  const { token, user } = useAuth();
  const [step, setStep] = useState(0);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [vehicle, setVehicle] = useState<{
    id: string; make: string; model: string; year: number;
    weeklyPrice: number; depositAmount: number; uberEligible: boolean; lyftEligible: boolean;
    images: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [verification, setVerification] = useState<VerificationStatus | null>(null);

  const [licenseUpload, setLicenseUpload] = useState<UploadState>({ status: "idle", progress: 0 });
  const [insuranceUpload, setInsuranceUpload] = useState<UploadState>({ status: "idle", progress: 0 });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<PersonalData>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
    },
  });

  // Fetch vehicle and verification status in parallel
  useEffect(() => {
    const vehicleFetch = fetch(`/api/vehicles/${vehicleId}`).then((r) => r.json());
    const profileFetch = token
      ? fetch("/api/user/profile", { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json())
      : Promise.resolve(null);

    Promise.all([vehicleFetch, profileFetch])
      .then(([vehicleData, profileData]) => {
        setVehicle(vehicleData.vehicle);
        if (profileData?.user) {
          setVerification({
            idVerified: !!profileData.user.idVerified,
            insuranceVerified: !!profileData.user.insuranceVerified,
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [vehicleId, token]);

  // Create draft application
  useEffect(() => {
    if (!token || !vehicle) return;
    fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ vehicleId: vehicle.id }),
    })
      .then((r) => r.json())
      .then((data) => setApplicationId(data.application?.id));
  }, [token, vehicle]);

  const uploadDoc = async (
    file: File,
    docType: "license" | "insurance",
    setter: (s: UploadState) => void
  ) => {
    if (!applicationId || !token) {
      setter({ status: "error", progress: 0, error: "Application not ready. Please wait." });
      return;
    }
    setter({ status: "uploading", progress: 50 });
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("docType", docType);
      const res = await fetch(`/api/applications/${applicationId}/upload-doc`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setter({ status: "error", progress: 0, error: data.error || "Upload failed" });
        return;
      }
      setter({ status: "success", progress: 100, filename: file.name, key: data.key });
    } catch {
      setter({ status: "error", progress: 0, error: "Upload failed. Please try again." });
    }
  };

  const savePersonalInfo = async (data: PersonalData) => {
    if (!applicationId || !token) return;
    await fetch(`/api/applications/${applicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ personalInfo: data }),
    });
    setStep(2);
  };

  const saveLicense = async () => {
    if (!applicationId || !token || !licenseUpload.key) return;
    await fetch(`/api/applications/${applicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ licenseDocKey: licenseUpload.key }),
    });
    setStep(3);
  };

  const saveInsurance = async () => {
    if (!applicationId || !token || !insuranceUpload.key) return;
    await fetch(`/api/applications/${applicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ insuranceDocKey: insuranceUpload.key }),
    });
    setStep(4);
  };

  const submitApplication = async () => {
    if (!applicationId || !token || !acknowledged) return;
    setSubmitting(true);
    const res = await fetch(`/api/applications/${applicationId}/submit`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      router.push("/dashboard?submitted=true");
    } else {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-[#64748B]">Loading...</div>;
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-[#64748B] mb-4">Vehicle not found</p>
        <Link href="/cars" className="text-[#1A3A6B] font-medium">Browse other cars →</Link>
      </div>
    );
  }

  const isFullyVerified = verification?.idVerified && verification?.insuranceVerified;

  if (!isFullyVerified) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] pt-16 pb-16">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-10 shadow-[0_1px_4px_rgba(0,0,0,0.04)] inline-flex flex-col items-center">
            <ShieldAlert className="h-14 w-14 text-[#1A3A6B] mb-5" />
            <h2 className="text-xl font-bold text-[#1A3A6B] mb-3">Verification Required</h2>
            <p className="text-[#64748B] mb-2 max-w-sm">
              You need to upload and have both your <strong>government-issued ID</strong> and <strong>auto insurance</strong> verified before applying for a vehicle.
            </p>
            <div className="flex flex-col gap-2 text-sm my-5 w-full max-w-xs">
              <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg ${verification?.idVerified ? "bg-[#ECFDF5] text-[#1B7A3E]" : "bg-[#EBF0F8] text-[#1A3A6B]"}`}>
                {verification?.idVerified
                  ? <><CheckCircle className="h-4 w-4" /> ID verified</>
                  : <><Upload className="h-4 w-4" /> ID {!verification ? "required" : "pending verification"}</>
                }
              </div>
              <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg ${verification?.insuranceVerified ? "bg-[#ECFDF5] text-[#1B7A3E]" : "bg-[#EBF0F8] text-[#1A3A6B]"}`}>
                {verification?.insuranceVerified
                  ? <><CheckCircle className="h-4 w-4" /> Insurance verified</>
                  : <><Upload className="h-4 w-4" /> Insurance {!verification ? "required" : "pending verification"}</>
                }
              </div>
            </div>
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-[#1A3A6B] text-white font-bold rounded-lg hover:bg-[#122A52] transition-colors"
            >
              Go to Dashboard to Upload Documents
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] pt-16 pb-16">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress indicator — navy dot steps */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {STEPS.map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i < step
                  ? "bg-[#1A3A6B] text-white"
                  : i === step
                  ? "bg-white border-2 border-[#1A3A6B] text-[#1A3A6B]"
                  : "bg-white border border-[#E2E8F0] text-[#CBD5E1]"
              }`}>
                {i < step ? "✓" : i + 1}
              </div>
              {i === step && (
                <span className="text-[9px] font-semibold text-[#1A3A6B] uppercase tracking-wider">
                  {STEPS[i].label}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Step 0: Vehicle Confirm */}
        {step === 0 && (
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-7 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <h2 className="text-xl font-bold text-[#1A3A6B] mb-6">Confirm Your Vehicle</h2>
            {vehicle.images && vehicle.images.length > 0 && (
              <div className="relative w-full h-48 rounded-lg overflow-hidden mb-5 bg-[#E8F0FE]">
                <Image
                  src={vehicle.images[0]}
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 672px) 100vw, 672px"
                />
              </div>
            )}
            <div className="bg-[#F7F9FC] rounded-lg p-5 mb-6">
              <h3 className="font-bold text-[#1E293B] text-lg mb-3">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-[#64748B]">Weekly Price</p>
                  <p className="font-bold text-[#1A3A6B] text-xl">${(vehicle.weeklyPrice / 100).toFixed(0)}</p>
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">Deposit</p>
                  <p className="font-bold text-[#1E293B] text-xl">${(vehicle.depositAmount / 100).toFixed(0)}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                {vehicle.uberEligible && (
                  <span className="text-xs px-2.5 py-1 bg-[#EBF0F8] text-[#1A3A6B] rounded-full font-medium">Uber Eligible</span>
                )}
                {vehicle.lyftEligible && (
                  <span className="text-xs px-2.5 py-1 bg-[#EBF0F8] text-[#1A3A6B] rounded-full font-medium">Lyft Eligible</span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between mt-5">
              <div />
              <button
                onClick={() => setStep(1)}
                className="px-6 py-2.5 bg-[#1A3A6B] text-white text-sm font-semibold rounded-md hover:bg-[#122A52] transition-colors"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-7 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <h2 className="text-xl font-bold text-[#1A3A6B] mb-6">Personal Information</h2>
            <form onSubmit={handleSubmit(savePersonalInfo)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="block text-sm font-medium text-[#1E293B] mb-1">First Name</Label>
                  <input
                    id="firstName"
                    {...register("firstName")}
                    className={errors.firstName ? inputErrorClass : inputClass}
                  />
                  {errors.firstName && <p className="text-xs text-[#B91C1C] mt-1">{errors.firstName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="lastName" className="block text-sm font-medium text-[#1E293B] mb-1">Last Name</Label>
                  <input
                    id="lastName"
                    {...register("lastName")}
                    className={errors.lastName ? inputErrorClass : inputClass}
                  />
                  {errors.lastName && <p className="text-xs text-[#B91C1C] mt-1">{errors.lastName.message}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="phone" className="block text-sm font-medium text-[#1E293B] mb-1">Phone Number</Label>
                <input
                  id="phone"
                  {...register("phone")}
                  placeholder="(404) 555-0100"
                  className={errors.phone ? inputErrorClass : inputClass}
                />
                {errors.phone && <p className="text-xs text-[#B91C1C] mt-1">{errors.phone.message}</p>}
              </div>
              <div>
                <Label htmlFor="dateOfBirth" className="block text-sm font-medium text-[#1E293B] mb-1">Date of Birth</Label>
                <input
                  id="dateOfBirth"
                  type="date"
                  {...register("dateOfBirth")}
                  className={errors.dateOfBirth ? inputErrorClass : inputClass}
                />
                {errors.dateOfBirth && <p className="text-xs text-[#B91C1C] mt-1">{errors.dateOfBirth.message}</p>}
              </div>
              <div>
                <Label htmlFor="address" className="block text-sm font-medium text-[#1E293B] mb-1">Street Address</Label>
                <input
                  id="address"
                  {...register("address")}
                  placeholder="123 Main St"
                  className={errors.address ? inputErrorClass : inputClass}
                />
                {errors.address && <p className="text-xs text-[#B91C1C] mt-1">{errors.address.message}</p>}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="col-span-2 sm:col-span-2">
                  <Label htmlFor="city" className="block text-sm font-medium text-[#1E293B] mb-1">City</Label>
                  <input
                    id="city"
                    {...register("city")}
                    placeholder="Atlanta"
                    className={errors.city ? inputErrorClass : inputClass}
                  />
                  {errors.city && <p className="text-xs text-[#B91C1C] mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <Label htmlFor="state" className="block text-sm font-medium text-[#1E293B] mb-1">State</Label>
                  <input
                    id="state"
                    {...register("state")}
                    placeholder="GA"
                    className={errors.state ? inputErrorClass : inputClass}
                  />
                </div>
              </div>
              <div className="sm:max-w-[200px]">
                <Label htmlFor="zip" className="block text-sm font-medium text-[#1E293B] mb-1">ZIP Code</Label>
                <input
                  id="zip"
                  {...register("zip")}
                  placeholder="30301"
                  className={errors.zip ? inputErrorClass : inputClass}
                />
              </div>
              <div className="flex items-center justify-between mt-5">
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="text-sm font-semibold text-[#64748B] hover:text-[#0D1F3C] transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1A3A6B] text-white text-sm font-semibold rounded-md hover:bg-[#122A52] transition-colors"
                >
                  Continue →
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: License */}
        {step === 2 && (
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-7 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <h2 className="text-xl font-bold text-[#1A3A6B] mb-2">Upload Driver&apos;s License</h2>
            <p className="text-[#64748B] text-sm mb-6">Upload a clear photo of your valid driver&apos;s license (front and back if possible).</p>
            <DocumentUpload
              label="Driver's License"
              accept="image/*,.pdf"
              onUpload={(f) => uploadDoc(f, "license", setLicenseUpload)}
              uploadState={licenseUpload}
            />
            <div className="flex items-center justify-between mt-5">
              <button
                onClick={() => setStep(1)}
                className="text-sm font-semibold text-[#64748B] hover:text-[#0D1F3C] transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={saveLicense}
                disabled={licenseUpload.status !== "success"}
                className="px-6 py-2.5 bg-[#1A3A6B] text-white text-sm font-semibold rounded-md hover:bg-[#122A52] disabled:opacity-50 transition-colors"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Insurance */}
        {step === 3 && (
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-7 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <h2 className="text-xl font-bold text-[#1A3A6B] mb-2">Upload Insurance Document</h2>
            <p className="text-[#64748B] text-sm mb-6">Upload your current auto insurance card or declarations page.</p>
            <DocumentUpload
              label="Insurance Document"
              accept="image/*,.pdf"
              onUpload={(f) => uploadDoc(f, "insurance", setInsuranceUpload)}
              uploadState={insuranceUpload}
            />
            <div className="flex items-center justify-between mt-5">
              <button
                onClick={() => setStep(2)}
                className="text-sm font-semibold text-[#64748B] hover:text-[#0D1F3C] transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={saveInsurance}
                disabled={insuranceUpload.status !== "success"}
                className="px-6 py-2.5 bg-[#1A3A6B] text-white text-sm font-semibold rounded-md hover:bg-[#122A52] disabled:opacity-50 transition-colors"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {step === 4 && (
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-7 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <h2 className="text-xl font-bold text-[#1A3A6B] mb-6">Review & Submit</h2>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-[#ECFDF5] rounded-lg">
                <CheckCircle className="h-5 w-5 text-[#1B7A3E] flex-shrink-0" />
                <span className="text-sm text-[#1E293B]">Vehicle selected: {vehicle.year} {vehicle.make} {vehicle.model}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#ECFDF5] rounded-lg">
                <CheckCircle className="h-5 w-5 text-[#1B7A3E] flex-shrink-0" />
                <span className="text-sm text-[#1E293B]">Personal information completed</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#ECFDF5] rounded-lg">
                <CheckCircle className="h-5 w-5 text-[#1B7A3E] flex-shrink-0" />
                <span className="text-sm text-[#1E293B]">Driver&apos;s license uploaded</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#ECFDF5] rounded-lg">
                <CheckCircle className="h-5 w-5 text-[#1B7A3E] flex-shrink-0" />
                <span className="text-sm text-[#1E293B]">Insurance document uploaded</span>
              </div>
            </div>

            <div className="bg-[#F7F9FC] rounded-lg p-4 mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={(e) => setAcknowledged(e.target.checked)}
                  className="mt-0.5 rounded border-[#E2E8F0]"
                />
                <span className="text-sm text-[#64748B]">
                  I confirm that all information provided is accurate and complete. I understand that providing false information may result in rejection of my application. I acknowledge the rental terms and agree to comply with all policies.
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between mt-5">
              <button
                onClick={() => setStep(3)}
                className="text-sm font-semibold text-[#64748B] hover:text-[#0D1F3C] transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={submitApplication}
                disabled={!acknowledged || submitting}
                className="px-6 py-2.5 bg-[#1A3A6B] text-white text-sm font-semibold rounded-md hover:bg-[#122A52] disabled:opacity-50 transition-colors"
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
