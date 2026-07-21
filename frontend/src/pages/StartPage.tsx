import GoalWizard from "@/features/planning/components/wizard/GoalWizard";
import PlanningLoading from "@/features/planning/components/PlanningLoading";
import { buildResultTags, useGoalWizard } from "@/features/planning/hooks/useGoalWizard";

export default function StartPage() {
  const goalWizard = useGoalWizard();
  const tags = buildResultTags(goalWizard.answers);
  const loadingHeading = [tags.country, tags.role].filter(Boolean).join(" ");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F5F1E6] p-5">
      <div className="pointer-events-none absolute -right-10 -top-8 size-36 rounded-full bg-[#B7CBAE] opacity-40 sm:-right-16 sm:-top-10 sm:size-52" />
      <div className="pointer-events-none absolute -left-10 bottom-10 size-24 rounded-full bg-[#F0D6C4] opacity-40 sm:-left-12 sm:size-36" />

      <div className="relative z-10 w-full max-w-3xl">
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
