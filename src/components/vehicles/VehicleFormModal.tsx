"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { Loader2, X, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";

interface Vehicle {
  id: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  type: string;
  status: "available" | "limited" | "rented" | "waitlist";
  weeklyPrice: number;
  depositAmount: number;
  transmission: string;
  fuelType: string;
  seats: number;
  mpgCity?: number | null;
  mpgHighway?: number | null;
  mileagePolicy: string;
  minRentalDays?: number | null;
  features: string[];
  uberEligible: boolean;
  lyftEligible: boolean;
  deliveryEligible: boolean;
  isFeatured: boolean;
  description?: string | null;
  images: string[];
}

interface FormValues {
  slug: string;
  make: string;
  model: string;
  year: number;
  type: "sedan" | "suv" | "minivan" | "truck" | "compact";
  status: "available" | "limited" | "rented" | "waitlist";
  weeklyPrice: number;
  depositAmount: number;
  transmission: "automatic" | "manual";
  fuelType: "gas" | "hybrid" | "electric";
  seats: number;
  mpgCity?: number;
  mpgHighway?: number;
  mileagePolicy: string;
  minRentalDays?: number;
  features: string;
  uberEligible: boolean;
  lyftEligible: boolean;
  deliveryEligible: boolean;
  isFeatured: boolean;
  description?: string;
}

