export type WizardOption = {
  value: string;
  label: string;
  description?: string;
  muted?: boolean;
};

export type SingleSelectWizardStep = {
  id: string;
  type: "single-select";
  title: string;
  subtitle?: string;
  options: readonly WizardOption[];
};

export type CountryWizardStep = {
  id: "countries";
  type: "country-multi-select";
  title: string;
  subtitle?: string;
};

export type WizardStep = SingleSelectWizardStep | CountryWizardStep;

// 해외취업 covers literally any occupation, so this stays broad. Kept
// separate from NOMAD_FIELD_OPTIONS below because a "노마드" vertical answer
// should only ever offer occupations that are actually remote-workable —
// showing 요식업·숙박/생산·물류 there would be a real, findable job we can't
// deliver on.
export const ABROAD_FIELD_OPTIONS: readonly WizardOption[] = [
  { value: "it-dev", label: "IT·개발" },
  { value: "design", label: "디자인" },
  { value: "marketing", label: "마케팅·콘텐츠" },
  { value: "support-ops", label: "고객지원·운영" },
  { value: "sales", label: "영업·세일즈" },
  { value: "finance-accounting", label: "회계·재무" },
  { value: "hr", label: "인사·총무" },
  { value: "engineering", label: "엔지니어링(기계·전기·화학 등)" },
  { value: "hospitality", label: "요식업·숙박" },
  { value: "logistics", label: "생산·물류" },
  { value: "education", label: "교육" },
  { value: "healthcare", label: "의료·헬스케어" },
  { value: "legal", label: "법률·컨설팅" },
  { value: "other", label: "기타", muted: true },
];

export const NOMAD_FIELD_OPTIONS: readonly WizardOption[] = [
  { value: "it-dev", label: "IT·개발" },
  { value: "design", label: "디자인" },
  { value: "marketing", label: "마케팅·콘텐츠" },
  { value: "support-ops", label: "고객지원·운영(원격)" },
  { value: "translation", label: "번역·통역" },
  { value: "writing-content", label: "카피라이팅·콘텐츠 제작" },
  { value: "education-online", label: "온라인 강의·튜터링" },
  { value: "consulting-coaching", label: "컨설팅·코칭" },
  { value: "other", label: "기타", muted: true },
];

/** goalForm === "freelance-nomad" is the only wizard path that maps to the
 * 디지털노마드 vertical — everything else (fulltime/working-holiday) is 해외취업. */
export function getFieldOptions(goalForm: string | undefined): readonly WizardOption[] {
  return goalForm === "freelance-nomad" ? NOMAD_FIELD_OPTIONS : ABROAD_FIELD_OPTIONS;
}

