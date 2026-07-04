import { useMutation, useQueryClient } from "@tanstack/react-query";

import { executeAutomation } from "@/api/automation";
import { trackEvent } from "@/lib/analytics";
import { useToastStore } from "@/store/toast.store";

export function useExecuteAutomation() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.show);

  return useMutation({
    mutationFn: executeAutomation,
    onMutate: (automationId) => {
      trackEvent("automation_executed", { automationId });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["automations"] });
      if (data.status === "succeeded") {
        trackEvent("automation_execution_succeeded", { automationId: data.id });
        showToast("자동화를 실행했어요!");
      } else if (data.status === "failed") {
        showToast("자동화 실행에 실패했어요.");
      }
    },
    onError: () => {
      showToast("자동화 실행에 실패했어요.");
    },
  });
}
