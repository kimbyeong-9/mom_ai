# LifeFlow AI (Mom AI) — 작업 가이드

모든 기능 구현 시 이 문서를 먼저 읽고 작업한다.

---

## 문서 우선순위

기능 구현 전 반드시 아래 순서로 문서를 확인한다.

```
docs/problem-definition.md       → 사용자 문제 + 지표 정의
docs/solution-exploration.md     → Loop별 개선 아이디어
docs/decision-log-01-planning-loop.md
docs/decision-log-02-save-loop.md
docs/decision-log-03-automation-loop.md
docs/strategic-okr.md            → Loop별 전략 목표
docs/execution-okr.md            → 기능 단위 실행안
```

---

## Loop 구조 — 반드시 명시

기능 추가 시 어떤 Loop를 개선하는 기능인지 코드 상단 주석 또는 PR 설명에 명시한다.

```
Planning Loop   → Goal Input → AI Planning → Result Viewed
Save Loop       → Result Viewed → Save → Revisited
Automation Loop → Save → Automation Connected → Automation Executed
```

### 지표 대응표

| Loop | 지표 |
|------|------|
| Planning Loop | GP1, GP2, Planning_LCP |
| Save Loop | SP1, RP1, Save_LCP |
| Automation Loop | AP1, AP2, Automation_LCP |
| 전체 | Total_LCP, ReSearch_R |

---

## 프로젝트 구조

```
src/
├── api/              # Axios 인스턴스, API 함수
├── components/
│   └── ui/           # shadcn/ui 공통 컴포넌트
├── constants/        # 상수 (목표 유형, 자동화 유형 등)
├── features/
│   ├── planning/     # Planning Loop 관련 컴포넌트, hooks, types
│   ├── save/         # Save Loop 관련 컴포넌트, hooks, types
│   ├── automation/   # Automation Loop 관련 컴포넌트, hooks, types
│   └── auth/         # 인증 관련
├── hooks/            # 공통 커스텀 훅
├── layouts/          # 레이아웃 컴포넌트
├── lib/              # queryClient, utils
├── pages/            # 페이지 컴포넌트 (라우터 단위)
├── routes/           # router.tsx
├── store/            # Zustand 스토어
└── types/            # 공통 타입
```

### features 폴더 내부 구조 (Loop 단위)

```
features/planning/
├── components/       # Planning Loop UI 컴포넌트
├── hooks/            # usePlanning, usePlanningResult 등
├── types/            # Planning 관련 타입
└── index.ts          # 외부로 export할 항목
```

---

## 프론트엔드 코딩 규칙

### 1. map + props 우선 원칙

목록 렌더링은 반드시 `map`을 사용한다.  
컴포넌트는 `props`로 데이터를 받아 렌더링한다.  
하드코딩된 반복 JSX는 작성하지 않는다.

**올바른 예시**

```tsx
// 데이터를 상수 또는 상위에서 정의
const GOAL_TYPES = [
  { id: "youth", label: "청년 지원금" },
  { id: "abroad", label: "해외 준비" },
  { id: "job", label: "취업 준비" },
  { id: "nomad", label: "디지털 노마드" },
];

// map으로 렌더링
{GOAL_TYPES.map((type) => (
  <GoalTypeCard key={type.id} label={type.label} />
))}
```

**잘못된 예시 (작성 금지)**

```tsx
<GoalTypeCard label="청년 지원금" />
<GoalTypeCard label="해외 준비" />
<GoalTypeCard label="취업 준비" />
<GoalTypeCard label="디지털 노마드" />
```

---

### 2. 컴포넌트 분리 원칙

다음 기준 중 하나라도 해당하면 컴포넌트로 분리한다.

- 같은 UI 패턴이 2곳 이상 반복될 때
- 하나의 JSX 블록이 20줄을 초과할 때
- 데이터 단위로 반복 렌더링이 필요할 때
- Loop 단위(Planning / Save / Automation)가 명확히 구분될 때

**컴포넌트 파일 위치 원칙**

| 종류 | 위치 |
|------|------|
| 특정 Loop에 속하는 컴포넌트 | `features/{loop}/components/` |
| 여러 곳에서 재사용되는 컴포넌트 | `components/ui/` 또는 `components/` |
| 페이지 전용 컴포넌트 | `pages/` 내부 또는 `features/{loop}/components/` |

---

### 3. props 타입 명시

모든 컴포넌트는 props 타입을 명시한다.

```tsx
type PlanCardProps = {
  title: string;
  savedAt: string;
  goalType: string;
  completedSteps: number;
  totalSteps: number;
};

export default function PlanCard({
  title,
  savedAt,
  goalType,
  completedSteps,
  totalSteps,
}: PlanCardProps) {
  return (
    // ...
  );
}
```

---

### 4. 상수는 constants 폴더에 정의

목표 유형, 자동화 유형 등 반복 사용되는 상수는 `src/constants/`에 정의한다.

```ts
// src/constants/goalTypes.ts
export const GOAL_TYPES = [
  { id: "youth", label: "청년 지원금" },
  { id: "abroad", label: "해외 준비" },
  { id: "job", label: "취업 준비" },
  { id: "nomad", label: "디지털 노마드" },
] as const;
```

---

### 5. 데이터 패칭은 TanStack Query

서버 데이터 조회는 TanStack Query의 `useQuery`를 사용한다.  
서버 데이터 변경은 `useMutation`을 사용한다.

```ts
// features/planning/hooks/usePlanningResult.ts
export function usePlanningResult(goalId: string) {
  return useQuery({
    queryKey: ["planning", goalId],
    queryFn: () => fetchPlanningResult(goalId),
  });
}
```

---

### 6. 클라이언트 상태는 Zustand

로그인 상태, UI 상태 등 서버와 무관한 클라이언트 상태는 Zustand를 사용한다.

```ts
// src/store/auth.store.ts
```

---

### 7. 폼은 React Hook Form

사용자 입력이 있는 폼은 React Hook Form을 사용한다.

---

## 기능 구현 체크리스트

기능을 구현할 때마다 아래를 확인한다.

- [ ] 어떤 Loop를 개선하는 기능인가? (Planning / Save / Automation)
- [ ] 어떤 지표를 개선하는가? (GP1, GP2, SP1, RP1, AP1, AP2)
- [ ] 관련 이벤트가 연결되어 있는가? (meta-okr.md 참고)
- [ ] 목록은 map으로 렌더링하는가?
- [ ] 반복 UI는 컴포넌트로 분리했는가?
- [ ] props 타입이 명시되어 있는가?
- [ ] 상수는 constants 폴더에 정의했는가?

---

## 기술 스택 요약

| 분류 | 기술 |
|------|------|
| UI | React 19, TypeScript, Tailwind CSS v4, shadcn/ui |
| 라우팅 | React Router v7 |
| 서버 상태 | TanStack Query v5 |
| 클라이언트 상태 | Zustand v5 |
| HTTP | Axios |
| 폼 | React Hook Form |
| 빌드 | Vite |

---

## 페이지 — 라우터 구조

| 경로 | 페이지 | Loop |
|------|--------|------|
| `/` | HomePage | — |
| `/planning` | PlanningPage | Planning Loop |
| `/saved` | SavedPage | Save Loop |
| `/automation` | AutomationPage | Automation Loop |
| `/login` | LoginPage | — |
