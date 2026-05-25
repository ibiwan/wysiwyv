import { makeWysiwyv } from "wysiwyv";

const wyv = makeWysiwyv();
const result = wyv.validate({ id: "$int" }, { id: 42 });
console.log(result.success);
