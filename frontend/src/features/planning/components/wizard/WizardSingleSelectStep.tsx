import type { WizardOption } from "@/constants/goalWizardSteps";
import WizardOptionCard from "./WizardOptionCard";

type WizardSingleSelectStepProps = {
  title: string;
  subtitle?: string;
  options: readonly WizardOption[];
  value: string | undefined;
  onChange: (value: string) => void;
};

export default function WizardSingleSelectStep({
  title,
  subtitle,
  options,
  value,
  onChange,
}: WizardSingleSelectStepProps) {
  return (
    <div className="flex flex-col gap-[22px]">
      <div>
        <h2 className="whitespace-pre-line text-2xl font-extrabold leading-snug text-[#1F3D2E] sm:text-[32px]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-[13px] font-medium leading-relaxed text-[#1F3D2E]/55">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2.5">
        {options.map((option) => (
          <WizardOptionCard
            key={option.value}
            label={option.label}
            description={option.description}
            muted={option.muted}
            selected={value === option.value}
            onSelect={() => onChange(option.value)}
          />
        ))}
      </div>
    </div>
  );
}
