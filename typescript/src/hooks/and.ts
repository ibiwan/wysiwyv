import type { HookValue } from "../type/template.js";
import type { ContextObject } from "../type/plugin.js";
import type { WyvPlugin } from "../type/plugin.js";
import { HookAssessor } from "../util/HookAssessment.js";
import { errColl, errConfig } from "../util/HookError.js";

export const WYV_KEY_AND = "$and";

type WyvParams = HookValue[];
type WyvSetup = unknown;
type WyvContext = ContextObject;

const andWyvern: WyvPlugin<WyvParams, WyvSetup, WyvContext> = {
  handles: (value) => [WYV_KEY_AND].includes(value),
  handlers: {
    [WYV_KEY_AND]: (
      value: unknown,
      _expected: HookValue,
      { path, params, evaluate },
    ) => {
      if (!Array.isArray(params)) {
        return HookAssessor.fault(
          errConfig("$and value should be an array of templates", path),
        );
      }

      if (params.length === 0) {
        // AND(<no arguments>) is defined as TRUE for boolean algebra
        return HookAssessor.SUCCESS;
      }

      const errors = HookAssessor.start();

      for (const template of params) {
        const templateErrors = evaluate(template, value, path);
        errors.include(templateErrors);
      }

      if (errors.success) {
        return HookAssessor.SUCCESS;
      }

      const a = HookAssessor.fault(errColl("$and", path));

      const final = a.include(errors);

      return final;
    },
  },
};

export default andWyvern;
