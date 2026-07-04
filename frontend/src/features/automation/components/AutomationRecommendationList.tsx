import { useEffect } from "react";

import type { PlanningStep } from "@/features/planning/types/planning.types";
import { trackEvent } from "@/lib/analytics";
import AutomationRecommendation from "./AutomationRecommendation";

type AutomationRecommendationListProps = {
  steps: PlanningStep[];
};

export default function AutomationRecommendationList({ steps }: AutomationRecommendationListProps) {
  useEffect(() => {
    trackEvent("automation_recommended_viewed", { stepCount: steps.length });
  }, [steps.length]);

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">자동화 추천</h2>
      {steps.map((step) => (
        <div key={step.id} className="rounded-lg border border-border p-4">
          <p className="text-sm font-medium">{step.title}</p>
          <AutomationRecommendation planStepId={step.id} />
        </div>
      ))}
    </div>
  );
}
