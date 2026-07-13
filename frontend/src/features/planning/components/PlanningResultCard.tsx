import { useState } from "react";

import { getGoalTypeLabel, type GoalTypeId } from "@/constants/goalTypes";
import type { PlanningStep } from "../types/planning.types";
import PlanningResultStepRow from "./PlanningResultStepRow";

const COLLAPSED_STEP_COUNT = 3;

type PlanningResultCardProps = {
  title: string;
  goalType: GoalTypeId;
  goalText: string;
  steps: PlanningStep[];
  onSave: () => void;
  isSaving: boolean;
  onRegenerate: () => void;
};

export default function PlanningResultCard({
  title,
  goalType,
  goalText,
  steps,
  onSave,
  isSaving,
  onRegenerate,
}: PlanningResultCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasHiddenSteps = steps.length > COLLAPSED_STEP_COUNT;
  const visibleSteps = isExpanded ? steps : steps.slice(0, COLLAPSED_STEP_COUNT);

  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(31,61,46,0.05)] sm:rounded-[18px] sm:p-5">
      <div className="mb-1.5 flex flex-wrap items-center gap-2">
        <span className="text-sm font-bold text-[#1F3D2E] sm:text-[15.5px]">{title}</span>
        <span className="rounded-full bg-[#B7CBAE] px-2 py-0.5 text-[11px] font-semibold text-[#1F3D2E]">
          {getGoalTypeLabel(goalType)}
        </span>
        <span className="rounded-full bg-[#1F3D2E]/[0.05] px-2 py-0.5 text-[10.5px] font-medium text-[#1F3D2E]/55">
          + AI 생성 · 최신 정책 기준
        </span>
      </div>

      <p className="mb-3.5 text-[12px] text-[#1F3D2E]/50 sm:mb-4 sm:text-[12.5px]">{goalText}</p>

      <div className="flex flex-col gap-2.5">
        {visibleSteps.map((step) => (
          <PlanningResultStepRow
            key={step.id}
            order={step.order}
            title={step.title}
            description={step.description}
          />
        ))}
      </div>

      {hasHiddenSteps && (
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="mt-2.5 text-[12px] font-semibold text-[#1F3D2E]/55 underline-offset-2 hover:underline sm:text-[12.5px]"
        >
          {isExpanded ? "접기 ↑" : `남은 ${steps.length - COLLAPSED_STEP_COUNT}단계 전체 보기 →`}
        </button>
      )}

      <div className="mt-4 flex gap-2.5">
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="flex h-10 flex-1 items-center justify-center rounded-xl bg-[#1F3D2E] text-[13px] font-semibold text-white transition-colors hover:bg-[#1a3325] disabled:opacity-50 sm:flex-none sm:px-6"
        >
          {isSaving ? "저장 중..." : "내 플랜에 저장"}
        </button>
        <button
          type="button"
          onClick={onRegenerate}
          className="hidden h-10 items-center justify-center rounded-xl border border-[#1F3D2E]/15 bg-white px-6 text-[13px] font-semibold text-[#1F3D2E] transition-colors hover:bg-[#1F3D2E]/5 sm:flex"
        >
          다시 만들기
        </button>
      </div>
    </div>
  );
}
