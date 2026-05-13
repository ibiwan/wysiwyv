import type { HookValue } from "../src/type";
import { makeWysiwyv } from "../src/wysiwyv";

describe("invalid core configurations", () => {
  it("rejects unknown types", () => {
    const expected = {
      anUndefined: undefined,
      aSymbol: Symbol("a symbol"),
      aBigInt: 100n,
    };
    const candidate = {
      anUndefined: "",
      aSymbol: "",
      aBigInt: "",
    };

    const wyv = makeWysiwyv();
    const result = wyv.validate(expected as unknown as HookValue, candidate);

    expect(result.errors).toEqual([
      {
        message:
          "Configuration Error: Unsupported value type in expected object: 'undefined'",
        path: ".anUndefined",
      },
      {
        message:
          "Configuration Error: Unsupported value type in expected object: 'Symbol(a symbol)'",
        path: ".aSymbol",
      },
      {
        message:
          "Configuration Error: Unsupported value type in expected object: '100'",
        path: ".aBigInt",
      },
    ]);
  });
});
