import type { WysiwyvInstance } from "../src/type/engine";
import { makeWysiwyv } from "../src/wysiwyv";

describe("Simple Expected JSON Object", () => {
  const expected = {
    a: 1,
    b: "c",
    d: true,
    e: null,
    f: [1, 2, 3],
    g: { h: 4 },
    i: 5.67,
    j: { nested: { value: "test" } },
  };

  let wyv: WysiwyvInstance;

  beforeEach(() => {
    // Initialize the WYSIWYV validator before each test
    wyv = makeWysiwyv();
  });

  it("should pass when candidate matches the expected object", () => {
    const candidate = { ...expected };
    const result = wyv.validate(expected, candidate);
    expect(result.success).toBe(true);
  });

  it("should fail when candidate has extra properties", () => {
    const candidate = { ...expected, extra: "value" };
    const result = wyv.validate(expected, candidate);

    expect(result.errors).toEqual([
      {
        message: "Unexpected element at 'extra': got 'value'",
        path: ".extra",
      },
    ]);
  });

  it("should fail when candidate is missing properties", () => {
    const { a: _a, b: _b, ...candidate } = expected; // create a candidate missing 'a' and 'b'
    const result = wyv.validate(expected, candidate);

    expect(result.errors).toEqual([
      {
        message: "Missing element at 'a': expected '1'",
        path: ".a",
      },
      {
        message: "Missing element at 'b': expected 'c'",
        path: ".b",
      },
    ]);
  });

  it("should fail when candidate has wrong number", () => {
    const candidate = { ...expected, a: 2 };
    const result = wyv.validate(expected, candidate);

    expect(result.errors).toEqual([
      {
        message: "Value: Expected '1', got '2'",
        path: ".a",
      },
    ]);
  });

  it("should fail when candidate has wrong type for number", () => {
    const candidate = { ...expected, a: "not a number" };
    const result = wyv.validate(expected, candidate);

    expect(result.errors).toEqual([
      {
        message: "Type: Expected 'number', got value 'not a number'",
        path: ".a",
      },
    ]);
  });

  it("should fail when candidate has wrong string", () => {
    const candidate = { ...expected, b: "wrong string" };
    const result = wyv.validate(expected, candidate);

    expect(result.errors).toEqual([
      {
        message: "Value: Expected 'c', got 'wrong string'",
        path: ".b",
      },
    ]);
  });

  it("should fail when candidate has wrong type for string", () => {
    const candidate = { ...expected, b: 123 };
    const result = wyv.validate(expected, candidate);

    expect(result.errors).toEqual([
      {
        message: "Type: Expected 'string', got value '123'",
        path: ".b",
      },
    ]);
  });

  it("should fail when candidate has wrong boolean", () => {
    const candidate = { ...expected, d: false };
    const result = wyv.validate(expected, candidate);

    expect(result.errors).toEqual([
      {
        message: "Value: Expected 'true', got 'false'",
        path: ".d",
      },
    ]);
  });

  it("should fail when candidate has wrong type for boolean", () => {
    const candidate = { ...expected, d: "not a boolean" };
    const result = wyv.validate(expected, candidate);

    expect(result.errors).toEqual([
      {
        message: "Type: Expected 'boolean', got value 'not a boolean'",
        path: ".d",
      },
    ]);
  });

  it("should fail when candidate has wrong null value", () => {
    const candidate = { ...expected, e: undefined };
    const result = wyv.validate(expected, candidate);

    expect(result.errors).toEqual([
      {
        message: "Type: Expected 'null', got value 'undefined'",
        path: ".e",
      },
    ]);
  });

  it("should fail when candidate has wrong type for null", () => {
    const candidate = { ...expected, e: 0 };
    const result = wyv.validate(expected, candidate);

    expect(result.errors).toEqual([
      {
        message: `Type: Expected 'null', got value '0'`,
        path: ".e",
      },
    ]);
  });

  it("should fail when candidate has wrong type for array", () => {
    const candidate = { ...expected, f: { a: "b" } };
    const result = wyv.validate(expected, candidate);

    expect(result.errors).toEqual([
      {
        message: `Type: Expected 'array', got value '{"a":"b"}'`,
        path: ".f",
      },
    ]);
  });

  it("should fail when candidate has short array", () => {
    const candidate = { ...expected, f: [1] };
    const result = wyv.validate(expected, candidate);

    expect(result.errors).toEqual([
      {
        message: `Array length: Expected '${expected.f.length}', got '${candidate.f.length}'`,
        path: ".f",
      },
      {
        message: "Missing element at 'index 1': expected '2'",
        path: ".f[1]",
      },
      {
        message: "Missing element at 'index 2': expected '3'",
        path: ".f[2]",
      },
    ]);
  });

  it("should fail when candidate has long array", () => {
    const candidate = { ...expected, f: [1, 2, 3, 4] };
    const result = wyv.validate(expected, candidate);

    expect(result.errors).toEqual([
      {
        message: `Array length: Expected '${expected.f.length}', got '${candidate.f.length}'`,
        path: ".f",
      },
    ]);
  });

  it("should fail when candidate has wrong type in array", () => {
    const candidate = { ...expected, f: [1, "not a number", 3] };
    const result = wyv.validate(expected, candidate);

    expect(result.errors).toEqual([
      {
        message: "Type: Expected 'number', got value 'not a number'",
        path: ".f[1]",
      },
    ]);
  });

  it("should fail when candidate has wrong value in array", () => {
    const candidate = { ...expected, f: [1, 99, 3] };
    const result = wyv.validate(expected, candidate);

    expect(result.errors).toEqual([
      {
        message: "Value: Expected '2', got '99'",
        path: ".f[1]",
      },
    ]);
  });

  it("should fail when candidate has wrong type for object", () => {
    const candidate = { ...expected, g: [] };
    const result = wyv.validate(expected, candidate);

    expect(result.errors).toEqual([
      {
        message: "Type: Expected 'object', got value '[]'",
        path: ".g",
      },
    ]);
  });

  it("should fail when candidate has wrong nested object value", () => {
    const candidate = { ...expected, g: { h: 5 } };
    const result = wyv.validate(expected, candidate);

    expect(result.errors).toEqual([
      {
        message: "Value: Expected '4', got '5'",
        path: ".g.h",
      },
    ]);
  });

  it("should fail when candidate has wrong nested object type", () => {
    const candidate = { ...expected, g: { h: "not a number" } };
    const result = wyv.validate(expected, candidate);

    expect(result.errors).toEqual([
      {
        message: "Type: Expected 'number', got value 'not a number'",
        path: ".g.h",
      },
    ]);
  });

  it("should fail when candidate has wrong nested object value in deeper nesting", () => {
    const candidate = { ...expected, j: { nested: { value: "wrong value" } } };
    const result = wyv.validate(expected, candidate);

    expect(result.errors).toEqual([
      {
        message: "Value: Expected 'test', got 'wrong value'",
        path: ".j.nested.value",
      },
    ]);
  });

  it("should fail when candidate has missing key in deeper nesting", () => {
    const candidate = { ...expected, j: { nested: {} } };
    const result = wyv.validate(expected, candidate);

    expect(result.errors).toEqual([
      {
        message: "Missing element at 'value': expected 'test'",
        path: ".j.nested.value",
      },
    ]);
  });

  it("should fail when candidate has extra key in deeper nesting", () => {
    const candidate = {
      ...expected,
      j: { nested: { value: "test", extra: "value" } },
    };
    const result = wyv.validate(expected, candidate);

    expect(result.errors).toEqual([
      {
        message: "Unexpected element at 'extra': got 'value'",
        path: ".j.nested.extra",
      },
    ]);
  });
});
