import { getAutomationType } from "@/constants/automationTypes";
import type { Automation } from "../types/automation.types";
import AutomationLiveMonitorCard from "./AutomationLiveMonitorCard";
import AutomationListItem from "./AutomationListItem";
import AutomationReminderCard from "./AutomationReminderCard";

type AutomationListProps = {
  automations: Automation[];
  executingIds: Set<string>;
  onExecute: (id: string) => void;
};

export default function AutomationList({ automations, executingIds, onExecute }: AutomationListProps) {
  return (
    <div className="flex flex-col gap-3">
      {automations.map((automation) => {
        // A notification automation whose step text had no explicit date
        // runs a real job search instead — it's an ongoing monitor, not a
        // one-shot reminder, so it gets the "still running" treatment.
        if (
          automation.type === "notification" &&
          automation.status === "succeeded" &&
          automation.result &&
          "matches" in automation.result
        ) {
          return (
            <AutomationLiveMonitorCard
              key={automation.id}
              label={automation.label}
              matchCount={automation.matchCount}
              newMatchCount={automation.newMatchCount}
              lastCheckedAt={automation.lastCheckedAt}
              result={automation.result}
            />
          );
        }

        // A notification automation that's finished computing its date is a
        // real, standing reminder — worth its own D-day treatment instead of
        // the generic "execute this" row.
        if (
          automation.type === "notification" &&
          automation.status === "succeeded" &&
          automation.result &&
          "scheduledFor" in automation.result
        ) {
          return (
            <AutomationReminderCard
              key={automation.id}
              label={automation.label}
              scheduledFor={automation.result.scheduledFor}
            />
          );
        }

        const { label, icon } = getAutomationType(automation.type);
        return (
          <AutomationListItem
            key={automation.id}
            icon={icon}
            title={label}
            subtitle={automation.label}
            status={automation.status}
            isExecuting={executingIds.has(automation.id)}
            onExecute={() => onExecute(automation.id)}
          />
        );
      })}
    </div>
  );
}
