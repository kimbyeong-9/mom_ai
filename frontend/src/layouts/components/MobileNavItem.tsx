import type { MouseEvent } from "react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

type MobileNavItemProps = {
  to: string;
  label: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  isActive: boolean;
  requiresAuth: boolean;
  isAuthenticated: boolean;
  onRequireAuth: () => void;
};

export default function MobileNavItem({
  to,
  label,
  icon,
  iconBg,
  iconColor,
  isActive,
  requiresAuth,
  isAuthenticated,
  onRequireAuth,
}: MobileNavItemProps) {
  const handleClick = (event: MouseEvent) => {
    if (requiresAuth && !isAuthenticated) {
      event.preventDefault();
      onRequireAuth();
    }
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      className="flex flex-1 flex-col items-center justify-center gap-1 py-2"
    >
      <span
        className={cn(
          "flex size-8 items-center justify-center rounded-full text-[13px] font-bold transition-all duration-200 ease-out",
          isActive
            ? "shadow-[0_3px_10px_rgba(31,61,46,0.3)]"
            : "opacity-55 grayscale-[0.15]"
        )}
        style={{ backgroundColor: iconBg, color: iconColor }}
      >
        {icon}
      </span>
      <span
        className={cn(
          "text-[10.5px] font-semibold transition-colors duration-200 ease-out",
          isActive ? "text-[#1F3D2E]" : "text-[#1F3D2E]/40"
        )}
      >
        {label}
      </span>
    </Link>
  );
}
