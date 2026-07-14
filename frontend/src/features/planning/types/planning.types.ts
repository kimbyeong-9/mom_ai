import type { GoalTypeId } from "@/constants/goalTypes";

export type GoalInput = {
  goalType: GoalTypeId;
  goalText: string;
};

export type PlanningStep = {
  id: string;
  order: number;
  title: string;
  description: string;
  actionLabel?: string;
  actionUrl?: string;
};

export type PlanningResult = {
  id: string;
  title: string;
  goalType: GoalTypeId;
  goalText: string;
  steps: PlanningStep[];
  aiGenerated: boolean;
  createdAt: string;
};
