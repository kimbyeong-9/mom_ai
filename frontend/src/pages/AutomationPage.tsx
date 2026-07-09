import { useState } from "react";

import QueryErrorState from "@/components/QueryErrorState";
import AutomationList from "@/features/automation/components/AutomationList";
import { useAutomations } from "@/features/automation/hooks/useAutomations";
import { useExecuteAutomation } from "@/features/automation/hooks/useExecuteAutomation";
import { usePageTitle } from "@/layouts/usePageTitle";
import { useToastStore } from "@/store/toast.store";

export default function AutomationPage() {
  usePageTitle("자동화");
  const { data: automations, isLoading, isError, refetch } = useAutomations();
  const executeAutomation = useExecuteAutomation();
  const showToast = useToastStore((state) => state.show);
  const [executingIds, setExecutingIds] = useState<Set<string>>(new Set());

  const handleExecute = (id: string) => {
    const automation = automations?.find((item) => item.id === id);
    if (automation?.status === "running" || automation?.status === "succeeded") {
      showToast("아직 준비 중인 기능이에요.");
      return;
    }

    setExecutingIds((prev) => new Set(prev).add(id));
    executeAutomation.mutate(id, {
      onSettled: () => {
        setExecutingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      },
    });
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-5 py-6 sm:gap-[18px] sm:px-11 sm:py-8">
      <div className="hidden sm:block">
        <h1 className="text-2xl font-extrabold text-[#1F3D2E]">자동화</h1>
        <p className="mt-1 text-[13.5px] text-[#1F3D2E]/55">
          저장된 플랜과 연결된 자동화를 확인하고 실행하세요.
        </p>
      </div>

      {isLoading && <p className="text-[13px] text-[#1F3D2E]/50">불러오는 중...</p>}
      {isError && (
        <QueryErrorState message="자동화 목록을 불러오지 못했어요." onRetry={() => refetch()} />
      )}
      {automations?.length === 0 && (
        <p className="text-[13px] text-[#1F3D2E]/50">연결된 자동화가 없어요.</p>
      )}
      {automations && automations.length > 0 && (
        <AutomationList
          automations={automations}
          executingIds={executingIds}
          onExecute={handleExecute}
        />
      )}
    </div>
  );
}
