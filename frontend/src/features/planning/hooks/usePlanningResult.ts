import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchPlanningResult } from "@/api/planning";
import { trackEvent } from "@/lib/analytics";

export function usePlanningResult(planningId: string | null) {
  const query = useQuery({
    queryKey: ["planning", planningId],
    queryFn: () => fetchPlanningResult(planningId as string),
    enabled: planningId !== null,
  });

  useEffect(() => {
    if (query.isSuccess) {
      trackEvent("planning_result_viewed", { planningId });
    }
  }, [query.isSuccess, planningId]);

  return query;
}
