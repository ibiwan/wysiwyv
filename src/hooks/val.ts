import type { HookKey } from "../type/plugin";
import type { WyvPlugin } from "../type/plugin";
import { HookAssessor } from "../util/HookAssessment";
import { MatchError } from "../util/HookError";

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
        context.matches = setup ?? {};
      }

      if (!(match in context.matches)) {
        // intentionally mutating passed-in object
        context.matches[match] = value;
        return HookAssessor.SUCCESS;
      }

      if (value !== context.matches[match]) {
        return HookAssessor.fault(
          new MatchError(context.matches[match], value, match, path),
        );
      }

      return HookAssessor.SUCCESS;
    },
  },
};

export default valWyvern;
