import { arrayWyvern } from "../dist/hooks";
import { makeWysiwyv } from "../src/wysiwyv-core";
import countWyvern from "./custom-plugins/count";

describe("core should retain contexts if configured to", () => {
  it("loses context if unspecified", () => {
    const wyv = makeWysiwyv({ plugins: [arrayWyvern, countWyvern] });
    const candidate = [10, 9, 8, 7];
    const expected = { $array: { $each: "$count" } };
    wyv.validate(expected, candidate);

    expect(wyv.peekContext().sharedContext?.count).toEqual(4);
    expect(wyv.peekContext().perHookContexts?.$count?.count).toEqual(4);

    wyv.validate(expected, candidate);

    expect(wyv.peekContext().sharedContext?.count).toEqual(4);
    expect(wyv.peekContext().perHookContexts?.$count?.count).toEqual(4);
  });

  it("loses context if keep-context false", () => {
    const wyv = makeWysiwyv({ plugins: [arrayWyvern, countWyvern] });
    const candidate = [10, 9, 8, 7];
    const expected = { $array: { $each: "$count" } };
    wyv.validate(expected, candidate, false);

    expect(wyv.peekContext().sharedContext?.count).toEqual(4);
    expect(wyv.peekContext().perHookContexts?.$count?.count).toEqual(4);

    wyv.validate(expected, candidate, false);

    expect(wyv.peekContext().sharedContext?.count).toEqual(4);
    expect(wyv.peekContext().perHookContexts?.$count?.count).toEqual(4);
  });

  it("keeps context if keep-context true", () => {
    const wyv = makeWysiwyv({ plugins: [arrayWyvern, countWyvern] });
    const candidate = [10, 9, 8, 7];
    const expected = { $array: { $each: "$count" } };
    wyv.validate(expected, candidate, true);

    expect(wyv.peekContext().sharedContext?.count).toEqual(4);
    expect(wyv.peekContext().perHookContexts?.$count?.count).toEqual(4);

    wyv.validate(expected, candidate, true);

    expect(wyv.peekContext().sharedContext?.count).toEqual(8);
    expect(wyv.peekContext().perHookContexts?.$count?.count).toEqual(8);
  });
});
