import type { HookContext, HookKey, HookPlugin } from "../type";
import { HookAssessor } from "../util/HookAssessment";
import { MatchError } from "../util/HookError";

const WYV_KEY_VAL: HookKey = "$val";

type WyvParamsVal = string;
type WyvContextVal = HookContext<WyvParamsVal>;

const valWyvern: HookPlugin = {
  handles: (value) => [WYV_KEY_VAL].includes(value),
  handlers: {
    [WYV_KEY_VAL]: (
      value,
      _expected,
      { path, params: match, matchValues }: WyvContextVal,
    ) => {
      if (!(match in matchValues)) {
        // intentionally mutating passed-in object
        matchValues[match] = value;
        return HookAssessor.SUCCESS;
      }
      if (value !== matchValues[match]) {
        return HookAssessor.fault(
          new MatchError(matchValues[match], value, match, path),
        );
      }

      return HookAssessor.SUCCESS;
    },
  },
};

export default valWyvern;
