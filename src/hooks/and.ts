import type { HookValue } from "../type/template";
import type { HookEnviron } from "../type/plugin";
import type { WyvPlugin } from "../type/plugin";
import { HookAssessor } from "../util/HookAssessment";
import { CollectionError, ConfigError } from "../util/HookError";

export const WYV_KEY_AND = "$and";

type WyvParamsAnd = HookValue[];
type WyvSetupAnd = object;
type WyvContextAnd = HookEnviron<WyvParamsAnd>;

const andWyvern: WyvPlugin<WyvParamsAnd, WyvSetupAnd, WyvContextAnd> = {
  handles: (value) => [WYV_KEY_AND].includes(value),
  handlers: {
    [WYV_KEY_AND]: (
      value: unknown,
      _expected: HookValue,
      { path, params, evaluate }: WyvContextAnd,
    ) => {
      if (!Array.isArray(params)) {
        return HookAssessor.fault(
          new ConfigError("$and value should be an array of templates", path),
        );
      }

      const errors = HookAssessor.start();

      for (const template of params) {
        const templateErrors = evaluate(template, value, path);
        errors.include(templateErrors);
      }

      if (errors.success) {
        return HookAssessor.SUCCESS;
      }

      const a = HookAssessor.fault(new CollectionError("$and", path));

      const final = a.include(errors);

      return final;
    },
  },
};

export default andWyvern;
