import datetime from "./hooks/datetime";
import email from "./hooks/email";
import uuid from "./hooks/uuid";
import valWyvern from "./hooks/val";

import {
  isArray,
  isBoolean,
  isNull,
  isNumber,
  isObject,
  isString,
  isUndefined
} from "./util/types";

export type ScalarValue =
  | string
  | number
  | boolean
  | null;
// | ReadableStream<Uint8Array>; // #todo support if large text blobs expected

export type HookValue =
  | ScalarValue
  | { [key: string]: HookValue }
  | HookValue[];

export type HookError = {
  message: string;
  path: string;
}

export type HookSuccess = HookError[]; // empty for success

export type HookFunction = (
  candidate: HookValue,
  expected: HookValue,
  path: string,
  params: Record<string, any> | any,
  matchValues: MatchValues,
) => HookSuccess;

export type HookKey = `$${string}`;

export type HookHandlers = { [key: HookKey]: HookFunction };

export type HookPlugin = {
  handles: (value: HookKey) => boolean,
  handlers: HookHandlers
};

export type HookConfig = HookPlugin[];

export type MatchValues = {
  [match: string]: HookValue;
};

export type WysiwyvConfig = {
  hooks?: HookConfig,
  values?: MatchValues,
};

export const defaultHooks: HookConfig = [
  datetime,
  email,
  uuid,
  valWyvern,
];

const getHookKey = (val: any): HookKey | null => {
  if (typeof val === "string") {
    if (val.startsWith("$") && !val.startsWith("$$")) {
      return val as HookKey;
    }
  }

  if (typeof val === "object" && val !== null && Object.keys(val).length === 1) {
    const key = Object.keys(val)[0] as string;
    if (key.startsWith("$") && !key.startsWith("$$")) {
      return key as HookKey;
    }
  }

  return null;
}

export type WysiwyvInstance = { validate: (expected: HookValue, candidate: any) => HookSuccess };

export const makeWysiwyv = (config: WysiwyvConfig = {}) => {
  const { hooks: configHooks = [], values: configValues = {} } = config;
  const hooks: HookConfig = [...defaultHooks, ...configHooks];
  const matchValues = { ...configValues };

  const applyHooks = (expected: HookValue, candidate: any, path: string): HookSuccess => {
    const key = getHookKey(expected);
    if (!key) return expectNormal(expected, candidate, path);

    const hookPlugin = hooks.find(h => h.handles(key));

    const handler = hookPlugin?.handlers[key];
    if (!handler) return expectNormal(expected, candidate, path);

    const obj = isObject(expected) ? expected as Record<string, any> : null;
    const params = obj ? obj[key] : {};

    return handler(candidate, expected, path, params, matchValues);
  }

  const expectNormal = (expected: HookValue, candidate: HookValue, path: string): HookSuccess => {
    switch (true) {
      case isString(expected): return expectString(expected, candidate, path);
      case isNumber(expected): return expectNumber(expected, candidate, path);
      case isBoolean(expected): return expectBoolean(expected, candidate, path);
      case isNull(expected): return expectNull(candidate, path);
      case isArray(expected): return expectArray(expected, candidate, path);
      case isObject(expected): return expectObject(expected, candidate, path);
      default:
        throw new Error(`Unsupported expected value type at path '${path}': ${expected}`);
    }

    return [];
  }

  const expectString = (expected: string, candidate: any, path: string): HookSuccess => {
    if (typeof candidate !== 'string') {
      return [{
        message: `Type mismatch: expected type 'string', got type '${typeof candidate}'`,
        path
      }];
    }

    if (candidate !== expected) {
      return [{
        message: `Value mismatch: expected '${expected}', got '${candidate}'`,
        path
      }];
    }

    return [];
  }

  const expectNumber = (expected: number, candidate: any, path: string): HookSuccess => {
    if (typeof candidate !== 'number') {
      return [{
        message: `Type mismatch: expected type 'number', got type '${typeof candidate}'`,
        path
      }];
    }

    if (candidate !== expected) {
      return [{
        message: `Value mismatch: expected '${expected}', got '${candidate}'`,
        path
      }];
    }

    return [];
  }

  const expectBoolean = (expected: boolean, candidate: any, path: string): HookSuccess => {
    if (typeof candidate !== 'boolean') {
      return [{
        message: `Type mismatch: expected type 'boolean', got type '${typeof candidate}'`,
        path
      }];
    }
    if (candidate !== expected) {
      return [{
        message: `Value mismatch: expected '${expected}', got '${candidate}'`,
        path
      }];
    }

    return [];
  }

  const expectNull = (candidate: any, path: string): HookSuccess => {
    if (candidate !== null) {
      return [{
        message: `Type mismatch: expected 'null', got '${candidate}' (${typeof candidate})`,
        path
      }];
    }

    return [];
  }

  const expectArray = (expected: HookValue[], candidate: any, path: string): HookSuccess => {
    if (!isArray(candidate)) {
      return [{
        message: `Type mismatch: expected type 'array', got type '${typeof candidate}'`,
        path
      }];
    }

    let errors: HookError[] = [];

    if (candidate.length !== expected.length) {
      errors.push({
        message: `Array length mismatch: expected length ${expected.length}, got length ${candidate.length}`,
        path
      });
    }

    for (let i = 0; i < expected.length; i++) {
      if (isUndefined(candidate[i])) {
        errors.push({
          message: `Missing array item at index ${i}: expected '${expected[i]}', got 'undefined'`,
          path: `${path}[${i}]`,
        });
        continue;
      }

      const itemErrors = applyHooks(
        expected[i] as HookValue, // not undefined per line 212
        candidate[i],
        `${path}[${i}]`,
      );

      errors = [...errors, ...itemErrors];
    }

    return errors;
  }

  const expectObject = (expected: Record<string, any>, candidate: any, path: string): HookSuccess => {
    if (!isObject(candidate)) {
      return [{
        message: `Type mismatch: expected type 'object', got type '${typeof candidate}'`,
        path
      }];
    }

    let errors: HookError[] = [];

    const expectedKeys = Object.keys(expected);
    const candidateKeys = Object.keys(candidate);
    const missingKeys = expectedKeys.filter(k => !candidateKeys.includes(k));
    const extraKeys = candidateKeys.filter(k => !expectedKeys.includes(k));

    missingKeys.forEach(k => {
      errors.push({
        message: `Missing object key '${k}': expected '${expected[k]}', got 'undefined'`,
        path: `${path}.${k}`,
      });
    });

    extraKeys.forEach(k => {
      errors.push({
        message: `Unexpected object key '${k}': got '${candidate[k]}', expected nothing`,
        path: `${path}.${k}`,
      });
    });

    for (const key in expected) {
      if (missingKeys.includes(key)) continue; // already reported 

      const keyErrors = applyHooks(
        expected[key] as HookValue, // not undefined per line 257
        candidate[key],
        `${path}.${key}`,
      );

      errors = [...errors, ...keyErrors];
    }

    return errors;
  }

  return {
    validate: (expected: HookValue, candidate: any): HookSuccess => {
      return applyHooks(expected, candidate, '');
    }
  }
}
