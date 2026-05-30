import fs from "fs";

import type { PluginList } from "../src/type/plugin";
import { makeWysiwyv } from "../src/wysiwyv";
import {
  assertResultFromErrors,
  getSpecs,
  type TestSpec,
  type TestStep,
} from "../test-util";
import countWyvern from "./custom-plugins/count";

// Spec-level placeholders for language-specific types that can't be
// represented in YAML. Each implementing language provides its own
// mapping. Tests referencing placeholders absent from the map are skipped.
const PLACEHOLDERS: Record<string, { value: unknown; repr: string }> = {
  __DATE__: {
    value: new Date("2000-01-01T00:00:00.000Z"),
    repr: "2000-01-01T00:00:00.000Z",
  },
  __REGEX__: { value: /a/, repr: "/a/" },
  __BOXED_STRING__: { value: new String("a"), repr: "a" },
  __MAP__: { value: new Map(), repr: "Map {}" },
  __SET__: { value: new Set(), repr: "Set {}" },
  __CLASS__: { value: class Placeholder {}, repr: "class Placeholder" },
  __ANON_FN__: { value: (() => () => {})(), repr: "function (anonymous)" },
  __NULL_PROTO__: { value: Object.create(null), repr: "{}" },
  __NAN__: { value: NaN, repr: "NaN" },
  __POS_INF__: { value: Infinity, repr: "Infinity" },
  __NEG_INF__: { value: -Infinity, repr: "-Infinity" },
  __UNDEFINED__: { value: undefined, repr: "undefined" },
  __SYMBOL__: { value: Symbol(4), repr: "Symbol(4)" },
  __BIGINT__: { value: BigInt(100), repr: "100" },
  __BIGINT_LARGE__: { value: BigInt("9007199254740993"), repr: "9007199254740993" },
  __READABLE_STREAM__: { value: new ReadableStream(), repr: "ReadableStream" },
  __PROXY__: { value: new Proxy({}, {}), repr: "{}" },
  __ASYNC_FN__: { value: async () => {}, repr: "function (anonymous)" },
  __GENERATOR_FN__: { value: function* () {}, repr: "function (anonymous)" },
  __CLASS_INSTANCE__: { value: new (class Foo {})(), repr: "{}" },
};

// Test-fixture plugins available to YAML specs via the `plugins` key.
// Each implementing language provides its own registry mapping these
// names to native plugin implementations.
const TEST_PLUGINS: Record<string, PluginList[number]> = {
  count: countWyvern,
};

const PLACEHOLDER_RE = /__[A-Z_]+__/g;

const isPlaceholder = (val: unknown): val is string =>
  typeof val === "string" && val in PLACEHOLDERS;

function resolve(obj: unknown, mode: "value" | "repr"): unknown {
  if (isPlaceholder(obj)) {
    const p = PLACEHOLDERS[obj];
    if (p) return mode === "value" ? p.value : p.repr;
  }
  if (typeof obj === "string" && mode === "repr") {
    let result = obj;
    for (const [name, p] of Object.entries(PLACEHOLDERS)) {
      if (p && result.includes(name)) {
        result = result.replaceAll(name, p.repr);
      }
    }
    return result;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => resolve(item, mode));
  }
  if (obj !== null && typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(obj)) {
      result[key] = resolve(val, mode);
    }
    return result;
  }
  return obj;
}

function hasUnsupportedPlaceholder(spec: TestSpec): boolean {
  const json = JSON.stringify(spec);
  const matches = json.match(PLACEHOLDER_RE) || [];
  return matches.some((m) => !(m in PLACEHOLDERS));
}

function resolveStep(step: TestStep): TestStep {
  return {
    ...step,
    candidate: resolve(step.candidate, "value"),
    template: resolve(step.template, "value") as TestStep["template"],
    expected: resolve(step.expected, "repr") as TestStep["expected"],
  };
}

function resolveSpec(spec: TestSpec): TestSpec {
  const base = {
    ...spec,
    setup: spec.setup
      ? (resolve(spec.setup, "value") as TestSpec["setup"])
      : undefined,
  };

  if (spec.steps) {
    return { ...base, steps: spec.steps.map(resolveStep) } as TestSpec;
  }

  return {
    ...base,
    candidate: resolve(spec.candidate, "value"),
    template: resolve(spec.template, "value") as TestSpec["template"],
    expected: resolve(spec.expected, "repr") as TestSpec["expected"],
  } as TestSpec;
}

const specFiles = fs
  .readdirSync("../spec")
  .filter((file) => file.endsWith(".yaml"));

describe("automated", () => {
  specFiles.forEach((specFile) => {
    describe(specFile, () => {
      const testSpecs = getSpecs(`../spec/${specFile}`);
      testSpecs.forEach((spec) => {
        if (hasUnsupportedPlaceholder(spec)) {
          it.skip(spec.description, () => {});
          return;
        }

        it(spec.description, () => {
          const resolved = resolveSpec(spec);
          const plugins = (resolved.plugins ?? []).map((name) => {
            const plugin = TEST_PLUGINS[name];
            if (!plugin) throw new Error(`Unknown test plugin: ${name}`);
            return plugin;
          });

          const wyv = makeWysiwyv({
            ...(resolved.setup ? { pluginSetups: resolved.setup } : {}),
            ...(plugins.length > 0 ? { plugins } : {}),
          });

          if (resolved.steps) {
            for (const step of resolved.steps) {
              const actual = wyv.validate(
                step.template,
                step.candidate,
                step.options?.keepContext,
              );
              assertResultFromErrors(actual, step.expected);

              if (step.context) {
                const ctx = wyv.peekContext();
                if (step.context.shared) {
                  expect(ctx.sharedContext).toEqual(
                    expect.objectContaining(step.context.shared),
                  );
                }
                if (step.context.perHook) {
                  for (const [hookName, expectedCtx] of Object.entries(
                    step.context.perHook,
                  )) {
                    expect(ctx.perHookContexts[hookName]).toEqual(
                      expect.objectContaining(expectedCtx),
                    );
                  }
                }
              }
            }
          } else {
            const actual = wyv.validate(resolved.template, resolved.candidate);
            assertResultFromErrors(actual, resolved.expected);
          }
        });
      });
    });
  });
});
