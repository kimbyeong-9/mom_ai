import type { GoalTypeId } from "@/constants/goalTypes";
import type { PlanningStep } from "@/features/planning/types/planning.types";

export type SavedPlanSummary = {
  id: string;
  title: string;
  goalType: GoalTypeId;
  savedAt: string;
  completedSteps: number;
  totalSteps: number;
  automationConnected: boolean;
  automationConnectedAt: string | null;
};

export type SavedPlanDetail = SavedPlanSummary & {
  steps: PlanningStep[];
};
