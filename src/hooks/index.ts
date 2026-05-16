import type { PluginList } from "../type/plugin";

import andWyvern from "./and";
import anyWyvern from "./any";
import arrayWyvern from "./array";
import boolWyvern from "./bool";
import datetimeWyvern from "./datetime";
import emailWyvern from "./email";
import intWyvern from "./int";
import numberWyvern from "./number";
import objectWyvern from "./object";
import orWyvern from "./or";
import stringWyvern from "./string";
import uuidWyvern from "./uuid";
import valWyvern from "./val";

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
