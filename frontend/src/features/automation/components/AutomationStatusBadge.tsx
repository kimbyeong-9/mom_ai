import { getAutomationStatusMeta } from "@/constants/automationStatus";
import type { AutomationStatus } from "../types/automation.types";

type AutomationStatusBadgeProps = {
  status: AutomationStatus;
};

export default function AutomationStatusBadge({ status }: AutomationStatusBadgeProps) {
  const { label, bg, color } = getAutomationStatusMeta(status);

  return (
    <span
      className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
      style={{ backgroundColor: bg, color }}
    >
      {label}
    </span>
  );
}
