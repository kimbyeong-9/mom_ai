import { Link2, Sparkles, Target } from "lucide-react";

const HOW_IT_WORKS = [
  { icon: Target, title: "목표 입력", description: "지금 준비하고 있는 걸 편하게 적어주세요" },
  { icon: Sparkles, title: "AI가 정리", description: "실행 가능한 단계별 절차로 만들어드려요" },
  { icon: Link2, title: "저장 & 자동화", description: "플랜을 저장하고 자동화까지 연결해요" },
];

export default function PlanningEmptyState() {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_2px_10px_rgba(31,61,46,0.05)] sm:rounded-[18px] sm:p-7">
      <div className="mb-5 flex flex-col items-center gap-2 text-center sm:mb-6">
        <span className="flex size-11 items-center justify-center rounded-full bg-[#B7CBAE]/25 text-[#1F3D2E] sm:size-12">
          <Sparkles className="size-5" />
        </span>
        <p className="text-[14px] font-bold text-[#1F3D2E] sm:text-[15px]">아직 만든 플랜이 없어요</p>
        <p className="text-[12.5px] text-[#1F3D2E]/50 sm:text-[13px]">
          위에 목표를 입력하면 AI가 실행 가능한 절차로 만들어드려요
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {HOW_IT_WORKS.map((step, index) => (
          <div
            key={step.title}
            className="flex items-start gap-3 rounded-xl bg-[#F5F1E6]/60 p-3.5 sm:flex-col sm:gap-2 sm:p-4"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-[#1F3D2E] shadow-[0_1px_4px_rgba(31,61,46,0.08)]">
              <step.icon className="size-4" />
            </span>
            <div>
              <p className="text-[12.5px] font-bold text-[#1F3D2E] sm:text-[13px]">
                {index + 1}. {step.title}
              </p>
              <p className="mt-0.5 text-[11.5px] text-[#1F3D2E]/50 sm:text-[12px]">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
