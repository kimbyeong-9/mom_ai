import type { GoalTypeId } from "@/constants/goalTypes";
import type { PlanningStep } from "@/features/planning/types/planning.types";

export type SavedPlanSummary = {
  id: string;
  title: string;
  goalType: GoalTypeId;
  savedAt: string;
  completedSteps: number;
  totalSteps: number;
};

export type SavedPlanDetail = SavedPlanSummary & {
  steps: PlanningStep[];
};
