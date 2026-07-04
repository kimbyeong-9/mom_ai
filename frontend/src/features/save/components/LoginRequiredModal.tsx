import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

type LoginRequiredModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function LoginRequiredModal({ open, onClose }: LoginRequiredModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-lg bg-background p-6 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-lg font-semibold">로그인이 필요해요</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          플랜을 저장하려면 먼저 로그인해주세요.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            취소
          </Button>
          <Button asChild>
            <Link to="/login">로그인하기</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
