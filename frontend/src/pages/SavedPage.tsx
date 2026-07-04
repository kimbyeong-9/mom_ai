import SavedPlanList from "@/features/save/components/SavedPlanList";
import { useSavedPlans } from "@/features/save/hooks/useSavedPlans";

export default function SavedPage() {
  const { data: savedPlans, isLoading } = useSavedPlans();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-12">
      <h1 className="text-2xl font-bold">저장된 플랜</h1>
      {isLoading && <p className="text-sm text-muted-foreground">불러오는 중...</p>}
      {savedPlans?.length === 0 && (
        <p className="text-sm text-muted-foreground">아직 저장된 플랜이 없어요.</p>
      )}
      {savedPlans && savedPlans.length > 0 && <SavedPlanList plans={savedPlans} />}
    </div>
  );
}
