import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { DEFAULT_GOAL_TYPE, type GoalTypeId } from "@/constants/goalTypes";
import type { GoalInput } from "../types/planning.types";
import { useSubmitGoal } from "./useSubmitGoal";

const PLANNING_ID_STORAGE_KEY = "lastPlanningId";

export function useGoalInputForm() {
  const { register, handleSubmit, watch, setValue } = useForm<GoalInput>({
    defaultValues: { goalType: DEFAULT_GOAL_TYPE, goalText: "" },
  });
  const submitGoal = useSubmitGoal();
  const [planningId, setPlanningId] = useState<string | null>(() =>
    sessionStorage.getItem(PLANNING_ID_STORAGE_KEY)
  );

  useEffect(() => {
    if (submitGoal.data?.id) {
      setPlanningId(submitGoal.data.id);
      sessionStorage.setItem(PLANNING_ID_STORAGE_KEY, submitGoal.data.id);
    }
  }, [submitGoal.data?.id]);

  const onSubmit = handleSubmit((input) => {
    setPlanningId(null);
    submitGoal.mutate(input);
  });

  return {
    register,
    onSubmit,
    goalType: watch("goalType"),
    setGoalType: (goalType: GoalTypeId) => setValue("goalType", goalType),
    isSubmitting: submitGoal.isPending,
    planningId,
  };
}
