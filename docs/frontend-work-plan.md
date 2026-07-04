# 프론트엔드 작업 순서 — LifeFlow AI (Mom AI)

`frontend/` 폴더 기준 작업 목록이다. `execution-okr.md`의 Phase 우선순위(Planning → Save → Automation)를 따르되, 각 Phase에 앞서 공통 기초 설정을 먼저 마친다.

백엔드 API 개발은 이 문서 범위 밖이다. Planning/Save/Automation 각 Phase의 API 연동 작업은 대응하는 백엔드 엔드포인트가 준비되어야 실제로 동작한다.

---

## Phase 0 — 공통 기초 설정 (선행 작업)

- [x] `tsconfig.app.json`의 `baseUrl` 제거 (TS5101 빌드 에러 수정 완료)
- [x] `src/api/axios.ts` — Axios 인스턴스 생성 (baseURL, interceptor, 401 시 auto logout)
- [x] `.env` — `VITE_API_BASE_URL` 설정
- [x] `src/store/auth.store.ts` — Zustand 인증 스토어 구현 (persist 미들웨어 적용)
- [x] `App.tsx` / `App.css` — 미사용 파일 삭제 완료

---

## Phase 1 — Planning Loop

**Loop**: Planning Loop · **지표**: GP1, GP2, Planning_LCP

### EX-P1: Goal Input 폼
- [x] `src/constants/goalTypes.ts` — 목표 유형 상수 정의 (청년지원금 / 해외 / 취업 / 디지털 노마드)
- [x] `features/planning/components/` — 자연어 목표 입력 필드(`GoalInputForm`), 목표 유형 선택 카드(`GoalTypeSelector`/`GoalTypeCard`, map 렌더링), 제출 버튼
- [x] `features/planning/hooks/useGoalInputForm.ts` — React Hook Form 기반 폼 훅 (제출 시 `useSubmitGoal` mutation 트리거)
- [x] 이벤트 연결: `goal_input_submitted` (`useSubmitGoal`의 `onSuccess`에서 발생, 실제 분석 도구 연동 전까지 `src/lib/analytics.ts`가 콘솔 로그로 대체)

### EX-P2: AI Planning 결과 표시
- [x] `features/planning/hooks/usePlanningResult.ts` — TanStack Query `useQuery`로 AI Planning API 호출 (`planningId`가 있을 때만 활성화)
- [x] 로딩 상태 UI (`PlanningLoading`)
- [x] 단계별 Planning 결과 렌더링 (map 기반, `PlanningResultView`/`PlanningStepCard`), 각 단계에 행동 연결 정보(링크) 표시
- [x] `pages/PlanningPage.tsx` 실제 구현으로 교체
- [x] 이벤트 연결: `planning_result_viewed`
- [ ] 백엔드 `POST /planning`, `GET /planning/:id` 엔드포인트 필요 (현재 없어서 실제 API 호출은 실패 — 폼 UI/렌더링만 검증 완료)

---

## Phase 2 — Save Loop

**Loop**: Save Loop · **지표**: SP1, RP1, Save_LCP

### EX-S1: 저장 기능
- [x] Planning 결과 하단 고정 "플랜 저장하기" 버튼 (`SavePlanButton`)
- [x] 저장 전 맥락 메시지
- [x] 저장 완료 토스트 알림 (`src/store/toast.store.ts` + `components/ui/toast.tsx`, 전역 렌더링)
- [x] 비로그인 시 로그인 유도 모달 (`LoginRequiredModal`, `auth.store` 활용)
- [x] 이벤트 연결: `plan_saved`

### EX-S2: Saved 페이지
- [x] `features/save/components/` — 저장된 플랜 카드 목록(`SavedPlanCard`/`SavedPlanList`, 제목/저장일/목표 유형 태그, map 렌더링)
- [x] 카드 클릭 시 상세 페이지 이동 (`/saved/:id` 라우트 추가, `SavedPlanDetailPage`)
- [x] 진행 상태 표시 (완료 단계 수 / 전체 단계 수)
- [x] `pages/SavedPage.tsx` 실제 구현으로 교체
- [x] 이벤트 연결: `saved_plan_opened`
- [ ] 백엔드 `POST/GET /saved-plans`, `GET /saved-plans/:id` 엔드포인트 필요 (mock으로 프론트 플로우만 검증 완료)

---

## Phase 3 — Automation Loop

**Loop**: Automation Loop · **지표**: AP1, AP2, Automation_LCP

### EX-A1: 자동화 추천 컴포넌트
- [x] `src/constants/automationTypes.ts` — 자동화 유형 상수 정의 (알림 / 문서 정리 / 체크리스트)
- [x] 플랜 단계 내 자동화 가능 항목 인라인 표시 (`AutomationRecommendationList`, Saved 플랜 상세 페이지에 연결 — Automation Loop는 Save 이후 단계이므로 저장된 플랜 기준으로 배치)
- [x] 자동화 유형 선택 UI (`AutomationTypeSelector`)
- [x] 연결 확인 다이얼로그 (`ConnectAutomationDialog`)
- [x] 이벤트 연결: `automation_connected` (+ `automation_recommended_viewed`도 meta-okr 기준으로 추가 연결)

### EX-A2: 자동화 실행 기능
- [x] `features/automation/components/` — 연결된 자동화 목록(`AutomationList`/`AutomationListItem`, map 렌더링)
- [x] 원클릭 실행 버튼
- [x] 실행 상태 표시 (대기 / 실행 중 / 완료 / 실패, `AutomationStatusBadge`)
- [x] 실행 결과 피드백 (공용 토스트 재사용)
- [x] `pages/AutomationPage.tsx` 실제 구현으로 교체
- [x] 이벤트 연결: `automation_executed`, `automation_execution_succeeded`
- [ ] 백엔드 `POST /automations`, `GET /automations`, `POST /automations/:id/execute` 엔드포인트 필요 (mock으로 프론트 플로우만 검증 완료)

---

## 전체 진행 상황

Phase 0~3 프론트엔드 UI/상태관리 구현 완료. 모든 Phase 공통으로 **백엔드 엔드포인트가 아직 없어** 실제 API는 연결되지 않은 상태이며, 각 Phase는 mock 응답으로 화면 흐름만 검증했다. 다음 단계는 백엔드 API 개발과의 연동이다.

---

## 참고 문서

- `docs/problem-definition.md` — 문제 정의 및 지표
- `docs/execution-okr.md` — Phase별 상세 실행안
- `docs/strategic-okr.md` — Loop별 전략 목표
- `CLAUDE.md` — 코딩 규칙 (map 렌더링, 컴포넌트 분리, props 타입, constants 위치 등)
