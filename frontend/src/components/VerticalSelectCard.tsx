import { Link } from "react-router-dom";

type VerticalSelectCardProps = {
  icon: string;
  label: string;
  iconBg: string;
  iconColor: string;
  description: string;
  to: string;
};

export default function VerticalSelectCard({
  icon,
  label,
  iconBg,
  iconColor,
  description,
  to,
}: VerticalSelectCardProps) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3.5 rounded-2xl bg-white px-4 py-3.5 shadow-[0_2px_10px_rgba(31,61,46,0.06)] transition-shadow hover:shadow-[0_4px_16px_rgba(31,61,46,0.1)] sm:gap-4 sm:rounded-[18px] sm:px-5 sm:py-4"
    >
      <div
        className="flex size-11 shrink-0 items-center justify-center rounded-xl text-xl sm:size-12 sm:text-2xl"
        style={{ backgroundColor: iconBg, color: iconColor }}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-bold text-[#1F3D2E] sm:text-base">{label}</p>
        <p className="truncate text-[12.5px] font-medium text-[#1F3D2E]/55 sm:text-[13px]">
          {description}
        </p>
      </div>

      <span className="shrink-0 text-[#1F3D2E]/35">→</span>
    </Link>
  );
}
