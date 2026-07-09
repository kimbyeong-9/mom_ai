type HomeFeatureCardProps = {
  index: number;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
};

export default function HomeFeatureCard({
  index,
  iconBg,
  iconColor,
  title,
  description,
}: HomeFeatureCardProps) {
  return (
    <div className="flex flex-1 flex-row items-start gap-3 rounded-2xl bg-white p-4 shadow-[0_3px_12px_rgba(31,61,46,0.06)] sm:flex-col sm:gap-0 sm:rounded-[20px] sm:p-[22px] sm:shadow-[0_4px_16px_rgba(31,61,46,0.06)]">
      <div
        className="flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold sm:mb-3 sm:size-[30px] sm:text-[13px]"
        style={{ backgroundColor: iconBg, color: iconColor }}
      >
        {index}
      </div>
      <div>
        <p className="text-[13px] font-bold leading-tight text-[#1F3D2E] sm:text-[15px]">
          {title}
        </p>
        <p className="mt-1 text-[11.5px] leading-snug text-[#1F3D2E]/50 sm:mt-1.5 sm:text-[12.5px]">
          {description}
        </p>
      </div>
    </div>
  );
}
