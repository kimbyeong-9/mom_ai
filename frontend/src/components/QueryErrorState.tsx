type QueryErrorStateProps = {
  message: string;
  onRetry: () => void;
};

export default function QueryErrorState({ message, onRetry }: QueryErrorStateProps) {
  return (
    <div className="flex flex-col items-start gap-2.5 rounded-2xl bg-white p-5 shadow-[0_2px_10px_rgba(31,61,46,0.05)]">
      <p className="text-[13px] text-[#93402A]">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="h-8 rounded-lg border border-[#1F3D2E]/15 px-3 text-[12.5px] font-semibold text-[#1F3D2E]"
      >
        다시 시도
      </button>
    </div>
  );
}
