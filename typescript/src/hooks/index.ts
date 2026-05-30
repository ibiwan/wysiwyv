import type { PluginList } from "../type/plugin.js";

import andWyvern from "./and.js";
import anyWyvern from "./any.js";
import arrayWyvern from "./array.js";
import boolWyvern from "./bool.js";
import datetimeWyvern from "./datetime.js";
import emailWyvern from "./email.js";
import intWyvern from "./int.js";
import numberWyvern from "./number.js";
import objectWyvern from "./object.js";
import orWyvern from "./or.js";
import stringWyvern from "./string.js";
import uuidWyvern from "./uuid.js";
import valWyvern from "./val.js";

export const defaultHooks: PluginList = [
  andWyvern,
  anyWyvern,
  arrayWyvern,
  boolWyvern,
  datetimeWyvern,
  emailWyvern,
  intWyvern,
  numberWyvern,
  objectWyvern,
  orWyvern,
  stringWyvern,
  uuidWyvern,
  valWyvern,
];

export {
  andWyvern,
  anyWyvern,
  arrayWyvern,
  boolWyvern,
  datetimeWyvern,
  emailWyvern,
  intWyvern,
  numberWyvern,
  objectWyvern,
  orWyvern,
  stringWyvern,
  uuidWyvern,
  valWyvern,
};
