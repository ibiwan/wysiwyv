import type { WyvPlugin } from "../type/plugin";
import { HookAssessor } from "../util/HookAssessment";

export const WYV_KEY_ANY = "$any";

const anyWyvern: WyvPlugin = {
  handles: (value) => [WYV_KEY_ANY].includes(value),
  handlers: {
    [WYV_KEY_ANY]: () => {
      return HookAssessor.SUCCESS;
    },
  },
};

export default anyWyvern;
