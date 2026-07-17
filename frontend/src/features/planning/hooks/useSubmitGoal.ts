import { useMutation } from "@tanstack/react-query";

import { submitGoal } from "@/api/planning";
import { trackEvent } from "@/lib/analytics";

export function useSubmitGoal() {
  return useMutation({
    mutationFn: submitGoal,
    onSuccess: (data, variables) => {
      trackEvent("goal_input_submitted", variables);
      trackEvent("planning_generated", { planningId: data.id, ...variables });
    },
  });
}
