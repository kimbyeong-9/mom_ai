import { useState } from "react";

import { COUNTRIES, POPULAR_COUNTRY_CODES } from "@/constants/countries";

const UNDECIDED = "undecided";

type WizardCountryStepProps = {
  title: string;
  subtitle?: string;
  value: string[];
  onChange: (codes: string[]) => void;
};

export default function WizardCountryStep({
  title,
  subtitle,
  value,
  onChange,
}: WizardCountryStepProps) {
  const [query, setQuery] = useState("");
  const isUndecided = value.includes(UNDECIDED);

  const popularCountries = POPULAR_COUNTRY_CODES.map(
    (code) => COUNTRIES.find((country) => country.code === code)!,
  );
  const searchResults =
    query.trim().length > 0
      ? COUNTRIES.filter((country) => country.name.includes(query.trim())).slice(0, 8)
      : [];

  const toggleCountry = (code: string) => {
    const next = value.includes(code) ? value.filter((c) => c !== code) : [...value, code];
    onChange(next.filter((c) => c !== UNDECIDED));
  };

  const toggleUndecided = () => {
    onChange(isUndecided ? [] : [UNDECIDED]);
  };

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

      {value.filter((c) => c !== UNDECIDED).length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value
            .filter((c) => c !== UNDECIDED)
            .map((code) => {
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
        disabled={isUndecided}
        className="rounded-2xl border-[1.5px] border-[#1F3D2E]/[0.12] bg-white px-4 py-3 text-sm text-[#1F3D2E] placeholder:text-[#1F3D2E]/35 focus:border-[#1F3D2E]/40 focus:outline-none disabled:opacity-40"
      />

      {searchResults.length > 0 ? (
        <div className="flex flex-col gap-2">
          {searchResults.map((country) => (
            <button
              key={country.code}
              type="button"
              onClick={() => toggleCountry(country.code)}
              className={`rounded-2xl border-[1.5px] px-4 py-3 text-left text-sm font-bold transition-colors ${
                value.includes(country.code)
                  ? "border-[#1F3D2E] bg-[#B7CBAE]/[0.18] text-[#1F3D2E]"
                  : "border-[#1F3D2E]/[0.12] bg-white text-[#1F3D2E] hover:border-[#1F3D2E]/25"
              }`}
            >
              {country.flag} {country.name}
            </button>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5">
          {popularCountries.map((country) => (
            <button
              key={country.code}
              type="button"
              onClick={() => toggleCountry(country.code)}
              disabled={isUndecided}
              className={`rounded-2xl border-[1.5px] px-4 py-4 text-left text-sm font-bold transition-colors disabled:opacity-40 ${
                value.includes(country.code)
                  ? "border-[#1F3D2E] bg-[#B7CBAE]/[0.18] text-[#1F3D2E]"
                  : "border-[#1F3D2E]/[0.12] bg-white text-[#1F3D2E] hover:border-[#1F3D2E]/25"
              }`}
            >
              {country.flag} {country.name}
            </button>
          ))}
          <button
            type="button"
            onClick={toggleUndecided}
            className={`rounded-2xl border-[1.5px] px-4 py-4 text-left text-sm font-bold transition-colors ${
              isUndecided
                ? "border-[#1F3D2E] bg-[#B7CBAE]/[0.18] text-[#1F3D2E]"
                : "border-[#1F3D2E]/[0.12] bg-white text-[#1F3D2E]/40 hover:border-[#1F3D2E]/25"
            }`}
          >
            아직 안정했어요
          </button>
        </div>
      )}
    </div>
  );
}
