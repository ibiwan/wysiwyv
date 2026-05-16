import type { PluginList } from "../type/plugin";
import andWyvern from "./and";

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
  // TODO: anyWyvern
  arrayWyvern,
  boolWyvern,
  datetimeWyvern,
  emailWyvern,
  intWyvern,
  numberWyvern,
  objectWyvern,
  // TODO: oneOfWyvern
  orWyvern,
  stringWyvern,
  uuidWyvern,
  valWyvern,
];
