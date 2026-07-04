import { cn } from "@/lib/utils";

type GoalTypeCardProps = {
  label: string;
  selected: boolean;
  onSelect: () => void;
};

export default function GoalTypeCard({ label, selected, onSelect }: GoalTypeCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "rounded-lg border px-4 py-3 text-sm font-medium transition-colors",
        selected
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-background hover:bg-muted"
      )}
    >
      {label}
    </button>
  );
}
