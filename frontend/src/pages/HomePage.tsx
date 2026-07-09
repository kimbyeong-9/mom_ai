import { Link } from "react-router-dom";

import HomeFeatureCard from "@/components/HomeFeatureCard";

const HOME_FEATURES = [
  {
    id: 1,
    iconBg: "#1F3D2E",
    iconColor: "#FFFFFF",
    title: "목표를 말하면 AI가 절차를 만들어요",
    description: "복잡한 준비 과정, 자연어로 입력하면 단계별로 정리해드려요.",
  },
  {
    id: 2,
    iconBg: "#B7CBAE",
    iconColor: "#1F3D2E",
    title: "마음에 든 플랜은 저장해요",
    description: "저장한 플랜은 언제든 다시 이어볼 수 있어요.",
  },
  {
    id: 3,
    iconBg: "#F0D6C4",
    iconColor: "#8A5A3A",
    title: "반복 행동은 자동화로 실행해요",
    description: "알림, 문서 정리, 체크리스트까지 자동으로 이어져요.",
  },
] as const;

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F5F1E6]">
      <div className="pointer-events-none absolute -right-10 -top-8 size-36 rounded-full bg-[#B7CBAE] opacity-40 sm:-right-16 sm:-top-10 sm:size-52" />
      <div className="pointer-events-none absolute -left-10 bottom-44 size-24 rounded-full bg-[#F0D6C4] opacity-40 sm:-left-12 sm:bottom-16 sm:size-36" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col">
        <header className="flex items-center justify-between px-5 py-4 sm:px-14 sm:py-6">
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <div className="flex size-7 items-center justify-center rounded-full bg-[#1F3D2E] sm:size-9">
              <span className="text-xs font-bold text-white sm:text-sm">L</span>
            </div>
            <span className="text-base font-extrabold tracking-tight text-[#1F3D2E] sm:hidden">
              LifeFlow AI
            </span>
            <span className="hidden text-xl font-extrabold tracking-tight text-[#1F3D2E] sm:inline">
              LifeFlow
            </span>
            <span className="hidden rounded-full bg-[#B7CBAE] px-2 py-0.5 text-xs font-semibold text-[#1F3D2E] sm:inline">
              AI
            </span>
          </div>
          <Link
            to="/login"
            className="flex h-8 items-center justify-center rounded-full border border-[#1F3D2E]/15 bg-white px-4 text-xs font-semibold text-[#1F3D2E] transition-colors hover:bg-[#1F3D2E]/5 sm:h-[42px] sm:px-6 sm:text-sm"
          >
            로그인
          </Link>
        </header>

        <section className="flex flex-col items-center gap-3.5 px-6 pb-5 pt-2 text-center sm:gap-5 sm:px-10 sm:pb-10 sm:pt-6">
          <span className="rounded-full bg-[#1F3D2E]/[0.08] px-3 py-1 text-xs font-semibold text-[#1F3D2E]/60">
            MOM AI · 생활 준비 에이전트
          </span>

          <h1 className="max-w-[680px] text-[26px] font-extrabold leading-snug tracking-tight text-[#1F3D2E] sm:text-[44px] sm:leading-[1.25]">
            <span className="sm:hidden">
              생활 준비, 매번
              <br />
              처음부터 찾지 마세요
            </span>
            <span className="hidden sm:inline">
              생활 준비, 매번 처음부터
              <br />
              찾지 마세요
            </span>
          </h1>

          <p className="max-w-[560px] text-[13.5px] font-medium leading-relaxed text-[#1F3D2E]/65 sm:text-base">
            청년지원금부터 해외살이, 이직, 노마드 준비까지 — AI가 절차를
            짜고, 저장하고, 반복 행동까지 자동화해드려요.
          </p>

          <Link
            to="/planning"
            className="mt-1 flex h-[50px] w-full items-center justify-center rounded-2xl bg-[#1F3D2E] text-[14.5px] font-semibold text-white transition-colors hover:bg-[#1a3325] sm:mt-1.5 sm:h-[52px] sm:w-[180px] sm:text-[15px]"
          >
            무료로 시작하기
          </Link>
        </section>

        <div className="flex flex-col gap-2.5 px-5 pb-8 sm:flex-row sm:gap-5 sm:px-14 sm:pb-10">
          {HOME_FEATURES.map((feature, index) => (
            <HomeFeatureCard
              key={feature.id}
              index={index + 1}
              iconBg={feature.iconBg}
              iconColor={feature.iconColor}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
