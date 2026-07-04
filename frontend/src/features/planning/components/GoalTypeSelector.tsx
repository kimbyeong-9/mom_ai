import { GOAL_TYPES, type GoalTypeId } from "@/constants/goalTypes";
import GoalTypeCard from "./GoalTypeCard";

type GoalTypeSelectorProps = {
  value: GoalTypeId;
  onChange: (id: GoalTypeId) => void;
};

export default function GoalTypeSelector({ value, onChange }: GoalTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {GOAL_TYPES.map((type) => (
        <GoalTypeCard
          key={type.id}
          label={type.label}
          selected={value === type.id}
          onSelect={() => onChange(type.id)}
        />
      ))}
    </div>
  );
}
