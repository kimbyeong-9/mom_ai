import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

type MobileNavItemProps = {
  to: string;
  label: string;
  icon: string;
  isActive: boolean;
};

export default function MobileNavItem({ to, label, icon, isActive }: MobileNavItemProps) {
  return (
    <Link
      to={to}
      className={cn(
        "flex flex-col items-center gap-0.5 text-[10px] font-semibold",
        isActive ? "text-[#1F3D2E]" : "text-[#1F3D2E]/40"
      )}
    >
      <span
        className={cn(
          "flex size-[22px] items-center justify-center rounded-full text-[11px] font-bold",
          !isActive && "bg-[#1F3D2E]/8 text-[#1F3D2E]/50"
        )}
        style={isActive ? { backgroundColor: "#1F3D2E", color: "#FFFFFF" } : undefined}
      >
        {icon}
      </span>
      {label}
    </Link>
  );
}
