import type { HookValue } from "../type/template.js";
import type { ContextObject } from "../type/plugin.js";
import type { WyvPlugin } from "../type/plugin.js";
import { HookAssessor } from "../util/HookAssessment.js";
import { errColl, errConfig } from "../util/HookError.js";

export const WYV_KEY_OR = "$or";

type WyvParams = HookValue[];
type WyvSetup = unknown;
type WyvContext = ContextObject;

const orWyvern: WyvPlugin<WyvParams, WyvSetup, WyvContext> = {
  handles: (value) => [WYV_KEY_OR].includes(value),
  handlers: {
    [WYV_KEY_OR]: (
      value: unknown,
      _expected: HookValue,
      { path, params, evaluate },
    ) => {
      if (!Array.isArray(params)) {
        return HookAssessor.fault(
          errConfig("$or value should be an array of templates", path),
        );
      }

      if (params.length === 0) {
        // OR(<no arguments>) is defined as FALSE for boolean algebra
        return HookAssessor.fault(
          errConfig(`$or must take one or more predicates`, path),
        );
      }

      const errors = HookAssessor.start();
      for (const template of params) {
        const templateErrors = evaluate(template, value, path);
        if (templateErrors.success) return HookAssessor.SUCCESS;
        errors.include(templateErrors);
      }

      return HookAssessor.fault(errColl("$or", path)).include(errors);
    },
  },
};

export default orWyvern;
