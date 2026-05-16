import type { WysiwyvEvaluatorFunction } from "../type";
import type { HookValue } from "../type/template";
import type { HookEnviron } from "../type/plugin";
import type { WyvPlugin } from "../type/plugin";
import { HookAssessor, type HookAssessment } from "../util/HookAssessment";
import {
  ConfigError,
  MissingElementError,
  SpecError,
  UnexpectedElementError,
} from "../util/HookError";
import { isDefined, isObject, isPlainObject } from "../util/types";

export const WYV_KEY_OBJECT = "$object";
export const WYV_KEY_PLAINOBJECT = "$plainobject";

type WyvParamsObject = {
  $allowOthers?: boolean;
  $entireValue?: HookValue;
  $eachValue?: HookValue;
};
type WyvSetupObject = object;
type WyvContextObject = HookEnviron<WyvParamsObject>;

const validateEntireValue = (
  $entireValue: HookValue,
  value: Record<string, unknown>,
  $allowOthers: boolean,
  path: string,
  evaluate: WysiwyvEvaluatorFunction,
): HookAssessment => {
  const errors = HookAssessor.start();
  if (!isPlainObject($entireValue)) {
    errors.fault(
      new ConfigError("$object.$entireValue option should be an object", path),
    );
  } else {
    for (const expectedKey in $entireValue) {
      if (!(expectedKey in value)) {
        errors.fault(
          new MissingElementError(
            expectedKey,
            $entireValue[expectedKey],
            `${path}.${expectedKey}`,
          ),
        );
        continue;
      }

      const expectedSub = $entireValue[expectedKey] as HookValue; // because it came from a hook object
      const candidateSub = value[expectedKey];
      const valueErrors = evaluate(
        expectedSub,
        candidateSub,
        `${path}.${expectedKey}`,
      );
      errors.include(valueErrors);
    }
    if (!$allowOthers) {
      for (const valueKey in value) {
        if (!(valueKey in $entireValue))
          errors.fault(
            new UnexpectedElementError(
              valueKey,
              value[valueKey],
              `${path}.${valueKey}`,
            ),
          );
      }
    }
  }
  return errors;
};

const validateEachValue = (
  $eachValue: HookValue,
  value: Record<string, unknown>,
  path: string,
  evaluate: WysiwyvEvaluatorFunction,
) => {
  const errors = HookAssessor.start();

  for (const valueKey in value) {
    const eachErrors = evaluate(
      $eachValue as HookValue,
      value[valueKey],
      `${path}.${valueKey}`,
    );
    errors.include(eachErrors);
  }
  return errors;
};

const validateObject =
  (plainOnly: boolean) =>
  (
    value: unknown,
    _expected: HookValue,
    { path, params, evaluate }: WyvContextObject,
  ) => {
    if (plainOnly) {
      if (!isPlainObject(value)) {
        return HookAssessor.fault(new SpecError("plainobject", value, path));
      }
    } else {
      if (!isObject(value)) {
        return HookAssessor.fault(new SpecError("object", value, path));
      }
    }

    const errors = HookAssessor.start();

    const {
      $allowOthers = true,
      $entireValue = undefined,
      $eachValue = undefined,
      ...rest
    } = isObject(params) ? params : {};

    if (Object.keys(rest).length > 0) {
      errors.fault(
        new ConfigError(
          `Unexpected $object parameters: ${Object.keys(rest)}`,
          path,
        ),
      );
    }

    if (isDefined($entireValue) && isDefined($eachValue)) {
      errors.fault(
        new ConfigError(
          "$object options can specify $entireValue or $eachValue but not both",
          path,
        ),
      );
      return errors;
    }

    if (isDefined($entireValue)) {
      if (!isPlainObject(value)) {
        errors.fault(
          new SpecError("plainobject for $entireValue", value, path),
        );
      } else {
        const entireErrors = validateEntireValue(
          $entireValue,
          value,
          $allowOthers,
          path,
          evaluate,
        );
        errors.include(entireErrors);
      }
    }

    if (isDefined($eachValue)) {
      if (!isPlainObject(value)) {
        errors.fault(new SpecError("plainobject for $eachValue", value, path));
      } else {
        const eachErrors = validateEachValue($eachValue, value, path, evaluate);
        errors.include(eachErrors);
      }
    }

    return errors;
  };

const objectWyvern: WyvPlugin<
  WyvParamsObject,
  WyvSetupObject,
  WyvContextObject
> = {
  handles: (value) => [WYV_KEY_OBJECT, WYV_KEY_PLAINOBJECT].includes(value),
  handlers: {
    [WYV_KEY_OBJECT]: validateObject(false),
    [WYV_KEY_PLAINOBJECT]: validateObject(true),
  },
};

export default objectWyvern;
