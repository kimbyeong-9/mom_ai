# 프론트엔드 작업 순서 — LifeFlow AI (Mom AI)

`frontend/` 폴더 기준 작업 목록이다. `execution-okr.md`의 Phase 우선순위(Planning → Save → Automation)를 따르되, 각 Phase에 앞서 공통 기초 설정을 먼저 마친다.

> **2026-07-20 개정**: 청년지원금/해외/취업/디지털노마드 4개 목표 유형을 다루던 범용 서비스에서
> **해외취업 + 디지털노마드** 2개 버티컬로 범위를 좁혔다. Phase 0~3(아래)은 그 이전에 완료된
> 기초 작업이며 여전히 유효하다. 피벗 이후 실제로 무엇이 바뀌었는지는 맨 아래 **Phase 4**를 본다.

---

## Phase 0 — 공통 기초 설정 (선행 작업)

- [x] `tsconfig.app.json`의 `baseUrl` 제거 (TS5101 빌드 에러 수정 완료)
- [x] `src/api/axios.ts` — Axios 인스턴스 생성 (baseURL, interceptor, 401 시 auto logout)
- [x] `.env` — `VITE_API_BASE_URL` 설정
- [x] `src/store/auth.store.ts` — Zustand 인증 스토어 구현 (persist 미들웨어 적용)
- [x] `App.tsx` / `App.css` — 미사용 파일 삭제 완료

---

## Phase 1 — Planning Loop (초기 버전, Phase 4에서 대체됨)

**Loop**: Planning Loop · **지표**: GP1, GP2, Planning_LCP

- [x] 자연어 목표 입력 + 목표 유형(4종) 선택 폼 — **Phase 4에서 8단계 마법사로 교체, 관련
      컴포넌트(`GoalInputForm`/`GoalTypeSelector`/`GoalTypeCard`/`useGoalInputForm`) 삭제됨**
- [x] Planning 결과 렌더링, 백엔드 `POST /planning` / `GET /planning/:id` 연동 완료
- [x] 이벤트 연결: `goal_input_submitted`, `planning_result_viewed`

---

## Phase 2 — Save Loop

**Loop**: Save Loop · **지표**: SP1, RP1, Save_LCP

### EX-S1: 저장 기능
- [x] Planning 결과 하단 고정 "플랜 저장하기" 버튼 (`SavePlanButton`)
- [x] 저장 전 맥락 메시지
- [x] 저장 완료 토스트 알림 (`src/store/toast.store.ts` + `components/ui/toast.tsx`, 전역 렌더링)
- [x] 비로그인 시 로그인 유도 모달 (`LoginRequiredModal`, `auth.store` 활용)
- [x] 이벤트 연결: `plan_saved`
- [x] 백엔드 `POST/GET /saved-plans`, `GET /saved-plans/:id` 연동 완료

### EX-S2: Saved 페이지
- [x] `features/save/components/` — 저장된 플랜 카드 목록(`SavedPlanCard`/`SavedPlanList`, 제목/저장일/목표 유형 태그, map 렌더링)
- [x] 카드 클릭 시 상세 페이지 이동 (`/saved/:id` 라우트, `SavedPlanDetailPage`)
- [x] 진행 상태 표시 (완료 단계 수 / 전체 단계 수)
- [x] 이벤트 연결: `saved_plan_opened`

---

## Phase 3 — Automation Loop (기초 버전, Phase 4에서 실제화 예정)

**Loop**: Automation Loop · **지표**: AP1, AP2, Automation_LCP

- [x] 자동화 유형(알림/문서정리/체크리스트) 선택 UI, 연결 확인 다이얼로그
- [x] Automation 페이지 — 연결된 자동화 목록, 원클릭 실행 버튼, 실행 상태 배지
- [x] 백엔드 `POST /automations`, `GET /automations`, `POST /automations/:id/execute` 연동 완료
- [x] 이벤트 연결: `automation_connected`, `automation_executed`, `automation_execution_succeeded`
- [ ] **실제로는 전부 즉시 계산되는 가짜 로직** (외부 세계와 실제 상호작용 없음) — 결정로그 03의
      2026-07 개정에 따라 n8n 연동으로 실제화 필요 (Phase 4 이후 작업)

---

## Phase 4 — 해외취업/디지털노마드 피벗 (2026-07)

**배경**: `problem-definition.md` / `decision-log-01-planning-loop.md` 참고.

### 완료
- [x] 홈페이지를 해외취업/디지털노마드 2개 버티컬 선택 화면으로 리디자인
      (`VerticalSelectCard`, `constants/verticals.ts`)
- [x] Goal Input을 8단계 구조화된 질문 마법사로 교체, `/start`(사이드바 없는 독립 라우트)에 배치
      (`features/planning/components/wizard/`, `hooks/useGoalWizard.ts`)
      - 전체 국가 목록은 ISO 3166-1 코드 + `Intl.DisplayNames`로 생성 (하드코딩 아님, 정확성 보장)
      - localStorage 기반 이어하기(resume) 지원
