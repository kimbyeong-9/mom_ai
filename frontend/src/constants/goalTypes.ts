export const GOAL_TYPES = [
  {
    id: "abroad",
    label: "해외 취업",
    iconBg: "#1F3D2E",
    iconColor: "#FFFFFF",
  },
  {
    id: "nomad",
    label: "디지털 노마드",
    iconBg: "#F0D6C4",
    iconColor: "#8A5A3A",
  },
] as const;

export type GoalTypeId = (typeof GOAL_TYPES)[number]["id"];

export function getGoalTypeLabel(id: GoalTypeId): string {
  return GOAL_TYPES.find((type) => type.id === id)?.label ?? id;
}

export function getGoalType(id: GoalTypeId) {
  return GOAL_TYPES.find((type) => type.id === id) ?? GOAL_TYPES[0];
}
