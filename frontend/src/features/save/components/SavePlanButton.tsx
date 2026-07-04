import { Button } from "@/components/ui/button";

type SavePlanButtonProps = {
  onSave: () => void;
  isSaving: boolean;
};

export default function SavePlanButton({ onSave, isSaving }: SavePlanButtonProps) {
  return (
    <div className="sticky bottom-0 flex flex-col gap-2 border-t border-border bg-background/95 p-4 backdrop-blur">
      <p className="text-xs text-muted-foreground">
        이 플랜을 저장하면 언제든 다시 찾아볼 수 있어요.
      </p>
      <Button onClick={onSave} disabled={isSaving}>
        {isSaving ? "저장 중..." : "플랜 저장하기"}
      </Button>
    </div>
  );
}
