import type { ContextObject } from "../type/plugin.js";
import type { WyvPlugin } from "../type/plugin.js";
import { HookAssessor } from "../util/HookAssessment.js";
import { errAttr, errConfig, errType } from "../util/HookError.js";
import {
  isArray,
  isDefined,
  isNumber,
  isObject,
  notNull,
} from "../util/types.js";

export const WYV_KEY_ARRAY = "$array";
export const WYV_ARRAY_PARAM_LENGTH = "$length";
export const WYV_ARRAY_PARAM_MINLENGTH = "$minlength";
export const WYV_ARRAY_PARAM_MAXLENGTH = "$maxlength";
export const WYV_ARRAY_PARAM_EACH = "$each";

type WyvParams = {
  [WYV_ARRAY_PARAM_LENGTH]?: number;
  [WYV_ARRAY_PARAM_MINLENGTH]?: number;
  [WYV_ARRAY_PARAM_MAXLENGTH]?: number;
  [WYV_ARRAY_PARAM_EACH]?: unknown;
};
type WyvSetup = unknown;
type WyvContext = ContextObject;

const arrayWyvern: WyvPlugin<WyvParams, WyvSetup, WyvContext> = {
  handles: (value) => [WYV_KEY_ARRAY].includes(value),
  handlers: {
    [WYV_KEY_ARRAY]: (value, _expected, { path, params, evaluate }) => {
      if (!isArray(value)) {
        return HookAssessor.fault(errType("array", value, path));
      }

      const errors = HookAssessor.start();

      const normalizedParams = isObject(params)
        ? params
        : { [WYV_ARRAY_PARAM_EACH]: params };

      const {
        [WYV_ARRAY_PARAM_LENGTH]: length,
        [WYV_ARRAY_PARAM_MINLENGTH]: minLength,
        [WYV_ARRAY_PARAM_MAXLENGTH]: maxLength,
        [WYV_ARRAY_PARAM_EACH]: each,
        ...rest
      } = normalizedParams;

      const isParametric: boolean =
        isDefined(length) ||
        isDefined(minLength) ||
        isDefined(maxLength) ||
        isDefined(each);

      if (isParametric && Object.keys(rest).length > 0) {
        errors.fault(
          errConfig(
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
          errAttr(
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
          errAttr(
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
          errAttr(
            WYV_KEY_ARRAY + "." + WYV_ARRAY_PARAM_MAXLENGTH,
            maxLength,
            value.length,
            path,
          ),
        );
      }

      if (notNull(useEach)) {
        for (const [index, element] of value.entries()) {
          const elementErrors = evaluate(useEach, element, [...path, index]);
          errors.include(elementErrors);
        }
      }

      return errors;
    },
  },
};

export default arrayWyvern;
