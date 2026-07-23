// ISO 3166-1 alpha-2 code list, grouped by geographic subregion (finer-
// grained than continent — e.g. Asia split into East/Southeast/South/
// Central/West) so the desktop country picker can show a labeled, grouped
// grid instead of one long list. KR/KP are deliberately excluded — this is a
// "moving abroad" wizard, so Korea itself isn't a valid destination.
const COUNTRY_CODES_BY_REGION = {
  동아시아: ["CN", "HK", "JP", "MO", "MN", "TW"],
  동남아시아: ["BN", "KH", "ID", "LA", "MY", "MM", "PH", "SG", "TH", "TL", "VN"],
  남아시아: ["AF", "BD", "BT", "IN", "MV", "NP", "PK", "LK"],
  중앙아시아: ["KZ", "KG", "TJ", "TM", "UZ"],
  "서아시아(중동)": [
    "AM", "AZ", "BH", "GE", "IR", "IQ", "IL", "JO", "KW", "LB", "OM", "PS",
    "QA", "SA", "SY", "TR", "AE", "YE",
  ],
  북유럽: ["DK", "EE", "FO", "FI", "GG", "IS", "IE", "IM", "JE", "LV", "LT", "NO", "SJ", "SE", "GB", "AX"],
  서유럽: ["AT", "BE", "FR", "DE", "LI", "LU", "MC", "NL", "CH"],
  남유럽: [
    "AL", "AD", "BA", "HR", "GI", "GR", "VA", "IT", "XK", "MT", "ME", "MK",
    "PT", "SM", "RS", "SI", "ES", "CY",
  ],
  동유럽: ["BY", "BG", "CZ", "HU", "MD", "PL", "RO", "RU", "SK", "UA"],
  북미: ["CA", "US", "GL", "BM", "PM"],
  중미: ["BZ", "CR", "SV", "GT", "HN", "MX", "NI", "PA"],
  카리브해: [
    "AI", "AG", "AW", "BS", "BB", "VG", "KY", "CU", "CW", "DM", "DO", "GD",
    "GP", "HT", "JM", "MQ", "MS", "PR", "BL", "KN", "LC", "MF", "VC", "SX",
    "TT", "TC", "VI", "BQ",
  ],
  남미: ["AR", "BO", "BR", "CL", "CO", "EC", "FK", "GF", "GY", "PY", "PE", "SR", "UY", "VE"],
  오세아니아: [
    "AS", "AU", "CK", "FJ", "PF", "GU", "KI", "MH", "FM", "NR", "NC", "NZ",
    "NU", "NF", "MP", "PW", "PG", "PN", "WS", "SB", "TK", "TO", "TV", "VU", "WF",
  ],
  아프리카: [
    "DZ", "AO", "BJ", "BW", "BF", "BI", "CV", "CM", "CF", "TD", "KM", "CG", "CD",
    "CI", "DJ", "EG", "GQ", "ER", "SZ", "ET", "GA", "GM", "GH", "GN", "GW", "KE",
    "LS", "LR", "LY", "MG", "MW", "ML", "MR", "MU", "YT", "MA", "MZ", "NA", "NE",
    "NG", "RE", "RW", "SH", "ST", "SN", "SC", "SL", "SO", "ZA", "SS", "SD", "TZ",
    "TG", "TN", "UG", "EH", "ZM", "ZW",
  ],
  기타: ["AQ", "BV", "IO", "TF", "HM", "GS", "UM"],
} as const;

export const REGIONS = Object.keys(COUNTRY_CODES_BY_REGION) as (keyof typeof COUNTRY_CODES_BY_REGION)[];

const CODE_TO_REGION = new Map<string, string>(
  REGIONS.flatMap((region) =>
    COUNTRY_CODES_BY_REGION[region].map((code) => [code, region] as const),
  ),
);

// A few ICU region names read as overly formal/unfamiliar in Korean —
// override with the name Koreans actually use day to day.
const COLLOQUIAL_NAME_OVERRIDES: Partial<Record<string, string>> = {
  AU: "호주",
};

function getFlagEmoji(countryCode: string): string {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

const koRegionNames = new Intl.DisplayNames(["ko"], { type: "region" });

export const COUNTRIES = REGIONS.flatMap((region) => COUNTRY_CODES_BY_REGION[region])
  .map((code) => ({
    code,
    name: COLLOQUIAL_NAME_OVERRIDES[code] ?? koRegionNames.of(code) ?? code,
    flag: getFlagEmoji(code),
    region: CODE_TO_REGION.get(code)!,
  }))
  .sort((a, b) => a.name.localeCompare(b.name, "ko"));

export type Country = (typeof COUNTRIES)[number];

// Same countries as COUNTRIES, grouped by subregion (in REGIONS order) and
// name-sorted within each group — used for the desktop country picker's
// grouped grid. Mobile keeps the flat COUNTRIES list.
export const COUNTRIES_BY_REGION = REGIONS.map((region) => ({
  region,
  countries: COUNTRIES.filter((country) => country.region === region),
}));
