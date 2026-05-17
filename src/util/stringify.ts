import { isNanValue, isNull, isOddObject, isString } from "./types";

function getDetailedType(val: object) {
  // This returns strings like "[object Map]", "[object Date]", "[object RegExp]"
  const rawType = Object.prototype.toString.call(val);

  // Clean it up to just "Map", "Date", etc.
  return rawType.slice(8, -1);
}

export const repr = (val: unknown) => {
  if (isNull(val)) return "null";
  if (isString(val)) return val;
  if (isNanValue(val)) return "NaN";
  if (val === Infinity) return "Infinity";
  if (val === -Infinity) return "-Infinity";
  if (val instanceof Date) return val.toISOString();
  if (val instanceof RegExp) return val.toString();
  if (val instanceof String) return val.toString();

  const label = isOddObject(val) ? getDetailedType(val) : "";

  let str;
  try {
    str = JSON.stringify(val) ?? String(val);
  } catch {
    str = String(val);
  }
  return [label, str].filter((s) => s).join(" ");
};
