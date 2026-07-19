# Execution OKR — LifeFlow AI (Mom AI)

## 목적

Strategic OKR에 정의된 전략을 실제 기능 실험 단위로 전환한다.  
모든 기능은 어떤 Loop의 어떤 지표를 개선하기 위한 것인지 명시한다.

---

## Planning Loop 실행안

### EX-P1: Goal Input 마법사 구현

- **Loop**: Planning Loop
- **지표**: GP1 (Goal Input → AI Planning 전환율)
- **기능**: (2026-07 개정, `/start` 페이지로 구현 완료)
  - 8단계 구조화된 질문 마법사 (자유 텍스트 한 줄이 아닌, 고정 순서 단계별 선택)
    — 목표 형태 → 국가·지역(다중 선택, 전체 국가) → 직군 → 경력 → 목표 시점 → 비자·체류
    자격 → 언어 수준 → 근무 형태
  - 홈페이지에서 버티컬(해외취업/디지털노마드) 선택 시 1단계 자동 완료 후 2단계부터 진행
  - 이탈 후 재방문 시 localStorage 기반 이어하기(resume) 프롬프트
  - 제출 버튼(마지막 스텝 "결과 받기")
- **성공 기준**: Goal Input 제출률 70% 이상

### EX-P2: AI Planning 생성 및 결과 표시

- **Loop**: Planning Loop
- **지표**: GP2 (AI Planning → Result Viewed 전환율)
- **기능**:
  - AI Planning API 호출 및 로딩 상태 표시
  - 단계별 Planning 결과 렌더링
  - 각 단계에 행동 연결 정보 (링크, 서류, 기관) 표시
- **성공 기준**: Result Viewed 전환율 80% 이상

---

## Save Loop 실행안

### EX-S1: 저장 기능 구현

- **Loop**: Save Loop
- **지표**: SP1 (Result Viewed → Save 전환율)
- **기능**:
  - Planning 결과 하단 고정 "플랜 저장하기" 버튼
  - 저장 전 맥락 메시지 표시
  - 저장 완료 피드백 (토스트 알림)
  - 비로그인 시 로그인 유도 모달
- **성공 기준**: 저장 전환율 50% 이상

### EX-S2: Saved 페이지 구현

- **Loop**: Save Loop
- **지표**: RP1 (Save → Revisited 전환율)
- **기능**:
  - 저장된 플랜 카드 목록 (제목, 저장일, 목표 유형 태그)
  - 각 플랜 카드 클릭 시 상세 페이지 이동
  - 진행 상태 표시 (체크 완료 단계 수 / 전체 단계 수)
- **성공 기준**: 재진입율 60% 이상

---

## Automation Loop 실행안

### EX-A1: 자동화 추천 컴포넌트 구현

- **Loop**: Automation Loop
- **지표**: AP1 (Save → Automation Connected 전환율)
- **기능**:
  - 플랜 단계 내 자동화 가능 항목 인라인 표시
  - 자동화 유형 선택 — (2026-07 개정) 채용/원격구인 모니터링 · 비자·체류 마감일 리마인더 ·
    문서 정리 (우선순위 순, 결정로그 03 참고)
  - 연결 확인 다이얼로그
- **성공 기준**: 자동화 연결율 40% 이상

### EX-A2: 자동화 실행 기능 구현

- **Loop**: Automation Loop
- **지표**: AP2 (Automation Connected → Automation Executed 전환율)
- **기능**: (2026-07 개정 — 아직 미구현, n8n 연동 필요)
  - Automation 페이지 — 연결된 자동화 목록
  - 채용/원격구인 모니터링, 비자 마감일 리마인더는 n8n 워크플로우가 실제 폴링·발송을 담당
    (백엔드는 상태/이벤트만 소유, 웹훅 콜백으로 결과 수신)
  - 실행 상태 표시 — 1회성 완료가 아니라 "지속 실행 중" 상태와 마지막 확인 시각·매칭 건수 표시
  - 실행 결과 피드백
- **성공 기준**: 실행율 70% 이상

---

## 실행 우선순위

```
Phase 1 (Planning Loop)
  → EX-P1: Goal Input 폼
  → EX-P2: Planning 결과 표시

Phase 2 (Save Loop)
  → EX-S1: 저장 기능
  → EX-S2: Saved 페이지

Phase 3 (Automation Loop)
  → EX-A1: 자동화 추천
  → EX-A2: 자동화 실행
```

---

## 이벤트 연결 (Meta OKR 기준)

모든 기능 구현 시 아래 이벤트를 반드시 연결한다.

| 기능 | 이벤트 |
|------|--------|
| EX-P1 | `goal_input_submitted` |
| EX-P2 | `planning_result_viewed` |
| EX-S1 | `plan_saved` |
| EX-S2 | `saved_plan_opened` |
| EX-A1 | `automation_connected` |
| EX-A2 | `automation_executed`, `automation_execution_succeeded` |
