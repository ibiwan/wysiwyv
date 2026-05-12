import type { HookKey, HookValue } from "../type";
import { isObject, isString } from "./types";

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
}

export const getHookParams = (hook: HookValue, key: string) => {
  const obj = isObject(hook) ? hook as Record<string, HookValue> : null;
  const params = obj ? obj[key] : {};
  return params
}
