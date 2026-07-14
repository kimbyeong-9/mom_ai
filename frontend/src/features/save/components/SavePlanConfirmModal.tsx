type SavePlanConfirmModalProps = {
  open: boolean;
  isSaving: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function SavePlanConfirmModal({
  open,
  isSaving,
  onCancel,
  onConfirm,
}: SavePlanConfirmModalProps) {
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
        <h2 className="text-[16px] font-bold text-[#1F3D2E]">이 플랜을 저장할까요?</h2>
        <p className="mt-2 text-[13px] text-[#1F3D2E]/55">
          내 플랜에 저장하면 언제든 다시 확인하고 자동화를 연결할 수 있어요.
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
            disabled={isSaving}
            className="h-10 rounded-xl bg-[#1F3D2E] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#1a3325] disabled:opacity-50"
          >
            {isSaving ? "저장 중..." : "저장하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
