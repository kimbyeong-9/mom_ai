export const SERVICE_VERTICALS = [
  {
    id: "abroad-job",
    label: "해외 취업",
    icon: "🧳",
    iconBg: "#1F3D2E",
    iconColor: "#FFFFFF",
    description: "정식으로 채용되고 싶어요",
  },
  {
    id: "nomad",
    label: "디지털 노마드",
    icon: "💻",
    iconBg: "#F0D6C4",
    iconColor: "#8A5A3A",
    description: "원격으로 옮겨다니고 싶어요",
  },
] as const;

export type ServiceVerticalId = (typeof SERVICE_VERTICALS)[number]["id"];
