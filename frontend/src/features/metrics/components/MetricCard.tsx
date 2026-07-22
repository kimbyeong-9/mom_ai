import type { RatioMetric } from "../types/metrics.types";

type MetricCardProps = {
  label: string;
  description: string;
  metric: RatioMetric;
  caveat?: string | null;
};

export default function MetricCard({ label, description, metric, caveat }: MetricCardProps) {
  return (
    <div className="flex flex-col gap-1.5 rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(31,61,46,0.05)] sm:p-5">
      <div className="flex items-baseline justify-between">
        <span className="text-[13px] font-bold text-[#1F3D2E]">{label}</span>
        <span className="text-2xl font-extrabold text-[#1F3D2E]">
          {metric.rate !== null ? `${Math.round(metric.rate * 100)}%` : "—"}
        </span>
      </div>
      <p className="text-[12px] text-[#1F3D2E]/55">{description}</p>
      <p className="text-[11px] text-[#1F3D2E]/40">
        {metric.numerator} / {metric.denominator}
      </p>
      {caveat && <p className="text-[10.5px] text-[#8A5A3A]">{caveat}</p>}
    </div>
  );
}
