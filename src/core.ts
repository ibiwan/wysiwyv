import { type WysiwyvEvaluatorFunction } from "./type/engine";
import { type ContextObject } from "./type/plugin";
import { type HookValue } from "./type/template";
import { type HookObject } from "./type/template";
import { type HookHandler } from "./type/plugin";
import { type PluginList } from "./type/plugin";

import { HookAssessor, type HookAssessment } from "./util/HookAssessment";

import {
  AttributeError,
  ConfigError,
  MissingElementError,
  SpecError,
  UnexpectedElementError,
  ValueError,
} from "./util/HookError";

import { getHookKey, getHookParams } from "./util/parseHook";
import { repr } from "./util/stringify";

import {
  isArray,
  isBoolean,
  isNull,
  isNumber,
  isPlainObject,
  isString,
  isUndefined,
} from "./util/types";
import type { MultiContext } from "./type/engine";

export const makeCore = (hooks: PluginList, pluginSetups: MultiContext) => {
  const perHookSetups: MultiContext = Object.freeze({ ...pluginSetups });
  const perHookContexts: MultiContext = {};
  const sharedContext: HookObject = {};

  const evaluate: WysiwyvEvaluatorFunction = (expected, candidate, path) => {
    const key = getHookKey(expected);
    if (!key) return expectNormal(expected, candidate, path);

    const hookSetup = perHookSetups[key] ?? ({} as HookObject);
    if (perHookContexts[key] === undefined) {
      perHookContexts[key] = {};
    }

    const hookContext: ContextObject = perHookContexts[key];

    const hookPlugin = hooks.find((h) => h.handles(key));

    const handler = hookPlugin?.handlers[key];

    if (!handler) return expectNormal(expected, candidate, path);

    const params = getHookParams(expected, key);

    const result = (handler as HookHandler)(candidate, expected, {
      path,
      params,
      setup: hookSetup,
      context: hookContext,
      shared: sharedContext,
      evaluate: evaluate,
    });

    return result;
  };

  const expectNormal = (
    expected: HookValue,
    candidate: unknown,
    path: string,
  ): HookAssessment => {
    switch (true) {
      case isString(expected):
        return expectString(expected, candidate, path);
      case isNumber(expected):
        return expectNumber(expected, candidate, path);
      case isBoolean(expected):
        return expectBoolean(expected, candidate, path);
      case isNull(expected):
        return expectNull(candidate, path);
      case isArray(expected):
        return expectArray(expected, candidate, path);
      case isPlainObject(expected):
        return expectObject(expected, candidate, path);
      default:
        return HookAssessor.fault(
          new ConfigError(
            `Unsupported value type in expected object: '${repr(expected)}'`,
            path,
          ),
        );
    }
  };

  const expectString = (
    expected: string,
    candidate: unknown,
    path: string,
  ): HookAssessment => {
    if (typeof candidate !== "string") {
      return HookAssessor.fault(new SpecError("string", candidate, path));
    }

    if (candidate !== expected) {
      return HookAssessor.fault(new ValueError(expected, candidate, path));
    }

    return HookAssessor.SUCCESS;
  };

  const expectNumber = (
    expected: number,
    candidate: unknown,
    path: string,
  ): HookAssessment => {
    if (typeof candidate !== "number") {
      return HookAssessor.fault(new SpecError("number", candidate, path));
    }

    if (candidate !== expected) {
      return HookAssessor.fault(new ValueError(expected, candidate, path));
    }

    return HookAssessor.SUCCESS;
  };

  const expectBoolean = (
    expected: boolean,
    candidate: unknown,
    path: string,
  ): HookAssessment => {
    if (typeof candidate !== "boolean") {
      return HookAssessor.fault(new SpecError("boolean", candidate, path));
    }
    if (candidate !== expected) {
      return HookAssessor.fault(new ValueError(expected, candidate, path));
    }

    return HookAssessor.SUCCESS;
  };

  const expectNull = (candidate: unknown, path: string): HookAssessment => {
    if (candidate !== null) {
      return HookAssessor.fault(new SpecError("null", candidate, path));
    }

    return HookAssessor.SUCCESS;
  };

  const expectArray = (
    expected: HookValue[],
    candidate: unknown,
    path: string,
  ): HookAssessment => {
    if (!isArray(candidate)) {
      return HookAssessor.fault(new SpecError("array", candidate, path));
    }

    const errors = HookAssessor.start();

    if (candidate.length !== expected.length) {
      errors.fault(
        new AttributeError(
          "Array length",
          expected.length,
          candidate.length,
          path,
        ),
      );
    }

    for (let i = 0; i < expected.length; i++) {
      if (isUndefined(candidate[i])) {
        errors.fault(
          new MissingElementError(`index ${i}`, expected[i], `${path}[${i}]`),
        );
        continue;
      }

      const itemErrors = evaluate(
        expected[i] as HookValue, // not undefined per earlier check
        candidate[i],
        `${path}[${i}]`,
      );

      errors.include(itemErrors);
    }

    return errors;
  };

  const expectObject = (
    expected: Record<string, HookValue>,
    candidate: unknown,
    path: string,
  ): HookAssessment => {
    if (!isPlainObject(candidate)) {
      return HookAssessor.fault(new SpecError("object", candidate, path));
    }

    const errors = HookAssessor.start();

    const expectedKeys = Object.keys(expected) as (keyof typeof expected)[];
    const candidateKeys = Object.keys(candidate);
    const missingKeys = expectedKeys.filter((k) => !candidateKeys.includes(k));
    const extraKeys = candidateKeys.filter((k) => !expectedKeys.includes(k));

    missingKeys.forEach((k) => {
      errors.fault(
        new MissingElementError(`${k}`, expected[k], `${path}.${k}`),
      );
    });

    extraKeys.forEach((k) => {
      errors.fault(new UnexpectedElementError(k, candidate[k], `${path}.${k}`));
    });

    for (const key in expected) {
      if (missingKeys.includes(key)) continue; // already reported

      const keyErrors = evaluate(
        expected[key] as HookValue, // not undefined per earlier check
        candidate[key],
        `${path}.${key}`,
      );

      errors.include(keyErrors);
    }

    return errors;
  };

  return {
    evaluate,
  };
};
