import { getGoalTypeLabel, type GoalTypeId } from "@/constants/goalTypes";
import type { PlanningStep } from "../types/planning.types";
import PlanningResultStepRow from "./PlanningResultStepRow";

type PlanningResultCardProps = {
  title: string;
  goalType: GoalTypeId;
  steps: PlanningStep[];
  onSave: () => void;
  isSaving: boolean;
  onRegenerate: () => void;
};

export default function PlanningResultCard({
  title,
  goalType,
  steps,
  onSave,
  isSaving,
  onRegenerate,
}: PlanningResultCardProps) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(31,61,46,0.05)] sm:rounded-[18px] sm:p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2 sm:mb-3.5">
        <span className="text-sm font-bold text-[#1F3D2E] sm:text-[15.5px]">{title}</span>
        <span className="rounded-full bg-[#B7CBAE] px-2 py-0.5 text-[11px] font-semibold text-[#1F3D2E]">
          {getGoalTypeLabel(goalType)}
        </span>
      </div>

      <div className="flex flex-col gap-2.5 sm:gap-2.5">
        {steps.map((step) => (
          <PlanningResultStepRow
            key={step.id}
            order={step.order}
            title={step.title}
            description={step.description}
          />
        ))}
      </div>

      <div className="mt-4 flex gap-2.5 sm:mt-4">
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="flex h-10 flex-1 items-center justify-center rounded-xl bg-[#1F3D2E] text-[13px] font-semibold text-white transition-colors hover:bg-[#1a3325] disabled:opacity-50 sm:h-10 sm:flex-none sm:px-6"
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
