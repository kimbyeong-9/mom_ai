# 문제정의서 — LifeFlow AI (Mom AI)

## 프로젝트 개요

Mom AI(LifeFlow AI)는 사용자가 복잡한 생활 준비 과정을 반복 탐색하지 않고  
실제 행동까지 연결할 수 있도록 지원하는 AI Agent 플랫폼이다.

### 주요 대상

- **해외 취업** — 현지·해외 기업에 정식으로 채용되고 싶은 사람
- **디지털 노마드** — 원격으로 일하며 여러 나라를 옮겨다니고 싶은 사람

> (2026-07 기준) 원래 청년지원금/일반 해외준비/일반 취업준비까지 4개 목표 유형을 범용으로
> 다뤘으나, "얕고 일반적인 AI 챗봇"처럼 느껴진다는 문제로 위 2개 버티컬로 좁혔다.
> 이유: 두 버티컬은 "많은 사람이 꿈꾸지만 어떻게 시작해야 할지 막막한 목표"라는 공통점이 있고,
> 실제 행동(비자 요건, 채용 플랫폼, 서류 준비)까지 연결할 수 있는 영역이라 데이터를
> 큐레이션하기에도 현실적으로 좁혀졌기 때문이다. 자세한 배경은 `decision-log-01-planning-loop.md`
> 참고.

### 핵심 목표

단순 정보 제공이 아니라 사용자의 준비 과정을 실제 행동으로 연결하는 것.
특히 "AI가 그럴듯한 답을 생성"하는 게 아니라 "실제로 확인하고 찾아준다"는 신뢰를 주는 것이
해외취업/디지털노마드 두 버티컬에서는 핵심 차별점이다.

---

## 사용자 문제 정의

### 핵심 문제

사용자는 목표(Goal)를 가지고 있지만 다음 문제를 반복 경험한다.

1. **탐색 피로** — 같은 정보를 여러 번 탐색해야 한다
2. **행동 단절** — 정보를 얻어도 실제 행동으로 이어지지 않는다
3. **저장 소실** — 한 번 찾은 정보를 저장하지 않아 다시 찾아야 한다
4. **자동화 공백** — 반복 행동을 자동화할 수단이 없다

---

## 핵심 행동 구조

### Total Loop

```
Goal Input
→ Planning Loop
→ Save Loop
→ Automation Loop
→ Revisited
```

### Planning Loop

```
Goal Input
→ AI Planning
→ Result Viewed
```

> 사용자가 목표를 입력하면 AI가 준비 절차를 생성하고 사용자가 결과를 확인한다.

### Save Loop

```
Result Viewed
→ Save
→ Revisited
```

> 사용자가 결과를 자산화하여 나중에 다시 진입할 수 있도록 한다.

### Automation Loop

```
Save
→ Automation Connected
→ Automation Executed
```

> 저장된 플랜에서 반복 행동을 자동화로 연결한다.

---

## 핵심 지표 정의

### 전환율 지표

| 지표 | 정의 |
|------|------|
| GP1 | Goal Input → AI Planning 전환율 |
| GP2 | AI Planning → Result Viewed 전환율 |
| SP1 | Result Viewed → Save 전환율 |
| RP1 | Save → Revisited 전환율 |
| AP1 | Save → Automation Connected 전환율 |
| AP2 | Automation Connected → Automation Executed 전환율 |

### Loop 완료율 지표

| 지표 | 정의 |
|------|------|
| Planning_LCP | Planning Loop 완료율 (GP1 × GP2) |
| Save_LCP | Save Loop 완료율 (SP1) |
| Automation_LCP | Automation Loop 완료율 (AP1 × AP2) |
| Total_LCP | Total Loop 완료율 (Planning_LCP × Save_LCP × Automation_LCP) |

### 재진입 지표

| 지표 | 정의 |
|------|------|
| ReSearch_R | 동일 Goal을 다시 탐색하는 비율 (낮을수록 좋음) |

---

## 루프 구조 정의

각 Loop는 독립적으로 측정 가능하며, 순서대로 전환이 이루어진다.

```
[Planning Loop]  GP1 → GP2 → Planning_LCP
       ↓
[Save Loop]      SP1 → RP1 → Save_LCP
       ↓
[Automation Loop] AP1 → AP2 → Automation_LCP
       ↓
[Total Loop]     Total_LCP
```

ReSearch_R는 Total Loop가 완료되지 않았을 때 반복 탐색이 발생함을 나타낸다.
