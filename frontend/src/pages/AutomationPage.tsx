import { useState } from "react";

import QueryErrorState from "@/components/QueryErrorState";
import AutomationList from "@/features/automation/components/AutomationList";
import { useAutomations } from "@/features/automation/hooks/useAutomations";
import { useExecuteAutomation } from "@/features/automation/hooks/useExecuteAutomation";
import { formatAutomationResult } from "@/features/automation/utils/formatAutomationResult";
import { useToastStore } from "@/store/toast.store";

export default function AutomationPage() {
  const { data: automations, isLoading, isError, refetch } = useAutomations();
  const executeAutomation = useExecuteAutomation();
  const showToast = useToastStore((state) => state.show);
  const [executingIds, setExecutingIds] = useState<Set<string>>(new Set());

  const handleExecute = (id: string) => {
    const automation = automations?.find((item) => item.id === id);
    if (automation?.status === "running") {
      showToast("아직 준비 중인 기능이에요.");
      return;
    }
    if (automation?.status === "succeeded") {
      showToast(formatAutomationResult(automation));
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
    <div className="relative mx-auto flex max-w-3xl flex-col gap-4 px-5 py-6 sm:gap-[18px] sm:px-11 sm:py-8">
      <h1 className="mb-6 text-xl font-extrabold text-[#1F3D2E] sm:text-2xl">AI 알림 비서</h1>

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
