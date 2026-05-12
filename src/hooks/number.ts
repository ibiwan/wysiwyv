import type { HookContext, HookKey, HookPlugin } from "../type";
import { HookAssessor } from "../util/HookAssessment";
import { AttributeError, SpecError } from "../util/HookError";
import { isDefined, isNumber, isObject } from "../util/types";

export const WYV_KEY_NUMBER: HookKey = "$number";

type WyvParamsNumber = { $min?: number; $max?: number };
type WyvContextNumber = HookContext<WyvParamsNumber>;

const numberWyvern: HookPlugin = {
  handles: (value) => [WYV_KEY_NUMBER].includes(value),
  handlers: {
    [WYV_KEY_NUMBER]: (
      value: unknown,
      _expected,
      { path, params }: WyvContextNumber,
    ) => {
      if (!isNumber(value)) {
        return HookAssessor.fault(new SpecError("number", value, path));
      }
      const errors = HookAssessor.start();
      const { $min, $max } = isObject(params) ? params : {};
      if (isDefined($min) && value < $min) {
        errors.fault(
          new AttributeError(WYV_KEY_NUMBER + "." + "$min", $min, value, path),
        );
      }
      if (isDefined($max) && value > $max) {
        errors.fault(
          new AttributeError(WYV_KEY_NUMBER + "." + "$max", $max, value, path),
        );
      }
      return errors;
    },
  },
};

export default numberWyvern;
