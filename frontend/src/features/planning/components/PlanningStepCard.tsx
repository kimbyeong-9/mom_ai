type PlanningStepCardProps = {
  order: number;
  title: string;
  description: string;
  actionLabel?: string;
  actionUrl?: string;
};

export default function PlanningStepCard({
  order,
  title,
  description,
  actionLabel,
  actionUrl,
}: PlanningStepCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          {order}
        </span>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      {actionUrl && (
        <a
          href={actionUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          {actionLabel ?? "바로가기"}
        </a>
      )}
    </div>
  );
}
