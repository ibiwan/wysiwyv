import type { HookValue } from "../type/template";
import type { ContextObject, WyvPlugin } from "../type/plugin";
import { HookAssessor } from "../util/HookAssessment";

import { isBoolean } from "../util/types";
import { errType } from "../util/HookError";

export const WYV_KEY_BOOL = "$bool";

type WyvParams = unknown;
type WyvSetup = unknown;
type WyvContext = ContextObject;

const boolWyvern: WyvPlugin<WyvParams, WyvSetup, WyvContext> = {
  handles: (value) => [WYV_KEY_BOOL].includes(value),
  handlers: {
    [WYV_KEY_BOOL]: (value: unknown, _expected: HookValue, { path }) => {
      if (!isBoolean(value)) {
        return HookAssessor.fault(errType("boolean", value, path));
      }
      return HookAssessor.SUCCESS;
    },
  },
};

export default boolWyvern;
