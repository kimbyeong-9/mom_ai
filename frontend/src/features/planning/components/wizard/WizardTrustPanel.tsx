const TRUST_POINTS = [
  "희망 시점에 맞춘 자동화 알림 주기",
  "비자·서류 마감일 역산 스케줄",
  "지금 바로 지원 가능한 공고 우선순위",
] as const;

export default function WizardTrustPanel() {
  return (
    <div className="relative hidden w-[360px] shrink-0 flex-col justify-center gap-[18px] overflow-hidden bg-[#1F3D2E] p-12 sm:flex">
      <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-[#2E5340] opacity-60" />
      <p className="relative text-[13px] font-bold tracking-wide text-white/55">
        답변을 바탕으로 이런 걸 확인해요
      </p>
      <ul className="relative flex flex-col gap-3">
        {TRUST_POINTS.map((point) => (
          <li key={point} className="flex items-start gap-2.5">
            <span className="font-bold text-[#B7CBAE]">✓</span>
            <span className="text-[13.5px] font-medium leading-relaxed text-white">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
