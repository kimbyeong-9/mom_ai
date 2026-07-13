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
        "flex shrink-0 items-center gap-1.5 rounded-full border-[1.5px] py-1.5 pr-3 pl-1.5 transition-colors",
        selected
          ? "border-[#1F3D2E] bg-[#B7CBAE]/15"
          : "border-[#1F3D2E]/10 bg-white hover:bg-[#1F3D2E]/[0.03]"
      )}
    >
      <span
        className="flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
        style={{ backgroundColor: iconBg, color: iconColor }}
      >
        {icon}
      </span>
      <span className="text-xs font-semibold whitespace-nowrap text-[#1F3D2E]">{label}</span>
    </button>
  );
}
