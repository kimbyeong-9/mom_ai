import { api } from "./axios";
import type { SavedPlanDetail, SavedPlanSummary } from "@/features/save/types/save.types";

export async function savePlan(planningId: string): Promise<SavedPlanSummary> {
  const { data } = await api.post<SavedPlanSummary>("/saved-plans", { planningId });
  return data;
}

export async function fetchSavedPlans(): Promise<SavedPlanSummary[]> {
  const { data } = await api.get<SavedPlanSummary[]>("/saved-plans");
  return data;
}

export async function fetchSavedPlanDetail(id: string): Promise<SavedPlanDetail> {
  const { data } = await api.get<SavedPlanDetail>(`/saved-plans/${id}`);
  return data;
}

export async function toggleStepCompletion(stepId: string): Promise<{ completed: boolean }> {
  const { data } = await api.patch<{ completed: boolean }>(`/saved-plans/steps/${stepId}/toggle`);
  return data;
}
