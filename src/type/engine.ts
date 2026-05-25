import type { HookValue } from "./template.js";
import type { ContextObject, PluginList } from "./plugin.js";
import type { HookAssessment } from "../util/HookAssessment.js";

export type MultiContext = Record<string, ContextObject>;

export type WysiwyvConfig = {
  plugins?: PluginList;
  pluginSetups?: MultiContext;
};

export type WysiwyvInternalContexts = {
  perHookSetups: MultiContext;
  perHookContexts: MultiContext;
  sharedContext: ContextObject;
  handlerKeyCache: Map<string, Function>;
};

export type WysiwyvInstance = {
  validate: WysiwyvRootEvaluator;
  peekContext: () => WysiwyvInternalContexts;
};
export type WysiwyvFactory = (config?: WysiwyvConfig) => WysiwyvInstance;

export type WysiwyvRootEvaluator = (
  expected: HookValue,
  candidate: unknown,
  keepContext?: boolean,
) => HookAssessment;

// passed to each plugin to enable custom descent
export type WysiwyvEvaluatorFunction = (
  expected: HookValue,
  candidate: unknown,
  path: string,
) => HookAssessment;
