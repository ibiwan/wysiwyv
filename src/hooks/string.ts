import type { HookValue } from "../type/template";
import type { ContextObject, WyvPlugin } from "../type/plugin";
import { HookAssessor } from "../util/HookAssessment";
import { SpecError } from "../util/HookError";
import { isString } from "../util/types";

export const WYV_KEY_STRING = "$string";

type WyvParams = unknown;
type WyvSetup = unknown;
type WyvContext = ContextObject;

const stringWyvern: WyvPlugin<WyvParams, WyvSetup, WyvContext> = {
  handles: (value) => [WYV_KEY_STRING].includes(value),
  handlers: {
    [WYV_KEY_STRING]: (value: unknown, _expected: HookValue, { path }) => {
      if (!isString(value)) {
        return HookAssessor.fault(new SpecError("string", value, path));
      }
      return HookAssessor.SUCCESS;
    },
  },
};

export default stringWyvern;
