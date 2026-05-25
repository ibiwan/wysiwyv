import { defaultHooks } from "./hooks/index.js";

import type { PluginList } from "./type/plugin.js";
import type { WysiwyvFactory } from "./type/engine.js";
import type { WysiwyvConfig } from "./type/engine.js";

import { makeWysiwyv as makeWysiwyvCore } from "./wysiwyv-core.js";

export const makeWysiwyv: WysiwyvFactory = (config: WysiwyvConfig = {}) => {
  const { plugins: configHooks = [], pluginSetups = {} } = config;
  const hooks: PluginList = [...defaultHooks, ...configHooks];

  return makeWysiwyvCore({ plugins: hooks, pluginSetups });
};
