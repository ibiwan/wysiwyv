import { makeCore } from "./core";
import type {
  HookConfig,
  HookValue,
  WysiwyvConfig,
  WysiwyvFactory,
} from "./type";
import type { HookAssessment } from "./util/HookAssessment";

export const makeWysiwyv: WysiwyvFactory = (config: WysiwyvConfig = {}) => {
  const { hooks: configHooks = [], values: configValues = {} } = config;
  const hooks: HookConfig = [...configHooks];
  const matchValues = { ...configValues };

  const { evaluate } = makeCore(hooks, matchValues);

  return {
    validate: (expected: HookValue, candidate: unknown): HookAssessment => {
      return evaluate(expected, candidate, "");
    },
  };
};
