import Link from "next/link";
import Image from "next/image";
import { AvailabilityBadge } from "./AvailabilityBadge";

interface HeroVehicle {
  id: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  type: string;
  status: "available" | "limited" | "rented" | "waitlist";
  weeklyPrice: number;
  depositAmount: number;
  uberEligible: boolean;
  lyftEligible: boolean;
  deliveryEligible: boolean;
  images: string[];
}

interface HeroVehicleCardsProps {
  vehicles: HeroVehicle[];
  totalCount?: number;
}

function HeroCard({
  vehicle,
  highlighted,
}: {
  vehicle: HeroVehicle;
  highlighted: boolean;
}) {
  const price = (vehicle.weeklyPrice / 100).toFixed(0);
  const isAvailable =
    vehicle.status === "available" || vehicle.status === "limited";

  return (
    <div
      className={`bg-white rounded-lg overflow-hidden ${
        highlighted
          ? "border-[1.5px] border-[#1A3A6B] shadow-[0_2px_12px_rgba(26,58,107,0.12)]"
          : "border border-[#E2E8F0] shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
      }`}
    >
      <div className="flex">
        {/* Photo strip */}
        <div className="relative w-28 shrink-0 bg-[#E8F0FE]">
          {vehicle.images && vehicle.images.length > 0 ? (
            <Image
              src={vehicle.images[0]}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              fill
              className="object-cover"
              sizes="112px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-[#1A3A6B] opacity-20"
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
        </div>

        {/* Info */}
        <div className="flex-1 p-3">
          <div className="flex items-start justify-between mb-1.5">
            <div>
              <p className="text-sm font-bold text-[#0D1F3C] leading-tight tracking-tight">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </p>
              <p className="text-[10px] text-[#94A3B8] mt-0.5 capitalize">
                {vehicle.type}
              </p>
            </div>
            <div className="text-right shrink-0 ml-2">
              <span className="text-base font-extrabold text-[#1A3A6B] tracking-tight">
                ${price}
              </span>
              <span className="text-[10px] text-[#94A3B8]">/wk</span>
            </div>
          </div>

          <div className="flex gap-1 mb-2.5">
            <AvailabilityBadge status={vehicle.status} />
            {vehicle.uberEligible && (
              <span className="text-[9px] font-semibold px-1.5 py-0.5 bg-[#E8F0FE] text-[#1A3A6B] rounded">
                Uber
              </span>
            )}
            {vehicle.lyftEligible && (
              <span className="text-[9px] font-semibold px-1.5 py-0.5 bg-[#E8F0FE] text-[#1A3A6B] rounded">
                Lyft
              </span>
            )}
          </div>

          <Link
            href={isAvailable ? `/cars/${vehicle.slug}` : `/waitlist/${vehicle.id}`}
            className={`block w-full text-center py-1.5 rounded text-[11px] font-bold transition-colors ${
              highlighted
                ? "bg-[#1A3A6B] text-white hover:bg-[#122A52]"
                : "border border-[#CBD5E1] text-[#64748B] hover:border-[#1A3A6B] hover:text-[#1A3A6B]"
            }`}
          >
            {isAvailable ? "Apply →" : "Join Waitlist"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export function HeroVehicleCards({
  vehicles,
  totalCount,
}: HeroVehicleCardsProps) {
  const [first, second] = vehicles;

  return (
    <div className="flex flex-col gap-3">
      {first && <HeroCard vehicle={first} highlighted />}
      {second && <HeroCard vehicle={second} highlighted={false} />}
      {totalCount && totalCount > 2 && (
        <p className="text-center text-xs text-[#94A3B8]">
          + {totalCount - 2} more vehicles available
        </p>
      )}
    </div>
  );
}
