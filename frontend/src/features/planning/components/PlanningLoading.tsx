import { useEffect, useState } from "react";

// Honest, generic progress messages — no fabricated scan counts or match
// numbers here. Real search-grounded results (e.g. "128 postings scanned")
// need an actual backend search integration before they can be shown.
const LOADING_STEPS = [
  "입력하신 조건을 확인하고 있어요",
  "관련 절차와 조건을 정리하고 있어요",
  "실행 가능한 단계로 구성하고 있어요",
] as const;

const STEP_INTERVAL_MS = 1800;

type PlanningLoadingProps = {
  heading?: string;
};

export default function PlanningLoading({ heading }: PlanningLoadingProps) {
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCompletedCount((prev) => Math.min(prev + 1, LOADING_STEPS.length - 1));
    }, STEP_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl bg-white p-8 py-14 text-center shadow-[0_2px_10px_rgba(31,61,46,0.05)] sm:rounded-[18px]">
      <div className="size-16 animate-spin rounded-full border-[3px] border-[#1F3D2E]/15 border-t-[#1F3D2E]" />

      <p className="max-w-xs whitespace-pre-line text-[17px] font-extrabold leading-snug text-[#1F3D2E]">
        {heading ?? "목표를 실제로 조사하고 있어요"}
      </p>

      <div className="flex w-full max-w-xs flex-col gap-3">
        {LOADING_STEPS.map((step, index) => {
          const isDone = index < completedCount;
          const isActive = index === completedCount;
          return (
            <div
              key={step}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-left transition-colors ${
                isActive ? "bg-[#B7CBAE]/20" : ""
              }`}
            >
              {isDone ? (
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#1F3D2E] text-[10px] font-bold text-white">
                  ✓
                </span>
              ) : isActive ? (
                <span className="size-2 shrink-0 animate-pulse rounded-full bg-[#1F3D2E]" />
              ) : (
                <span className="size-5 shrink-0 rounded-full border-[1.5px] border-[#1F3D2E]/25" />
              )}
              <span
                className={`text-[13.5px] font-semibold ${
                  isDone || isActive ? "text-[#1F3D2E]" : "text-[#1F3D2E]/40"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
