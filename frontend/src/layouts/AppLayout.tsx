import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import LoginRequiredModal from "@/components/LoginRequiredModal";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import MobileBottomNav from "./components/MobileBottomNav";
import MobileTopNav from "./components/MobileTopNav";
import SidebarContent from "./components/SidebarContent";

export default function AppLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isNavHidden = useScrollDirection();

  const handleRequireAuth = () => setAuthModalOpen(true);

  return (
    <>
      <div className="flex min-h-screen bg-[#F5F1E6]">
        {/* Desktop sidebar */}
        <div className="relative hidden shrink-0 sm:block">
          <aside
            className={cn(
              "flex h-screen flex-col justify-between overflow-hidden border-r border-[#1F3D2E]/10 bg-white py-7 transition-all duration-300 ease-in-out",
              isSidebarOpen ? "w-60 px-5" : "w-0 px-0"
            )}
          >
            <SidebarContent
              activePathname={location.pathname}
              isAuthenticated={isAuthenticated}
              onRequireAuth={handleRequireAuth}
            />
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

        <div className="flex min-w-0 flex-1 flex-col">
          <MobileTopNav isHidden={isNavHidden} />

          <main className="flex-1 pb-20 pt-[60px] sm:pb-0 sm:pt-0">
            <Outlet />
          </main>
        </div>

        <MobileBottomNav
          activePathname={location.pathname}
          isAuthenticated={isAuthenticated}
          onRequireAuth={handleRequireAuth}
          isHidden={isNavHidden}
        />
      </div>

      <LoginRequiredModal
        open={isAuthModalOpen}
        message="이 메뉴는 로그인 후 이용할 수 있어요."
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}
