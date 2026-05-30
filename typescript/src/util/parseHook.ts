import type { HookValue } from "../type/template.js";
import type { HookKey } from "../type/plugin.js";
import { isPlainObject, isString } from "./types.js";

export const getHookKey = (val: HookValue): HookKey | null => {
  if (isString(val)) {
    if (val.startsWith("$") && !val.startsWith("$$")) {
      return val as HookKey;
    }
  }

  if (isPlainObject(val) && Object.keys(val).length === 1) {
    const key = Object.keys(val)[0] as string;

    if (key.startsWith("$") && !key.startsWith("$$")) {
      return key as HookKey;
    }
  }

  return null;
};

export const getHookParams = (hook: unknown, key: string): unknown => {
  if (isPlainObject(hook)) {
    return hook[key];
  }
  return null;
};
