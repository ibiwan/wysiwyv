import type { WysiwyvEvaluatorFunction } from "../type/engine";
import type { HookValue } from "../type/template";
import type { ContextObject, HookEnviron } from "../type/plugin";
import type { WyvPlugin } from "../type/plugin";
import { HookAssessor, type HookAssessment } from "../util/HookAssessment";
import { errConfig, errMissing, errType } from "../util/HookError";
import { isDefined, isObject, isPlainObject } from "../util/types";

export const WYV_KEY_OBJECT = "$object";
export const WYV_KEY_PLAINOBJECT = "$plainobject";

type WyvParams = {
  $partial?: HookValue;
  $eachElement?: HookValue;
};
type WyvSetup = unknown;
type WyvContext = ContextObject;

const validatePartial = (
  $partial: HookValue,
  value: Record<string, unknown>,
  path: string,
  evaluate: WysiwyvEvaluatorFunction,
): HookAssessment => {
  const errors = HookAssessor.start();
  if (!isPlainObject($partial)) {
    errors.fault(
      errConfig("$object.$partial option should be an object", path),
    );
  } else {
    for (const expectedKey in $partial) {
      if (!(expectedKey in value)) {
        errors.fault(
          errMissing(
            expectedKey,
            $partial[expectedKey],
            `${path}.${expectedKey}`,
          ),
        );
        continue;
      }

      const expectedSub = $partial[expectedKey] as HookValue; // because it came from a hook object
      const candidateSub = value[expectedKey];
      const valueErrors = evaluate(
        expectedSub,
        candidateSub,
        `${path}.${expectedKey}`,
      );
      errors.include(valueErrors);
    }
  }
  return errors;
};

const validateEachElement = (
  $eachElement: HookValue,
  value: Record<string, unknown>,
  path: string,
  evaluate: WysiwyvEvaluatorFunction,
) => {
  const errors = HookAssessor.start();

  for (const valueKey in value) {
    const eachErrors = evaluate(
      $eachElement as HookValue,
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
    { path, params, evaluate }: HookEnviron<WyvParams, WyvSetup, WyvContext>,
  ) => {
    if (plainOnly) {
      if (!isPlainObject(value)) {
        return HookAssessor.fault(errType("plainobject", value, path));
      }
    } else {
      if (!isObject(value)) {
        return HookAssessor.fault(errType("object", value, path));
      }
    }

    const errors = HookAssessor.start();

    const {
      $partial = undefined,
      $eachElement = undefined,
      ...rest
    } = isObject(params) ? params : {};

    if (Object.keys(rest).length > 0) {
      errors.fault(
        errConfig(`Unexpected $object parameters: ${Object.keys(rest)}`, path),
      );
    }

    if (isDefined($partial) && isDefined($eachElement)) {
      errors.fault(
        errConfig(
          "$object options can specify $partial or $eachElement but not both",
          path,
        ),
      );
      return errors;
    }

    if (isDefined($partial)) {
      if (!isPlainObject(value)) {
        errors.fault(errType("plainobject for $partial", value, path));
      } else {
        const entireErrors = validatePartial($partial, value, path, evaluate);
        errors.include(entireErrors);
      }
    }

    if (isDefined($eachElement)) {
      if (!isPlainObject(value)) {
        errors.fault(errType("plainobject for $eachElement", value, path));
      } else {
        const eachErrors = validateEachElement(
          $eachElement,
          value,
          path,
          evaluate,
        );
        errors.include(eachErrors);
      }
    }

    return errors;
  };

const objectWyvern: WyvPlugin<WyvParams, WyvSetup, WyvContext> = {
  handles: (value) => [WYV_KEY_OBJECT, WYV_KEY_PLAINOBJECT].includes(value),
  handlers: {
    [WYV_KEY_OBJECT]: validateObject(false),
    [WYV_KEY_PLAINOBJECT]: validateObject(true),
  },
};

export default objectWyvern;
