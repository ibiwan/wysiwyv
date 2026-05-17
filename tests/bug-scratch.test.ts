import { d } from "../dev-util";
import { makeWysiwyv } from "../src/wysiwyv";

it("bug-scratch file", () => {
  const wyv = makeWysiwyv();
  const data = "asf";
  const expected = "$string";
  const result = wyv.validate(expected, data);
  d(result);
});
