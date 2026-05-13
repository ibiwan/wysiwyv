import { isNanValue, isString } from "./types";

export const repr = (val: unknown) => {
  if (isString(val)) return val;
  if (isNanValue(val)) return "NaN";
  if (val === Infinity) return "Infinity";
  if (val === -Infinity) return "-Infinity";

  try {
    return JSON.stringify(val) ?? String(val);
  } catch {
    return String(val);
  }
};

export const dd = (val: unknown) => {
  console.log(repr(val));

  process.exit(0);
};
