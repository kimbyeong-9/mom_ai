import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

type SidebarNavItemProps = {
  to: string;
  label: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  isActive: boolean;
  onNavigate?: () => void;
};

export default function SidebarNavItem({
  to,
  label,
  icon,
  iconBg,
  iconColor,
  isActive,
  onNavigate,
}: SidebarNavItemProps) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
        isActive
          ? "bg-[#B7CBAE]/35 text-[#1F3D2E]"
          : "text-[#1F3D2E]/55 hover:bg-[#1F3D2E]/5"
      )}
    >
      <span
        className="flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
        style={{ backgroundColor: iconBg, color: iconColor }}
      >
        {icon}
      </span>
      {label}
    </Link>
  );
}
