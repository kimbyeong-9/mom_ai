import type { SearchProfile } from './entities/planning.entity';

// Real job platforms (Indeed, LinkedIn, Seek, WeWorkRemotely...) are
// English-language sites. Searching them with a Korean query mostly surfaces
// generic Korean-language "about working in X country" pages instead of
// actual listings, so the query itself has to be English — this builds one
// from the wizard's raw option ids (ISO country codes, kebab-slug values)
// rather than the profile's Korean display labels.

const regionNamesEn = new Intl.DisplayNames(['en'], { type: 'region' });

function countryCodeToEnglish(code: string): string {
  if (code === 'undecided') return '';
  return regionNamesEn.of(code) ?? code;
}

// Only overridden where a plain hyphen→space conversion reads badly —
// everything else (backend, frontend, data-scientist, devops...) is already
// a clear English job-title fragment once the hyphen is replaced.
const FIELD_VALUE_OVERRIDES: Record<string, string> = {
  'it-dev': 'IT',
  'support-ops': 'operations support',
  'finance-accounting': 'finance accounting',
  'writing-content': 'copywriting content',
  'education-online': 'online tutoring',
  'consulting-coaching': 'consulting coaching',
  'ml-ai': 'machine learning AI',
};

function fieldValueToEnglish(value: string): string {
  return FIELD_VALUE_OVERRIDES[value] ?? value.replace(/-/g, ' ');
}

const EXPERIENCE_VALUE_EN: Record<string, string> = {
  none: 'entry level',
  junior: '1-3 years experience',
  mid: '3-7 years experience',
  senior: 'senior 7+ years experience',
};

const WORK_STYLE_VALUE_EN: Record<string, string> = {
  remote: 'remote',
  hybrid: 'hybrid',
  onsite: 'on-site',
};

// Partial on purpose — only wizard option ids with a real, common English
// job-posting phrase get a term. "soon"/"later"/"undecided" don't map to
// anything real job platforms actually say, so adding a term for them would
// just narrow the search without improving relevance (same reasoning as
// languageValue being left out of the query entirely — see SearchProfile's
// doc comment in entities/planning.entity.ts).
const TIMELINE_VALUE_EN: Partial<Record<string, string>> = {
  urgent: 'urgently hiring immediate start',
};

// "none"/"pr-citizen" are also intentionally absent: "none" is too early to
// search on (still checking), and PR/citizenship holders don't need a visa
// modifier at all — searching without one is already correct for them.
const VISA_STATUS_VALUE_EN: Partial<Record<string, string>> = {
  'need-sponsor': 'visa sponsorship',
  'working-holiday-eligible': 'working holiday visa',
};

/** Returns null when the profile lacks the raw *Value/*Codes fields (e.g.
 * older saved data from before this feature), so callers can fall back to
 * their existing Korean-label-based query. */
export function buildEnglishJobQuery(
  profile: SearchProfile | null,
): string | null {
  if (!profile) return null;

  const countryTerms = (profile.countryCodes ?? [])
    .map(countryCodeToEnglish)
    .filter(Boolean);
  const fieldTerm = profile.fieldValue
    ? fieldValueToEnglish(profile.fieldValue)
    : null;
  const experienceTerm = profile.experienceValue
    ? EXPERIENCE_VALUE_EN[profile.experienceValue]
    : null;
  const workStyleTerm = profile.workStyleValue
    ? WORK_STYLE_VALUE_EN[profile.workStyleValue]
    : null;
  const timelineTerm = profile.timelineValue
    ? TIMELINE_VALUE_EN[profile.timelineValue]
    : null;
  const visaStatusTerm = profile.visaStatusValue
    ? VISA_STATUS_VALUE_EN[profile.visaStatusValue]
    : null;

  const terms = [
    ...countryTerms,
    fieldTerm,
    experienceTerm,
    workStyleTerm,
    visaStatusTerm,
    timelineTerm,
    'jobs hiring',
  ].filter((part): part is string => Boolean(part));

  if (terms.length <= 1) return null;
  return terms.join(' ');
}

// Korean regional job-info sites that otherwise slip through the bare
// "indeed.com"/"linkedin.com" include_domains entries (Tavily matches
// subdomains), surfacing "about working abroad" SEO content instead of
// actual job listings.
export const KOREAN_REGIONAL_EXCLUDE_DOMAINS = [
  'kr.indeed.com',
  'kr.linkedin.com',
  'kr.glassdoor.com',
];
