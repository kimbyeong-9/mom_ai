import { NAV_ITEMS } from "@/constants/navigation";
import { isPathActive } from "../isPathActive";
import SidebarNavDropdown from "./SidebarNavDropdown";
import SidebarNavItem from "./SidebarNavItem";

type SidebarContentProps = {
  activePathname: string;
  isAuthenticated: boolean;
  onRequireAuth: () => void;
  onNavigate?: () => void;
};

export default function SidebarContent({
  activePathname,
  isAuthenticated,
  onRequireAuth,
  onNavigate,
}: SidebarContentProps) {
  return (
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
        {NAV_ITEMS.map((item) =>
          // "나의 플랜"만 데스크톱에서 드롭다운(해외 취업/디지털 노마드)으로
          // 펼쳐진다 — 나머지는 그대로 단일 링크.
          item.id === "saved" ? (
            <SidebarNavDropdown
              key={item.id}
              label={item.label}
              icon={item.icon}
              iconBg={item.iconBg}
              iconColor={item.iconColor}
              basePath={item.path}
              activePathname={activePathname}
              isAuthenticated={isAuthenticated}
              onRequireAuth={onRequireAuth}
              onNavigate={onNavigate}
            />
          ) : (
            <SidebarNavItem
              key={item.id}
              to={item.path}
              label={item.label}
              icon={item.icon}
              iconBg={item.iconBg}
              iconColor={item.iconColor}
              isActive={isPathActive(activePathname, item.path)}
              requiresAuth={item.requiresAuth}
              isAuthenticated={isAuthenticated}
              onRequireAuth={onRequireAuth}
              onNavigate={onNavigate}
            />
          ),
        )}
      </nav>
    </div>
  );
}
