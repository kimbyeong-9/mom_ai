import { getAutomationTypeLabel } from "@/constants/automationTypes";
import type { Automation } from "../types/automation.types";
import AutomationListItem from "./AutomationListItem";

type AutomationListProps = {
  automations: Automation[];
  executingIds: Set<string>;
  onExecute: (id: string) => void;
};

export default function AutomationList({ automations, executingIds, onExecute }: AutomationListProps) {
  return (
    <div className="flex flex-col gap-3">
      {automations.map((automation) => (
        <AutomationListItem
          key={automation.id}
          label={automation.label}
          typeLabel={getAutomationTypeLabel(automation.type)}
          status={automation.status}
          isExecuting={executingIds.has(automation.id)}
          onExecute={() => onExecute(automation.id)}
        />
      ))}
    </div>
  );
}