interface VehicleFormModalProps {
  vehicle?: Vehicle;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const INPUT =
  "w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-md text-[#0D1F3C] bg-white focus:outline-none focus:ring-2 focus:ring-[#1A3A6B] focus:border-transparent";
const LABEL =
  "block text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1";
const SECTION_TITLE =
  "text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-3 pb-1 border-b border-[#F1F5F9]";

export function VehicleFormModal({
  vehicle,
  open,
  onOpenChange,
  onSuccess,
}: VehicleFormModalProps) {
  const { token } = useAuth();
  const isEdit = !!vehicle;

  const [images, setImages] = useState<string[]>(vehicle?.images ?? []);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form state when the target vehicle changes
  useEffect(() => {
    setImages(vehicle?.images ?? []);
    setSubmitError(null);
  }, [vehicle]);

  const { register, handleSubmit, formState: { isSubmitting, errors } } =
    useForm<FormValues>({
      defaultValues: vehicle
        ? {
            slug: vehicle.slug,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            type: vehicle.type as FormValues["type"],
            status: vehicle.status,
            weeklyPrice: vehicle.weeklyPrice / 100,
            depositAmount: vehicle.depositAmount / 100,
            transmission: vehicle.transmission as FormValues["transmission"],
            fuelType: vehicle.fuelType as FormValues["fuelType"],
            seats: vehicle.seats,
            mpgCity: vehicle.mpgCity ?? undefined,
            mpgHighway: vehicle.mpgHighway ?? undefined,
            mileagePolicy: vehicle.mileagePolicy,
            minRentalDays: vehicle.minRentalDays ?? undefined,
            features: vehicle.features?.join(", ") ?? "",
            uberEligible: vehicle.uberEligible,
            lyftEligible: vehicle.lyftEligible,
            deliveryEligible: vehicle.deliveryEligible,
            isFeatured: vehicle.isFeatured,
            description: vehicle.description ?? "",
          }
        : {
            type: "sedan",
            status: "available",
            transmission: "automatic",
            fuelType: "gas",
            seats: 5,
            mileagePolicy: "Unlimited miles",
            uberEligible: false,
            lyftEligible: false,
            deliveryEligible: false,
            isFeatured: false,
          },
    });

  const uploadFiles = useCallback(
    async (files: File[]) => {
      setUploadingCount((n) => n + files.length);
      await Promise.all(
        files.map(async (file) => {
          try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch("/api/admin/upload-image", {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
              body: fd,
            });
            if (res.ok) {
              const { url } = await res.json();
              setImages((prev) => [...prev, url]);
            }
          } finally {
            setUploadingCount((n) => n - 1);
          }
        })
      );
    },
    [token]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        ["image/jpeg", "image/png", "image/webp"].includes(f.type)
      );
      if (files.length) uploadFiles(files);
    },
    [uploadFiles]
  );

  const onSubmit = async (data: FormValues) => {
    setSubmitError(null);
    const payload = {
      ...data,
      year: Number(data.year),
      weeklyPrice: Math.round(Number(data.weeklyPrice) * 100),
      depositAmount: Math.round(Number(data.depositAmount) * 100),
      seats: Number(data.seats),
      mpgCity: data.mpgCity ? Number(data.mpgCity) : undefined,
      mpgHighway: data.mpgHighway ? Number(data.mpgHighway) : undefined,
      minRentalDays: data.minRentalDays ? Number(data.minRentalDays) : undefined,
      features: data.features
        ? data.features.split(",").map((f) => f.trim()).filter(Boolean)
        : [],
      images,
    };

    const url = isEdit ? `/api/vehicles/${vehicle.id}` : "/api/vehicles";
    const res = await fetch(url, {
      method: isEdit ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      onSuccess();
      onOpenChange(false);
    } else {
      const json = await res.json().catch(() => ({}));
      setSubmitError(json.error ?? "Something went wrong. Please try again.");
    }
  };

  const removeImage = (index: number) =>
    setImages((prev) => prev.filter((_, i) => i !== index));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-full max-w-3xl max-h-[85vh] overflow-y-auto"
        showCloseButton
      >
        <DialogHeader>
          <DialogTitle className="text-[#0D1F3C] text-base font-extrabold tracking-tight">
            {isEdit
              ? `Edit — ${vehicle.year} ${vehicle.make} ${vehicle.model}`
              : "Add Vehicle"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-1">

          {/* ── Basic Info ── */}
          <section>
            <p className={SECTION_TITLE}>Basic Info</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Make *</label>
                <input
                  {...register("make", { required: true })}
                  className={INPUT}
                  placeholder="Toyota"
                />
                {errors.make && <p className="text-[10px] text-red-500 mt-0.5">Required</p>}
              </div>
              <div>
                <label className={LABEL}>Model *</label>
                <input
                  {...register("model", { required: true })}
                  className={INPUT}
                  placeholder="Camry"
                />
                {errors.model && <p className="text-[10px] text-red-500 mt-0.5">Required</p>}
              </div>
              <div>
                <label className={LABEL}>Year *</label>
                <input
                  type="number"
                  {...register("year", { required: true, min: 2000, max: 2030 })}
                  className={INPUT}
                  placeholder="2022"
                />
                {errors.year && <p className="text-[10px] text-red-500 mt-0.5">Required</p>}
              </div>
              <div>
                <label className={LABEL}>Type *</label>
                <select {...register("type")} className={INPUT}>
                  {["sedan", "suv", "minivan", "truck", "compact"].map((t) => (
                    <option key={t} value={t} className="capitalize">{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={LABEL}>Slug *</label>
                <input
                  {...register("slug", { required: true })}
                  className={INPUT}
                  placeholder="2022-toyota-camry"
                />
                {errors.slug && <p className="text-[10px] text-red-500 mt-0.5">Required</p>}
              </div>
              <div>
                <label className={LABEL}>Status</label>
                <select {...register("status")} className={INPUT}>
                  {["available", "limited", "rented", "waitlist"].map((s) => (
                    <option key={s} value={s} className="capitalize">{s}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className={LABEL}>Description</label>
                <textarea
                  {...register("description")}
                  className={INPUT}
                  rows={2}
                  placeholder="Optional description visible to renters"
                />
              </div>
            </div>
          </section>

          {/* ── Pricing ── */}
          <section>
            <p className={SECTION_TITLE}>Pricing</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Weekly Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("weeklyPrice", { required: true, min: 0 })}
                  className={INPUT}
                  placeholder="150"
                />
                {errors.weeklyPrice && <p className="text-[10px] text-red-500 mt-0.5">Required</p>}
              </div>
              <div>
                <label className={LABEL}>Deposit Amount ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("depositAmount", { required: true, min: 0 })}
                  className={INPUT}
                  placeholder="300"
                />
                {errors.depositAmount && <p className="text-[10px] text-red-500 mt-0.5">Required</p>}
              </div>
            </div>
          </section>

          {/* ── Specs ── */}
          <section>
            <p className={SECTION_TITLE}>Specs</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Transmission *</label>
                <select {...register("transmission")} className={INPUT}>
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
              </div>
              <div>
                <label className={LABEL}>Fuel Type *</label>
                <select {...register("fuelType")} className={INPUT}>
                  <option value="gas">Gas</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="electric">Electric</option>
                </select>
              </div>
              <div>
                <label className={LABEL}>Seats *</label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  {...register("seats", { required: true })}
                  className={INPUT}
                  placeholder="5"
                />
                {errors.seats && <p className="text-[10px] text-red-500 mt-0.5">Required</p>}
              </div>
              <div>
                <label className={LABEL}>Min Rental Days</label>
                <input
                  type="number"
                  min="1"
                  {...register("minRentalDays")}
                  className={INPUT}
                  placeholder="7"
                />
              </div>
              <div>
                <label className={LABEL}>MPG City</label>
                <input
                  type="number"
                  min="1"
                  {...register("mpgCity")}
                  className={INPUT}
                  placeholder="28"
                />
              </div>
              <div>
                <label className={LABEL}>MPG Highway</label>
                <input
                  type="number"
                  min="1"
                  {...register("mpgHighway")}
                  className={INPUT}
                  placeholder="38"
                />
              </div>
              <div className="col-span-2">
                <label className={LABEL}>Mileage Policy *</label>
                <input
                  {...register("mileagePolicy", { required: true })}
                  className={INPUT}
                  placeholder="Unlimited miles"
                />
                {errors.mileagePolicy && <p className="text-[10px] text-red-500 mt-0.5">Required</p>}
              </div>
              <div className="col-span-2">
                <label className={LABEL}>Features (comma-separated)</label>
                <input
                  {...register("features")}
                  className={INPUT}
                  placeholder="Backup camera, Bluetooth, Apple CarPlay"
                />
              </div>
            </div>
          </section>

          {/* ── Eligibility ── */}
          <section>
            <p className={SECTION_TITLE}>Eligibility & Display</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: "uberEligible" as const, label: "Uber Eligible" },
                { name: "lyftEligible" as const, label: "Lyft Eligible" },
                { name: "deliveryEligible" as const, label: "Delivery Eligible" },
                { name: "isFeatured" as const, label: "Featured on Homepage" },
              ].map(({ name, label }) => (
                <label key={name} className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    {...register(name)}
                    className="w-4 h-4 rounded border-[#E2E8F0] accent-[#1A3A6B]"
                  />
                  <span className="text-sm text-[#0D1F3C]">{label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* ── Photos ── */}
          <section>
            <p className={SECTION_TITLE}>Photos</p>

            {/* Thumbnails */}
            {(images.length > 0 || uploadingCount > 0) && (
              <div className="flex flex-wrap gap-2 mb-3">
                {images.map((url, i) => (
                  <div
                    key={url}
                    className="relative w-20 h-20 rounded-md overflow-hidden border border-[#E2E8F0] group flex-shrink-0"
                  >
                    <Image
                      src={url}
                      alt={`Photo ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {Array.from({ length: uploadingCount }).map((_, i) => (
                  <div
                    key={`uploading-${i}`}
                    className="w-20 h-20 rounded-md border border-[#E2E8F0] bg-[#F7F9FC] flex items-center justify-center flex-shrink-0"
                  >
                    <Loader2 className="w-5 h-5 text-[#94A3B8] animate-spin" />
                  </div>
                ))}
              </div>
            )}

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragging
                  ? "border-[#1A3A6B] bg-[#E8F0FE]"
                  : "border-[#E2E8F0] hover:border-[#1A3A6B] hover:bg-[#F7F9FC]"
              }`}
            >
              <Upload className="w-6 h-6 text-[#94A3B8] mx-auto mb-2" />
              <p className="text-sm font-medium text-[#0D1F3C]">
                Drop photos here or click to browse
              </p>
              <p className="text-xs text-[#94A3B8] mt-1">JPEG, PNG, WebP · Max 10 MB each</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.length) {
                    uploadFiles(Array.from(e.target.files));
                    e.target.value = "";
                  }
                }}
              />
            </div>
          </section>

          {/* Error */}
          {submitError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {submitError}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex-1 py-2.5 border border-[#E2E8F0] text-[#64748B] rounded-lg font-semibold text-sm hover:border-[#94A3B8] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || uploadingCount > 0}
              className="flex-1 py-2.5 bg-[#1A3A6B] text-white rounded-lg font-semibold text-sm hover:bg-[#122A52] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? "Save Changes" : "Add Vehicle"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
