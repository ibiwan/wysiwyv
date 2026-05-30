import type { HookValue } from "../type/template.js";
import { repr } from "./stringify.js";
import type { WysiwyvPath } from "../type/engine.js";

export enum HookErrorType {
  UnexpectedElement = "unexpected-element",
  MissingElement = "missing-element",
  IncorrectValue = "incorrect-value",
  UnmatchedValue = "unmatched-value",
  IncorrectType = "incorrect-type",
  IncorrectAttribute = "incorrect-attribute",
  IncorrectAggregate = "incorrect-aggregate",
  InvalidConfig = "invalid-config",
}

export interface HookError {
  code: HookErrorType;
  path: WysiwyvPath;
  message?: string;
  candidate?: string;
  expected?: string;
  key?: string;
}

export const errUnexpected = (
  key: string,
  candidate: unknown,
  path: WysiwyvPath,
): HookError => ({
  code: HookErrorType.UnexpectedElement,
  path,
  candidate: repr(candidate),
  key,
});

export const errMissing = (
  key: string,
  expected: HookValue | unknown,
  path: WysiwyvPath,
): HookError => ({
  code: HookErrorType.MissingElement,
  path,
  expected: repr(expected),
  key,
});

export const errValue = (
  expected: HookValue,
  candidate: unknown,
  path: WysiwyvPath,
): HookError => ({
  code: HookErrorType.IncorrectValue,
  path,
  candidate: repr(candidate),
  expected: repr(expected),
});

export const errMatch = (
  expected: unknown,
  candidate: unknown,
  matcher: string,
  path: WysiwyvPath,
): HookError => ({
  code: HookErrorType.UnmatchedValue,
  path,
  candidate: repr(candidate),
  expected: repr(expected),
  key: matcher,
});

export const errType = (
  expectedType: string,
  candidate: unknown,
  path: WysiwyvPath,
): HookError => ({
  code: HookErrorType.IncorrectType,
  path,
  candidate: repr(candidate),
  expected: expectedType,
});

export const errAttr = (
  attribute: string,
  expectedAttribute: unknown,
  candidateAttribute: unknown,
  path: WysiwyvPath,
): HookError => ({
  code: HookErrorType.IncorrectAttribute,
  path,
  candidate: repr(candidateAttribute),
  expected: repr(expectedAttribute),
  key: attribute,
});

export const errConfig = (
  messageDetail: string,
  path: WysiwyvPath,
): HookError => ({
  code: HookErrorType.InvalidConfig,
  path,
  message: messageDetail,
});

export const errColl = (
  booleanFunction: string,
  path: WysiwyvPath,
): HookError => ({
  code: HookErrorType.IncorrectAggregate,
  path,
  key: booleanFunction,
});
