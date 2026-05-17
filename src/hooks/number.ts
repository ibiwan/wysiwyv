import type { ContextObject } from "../type/plugin";
import type { HookKey } from "../type/plugin";
import type { WyvPlugin } from "../type/plugin";
import { HookAssessor } from "../util/HookAssessment";
import { AttributeError, SpecError } from "../util/HookError";
import { isDefined, isNumber, isObject } from "../util/types";

export const WYV_KEY_NUMBER: HookKey = "$number";

type WyvParams = {
  $min?: number;
  $max?: number;
  $gt?: number;
  $lt?: number;
};
type WyvSetup = unknown;
type WyvContext = ContextObject;

const numberWyvern: WyvPlugin<WyvParams, WyvSetup, WyvContext> = {
  handles: (value) => [WYV_KEY_NUMBER].includes(value),
  handlers: {
    [WYV_KEY_NUMBER]: (value: unknown, _expected, { path, params }) => {
      if (!isNumber(value)) {
        return HookAssessor.fault(new SpecError("number", value, path));
      }
      const errors = HookAssessor.start();
      const { $min, $max, $gt, $lt } = isObject(params) ? params : {};
      if (isDefined($min) && value < $min) {
        errors.fault(
          new AttributeError(
            WYV_KEY_NUMBER + "." + "$min",
            "≥" + $min,
            value,
            path,
          ),
        );
      }
      if (isDefined($max) && value > $max) {
        errors.fault(
          new AttributeError(
            WYV_KEY_NUMBER + "." + "$max",
            "≤" + $max,
            value,
            path,
          ),
        );
      }
      if (isDefined($gt) && value <= $gt) {
        errors.fault(
          new AttributeError(
            WYV_KEY_NUMBER + "." + "$gt",
            ">" + $gt,
            value,
            path,
          ),
        );
      }
      if (isDefined($lt) && value >= $lt) {
        errors.fault(
          new AttributeError(
            WYV_KEY_NUMBER + "." + "$lt",
            "<" + $lt,
            value,
            path,
          ),
        );
      }
      return errors;
    },
  },
};

export default numberWyvern;
