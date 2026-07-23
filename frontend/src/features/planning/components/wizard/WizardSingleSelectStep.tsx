import { useEffect, useRef } from "react";

import type { WizardOption } from "@/constants/goalWizardSteps";
import { cn } from "@/lib/utils";
import WizardOptionCard from "./WizardOptionCard";

// Tailwind's `sm` breakpoint — auto-scroll only kicks in below this, since
// desktop's shorter option grid already keeps the "기타" input in view.
const MOBILE_BREAKPOINT_PX = 640;

type WizardSingleSelectStepProps = {
  title: string;
  subtitle?: string;
  options: readonly WizardOption[];
  value: string | undefined;
  onChange: (value: string) => void;
  // "field" step only, for now — desktop shows a 3-column grid instead of
  // the default single-column stacked list. Mobile always stays 1 column.
  grid?: boolean;
  // "기타" 선택 시 아래로 펼쳐지는 직접 입력란 — 값을 넘겨준 스텝(field)에서만
  // 렌더링된다. undefined면 아예 표시하지 않는다.
  otherText?: string;
  onOtherTextChange?: (text: string) => void;
};

export default function WizardSingleSelectStep({
  title,
  subtitle,
  options,
  value,
  onChange,
  grid = false,
  otherText,
  onOtherTextChange,
}: WizardSingleSelectStepProps) {
  const otherInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!onOtherTextChange || value !== "other") return;
    if (window.innerWidth >= MOBILE_BREAKPOINT_PX) return;

    // Wait for the reveal transition (duration-300) to finish so the input
    // is at its final position before scrolling to it.
    const timer = window.setTimeout(() => {
      otherInputRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 320);
    return () => window.clearTimeout(timer);
  }, [value, onOtherTextChange]);

  return (
    <div className="flex h-full flex-col gap-[22px]">
      <div className="shrink-0">
        <h2 className="whitespace-pre-line text-2xl font-extrabold leading-snug text-[#1F3D2E] sm:text-[32px]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-[13px] font-medium leading-relaxed text-[#1F3D2E]/55">
            {subtitle}
          </p>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_24px,black_calc(100%-24px),transparent)] [mask-image:linear-gradient(to_bottom,transparent,black_24px,black_calc(100%-24px),transparent)]">
        <div
          className={
            grid
              ? "grid grid-cols-2 gap-2.5 pb-5 pt-5 sm:grid-cols-3"
              : "flex flex-col gap-2.5 pb-5 pt-5"
          }
        >
          {options.map((option) => (
            <WizardOptionCard
              key={option.value}
              label={option.label}
              description={option.description}
              muted={option.muted}
              selected={value === option.value}
              onSelect={() => onChange(option.value)}
            />
          ))}

          {onOtherTextChange && (
            <div
              className={cn(
                "col-span-full grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out",
                value === "other" ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <input
                  ref={otherInputRef}
                  type="text"
                  value={otherText ?? ""}
                  onChange={(event) => onOtherTextChange(event.target.value)}
                  placeholder="직군을 직접 입력해주세요"
                  className="mt-2.5 w-full rounded-2xl border-[1.5px] border-[#1F3D2E]/[0.12] bg-white px-4 py-3 text-sm text-[#1F3D2E] placeholder:text-[#1F3D2E]/35 focus:border-[#1F3D2E]/40 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
