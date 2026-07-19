type WizardResumePromptProps = {
  stepIndex: number;
  totalSteps: number;
  contextLabel: string;
  onResume: () => void;
  onRestart: () => void;
};

export default function WizardResumePrompt({
  stepIndex,
  totalSteps,
  contextLabel,
  onResume,
  onRestart,
}: WizardResumePromptProps) {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-5 overflow-hidden px-8 py-16 text-center">
      <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-[#B7CBAE] opacity-30" />
      <div className="flex size-14 items-center justify-center rounded-full bg-[#B7CBAE]/30 text-[22px] font-bold text-[#1F3D2E]">
        {stepIndex}/{totalSteps}
      </div>
      <p className="text-xl font-extrabold leading-snug text-[#1F3D2E]">
        {contextLabel}, 이어서
        <br />
        마무리해볼까요?
      </p>
      <p className="text-[13.5px] font-medium leading-relaxed text-[#1F3D2E]/55">
        {totalSteps - stepIndex}개 질문이면 끝나요. 지금까지 답변은 그대로 저장돼 있어요.
      </p>
      <button
        type="button"
        onClick={onResume}
        className="mt-2 flex h-[52px] w-full max-w-xs items-center justify-center rounded-2xl bg-[#1F3D2E] text-sm font-semibold text-white transition-colors hover:bg-[#1a3325]"
      >
        이어서 진행하기
      </button>
      <button
        type="button"
        onClick={onRestart}
        className="text-xs font-semibold text-[#1F3D2E]/40"
      >
        새로 시작할게요
      </button>
    </div>
  );
}
