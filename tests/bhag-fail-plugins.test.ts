import type { HookValue } from "../src/type/template";
import { makeWysiwyv } from "../src/wysiwyv";

describe("big hairy plugins template rejects big hairy data", () => {
  const data = {
    a: "a",
    b: "b",
    c: "c",
    d: [1, 2, 3],
    e: [1, 2, 3],
    f: false,
    g: -1,
    h: "emailathostdotdomain",
  };
  const template: HookValue = {
    a: { $and: "not-an-array" },
    b: { $and: ["$string", "$number"] },
    c: "$array",
    d: { $array: { $length: 3, $purple: true } },
    e: { $array: { $length: 4, $minlength: 4, $maxlength: 2 } },
    f: { $and: ["$isodate", "$basicisodate", "$strictisodate"] },
    g: "$email",
    h: "$email",
  };

  it("rejects a custom lot", () => {
    const wyv = makeWysiwyv();
    const result = wyv.validate(template, data);
    expect(result.errors).toEqual([
      {
        message:
          "Configuration Error: $and value should be an array of templates",
        path: ".a",
      },
      {
        message: "Aggregate Error: $and",
        path: ".b",
      },
      {
        message: "Type: Expected 'number', got value 'b'",
        path: ".b",
      },
      {
        message: "Type: Expected 'array', got value 'c'",
        path: ".c",
      },
      {
        message:
          "Configuration Error: Ignored unknown $array parameters: '$purple'",
        path: ".d",
      },
      {
        message: "$array.$length: Expected '4', got '3'",
        path: ".e",
      },
      {
        message: "$array.$minlength: Expected '4', got '3'",
        path: ".e",
      },
      {
        message: "$array.$maxlength: Expected '2', got '3'",
        path: ".e",
      },

      {
        message: "Aggregate Error: $and",
        path: ".f",
      },
      {
        message: "Type: Expected 'ISO 8601 date', got value 'false'",
        path: ".f",
      },
      {
        message: "Type: Expected 'Basic ISO 8601 date', got value 'false'",
        path: ".f",
      },
      {
        message: "Type: Expected 'RFC 3339 date', got value 'false'",
        path: ".f",
      },
      {
        message: "Type: Expected 'string', got value '-1'",
        path: ".g",
      },
      {
        message:
          "Type: Expected 'valid email address', got value 'emailathostdotdomain'",
        path: ".h",
      },
    ]);
  });
});
