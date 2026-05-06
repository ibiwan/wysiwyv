import type { HookKey, HookPlugin, HookValue, MatchValues } from "../wysiwyv";

const WYV_KEY_VAL: HookKey = '$val';

const valWyvern: HookPlugin = {
  handles: (value) => [WYV_KEY_VAL].includes(value),
  handlers: {
    [WYV_KEY_VAL]: (value, _expected, path, params, matchValues) => {
      const match = params;

      if (!(match in matchValues)) {
        matchValues[match] = value;
        return [];
      }
      if (value !== matchValues[match]) {
        return [{
          message: `Expected value with key '${match}' to match previous value '${matchValues[match]}', got '${value}'`,
          path
        }];
      }
      return [];
    }
  }
}

export default valWyvern;
