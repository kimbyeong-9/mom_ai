import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toggleStepCompletion } from "@/api/save";

export function useToggleStepCompletion(savedPlanId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleStepCompletion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-plan", savedPlanId] });
      queryClient.invalidateQueries({ queryKey: ["saved-plans"] });
    },
  });
}
