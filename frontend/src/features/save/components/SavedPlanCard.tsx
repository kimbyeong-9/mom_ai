import { Link } from "react-router-dom";

import { getGoalType, type GoalTypeId } from "@/constants/goalTypes";
import { formatRelativeTime } from "@/lib/utils";

type SavedPlanCardProps = {
  id: string;
  title: string;
  goalType: GoalTypeId;
  savedAt: string;
  completedSteps: number;
  totalSteps: number;
  automationConnected: boolean;
  automationConnectedAt: string | null;
};

export default function SavedPlanCard({
  id,
  title,
  goalType,
  savedAt,
  completedSteps,
  totalSteps,
  automationConnected,
  automationConnectedAt,
}: SavedPlanCardProps) {
  const { label, iconBg, iconColor } = getGoalType(goalType);
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <Link
      to={`/saved/${id}`}
      className="block rounded-2xl bg-white p-[18px] shadow-[0_2px_10px_rgba(31,61,46,0.05)] transition-shadow hover:shadow-[0_4px_14px_rgba(31,61,46,0.08)] sm:rounded-[18px] sm:p-[22px]"
    >
      <div className="mb-2.5 flex items-center justify-between sm:mb-[10px]">
        <span
          className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
          style={{ backgroundColor: iconBg, color: iconColor }}
        >
          {label}
        </span>
        <span className="text-[11px] text-[#1F3D2E]/40 sm:text-[11.5px]">{savedAt} 저장</span>
      </div>

      <p className="mb-2.5 text-[15px] font-bold text-[#1F3D2E] sm:mb-3.5 sm:text-[16.5px]">
        {title}
      </p>

      <div className="mb-1.5 h-1.5 overflow-hidden rounded-full bg-[#1F3D2E]/[0.08] sm:h-[7px]">
        <div
          className="h-full rounded-full bg-[#1F3D2E]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[11.5px] font-medium text-[#1F3D2E]/50 sm:text-xs">
          {completedSteps}/{totalSteps}단계 완료
        </span>
        {automationConnected ? (
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#2E7D4F]">
            <span className="size-1.5 rounded-full bg-[#2E7D4F]" />
            자동화 연결됨
            {automationConnectedAt && ` · ${formatRelativeTime(automationConnectedAt)}`}
          </span>
        ) : (
          <span className="text-[11px] font-medium text-[#1F3D2E]/35">자동화 미연결</span>
        )}
      </div>
    </Link>
  );
}
