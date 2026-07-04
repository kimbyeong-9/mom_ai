export default function PlanningLoading() {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
      <div className="size-8 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary" />
      <p className="text-sm">AI가 플랜을 생성하고 있어요...</p>
    </div>
  );
}
