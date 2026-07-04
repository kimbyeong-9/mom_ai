import { api } from "./axios";
import type { GoalInput, PlanningResult } from "@/features/planning/types/planning.types";

export async function submitGoal(input: GoalInput): Promise<{ id: string }> {
  const { data } = await api.post<{ id: string }>("/planning", input);
  return data;
}

export async function fetchPlanningResult(planningId: string): Promise<PlanningResult> {
  const { data } = await api.get<PlanningResult>(`/planning/${planningId}`);
  return data;
}
