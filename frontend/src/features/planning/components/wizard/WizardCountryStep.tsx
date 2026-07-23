import { useState } from "react";

import { COUNTRIES, COUNTRIES_BY_REGION } from "@/constants/countries";
import WizardCountryButton from "./WizardCountryButton";

type WizardCountryStepProps = {
  title: string;
  subtitle?: string;
  value: string[];
  onChange: (codes: string[]) => void;
  // 해외취업은 정식 채용 절차상 한 국가로 좁혀야 해서 단일 선택, 디지털노마드는
  // 여러 국가를 옮겨다니는 게 자연스러워서 다중 선택 — GoalWizard가 goalForm
  // 답변(freelance-nomad 여부)으로 판단해서 내려준다.
  singleSelect?: boolean;
};

export default function WizardCountryStep({
  title,
  subtitle,
  value,
  onChange,
  singleSelect = false,
}: WizardCountryStepProps) {
  const [query, setQuery] = useState("");

  const searchResults =
    query.trim().length > 0
      ? COUNTRIES.filter((country) => country.name.includes(query.trim())).slice(0, 8)
      : [];

  const toggleCountry = (code: string) => {
    if (singleSelect) {
      onChange(value.includes(code) ? [] : [code]);
      return;
    }
    onChange(value.includes(code) ? value.filter((c) => c !== code) : [...value, code]);
  };

  return (
    <div className="flex h-full flex-col gap-[18px]">
      <div className="shrink-0 flex flex-col gap-[18px]">
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

        {value.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {value.map((code) => {
              const country = COUNTRIES.find((c) => c.code === code);
              if (!country) return null;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => toggleCountry(code)}
                  className="flex items-center gap-1.5 rounded-full bg-[#1F3D2E] px-3 py-1.5 text-xs font-semibold text-white"
                >
                  {country.flag} {country.name}
                  <span aria-hidden="true">×</span>
                </button>
              );
            })}
          </div>
        )}

        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="다른 국가를 검색해보세요 (예: 프랑스)"
          className="rounded-2xl border-[1.5px] border-[#1F3D2E]/[0.12] bg-white px-4 py-3 text-sm text-[#1F3D2E] placeholder:text-[#1F3D2E]/35 focus:border-[#1F3D2E]/40 focus:outline-none"
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_24px,black_calc(100%-24px),transparent)] [mask-image:linear-gradient(to_bottom,transparent,black_24px,black_calc(100%-24px),transparent)]">
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 pb-5 pt-5 sm:grid-cols-4">
            {searchResults.map((country) => (
              <WizardCountryButton
                key={country.code}
                flag={country.flag}
                name={country.name}
                isSelected={value.includes(country.code)}
                onClick={() => toggleCountry(country.code)}
              />
            ))}
          </div>
        ) : (
          // Grouped by subregion on both breakpoints — mobile shows a
          // 2-column grid, desktop shows a 4-column grid. pt-5/pb-5 keep the
          // first heading and last row clear of the top/bottom fade mask
          // (which always covers the container's top and bottom 24px).
          <div className="flex flex-col gap-5 pb-5 pt-5">
            {COUNTRIES_BY_REGION.map(({ region, countries }) => (
              <div key={region}>
                <h3 className="mb-2 text-xs font-bold tracking-wide text-[#1F3D2E]/45">
                  {region}
                </h3>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5">
                  {countries.map((country) => (
                    <WizardCountryButton
                      key={country.code}
                      flag={country.flag}
                      name={country.name}
                      isSelected={value.includes(country.code)}
                      onClick={() => toggleCountry(country.code)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
