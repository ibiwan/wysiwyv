import type { HookValue } from "../type/template";
import { repr } from "./stringify";

export interface HookError {
  message: string;
  path: string;
}

const makeError = (messageTemplate: string, value: unknown, path: string) => ({
  message: messageTemplate.replace("%s", repr(value)),
  path,
});

export const errUnexpected = (
  key: string,
  candidate: unknown,
  path: string,
): HookError =>
  makeError(`Unexpected element at '${key}': got '%s'`, candidate, path);

export const errMissing = (
  key: string,
  expected: HookValue | unknown,
  path: string,
): HookError =>
  makeError(
    `Missing element at '${key}': expected '${expected}'`,
    undefined,
    path,
  );

export const errValue = (
  expected: HookValue,
  candidate: unknown,
  path: string,
): HookError =>
  makeError(`Value: Expected '${expected}', got '%s'`, candidate, path);

export const errMatch = (
  expected: unknown,
  candidate: unknown,
  matcher: string,
  path: string,
): HookError =>
  makeError(
    `Expected value '${expected}' for key '${matcher}', got '%s'`,
    candidate,
    path,
  );

export const errType = (
  expectedType: string,
  candidate: unknown,
  path: string,
): HookError =>
  makeError(
    `Type: Expected '${expectedType}', got value '%s'`,
    candidate,
    path,
  );

export const errAttr = (
  attribute: string,
  expectedAttribute: unknown,
  candidateAttribute: unknown,
  path: string,
): HookError =>
  makeError(
    `${attribute}: Expected '${expectedAttribute}', got '%s'`,
    candidateAttribute,
    path,
  );

export const errConfig = (messageDetail: string, path: string): HookError =>
  makeError(`Configuration Error: ${messageDetail}`, undefined, path);

export const errColl = (booleanFunction: string, path: string): HookError =>
  makeError(`Aggregate Error: ${booleanFunction}`, undefined, path);
