import fs from "fs";
import yaml from "yaml";

import type { HookAssessment } from "./src/util/HookAssessment";
import type { HookError } from "./src/util/HookError";
import type { MultiContext } from "./src/type/engine";
import type { HookValue } from "./src/type/template";

export const assertSuccess = (result: HookAssessment) => {
  expect(result.success).toBe(true);
  expect(result.errors).toHaveLength(0);
};

export const assertErrors = (result: HookAssessment, errors: HookError[]) => {
  expect(result.success).toBe(false);
  expect(result.errors).toEqual(errors);
};

export const assertResultFromErrors = (
  result: HookAssessment,
  errors: HookError[],
) => {
  if (errors.length === 0) {
    assertSuccess(result);
  } else {
    assertErrors(result, errors);
  }
};

export type TestStep = {
  candidate: unknown;
  template: HookValue;
  expected: HookError[];
  options?: { keepContext?: boolean };
  context?: {
    shared?: Record<string, unknown>;
    perHook?: Record<string, Record<string, unknown>>;
  };
};

export type TestSpec = {
  description: string;
  setup?: MultiContext;
  plugins?: string[];
} & (
  | { candidate: unknown; template: HookValue; expected: HookError[]; steps?: undefined }
  | { steps: TestStep[]; candidate?: undefined; template?: undefined; expected?: undefined }
);

export const getSpecs = (filename: string): TestSpec[] => {
  const rawYamlTest = fs.readFileSync(filename, "utf8");
  const testSpec = yaml.parse(rawYamlTest);
  return testSpec;
};
