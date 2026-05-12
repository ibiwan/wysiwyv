import type { HookContext, HookPlugin, HookValue } from "../type";
import { HookAssessor } from "../util/HookAssessment";
import {
  ConfigError,
  MissingElementError,
  SpecError,
  UnexpectedElementError,
  UnexpectedElementsError,
} from "../util/HookError";
import { isDefined, isObject } from "../util/types";

export const WYV_KEY_OBJECT = "$object";

type WyvParamsObject = {
  $allowOthers?: boolean;
  $entireValue?: HookValue;
  $eachValue?: HookValue;
};
type WyvContextObject = HookContext<WyvParamsObject>;

const objectWyvern: HookPlugin = {
  handles: (value) => [WYV_KEY_OBJECT].includes(value),
  handlers: {
    [WYV_KEY_OBJECT]: (
      value: unknown,
      _expected: HookValue,
      { path, params, evaluate }: WyvContextObject,
    ) => {
      if (!isObject(value)) {
        return HookAssessor.fault(new SpecError("object", value, path));
      }
      const errors = HookAssessor.start();
      const {
        $allowOthers = true,
        $entireValue = undefined,
        $eachValue = undefined,
        ...rest
      } = isObject(params) ? params : {};

      if (Object.keys(rest).length > 0) {
        errors.fault(new UnexpectedElementsError(Object.keys(rest), path));
      }

      if (isDefined($entireValue) && isDefined($eachValue)) {
        errors.fault(
          new ConfigError(
            "$object options can specify $entireValue or $eachValue but not both",
            path,
          ),
        );
      }

      if (isDefined($entireValue)) {
        if (!isObject($entireValue)) {
          errors.fault(
            new ConfigError(
              "$object.$entireValue option should be an object",
              path,
            ),
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
      }

      if (isDefined($eachValue)) {
        for (const valueKey in value) {
          const eachErrors = evaluate(
            $eachValue as HookValue,
            value[valueKey],
            `${path}.${valueKey}`,
          );
          errors.include(eachErrors);
        }
      }

      return errors;
    },
  },
};

export default objectWyvern;
