import type { HookValue, WysiwyvInstance } from "../../src/type";
import { makeWysiwyv } from "../../src/wysiwyv";

describe("Int Type Plugin", () => {
  let wyv: WysiwyvInstance;

  beforeEach(() => {
    wyv = makeWysiwyv();
  });

  const INTS = [
    0.0,
    0,
    -0,
    10,
    -10,
    1.0,
    -1.0,
    Number.MAX_SAFE_INTEGER,
    Number.MIN_SAFE_INTEGER,
    Number.MAX_VALUE, // may not be an integer on other platforms
  ];
  test.each(INTS)("validates int %d", (value) => {
    const expected = { int: "$int" };
    const candidate = { int: value };

    const result = wyv.validate(expected, candidate);
    expect(result.success).toBe(true);
  });

  const NOT_INTS = [
    { value: 100n, repr: 100 }, // no bigint support yet
    { value: NaN, repr: "NaN" },
    { value: Number.NEGATIVE_INFINITY, repr: "-Infinity" },
    { value: Number.MIN_VALUE, repr: "5e-324" },
    { value: Number.EPSILON, repr: "2.220446049250313e-16" },
    { value: -0.1, repr: "-0.1" },
    { value: 0.1, repr: "0.1" },
    { value: Number.POSITIVE_INFINITY, repr: "Infinity" },
    { value: "a", repr: "a" },
    { value: true, repr: "true" },
    { value: {}, repr: "{}" },
    { value: [], repr: "[]" },
    { value: Symbol(4), repr: "Symbol(4)" },
    { value: null, repr: "null" },
    { value: undefined, repr: "undefined" },
    { value: 100n, repr: "100" },
    { value: 9007199254740993n, repr: "9007199254740993" },
  ];
  test.each(NOT_INTS)("rejects nonint $repr", (datum) => {
    const { value, repr } = datum;
    const expected = { int: "$int" };
    const candidate = { int: value };
    const result = wyv.validate(expected, candidate);

    expect(result.errors).toEqual([
      {
        message: `Type: Expected 'integer', got value '${repr}'`,
        path: ".int",
      },
    ]);
  });

  const INT_PREDICATES: {
    val: Number;
    label: string;
    predicate: HookValue;
    succeed: boolean;
    errorString?: string | string[];
  }[] = [
    { val: 0, label: "0 ≥ 0", predicate: { $min: 0 }, succeed: true },
    {
      val: -1,
      label: "-1 ≥ 0",
      predicate: { $min: 0 },
      succeed: false,
      errorString: "$int.$min: Expected '≥0', got '-1'",
    },
    { val: 1, label: "1 ≥ 0", predicate: { $min: 0 }, succeed: true },
    { val: 0, label: "0 ≤ 0", predicate: { $max: 0 }, succeed: true },
    { val: -1, label: "-1 ≤ 0", predicate: { $max: 0 }, succeed: true },
    {
      val: 1,
      label: "1 ≤ 0",
      predicate: { $max: 0 },
      succeed: false,
      errorString: "$int.$max: Expected '≤0', got '1'",
    },
    {
      val: 0,
      label: "-1 ≤ 0 ≤ 1",
      predicate: { $min: -1, $max: 1 },
      succeed: true,
    },
    {
      val: -2,
      label: "-1 ≤ -2 ≤ 1",
      predicate: { $min: -1, $max: 1 },
      succeed: false,
      errorString: "$int.$min: Expected '≥-1', got '-2'",
    },
    {
      val: 2,
      label: "-1 ≤ 2 ≤ 1",
      predicate: { $min: -1, $max: 1 },
      succeed: false,
      errorString: "$int.$max: Expected '≤1', got '2'",
    },
    {
      val: 0,
      label: "0 ≥ 1 and 0 ≤ -1",
      predicate: { $min: 1, $max: -1 },
      succeed: false,
      errorString: [
        "$int.$min: Expected '≥1', got '0'",
        "$int.$max: Expected '≤-1', got '0'",
      ],
    },
  ];
  test.each(INT_PREDICATES)("Int max/min: $label", (row) => {
    const { val, predicate, succeed, errorString } = row;
    const expected = { int: { $int: predicate } };
    const candidate = { int: val };
    const errorStrings = Array.isArray(errorString)
      ? errorString
      : [errorString];

    const result = wyv.validate(expected, candidate);

    if (succeed) {
      expect(result.success).toBe(succeed);
    } else {
      expect(result.errors).toEqual(
        errorStrings.map((s) => ({
          message: s,
          path: ".int",
        })),
      );
    }
  });
});
