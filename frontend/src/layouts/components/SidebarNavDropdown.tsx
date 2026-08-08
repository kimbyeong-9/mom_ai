import { ChevronDown } from "lucide-react";
import { useState, type MouseEvent } from "react";
import { Link } from "react-router-dom";

import { GOAL_TYPES } from "@/constants/goalTypes";
import { cn } from "@/lib/utils";
import { isPathActive } from "../isPathActive";

type SidebarNavDropdownProps = {
  label: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  basePath: string;
  activePathname: string;
  isAuthenticated: boolean;
  onRequireAuth: () => void;
  onNavigate?: () => void;
};

// Desktop-only: "나의 플랜" toggles this open instead of navigating directly —
// GOAL_TYPES drives the two category links inside, so it stays in sync with
// the category pages (SavedCategoryPage) automatically if verticals change.
export default function SidebarNavDropdown({
  label,
  icon,
  iconBg,
  iconColor,
  basePath,
  activePathname,
  isAuthenticated,
  onRequireAuth,
  onNavigate,
}: SidebarNavDropdownProps) {
  const isActive = isPathActive(activePathname, basePath);
  const [isOpen, setIsOpen] = useState(isActive);

  const handleToggle = () => {
    if (!isAuthenticated) {
      onRequireAuth();
      return;
    }
    setIsOpen((prev) => !prev);
  };

  const handleSubItemClick = (event: MouseEvent) => {
    if (!isAuthenticated) {
      event.preventDefault();
      onRequireAuth();
      return;
    }
    onNavigate?.();
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
          isActive
            ? "bg-[#B7CBAE]/35 text-[#1F3D2E]"
            : "text-[#1F3D2E]/55 hover:bg-[#1F3D2E]/5",
        )}
      >
        <span
          className="flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
          style={{ backgroundColor: iconBg, color: iconColor }}
        >
          {icon}
        </span>
        <span className="flex-1 text-left">{label}</span>
        <ChevronDown
          size={15}
          strokeWidth={2.5}
          className={cn("shrink-0 transition-transform duration-300", isOpen && "rotate-180")}
        />
      </button>

      <div
        className={cn(
          "grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden pl-[34px] pt-1">
          <div className="flex flex-col gap-0.5 border-l border-[#1F3D2E]/10 pl-3">
            {GOAL_TYPES.map((goalType) => {
              const to = `/saved/category/${goalType.id}`;
              const isSubActive = isPathActive(activePathname, to);
              return (
                <Link
                  key={goalType.id}
                  to={to}
                  onClick={handleSubItemClick}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] font-semibold transition-colors",
                    isSubActive
                      ? "bg-[#B7CBAE]/35 text-[#1F3D2E]"
                      : "text-[#1F3D2E]/50 hover:bg-[#1F3D2E]/5",
                  )}
                >
                  <span
                    className="size-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: goalType.iconBg }}
                  />
                  {goalType.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
