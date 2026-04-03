"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SlidersHorizontal, X } from "lucide-react";

const vehicleTypes = ["sedan", "suv", "minivan", "truck", "compact"];
const fuelTypes = ["gas", "hybrid", "electric"];
const statusOptions = ["available", "limited"];

type Vehicle = {
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
  uberEligible: boolean;
  lyftEligible: boolean;
  deliveryEligible: boolean;
  images: string[];
};

type SortOption = "price-asc" | "price-desc" | "newest" | "oldest";

export default function CarsPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedFuels, setSelectedFuels] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [uberOnly, setUberOnly] = useState(false);
  const [lyftOnly, setLyftOnly] = useState(false);
  const [deliveryOnly, setDeliveryOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("price-asc");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filtered, setFiltered] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadVehicles() {
      try {
        const res = await fetch("/api/vehicles?limit=50");
        if (!res.ok) {
          throw new Error("Failed to load vehicles");
        }

        const data = await res.json();
        if (!active) return;

        setVehicles(data.vehicles || []);
        setLoadError(null);
      } catch {
        if (!active) return;
        setLoadError("We couldn't load the vehicle list right now.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadVehicles();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let result = [...vehicles];

    if (selectedTypes.length > 0) {
      result = result.filter((v) => selectedTypes.includes(v.type));
    }
    if (selectedFuels.length > 0) {
      result = result.filter((v) => selectedFuels.includes(v.fuelType));
    }
    if (selectedStatuses.length > 0) {
      result = result.filter((v) => selectedStatuses.includes(v.status));
    }
    if (uberOnly) result = result.filter((v) => v.uberEligible);
    if (lyftOnly) result = result.filter((v) => v.lyftEligible);
    if (deliveryOnly) result = result.filter((v) => v.deliveryEligible);

    result.sort((a, b) => {
      switch (sortBy) {
        case "price-asc": return a.weeklyPrice - b.weeklyPrice;
        case "price-desc": return b.weeklyPrice - a.weeklyPrice;
        case "newest": return b.year - a.year;
        case "oldest": return a.year - b.year;
        default: return 0;
      }
    });

    setFiltered(result);
  }, [vehicles, selectedTypes, selectedFuels, selectedStatuses, uberOnly, lyftOnly, deliveryOnly, sortBy]);

  const resetFilters = () => {
    setSelectedTypes([]);
    setSelectedFuels([]);
    setSelectedStatuses([]);
    setUberOnly(false);
    setLyftOnly(false);
    setDeliveryOnly(false);
    setSortBy("price-asc");
  };

  const toggleItem = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Availability */}
      <div>
        <h3 className="font-semibold text-[#1E293B] mb-3 text-sm uppercase tracking-wide">
          Availability
        </h3>
        <div className="space-y-2">
          {statusOptions.map((s) => (
            <div key={s} className="flex items-center gap-2">
              <Checkbox
                id={`status-${s}`}
                checked={selectedStatuses.includes(s)}
                onCheckedChange={() => toggleItem(selectedStatuses, setSelectedStatuses, s)}
              />
              <Label htmlFor={`status-${s}`} className="capitalize cursor-pointer text-sm">
                {s}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Vehicle Type */}
      <div>
        <h3 className="font-semibold text-[#1E293B] mb-3 text-sm uppercase tracking-wide">
          Vehicle Type
        </h3>
        <div className="space-y-2">
          {vehicleTypes.map((t) => (
            <div key={t} className="flex items-center gap-2">
              <Checkbox
                id={`type-${t}`}
                checked={selectedTypes.includes(t)}
                onCheckedChange={() => toggleItem(selectedTypes, setSelectedTypes, t)}
              />
              <Label htmlFor={`type-${t}`} className="capitalize cursor-pointer text-sm">
                {t}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Fuel Type */}
      <div>
        <h3 className="font-semibold text-[#1E293B] mb-3 text-sm uppercase tracking-wide">
          Fuel Type
        </h3>
        <div className="space-y-2">
          {fuelTypes.map((f) => (
            <div key={f} className="flex items-center gap-2">
              <Checkbox
                id={`fuel-${f}`}
                checked={selectedFuels.includes(f)}
                onCheckedChange={() => toggleItem(selectedFuels, setSelectedFuels, f)}
              />
              <Label htmlFor={`fuel-${f}`} className="capitalize cursor-pointer text-sm">
                {f}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Platform */}
      <div>
        <h3 className="font-semibold text-[#1E293B] mb-3 text-sm uppercase tracking-wide">
          Platform Eligible
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox id="uber" checked={uberOnly} onCheckedChange={(c) => setUberOnly(c === true)} />
            <Label htmlFor="uber" className="cursor-pointer text-sm">Uber Eligible</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="lyft" checked={lyftOnly} onCheckedChange={(c) => setLyftOnly(c === true)} />
            <Label htmlFor="lyft" className="cursor-pointer text-sm">Lyft Eligible</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="delivery" checked={deliveryOnly} onCheckedChange={(c) => setDeliveryOnly(c === true)} />
            <Label htmlFor="delivery" className="cursor-pointer text-sm">Delivery Eligible</Label>
          </div>
        </div>
      </div>

      <button
        onClick={resetFilters}
        className="w-full py-2 text-sm text-[#64748B] border border-[#E2E8F0] rounded-lg hover:bg-[#F7F9FC] transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-[#F7F9FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Page header */}
          <div className="mb-8">
            <h1
              className="text-3xl font-extrabold text-[#0D1F3C] tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Browse Vehicles
            </h1>
            <p className="text-sm text-[#94A3B8] mt-1">
              {filtered.length} vehicle{filtered.length !== 1 ? "s" : ""} available
            </p>
          </div>

          <div className="flex gap-8 items-start">

            {/* ── Sidebar (desktop) ── */}
            <aside className="hidden lg:block w-56 shrink-0 bg-white border border-[#E2E8F0] rounded-lg p-5 sticky top-20">
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-bold text-[#0D1F3C] uppercase tracking-wider">
                  Filters
                </span>
                {(selectedTypes.length > 0 ||
                  selectedFuels.length > 0 ||
                  selectedStatuses.length > 0 ||
                  uberOnly || lyftOnly || deliveryOnly) && (
                  <button
                    onClick={() => {
                      setSelectedTypes([]);
                      setSelectedFuels([]);
                      setSelectedStatuses([]);
                      setUberOnly(false);
                      setLyftOnly(false);
                      setDeliveryOnly(false);
                    }}
                    className="text-[10px] font-semibold text-[#1A3A6B] hover:text-[#122A52] transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Availability */}
              <div className="mb-5">
                <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-3">
                  Availability
                </p>
                {statusOptions.map((s) => (
                  <label key={s} className="flex items-center gap-2.5 py-1 cursor-pointer">
                    <Checkbox
                      id={`status-${s}`}
                      checked={selectedStatuses.includes(s)}
                      onCheckedChange={(v) =>
                        setSelectedStatuses((prev) =>
                          v ? [...prev, s] : prev.filter((x) => x !== s)
                        )
                      }
                      className="rounded border-[#CBD5E1] data-[state=checked]:bg-[#1A3A6B] data-[state=checked]:border-[#1A3A6B]"
                    />
                    <Label htmlFor={`status-${s}`} className="text-sm text-[#64748B] capitalize cursor-pointer">
                      {s}
                    </Label>
                  </label>
                ))}
              </div>

              {/* Vehicle type */}
              <div className="mb-5">
                <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-3">
                  Vehicle Type
                </p>
                {vehicleTypes.map((t) => (
                  <label key={t} className="flex items-center gap-2.5 py-1 cursor-pointer">
                    <Checkbox
                      id={`type-${t}`}
                      checked={selectedTypes.includes(t)}
                      onCheckedChange={(v) =>
                        setSelectedTypes((prev) =>
                          v ? [...prev, t] : prev.filter((x) => x !== t)
                        )
                      }
                      className="rounded border-[#CBD5E1] data-[state=checked]:bg-[#1A3A6B] data-[state=checked]:border-[#1A3A6B]"
                    />
                    <Label htmlFor={`type-${t}`} className="text-sm text-[#64748B] capitalize cursor-pointer">
                      {t}
                    </Label>
                  </label>
                ))}
              </div>

              {/* Fuel type */}
              <div className="mb-5">
                <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-3">
                  Fuel Type
                </p>
                {fuelTypes.map((f) => (
                  <label key={f} className="flex items-center gap-2.5 py-1 cursor-pointer">
                    <Checkbox
                      id={`fuel-${f}`}
                      checked={selectedFuels.includes(f)}
                      onCheckedChange={(v) =>
                        setSelectedFuels((prev) =>
                          v ? [...prev, f] : prev.filter((x) => x !== f)
                        )
                      }
                      className="rounded border-[#CBD5E1] data-[state=checked]:bg-[#1A3A6B] data-[state=checked]:border-[#1A3A6B]"
                    />
                    <Label htmlFor={`fuel-${f}`} className="text-sm text-[#64748B] capitalize cursor-pointer">
                      {f}
                    </Label>
                  </label>
                ))}
              </div>

              {/* Platform eligibility */}
              <div>
                <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-3">
                  Platform
                </p>
                {[
                  { key: "uber", label: "Uber Eligible", value: uberOnly, setter: setUberOnly },
                  { key: "lyft", label: "Lyft Eligible", value: lyftOnly, setter: setLyftOnly },
                  { key: "delivery", label: "Delivery", value: deliveryOnly, setter: setDeliveryOnly },
                ].map(({ key, label, value, setter }) => (
                  <label key={key} className="flex items-center gap-2.5 py-1 cursor-pointer">
                    <Checkbox
                      id={key}
                      checked={value}
                      onCheckedChange={(v) => setter(!!v)}
                      className="rounded border-[#CBD5E1] data-[state=checked]:bg-[#1A3A6B] data-[state=checked]:border-[#1A3A6B]"
                    />
                    <Label htmlFor={key} className="text-sm text-[#64748B] cursor-pointer">
                      {label}
                    </Label>
                  </label>
                ))}
              </div>
            </aside>

            {/* ── Main content ── */}
            <div className="flex-1 min-w-0">

              {/* Sort bar */}
              <div className="flex items-center justify-between mb-5">
                {/* Mobile filter button */}
                <button
                  className="lg:hidden flex items-center gap-2 text-sm font-semibold px-3 py-2 border border-[#E2E8F0] rounded-md text-[#64748B] hover:border-[#1A3A6B] hover:text-[#1A3A6B] transition-colors"
                  onClick={() => setFilterOpen(true)}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="ml-auto text-sm font-medium text-[#64748B] border border-[#E2E8F0] rounded-md px-3 py-2 bg-white hover:border-[#1A3A6B] transition-colors focus:outline-none focus:border-[#1A3A6B] focus:ring-2 focus:ring-[#1A3A6B]/10"
                >
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

              {/* Loading */}
              {loading && (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-lg border border-[#E2E8F0] h-64 animate-pulse"
                    />
                  ))}
                </div>
              )}

              {/* Error */}
              {!loading && loadError && (
                <div className="text-center py-16">
                  <p className="text-sm text-[#DC2626] mb-3">{loadError}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="text-sm font-semibold text-[#1A3A6B] hover:underline"
                  >
                    Try again
                  </button>
                </div>
              )}

              {/* Empty state */}
              {!loading && !loadError && filtered.length === 0 && (
                <div className="text-center py-20">
                  <svg
                    className="w-10 h-10 text-[#CBD5E1] mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 9l-7 2-7-2V5l7-2 7 2v4zM5 9v6l7 2 7-2V9"
                    />
                  </svg>
                  <p className="text-sm font-semibold text-[#0D1F3C] mb-1">
                    No vehicles match your filters
                  </p>
                  <button
                    onClick={() => {
                      setSelectedTypes([]);
                      setSelectedFuels([]);
                      setSelectedStatuses([]);
                      setUberOnly(false);
                      setLyftOnly(false);
                      setDeliveryOnly(false);
                    }}
                    className="text-sm font-semibold text-[#1A3A6B] hover:text-[#122A52] transition-colors"
                  >
                    Clear filters
                  </button>
                </div>
              )}

              {/* Grid */}
              {!loading && !loadError && filtered.length > 0 && (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map((v) => (
                    <VehicleCard key={v.id} vehicle={v} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile filter drawer */}
        {filterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setFilterOpen(false)}
            />
            <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto shadow-xl">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
                <span className="text-sm font-bold text-[#0D1F3C]">Filters</span>
                <button onClick={() => setFilterOpen(false)}>
                  <X className="w-5 h-5 text-[#64748B]" />
                </button>
              </div>
              <div className="p-5 space-y-6">
                {/* Availability */}
                <div>
                  <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-3">Availability</p>
                  {statusOptions.map((s) => (
                    <label key={s} className="flex items-center gap-2.5 py-1.5 cursor-pointer">
                      <Checkbox id={`m-status-${s}`} checked={selectedStatuses.includes(s)}
                        onCheckedChange={(v) => setSelectedStatuses((p) => v ? [...p, s] : p.filter((x) => x !== s))}
                        className="rounded border-[#CBD5E1] data-[state=checked]:bg-[#1A3A6B] data-[state=checked]:border-[#1A3A6B]" />
                      <Label htmlFor={`m-status-${s}`} className="text-sm text-[#64748B] capitalize cursor-pointer">{s}</Label>
                    </label>
                  ))}
                </div>
                {/* Vehicle Type */}
                <div>
                  <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-3">Vehicle Type</p>
                  {vehicleTypes.map((t) => (
                    <label key={t} className="flex items-center gap-2.5 py-1.5 cursor-pointer">
                      <Checkbox id={`m-type-${t}`} checked={selectedTypes.includes(t)}
                        onCheckedChange={(v) => setSelectedTypes((p) => v ? [...p, t] : p.filter((x) => x !== t))}
                        className="rounded border-[#CBD5E1] data-[state=checked]:bg-[#1A3A6B] data-[state=checked]:border-[#1A3A6B]" />
                      <Label htmlFor={`m-type-${t}`} className="text-sm text-[#64748B] capitalize cursor-pointer">{t}</Label>
                    </label>
                  ))}
                </div>
                {/* Fuel Type */}
                <div>
                  <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-3">Fuel Type</p>
                  {fuelTypes.map((f) => (
                    <label key={f} className="flex items-center gap-2.5 py-1.5 cursor-pointer">
                      <Checkbox id={`m-fuel-${f}`} checked={selectedFuels.includes(f)}
                        onCheckedChange={(v) => setSelectedFuels((p) => v ? [...p, f] : p.filter((x) => x !== f))}
                        className="rounded border-[#CBD5E1] data-[state=checked]:bg-[#1A3A6B] data-[state=checked]:border-[#1A3A6B]" />
                      <Label htmlFor={`m-fuel-${f}`} className="text-sm text-[#64748B] capitalize cursor-pointer">{f}</Label>
                    </label>
                  ))}
                </div>
                {/* Platform */}
                <div>
                  <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-3">Platform</p>
                  {[
                    { id: "m-uber", label: "Uber Eligible", value: uberOnly, setter: setUberOnly },
                    { id: "m-lyft", label: "Lyft Eligible", value: lyftOnly, setter: setLyftOnly },
                    { id: "m-delivery", label: "Delivery Eligible", value: deliveryOnly, setter: setDeliveryOnly },
                  ].map(({ id, label, value, setter }) => (
                    <label key={id} className="flex items-center gap-2.5 py-1.5 cursor-pointer">
                      <Checkbox id={id} checked={value}
                        onCheckedChange={(v) => setter(!!v)}
                        className="rounded border-[#CBD5E1] data-[state=checked]:bg-[#1A3A6B] data-[state=checked]:border-[#1A3A6B]" />
                      <Label htmlFor={id} className="text-sm text-[#64748B] cursor-pointer">{label}</Label>
                    </label>
                  ))}
                </div>
              </div>
              <div className="sticky bottom-0 p-5 bg-white border-t border-[#E2E8F0] flex gap-3">
                <button
                  onClick={resetFilters}
                  className="flex-1 py-2.5 text-sm font-semibold text-[#64748B] border border-[#E2E8F0] rounded-md hover:bg-[#F7F9FC] transition-colors"
                >
                  Reset
                </button>
                <button onClick={() => setFilterOpen(false)}
                  className="flex-1 py-2.5 bg-[#1A3A6B] text-white text-sm font-semibold rounded-md hover:bg-[#122A52] transition-colors">
                  Show Results
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
