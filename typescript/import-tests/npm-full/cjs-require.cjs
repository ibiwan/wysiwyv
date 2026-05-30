const tests = [
  { name: "wysiwyv", specifier: "wysiwyv" },
  { name: "wysiwyv/core", specifier: "wysiwyv/core" },
  { name: "wysiwyv/plugins", specifier: "wysiwyv/plugins" },
];

let pass = 0;
let fail = 0;

for (const { name, specifier } of tests) {
  try {
    const mod = require(specifier);
    if (typeof mod.makeWysiwyv !== "function" && name !== "wysiwyv/plugins") {
      console.log(`FAIL cjs ${name} — makeWysiwyv is ${typeof mod.makeWysiwyv}`);
      fail++;
      continue;
    }
    if (name === "wysiwyv/plugins" && typeof mod.intWyvern !== "object") {
      console.log(`FAIL cjs ${name} — intWyvern is ${typeof mod.intWyvern}`);
      fail++;
      continue;
    }
    console.log(`PASS cjs ${name}`);
    pass++;
  } catch (e) {
    console.log(`FAIL cjs ${name} — ${e.code || e.message}`);
    fail++;
  }
}

// Quick smoke test: actually run a validation via require()
try {
  const { makeWysiwyv } = require("wysiwyv");
  const wyv = makeWysiwyv();
  const result = wyv.validate({ id: "$int" }, { id: "not a number" });
  if (result.success === false && result.errors.length > 0) {
    console.log("PASS cjs runtime — validation works");
    pass++;
  } else {
    console.log("FAIL cjs runtime — validation did not reject");
    fail++;
  }
} catch (e) {
  console.log(`FAIL cjs runtime — ${e.message}`);
  fail++;
}

console.log(`CJS_PASS=${pass}`);
console.log(`CJS_FAIL=${fail}`);

if (fail > 0) {
  process.exit(1);
}
