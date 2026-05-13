import type { WysiwyvInstance } from "../../src/type";
import { makeWysiwyv } from "../../src/wysiwyv";

describe("UUID Expected JSON Object", () => {
  let wyv: WysiwyvInstance;
  beforeEach(() => {
    wyv = makeWysiwyv();
  });
  test("Valid generic UUID", () => {
    const expected = { id: "$uuid" };
    const candidate = { id: "123e4567-e89b-12d3-a456-426614174000" };
    const result = wyv.validate(expected, candidate);
    expect(result.success).toBe(true);
  });

  test("Valid NIL UUID", () => {
    const expected = { id: { $uuid: 0 } };
    const candidate = { id: "00000000-0000-0000-0000-000000000000" };
    const result = wyv.validate(expected, candidate);
    expect(result.success).toBe(true);
  });

  test("Valid FFF UUID", () => {
    const expected = { id: { $uuid: "F" } };
    const candidate = { id: "ffffffff-ffff-ffff-ffff-ffffffffffff" };
    const result = wyv.validate(expected, candidate);
    expect(result.success).toBe(true);
  });

  test("Valid UUID v1", () => {
    const expected = { id: { $uuid: 1 } };
    const candidate = { id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8" };
    const result = wyv.validate(expected, candidate);
    expect(result.success).toBe(true);
  });

  test("Valid UUID v2", () => {
    const expected = { id: { $uuid: 2 } };
    const candidate = { id: "6ba7b812-9dad-21d1-80b4-00c04fd430c8" };
    const result = wyv.validate(expected, candidate);
    expect(result.success).toBe(true);
  });

  test("Valid UUID v3", () => {
    const expected = { id: { $uuid: 3 } };
    const candidate = { id: "6ba7b814-9dad-31d1-80b4-00c04fd430c8" };
    const result = wyv.validate(expected, candidate);
    expect(result.success).toBe(true);
  });

  test("Valid UUID v4", () => {
    const expected = { id: { $uuid: 4 } };
    const candidate = { id: "123e4567-e89b-42d3-a456-426614174000" };
    const result = wyv.validate(expected, candidate);
    expect(result.success).toBe(true);
  });

  test("Valid UUID v5", () => {
    const expected = { id: { $uuid: 5 } };
    const candidate = { id: "6ba7b816-9dad-51d1-80b4-00c04fd430c8" };
    const result = wyv.validate(expected, candidate);
    expect(result.success).toBe(true);
  });

  test("Valid UUID v6", () => {
    const expected = { id: { $uuid: 6 } };
    const candidate = { id: "6ba7b817-9dad-61d1-80b4-00c04fd430c8" };
    const result = wyv.validate(expected, candidate);
    expect(result.success).toBe(true);
  });

  test("Valid UUID v7", () => {
    const expected = { id: { $uuid: 7 } };
    const candidate = { id: "6ba7b818-9dad-71d1-80b4-00c04fd430c8" };
    const result = wyv.validate(expected, candidate);
    expect(result.success).toBe(true);
  });

  test("Valid UUID v8", () => {
    const expected = { id: { $uuid: 8 } };
    const candidate = { id: "6ba7b819-9dad-81d1-80b4-00c04fd430c8" };
    const result = wyv.validate(expected, candidate);
    expect(result.success).toBe(true);
  });

  test("Invalid UUID format", () => {
    const expected = { id: "$uuid" };
    const candidate = { id: "invalid-uuid" };
    const result = wyv.validate(expected, candidate);
    expect(result.errors).toEqual([
      {
        message: "Type: Expected 'UUID', got value 'invalid-uuid'",
        path: ".id",
      },
    ]);
  });

  test("Invalid UUID version", () => {
    const expected = { id: { $uuid: 40 } };
    const candidate = { id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8" }; // v1 UUID
    const result = wyv.validate(expected, candidate);
    expect(result.errors).toEqual([
      {
        message: "Configuration Error: Unknown UUID version: '40'",
        path: ".id",
      },
    ]);
  });

  test("Non-String UUID candidate", () => {
    const expected = { id: "$uuid" };
    const candidate = { id: 1241245 };
    const result = wyv.validate(expected, candidate);
    expect(result.errors).toEqual([
      {
        message: "Type: Expected 'string', got value '1241245'",
        path: ".id",
      },
    ]);
  });
});
