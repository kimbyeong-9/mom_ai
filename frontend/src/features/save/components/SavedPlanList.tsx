import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import { GOAL_TYPES } from "@/constants/goalTypes";
import type { SavedPlanSummary } from "../types/save.types";
import SavedPlanCard from "./SavedPlanCard";
import SavedPlanSquareCard from "./SavedPlanSquareCard";

// Mobile shows a horizontally-scrollable preview row per category, capped
// so it never grows into a huge scroll strip — "전체보기" links to the full,
// uncapped category page (SavedCategoryPage) instead.
const MOBILE_PREVIEW_LIMIT = 10;

type SavedPlanListProps = {
  plans: SavedPlanSummary[];
};

export default function SavedPlanList({ plans }: SavedPlanListProps) {
  return (
    <div className="flex flex-col gap-6">
      {GOAL_TYPES.map((goalType) => {
        const groupPlans = plans.filter((plan) => plan.goalType === goalType.id);
        if (groupPlans.length === 0) return null;

        const categoryPath = `/saved/category/${goalType.id}`;

        return (
          <div key={goalType.id}>
            {/* Mobile: 정사각형 카드 가로 스크롤 미리보기 (최대 10개) + 카테고리 전체보기 버튼 */}
            <div className="sm:hidden">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#1F3D2E]/70">{goalType.label}</h2>
                <Link
                  to={categoryPath}
                  className="flex items-center gap-0.5 text-xs font-semibold text-[#1F3D2E]/45 transition-colors hover:text-[#1F3D2E]"
                >
                  전체보기
                  <ChevronRight size={14} strokeWidth={2.5} />
                </Link>
              </div>
              <div className="flex snap-x snap-proximity gap-2.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {groupPlans.slice(0, MOBILE_PREVIEW_LIMIT).map((plan) => (
                  <SavedPlanSquareCard
                    key={plan.id}
                    id={plan.id}
                    title={plan.title}
                    savedAt={plan.savedAt}
                    countries={plan.countries}
                    field={plan.field}
                  />
                ))}
              </div>
            </div>

            {/* 데스크톱: 기존 전체 그리드 (개수 제한 없음) */}
            <div className="hidden sm:block">
              <h2 className="mb-3 text-sm font-bold text-[#1F3D2E]/70">{goalType.label}</h2>
              <div className="grid grid-cols-2 gap-[18px]">
                {groupPlans.map((plan) => (
                  <SavedPlanCard
                    key={plan.id}
                    id={plan.id}
                    title={plan.title}
                    goalType={plan.goalType}
                    savedAt={plan.savedAt}
                    countries={plan.countries}
                    field={plan.field}
                    completedSteps={plan.completedSteps}
                    totalSteps={plan.totalSteps}
                    automationConnected={plan.automationConnected}
                    automationConnectedAt={plan.automationConnectedAt}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
