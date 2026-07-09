import { GOAL_TYPES, type GoalTypeId } from "@/constants/goalTypes";
import GoalTypeCard from "./GoalTypeCard";

type GoalTypeSelectorProps = {
  value: GoalTypeId;
  onChange: (id: GoalTypeId) => void;
};

export default function GoalTypeSelector({ value, onChange }: GoalTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
      {GOAL_TYPES.map((type) => (
        <GoalTypeCard
          key={type.id}
          label={type.cardLabel}
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
