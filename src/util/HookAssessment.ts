import type { HookError } from "./HookError.js";

export interface HookAssessment {
  readonly fault: (error: HookError) => HookAssessment;
  readonly include: (assessment: HookAssessment) => HookAssessment;
  readonly errors: readonly HookError[];
  readonly success: boolean;
}

const EMPTY_ERRORS = Object.freeze([]) as readonly HookError[];

const SUCCESS: HookAssessment = {
  get success() {
    return true;
  },

  get errors() {
    return EMPTY_ERRORS;
  },

  fault(error: HookError): HookAssessment {
    return start().fault(error);
  },

  include(newAssessment: HookAssessment): HookAssessment {
    return newAssessment;
  },
};

const start = (errors: readonly HookError[] = []): HookAssessment => {
  const _errors: HookError[] = errors.length === 0 ? [] : [...errors];

  const assessment: HookAssessment = {
    get success() {
      return _errors.length === 0;
    },
    get errors() {
      return [..._errors];
    },

    fault(error: HookError): HookAssessment {
      _errors.push(error);
      return assessment;
    },

    include(newAssessment: HookAssessment): HookAssessment {
      if (!newAssessment.success) _errors.push(...newAssessment.errors);

      return assessment;
    },
  };

  return assessment;
};

const fault = (error: HookError) => start().fault(error);

export const HookAssessor = {
  start,
  SUCCESS,
  fault,
};
