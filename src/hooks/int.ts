import type { HookContext, HookKey, HookPlugin } from "../type";
import { HookAssessor } from "../util/HookAssessment";
import { AttributeError, SpecError } from "../util/HookError";
import { isDefined, isNumber, isObject } from "../util/types";

export const WYV_KEY_INT: HookKey = "$int";

type WyvParamsInt = {
  $min?: number;
  $max?: number;
};
type WyvContextInt = HookContext<WyvParamsInt>;

const intWyvern: HookPlugin = {
  handles: (value) => [WYV_KEY_INT].includes(value),
  handlers: {
    [WYV_KEY_INT]: (
      value: unknown,
      _expected,
      { path, params }: WyvContextInt,
    ) => {
      if (!isNumber(value) || !Number.isInteger(value)) {
        return HookAssessor.fault(new SpecError("integer", value, path));
      }

      const errors = HookAssessor.start();

      const { $min, $max } = isObject(params) ? params : {};

      if (isDefined($min) && isNumber($min) && value < $min) {
        errors.fault(
          new AttributeError(WYV_KEY_INT + "." + "$min", $min, value, path),
        );
      }

      if (isDefined($max) && isNumber($max) && value > $max) {
        errors.fault(
          new AttributeError(WYV_KEY_INT + "." + "$max", $min, value, path),
        );
      }

      return errors;
    },
  },
};

export default intWyvern;
