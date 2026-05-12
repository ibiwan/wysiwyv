import { HookError } from "./HookError";

export interface HookAssessment {
  readonly fault: (error: HookError) => HookAssessment;
  readonly include: (assessment: HookAssessment) => HookAssessment;
  readonly errors: readonly HookError[];
  readonly success: boolean;
}

const start = (errors: readonly HookError[] = []): HookAssessment => {
  const _errors: HookError[] = [...errors];

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

    include(assessment: HookAssessment): HookAssessment {
      _errors.push(...assessment.errors);
      return assessment;
    },
  };

  return assessment;
};

const SUCCESS = start();
const fault = (error: HookError) => start().fault(error);

export const HookAssessor = {
  start,
  SUCCESS,
  fault,
};
