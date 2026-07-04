import type { AutomationTypeId } from "@/constants/automationTypes";

export type AutomationStatus = "pending" | "running" | "succeeded" | "failed";

export type Automation = {
  id: string;
  planStepId: string;
  label: string;
  type: AutomationTypeId;
  status: AutomationStatus;
};
