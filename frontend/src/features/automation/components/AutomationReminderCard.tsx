import { formatDate, formatDday } from "@/lib/utils";

type AutomationReminderCardProps = {
  label: string;
  scheduledFor: string;
};

export default function AutomationReminderCard({ label, scheduledFor }: AutomationReminderCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(31,61,46,0.05)] sm:p-[18px]">
      <div className="flex items-center justify-between">
        <span className="w-fit rounded-full bg-[#1F3D2E]/[0.06] px-2.5 py-1 text-[11px] font-bold text-[#1F3D2E]/70">
          {formatDday(scheduledFor)}
        </span>
        <span className="text-[11.5px] font-medium text-[#1F3D2E]/40">
          {formatDate(scheduledFor, ".")} 예정
        </span>
      </div>
      <p className="text-[15px] font-bold text-[#1F3D2E] sm:text-base">{label}</p>
      <p className="text-[12.5px] text-[#1F3D2E]/55">이 날짜에 맞춰 준비 일정을 확인해두세요.</p>
    </div>
  );
}
