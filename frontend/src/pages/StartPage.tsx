import { Home } from "lucide-react";
import { Link } from "react-router-dom";

import GoalWizard from "@/features/planning/components/wizard/GoalWizard";
import PlanningLoading from "@/features/planning/components/PlanningLoading";
import { buildResultTags, useGoalWizard } from "@/features/planning/hooks/useGoalWizard";

export default function StartPage() {
  const goalWizard = useGoalWizard();
  const tags = buildResultTags(goalWizard.answers);
  const loadingHeading = [tags.country, tags.role].filter(Boolean).join(" ");

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#F5F1E6] p-5">
      {/* Mobile: top-right. Desktop: top-left. */}
      <Link
        to="/"
        aria-label="홈으로"
        className="absolute right-5 top-5 z-20 flex size-9 items-center justify-center rounded-full bg-white text-[#1F3D2E] shadow-[0_2px_10px_rgba(31,61,46,0.08)] transition-colors hover:bg-[#1F3D2E]/5 sm:left-8 sm:right-auto sm:top-8"
      >
        <Home size={18} strokeWidth={2.25} />
      </Link>

      <div className="w-full max-w-4xl">
        {goalWizard.isSubmitting ? (
          <PlanningLoading
            heading={loadingHeading ? `${loadingHeading} 준비를\n실제로 조사하고 있어요` : undefined}
          />
        ) : (
          <GoalWizard {...goalWizard} />
        )}
      </div>
    </div>
  );
}
