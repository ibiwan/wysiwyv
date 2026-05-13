import { test, expect, spyOn } from "bun:test";
import { d } from "../src/util/stringify";
const dt = new Date();
const REPRS = [
  { val: null, expected: "null" },
  { val: undefined, expected: "undefined" },
  { val: true, expected: "true" },
  { val: false, expected: "false" },
  { val: NaN, expected: "NaN" },
  { val: Infinity, expected: "Infinity" },
  { val: -Infinity, expected: "-Infinity" },
  { val: dt, expected: dt.toISOString() },
  { val: 1, expected: "1" },
  { val: "hello", expected: "hello" },
  { val: /3/, expected: "/3/" },
  { val: new Map([["a", "b"]]), expected: "Map {}" },
];

test.each(REPRS)("dumps repr on d: $expected", (row) => {
  const { val, expected } = row;

  const logSpy = spyOn(console, "log").mockImplementation(() => {});

  d(val);

  expect(logSpy?.mock?.calls[0]?.[0]).toEqual(expected);

  logSpy.mockRestore();
});
