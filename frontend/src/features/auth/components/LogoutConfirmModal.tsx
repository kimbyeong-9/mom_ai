type LogoutConfirmModalProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function LogoutConfirmModal({ open, onCancel, onConfirm }: LogoutConfirmModalProps) {
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
        <h2 className="text-[16px] font-bold text-[#1F3D2E]">로그아웃할까요?</h2>
        <p className="mt-2 text-[13px] text-[#1F3D2E]/55">
          다시 로그인하면 저장된 플랜과 자동화를 그대로 이어서 사용할 수 있어요.
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
            className="h-10 rounded-xl bg-[#1F3D2E] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#1a3325]"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
