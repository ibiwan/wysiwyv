import type { HookPlugin, HookValue } from "../type";
import { HookAssessor } from "../util/HookAssessment";
import { SpecError } from "../util/HookError";
import { isBoolean } from "../util/types";

export const WYV_KEY_BOOL = "$bool";

const boolWyvern: HookPlugin = {
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
