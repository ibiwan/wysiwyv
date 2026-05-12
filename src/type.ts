import type { HookAssessment } from "./util/HookAssessment";

export type ScalarValue = string | number | boolean | null;
// | ReadableStream<Uint8Array>; // #todo support if large text blobs expected

export type HookValue =
  | ScalarValue
  | { [key: string]: HookValue }
  | HookValue[];

export type WysiwyvEvaluator = (
  expected: HookValue,
  candidate: unknown,
  path: string,
) => HookAssessment;

export type HookContext<P = never> = {
  path: string;
  params: P;
  matchValues: MatchValues;
  evaluate: WysiwyvEvaluator;
};

/**
 * @example options: HookContext<string>
 * @example options: HookContext<{...}>
 */
export type HookHandler = (
  candidate: unknown,
  expected: HookValue,
  options: HookContext,
) => HookAssessment;

export type HookKey = `$${string}`;

export type HookHandlers = { [key: HookKey]: HookHandler };

export type HookPlugin = {
  handles: (value: HookKey) => boolean;
  handlers: HookHandlers;
};

export type HookConfig = HookPlugin[];

export type MatchValues = {
  [match: string]: unknown;
};

export type WysiwyvConfig = {
  hooks?: HookConfig;
  values?: MatchValues;
};

export type WysiwyvInstance = {
  validate: (expected: HookValue, candidate: unknown) => HookAssessment;
};

export type WysiwyvFactory = (config?: WysiwyvConfig) => WysiwyvInstance;
