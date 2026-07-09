import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { NAV_ITEMS } from "@/constants/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import MobileNavItem from "./components/MobileNavItem";
import SidebarContent from "./components/SidebarContent";
import { isPathActive } from "./isPathActive";
import { PageTitleProvider } from "./PageTitleContext";
import { usePageTitleValue } from "./usePageTitle";

function MobileHeader({ onOpenMenu }: { onOpenMenu: () => void }) {
  const title = usePageTitleValue();

  return (
    <header className="flex h-[60px] shrink-0 items-center gap-2 border-b border-[#1F3D2E]/8 bg-white px-4 sm:hidden">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="메뉴 열기"
        className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[#1F3D2E] transition-colors hover:bg-[#1F3D2E]/5"
      >
        <span className="flex flex-col gap-[3px]">
          <span className="h-[1.5px] w-4 rounded-full bg-current" />
          <span className="h-[1.5px] w-4 rounded-full bg-current" />
          <span className="h-[1.5px] w-4 rounded-full bg-current" />
        </span>
      </button>
      <div className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-[#1F3D2E]">
        <span className="text-[11px] font-bold text-white">L</span>
      </div>
      <span className="truncate text-sm font-extrabold tracking-tight text-[#1F3D2E]">
        {title}
      </span>
    </header>
  );
}

export default function AppLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <PageTitleProvider>
      <div className="flex min-h-screen bg-[#F5F1E6]">
        {/* Desktop sidebar */}
        <div className="relative hidden shrink-0 sm:block">
          <aside
            className={cn(
              "flex h-screen flex-col justify-between overflow-hidden border-r border-[#1F3D2E]/10 bg-white py-7 transition-all duration-300 ease-in-out",
              isSidebarOpen ? "w-60 px-5" : "w-0 px-0"
            )}
          >
            <SidebarContent activePathname={location.pathname} onLogout={handleLogout} />
          </aside>

          <button
            type="button"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label={isSidebarOpen ? "메뉴 닫기" : "메뉴 열기"}
            className={cn(
              "absolute top-8 z-20 flex size-6 items-center justify-center rounded-full border border-[#1F3D2E]/15 bg-white text-xs font-bold text-[#1F3D2E] shadow-sm transition-all duration-300 ease-in-out hover:bg-[#1F3D2E]/5",
              isSidebarOpen ? "left-[232px]" : "left-3"
            )}
          >
            {isSidebarOpen ? "‹" : "›"}
          </button>
        </div>

        {/* Mobile drawer backdrop */}
        <div
          aria-hidden={!isMobileMenuOpen}
          onClick={closeMobileMenu}
          className={cn(
            "fixed inset-0 z-30 bg-black/40 transition-opacity duration-300 ease-in-out sm:hidden",
            isMobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
          )}
        />

        {/* Mobile drawer panel */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 flex w-64 flex-col justify-between bg-white px-5 py-7 shadow-xl transition-transform duration-300 ease-in-out sm:hidden",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <SidebarContent
            activePathname={location.pathname}
            onNavigate={closeMobileMenu}
            onLogout={() => {
              closeMobileMenu();
              handleLogout();
            }}
          />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <MobileHeader onOpenMenu={() => setMobileMenuOpen(true)} />

          <main className="flex-1 pb-20 sm:pb-0">
            <Outlet />
          </main>
        </div>

        <nav className="fixed inset-x-0 bottom-0 z-20 flex h-16 items-center justify-around border-t border-[#1F3D2E]/10 bg-white sm:hidden">
          {NAV_ITEMS.map((item) => (
            <MobileNavItem
              key={item.id}
              to={item.path}
              label={item.mobileLabel}
              icon={item.icon}
              isActive={isPathActive(location.pathname, item.path)}
            />
          ))}
        </nav>
      </div>
    </PageTitleProvider>
  );
}
