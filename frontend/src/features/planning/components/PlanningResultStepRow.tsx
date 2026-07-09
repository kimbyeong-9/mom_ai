type PlanningResultStepRowProps = {
  order: number;
  title: string;
  description: string;
};

export default function PlanningResultStepRow({
  order,
  title,
  description,
}: PlanningResultStepRowProps) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#1F3D2E] text-[10px] font-bold text-white sm:size-[22px] sm:text-[11px]">
        {order}
      </span>
      <div>
        <p className="text-[12.5px] font-semibold text-[#1F3D2E] sm:text-[13.5px]">{title}</p>
        <p className="mt-0.5 text-[11px] text-[#1F3D2E]/50 sm:text-xs">{description}</p>
      </div>
    </div>
  );
}
