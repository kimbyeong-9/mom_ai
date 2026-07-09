import { getAutomationStatusMeta } from "@/constants/automationStatus";
import type { AutomationStatus } from "../types/automation.types";
import AutomationStatusBadge from "./AutomationStatusBadge";

type AutomationListItemProps = {
  icon: string;
  title: string;
  subtitle: string;
  status: AutomationStatus;
  isExecuting: boolean;
  onExecute: () => void;
};

export default function AutomationListItem({
  icon,
  title,
  subtitle,
  status,
  isExecuting,
  onExecute,
}: AutomationListItemProps) {
  const { bg, color, buttonLabel, buttonVariant } = getAutomationStatusMeta(status);

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(31,61,46,0.05)] sm:p-[18px]">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold sm:h-[38px] sm:w-[38px]"
        style={{ backgroundColor: bg, color }}
      >
        {icon}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate text-[14px] font-bold text-[#1F3D2E] sm:text-[14.5px]">{title}</p>
        <p className="truncate text-[12px] text-[#1F3D2E]/45 sm:text-[12.5px]">{subtitle}</p>
      </div>

      <AutomationStatusBadge status={status} />

      <button
        type="button"
        onClick={onExecute}
        disabled={isExecuting}
        className={
          buttonVariant === "primary"
            ? "h-[38px] w-full shrink-0 rounded-xl bg-[#1F3D2E] text-[13px] font-semibold text-white transition-colors hover:bg-[#1a3325] disabled:opacity-50 sm:w-[88px]"
            : "h-[38px] w-full shrink-0 rounded-xl border border-[#1F3D2E]/15 text-[13px] font-semibold text-[#1F3D2E] disabled:opacity-60 sm:w-[88px]"
        }
      >
        {isExecuting ? "실행 중..." : buttonLabel}
      </button>
    </div>
  );
}
