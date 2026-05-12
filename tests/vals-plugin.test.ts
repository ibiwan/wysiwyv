import type { WysiwyvInstance } from "../src/type";
import { makeWysiwyv } from "../src/wysiwyv";

describe("Val Expected JSON Object", () => {
  const predefs = {
    apple: "ball",
    banana: "bat",
    peach: "cat",
  };
  let wyv: WysiwyvInstance;

  beforeEach(() => {
    wyv = makeWysiwyv({ values: predefs });
  });

  test("Valid generic UUID", () => {
    const expected = {
      team: { $val: "team" },
      base: { $val: "apple" },
      diamond: { swing: { $val: "banana" } },
      uniform: { homeColors: { $val: "team" } },
    };

    const candidate = {
      team: "Yankees",
      base: "ball",
      diamond: { swing: "bat" },
      uniform: { homeColors: "Yankees" },
    };

    const result = wyv.validate(expected, candidate);
    expect(result.success).toBe(true);
  });

  test("shallow mismatch", () => {
    const expected = {
      shape: { $val: "apple" },
    };

    const candidate = {
      shape: "spheroid",
    };

    const result = wyv.validate(expected, candidate);
    expect(result.errors).toEqual([
      {
        message: "Expected value 'ball' for key 'apple', got 'spheroid'",
        path: ".shape",
      },
    ]);
  });

  test("deep mismatch", () => {
    const expected = {
      nested: {
        fuzzbearer: { $val: "peach" },
      },
    };

    const candidate = {
      nested: {
        fuzzbearer: "dog",
      },
    };

    const result = wyv.validate(expected, candidate);
    expect(result.errors).toEqual([
      {
        message: "Expected value 'cat' for key 'peach', got 'dog'",
        path: ".nested.fuzzbearer",
      },
    ]);
  });

  test("repeat mismatch", () => {
    const expected = {
      shape: { $val: "crunch" },
      nested: {
        crunchable: { $val: "crunch" },
      },
    };

    const candidate = {
      shape: "carrot",
      nested: {
        crunchable: "celery",
      },
    };

    const result = wyv.validate(expected, candidate);

    expect(result.errors).toEqual([
      {
        message: "Expected value 'carrot' for key 'crunch', got 'celery'",
        path: ".nested.crunchable",
      },
    ]);
  });
});
