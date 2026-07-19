import { Link } from "react-router-dom";

import { getGoalTypeLabel, type GoalTypeId } from "@/constants/goalTypes";
import type { PlanningStep } from "../types/planning.types";
import PlanningResultStepRow from "./PlanningResultStepRow";

type PlanningResultCardProps = {
  title: string;
  goalType: GoalTypeId;
  goalText: string;
  steps: PlanningStep[];
  aiGenerated: boolean;
  tags?: { country?: string; role?: string; workStyle?: string };
  onSave: () => void;
  isSaving: boolean;
};

export default function PlanningResultCard({
  title,
  goalType,
  goalText,
  steps,
  aiGenerated,
  tags,
  onSave,
  isSaving,
}: PlanningResultCardProps) {
  const pills = [tags?.country, tags?.role, tags?.workStyle].filter(Boolean) as string[];

  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(31,61,46,0.05)] sm:rounded-[18px] sm:p-6">
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        {pills.length > 0 ? (
          pills.map((pill, index) => (
            <span
              key={pill}
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                index === 0
                  ? "bg-[#1F3D2E] text-white"
                  : "bg-[#1F3D2E]/[0.06] text-[#1F3D2E]/60"
              }`}
            >
              {pill}
            </span>
          ))
        ) : (
          <span className="rounded-full bg-[#B7CBAE] px-2.5 py-1 text-[11px] font-semibold text-[#1F3D2E]">
            {getGoalTypeLabel(goalType)}
          </span>
        )}
      </div>

      <h2 className="text-lg font-extrabold text-[#1F3D2E] sm:text-xl">준비 절차가 완성됐어요</h2>
      <p className="mt-1 text-[12px] text-[#1F3D2E]/50 sm:text-[12.5px]">
        {title} · {goalText}
      </p>
      <p className="mt-0.5 text-[10.5px] font-medium text-[#1F3D2E]/40">
        {aiGenerated ? "AI 생성 · 최신 정책 기준" : "기본 템플릿 · 참고용"}
      </p>

      <div className="mt-4 flex flex-col gap-2.5">
        {steps.map((step) => (
          <PlanningResultStepRow
            key={step.id}
            order={step.order}
            title={step.title}
            description={step.description}
            actionLabel={step.actionLabel}
            actionUrl={step.actionUrl}
          />
        ))}
      </div>

      <div className="mt-4 flex gap-2.5">
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="flex h-11 flex-1 items-center justify-center rounded-xl bg-[#1F3D2E] text-[13.5px] font-semibold text-white transition-colors hover:bg-[#1a3325] disabled:opacity-50 sm:flex-none sm:px-8"
        >
          {isSaving ? "저장 중..." : "내 플랜에 저장"}
        </button>
        <Link
          to="/start"
          className="hidden h-11 items-center justify-center rounded-xl border border-[#1F3D2E]/15 bg-white px-6 text-[13.5px] font-semibold text-[#1F3D2E] transition-colors hover:bg-[#1F3D2E]/5 sm:flex"
        >
          다시 만들기
        </Link>
      </div>
    </div>
  );
}
