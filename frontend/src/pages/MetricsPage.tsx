import axios from "axios";

import QueryErrorState from "@/components/QueryErrorState";
import { LCP_ROWS, METRIC_ROWS } from "@/constants/metricDefinitions";
import { MetricCard, useLoopMetrics } from "@/features/metrics";

export default function MetricsPage() {
  const { data: metrics, isLoading, isError, error, refetch } = useLoopMetrics();

  const errorMessage =
    axios.isAxiosError(error) && error.response?.status === 403
      ? "접근 권한이 없어요."
      : "지표를 불러오지 못했어요.";

  return (
    <div className="relative mx-auto flex max-w-3xl flex-col gap-4 px-5 py-6 sm:gap-[18px] sm:px-11 sm:py-8">
      <h1 className="mb-6 text-xl font-extrabold text-[#1F3D2E] sm:text-2xl">Loop 전환율 지표</h1>

      {isLoading && <p className="text-[13px] text-[#1F3D2E]/50">불러오는 중...</p>}
      {isError && <QueryErrorState message={errorMessage} onRetry={() => refetch()} />}

      {metrics && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {METRIC_ROWS.map((row) => (
              <MetricCard
                key={row.key}
                label={row.label}
                description={row.description}
                metric={metrics[row.key]}
                caveat={row.caveat}
              />
            ))}
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(31,61,46,0.05)] sm:p-5">
            <p className="mb-3 text-[13px] font-bold text-[#1F3D2E]">Loop 완료율</p>
            <div className="flex flex-col gap-2">
              {LCP_ROWS.map((row) => {
                const value = metrics[row.key];
                return (
                  <div key={row.key} className="flex items-center justify-between">
                    <span className="text-[12.5px] text-[#1F3D2E]/60">{row.label}</span>
                    <span className="text-[13px] font-semibold text-[#1F3D2E]">
                      {value !== null ? `${Math.round(value * 100)}%` : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(31,61,46,0.05)] sm:p-5">
            <p className="mb-3 text-[13px] font-bold text-[#1F3D2E]">원본 이벤트 카운트</p>
            <div className="flex flex-col gap-1.5">
              {Object.entries(metrics.rawCounts).map(([name, eventCount]) => (
                <div key={name} className="flex items-center justify-between">
                  <span className="text-[12px] text-[#1F3D2E]/50">{name}</span>
                  <span className="text-[12px] font-semibold text-[#1F3D2E]/70">{eventCount}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-[#1F3D2E]/35">
            {new Date(metrics.generatedAt).toLocaleString("ko-KR")} 기준
          </p>
        </>
      )}
    </div>
  );
}
