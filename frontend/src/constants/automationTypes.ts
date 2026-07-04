export const AUTOMATION_TYPES = [
  { id: "notification", label: "알림" },
  { id: "document", label: "문서 정리" },
  { id: "checklist", label: "체크리스트" },
] as const;

export type AutomationTypeId = (typeof AUTOMATION_TYPES)[number]["id"];

export function getAutomationTypeLabel(id: AutomationTypeId): string {
  return AUTOMATION_TYPES.find((type) => type.id === id)?.label ?? id;
}
