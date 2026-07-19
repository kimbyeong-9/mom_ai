import { Link } from "react-router-dom";

type VerticalSelectCardProps = {
  icon: string;
  label: string;
  gradientFrom: string;
  gradientTo: string;
  description: string;
  tags: readonly string[];
  tagBg: string;
  tagColor: string;
  ctaLabel: string;
  variant: "primary" | "secondary";
  to: string;
};

export default function VerticalSelectCard({
  icon,
  label,
  gradientFrom,
  gradientTo,
  description,
  tags,
  tagBg,
  tagColor,
  ctaLabel,
  variant,
  to,
}: VerticalSelectCardProps) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_8px_24px_rgba(31,61,46,0.08)] sm:rounded-3xl sm:shadow-[0_10px_30px_rgba(31,61,46,0.09)]">
      <div
        className="flex h-16 items-center gap-3 px-5 sm:h-24 sm:gap-4 sm:px-7"
        style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
      >
        <div className="flex size-[38px] shrink-0 items-center justify-center rounded-xl bg-white/15 text-xl sm:size-[52px] sm:rounded-2xl sm:text-2xl">
          {icon}
        </div>
        <span className="text-base font-extrabold text-white sm:text-[22px]">{label}</span>
      </div>

      <div className="flex flex-col gap-3 px-5 py-[18px] sm:gap-4 sm:px-7 sm:py-6">
        <p className="text-[12.5px] font-medium leading-relaxed text-[#1F3D2E]/60 sm:text-sm sm:leading-[1.6]">
          {description}
        </p>

        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full px-2.5 py-1 text-[10.5px] font-semibold sm:px-3 sm:py-1.5 sm:text-xs"
              style={{ backgroundColor: tagBg, color: tagColor }}
            >
              {tag}
            </span>
          ))}
        </div>

        <Link
          to={to}
          className={
            variant === "primary"
              ? "mt-0.5 flex h-[46px] items-center justify-center rounded-2xl bg-[#1F3D2E] text-sm font-semibold text-white transition-colors hover:bg-[#1a3325] sm:h-[50px] sm:text-[15px]"
              : "mt-0.5 flex h-[46px] items-center justify-center rounded-2xl border border-[#1F3D2E]/15 bg-white text-sm font-semibold text-[#1F3D2E] transition-colors hover:bg-[#1F3D2E]/5 sm:h-[50px] sm:text-[15px]"
          }
        >
          {ctaLabel} →
        </Link>
      </div>
    </div>
  );
}
