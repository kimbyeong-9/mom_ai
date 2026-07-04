import { useQuery } from "@tanstack/react-query";

import { fetchSavedPlans } from "@/api/save";

export function useSavedPlans() {
  return useQuery({
    queryKey: ["saved-plans"],
    queryFn: fetchSavedPlans,
  });
}
