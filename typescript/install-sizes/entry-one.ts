import { makeWysiwyv } from "wysiwyv/core";
import { intWyvern } from "wysiwyv/plugins";


const wyv = makeWysiwyv({
  plugins: [intWyvern],
});

const result = wyv.validate({ age: "$int" }, { age: 42 });
console.log(result);

