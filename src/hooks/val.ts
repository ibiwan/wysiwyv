import type { HookKey } from "../type/plugin.js";
import type { WyvPlugin } from "../type/plugin.js";
import { HookAssessor } from "../util/HookAssessment.js";
import { errMatch } from "../util/HookError.js";

const WYV_KEY_VAL: HookKey = "$val";

type MatchDictionary = Record<string, unknown>;

type WyvParams = string;
type WyvSetup = MatchDictionary;
type WyvContext = { matches: MatchDictionary };

const valWyvern: WyvPlugin<WyvParams, WyvSetup, WyvContext> = {
  handles: (value) => [WYV_KEY_VAL].includes(value),
  handlers: {
    [WYV_KEY_VAL]: (
      value,
      _expected,
      { path, params: match, setup, context },
    ) => {
      if (context.matches === undefined) {
        // initialize matches on first call
        context.matches = setup ?? {};
      }

      if (!(match in context.matches)) {
        // intentionally mutating passed-in object
        context.matches[match] = value;
        return HookAssessor.SUCCESS;
      }

      if (value !== context.matches[match]) {
        return HookAssessor.fault(
          errMatch(context.matches[match], value, match, path),
        );
      }

      return HookAssessor.SUCCESS;
    },
  },
};

export default valWyvern;
