export const isString = (value: unknown): value is string =>
  typeof value === "string";

export const isNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

export const isBoolean = (value: unknown): value is boolean =>
  typeof value === "boolean";

export const isNull = (value: unknown): value is null => value === null;

export const notNull = <T>(
  value: T | undefined | null,
): value is NonNullable<T> => value !== undefined && value !== null;

export const isUndefined = (value: unknown): value is undefined =>
  value === undefined;

export const isDefined = <T>(value: T | undefined): value is T =>
  value !== undefined;

export const isObject = (value: unknown): value is object =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const isPlainObject = (val: unknown): val is Record<string, unknown> => {
  if (!isObject(val)) return false;

  const proto = Object.getPrototypeOf(val);
  return proto === null || proto === Object.prototype;
};

export const isOddObject = (val: unknown): val is object => {
  if (!isObject(val)) return false;

  const proto = Object.getPrototypeOf(val);
  return proto !== null && proto !== Object.prototype;
};

export const isEmptyObject = (value: unknown): value is Record<string, never> =>
  isObject(value) && Object.keys(value).length === 0;

export const isArray = (value: unknown): value is unknown[] =>
  Array.isArray(value);

export const isNanValue = (value: unknown): value is number =>
  typeof value === "number" && Number.isNaN(value);

export const isRegex = (value: unknown): value is RegExp =>
  value instanceof RegExp;
