import type { WysiwyvInstance } from "../../src/type/engine";
import { makeWysiwyv } from "../../src/wysiwyv";
import { assertErrors, assertSuccess } from "../../test-util";

describe("String Type Plugin", () => {
  let wyv: WysiwyvInstance;

  beforeEach(() => {
    wyv = makeWysiwyv();
  });

  it("validates a string", () => {
    const expected = { s: "$string" };

    const candidate = { s: "a string" };

    const result = wyv.validate(expected, candidate);

    assertSuccess(result);
  });

  it("validates an empty string", () => {
    const expected = { s: "$string" };

    const candidate = { s: "" };

    const result = wyv.validate(expected, candidate);

    assertSuccess(result);
  });

  it("rejects other", () => {
    const expected = { s: "$string" };

    const candidate = { s: 27 };

    const result = wyv.validate(expected, candidate);

    assertErrors(result, [
      {
        message: `Type: Expected 'string', got value '27'`,
        path: ".s",
      },
    ]);
  });
});
