import { makeWysiwyv } from "wysiwyv";


const wyv = makeWysiwyv();

const result = wyv.validate({ age: "$int" }, { age: 42 });
console.log(result);

