import type { UseFormRegister } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <GoalTypeSelector value={goalType} onChange={onGoalTypeChange} />
      <Textarea
        rows={4}
        placeholder="어떤 준비를 하고 계신가요? 목표를 자유롭게 입력해주세요."
        {...register("goalText", { required: true })}
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "생성 중..." : "플랜 생성하기"}
      </Button>
    </form>
  );
}
