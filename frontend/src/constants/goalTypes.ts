export const GOAL_TYPES = [
  { id: "youth", label: "청년 지원금" },
  { id: "abroad", label: "해외 준비" },
  { id: "job", label: "취업 준비" },
  { id: "nomad", label: "디지털 노마드" },
] as const;

export type GoalTypeId = (typeof GOAL_TYPES)[number]["id"];

export const DEFAULT_GOAL_TYPE: GoalTypeId = GOAL_TYPES[0].id;

export function getGoalTypeLabel(id: GoalTypeId): string {
  return GOAL_TYPES.find((type) => type.id === id)?.label ?? id;
}
