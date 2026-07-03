# 프론트엔드 작업 순서 — LifeFlow AI (Mom AI)

`frontend/` 폴더 기준 작업 목록이다. `execution-okr.md`의 Phase 우선순위(Planning → Save → Automation)를 따르되, 각 Phase에 앞서 공통 기초 설정을 먼저 마친다.

백엔드 API 개발은 이 문서 범위 밖이다. Planning/Save/Automation 각 Phase의 API 연동 작업은 대응하는 백엔드 엔드포인트가 준비되어야 실제로 동작한다.

---

## Phase 0 — 공통 기초 설정 (선행 작업)

- [x] `tsconfig.app.json`의 `baseUrl` 제거 (TS5101 빌드 에러 수정 완료)
- [ ] `src/api/axios.ts` — Axios 인스턴스 생성 (baseURL, interceptor)
- [ ] `.env` — API base URL 등 환경변수 설정
- [ ] `src/store/auth.store.ts` — Zustand 인증 스토어 구현
- [ ] `App.tsx` / `App.css` — 미사용 파일 정리 (main.tsx가 RouterProvider를 직접 렌더링하므로 죽은 코드)

---

## Phase 1 — Planning Loop

**Loop**: Planning Loop · **지표**: GP1, GP2, Planning_LCP

### EX-P1: Goal Input 폼
- [ ] `src/constants/goalTypes.ts` — 목표 유형 상수 정의 (청년지원금 / 해외 / 취업 / 디지털 노마드)
- [ ] `features/planning/components/` — 자연어 목표 입력 필드, 목표 유형 선택 카드(map 렌더링), 제출 버튼
- [ ] `features/planning/hooks/` — React Hook Form 기반 폼 훅
- [ ] 이벤트 연결: `goal_input_submitted`

### EX-P2: AI Planning 결과 표시
- [ ] `features/planning/hooks/usePlanningResult.ts` — TanStack Query `useQuery`로 AI Planning API 호출
- [ ] 로딩 상태 UI
- [ ] 단계별 Planning 결과 렌더링 (map 기반), 각 단계에 행동 연결 정보(링크/서류/기관) 표시
- [ ] `pages/PlanningPage.tsx` 실제 구현으로 교체
- [ ] 이벤트 연결: `planning_result_viewed`

---

## Phase 2 — Save Loop

**Loop**: Save Loop · **지표**: SP1, RP1, Save_LCP

### EX-S1: 저장 기능
- [ ] Planning 결과 하단 고정 "플랜 저장하기" 버튼
- [ ] 저장 전 맥락 메시지
- [ ] 저장 완료 토스트 알림
- [ ] 비로그인 시 로그인 유도 모달 (`auth.store` 활용)
- [ ] 이벤트 연결: `plan_saved`

### EX-S2: Saved 페이지
- [ ] `features/save/components/` — 저장된 플랜 카드 목록(제목/저장일/목표 유형 태그, map 렌더링)
- [ ] 카드 클릭 시 상세 페이지 이동
- [ ] 진행 상태 표시 (완료 단계 수 / 전체 단계 수)
- [ ] `pages/SavedPage.tsx` 실제 구현으로 교체
- [ ] 이벤트 연결: `saved_plan_opened`

---

## Phase 3 — Automation Loop

**Loop**: Automation Loop · **지표**: AP1, AP2, Automation_LCP

### EX-A1: 자동화 추천 컴포넌트
- [ ] `src/constants/automationTypes.ts` — 자동화 유형 상수 정의 (알림 / 문서 정리 / 체크리스트)
- [ ] 플랜 단계 내 자동화 가능 항목 인라인 표시
- [ ] 자동화 유형 선택 UI
- [ ] 연결 확인 다이얼로그
- [ ] 이벤트 연결: `automation_connected`

### EX-A2: 자동화 실행 기능
- [ ] `features/automation/components/` — 연결된 자동화 목록(map 렌더링)
- [ ] 원클릭 실행 버튼
- [ ] 실행 상태 표시 (대기 / 실행 중 / 완료 / 실패)
- [ ] 실행 결과 피드백
- [ ] `pages/AutomationPage.tsx` 실제 구현으로 교체
- [ ] 이벤트 연결: `automation_executed`, `automation_execution_succeeded`

---

## 참고 문서

- `docs/problem-definition.md` — 문제 정의 및 지표
- `docs/execution-okr.md` — Phase별 상세 실행안
- `docs/strategic-okr.md` — Loop별 전략 목표
- `CLAUDE.md` — 코딩 규칙 (map 렌더링, 컴포넌트 분리, props 타입, constants 위치 등)
