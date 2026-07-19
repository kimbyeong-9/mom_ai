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
    options: [
      { value: "it-dev", label: "IT·개발" },
      { value: "design", label: "디자인" },
      { value: "marketing", label: "마케팅·콘텐츠" },
      { value: "support-ops", label: "고객지원·운영" },
      { value: "hospitality", label: "요식업·숙박" },
      { value: "logistics", label: "생산·물류" },
      { value: "education", label: "교육" },
      { value: "healthcare", label: "의료·헬스케어" },
      { value: "other", label: "기타", muted: true },
    ],
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
  const step = GOAL_WIZARD_STEPS.find((s) => s.id === stepId);
  if (!step || step.type !== "single-select") return null;
  return step.options.find((option) => option.value === value)?.label ?? null;
}
