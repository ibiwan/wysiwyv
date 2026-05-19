import { defaultHooks } from "./hooks";

import type { PluginList } from "./type/plugin";
import type { WysiwyvFactory } from "./type/engine";
import type { WysiwyvConfig } from "./type/engine";

import { makeWysiwyv as makeWysiwyvCore } from "./wysiwyv-core";

export const makeWysiwyv: WysiwyvFactory = (config: WysiwyvConfig = {}) => {
  const { plugins: configHooks = [], pluginSetups = {} } = config;
  const hooks: PluginList = [...defaultHooks, ...configHooks];

  return makeWysiwyvCore({ plugins: hooks, pluginSetups });
};
