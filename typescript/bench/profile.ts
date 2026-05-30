import { makeWysiwyv } from "../src/wysiwyv";

const wyv = makeWysiwyv();
const template = { name: "$string", age: "$number" };
const data = { name: "Joe", age: 27 };

// warm up
for (let i = 0; i < 1_000; i++) wyv.validate(template, data);

// profiled run
for (let i = 0; i < 1_000_000; i++) wyv.validate(template, data);
