import { formatDate } from "@/lib/utils";
import type { Automation } from "../types/automation.types";

export function formatAutomationResult(automation: Automation): string {
  if (!automation.result) {
    return "완료되었어요.";
  }

  if (automation.type === "document" && "documents" in automation.result) {
    const { documents } = automation.result;
    return documents.length > 0
      ? `필요 서류: ${documents.join(", ")}`
      : "본문에서 필요 서류를 찾지 못했어요. 직접 확인해주세요.";
  }

  if (automation.type === "notification" && "scheduledFor" in automation.result) {
    const { scheduledFor, source } = automation.result;
    const date = formatDate(scheduledFor, ".");
    return source === "deadline"
      ? `${date} 마감일에 맞춰 알림이 예정되어 있어요.`
      : `${date}에 알림이 예정되어 있어요.`;
  }

  return "완료되었어요.";
}
