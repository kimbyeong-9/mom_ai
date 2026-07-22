import { api } from "./axios";
import type { LoopMetrics } from "@/features/metrics/types/metrics.types";

export async function fetchLoopMetrics(): Promise<LoopMetrics> {
  const { data } = await api.get<LoopMetrics>("/events/metrics");
  return data;
}
