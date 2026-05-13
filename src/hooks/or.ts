import type { HookContext, HookPlugin, HookValue } from "../type";
import { HookAssessor } from "../util/HookAssessment";
import { CollectionError, ConfigError } from "../util/HookError";

export const WYV_KEY_OR = "$or";

type WyvParamsOr = HookValue[];
type WyvContextOr = HookContext<WyvParamsOr>;

const orWyvern: HookPlugin = {
  handles: (value) => [WYV_KEY_OR].includes(value),
  handlers: {
    [WYV_KEY_OR]: (
      value: unknown,
      _expected: HookValue,
      { path, params, evaluate }: WyvContextOr,
    ) => {
      if (!Array.isArray(params)) {
        return HookAssessor.fault(
          new ConfigError("$or value should be an array of templates", path),
        );
      }

      if (params.length === 0) {
        return HookAssessor.fault(
          new ConfigError(`$or must take one or more predicates`, path),
        );
      }

      const errors = HookAssessor.start();
      for (const template of params) {
        const templateErrors = evaluate(template, value, path);
        if (templateErrors.success) return HookAssessor.SUCCESS;
        errors.include(templateErrors);
      }

      return HookAssessor.fault(new CollectionError("$or", path)).include(
        errors,
      );
    },
  },
};

export default orWyvern;
