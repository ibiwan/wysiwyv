import { makeWysiwyv } from "wysiwyv/core";


const wyv = makeWysiwyv();

const result = wyv.validate({ age: 42 }, { age: 42 });
console.log(result);