- [x] Planning 결과 화면을 `/planning`(사이드바 있음)으로 분리 — 마법사 제출 후 이동
      - 로딩 화면: 신뢰감 있는 진행 체크리스트, 단 **지어낸 숫자(스캔 건수 등) 없이 정직하게** 구성
      - 결과 화면: 마법사 답변 기반 태그(국가/직군/근무형태) 표시, AI가 실제로 준
        `actionLabel`/`actionUrl`이 있을 때만 링크 버튼 노출

### 완료 (2026-07-22 기준)
- [x] **AI 그라운딩**: Tavily Search API + Gemini RAG 구조로 실제 검색 결과 기반 플랜 생성
      완료. 초기엔 결과 관련성이 낮았으나(도메인 필터가 `kr.indeed.com` 같은 한국어 서브도메인까지
      허용, 쿼리도 한국어라 영어권 채용 사이트와 매칭 안 됨) 도메인 필터 정교화 + 영어 쿼리 변환으로
      해결 — 라이브 검증 결과 15/15 결과가 실제 채용공고로 확인됨 (`search-query.util.ts`)
- [x] 백엔드 `goalTypes`를 4종에서 2종(해외취업/노마드)으로 정리 완료
- [x] Automation Loop n8n 연동 완료 — 채용/원격구인 모니터링 자동화가 지속 실행되며 실제 매칭
      건수·최근 확인 시각 표시 (`AutomationLiveMonitorCard`). 단, 결정로그 03이 원래 계획한
      "n8n이 폴링·검색을 담당하고 웹훅으로 결과 콜백" 구조 대신, **n8n은 스케줄 트리거 역할만
      하고 검색·중복 제거·매칭 계산은 전부 NestJS 안에 유지**하는 쪽으로 변경 — 테스트/유지보수
      용이성 때문 (자세한 내용은 결정로그 03 개정 참고)
- [x] 포트폴리오용 스크린샷 4장 README에 추가 완료 (홈/위저드/플랜결과/로그인모달, 헤드리스
      Chrome으로 실제 실행 중인 앱 캡처)
- [x] 백엔드(`search-query.util.ts`) + 프론트(`useGoalWizard.ts`의 `getEffectiveSteps` 등)
      핵심 로직 테스트 코드 추가 — 이번 세션에서 실제로 버그가 났던 두 곳. 프론트는 테스트
      러너가 아예 없었어서 Vitest를 새로 세팅함
- [x] 저장 플랜 진행 상태를 카운터(`completedSteps: number`)에서 개별 완료 플래그
      (`completedStepIds: string[]`)로 전환 — 기존 카운터는 애초에 UI에서 호출하는 곳이
      없어 항상 0에 고정돼 있던 죽은 기능이었음. `PATCH /saved-plans/steps/:stepId/toggle`
      추가로 실제 클릭 토글 UI까지 연결
- [x] 비자·체류 마감일 리마인더 실제 발송 — n8n이 매일
      `POST /internal/automation-checks/deadline-reminders` 호출 → 라벨에서 추출한 날짜가
      D-7/D-1/D-0일 때 Gmail SMTP(Nodemailer)로 실제 이메일 발송. Resend를 먼저 검토했으나
      실제 수신자 발송에 도메인 인증이 필요해 Gmail 앱 비밀번호 방식으로 전환. 실제 계정으로
      라이브 발송 테스트 완료, `sentReminderMilestones`로 중복 발송 방지 확인함

### 미완료 — 다음 작업 후보
- [ ] Saved/Automation 페이지를 좁혀진 2개 버티컬 기준으로 재디자인 — 현재도 범용적으로 잘
      동작하고 있어 긴급하지 않음
- [ ] Automation 재검색 시 도메인 필터가 두 버티컬(해외취업/노마드) 통합 목록 하나로 고정됨 —
      국가별/버티컬별로 나누면 더 정밀해지겠지만 사소한 개선
- [ ] Saved/Automation 페이지 스크린샷 — 로그인 세션이 필요해서 자동 캡처 못 함, 수동 필요
- [ ] 푸시 알림(브라우저) — 지금은 이메일만, 앱을 안 열어도 도달하는 채널 추가

---

## 참고 문서

- `docs/problem-definition.md` — 문제 정의 및 지표, 피벗 배경
- `docs/execution-okr.md` — Phase별 상세 실행안
- `docs/strategic-okr.md` — Loop별 전략 목표
- `docs/decision-log-01-planning-loop.md`, `-03-automation-loop.md` — 피벗 관련 결정 변경 상세
- `CLAUDE.md` — 코딩 규칙 (map 렌더링, 컴포넌트 분리, props 타입, constants 위치 등)
