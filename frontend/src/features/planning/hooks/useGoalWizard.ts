import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { COUNTRIES } from "@/constants/countries";
import type { GoalTypeId } from "@/constants/goalTypes";
import {
  findWizardOptionLabel,
  GOAL_WIZARD_STEPS,
  type WizardStep,
} from "@/constants/goalWizardSteps";
import { trackEvent } from "@/lib/analytics";
import type { SearchProfile } from "../types/planning.types";
import { useSubmitGoal } from "./useSubmitGoal";

const STORAGE_KEY = "lifeflow_goal_wizard_progress";

export type WizardAnswers = Record<string, string | string[]>;

type StoredProgress = {
  stepIndex: number;
  answers: WizardAnswers;
  skipGoalForm: boolean;
};

function loadStoredProgress(): StoredProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredProgress;
    if (typeof parsed.stepIndex !== "number" || !parsed.answers) return null;
    return { ...parsed, skipGoalForm: parsed.skipGoalForm ?? false };
  } catch {
    return null;
  }
}

function saveStoredProgress(progress: StoredProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function clearStoredProgress() {
  localStorage.removeItem(STORAGE_KEY);
}

// "specificRole" only means something when field !== "other" (see
// GOAL_WIZARD_STEPS' specificRole step, skipped entirely otherwise) — when
// field IS "other", the free-text "fieldOther" answer (typed into the
// reveal-in input on the field step) takes its place instead.
export function getSpecificRoleLabel(answers: WizardAnswers): string | null {
  if (answers.field === "other") {
    return (answers.fieldOther as string | undefined)?.trim() || null;
  }
  return findWizardOptionLabel("specificRole", answers.specificRole as string);
}

// Raw wizard-option id counterpart to getSpecificRoleLabel — used for the
// English search query (search-query.util.ts on the backend), never shown
// on screen.
export function getSpecificRoleValue(answers: WizardAnswers): string | null {
  if (answers.field === "other") {
    return (answers.fieldOther as string | undefined)?.trim() || null;
  }
  return (answers.specificRole as string | undefined) ?? null;
}

function composeGoalText(answers: WizardAnswers): string {
  const countryCodes = (answers.countries as string[] | undefined) ?? [];
  const countryNames = countryCodes
    .map((code) => COUNTRIES.find((c) => c.code === code)?.name ?? code)
    .join(", ");

  const goalForm = findWizardOptionLabel("goalForm", answers.goalForm as string) ?? "해외 진출";
  const field =
    getSpecificRoleLabel(answers) ?? findWizardOptionLabel("field", answers.field as string);
  const experience = findWizardOptionLabel("experience", answers.experience as string);
  const timeline = findWizardOptionLabel("timeline", answers.timeline as string);
  const visaStatus = findWizardOptionLabel("visaStatus", answers.visaStatus as string);
  const language = findWizardOptionLabel("language", answers.language as string);
  const workStyle = findWizardOptionLabel("workStyle", answers.workStyle as string);

  return [
    `${goalForm}을 목표로 ${countryNames || "여러 국가"}에서 준비하려고 해요.`,
    field && experience ? `희망 직군은 ${field}이고 경력은 ${experience}예요.` : null,
    timeline ? `${timeline} 안에 준비를 마치고 싶어요.` : null,
    visaStatus ? `비자 상태는 ${visaStatus}이에요.` : null,
    language && workStyle ? `언어 수준은 ${language}이고, ${workStyle}을 원해요.` : null,
  ]
    .filter(Boolean)
    .join(" ");
}

// Raw (undecorated) values for the backend to build search queries from —
// buildResultTags below is for on-screen display and mixes in flags/emoji/
// suffixes that don't belong in a search query.
function buildSearchProfile(answers: WizardAnswers): SearchProfile {
  const countryCodes = (answers.countries as string[] | undefined) ?? [];
  return {
    countries: countryCodes.map((code) => COUNTRIES.find((c) => c.code === code)?.name ?? code),
    field:
      getSpecificRoleLabel(answers) ??
      findWizardOptionLabel("field", answers.field as string) ??
      undefined,
    experience: findWizardOptionLabel("experience", answers.experience as string) ?? undefined,
    workStyle: findWizardOptionLabel("workStyle", answers.workStyle as string) ?? undefined,
    countryCodes,
    fieldValue: getSpecificRoleValue(answers) ?? (answers.field as string | undefined),
    experienceValue: answers.experience as string | undefined,
    workStyleValue: answers.workStyle as string | undefined,
  };
}

function resumeContextLabel(answers: WizardAnswers): string {
  const countryCodes = (answers.countries as string[] | undefined) ?? [];
  const firstCountry = COUNTRIES.find((c) => c.code === countryCodes[0]);
  return firstCountry ? `${firstCountry.name} 준비` : "지난번 답변";
}

// These are the user's own real answers, not fabricated search results —
// safe to surface as context on the /planning result page.
export function buildResultTags(answers: WizardAnswers): Record<string, string> {
  const tags: Record<string, string> = {};

  const countryCodes = (answers.countries as string[] | undefined) ?? [];
  const firstCountry = COUNTRIES.find((c) => c.code === countryCodes[0]);
  if (firstCountry) {
    tags.country = `${firstCountry.flag} ${firstCountry.name}`;
  }

  const field =
    getSpecificRoleLabel(answers) ?? findWizardOptionLabel("field", answers.field as string);
  const experience = findWizardOptionLabel("experience", answers.experience as string);
  if (field && experience) {
    tags.role = `${field} · ${experience}`;
  } else if (field ?? experience) {
    tags.role = (field ?? experience) as string;
  }

  const workStyle = findWizardOptionLabel("workStyle", answers.workStyle as string);
  if (workStyle) {
    tags.workStyle = `${workStyle} 선호`;
  }

  return tags;
}

// "goalForm" is skipped when the homepage CTA already told us the vertical
// (see getInitialWizardState) — the homepage's two cards ARE this question,
// so asking it again inside the wizard would be a literal repeat. Only the
// "잘 모르겠어요" fallback entry (no vertical param) needs to ask it for real.
//
// "specificRole" is filtered out whenever field === "other" — there really
// is no detailed sub-role to choose there (the "기타" free-text field on the
// field step replaces it instead), so it correctly shrinks totalSteps
// (e.g. "2/8" → "2/7") rather than counting a question that will never be
// asked.
export function getEffectiveSteps(
  answers: WizardAnswers,
  skipGoalForm: boolean,
): readonly WizardStep[] {
  return GOAL_WIZARD_STEPS.filter((step) => {
    if (skipGoalForm && step.id === "goalForm") return false;
    if (answers.field === "other" && step.id === "specificRole") return false;
    return true;
  });
}

type InitialWizardState = {
  stepIndex: number;
  answers: WizardAnswers;
  pendingResume: StoredProgress | null;
  goalInputStarted: boolean;
  skipGoalForm: boolean;
};

function getInitialWizardState(vertical: string | null): InitialWizardState {
  if (vertical === "abroad-job" || vertical === "nomad") {
    clearStoredProgress();
    return {
      stepIndex: 0,
      answers: { goalForm: vertical === "nomad" ? "freelance-nomad" : "fulltime" },
      pendingResume: null,
      goalInputStarted: true,
      skipGoalForm: true,
    };
  }

  const stored = loadStoredProgress();
  const pendingResume =
    stored &&
    stored.stepIndex > 0 &&
    stored.stepIndex < getEffectiveSteps(stored.answers, stored.skipGoalForm).length
      ? stored
      : null;
  return {
    stepIndex: 0,
    answers: {},
    pendingResume,
    goalInputStarted: false,
    skipGoalForm: false,
  };
}

export function useGoalWizard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [initialState] = useState(() => getInitialWizardState(searchParams.get("vertical")));
  const [stepIndex, setStepIndex] = useState(initialState.stepIndex);
  const [answers, setAnswers] = useState<WizardAnswers>(initialState.answers);
  const [pendingResume, setPendingResume] = useState<StoredProgress | null>(
    initialState.pendingResume,
  );
  // A resumed session may have been originally started via a homepage vertical
  // CTA (skipGoalForm: true) even though *this* mount has no vertical param —
  // effectiveSteps must follow whichever value the stored stepIndex was
  // actually computed against, so this is restored in handleResume() below
  // rather than only read once from initialState.
  const [skipGoalForm, setSkipGoalForm] = useState(initialState.skipGoalForm);
  const goalInputStartedRef = useRef(initialState.goalInputStarted);
  const submitGoal = useSubmitGoal();

  useEffect(() => {
    if (initialState.goalInputStarted) {
      trackEvent("goal_input_started");
    }
    // Fires once for the initial mount only, based on whether a homepage
    // vertical CTA (captured in initialState) pre-answered the first step.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pendingResume || stepIndex === 0) return;
    saveStoredProgress({ stepIndex, answers, skipGoalForm });
  }, [stepIndex, answers, pendingResume, skipGoalForm]);

  const effectiveSteps = getEffectiveSteps(answers, skipGoalForm);
  const totalSteps = effectiveSteps.length;
  const currentStep = effectiveSteps[stepIndex];
  const isLastStep = stepIndex === totalSteps - 1;

  const setAnswer = (stepId: string, value: string | string[]) => {
    if (!goalInputStartedRef.current) {
      goalInputStartedRef.current = true;
      trackEvent("goal_input_started");
    }
    setAnswers((prev) => ({ ...prev, [stepId]: value }));
  };

  const goNext = () => {
    if (isLastStep) {
      const goalType: GoalTypeId = answers.goalForm === "freelance-nomad" ? "nomad" : "abroad";
      clearStoredProgress();
      submitGoal.mutate(
        { goalType, goalText: composeGoalText(answers), profile: buildSearchProfile(answers) },
        {
          onSuccess: (data) => {
            const params = new URLSearchParams({ planningId: data.id, ...buildResultTags(answers) });
            navigate(`/planning?${params.toString()}`);
          },
        },
      );
      return;
    }
    setStepIndex((index) => index + 1);
  };

  const goBack = () => {
    setStepIndex((index) => Math.max(0, index - 1));
  };

  const handleResume = () => {
    if (!pendingResume) return;
    setStepIndex(pendingResume.stepIndex);
    setAnswers(pendingResume.answers);
    setSkipGoalForm(pendingResume.skipGoalForm);
    goalInputStartedRef.current = true;
    setPendingResume(null);
  };

  const handleRestart = () => {
    clearStoredProgress();
    setPendingResume(null);
    setStepIndex(0);
    setAnswers({});
  };

  return {
    currentStep,
    stepIndex,
    totalSteps,
    isLastStep,
    canGoBack: stepIndex > 0,
    answers,
    setAnswer,
    goNext,
    goBack,
    resumePrompt: pendingResume
      ? {
          stepIndex: pendingResume.stepIndex,
          contextLabel: resumeContextLabel(pendingResume.answers),
        }
      : null,
    handleResume,
    handleRestart,
    isSubmitting: submitGoal.isPending,
  };
}
