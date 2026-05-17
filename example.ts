import intWyvern from "./src/hooks/int";
import { makeWysiwyv } from "./src/wysiwyv-core";

const wyv = makeWysiwyv({
  plugins: [intWyvern],
});
wyv.validate({}, {});
