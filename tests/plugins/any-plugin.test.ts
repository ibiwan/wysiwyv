import type { WysiwyvInstance } from "../../src/type/engine";
import { makeWysiwyv } from "../../src/wysiwyv";
import { assertSuccess } from "../../test-util";

describe("Any Type Plugin", () => {
  let wyv: WysiwyvInstance;

  beforeEach(() => {
    wyv = makeWysiwyv();
  });

  const ANY_VALUE = [
    { label: "null", value: null },
    { label: "undefined", value: undefined },
    { label: "0", value: 0 },
    { label: "1", value: 1 },
    { label: "false", value: false },
    { label: "true", value: true },
    { label: "empty string", value: "" },
    { label: '"a"', value: "a" },
    { label: "[]", value: [] },
    { label: "[0]", value: [0] },
    { label: "{}", value: {} },
    { label: "{a:1}", value: { a: 1 } },
    { label: "Date", value: new Date() },
    { label: "RegEx", value: /a/ },
    { label: "Symbol", value: Symbol("a") },
    { label: "new Object", value: new Object(null) },
    { label: "Object.create", value: Object.create(null) },
    { label: "ReadableStream instance", value: new ReadableStream() },
    { label: "ReadableStream class", value: ReadableStream },
    { label: "NaN", value: NaN },
    { label: "-0", value: -0 },
    { label: "BigInt", value: BigInt(1) },
    { label: "Proxy({}, {})", value: new Proxy({}, {}) },
    // { label: "arguments", value: arguments },
    { label: "arrow fn", value: () => {} },
    { label: "named fn", value: function () {} },
    { label: "async fn", value: async () => {} },
    { label: "generator fn", value: function* () {} },
    { label: "class", value: class {} },
    { label: "empty proxy", value: new Proxy({}, {}) },
    { label: "new Proxy", value: new Proxy({}, {}) },
    { label: "new (class Foo{})()", value: new (class Foo {})() },
    { label: "Infinity", value: Infinity },
    { label: "-Infinity", value: -Infinity },
    { label: "0n", value: 0n },
    { label: "100n", value: 100n },
  ];

  test.each(ANY_VALUE)(
    "validates anything, specifically $label",
    ({ value }) => {
      const expected = { a: "$any" };

      const candidate = { a: value };

      const result = wyv.validate(expected, candidate);

      assertSuccess(result);
    },
  );
});
