import { useMutation } from "@tanstack/react-query";

import { submitGoal } from "@/api/planning";
import { trackEvent } from "@/lib/analytics";

export function useSubmitGoal() {
  return useMutation({
    mutationFn: submitGoal,
    onSuccess: (_data, variables) => {
      trackEvent("goal_input_submitted", variables);
    },
  });
}
