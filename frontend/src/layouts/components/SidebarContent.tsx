import { NAV_ITEMS } from "@/constants/navigation";
import { isPathActive } from "../isPathActive";
import SidebarNavItem from "./SidebarNavItem";

type SidebarContentProps = {
  activePathname: string;
  onLogout: () => void;
  onNavigate?: () => void;
};

export default function SidebarContent({
  activePathname,
  onLogout,
  onNavigate,
}: SidebarContentProps) {
  return (
    <>
      <div className="w-48 shrink-0">
        <div className="mb-7 flex items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#1F3D2E]">
            <span className="text-[13px] font-bold text-white">L</span>
          </div>
          <span className="whitespace-nowrap text-[15px] font-extrabold tracking-tight text-[#1F3D2E]">
            LifeFlow AI
          </span>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <SidebarNavItem
              key={item.id}
              to={item.path}
              label={item.label}
              icon={item.icon}
              iconBg={item.iconBg}
              iconColor={item.iconColor}
              isActive={isPathActive(activePathname, item.path)}
              onNavigate={onNavigate}
            />
          ))}
        </nav>
      </div>

      <div className="w-48 shrink-0 border-t border-[#1F3D2E]/10 pt-3.5">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#1F3D2E]/40 transition-colors hover:bg-[#1F3D2E]/5"
        >
          <span className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-[#1F3D2E]/8 text-xs text-[#1F3D2E]/50">
            ↩
          </span>
          로그아웃
        </button>
      </div>
    </>
  );
}
