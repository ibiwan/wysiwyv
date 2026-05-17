import type { WysiwyvInstance } from "../src/type/engine";
import { makeWysiwyv } from "../src/wysiwyv";
import { assertErrors, assertSuccess } from "../test-util";

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
    assertSuccess(result);
    assertSuccess(result);
  });

  it("should fail when candidate has properties", () => {
    const expected = {};
    const candidate = { badKey: "badValue" };
    const result = wyv.validate(expected, candidate);
    assertErrors(result, [
      {
        message: "Unexpected element at 'badKey': got 'badValue'",
        path: ".badKey",
      },
    ]);
  });
});
