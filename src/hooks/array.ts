import type { HookEnviron } from "../type/plugin";
import type { WyvPlugin } from "../type/plugin";
import { HookAssessor } from "../util/HookAssessment";
import { AttributeError, ConfigError, SpecError } from "../util/HookError";
import { isArray, isDefined, isNumber, isObject, notNull } from "../util/types";

export const WYV_KEY_ARRAY = "$array";
export const WYV_ARRAY_PARAM_LENGTH = "$length";
export const WYV_ARRAY_PARAM_MINLENGTH = "$minlength";
export const WYV_ARRAY_PARAM_MAXLENGTH = "$maxlength";
export const WYV_ARRAY_PARAM_EACH = "$each";

type WyvParamsArray = {
  [WYV_ARRAY_PARAM_LENGTH]?: number;
  [WYV_ARRAY_PARAM_MINLENGTH]?: number;
  [WYV_ARRAY_PARAM_MAXLENGTH]?: number;
  [WYV_ARRAY_PARAM_EACH]?: unknown;
};
type WyvSetupArray = object;
type WyvContextArray = HookEnviron<WyvParamsArray>;

const arrayWyvern: WyvPlugin<WyvParamsArray, WyvSetupArray, WyvContextArray> = {
  handles: (value) => [WYV_KEY_ARRAY].includes(value),
  handlers: {
    [WYV_KEY_ARRAY]: (
      value,
      _expected,
      { path, params, evaluate }: WyvContextArray,
    ) => {
      if (!isArray(value)) {
        return HookAssessor.fault(new SpecError("array", value, path));
      }

      const errors = HookAssessor.start();

      const {
        [WYV_ARRAY_PARAM_LENGTH]: length,
        [WYV_ARRAY_PARAM_MINLENGTH]: minLength,
        [WYV_ARRAY_PARAM_MAXLENGTH]: maxLength,
        [WYV_ARRAY_PARAM_EACH]: each,
        ...rest
      } = isObject(params) ? params : {};

      const isParametric: boolean =
        isDefined(length) ||
        isDefined(minLength) ||
        isDefined(maxLength) ||
        isDefined(each);

      if (isParametric && Object.keys(rest).length > 0) {
        errors.fault(
          new ConfigError(
            `Ignored unknown $array parameters: '${Object.keys(rest)}'`,
            path,
          ),
        );
      }

      const useEach = isParametric
        ? each
        : Object.keys(rest).length > 0
          ? rest
          : null;

      if (isDefined(length) && value.length !== length) {
        errors.fault(
          new AttributeError(
            WYV_KEY_ARRAY + "." + WYV_ARRAY_PARAM_LENGTH,
            length,
            value.length,
            path,
          ),
        );
      }

      if (
        isDefined(minLength) &&
        isNumber(minLength) &&
        value.length < minLength
      ) {
        errors.fault(
          new AttributeError(
            WYV_KEY_ARRAY + "." + WYV_ARRAY_PARAM_MINLENGTH,
            minLength,
            value.length,
            path,
          ),
        );
      }

      if (
        isDefined(maxLength) &&
        isNumber(maxLength) &&
        value.length > maxLength
      ) {
        errors.fault(
          new AttributeError(
            WYV_KEY_ARRAY + "." + WYV_ARRAY_PARAM_MAXLENGTH,
            maxLength,
            value.length,
            path,
          ),
        );
      }

      if (notNull(useEach)) {
        for (const [index, element] of value.entries()) {
          const elementErrors = evaluate(useEach, element, `${path}[${index}]`);
          errors.include(elementErrors);
        }
      }

      return errors;
    },
  },
};

export default arrayWyvern;
