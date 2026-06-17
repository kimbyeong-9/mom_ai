# Meta OKR — LifeFlow AI (Mom AI)

## 목적

사용자의 준비 행동을 관측 가능한 상태로 만드는 것.

모든 Loop(Planning / Save / Automation)의 전환 데이터를 수집하고  
행동 전이율을 측정 가능한 지표로 정의한다.

---

## Objective

> 사용자의 모든 준비 행동을 데이터로 관측할 수 있게 한다.

---

## Key Results

| KR | 내용 | 목표 |
|----|------|------|
| KR1 | 핵심 이벤트 정의 및 수집 완료 | 전체 Loop 이벤트 100% 커버 |
| KR2 | Loop별 전환율 대시보드 구축 | GP1, GP2, SP1, RP1, AP1, AP2 실시간 관측 |
| KR3 | ReSearch_R 측정 체계 수립 | 동일 Goal 재탐색 비율 관측 |
| KR4 | Total_LCP 기준선 측정 | MVP 출시 후 2주 이내 기준선 수립 |

---

## 이벤트 정의

### Planning Loop 이벤트

| 이벤트 | 트리거 시점 |
|--------|-------------|
| `goal_input_started` | 목표 입력 폼 포커스 |
| `goal_input_submitted` | 목표 입력 제출 (GP1 분자) |
| `planning_generated` | AI Planning 생성 완료 |
| `planning_result_viewed` | Planning 결과 화면 진입 (GP2 분자) |

### Save Loop 이벤트

| 이벤트 | 트리거 시점 |
|--------|-------------|
| `save_button_clicked` | 저장 버튼 클릭 |
| `plan_saved` | 저장 완료 (SP1 분자) |
| `saved_plan_opened` | 저장된 플랜 재진입 (RP1 분자) |

### Automation Loop 이벤트

| 이벤트 | 트리거 시점 |
|--------|-------------|
| `automation_recommended_viewed` | 자동화 추천 노출 |
| `automation_connected` | 자동화 연결 완료 (AP1 분자) |
| `automation_executed` | 자동화 실행 (AP2 분자) |
| `automation_execution_succeeded` | 자동화 실행 성공 |

---

## 전이율 관측 구조

```
goal_input_submitted        → GP1 측정
planning_result_viewed      → GP2 측정
plan_saved                  → SP1 측정
saved_plan_opened           → RP1 측정
automation_connected        → AP1 측정
automation_executed         → AP2 측정
```

---

## 루프 관측 공식

```
Planning_LCP = GP1 × GP2
Save_LCP     = SP1
Automation_LCP = AP1 × AP2
Total_LCP    = Planning_LCP × Save_LCP × Automation_LCP
ReSearch_R   = 동일 사용자 동일 Goal 재입력 수 / 전체 Goal 입력 수
```
