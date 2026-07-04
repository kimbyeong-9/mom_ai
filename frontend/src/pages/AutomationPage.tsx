import { useState } from "react";

import AutomationList from "@/features/automation/components/AutomationList";
import { useAutomations } from "@/features/automation/hooks/useAutomations";
import { useExecuteAutomation } from "@/features/automation/hooks/useExecuteAutomation";

export default function AutomationPage() {
  const { data: automations, isLoading } = useAutomations();
  const executeAutomation = useExecuteAutomation();
  const [executingIds, setExecutingIds] = useState<Set<string>>(new Set());

  const handleExecute = (id: string) => {
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
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-12">
      <h1 className="text-2xl font-bold">자동화</h1>
      {isLoading && <p className="text-sm text-muted-foreground">불러오는 중...</p>}
      {automations?.length === 0 && (
        <p className="text-sm text-muted-foreground">연결된 자동화가 없어요.</p>
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
