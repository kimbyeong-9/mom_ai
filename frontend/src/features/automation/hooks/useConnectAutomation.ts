import { useMutation, useQueryClient } from "@tanstack/react-query";

import { connectAutomation } from "@/api/automation";
import { trackEvent } from "@/lib/analytics";
import { useToastStore } from "@/store/toast.store";

export function useConnectAutomation() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.show);

  return useMutation({
    mutationFn: connectAutomation,
    onSuccess: (data) => {
      trackEvent("automation_connected", { automationId: data.id, type: data.type });
      queryClient.invalidateQueries({ queryKey: ["automations"] });
    },
    onError: () => {
      showToast("자동화 연결에 실패했어요.");
    },
  });
}
