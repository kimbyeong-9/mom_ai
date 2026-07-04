import { cn } from "@/lib/utils";
import type { AutomationStatus } from "../types/automation.types";

const STATUS_LABELS: Record<AutomationStatus, string> = {
  pending: "대기",
  running: "실행 중",
  succeeded: "완료",
  failed: "실패",
};

const STATUS_STYLES: Record<AutomationStatus, string> = {
  pending: "bg-secondary text-secondary-foreground",
  running: "bg-accent text-accent-foreground",
  succeeded: "bg-primary/10 text-primary",
  failed: "bg-destructive/10 text-destructive",
};

type AutomationStatusBadgeProps = {
  status: AutomationStatus;
};

export default function AutomationStatusBadge({ status }: AutomationStatusBadgeProps) {
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", STATUS_STYLES[status])}>
      {STATUS_LABELS[status]}
    </span>
  );
}
