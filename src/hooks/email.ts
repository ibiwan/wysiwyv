import type { HookValue } from "../type/template";
import type { ContextObject, WyvPlugin } from "../type/plugin";
import { HookAssessor } from "../util/HookAssessment";
import { SpecError } from "../util/HookError";
import { isString } from "../util/types";

const ncg = (s: string) => `(?:${s})`;
const CHARS = `[a-zA-Z0-9_%+\\-]+`;
const DOT_CHARS = ncg(`\\.${CHARS}`);
const DOTTED_CHARS_ANY = ncg(`${CHARS}${DOT_CHARS}*`);
const DOTTED_CHARS_SOME = ncg(`${CHARS}${DOT_CHARS}+`);
const EMAIL = `${DOTTED_CHARS_ANY}@${DOTTED_CHARS_SOME}`;
const RE_EMAIL_LOOSE = new RegExp(`^${EMAIL}$`);

export const WYV_KEY_EMAIL = "$email";

type WyvParams = unknown;
type WyvSetup = unknown;
type WyvContext = ContextObject;

const emailWyvern: WyvPlugin<WyvParams, WyvSetup, WyvContext> = {
  handles: (value) => [WYV_KEY_EMAIL].includes(value),
  handlers: {
    [WYV_KEY_EMAIL]: (value: unknown, _expected: HookValue, { path }) => {
      if (!isString(value)) {
        return HookAssessor.fault(new SpecError("string", value, path));
      }
      if (!RE_EMAIL_LOOSE.test(value)) {
        return HookAssessor.fault(
          new SpecError("valid email address", value, path),
        );
      }

      return HookAssessor.SUCCESS;
    },
  },
};

export default emailWyvern;
