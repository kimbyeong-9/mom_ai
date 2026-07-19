type PlanningResultStepRowProps = {
  order: number;
  title: string;
  description: string;
  actionLabel?: string;
  actionUrl?: string;
};

export default function PlanningResultStepRow({
  order,
  title,
  description,
  actionLabel,
  actionUrl,
}: PlanningResultStepRowProps) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(31,61,46,0.05)]">
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#1F3D2E] text-[10px] font-bold text-white sm:size-[22px] sm:text-[11px]">
          {order}
        </span>
        <div className="flex flex-1 flex-col gap-1">
          <p className="text-[12.5px] font-bold text-[#1F3D2E] sm:text-[13.5px]">{title}</p>
          <p className="text-[11px] text-[#1F3D2E]/50 sm:text-xs">{description}</p>
          {actionLabel && actionUrl && (
            <a
              href={actionUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1 w-fit rounded-full bg-[#B7CBAE]/25 px-3 py-1 text-[11px] font-semibold text-[#1F3D2E] hover:bg-[#B7CBAE]/40"
            >
              {actionLabel} →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
