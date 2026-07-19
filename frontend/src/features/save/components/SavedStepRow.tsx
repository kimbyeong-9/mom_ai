type SavedStepRowProps = {
  order: number;
  title: string;
  status: "done" | "current" | "upcoming";
  automationConnected: boolean;
  isConnecting: boolean;
  onConnect: () => void;
};

export default function SavedStepRow({
  order,
  title,
  status,
  automationConnected,
  isConnecting,
  onConnect,
}: SavedStepRowProps) {
  if (status === "current") {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border-[1.5px] border-[#1F3D2E] bg-white p-4 shadow-[0_4px_14px_rgba(31,61,46,0.07)]">
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#1F3D2E] text-[10px] font-bold text-[#1F3D2E]">
            {order}
          </span>
          <span className="text-[13.5px] font-bold text-[#1F3D2E]">{title}</span>
        </div>

        {automationConnected ? (
          <div className="flex items-center gap-2 rounded-xl bg-[#B7CBAE]/20 px-3.5 py-2.5">
            <span className="size-1.5 shrink-0 rounded-full bg-[#2E7D4F]" />
            <span className="text-[12.5px] font-semibold text-[#1F3D2E]">
              자동화로 연결돼서 계속 찾아보고 있어요
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 rounded-xl bg-[#B7CBAE]/20 px-3.5 py-2.5">
            <span className="flex-1 text-[12.5px] font-semibold text-[#1F3D2E]">
              이 단계, 자동화로 연결해서 계속 찾아볼까요?
            </span>
            <button
              type="button"
              onClick={onConnect}
              disabled={isConnecting}
              className="shrink-0 rounded-full bg-[#1F3D2E] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#1a3325] disabled:opacity-50"
            >
              {isConnecting ? "연결 중..." : "연결"}
            </button>
          </div>
        )}
      </div>
    );
  }

  const isDone = status === "done";
  return (
    <div
      className={`flex items-start gap-2.5 rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(31,61,46,0.05)] ${
        isDone ? "opacity-55" : ""
      }`}
    >
      {isDone ? (
        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#1F3D2E] text-[9px] font-bold text-white">
          ✓
        </span>
      ) : (
        <span className="mt-0.5 size-5 shrink-0 rounded-full border-[1.5px] border-[#1F3D2E]/30" />
      )}
      <span
        className={`text-[13px] font-semibold ${isDone ? "text-[#1F3D2E]" : "text-[#1F3D2E]/60"}`}
      >
        {title}
      </span>
    </div>
  );
}
