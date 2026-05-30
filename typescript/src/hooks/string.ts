import type { ContextObject, WyvPlugin } from "../type/plugin.js";
import { HookAssessor } from "../util/HookAssessment.js";
import { isString } from "../util/types.js";
import { errType } from "../util/HookError.js";

export const WYV_KEY_STRING = "$string";

type WyvParams = unknown;
type WyvSetup = unknown;
type WyvContext = ContextObject;

const stringWyvern: WyvPlugin<WyvParams, WyvSetup, WyvContext> = {
  handles: (value) => [WYV_KEY_STRING].includes(value),
  handlers: {
    [WYV_KEY_STRING]: (value, _expected, { path }) => {
      if (!isString(value)) {
        return HookAssessor.fault(errType("string", value, path));
      }
      return HookAssessor.SUCCESS;
    },
  },
};

export default stringWyvern;
