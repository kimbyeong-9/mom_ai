import QueryErrorState from "@/components/QueryErrorState";
import SavedPlanList from "@/features/save/components/SavedPlanList";
import { useSavedPlans } from "@/features/save/hooks/useSavedPlans";
import { usePageTitle } from "@/layouts/usePageTitle";

export default function SavedPage() {
  usePageTitle("내 플랜");
  const { data: savedPlans, isLoading, isError, refetch } = useSavedPlans();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-5 py-6 sm:gap-[18px] sm:px-11 sm:py-8">
      <div className="hidden sm:block">
        <h1 className="text-2xl font-extrabold text-[#1F3D2E]">내 플랜</h1>
        <p className="mt-1 text-[13.5px] text-[#1F3D2E]/55">
          저장한 플랜을 이어가거나 자동화 현황을 확인하세요.
        </p>
      </div>

      {isLoading && <p className="text-[13px] text-[#1F3D2E]/50">불러오는 중...</p>}
      {isError && (
        <QueryErrorState message="플랜을 불러오지 못했어요." onRetry={() => refetch()} />
      )}
      {savedPlans?.length === 0 && (
        <p className="text-[13px] text-[#1F3D2E]/50">아직 저장된 플랜이 없어요.</p>
      )}
      {savedPlans && savedPlans.length > 0 && <SavedPlanList plans={savedPlans} />}
    </div>
  );
}
