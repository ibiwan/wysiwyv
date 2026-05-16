import type { WysiwyvInstance } from "../src/type/engine";
import { makeWysiwyv } from "../src/wysiwyv";

describe("Empty Expected JSON Object", () => {
  let wyv: WysiwyvInstance;

  beforeEach(() => {
    // Initialize the WYSIWYV validator before each test
    wyv = makeWysiwyv();
  });

  it("should pass when candidate is also an empty object", () => {
    const expected = {};
    const candidate = {};
    const result = wyv.validate(expected, candidate);
    expect(result.success).toBe(true);
  });

  it("should fail when candidate has properties", () => {
    const expected = {};
    const candidate = { badKey: "badValue" };
    const result = wyv.validate(expected, candidate);
    expect(result.errors).toEqual([
      {
        message: "Unexpected element at 'badKey': got 'badValue'",
        path: ".badKey",
      },
    ]);
  });
});
