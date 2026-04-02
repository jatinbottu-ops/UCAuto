interface AvailabilityBadgeProps {
  status: "available" | "limited" | "rented" | "waitlist";
}

const config = {
  available: {
    label: "Available",
    className: "bg-[#DCFCE7] text-[#15803D]",
  },
  limited: {
    label: "Limited",
    className: "bg-[#FEF9C3] text-[#854D0E]",
  },
  rented: {
    label: "Rented",
    className: "bg-[#FEE2E2] text-[#DC2626]",
  },
  waitlist: {
    label: "Waitlist",
    className: "bg-[#F1F5F9] text-[#64748B]",
  },
} as const;

export function AvailabilityBadge({ status }: AvailabilityBadgeProps) {
  const { label, className } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
