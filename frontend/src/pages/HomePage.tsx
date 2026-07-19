import { Link } from "react-router-dom";

import VerticalSelectCard from "@/components/VerticalSelectCard";
import { SERVICE_VERTICALS } from "@/constants/verticals";
import { usePageTitle } from "@/layouts/usePageTitle";

export default function HomePage() {
  usePageTitle("홈");

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F5F1E6]">
      <div className="pointer-events-none absolute -right-10 -top-8 size-36 rounded-full bg-[#B7CBAE] opacity-40 sm:-right-16 sm:-top-10 sm:size-52" />
      <div className="pointer-events-none absolute -left-10 bottom-44 size-24 rounded-full bg-[#F0D6C4] opacity-40 sm:-left-12 sm:bottom-16 sm:size-36" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col">
        <header className="flex items-center justify-end px-5 py-4 sm:px-14 sm:py-6">
          <Link
            to="/login"
            className="flex h-8 items-center justify-center rounded-full border border-[#1F3D2E]/15 bg-white px-4 text-xs font-semibold text-[#1F3D2E] transition-colors hover:bg-[#1F3D2E]/5 sm:h-[42px] sm:px-6 sm:text-sm"
          >
            로그인
          </Link>
        </header>

        <section className="flex flex-col items-center gap-3.5 px-6 pb-5 pt-2 text-center sm:gap-5 sm:px-10 sm:pb-10 sm:pt-6">
          <span className="rounded-full bg-[#1F3D2E]/[0.08] px-3 py-1 text-xs font-semibold text-[#1F3D2E]/60">
            MOM AI · 해외 준비 에이전트
          </span>

          <h1 className="max-w-[680px] text-[26px] font-extrabold leading-snug tracking-tight text-[#1F3D2E] sm:text-[44px] sm:leading-[1.25]">
            해외에서의 다음 걸음,
            <br />
            어떤 방식이 맞으신가요?
          </h1>

          <p className="max-w-[560px] text-[13.5px] font-medium leading-relaxed text-[#1F3D2E]/65 sm:text-base">
            두 가지 방향 중 하나를 고르면, 그에 맞는 질문과 절차로 바로
            안내해드려요
          </p>
        </section>

        <div className="flex flex-col gap-3.5 px-5 pb-6 sm:flex-row sm:gap-6 sm:px-14 sm:pb-8">
          {SERVICE_VERTICALS.map((vertical) => (
            <VerticalSelectCard
              key={vertical.id}
              icon={vertical.icon}
              label={vertical.label}
              gradientFrom={vertical.gradientFrom}
              gradientTo={vertical.gradientTo}
              description={vertical.description}
              tags={vertical.tags}
              tagBg={vertical.tagBg}
              tagColor={vertical.tagColor}
              ctaLabel={vertical.ctaLabel}
              variant={vertical.variant}
              to={`/start?vertical=${vertical.id}`}
            />
          ))}
        </div>

        <Link
          to="/start"
          className="pb-8 text-center text-xs font-semibold text-[#1F3D2E]/40 sm:pb-10 sm:text-[13.5px]"
        >
          잘 모르겠어요, 질문으로 찾아볼게요 →
        </Link>
      </div>
    </div>
  );
}