// Real job titles within each broad category (checked against LinkedIn's
// official job-function taxonomy for category boundaries) — this is what
// actually makes the search query specific ("백엔드 개발자" vs the broad
// "IT·개발" category, which was the root cause of irrelevant search results).
// "other" categories intentionally have no sub-list — that step is skipped
// entirely when the field answer is "other" (see useGoalWizard).
export const FIELD_SUBROLES: Record<string, readonly WizardOption[]> = {
  "it-dev": [
    { value: "backend", label: "백엔드 개발자" },
    { value: "frontend", label: "프론트엔드 개발자" },
    { value: "fullstack", label: "풀스택 개발자" },
    { value: "mobile", label: "모바일 개발자 (iOS/Android)" },
    { value: "data-engineer", label: "데이터 엔지니어" },
    { value: "data-scientist", label: "데이터 사이언티스트" },
    { value: "data-analyst", label: "데이터 분석가" },
    { value: "ml-ai", label: "머신러닝·AI 엔지니어" },
    { value: "devops", label: "DevOps 엔지니어" },
    { value: "cloud", label: "클라우드 엔지니어" },
    { value: "qa", label: "QA·테스트 엔지니어" },
    { value: "security", label: "보안 엔지니어" },
    { value: "sysadmin", label: "시스템·네트워크 엔지니어" },
    { value: "game-dev", label: "게임 개발자" },
    { value: "embedded", label: "임베디드 엔지니어" },
    { value: "tech-pm", label: "테크니컬 프로덕트 매니저" },
    { value: "it-pm", label: "IT 프로젝트 매니저" },
    { value: "architect", label: "솔루션 아키텍트" },
    { value: "other-it", label: "기타 IT·개발", muted: true },
  ],
  design: [
    { value: "ux", label: "UX 디자이너" },
    { value: "ui", label: "UI 디자이너" },
    { value: "product-design", label: "프로덕트 디자이너" },
    { value: "graphic", label: "그래픽 디자이너" },
    { value: "brand-design", label: "브랜드 디자이너" },
    { value: "motion", label: "모션 디자이너" },
    { value: "3d-art", label: "3D·게임 아티스트" },
    { value: "industrial", label: "산업 디자이너" },
    { value: "interior", label: "인테리어 디자이너" },
    { value: "fashion", label: "패션 디자이너" },
    { value: "web-design", label: "웹 디자이너" },
    { value: "other-design", label: "기타 디자인", muted: true },
  ],
  marketing: [
    { value: "digital-marketing", label: "디지털 마케터" },
    { value: "performance-marketing", label: "퍼포먼스 마케터" },
    { value: "seo-sem", label: "SEO·SEM 전문가" },
    { value: "social-media", label: "소셜미디어 매니저" },
    { value: "content-marketing", label: "콘텐츠 마케터" },
    { value: "brand-marketing", label: "브랜드 마케터" },
    { value: "growth", label: "그로스 마케터" },
    { value: "pr-comms", label: "PR·커뮤니케이션 매니저" },
    { value: "email-marketing", label: "이메일 마케팅 전문가" },
    { value: "marketing-analyst", label: "마케팅 애널리스트" },
    { value: "other-marketing", label: "기타 마케팅", muted: true },
  ],
  "support-ops": [
    { value: "customer-support", label: "고객지원 상담원" },
    { value: "customer-success", label: "고객성공 매니저" },
    { value: "tech-support", label: "기술지원 엔지니어" },
    { value: "callcenter-manager", label: "콜센터 매니저" },
    { value: "operations-manager", label: "운영 매니저" },
    { value: "community-manager", label: "커뮤니티 매니저" },
    { value: "other-support", label: "기타 고객지원·운영", muted: true },
  ],
  sales: [
    { value: "sales-rep", label: "영업 대표" },
    { value: "account-manager", label: "어카운트 매니저" },
    { value: "biz-dev", label: "비즈니스 개발 매니저" },
    { value: "sales-engineer", label: "세일즈 엔지니어" },
    { value: "retail-sales", label: "리테일 세일즈" },
    { value: "inside-sales", label: "인사이드 세일즈" },
    { value: "partnership-manager", label: "파트너십 매니저" },
    { value: "other-sales", label: "기타 영업·세일즈", muted: true },
  ],
  "finance-accounting": [
    { value: "accountant", label: "회계사" },
    { value: "financial-analyst", label: "재무 분석가" },
    { value: "tax-specialist", label: "세무 전문가" },
    { value: "auditor", label: "감사 (Auditor)" },
    { value: "finance-manager", label: "재무 관리자" },
    { value: "investment-analyst", label: "투자 분석가" },
    { value: "payroll", label: "페이롤 전문가" },
    { value: "risk-management", label: "리스크 관리 담당자" },
    { value: "other-finance", label: "기타 회계·재무", muted: true },
  ],
  hr: [
    { value: "hr-generalist", label: "HR 제너럴리스트" },
    { value: "recruiter", label: "채용담당자" },
    { value: "hrbp", label: "HR 비즈니스 파트너 (HRBP)" },
    { value: "comp-benefits", label: "급여·복지 담당" },
    { value: "lnd", label: "조직문화·교육 담당 (L&D)" },
    { value: "general-affairs", label: "총무" },
    { value: "other-hr", label: "기타 인사·총무", muted: true },
  ],
  engineering: [
    { value: "mechanical", label: "기계 엔지니어" },
    { value: "electrical", label: "전기·전자 엔지니어" },
    { value: "chemical", label: "화학 엔지니어" },
    { value: "civil", label: "토목 엔지니어" },
    { value: "industrial-eng", label: "산업 엔지니어" },
    { value: "aerospace", label: "항공우주 엔지니어" },
    { value: "automotive", label: "자동차 엔지니어" },
    { value: "environmental", label: "환경 엔지니어" },
    { value: "quality-eng", label: "품질(QC) 엔지니어" },
    { value: "other-engineering", label: "기타 엔지니어링", muted: true },
  ],
  hospitality: [
    { value: "chef", label: "셰프·조리사" },
    { value: "barista", label: "바리스타" },
    { value: "server", label: "서버·홀 스태프" },
    { value: "bartender", label: "바텐더" },
    { value: "hotel-frontdesk", label: "호텔 프론트데스크" },
    { value: "housekeeping", label: "하우스키핑" },
    { value: "restaurant-manager", label: "레스토랑 매니저" },
    { value: "event-catering", label: "이벤트·케이터링 스태프" },
    { value: "other-hospitality", label: "기타 요식업·숙박", muted: true },
  ],
  logistics: [
    { value: "factory-worker", label: "생산직·공장 근로자" },
    { value: "warehouse", label: "창고 관리자" },
    { value: "logistics-coordinator", label: "물류 코디네이터" },
    { value: "supply-chain", label: "공급망 관리자" },
    { value: "qc", label: "품질관리(QC)" },
    { value: "delivery-driver", label: "배송·운전" },
    { value: "other-logistics", label: "기타 생산·물류", muted: true },
  ],
  education: [
    { value: "language-teacher", label: "어학강사 (ESL 등)" },
    { value: "kindergarten-elementary", label: "유치원·초등교사" },
    { value: "university-lecturer", label: "대학 강사·교수" },
    { value: "tutor", label: "튜터·과외" },
    { value: "curriculum-dev", label: "교육 콘텐츠 개발자" },
    { value: "special-education", label: "특수교육 교사" },
    { value: "other-education", label: "기타 교육", muted: true },
  ],
  healthcare: [
    { value: "nurse", label: "간호사" },
    { value: "doctor", label: "의사" },
    { value: "physical-therapist", label: "물리치료사" },
    { value: "pharmacist", label: "약사" },
    { value: "care-worker", label: "요양보호사" },
    { value: "dental-hygienist", label: "치과위생사" },
    { value: "medical-technician", label: "의료기술자" },
    { value: "other-healthcare", label: "기타 의료·헬스케어", muted: true },
  ],
  legal: [
    { value: "lawyer", label: "변호사" },
    { value: "inhouse-legal", label: "사내변호사·법무팀원" },
    { value: "management-consultant", label: "경영 컨설턴트" },
    { value: "strategy-consultant", label: "전략 컨설턴트" },
    { value: "it-consultant", label: "IT 컨설턴트" },
    { value: "patent-specialist", label: "특허 전문가" },
    { value: "other-legal", label: "기타 법률·컨설팅", muted: true },
  ],
  // Nomad-only leaf categories that aren't in ABROAD_FIELD_OPTIONS.
  translation: [
    { value: "translator", label: "번역가" },
    { value: "interpreter", label: "통역사" },
    { value: "localization", label: "현지화 전문가 (Localization)" },
  ],
  "writing-content": [
    { value: "copywriter", label: "카피라이터" },
    { value: "content-writer", label: "콘텐츠 라이터" },
    { value: "technical-writer", label: "테크니컬 라이터" },
    { value: "social-content-creator", label: "SNS 콘텐츠 크리에이터" },
  ],
  "education-online": [
    { value: "online-instructor", label: "온라인 강사" },
    { value: "curriculum-developer", label: "커리큘럼 개발자" },
    { value: "language-tutor", label: "언어 튜터" },
  ],
  "consulting-coaching": [
    { value: "business-consultant", label: "비즈니스 컨설턴트" },
    { value: "career-coach", label: "커리어 코치" },
    { value: "life-coach", label: "라이프 코치" },
  ],
};

