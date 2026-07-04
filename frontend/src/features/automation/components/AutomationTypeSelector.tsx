import { cn } from "@/lib/utils";
import { AUTOMATION_TYPES, type AutomationTypeId } from "@/constants/automationTypes";

type AutomationTypeSelectorProps = {
  value: AutomationTypeId;
  onChange: (id: AutomationTypeId) => void;
};

export default function AutomationTypeSelector({ value, onChange }: AutomationTypeSelectorProps) {
  return (
    <div className="flex gap-2">
      {AUTOMATION_TYPES.map((type) => (
        <button
          key={type.id}
          type="button"
          onClick={() => onChange(type.id)}
          aria-pressed={value === type.id}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
            value === type.id
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-background hover:bg-muted"
          )}
        >
          {type.label}
        </button>
      ))}
    </div>
  );
}
