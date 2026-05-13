import type { WysiwyvInstance } from "../../src/type";
import { makeWysiwyv } from "../../src/wysiwyv";

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

    expect(result.success).toBe(true);
  });

  it("fails on no predicates", () => {
    const expected = {
      number: { $or: [] },
    };
    const candidate = {
      number: 1,
    };

    const result = wyv.validate(expected, candidate);

    expect(result.errors).toEqual([
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

    expect(result.success).toBe(true);
  });

  it("correctly succeeds on a single false predicate (latter)", () => {
    const expected = {
      name: { $or: ["$string", "$uuid"] },
    };
    const candidate = {
      name: "George",
    };

    const result = wyv.validate(expected, candidate);

    expect(result.success).toBe(true);
  });

  it("correctly succeeds on a single false predicate (former)", () => {
    const expected = {
      name: { $or: ["$uuid", "$string"] },
    };
    const candidate = {
      name: "George",
    };

    const result = wyv.validate(expected, candidate);

    expect(result.success).toBe(true);
  });

  it("reports multiple fails", () => {
    const expected = {
      name: { $or: ["$uuid", "$number"] },
    };
    const candidate = {
      name: "George",
    };

    const result = wyv.validate(expected, candidate);

    expect(result.errors).toEqual([
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

    expect(result.errors).toEqual([
      {
        message:
          "Configuration Error: $or value should be an array of templates",
        path: ".name",
      },
    ]);
  });
});
