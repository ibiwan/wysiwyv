import type { ContextObject, WyvPlugin } from "../type/plugin";
import { HookAssessor } from "../util/HookAssessment";
import { isString } from "../util/types";
import { errType } from "../util/HookError";

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
