import { Link } from "react-router-dom";

type SavedPlanSquareCardProps = {
  id: string;
  title: string;
  savedAt: string;
  countries: string[];
  field: string | null;
};

export default function SavedPlanSquareCard({
  id,
  title,
  savedAt,
  countries,
  field,
}: SavedPlanSquareCardProps) {
  const countryLabel = countries.length > 0 ? countries.join(", ") : null;

  return (
    <Link
      to={`/saved/${id}`}
      className="flex aspect-square w-40 shrink-0 snap-start flex-col rounded-2xl bg-white p-3.5 shadow-[0_2px_10px_rgba(31,61,46,0.05)] transition-shadow hover:shadow-[0_4px_14px_rgba(31,61,46,0.08)]"
    >
      {/* 국가/직군 태그 — 왼쪽 상단에 1행(가로)으로 나열 */}
      <div className="flex gap-1">
        {countryLabel && (
          <span className="max-w-[50%] truncate rounded-full bg-[#1F3D2E]/[0.06] px-2 py-0.5 text-[9.5px] font-semibold text-[#1F3D2E]/60">
            {countryLabel}
          </span>
        )}
        {field && (
          <span className="max-w-[50%] truncate rounded-full bg-[#1F3D2E]/[0.06] px-2 py-0.5 text-[9.5px] font-semibold text-[#1F3D2E]/60">
            {field}
          </span>
        )}
      </div>

      {/* 제목 — 카드 상하 기준 정가운데 */}
      <div className="flex flex-1 items-center justify-center">
        <p className="w-full truncate text-center text-[13px] font-bold text-[#1F3D2E]">{title}</p>
      </div>

      <p className="text-[10px] font-medium text-[#1F3D2E]/35">{savedAt}</p>
    </Link>
  );
}
