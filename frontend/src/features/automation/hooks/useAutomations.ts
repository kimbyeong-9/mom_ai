import { useQuery } from "@tanstack/react-query";

import { fetchAutomations } from "@/api/automation";

export function useAutomations() {
  return useQuery({
    queryKey: ["automations"],
    queryFn: fetchAutomations,
  });
}
