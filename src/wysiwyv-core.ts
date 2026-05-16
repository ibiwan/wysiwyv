import { makeCore } from "./core";
import type { HookValue } from "./type/template";
import type { PluginList } from "./type/plugin";
import type { WysiwyvFactory } from "./type/engine";
import type { WysiwyvConfig } from "./type/engine";
import type { HookAssessment } from "./util/HookAssessment";

export const makeWysiwyv: WysiwyvFactory = (config: WysiwyvConfig = {}) => {
  const { plugins: configHooks = [], pluginSetups = {} } = config;
  const hooks: PluginList = [...configHooks];

  const { evaluate } = makeCore(hooks, pluginSetups);

  return {
    validate: (expected: HookValue, candidate: unknown): HookAssessment => {
      return evaluate(expected, candidate, "");
    },
  };
};
