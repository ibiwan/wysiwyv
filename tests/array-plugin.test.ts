import type { WysiwyvInstance } from "../src/type";
import { makeWysiwyv } from "../src/wysiwyv";

describe("Expected Array in Object", () => {
  let wyv: WysiwyvInstance;

  beforeEach(() => {
    wyv = makeWysiwyv();
  });

  it("should pass when an array is an array", () => {
    const expected = { arr: "$array" };
    const candidate = { arr: ["a"] };
    const result = wyv.validate(expected, candidate);
    expect(result.success).toBe(true);
  });

  it("should fail when an array is not an array", () => {
    const expected = { arr: "$array" };
    const candidate = { arr: "a" };
    const result = wyv.validate(expected, candidate);
    expect(result.errors).toEqual([
      {
        message: "Type: Expected 'array', got value 'a'",
        path: ".arr",
      },
    ]);
  });

  it("should pass when an array has the exact length", () => {
    const expected = { arr: { $array: { $length: 4 } } };
    const candidate = { arr: ["a", "b", "c", "d"] };
    const result = wyv.validate(expected, candidate);
    expect(result.success).toBe(true);
  });

  it("should fail when an array is too short for fixed length", () => {
    const expected = { arr: { $array: { $length: 4 } } };
    const candidate = { arr: ["a", "b", "c"] };
    const result = wyv.validate(expected, candidate);
    expect(result.errors).toEqual([
      {
        message: "$array.$length: Expected '4', got '3'",
        path: ".arr",
      },
    ]);
  });

  it("should fail when an array is too short for fixed length", () => {
    const expected = { arr: { $array: { $length: 3 } } };
    const candidate = { arr: ["a", "b", "c", "d"] };
    const result = wyv.validate(expected, candidate);
    expect(result.errors).toEqual([
      {
        message: "$array.$length: Expected '3', got '4'",
        path: ".arr",
      },
    ]);
  });

  it("should succeed when array is at minimum length", () => {
    const expected = { arr: { $array: { $minlength: 4 } } };
    const candidate = { arr: ["a", "b", "c", "d"] };
    const result = wyv.validate(expected, candidate);
    expect(result.success).toBe(true);
  });

  it("should succeed when array is above minimum length", () => {
    const expected = { arr: { $array: { $minlength: 3 } } };
    const candidate = { arr: ["a", "b", "c", "d"] };
    const result = wyv.validate(expected, candidate);
    expect(result.success).toBe(true);
  });

  it("should fail when array is below minimum length", () => {
    const expected = { arr: { $array: { $minlength: 5 } } };
    const candidate = { arr: ["a", "b", "c", "d"] };
    const result = wyv.validate(expected, candidate);
    expect(result.errors).toEqual([
      {
        message: "$array.$minlength: Expected '5', got '4'",
        path: ".arr",
      },
    ]);
  });

  it("should succeed when array is at maximum length", () => {
    const expected = { arr: { $array: { $maxlength: 4 } } };
    const candidate = { arr: ["a", "b", "c", "d"] };
    const result = wyv.validate(expected, candidate);
    expect(result.success).toBe(true);
  });

  it("should succeed when array is below maximum length", () => {
    const expected = { arr: { $array: { $maxlength: 5 } } };
    const candidate = { arr: ["a", "b", "c", "d"] };
    const result = wyv.validate(expected, candidate);
    expect(result.success).toBe(true);
  });

  it("should fail when array is above maximum length", () => {
    const expected = { arr: { $array: { $maxlength: 3 } } };
    const candidate = { arr: ["a", "b", "c", "d"] };
    const result = wyv.validate(expected, candidate);
    expect(result.errors).toEqual([
      {
        message: "$array.$maxlength: Expected '3', got '4'",
        path: ".arr",
      },
    ]);
  });

  it("should fail on mixed parameters", () => {
    const expected = { arr: { $array: { $minlength: 4, $purpleLength: 22 } } };
    const candidate = { arr: ["a", "b", "c", "d"] };
    const result = wyv.validate(expected, candidate);
    expect(result.errors).toEqual([
      {
        message:
          "Configuration Error: Ignored unknown $array parameters: '$purpleLength'",
        path: ".arr",
      },
    ]);
  });

  it("should succeed when array matches explicit each shape", () => {
    const expected = {
      arr: { $array: { $each: { a: 1, b: { $val: "shared" } } } },
    };
    const candidate = {
      arr: [
        { a: 1, b: "purple" },
        { a: 1, b: "purple" },
        { a: 1, b: "purple" },
      ],
    };
    const result = wyv.validate(expected, candidate);
    expect(result.success).toBe(true);
  });

  it("should fail when array does not match explicit each shape", () => {
    const expected = {
      arr: {
        $array: {
          $each: {
            a: 1,
            b: {
              $val: "shared",
            },
          },
        },
      },
    };
    const candidate = {
      arr: [
        { a: 1, b: "purple" },
        { a: 1, b: "puiple" },
        { a: 1, b: "puople" },
      ],
    };
    const result = wyv.validate(expected, candidate);
    expect(result.errors).toEqual([
      {
        message: "Expected value 'purple' for key 'shared', got 'puiple'",
        path: ".arr[1].b",
      },
      {
        message: "Expected value 'purple' for key 'shared', got 'puople'",
        path: ".arr[2].b",
      },
    ]);
  });

  it("should succeed when array matches implicit each shape", () => {
    const expected = { arr: { $array: { a: 1, b: { $val: "shared" } } } };
    const candidate = {
      arr: [
        { a: 1, b: "purple" },
        { a: 1, b: "purple" },
        { a: 1, b: "purple" },
      ],
    };
    const result = wyv.validate(expected, candidate);
    expect(result.success).toBe(true);
  });

  it("should fail when array does not match implicit each shape", () => {
    const expected = {
      arr: {
        $array: {
          a: 1,
          b: {
            $val: "shared",
          },
        },
      },
    };

    const candidate = {
      arr: [
        { a: 1, b: "purple" },
        { a: 1, b: "puiple" },
        { a: 1, b: "puople" },
      ],
    };
    const result = wyv.validate(expected, candidate);
    expect(result.errors).toEqual([
      {
        message: "Expected value 'purple' for key 'shared', got 'puiple'",
        path: ".arr[1].b",
      },
      {
        message: "Expected value 'purple' for key 'shared', got 'puople'",
        path: ".arr[2].b",
      },
    ]);
  });
});
