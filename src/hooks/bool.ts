import type { HookValue } from "../type/template";
import type { WyvPlugin } from "../type/plugin";
import { HookAssessor } from "../util/HookAssessment";
import { SpecError } from "../util/HookError";
import { isBoolean } from "../util/types";

export const WYV_KEY_BOOL = "$bool";

const boolWyvern: WyvPlugin = {
  handles: (value) => [WYV_KEY_BOOL].includes(value),
  handlers: {
    [WYV_KEY_BOOL]: (value: unknown, _expected: HookValue, { path }) => {
      if (!isBoolean(value)) {
        return HookAssessor.fault(new SpecError("boolean", value, path));
      }
      return HookAssessor.SUCCESS;
    },
  },
};

export default boolWyvern;
