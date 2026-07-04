import { Link } from "react-router-dom";

type SavedPlanCardProps = {
  id: string;
  title: string;
  goalTypeLabel: string;
  savedAt: string;
  completedSteps: number;
  totalSteps: number;
};

export default function SavedPlanCard({
  id,
  title,
  goalTypeLabel,
  savedAt,
  completedSteps,
  totalSteps,
}: SavedPlanCardProps) {
  return (
    <Link
      to={`/saved/${id}`}
      className="block rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted"
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold">{title}</h3>
        <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
          {goalTypeLabel}
        </span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{savedAt}</p>
      <p className="mt-2 text-sm text-muted-foreground">
        {completedSteps} / {totalSteps} 단계 완료
      </p>
    </Link>
  );
}
