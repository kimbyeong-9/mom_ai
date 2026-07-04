import { api } from "./axios";
import type { AutomationTypeId } from "@/constants/automationTypes";
import type { Automation } from "@/features/automation/types/automation.types";

export async function connectAutomation(input: {
  planStepId: string;
  type: AutomationTypeId;
}): Promise<Automation> {
  const { data } = await api.post<Automation>("/automations", input);
  return data;
}

export async function fetchAutomations(): Promise<Automation[]> {
  const { data } = await api.get<Automation[]>("/automations");
  return data;
}

export async function executeAutomation(automationId: string): Promise<Automation> {
  const { data } = await api.post<Automation>(`/automations/${automationId}/execute`);
  return data;
}
