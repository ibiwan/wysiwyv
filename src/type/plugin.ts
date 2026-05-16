import type { WysiwyvEvaluatorFunction } from "../type";
import type { HookValue } from "./template";

import type { HookAssessment } from "../util/HookAssessment";

export type ContextObject = Record<string, unknown>;

export type HookEnviron<
  ParamsType = unknown,
  SetupType = unknown,
  ContextType extends ContextObject = ContextObject,
> = {
  path: string;
  params: ParamsType;
  setup: SetupType;
  context: ContextType;
  shared: Record<string, unknown>;
  evaluate: WysiwyvEvaluatorFunction;
};

/**
 * @example options: HookEnviron<string>
 * @example options: HookEnviron<{...}>
 */
export type HookHandler<
  ParamsType = unknown,
  SetupType = unknown,
  ContextType extends ContextObject = ContextObject,
> = (
  candidate: unknown,
  expected: HookValue,
  options: HookEnviron<ParamsType, SetupType, ContextType>,
) => HookAssessment;

// second string forces at least one character after the initial dollar sign.
// may not work in all typescript implementations.
export type HookKey = `$${string}${string}`;

export type WyvPlugin<
  ParamsType = unknown,
  SetupType = unknown,
  ContextType extends ContextObject = ContextObject,
> = {
  handles: (value: HookKey) => boolean;
  handlers: { [key: HookKey]: HookHandler<ParamsType, SetupType, ContextType> };
};

/* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
export type PluginList = WyvPlugin<any, any, any>[];
