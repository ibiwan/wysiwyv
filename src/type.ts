import type { HookValue } from "./type/template";
import type { HookAssessment } from "./util/HookAssessment";

export type WysiwyvEvaluatorFunction = (
  expected: HookValue,
  candidate: unknown,
  path: string,
) => HookAssessment;
