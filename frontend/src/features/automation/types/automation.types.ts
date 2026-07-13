import type { AutomationTypeId } from "@/constants/automationTypes";

export type AutomationStatus = "pending" | "running" | "succeeded" | "failed";

export type DocumentAutomationResult = {
  documents: string[];
};

export type NotificationAutomationResult = {
  scheduledFor: string;
  source: "deadline" | "default";
};

export type Automation = {
  id: string;
  planStepId: string;
  label: string;
  type: AutomationTypeId;
  status: AutomationStatus;
  result: DocumentAutomationResult | NotificationAutomationResult | null;
};
