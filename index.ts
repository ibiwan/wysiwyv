// import { defaultHooks } from "./src/hooks";
import intWyvern from "./src/hooks/int";
import { makeWysiwyv } from "./src/wysiwyv";

const wyv = makeWysiwyv({
  hooks: [intWyvern],
});
wyv.validate({}, {});
