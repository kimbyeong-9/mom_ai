import { cn } from "@/lib/utils";

type GoalTypeCardProps = {
  label: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  selected: boolean;
  onSelect: () => void;
};

export default function GoalTypeCard({
  label,
  icon,
  iconBg,
  iconColor,
  selected,
  onSelect,
}: GoalTypeCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "rounded-2xl border-[1.5px] bg-white p-3.5 text-left transition-colors sm:rounded-2xl sm:p-[14px]",
        selected ? "border-[#1F3D2E] bg-[#B7CBAE]/15" : "border-transparent hover:bg-[#1F3D2E]/[0.03]"
      )}
    >
      <span
        className="flex size-7 items-center justify-center rounded-full text-xs font-bold sm:mb-2 sm:size-[34px] sm:text-[13px]"
        style={{ backgroundColor: iconBg, color: iconColor }}
      >
        {icon}
      </span>
      <p className="mt-1.5 text-xs font-bold text-[#1F3D2E] sm:mt-0 sm:text-[13px]">{label}</p>
    </button>
  );
}
