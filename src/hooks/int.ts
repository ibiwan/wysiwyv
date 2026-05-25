import type { ContextObject } from "../type/plugin.js";
import type { HookKey } from "../type/plugin.js";
import type { WyvPlugin } from "../type/plugin.js";
import { HookAssessor } from "../util/HookAssessment.js";
import { errType, errAttr } from "../util/HookError.js";
import { isDefined, isNumber, isObject } from "../util/types.js";

export const WYV_KEY_INT: HookKey = "$int";

type WyvParams = {
  $min?: number;
  $max?: number;
};
type WyvSetup = unknown;
type WyvContext = ContextObject;

const intWyvern: WyvPlugin<WyvParams, WyvSetup, WyvContext> = {
  handles: (value) => [WYV_KEY_INT].includes(value),
  handlers: {
    [WYV_KEY_INT]: (value: unknown, _expected, { path, params }) => {
      if (!isNumber(value) || !Number.isInteger(value)) {
        return HookAssessor.fault(errType("integer", value, path));
      }

      const errors = HookAssessor.start();

      const { $min, $max } = isObject(params) ? params : {};

      if (isDefined($min) && isNumber($min) && value < $min) {
        errors.fault(
          errAttr(WYV_KEY_INT + "." + "$min", "≥" + $min, value, path),
        );
      }

      if (isDefined($max) && isNumber($max) && value > $max) {
        errors.fault(
          errAttr(WYV_KEY_INT + "." + "$max", "≤" + $max, value, path),
        );
      }

      return errors;
    },
  },
};

export default intWyvern;
