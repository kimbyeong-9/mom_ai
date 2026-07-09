import type { SavedPlanSummary } from "../types/save.types";
import SavedPlanCard from "./SavedPlanCard";

type SavedPlanListProps = {
  plans: SavedPlanSummary[];
};

export default function SavedPlanList({ plans }: SavedPlanListProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-[18px]">
      {plans.map((plan) => (
        <SavedPlanCard
          key={plan.id}
          id={plan.id}
          title={plan.title}
          goalType={plan.goalType}
          savedAt={plan.savedAt}
          completedSteps={plan.completedSteps}
          totalSteps={plan.totalSteps}
        />
      ))}
    </div>
  );
}
