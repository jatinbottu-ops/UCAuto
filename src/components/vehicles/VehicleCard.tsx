import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AvailabilityBadge } from "./AvailabilityBadge";

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
  uberEligible: boolean;
  lyftEligible: boolean;
  deliveryEligible: boolean;
  images: string[];
}

interface VehicleCardProps {
  vehicle: Vehicle;
  className?: string;
}

export function VehicleCard({ vehicle, className }: VehicleCardProps) {
  const pricePerWeek = (vehicle.weeklyPrice / 100).toFixed(0);
  const deposit = (vehicle.depositAmount / 100).toFixed(0);
  const isAvailable =
    vehicle.status === "available" || vehicle.status === "limited";

  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-[#E2E8F0] overflow-hidden",
        "transition-shadow duration-200",
        "hover:shadow-[0_2px_8px_rgba(0,0,0,0.06),_0_8px_24px_rgba(26,58,107,0.08)]",
        "shadow-[0_1px_4px_rgba(0,0,0,0.04),_0_4px_16px_rgba(26,58,107,0.05)]",
        className
      )}
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden bg-[#E8F0FE]">
        {vehicle.images && vehicle.images.length > 0 ? (
          <Image
            src={vehicle.images[0]}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-14 h-14 text-[#1A3A6B] opacity-20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 9l-7 2-7-2V5l7-2 7 2v4zM5 9v6l7 2 7-2V9"
              />
            </svg>
          </div>
        )}
        <div className="absolute top-2.5 left-2.5">
          <AvailabilityBadge status={vehicle.status} />
        </div>
      </div>

      {/* Card body */}
      <div className="p-4">
        {/* Name + price */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-bold text-[#0D1F3C] text-sm leading-snug tracking-tight">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5 capitalize">
              {vehicle.type} · {vehicle.transmission}
            </p>
          </div>
          <div className="text-right shrink-0 ml-3">
            <span className="text-lg font-extrabold text-[#1A3A6B] tracking-tight">
              ${pricePerWeek}
            </span>
            <span className="text-xs text-[#94A3B8]">/wk</span>
          </div>
        </div>

        {/* Platform tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {vehicle.uberEligible && (
            <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#E8F0FE] text-[#1A3A6B] rounded">
              Uber
            </span>
          )}
          {vehicle.lyftEligible && (
            <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#E8F0FE] text-[#1A3A6B] rounded">
              Lyft
            </span>
          )}
          {vehicle.deliveryEligible && (
            <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#FFF7ED] text-[#C2410C] rounded">
              Delivery
            </span>
          )}
        </div>

        {/* CTA */}
        <Link
          href={isAvailable ? `/cars/${vehicle.slug}` : `/waitlist/${vehicle.id}`}
          className={cn(
            "block w-full text-center py-2.5 px-4 rounded-md font-semibold text-sm transition-colors",
            isAvailable
              ? "bg-[#1A3A6B] text-white hover:bg-[#122A52]"
              : "border border-[#E2E8F0] text-[#64748B] hover:border-[#1A3A6B] hover:text-[#1A3A6B]"
          )}
        >
          {isAvailable ? "View Details" : "Join Waitlist"}
        </Link>
        <p className="text-center text-[10px] text-[#94A3B8] mt-1.5">
          ${deposit} deposit · No credit check
        </p>
      </div>
    </div>
  );
}
