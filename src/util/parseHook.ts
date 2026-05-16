import type { HookValue } from "../type/template";
import type { HookKey } from "../type/plugin";
import { isObject, isPlainObject, isString } from "./types";

export const getHookKey = (val: HookValue): HookKey | null => {
  if (isString(val)) {
    if (val.startsWith("$") && !val.startsWith("$$")) {
      return val as HookKey;
    }
  }

  if (isObject(val) && Object.keys(val).length === 1) {
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
