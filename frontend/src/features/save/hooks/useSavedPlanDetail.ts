import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchSavedPlanDetail } from "@/api/save";
import { trackEvent } from "@/lib/analytics";

export function useSavedPlanDetail(id: string | undefined) {
  const query = useQuery({
    queryKey: ["saved-plan", id],
    queryFn: () => fetchSavedPlanDetail(id as string),
    enabled: !!id,
  });

  useEffect(() => {
    if (query.isSuccess) {
      trackEvent("saved_plan_opened", { id });
    }
  }, [query.isSuccess, id]);

  return query;
}
