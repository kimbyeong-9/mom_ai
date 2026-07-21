import type { SearchProfile } from './entities/planning.entity';
import {
  KOREAN_REGIONAL_EXCLUDE_DOMAINS,
  buildEnglishJobQuery,
} from './search-query.util';

// Regression coverage for the relevance bug found via a live Tavily call on
// 2026-07-22: a Korean-language query built from profile.field/experience/
// workStyle labels mostly returned Korean "about working abroad" SEO pages
// instead of real job listings. This locks down that the query is always
// built in English from the raw *Value/*Codes fields instead.
describe('buildEnglishJobQuery', () => {
  it('returns null for a null profile', () => {
    expect(buildEnglishJobQuery(null)).toBeNull();
  });

  it('returns null when the profile only has Korean labels (older saved data, no raw fields)', () => {
    const profile: SearchProfile = {
      countries: ['호주'],
      field: '리테일 세일즈',
      experience: '7년차 이상',
      workStyle: '하이브리드',
    };
    expect(buildEnglishJobQuery(profile)).toBeNull();
  });

  it('builds the full English query from country code + field/experience/workStyle values', () => {
    const profile: SearchProfile = {
      countries: ['호주'],
      countryCodes: ['AU'],
      fieldValue: 'retail-sales',
      experienceValue: 'senior',
      workStyleValue: 'hybrid',
    };
    expect(buildEnglishJobQuery(profile)).toBe(
      'Australia retail sales senior 7+ years experience hybrid jobs hiring',
    );
  });

  it('applies the override map for field values that read badly as plain hyphen replacement', () => {
    const profile: SearchProfile = {
      countries: [],
      countryCodes: ['VN'],
      fieldValue: 'it-dev',
    };
    expect(buildEnglishJobQuery(profile)).toBe('Vietnam IT jobs hiring');
  });

  it('falls back to hyphen-to-space conversion for field values without an override', () => {
    const profile: SearchProfile = {
      countries: [],
      countryCodes: ['TH'],
      fieldValue: 'data-scientist',
    };
    expect(buildEnglishJobQuery(profile)).toBe(
      'Thailand data scientist jobs hiring',
    );
  });

  it('filters out the "undecided" country placeholder', () => {
    const profile: SearchProfile = {
      countries: [],
      countryCodes: ['undecided', 'AU'],
      fieldValue: 'backend',
    };
    expect(buildEnglishJobQuery(profile)).toBe('Australia backend jobs hiring');
  });

  it('returns null when there is nothing but the fixed "jobs hiring" suffix', () => {
    const profile: SearchProfile = {
      countries: [],
      countryCodes: ['undecided'],
    };
    expect(buildEnglishJobQuery(profile)).toBeNull();
  });

  it('still returns a query with only a country and no field/experience/workStyle', () => {
    const profile: SearchProfile = { countries: [], countryCodes: ['AU'] };
    expect(buildEnglishJobQuery(profile)).toBe('Australia jobs hiring');
  });
});

describe('KOREAN_REGIONAL_EXCLUDE_DOMAINS', () => {
  it('excludes the Korean regional subdomains that leaked through the bare top-level domain filter', () => {
    expect(KOREAN_REGIONAL_EXCLUDE_DOMAINS).toEqual(
      expect.arrayContaining([
        'kr.indeed.com',
        'kr.linkedin.com',
        'kr.glassdoor.com',
      ]),
    );
  });
});
