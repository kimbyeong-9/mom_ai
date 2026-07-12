type DeleteAccountModalProps = {
  open: boolean;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteAccountModal({
  open,
  isDeleting,
  onCancel,
  onConfirm,
}: DeleteAccountModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-[16px] font-bold text-[#1F3D2E]">정말 계정을 삭제할까요?</h2>
        <p className="mt-2 text-[13px] text-[#1F3D2E]/55">
          저장된 플랜, 연결된 자동화가 모두 삭제되며 되돌릴 수 없어요.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 rounded-xl px-4 text-[13px] font-semibold text-[#1F3D2E]/60 hover:bg-[#1F3D2E]/5"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="h-10 rounded-xl bg-[#93402A] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#7c3522] disabled:opacity-50"
          >
            {isDeleting ? "삭제 중..." : "삭제하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
