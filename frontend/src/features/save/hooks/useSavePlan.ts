import { useMutation, useQueryClient } from "@tanstack/react-query";

import { savePlan } from "@/api/save";
import { trackEvent } from "@/lib/analytics";
import { useToastStore } from "@/store/toast.store";

export function useSavePlan() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.show);

  return useMutation({
    mutationFn: savePlan,
    onSuccess: (_data, planningId) => {
      trackEvent("plan_saved", { planningId });
      showToast("플랜을 저장했어요!");
      queryClient.invalidateQueries({ queryKey: ["saved-plans"] });
    },
    onError: () => {
      showToast("플랜 저장에 실패했어요.");
    },
  });
}
