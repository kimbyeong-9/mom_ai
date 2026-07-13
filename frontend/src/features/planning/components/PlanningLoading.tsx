import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const LOADING_MESSAGES = [
  "목표를 분석하고 있어요...",
  "관련 절차와 조건을 찾고 있어요...",
  "실행 가능한 단계로 정리하고 있어요...",
  "거의 다 됐어요...",
];

const MESSAGE_INTERVAL_MS = 2400;

function SkeletonStepRow({ delayMs }: { delayMs: number }) {
  return (
    <div className="flex items-start gap-2.5">
      <div
        className="mt-0.5 size-5 shrink-0 animate-pulse rounded-full bg-[#1F3D2E]/10 sm:size-[22px]"
        style={{ animationDelay: `${delayMs}ms` }}
      />
      <div className="flex flex-1 flex-col gap-1.5 py-0.5">
        <div
          className="h-2.5 w-2/5 animate-pulse rounded-full bg-[#1F3D2E]/10"
          style={{ animationDelay: `${delayMs}ms` }}
        />
        <div
          className="h-2 w-4/5 animate-pulse rounded-full bg-[#1F3D2E]/[0.06]"
          style={{ animationDelay: `${delayMs}ms` }}
        />
      </div>
    </div>
  );
}

export default function PlanningLoading() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, MESSAGE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(31,61,46,0.05)] sm:rounded-[18px] sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        <Loader2 className="size-4 shrink-0 animate-spin text-[#1F3D2E]" />
        <p className="text-[13px] font-semibold text-[#1F3D2E] sm:text-[13.5px]">
          {LOADING_MESSAGES[messageIndex]}
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        <SkeletonStepRow delayMs={0} />
        <SkeletonStepRow delayMs={150} />
        <SkeletonStepRow delayMs={300} />
      </div>
    </div>
  );
}
