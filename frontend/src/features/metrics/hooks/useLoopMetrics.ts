import { useQuery } from "@tanstack/react-query";

import { fetchLoopMetrics } from "@/api/metrics";

export function useLoopMetrics() {
  return useQuery({
    queryKey: ["loop-metrics"],
    queryFn: fetchLoopMetrics,
  });
}
