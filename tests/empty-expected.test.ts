import { makeWysiwyv } from "../src/wysiwyv";

describe('Empty Expected JSON Object', () => {
  let wyv: ReturnType<typeof makeWysiwyv>;

  beforeEach(() => {
    // Initialize the WYSIWYV validator before each test
    wyv = makeWysiwyv();
  });

  it('should pass when candidate is also an empty object', () => {
    const expected = {};
    const candidate = {};
    const result = wyv.validate(expected, candidate);
    expect(result).toEqual([]);
  });

  it('should fail when candidate has properties', () => {
    const expected = {};
    const candidate = { badKey: "badValue" };
    const result = wyv.validate(expected, candidate);
    expect(result).toEqual([
      {
        message: "Unexpected object key 'badKey': got 'badValue', expected nothing",
        path: ".badKey",
      }
    ]);
  });
});
