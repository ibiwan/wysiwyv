import { bench, run } from "mitata";
import { makeWysiwyv } from "../src/wysiwyv";
import { z } from "zod";
import * as yup from "yup";
import Joi from "joi";
import * as v from "valibot";

const data = { name: "Joe", age: 27 };

// wysiwyv
const wyv = makeWysiwyv();
const template = { name: "$string", age: "$number" };

// zod
const zodSchema = z.object({ name: z.string(), age: z.number() });

// yup
const yupSchema = yup.object({ name: yup.string().required(), age: yup.number().required() });

// joi
const joiSchema = Joi.object({ name: Joi.string().required(), age: Joi.number().required() });

// valibot
const valibotSchema = v.object({ name: v.string(), age: v.number() });

bench("wysiwyv", () => {
  wyv.validate(template, data);
});

bench("zod", () => {
  zodSchema.safeParse(data);
});

bench("yup", () => {
  yupSchema.validateSync(data);
});

bench("joi", () => {
  joiSchema.validate(data);
});

bench("valibot", () => {
  v.safeParse(valibotSchema, data);
});

await run();
