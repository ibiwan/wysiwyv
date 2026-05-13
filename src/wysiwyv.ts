import { defaultHooks } from "./hooks";
import type { HookConfig, WysiwyvConfig, WysiwyvFactory } from "./type";
import { makeWysiwyv as makeWysiwyvCore } from "./wysiwyv-core";

export const makeWysiwyv: WysiwyvFactory = (config: WysiwyvConfig = {}) => {
  const { hooks: configHooks = [], values } = config;
  const hooks: HookConfig = [...defaultHooks, ...configHooks];

  return makeWysiwyvCore({ hooks, values });
};
