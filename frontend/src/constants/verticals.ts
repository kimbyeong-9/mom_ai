export const SERVICE_VERTICALS = [
  {
    id: "abroad-job",
    label: "해외 취업",
    icon: "🧳",
    gradientFrom: "#1F3D2E",
    gradientTo: "#2E5340",
    description:
      "현지·해외 기업에 정식으로 채용되고 싶어요. 비자 스폰서 기업, 채용공고 모니터링, 이력서 준비까지 이어드려요.",
    tags: ["비자 스폰서 매칭", "채용공고 모니터링"],
    tagBg: "rgba(183,203,174,0.25)",
    tagColor: "#1F3D2E",
    ctaLabel: "해외 취업 준비하기",
    variant: "primary",
  },
  {
    id: "nomad",
    label: "디지털 노마드",
    icon: "💻",
    gradientFrom: "#8A5A3A",
    gradientTo: "#B07A52",
    description:
      "원격으로 일하며 여러 나라를 옮겨다니고 싶어요. 노마드 비자, 체류 요건, 소득 증빙까지 확인해드려요.",
    tags: ["노마드 비자", "체류·소득 요건"],
    tagBg: "#F0D6C4",
    tagColor: "#8A5A3A",
    ctaLabel: "노마드 준비하기",
    variant: "secondary",
  },
] as const;

export type ServiceVerticalId = (typeof SERVICE_VERTICALS)[number]["id"];
