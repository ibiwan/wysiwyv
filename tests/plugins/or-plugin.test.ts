import type { WysiwyvInstance } from "../../src/type/engine";
import { makeWysiwyv } from "../../src/wysiwyv";
import { assertErrors, assertSuccess } from "../../test-util";

describe("OR boolean plugin", () => {
  let wyv: WysiwyvInstance;

  beforeEach(() => {
    wyv = makeWysiwyv();
  });

  it("works on a single predicate", () => {
    const expected = {
      number: { $or: ["$number"] },
    };

    const candidate = {
      number: 1,
    };

    const result = wyv.validate(expected, candidate);

    assertSuccess(result);
  });

  it("fails on no predicates", () => {
    const expected = {
      number: { $or: [] },
    };

    const candidate = {
      number: 1,
    };

    const result = wyv.validate(expected, candidate);

    assertErrors(result, [
      {
        message: "Configuration Error: $or must take one or more predicates",
        path: ".number",
      },
    ]);
  });

  it("works on multiple true predicates", () => {
    const expected = {
      someId: { $or: ["$string", "$uuid"] },
    };

    const candidate = {
      someId: "d48ad255-1623-4998-8b27-d0420fe5f835",
    };

    const result = wyv.validate(expected, candidate);

    assertSuccess(result);
  });

  it("correctly succeeds on a single false predicate (latter)", () => {
    const expected = {
      name: { $or: ["$string", "$uuid"] },
    };

    const candidate = {
      name: "George",
    };

    const result = wyv.validate(expected, candidate);

    assertSuccess(result);
  });

  it("correctly succeeds on a single false predicate (former)", () => {
    const expected = {
      name: { $or: ["$uuid", "$string"] },
    };

    const candidate = {
      name: "George",
    };

    const result = wyv.validate(expected, candidate);

    assertSuccess(result);
  });

  it("reports multiple fails", () => {
    const expected = {
      name: { $or: ["$uuid", "$number"] },
    };

    const candidate = {
      name: "George",
    };

    const result = wyv.validate(expected, candidate);

    assertErrors(result, [
      {
        message: "Aggregate Error: $or",
        path: ".name",
      },
      {
        message: "Type: Expected 'UUID', got value 'George'",
        path: ".name",
      },
      {
        message: "Type: Expected 'number', got value 'George'",
        path: ".name",
      },
    ]);
  });

  it("rejects malformed parameters", () => {
    const expected = {
      name: { $or: "$string" },
    };

    const candidate = {
      name: "Purple",
    };

    const result = wyv.validate(expected, candidate);

    assertErrors(result, [
      {
        message:
          "Configuration Error: $or value should be an array of templates",
        path: ".name",
      },
    ]);
  });
});
