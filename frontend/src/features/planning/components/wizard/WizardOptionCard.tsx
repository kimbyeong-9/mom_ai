type WizardOptionCardProps = {
  label: string;
  description?: string;
  selected: boolean;
  muted?: boolean;
  onSelect: () => void;
};

export default function WizardOptionCard({
  label,
  description,
  selected,
  muted,
  onSelect,
}: WizardOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex flex-col items-center justify-center gap-0.5 rounded-2xl border-[1.5px] px-[18px] py-[17px] text-center transition-colors ${
        selected
          ? "border-[#1F3D2E] bg-[#B7CBAE]/[0.18]"
          : "border-[#1F3D2E]/[0.12] bg-white hover:border-[#1F3D2E]/25"
      }`}
    >
      <span
        className={`break-keep text-[14.5px] font-bold ${muted && !selected ? "text-[#1F3D2E]/40" : "text-[#1F3D2E]"}`}
      >
        {label}
      </span>
      {description && (
        <span className="break-keep text-xs font-medium leading-snug text-[#1F3D2E]/50">
          {description}
        </span>
      )}
    </button>
  );
}
