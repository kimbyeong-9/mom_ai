import { NAV_ITEMS } from "@/constants/navigation";
import { cn } from "@/lib/utils";
import { isPathActive } from "../isPathActive";
import MobileNavItem from "./MobileNavItem";

type MobileBottomNavProps = {
  activePathname: string;
  isAuthenticated: boolean;
  onRequireAuth: () => void;
  isHidden: boolean;
};

// Shared between AppLayout and HomePage so every page's mobile nav looks and
// behaves identically — one source of truth (NAV_ITEMS) rendered via map.
export default function MobileBottomNav({
  activePathname,
  isAuthenticated,
  onRequireAuth,
  isHidden,
}: MobileBottomNavProps) {
  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 flex h-16 items-stretch border-t border-[#1F3D2E]/10 bg-white transition-transform duration-300 ease-in-out sm:hidden",
        isHidden ? "translate-y-full" : "translate-y-0"
      )}
    >
      {NAV_ITEMS.map((item) => (
        <MobileNavItem
          key={item.id}
          to={item.path}
          label={item.mobileLabel}
          icon={item.icon}
          iconBg={item.iconBg}
          iconColor={item.iconColor}
          isActive={isPathActive(activePathname, item.path)}
          requiresAuth={item.requiresAuth}
          isAuthenticated={isAuthenticated}
          onRequireAuth={onRequireAuth}
        />
      ))}
    </nav>
  );
}
