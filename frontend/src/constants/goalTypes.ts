export const GOAL_TYPES = [
  {
    id: "youth",
    label: "청년 지원금",
    cardLabel: "청년지원금 준비",
    icon: "청",
    iconBg: "#B7CBAE",
    iconColor: "#1F3D2E",
  },
  {
    id: "abroad",
    label: "해외 준비",
    cardLabel: "해외 준비",
    icon: "해",
    iconBg: "#F0D6C4",
    iconColor: "#8A5A3A",
  },
  {
    id: "job",
    label: "취업 준비",
    cardLabel: "취업 준비",
    icon: "취",
    iconBg: "#1F3D2E",
    iconColor: "#FFFFFF",
  },
  {
    id: "nomad",
    label: "디지털 노마드",
    cardLabel: "디지털노마드 준비",
    icon: "노",
    iconBg: "#E3DDC8",
    iconColor: "#1F3D2E",
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
