import type { WysiwyvInstance } from "../../src/type/engine";
import { makeWysiwyv } from "../../src/wysiwyv";
import { assertErrors, assertSuccess } from "../../test-util";

const SAMPLES = [
  { value: "2020-12-09 16:09:53Z", ext: false, bas: false, strict: true },
  { value: "2020-12-09T16:09:53-00:00", ext: true, bas: false, strict: true },
  { value: "20201209T160953Z", ext: false, bas: true, strict: false },
  { value: "2020-12-09T16:09:53", ext: false, bas: false, strict: false },
  { value: "2020-W49-3T16:09:53Z", ext: false, bas: false, strict: false },
  { value: "2020-344T16:09:53Z", ext: false, bas: false, strict: false },
  { value: "2020-12-09t16:09:53Z", ext: true, bas: false, strict: true },
  { value: "2026-05-05T20:41:00Z", ext: true, bas: false, strict: true },
  { value: "2026-05-05T13:41:00-07:00", ext: true, bas: false, strict: true },
  { value: "2026-05-05T20:41:00.123Z", ext: true, bas: false, strict: true },
  {
    value: "2026-05-05T20:41:00.999999+00:00",
    ext: true,
    bas: false,
    strict: true,
  },
  { value: "1999-12-31T23:59:59Z", ext: true, bas: false, strict: true },
  { value: false, ext: false, bas: false, strict: false },
];

describe("DateTime Expected JSON Object", () => {
  let wyv: WysiwyvInstance;

  beforeEach(() => {
    wyv = makeWysiwyv();
  });

  test.each(SAMPLES)("Judges Candidate DateTime %s", (datas) => {
    const { value, ext, bas, strict } = datas;

    const candidate = { dt: value };

    const expectedIsoExt = { dt: "$isodate" };

    const resultIsoExt = wyv.validate(expectedIsoExt, candidate);
    if (ext) {
      assertSuccess(resultIsoExt);
    } else {
      assertErrors(resultIsoExt, [
        {
          message: `Type: Expected 'ISO 8601 date', got value '${value}'`,
          path: ".dt",
        },
      ]);
    }

    const expectedIsoBas = { dt: "$basicisodate" };

    const resultIsoBas = wyv.validate(expectedIsoBas, candidate);
    if (bas) {
      assertSuccess(resultIsoBas);
    } else {
      assertErrors(resultIsoBas, [
        {
          message: `Type: Expected 'Basic ISO 8601 date', got value '${value}'`,
          path: ".dt",
        },
      ]);
    }

    const expectedRfc = { dt: "$strictisodate" };

    const resultIsoRfc = wyv.validate(expectedRfc, candidate);
    if (strict) {
      assertSuccess(resultIsoRfc);
    } else {
      assertErrors(resultIsoRfc, [
        {
          message: `Type: Expected 'RFC 3339 date', got value '${value}'`,
          path: ".dt",
        },
      ]);
    }
  });
});
