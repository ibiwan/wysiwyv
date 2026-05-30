import { makeWysiwyv as makeCore } from "wysiwyv/core";
import { makeWysiwyv as makeFull } from "wysiwyv";
import { intWyvern, stringWyvern } from "wysiwyv/plugins";

const core = makeCore({ plugins: [intWyvern] });
const full = makeFull();
const custom = makeCore({ plugins: [intWyvern, stringWyvern] });

const r1 = core.validate({ id: "$int" }, { id: 123 });
const r2 = full.validate({ name: "$string" }, { name: "hello" });
const r3 = custom.validate({ id: "$int" }, { id: 123 });

const _s: boolean = r1.success;
const _e: readonly { message: string; path: string }[] = r1.errors;

const _s2: boolean = r2.success;
const _e2: readonly { message: string; path: string }[] = r3.errors;