/** "other" (and any category with no sub-list, defensively) skips the
 * specificRole step entirely — see useGoalWizard's effectiveSteps. */
export function getSubRoleOptions(field: string | undefined): readonly WizardOption[] {
  if (!field) return [];
  return FIELD_SUBROLES[field] ?? [];
}

// Steps 3(field), 6(visaStatus), and 7(language) weren't part of the original
// 5-step mockup (which only detailed 1/2/4/5/8 of an 8-step flow) — filled in
// here with commonly used categories for overseas job search / digital nomad
// visas so the flow has all 8 steps. Adjust freely if these don't match.
export const GOAL_WIZARD_STEPS: readonly WizardStep[] = [
  {
    id: "goalForm",
    type: "single-select",
    title: "어떤 형태를 목표로 하시나요?",
    subtitle: "가장 가까운 걸 골라주세요",
    options: [
      {
        value: "fulltime",
        label: "정규직 취업",
        description: "현지·해외 기업에 정식으로 채용되고 싶어요",
      },
      {
        value: "freelance-nomad",
        label: "프리랜서·노마드 소득",
        description: "원격으로 일하며 여러 나라를 옮겨다니고 싶어요",
      },
      {
        value: "working-holiday",
        label: "워킹홀리데이 단기체험",
        description: "1년 정도 짧게 살아보고 싶어요",
      },
    ],
  },
  {
    id: "countries",
    type: "country-multi-select",
    title: "어떤 국가·지역을 목표로 하시나요?",
    subtitle: "여러 개를 고르셔도 괜찮아요",
  },
  {
    id: "field",
    type: "single-select",
    title: "어떤 직군을 희망하시나요?",
    subtitle: "가장 가까운 항목을 골라주세요",
    // Placeholder — GoalWizard swaps this for ABROAD_FIELD_OPTIONS or
    // NOMAD_FIELD_OPTIONS at render time based on the goalForm answer.
    options: ABROAD_FIELD_OPTIONS,
  },
  {
    id: "specificRole",
    type: "single-select",
    title: "구체적으로 어떤 직무인가요?",
    subtitle: "검색 정확도를 크게 높여줘요",
    // Placeholder — GoalWizard swaps this for FIELD_SUBROLES[field] at
    // render time. Skipped entirely when field is "other" (see
    // useGoalWizard's effectiveSteps).
    options: [],
  },
  {
    id: "experience",
    type: "single-select",
    title: "경력 수준은 어떻게 되시나요?",
    subtitle: "가장 가까운 항목을 골라주세요",
    options: [
      { value: "none", label: "신입 · 1년 미만" },
      { value: "junior", label: "1~3년차" },
      { value: "mid", label: "3~7년차" },
      { value: "senior", label: "7년차 이상" },
    ],
  },
  {
    id: "timeline",
    type: "single-select",
    title: "언제까지 준비를\n마치고 싶으신가요?",
    subtitle: "알림·자동화 주기를 여기에 맞춰드려요",
    options: [
      { value: "urgent", label: "1개월 이내 · 급해요" },
      { value: "soon", label: "3개월 이내" },
      { value: "later", label: "6개월 이상 천천히" },
      { value: "undecided", label: "아직 미정이에요", muted: true },
    ],
  },
  {
    id: "visaStatus",
    type: "single-select",
    title: "비자·체류 자격은 어떻게 되시나요?",
    subtitle: "지금 상태에 맞는 걸 골라주세요",
    options: [
      { value: "none", label: "아직 없어요 (알아보는 중)" },
      { value: "working-holiday-eligible", label: "워킹홀리데이 자격 있음" },
      { value: "need-sponsor", label: "취업비자 스폰서 필요" },
      { value: "pr-citizen", label: "영주권·시민권 보유" },
    ],
  },
  {
    id: "language",
    type: "single-select",
    title: "영어(또는 목표 국가 언어)\n실력은 어느 정도인가요?",
    subtitle: "구직 난이도를 가늠하는 데만 참고할게요",
    options: [
      { value: "business", label: "비즈니스 수준 (실무 가능)" },
      { value: "conversational", label: "일상 회화 가능" },
      { value: "basic", label: "기초 수준" },
      { value: "native", label: "원어민·전공 수준" },
    ],
  },
  {
    id: "workStyle",
    type: "single-select",
    title: "원격 근무를 원하시나요,\n현지 출근을 원하시나요?",
    options: [
      { value: "remote", label: "완전 원격" },
      { value: "hybrid", label: "하이브리드" },
      { value: "onsite", label: "현지 출근" },
    ],
  },
] as const;

export function findWizardOptionLabel(stepId: string, value: string | undefined): string | null {
  if (!value) return null;

  // "field" shows one of two option sets depending on the vertical (see
  // getFieldOptions) — search the union so a label lookup finds either.
  if (stepId === "field") {
    const merged = [...ABROAD_FIELD_OPTIONS, ...NOMAD_FIELD_OPTIONS];
    return merged.find((option) => option.value === value)?.label ?? null;
  }

  // "specificRole" shows one of many option sets depending on the field
  // answer — search across all of them.
  if (stepId === "specificRole") {
    const merged = Object.values(FIELD_SUBROLES).flat();
    return merged.find((option) => option.value === value)?.label ?? null;
  }

  const step = GOAL_WIZARD_STEPS.find((s) => s.id === stepId);
  if (!step || step.type !== "single-select") return null;
  return step.options.find((option) => option.value === value)?.label ?? null;
}
