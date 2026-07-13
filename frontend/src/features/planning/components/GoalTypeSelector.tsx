import { GOAL_TYPES, type GoalTypeId } from "@/constants/goalTypes";
import GoalTypeCard from "./GoalTypeCard";

type GoalTypeSelectorProps = {
  value: GoalTypeId;
  onChange: (id: GoalTypeId) => void;
};

export default function GoalTypeSelector({ value, onChange }: GoalTypeSelectorProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-[#1F3D2E]/45 sm:text-[12.5px]">빠른 시작:</span>
      {GOAL_TYPES.map((type) => (
        <GoalTypeCard
          key={type.id}
          label={type.label}
          icon={type.icon}
          iconBg={type.iconBg}
          iconColor={type.iconColor}
          selected={value === type.id}
          onSelect={() => onChange(type.id)}
        />
      ))}
    </div>
  );
}
