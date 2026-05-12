import { makeCore } from "./core";
import { defaultHooks } from "./hooks";
import type {
  HookConfig,
  HookResult,
  HookValue,
  WysiwyvConfig,
  WysiwyvFactory,
} from "./type";

export const makeWysiwyv: WysiwyvFactory = (config: WysiwyvConfig = {}) => {
  const { hooks: configHooks = [], values: configValues = {} } = config;
  const hooks: HookConfig = [...defaultHooks, ...configHooks];
  const matchValues = { ...configValues };

  const { evaluate } = makeCore(hooks, matchValues);

  return {
    validate: (
      expected: HookValue,
      candidate: unknown,
    ): HookResult => {
      return evaluate(expected, candidate, "");
    },
  };
};
