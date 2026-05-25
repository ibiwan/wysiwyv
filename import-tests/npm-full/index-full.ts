import { makeWysiwyv } from "wysiwyv";

const wyv = makeWysiwyv({
  plugins: [],
});

const result = wyv.validate({ id: "$int" }, { id: "123" });

console.log(JSON.stringify({ wyv, result }));

if (result?.success !== false) {
  throw "Should have failed";
}

if (!Array.isArray(result.errors)) {
  throw "result.errors Should be an array";
}

if (result.errors.length !== 1) {
  throw "result.errors Should have one error";
}

if (result.errors[0]?.path !== ".id") {
  throw "result.errors[0].path Should be '.id'";
}

if (result.errors[0]?.message !== "Type: Expected 'integer', got value '123'") {
  throw "result.errors[0].message Should describe a Type error";
}
