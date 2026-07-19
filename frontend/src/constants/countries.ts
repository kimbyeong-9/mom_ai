// Full ISO 3166-1 alpha-2 code list (all 248 currently assigned codes,
// including dependent territories relevant to expats/nomads like HK, TW, PR).
const COUNTRY_CODES = [
  "DZ", "AO", "BJ", "BW", "BF", "BI", "CV", "CM", "CF", "TD", "KM", "CG", "CD",
  "CI", "DJ", "EG", "GQ", "ER", "SZ", "ET", "GA", "GM", "GH", "GN", "GW", "KE",
  "LS", "LR", "LY", "MG", "MW", "ML", "MR", "MU", "YT", "MA", "MZ", "NA", "NE",
  "NG", "RE", "RW", "SH", "ST", "SN", "SC", "SL", "SO", "ZA", "SS", "SD", "TZ",
  "TG", "TN", "UG", "EH", "ZM", "ZW",
  "AI", "AG", "AR", "AW", "BS", "BB", "BZ", "BM", "BO", "BQ", "BR", "VG", "CA",
  "KY", "CL", "CO", "CR", "CU", "CW", "DM", "DO", "EC", "SV", "FK", "GF", "GL",
  "GD", "GP", "GT", "GY", "HT", "HN", "JM", "MQ", "MX", "MS", "NI", "PA", "PY",
  "PE", "PR", "BL", "KN", "LC", "MF", "PM", "VC", "SX", "SR", "TT", "TC", "US",
  "UY", "VE", "VI",
  "AF", "AM", "AZ", "BH", "BD", "BT", "BN", "KH", "CN", "CY", "GE", "HK", "IN",
  "ID", "IR", "IQ", "IL", "JP", "JO", "KZ", "KW", "KG", "LA", "LB", "MO", "MY",
  "MV", "MN", "MM", "NP", "KP", "OM", "PK", "PS", "PH", "QA", "SA", "SG", "KR",
  "LK", "SY", "TW", "TJ", "TH", "TL", "TR", "TM", "AE", "UZ", "VN", "YE",
  "AL", "AD", "AT", "BY", "BE", "BA", "BG", "HR", "CZ", "DK", "EE", "FO", "FI",
  "FR", "DE", "GI", "GR", "GG", "VA", "HU", "IS", "IE", "IM", "IT", "JE", "XK",
  "LV", "LI", "LT", "LU", "MT", "MD", "MC", "ME", "NL", "MK", "NO", "PL", "PT",
  "RO", "RU", "SM", "RS", "SK", "SI", "ES", "SJ", "SE", "CH", "UA", "GB", "AX",
  "AS", "AU", "CK", "FJ", "PF", "GU", "KI", "MH", "FM", "NR", "NC", "NZ", "NU",
  "NF", "MP", "PW", "PG", "PN", "WS", "SB", "TK", "TO", "TV", "VU", "WF",
  "AQ", "BV", "IO", "TF", "HM", "GS", "UM",
] as const;

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

export const COUNTRIES = COUNTRY_CODES.map((code) => ({
  code,
  name: COLLOQUIAL_NAME_OVERRIDES[code] ?? koRegionNames.of(code) ?? code,
  flag: getFlagEmoji(code),
})).sort((a, b) => a.name.localeCompare(b.name, "ko"));

export type Country = (typeof COUNTRIES)[number];

export const POPULAR_COUNTRY_CODES = ["AU", "CA", "DE", "SG", "US", "GB", "JP", "NZ"] as const;
