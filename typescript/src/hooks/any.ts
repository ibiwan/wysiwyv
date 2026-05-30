import type { ContextObject, WyvPlugin } from "../type/plugin.js";
import { HookAssessor } from "../util/HookAssessment.js";

export const WYV_KEY_ANY = "$any";

type WyvParams = unknown;
type WyvSetup = unknown;
type WyvContext = ContextObject;

const anyWyvern: WyvPlugin<WyvParams, WyvSetup, WyvContext> = {
  handles: (value) => [WYV_KEY_ANY].includes(value),
  handlers: {
    [WYV_KEY_ANY]: () => {
      return HookAssessor.SUCCESS;
    },
  },
};

export default anyWyvern;
