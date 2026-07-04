import { getGoalTypeLabel } from "@/constants/goalTypes";
import type { SavedPlanSummary } from "../types/save.types";
import SavedPlanCard from "./SavedPlanCard";

type SavedPlanListProps = {
  plans: SavedPlanSummary[];
};

export default function SavedPlanList({ plans }: SavedPlanListProps) {
  return (
    <div className="flex flex-col gap-3">
      {plans.map((plan) => (
        <SavedPlanCard
          key={plan.id}
          id={plan.id}
          title={plan.title}
          goalTypeLabel={getGoalTypeLabel(plan.goalType)}
          savedAt={plan.savedAt}
          completedSteps={plan.completedSteps}
          totalSteps={plan.totalSteps}
        />
      ))}
    </div>
  );
}
