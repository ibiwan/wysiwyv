import type { WysiwyvInstance } from "../../src/type/engine";
import { makeWysiwyv } from "../../src/wysiwyv";
import { assertErrors, assertSuccess } from "../../test-util";

describe("AND boolean plugin", () => {
  let wyv: WysiwyvInstance;

  beforeEach(() => {
    wyv = makeWysiwyv();
  });

  it("works on a single predicate", () => {
    const expected = {
      number: { $and: ["$number"] },
    };

    const candidate = {
      number: 1,
    };

    const result = wyv.validate(expected, candidate);

    assertSuccess(result);
  });

  it("works on multiple true predicates", () => {
    const expected = {
      someId: { $and: ["$string", "$uuid"] },
    };

    const candidate = {
      someId: "d48ad255-1623-4998-8b27-d0420fe5f835",
    };

    const result = wyv.validate(expected, candidate);

    assertSuccess(result);
  });

  it("correctly fails on a single false predicate (latter)", () => {
    const expected = {
      name: { $and: ["$string", "$uuid"] },
    };

    const candidate = {
      name: "George",
    };

    const result = wyv.validate(expected, candidate);

    assertErrors(result, [
      {
        message: "Aggregate Error: $and",
        path: ".name",
      },
      {
        message: "Type: Expected 'UUID', got value 'George'",
        path: ".name",
      },
    ]);
  });

  it("correctly fails on a single false predicate (former)", () => {
    const expected = {
      name: { $and: ["$uuid", "$string"] },
    };

    const candidate = {
      name: "George",
    };

    const result = wyv.validate(expected, candidate);

    assertErrors(result, [
      {
        message: "Aggregate Error: $and",
        path: ".name",
      },
      {
        message: "Type: Expected 'UUID', got value 'George'",
        path: ".name",
      },
    ]);
  });

  it("reports multiple fails", () => {
    const expected = {
      name: { $and: ["$uuid", "$number"] },
    };

    const candidate = {
      name: "George",
    };

    const result = wyv.validate(expected, candidate);

    assertErrors(result, [
      {
        message: "Aggregate Error: $and",
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
      name: { $and: "$string" },
    };

    const candidate = {
      name: "Purple",
    };

    const result = wyv.validate(expected, candidate);

    assertErrors(result, [
      {
        message:
          "Configuration Error: $and value should be an array of templates",
        path: ".name",
      },
    ]);
  });
});
