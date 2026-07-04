import { Button } from "@/components/ui/button";

type ConnectAutomationDialogProps = {
  open: boolean;
  automationTypeLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConnectAutomationDialog({
  open,
  automationTypeLabel,
  onConfirm,
  onCancel,
}: ConnectAutomationDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-lg bg-background p-6 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-lg font-semibold">자동화를 연결할까요?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          "{automationTypeLabel}" 자동화가 이 단계에 연결됩니다.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>
            취소
          </Button>
          <Button onClick={onConfirm}>연결하기</Button>
        </div>
      </div>
    </div>
  );
}
