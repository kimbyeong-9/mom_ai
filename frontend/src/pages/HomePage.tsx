import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import LoginRequiredModal from "@/components/LoginRequiredModal";
import VerticalSelectCard from "@/components/VerticalSelectCard";
import { SERVICE_VERTICALS } from "@/constants/verticals";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import MobileBottomNav from "@/layouts/components/MobileBottomNav";
import MobileTopNav from "@/layouts/components/MobileTopNav";
import SidebarContent from "@/layouts/components/SidebarContent";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";

// 자주 묻는 질문/이용약관/개인정보처리방침은 아직 실제 콘텐츠가 없어 자리만
// 잡아두고 비활성화 — 페이지가 생기면 Link로 교체한다.
const DISABLED_LINK_CLASSNAME = "cursor-not-allowed text-[#1F3D2E]/30";

export default function HomePage() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const isNavHidden = useScrollDirection();

  return (
    <div className="flex min-h-screen bg-[#F5F1E6]">
      {/* Desktop sidebar — same nav used across AppLayout pages, reused here so the
          homepage isn't the only page missing it. */}
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
            onRequireAuth={() => setAuthModalOpen(true)}
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

      <LoginRequiredModal
        open={isAuthModalOpen}
        message="이 메뉴는 로그인 후 이용할 수 있어요."
        onClose={() => setAuthModalOpen(false)}
      />

      <div className="relative flex min-w-0 flex-1 flex-col">
        <MobileTopNav isHidden={isNavHidden} />

        <header className="hidden items-center justify-between px-10 py-6 sm:flex">
          <div className="flex items-center gap-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#1F3D2E]">
              <span className="text-[13px] font-bold text-white">L</span>
            </div>
            <span className="whitespace-nowrap text-[15px] font-extrabold tracking-tight text-[#1F3D2E]">
              LifeFlow AI
            </span>
          </div>

          <nav className="flex items-center gap-7">
            {SERVICE_VERTICALS.map((vertical) => (
              <Link
                key={vertical.id}
                to={`/start?vertical=${vertical.id}`}
                className="text-sm font-semibold text-[#1F3D2E]/70 transition-colors hover:text-[#1F3D2E]"
              >
                {vertical.label}
              </Link>
            ))}
            <span className={`text-sm font-semibold ${DISABLED_LINK_CLASSNAME}`}>자주 묻는 질문</span>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <Link
                to="/mypage"
                className="flex h-10 items-center gap-2 rounded-full border border-[#1F3D2E]/15 bg-white py-1 pl-1.5 pr-5 text-sm font-semibold text-[#1F3D2E] transition-colors hover:bg-[#1F3D2E]/5"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#1F3D2E] text-xs font-bold text-white">
                  {user.name.slice(0, 1)}
                </span>
                {user.name}
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex h-10 items-center justify-center rounded-full border border-[#1F3D2E]/15 bg-white px-5 text-sm font-semibold text-[#1F3D2E] transition-colors hover:bg-[#1F3D2E]/5"
              >
                로그인
              </Link>
            )}
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-8 pb-20 pt-[76px] sm:flex-row sm:gap-20 sm:px-10 sm:pb-8 sm:pt-8">
          <div className="flex w-full max-w-[420px] flex-col items-center gap-3 text-center sm:items-start sm:text-left">
            <h1 className="text-[26px] font-extrabold leading-snug text-[#1F3D2E] sm:text-[38px] sm:leading-[1.25]">
              어떤 방식이
              <br />
              맞으신가요?
            </h1>
            <p className="text-[13.5px] font-medium leading-relaxed text-[#1F3D2E]/60 sm:text-[15px]">
              둘 중 하나를 고르면, 그에 맞는 질문과 절차로 바로 안내해드려요
            </p>
          </div>

          <div className="flex w-full max-w-[420px] flex-col gap-3">
            {SERVICE_VERTICALS.map((vertical) => (
              <VerticalSelectCard
                key={vertical.id}
                icon={vertical.icon}
                label={vertical.label}
                iconBg={vertical.iconBg}
                iconColor={vertical.iconColor}
                description={vertical.description}
                to={`/start?vertical=${vertical.id}`}
              />
            ))}
          </div>
        </main>

        <footer className="flex flex-col items-center justify-between gap-2 border-t border-[#1F3D2E]/8 px-6 py-5 text-xs text-[#1F3D2E]/40 sm:flex-row sm:px-10">
          <span>© 2026 LifeFlow AI</span>
          <div className="flex items-center gap-4">
            <span className={DISABLED_LINK_CLASSNAME}>이용약관</span>
            <span className={DISABLED_LINK_CLASSNAME}>개인정보처리방침</span>
          </div>
        </footer>
      </div>

      <MobileBottomNav
        activePathname={location.pathname}
        isAuthenticated={isAuthenticated}
        onRequireAuth={() => setAuthModalOpen(true)}
        isHidden={isNavHidden}
      />
    </div>
  );
}
