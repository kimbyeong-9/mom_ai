import type { useGoalWizard } from "../../hooks/useGoalWizard";
import WizardCountryStep from "./WizardCountryStep";
import WizardProgressHeader from "./WizardProgressHeader";
import WizardResumePrompt from "./WizardResumePrompt";
import WizardSingleSelectStep from "./WizardSingleSelectStep";
import WizardTrustPanel from "./WizardTrustPanel";

type GoalWizardProps = ReturnType<typeof useGoalWizard>;

export default function GoalWizard({
  currentStep,
  stepIndex,
  totalSteps,
  isLastStep,
  canGoBack,
  answers,
  setAnswer,
  goNext,
  goBack,
  resumePrompt,
  handleResume,
  handleRestart,
  isSubmitting,
}: GoalWizardProps) {
  const currentAnswer = answers[currentStep.id];
  const canProceed =
    currentStep.type === "country-multi-select"
      ? Array.isArray(currentAnswer) && currentAnswer.length > 0
      : Boolean(currentAnswer);

  return (
    <div className="flex overflow-hidden rounded-[20px] border-[1.5px] border-[#1F3D2E]/[0.08] bg-white shadow-[0_8px_24px_rgba(31,61,46,0.06)] sm:rounded-3xl">
      <div className="flex flex-1 flex-col">
        {resumePrompt ? (
          <WizardResumePrompt
            stepIndex={resumePrompt.stepIndex}
            totalSteps={totalSteps}
            contextLabel={resumePrompt.contextLabel}
            onResume={handleResume}
            onRestart={handleRestart}
          />
        ) : (
          <>
            <div className="px-6 pt-5 sm:px-8 sm:pt-7">
              <WizardProgressHeader current={stepIndex + 1} total={totalSteps} />
            </div>

            <div className="flex-1 px-6 py-7 sm:px-8">
              {currentStep.type === "country-multi-select" ? (
                <WizardCountryStep
                  title={currentStep.title}
                  subtitle={currentStep.subtitle}
                  value={(currentAnswer as string[]) ?? []}
                  onChange={(codes) => setAnswer(currentStep.id, codes)}
                />
              ) : (
                <WizardSingleSelectStep
                  title={currentStep.title}
                  subtitle={currentStep.subtitle}
                  options={currentStep.options}
                  value={currentAnswer as string | undefined}
                  onChange={(value) => setAnswer(currentStep.id, value)}
                />
              )}
            </div>

            <div className="flex gap-2.5 px-6 pb-6 sm:px-8 sm:pb-7">
              <button
                type="button"
                onClick={goBack}
                disabled={!canGoBack}
                className="h-[50px] w-[100px] shrink-0 rounded-2xl border-[1.5px] border-[#1F3D2E]/15 bg-white text-sm font-semibold text-[#1F3D2E] transition-colors hover:bg-[#1F3D2E]/5 disabled:opacity-40"
              >
                이전
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={!canProceed || isSubmitting}
                className="h-[50px] flex-1 rounded-2xl bg-[#1F3D2E] text-sm font-semibold text-white transition-colors hover:bg-[#1a3325] disabled:opacity-40"
              >
                {isSubmitting ? "생성 중..." : isLastStep ? "결과 받기 →" : "다음"}
              </button>
            </div>
          </>
        )}
      </div>

      <WizardTrustPanel />
    </div>
  );
}
