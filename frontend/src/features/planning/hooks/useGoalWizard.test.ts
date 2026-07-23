import { describe, expect, it } from "vitest";

import {
  getEffectiveSteps,
  getSpecificRoleLabel,
  getSpecificRoleValue,
  type WizardAnswers,
} from "./useGoalWizard";

// Regression coverage for the resume-state-mismatch bug: a stored session
// started via a homepage vertical CTA (skipGoalForm: true) must produce the
// same step array on resume as it did when stepIndex was first saved —
// otherwise the stored stepIndex points at the wrong question.
describe("getEffectiveSteps", () => {
  it("includes all 9 steps, starting with goalForm, when not skipped", () => {
    const steps = getEffectiveSteps({}, false);
    expect(steps).toHaveLength(9);
    expect(steps[0].id).toBe("goalForm");
  });

  it("excludes goalForm when skipGoalForm is true (homepage vertical CTA entry)", () => {
    const steps = getEffectiveSteps({}, true);
    expect(steps).toHaveLength(8);
    expect(steps.map((s) => s.id)).not.toContain("goalForm");
    expect(steps[0].id).toBe("countries");
  });

  it("excludes specificRole when field is 'other', regardless of skipGoalForm", () => {
    const answers: WizardAnswers = { field: "other" };
    expect(getEffectiveSteps(answers, false).map((s) => s.id)).not.toContain("specificRole");
    expect(getEffectiveSteps(answers, true).map((s) => s.id)).not.toContain("specificRole");
  });

  it("excludes both goalForm and specificRole together", () => {
    const steps = getEffectiveSteps({ field: "other" }, true);
    expect(steps).toHaveLength(7);
  });

  it("keeps specificRole when a concrete field is chosen", () => {
    const steps = getEffectiveSteps({ field: "it-dev" }, false);
    expect(steps.map((s) => s.id)).toContain("specificRole");
  });
});

describe("getSpecificRoleLabel / getSpecificRoleValue", () => {
  it("falls back to the free-text 'fieldOther' answer when field is 'other', ignoring any stale specificRole answer", () => {
    const answers: WizardAnswers = {
      field: "other",
      specificRole: "backend",
      fieldOther: "그래픽 노블 편집자",
    };
    expect(getSpecificRoleLabel(answers)).toBe("그래픽 노블 편집자");
    expect(getSpecificRoleValue(answers)).toBe("그래픽 노블 편집자");
  });

  it("returns null when field is 'other' and no free text has been typed yet", () => {
    const answers: WizardAnswers = { field: "other" };
    expect(getSpecificRoleLabel(answers)).toBeNull();
    expect(getSpecificRoleValue(answers)).toBeNull();
  });

  it("returns the raw value and matching label for a real field/specificRole pair", () => {
    const answers: WizardAnswers = { field: "it-dev", specificRole: "backend" };
    expect(getSpecificRoleValue(answers)).toBe("backend");
    expect(getSpecificRoleLabel(answers)).toBe("백엔드 개발자");
  });

  it("returns null when specificRole hasn't been answered yet", () => {
    const answers: WizardAnswers = { field: "it-dev" };
    expect(getSpecificRoleValue(answers)).toBeNull();
    expect(getSpecificRoleLabel(answers)).toBeNull();
  });
});
