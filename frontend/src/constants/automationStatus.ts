import type { AutomationStatus } from "@/features/automation/types/automation.types";

export const AUTOMATION_STATUS_META: Record<
  AutomationStatus,
  {
    label: string;
    bg: string;
    color: string;
    buttonLabel: string;
    buttonVariant: "primary" | "ghost";
    isActionable: boolean;
  }
> = {
  pending: {
    label: "대기",
    bg: "#EDEAE0",
    color: "rgba(31,61,46,0.55)",
    buttonLabel: "실행",
    buttonVariant: "primary",
    isActionable: true,
  },
  running: {
    label: "실행중",
    bg: "#F0D6C4",
    color: "#8A5A3A",
    buttonLabel: "진행 보기",
    buttonVariant: "ghost",
    isActionable: false,
  },
  succeeded: {
    label: "완료",
    bg: "#B7CBAE",
    color: "#1F3D2E",
    buttonLabel: "결과 보기",
    buttonVariant: "ghost",
    isActionable: false,
  },
  failed: {
    label: "실패",
    bg: "#E3BBA8",
    color: "#93402A",
    buttonLabel: "재시도",
    buttonVariant: "primary",
    isActionable: true,
  },
};

export function getAutomationStatusMeta(status: AutomationStatus) {
  return AUTOMATION_STATUS_META[status];
}
