import { Button } from "@/components/ui/button";
import type { AutomationStatus } from "../types/automation.types";
import AutomationStatusBadge from "./AutomationStatusBadge";

type AutomationListItemProps = {
  label: string;
  typeLabel: string;
  status: AutomationStatus;
  isExecuting: boolean;
  onExecute: () => void;
};

export default function AutomationListItem({
  label,
  typeLabel,
  status,
  isExecuting,
  onExecute,
}: AutomationListItemProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-4">
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{typeLabel}</p>
      </div>
      <div className="flex items-center gap-2">
        <AutomationStatusBadge status={status} />
        <Button size="sm" onClick={onExecute} disabled={isExecuting || status === "running"}>
          {isExecuting || status === "running" ? "실행 중..." : "실행"}
        </Button>
      </div>
    </div>
  );
}
