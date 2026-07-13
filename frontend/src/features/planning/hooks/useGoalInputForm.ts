import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { DEFAULT_GOAL_TYPE, getGoalType, type GoalTypeId } from "@/constants/goalTypes";
import type { GoalInput } from "../types/planning.types";
import { useSubmitGoal } from "./useSubmitGoal";

export function useGoalInputForm() {
  const { register, handleSubmit, watch, setValue, reset } = useForm<GoalInput>({
    defaultValues: { goalType: DEFAULT_GOAL_TYPE, goalText: "" },
  });
  const submitGoal = useSubmitGoal();
  const [planningId, setPlanningId] = useState<string | null>(null);

  useEffect(() => {
    if (submitGoal.data?.id) {
      setPlanningId(submitGoal.data.id);
    }
  }, [submitGoal.data?.id]);

  const onSubmit = handleSubmit((input) => {
    setPlanningId(null);
    submitGoal.mutate(input);
  });

  const onRegenerate = () => {
    setPlanningId(null);
    reset({ goalType: DEFAULT_GOAL_TYPE, goalText: "" });
  };

  return {
    register,
    onSubmit,
    onRegenerate,
    goalType: watch("goalType"),
    setGoalType: (goalType: GoalTypeId) => {
      setValue("goalType", goalType);
      setValue("goalText", getGoalType(goalType).sampleText);
    },
    isSubmitting: submitGoal.isPending,
    planningId,
  };
}
