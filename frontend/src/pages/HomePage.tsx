import { Link } from "react-router-dom";

import VerticalSelectCard from "@/components/VerticalSelectCard";
import { SERVICE_VERTICALS } from "@/constants/verticals";

// 자주 묻는 질문/이용약관/개인정보처리방침은 아직 실제 콘텐츠가 없어 자리만
// 잡아두고 비활성화 — 페이지가 생기면 Link로 교체한다.
const DISABLED_LINK_CLASSNAME = "cursor-not-allowed text-[#1F3D2E]/30";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F5F1E6]">
      <header className="flex items-center justify-between px-5 py-4 sm:px-10 sm:py-6">
        <div className="flex items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#1F3D2E]">
            <span className="text-[13px] font-bold text-white">L</span>
          </div>
          <span className="whitespace-nowrap text-[15px] font-extrabold tracking-tight text-[#1F3D2E]">
            LifeFlow AI
          </span>
        </div>

        <nav className="hidden items-center gap-7 sm:flex">
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

        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link
            to="/login"
            className="flex h-8 items-center justify-center rounded-full border border-[#1F3D2E]/15 bg-white px-4 text-xs font-semibold text-[#1F3D2E] transition-colors hover:bg-[#1F3D2E]/5 sm:h-10 sm:px-5 sm:text-sm"
          >
            로그인
          </Link>
          <Link
            to="/start"
            className="hidden h-10 items-center justify-center rounded-full bg-[#1F3D2E] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#1a3325] sm:flex"
          >
            시작하기
          </Link>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-8 sm:flex-row sm:gap-20 sm:px-10">
        <div className="flex w-full max-w-[420px] flex-col items-center gap-3 text-center sm:items-start sm:text-left">
          <h1 className="text-[26px] font-extrabold leading-snug text-[#1F3D2E] sm:text-[38px] sm:leading-[1.25]">
            어떤 방식이
            <br />
            맞으신가요?
          </h1>
          <p className="text-[13.5px] font-medium leading-relaxed text-[#1F3D2E]/60 sm:text-[15px]">
            둘 중 하나를 고르면, 그에 맞는 질문과 절차로 바로 안내해드려요
          </p>
          <Link
            to="/start"
            className="mt-1 text-xs font-semibold text-[#1F3D2E]/45 underline-offset-2 hover:underline sm:text-sm"
          >
            잘 모르겠어요, 질문으로 찾아볼게요 →
          </Link>
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
  );
}
