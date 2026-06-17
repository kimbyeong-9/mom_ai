# Execution OKR — LifeFlow AI (Mom AI)

## 목적

Strategic OKR에 정의된 전략을 실제 기능 실험 단위로 전환한다.  
모든 기능은 어떤 Loop의 어떤 지표를 개선하기 위한 것인지 명시한다.

---

## Planning Loop 실행안

### EX-P1: Goal Input 폼 구현

- **Loop**: Planning Loop
- **지표**: GP1 (Goal Input → AI Planning 전환율)
- **기능**:
  - 자연어 목표 입력 텍스트 필드
  - 목표 유형 선택 (청년지원금 / 해외 / 취업 / 디지털 노마드)
  - 제출 버튼
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
  - 자동화 유형 선택 (알림 / 문서 정리 / 체크리스트)
  - 연결 확인 다이얼로그
- **성공 기준**: 자동화 연결율 40% 이상

### EX-A2: 자동화 실행 기능 구현

- **Loop**: Automation Loop
- **지표**: AP2 (Automation Connected → Automation Executed 전환율)
- **기능**:
  - Automation 페이지 — 연결된 자동화 목록
  - 원클릭 실행 버튼
  - 실행 상태 표시 (대기 / 실행 중 / 완료 / 실패)
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
