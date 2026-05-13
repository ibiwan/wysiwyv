import type { HookValue, WysiwyvInstance } from "../../src/type";
import { makeWysiwyv } from "../../src/wysiwyv";

describe("Number Type Plugin", () => {
  let wyv: WysiwyvInstance;

  beforeEach(() => {
    wyv = makeWysiwyv();
  });

  const NUMS = [
    0.0,
    0,
    -0,
    10,
    -10,
    1.0,
    -1.0,
    0.1,
    -0.1,
    Number.MAX_SAFE_INTEGER,
    Number.MIN_SAFE_INTEGER,
    Number.MIN_VALUE,
    Number.MAX_VALUE,
    Number.EPSILON,
  ];
  test.each(NUMS)("validates number %d", (value) => {
    const expected = { num: "$number" };
    const candidate = { num: value };

    const result = wyv.validate(expected, candidate);
    expect(result.success).toBe(true);
  });

  const NOT_NUMS = [
    { value: NaN, repr: "NaN" },
    { value: Number.NEGATIVE_INFINITY, repr: "-Infinity" },
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
  test.each(NOT_NUMS)("rejects non-num $repr", (datum) => {
    const { value, repr } = datum;
    const expected = { num: "$number" };
    const candidate = { num: value };
    const result = wyv.validate(expected, candidate);

    expect(result.errors).toEqual([
      {
        message: `Type: Expected 'number', got value '${repr}'`,
        path: ".num",
      },
    ]);
  });

  const NUM_PREDICATES: {
    val: number;
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
      errorString: "$number.$min: Expected '≥0', got '-1'",
    },
    { val: 1, label: "1 ≥ 0", predicate: { $min: 0 }, succeed: true },
    { val: 0, label: "0 ≤ 0", predicate: { $max: 0 }, succeed: true },
    { val: -1, label: "-1 ≤ 0", predicate: { $max: 0 }, succeed: true },
    {
      val: 1,
      label: "1 ≤ 0",
      predicate: { $max: 0 },
      succeed: false,
      errorString: "$number.$max: Expected '≤0', got '1'",
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
      errorString: "$number.$min: Expected '≥-1', got '-2'",
    },
    {
      val: 2,
      label: "-1 ≤ 2 ≤ 1",
      predicate: { $min: -1, $max: 1 },
      succeed: false,
      errorString: "$number.$max: Expected '≤1', got '2'",
    },
    {
      val: 0,
      label: "0 ≥ 1 and 0 ≤ -1",
      predicate: { $min: 1, $max: -1 },
      succeed: false,
      errorString: [
        "$number.$min: Expected '≥1', got '0'",
        "$number.$max: Expected '≤-1', got '0'",
      ],
    },
    {
      val: 0,
      label: "0 < 0",
      predicate: { $lt: 0 },
      succeed: false,
      errorString: "$number.$lt: Expected '<0', got '0'",
    },
    {
      val: 0,
      label: "0 < 0.0000...1",
      predicate: { $lt: 0 + Number.EPSILON },
      succeed: true,
    },
    {
      val: 0,
      label: "0 > 0",
      predicate: { $gt: 0 },
      succeed: false,
      errorString: "$number.$gt: Expected '>0', got '0'",
    },
    {
      val: 0,
      label: "0 > -0.0000...1",
      predicate: { $gt: 0 - Number.EPSILON },
      succeed: true,
    },
  ];
  test.each(NUM_PREDICATES)("Number max/min: $label", (row) => {
    const { val, predicate, succeed, errorString } = row;
    const expected = { num: { $number: predicate } };
    const candidate = { num: val };
    const errorStrings = Array.isArray(errorString)
      ? errorString
      : [errorString];

    const result = wyv.validate(expected, candidate);

    if (succeed) {
      expect(result.success).toBe(true);
    } else {
      expect(result.errors).toEqual(
        errorStrings.map((s) => ({
          message: s,
          path: ".num",
        })),
      );
    }
  });
});
