"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Pencil, ToggleLeft, ToggleRight } from "lucide-react";
import { AvailabilityBadge } from "@/components/vehicles/AvailabilityBadge";
import { VehicleFormModal } from "@/components/vehicles/VehicleFormModal";

interface Vehicle {
  id: string; slug: string; make: string; model: string; year: number;
  type: string; status: "available" | "limited" | "rented" | "waitlist";
  weeklyPrice: number; depositAmount: number; uberEligible: boolean;
  lyftEligible: boolean; deliveryEligible: boolean; isFeatured: boolean;
  transmission: string; fuelType: string; seats: number;
  mpgCity?: number | null; mpgHighway?: number | null;
  mileagePolicy: string; minRentalDays?: number | null;
  features: string[]; description?: string | null; images: string[];
}

export default function AdminInventoryPage() {
  const { token } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const fetchVehicles = useCallback(() => {
    if (!token) return;
    setLoading(true);
    fetch("/api/vehicles", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => { setVehicles(data.vehicles || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  useEffect(() => { fetchVehicles(); }, [fetchVehicles]);

  const toggleFeatured = async (vehicle: Vehicle) => {
    if (!token) return;
    const res = await fetch(`/api/vehicles/${vehicle.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ isFeatured: !vehicle.isFeatured }),
    });
    if (res.ok) {
      setVehicles((prev) => prev.map((v) => v.id === vehicle.id ? { ...v, isFeatured: !v.isFeatured } : v));
    }
  };

  const updateStatus = async (vehicle: Vehicle, status: Vehicle["status"]) => {
    if (!token) return;
    const res = await fetch(`/api/vehicles/${vehicle.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setVehicles((prev) => prev.map((v) => v.id === vehicle.id ? { ...v, status } : v));
    }
  };

  return (
    <div>
      <div className="mb-7 flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-[#0D1F3C] tracking-tight"
          style={{ fontFamily: "var(--font-heading)" }}>
          Inventory
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1A3A6B] text-white rounded-lg text-sm font-semibold hover:bg-[#122A52] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Vehicle
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-[#64748B]">Loading...</div>
      ) : (
        <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F7F9FC]">
                <th className="text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider py-3 px-4 pr-4">Vehicle</th>
                <th className="text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider py-3 pr-4 hidden md:table-cell">Price</th>
                <th className="text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider py-3 pr-4">Status</th>
                <th className="text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider py-3 pr-4 hidden lg:table-cell">Featured</th>
                <th className="text-left text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider py-3 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F7F9FC]">
              {vehicles.map((v) => (
                <tr key={v.id} className="hover:bg-[#F7F9FC] transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-[#0D1F3C]">{v.year} {v.make} {v.model}</p>
                    <p className="text-xs text-[#64748B] capitalize">{v.type}</p>
                  </td>
                  <td className="py-3 pr-4 text-sm text-[#64748B] hidden md:table-cell">
                    ${(v.weeklyPrice / 100).toFixed(0)}/wk
                  </td>
                  <td className="py-3 pr-4">
                    <AvailabilityBadge status={v.status} />
                  </td>
                  <td className="py-3 pr-4 hidden lg:table-cell">
                    <button onClick={() => toggleFeatured(v)}>
                      {v.isFeatured ? (
                        <ToggleRight className="h-6 w-6 text-[#1A3A6B]" />
                      ) : (
                        <ToggleLeft className="h-6 w-6 text-[#94A3B8]" />
                      )}
                    </button>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <select
                        value={v.status}
                        onChange={(e) => updateStatus(v, e.target.value as Vehicle["status"])}
                        className="text-xs px-2 py-1 border border-[#E2E8F0] rounded text-[#0D1F3C]"
                      >
                        {["available", "limited", "rented", "waitlist"].map((s) => (
                          <option key={s} value={s} className="capitalize">{s}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => setEditingVehicle(v)}
                        className="p-1.5 rounded hover:bg-[#E8F0FE] text-[#64748B] hover:text-[#1A3A6B] transition-colors"
                        title="Edit vehicle"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {vehicles.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-[#64748B]">
                    No vehicles in inventory. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Vehicle modal */}
      <VehicleFormModal
        key="add"
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSuccess={fetchVehicles}
      />

      {/* Edit Vehicle modal */}
      {editingVehicle && (
        <VehicleFormModal
          key={editingVehicle.id}
          vehicle={editingVehicle}
          open={!!editingVehicle}
          onOpenChange={(open) => { if (!open) setEditingVehicle(null); }}
          onSuccess={() => { fetchVehicles(); setEditingVehicle(null); }}
        />
      )}
    </div>
  );
}
