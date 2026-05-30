import { makeWysiwyv } from "wysiwyv/core";
import { intWyvern } from "wysiwyv/plugins";

const wyv = makeWysiwyv({ plugins: [intWyvern] });
const result = wyv.validate({ id: "$int" }, { id: 42 });
console.log(result.success);
