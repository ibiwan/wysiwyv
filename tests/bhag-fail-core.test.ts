import type { HookValue } from "../src/type/template";
import { makeWysiwyv } from "../src/wysiwyv";

describe("big hairy core template rejects big hairy data", () => {
  const data = {
    a: "a",
    b: false,
    c: "no",
    d: false,
    e: -1,
    f: "no",
    g: true,
    h: "something",
    i: false,
    j: [-1, -2],
    k: [1, undefined, 3],
    l: new ReadableStream(),
    m: { a: 1, c: 3 },
  };
  const template = {
    a: new ReadableStream(),
    b: "b",
    c: "c",
    d: 4,
    e: 5,
    f: false,
    g: false,
    h: null,
    i: [],
    j: [10],
    k: [1, 2, 3],
    l: {},
    m: { a: 1, b: 2 },
  } as unknown as HookValue;

  it("rejects a lot", () => {
    const wyv = makeWysiwyv();
    const result = wyv.validate(template, data);
    expect(result.errors).toEqual([
      {
        message:
          "Configuration Error: Unsupported value type in expected object: 'ReadableStream {}'",
        path: ".a",
      },
      {
        message: "Type: Expected 'string', got value 'false'",
        path: ".b",
      },
      {
        message: "Value: Expected 'c', got 'no'",
        path: ".c",
      },
      {
        message: "Type: Expected 'number', got value 'false'",
        path: ".d",
      },
      {
        message: "Value: Expected '5', got '-1'",
        path: ".e",
      },
      {
        message: "Type: Expected 'boolean', got value 'no'",
        path: ".f",
      },
      {
        message: "Value: Expected 'false', got 'true'",
        path: ".g",
      },
      {
        message: "Type: Expected 'null', got value 'something'",
        path: ".h",
      },
      {
        message: "Type: Expected 'array', got value 'false'",
        path: ".i",
      },
      {
        message: "Array length: Expected '1', got '2'",
        path: ".j",
      },
      {
        message: "Value: Expected '10', got '-1'",
        path: ".j[0]",
      },
      {
        message: "Missing element at 'index 1': expected '2'",
        path: ".k[1]",
      },
      {
        message: "Type: Expected 'object', got value 'ReadableStream {}'",
        path: ".l",
      },
      {
        message: "Missing element at 'b': expected '2'",
        path: ".m.b",
      },
      {
        message: "Unexpected element at 'c': got '3'",
        path: ".m.c",
      },
    ]);
  });
});
