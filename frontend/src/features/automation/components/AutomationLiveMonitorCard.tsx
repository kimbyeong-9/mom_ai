import { useState } from "react";

import { formatRelativeTime } from "@/lib/utils";
import type { MonitoringAutomationResult } from "../types/automation.types";

type AutomationLiveMonitorCardProps = {
  label: string;
  matchCount: number;
  newMatchCount: number;
  lastCheckedAt: string | null;
  result: MonitoringAutomationResult | null;
};

export default function AutomationLiveMonitorCard({
  label,
  matchCount,
  newMatchCount,
  lastCheckedAt,
  result,
}: AutomationLiveMonitorCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const matches = result?.matches ?? [];

  return (
    <div className="flex flex-col gap-3.5 rounded-2xl bg-white p-4 shadow-[0_4px_16px_rgba(31,61,46,0.06)] sm:p-5">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-[13px] font-bold text-[#2E7D4F]">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#2E7D4F] opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-[#2E7D4F]" />
          </span>
          지속 실행 중
        </span>
        {lastCheckedAt && (
          <span className="text-[11.5px] font-medium text-[#1F3D2E]/40">
            마지막 확인 {formatRelativeTime(lastCheckedAt)}
          </span>
        )}
      </div>

      <p className="text-[15px] font-bold text-[#1F3D2E] sm:text-base">{label}</p>

      <div className="flex gap-2.5">
        <div className="flex-1 rounded-xl bg-[#B7CBAE]/[0.18] py-3 text-center">
          <p className="text-xl font-extrabold text-[#1F3D2E]">{matchCount}</p>
          <p className="mt-1 text-[11px] font-semibold text-[#1F3D2E]/50">누적 매칭</p>
        </div>
        <div className="flex-1 rounded-xl bg-[#F0D6C4] py-3 text-center">
          <p className="text-xl font-extrabold text-[#8A5A3A]">+{newMatchCount}</p>
          <p className="mt-1 text-[11px] font-semibold text-[#8A5A3A]">오늘 신규</p>
        </div>
      </div>

      {matches.length > 0 && (
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex h-11 items-center justify-center rounded-xl border border-[#1F3D2E]/15 text-[13px] font-semibold text-[#1F3D2E] transition-colors hover:bg-[#1F3D2E]/5"
        >
          {isExpanded ? "접기 ↑" : `매칭 ${matches.length}건 보기 →`}
        </button>
      )}

      {isExpanded && (
        <div className="flex flex-col gap-2">
          {matches.map((match) => (
            <a
              key={match.url}
              href={match.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-[#F5F1E6] px-3.5 py-2.5 text-[12.5px] font-semibold text-[#1F3D2E] hover:underline"
            >
              {match.title}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
