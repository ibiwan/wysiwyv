import type { HookAssessment } from "./src/util/HookAssessment";
import type { HookError } from "./src/util/HookError";

export const assertSuccess = (result: HookAssessment) => {
  expect(result.success).toBe(true);
  expect(result.errors).toHaveLength(0);
};

export const assertErrors = (result: HookAssessment, errors: HookError[]) => {
  expect(result.success).toBe(false);
  expect(result.errors).toEqual(errors);
};
