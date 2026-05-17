import type { WysiwyvInstance } from "../../src/type/engine";
import { makeWysiwyv } from "../../src/wysiwyv";
import { assertErrors, assertSuccess } from "../../test-util";

describe("Bool Type Plugin", () => {
  let wyv: WysiwyvInstance;

  beforeEach(() => {
    wyv = makeWysiwyv();
  });

  it("validates true", () => {
    const expected = { b: "$bool" };

    const candidate = { b: true };

    const result = wyv.validate(expected, candidate);

    assertSuccess(result);
  });

  it("validates false", () => {
    const expected = { b: "$bool" };

    const candidate = { b: false };

    const result = wyv.validate(expected, candidate);

    assertSuccess(result);
  });

  it("rejects other", () => {
    const expected = { b: "$bool" };

    const candidate = { b: 27 };

    const result = wyv.validate(expected, candidate);

    assertErrors(result, [
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

    assertErrors(result, [
      {
        message: `Type: Expected 'boolean', got value 'true'`,
        path: ".b",
      },
    ]);
  });
});
