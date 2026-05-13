import type { WysiwyvInstance } from "../../src/type";
import { makeWysiwyv } from "../../src/wysiwyv";

describe("Bool Type Plugin", () => {
  let wyv: WysiwyvInstance;

  beforeEach(() => {
    wyv = makeWysiwyv();
  });

  it("validates true", () => {
    const expected = { b: "$bool" };
    const candidate = { b: true };
    const result = wyv.validate(expected, candidate);
    expect(result.success).toBe(true);
  });

  it("validates false", () => {
    const expected = { b: "$bool" };
    const candidate = { b: false };
    const result = wyv.validate(expected, candidate);
    expect(result.success).toBe(true);
  });

  it("rejects other", () => {
    const expected = { b: "$bool" };
    const candidate = { b: 27 };
    const result = wyv.validate(expected, candidate);

    expect(result.errors).toEqual([
      {
        message: `Type: Expected 'boolean', got value '27'`,
        path: ".b",
      },
    ]);
  });

  it("rejects boolish string", () => {
    const expected = { b: "$bool" };
    const candidate = { b: "true" };
    const result = wyv.validate(expected, candidate);

    expect(result.errors).toEqual([
      {
        message: `Type: Expected 'boolean', got value 'true'`,
        path: ".b",
      },
    ]);
  });
});
