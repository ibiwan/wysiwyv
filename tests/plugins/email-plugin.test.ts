import type { WysiwyvInstance } from "../../src/type";
import { makeWysiwyv } from "../../src/wysiwyv";

const GOOD_EMAILS = [
  "simple@example.com",
  "dev.archery@guild.org.uk",
  "user+extra@gmail.com",
  "1234567890@example.com",
  "firstname.lastname-work@sub.domain.com",
  "my_internal_id@company.io",
  "administrator@museum.photography",
  "i@biwan.me",
];

const _TRICKY_EMAILS = [
  "postmaster@[123.123.123.123]", // RFC-valid but not supported
];

const BAD_EMAILS = [
  "plainaddress",
  "user@",
  "user@domain@domain.com",
  "user@domain.",
  "user..name@domain.com",
  "user name@domain.com",
  "user#name@domain.com",
];

describe("Email Expected JSON Object", () => {
  let wyv: WysiwyvInstance;
  beforeEach(() => {
    wyv = makeWysiwyv();
  });
  test.each(GOOD_EMAILS)("validates good email %s", (email) => {
    const expected = { e: "$email" };
    const candidate = { e: email };
    const result = wyv.validate(expected, candidate);
    expect(result.success).toBe(true);
  });
  test.each(BAD_EMAILS)("rejects bad email %s", (email) => {
    const expected = { e: "$email" };
    const candidate = { e: email };
    const result = wyv.validate(expected, candidate);
    expect(result.errors).toEqual([
      {
        message: `Type: Expected 'valid email address', got value '${email}'`,
        path: ".e",
      },
    ]);
  });
  it("rejects non-string email", () => {
    const expected = { e: "$email" };
    const candidate = { e: 12345 };
    const result = wyv.validate(expected, candidate);
    expect(result.errors).toEqual([
      {
        message: `Type: Expected 'string', got value '12345'`,
        path: ".e",
      },
    ]);
  });
});
