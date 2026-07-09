import type { UseFormRegister } from "react-hook-form";

import type { GoalTypeId } from "@/constants/goalTypes";
import type { GoalInput } from "../types/planning.types";
import GoalTypeSelector from "./GoalTypeSelector";

type GoalInputFormProps = {
  goalType: GoalTypeId;
  onGoalTypeChange: (id: GoalTypeId) => void;
  register: UseFormRegister<GoalInput>;
  onSubmit: (event: React.FormEvent) => void;
  isSubmitting: boolean;
};

export default function GoalInputForm({
  goalType,
  onGoalTypeChange,
  register,
  onSubmit,
  isSubmitting,
}: GoalInputFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 sm:gap-4">
      <GoalTypeSelector value={goalType} onChange={onGoalTypeChange} />

      <div>
        <label
          htmlFor="goalText"
          className="mb-2 hidden text-[13px] font-semibold text-[#1F3D2E] sm:block"
        >
          구체적으로 어떤 준비인가요?
        </label>
        <div className="flex flex-col gap-3 rounded-2xl border-[1.5px] border-[#1F3D2E]/[0.12] bg-white p-3.5 sm:flex-row sm:items-start sm:gap-3 sm:p-[14px_16px]">
          <textarea
            id="goalText"
            rows={2}
            placeholder="예: 다음 달에 청년내일저축계좌 신청하려고 해요"
            className="flex-1 resize-none bg-transparent text-[13.5px] text-[#1F3D2E] placeholder:text-[#1F3D2E]/40 focus:outline-none"
            {...register("goalText", { required: true })}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-[46px] shrink-0 items-center justify-center whitespace-nowrap rounded-xl bg-[#1F3D2E] px-5 text-[13.5px] font-semibold text-white transition-colors hover:bg-[#1a3325] disabled:opacity-50 sm:h-[38px]"
          >
            {isSubmitting ? "생성 중..." : "AI에게 물어보기"}
          </button>
        </div>
      </div>
    </form>
  );
}
