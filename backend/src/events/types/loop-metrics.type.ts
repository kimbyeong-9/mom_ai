export type RatioMetric = {
  numerator: number;
  denominator: number;
  rate: number | null;
};

export type LoopMetrics = {
  gp1: RatioMetric;
  gp2: RatioMetric;
  sp1: RatioMetric;
  rp1: RatioMetric;
  ap1: RatioMetric;
  ap2: RatioMetric;
  automationAr: RatioMetric;
  planningLcp: number | null;
  saveLcp: number | null;
  automationLcp: number | null;
  totalLcp: number | null;
  rawCounts: Record<string, number>;
  generatedAt: string;
};
