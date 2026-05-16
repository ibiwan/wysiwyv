import type { HookValue } from "./template";
import type { ContextObject, PluginList } from "./plugin";
import type { HookAssessment } from "../util/HookAssessment";

export type MultiContext = Record<string, ContextObject>;

export type WysiwyvConfig = {
  plugins?: PluginList;
  pluginSetups?: MultiContext;
};
export type WysiwyvInstance = {
  validate: (expected: HookValue, candidate: unknown) => HookAssessment;
};
export type WysiwyvFactory = (config?: WysiwyvConfig) => WysiwyvInstance;

// passed to each plugin to enable custom descent
export type WysiwyvEvaluatorFunction = (
  expected: HookValue,
  candidate: unknown,
  path: string,
) => HookAssessment;
