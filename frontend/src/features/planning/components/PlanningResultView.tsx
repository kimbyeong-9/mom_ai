import type { PlanningStep } from "../types/planning.types";
import PlanningStepCard from "./PlanningStepCard";

type PlanningResultViewProps = {
  steps: PlanningStep[];
};

export default function PlanningResultView({ steps }: PlanningResultViewProps) {
  return (
    <div className="flex flex-col gap-3">
      {steps.map((step) => (
        <PlanningStepCard
          key={step.id}
          order={step.order}
          title={step.title}
          description={step.description}
          actionLabel={step.actionLabel}
          actionUrl={step.actionUrl}
        />
      ))}
    </div>
  );
}
