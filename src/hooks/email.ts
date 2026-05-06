import type { HookPlugin } from "../wysiwyv";

const RE_EMAIL_LOOSE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const WYV_KEY_EMAIL = '$email'

const emailWyvern: HookPlugin = {
  handles: (value) => [WYV_KEY_EMAIL].includes(value),
  handlers: {
    [WYV_KEY_EMAIL]: (value: any, _expected: any, path: any) => {
      if (!RE_EMAIL_LOOSE.test(value)) {
        return [{
          message: `Expected value to be a valid email address, got '${value}'`,
          path
        }];
      }
      return [];
    },
  }
}

export default emailWyvern;
