export const GOAL_TYPES = [
  {
    id: "youth",
    label: "청년 지원금",
    icon: "청",
    iconBg: "#B7CBAE",
    iconColor: "#1F3D2E",
    sampleText: "다음 달에 청년내일저축계좌 신청하려고 해요",
  },
  {
    id: "abroad",
    label: "해외 준비",
    icon: "해",
    iconBg: "#F0D6C4",
    iconColor: "#8A5A3A",
    sampleText: "다음 학기에 교환학생으로 해외에 나가려고 해요",
  },
  {
    id: "job",
    label: "취업 준비",
    icon: "취",
    iconBg: "#1F3D2E",
    iconColor: "#FFFFFF",
    sampleText: "이번 달에 첫 이직을 준비하려고 해요",
  },
  {
    id: "nomad",
    label: "디지털 노마드",
    icon: "노",
    iconBg: "#E3DDC8",
    iconColor: "#1F3D2E",
    sampleText: "내년에 디지털 노마드로 해외에서 일하려고 해요",
  },
] as const;

export type GoalTypeId = (typeof GOAL_TYPES)[number]["id"];

export const DEFAULT_GOAL_TYPE: GoalTypeId = GOAL_TYPES[0].id;

export function getGoalTypeLabel(id: GoalTypeId): string {
  return GOAL_TYPES.find((type) => type.id === id)?.label ?? id;
}

export function getGoalType(id: GoalTypeId) {
  return GOAL_TYPES.find((type) => type.id === id) ?? GOAL_TYPES[0];
}
