import type { WyvPlugin } from "../../src/type/plugin";
import { HookAssessor } from "../../src/util/HookAssessment";

const countWyvern: WyvPlugin<null, null, { count: number }> = {
  handles: (value) => ["$count"].includes(value),
  handlers: {
    $count: (_value, _expected, options) => {
      options.context.count ??= 0;
      options.context.count++;

      options.shared.count = ((options?.shared?.count as number) ?? 0) + 1;

      return HookAssessor.SUCCESS;
    },
  },
};

export default countWyvern;
