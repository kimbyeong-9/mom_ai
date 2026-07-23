type WizardCountryButtonProps = {
  flag: string;
  name: string;
  isSelected: boolean;
  onClick: () => void;
};

export default function WizardCountryButton({
  flag,
  name,
  isSelected,
  onClick,
}: WizardCountryButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-wrap content-center items-center justify-center gap-x-1 gap-y-0.5 rounded-2xl border-[1.5px] px-4 py-3 text-center text-sm font-bold transition-colors sm:flex-col sm:gap-1.5 ${
        isSelected
          ? "border-[#1F3D2E] bg-[#B7CBAE]/[0.18] text-[#1F3D2E]"
          : "border-[#1F3D2E]/[0.12] bg-white text-[#1F3D2E] hover:border-[#1F3D2E]/25"
      }`}
    >
      <span className="sm:text-lg sm:leading-none">{flag}</span>
      <span className="break-keep">{name}</span>
    </button>
  );
}
