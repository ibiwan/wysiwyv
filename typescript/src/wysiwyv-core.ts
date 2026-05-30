import { makeCore } from "./core.js";

import type { PluginList } from "./type/plugin.js";
import type { WysiwyvFactory } from "./type/engine.js";
import type { WysiwyvConfig } from "./type/engine.js";

export const makeWysiwyv: WysiwyvFactory = (config: WysiwyvConfig = {}) => {
  const { plugins: configHooks = [], pluginSetups = {} } = config;
  const hooks: PluginList = [...configHooks];

  const { evaluate, peekContext } = makeCore(hooks, pluginSetups);

  return {
    validate: evaluate,
    peekContext,
  };
};
