type WizardProgressHeaderProps = {
  current: number;
  total: number;
};

export default function WizardProgressHeader({ current, total }: WizardProgressHeaderProps) {
  const percent = (current / total) * 100;

  return (
    <div>
      <div className="mb-1.5 flex items-center gap-2">
        <div className="flex size-6 items-center justify-center rounded-full bg-[#1F3D2E]">
          <span className="text-[10px] font-bold text-white">L</span>
        </div>
        <span className="text-sm font-extrabold text-[#1F3D2E]">LifeFlow AI</span>
      </div>
      <div className="my-3.5 h-1.5 max-w-[360px] rounded-full bg-[#1F3D2E]/10">
        <div
          className="h-1.5 rounded-full bg-[#1F3D2E] transition-[width]"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="text-xs font-semibold text-[#1F3D2E]/45">
        {current} / {total}
        {current === total && " · 마지막 질문"}
      </div>
    </div>
  );
}
