import type { LoopMetrics } from "@/features/metrics";

type RatioMetricKey = "gp1" | "gp2" | "sp1" | "rp1" | "ap1" | "ap2" | "automationAr";

export const METRIC_ROWS: {
  key: RatioMetricKey;
  label: string;
  description: string;
  caveat: string | null;
}[] = [
  { key: "gp1", label: "GP1", description: "Goal Input → AI Planning", caveat: null },
  {
    key: "gp2",
    label: "GP2",
    description: "AI Planning → Result Viewed",
    caveat: "planning_generated 계측이 2026-07-19에 추가돼서, 그 이전 데이터는 분모에서 빠져있어요",
  },
  { key: "sp1", label: "SP1", description: "Result Viewed → Save", caveat: null },
  {
    key: "rp1",
    label: "RP1",
    description: "Save → Revisited",
    caveat: "재방문 발생 건수 기준 근사치예요 (고유 재방문율 아님)",
  },
  { key: "ap1", label: "AP1", description: "Save → Automation Connected", caveat: null },
  { key: "ap2", label: "AP2", description: "Automation Connected → Executed", caveat: null },
  { key: "automationAr", label: "Automation_AR", description: "자동화 실행 성공률", caveat: null },
];

export const LCP_ROWS: { key: keyof Pick<LoopMetrics, "planningLcp" | "saveLcp" | "automationLcp" | "totalLcp">; label: string }[] = [
  { key: "planningLcp", label: "Planning_LCP" },
  { key: "saveLcp", label: "Save_LCP" },
  { key: "automationLcp", label: "Automation_LCP" },
  { key: "totalLcp", label: "Total_LCP" },
];
