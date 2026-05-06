export const isString = (value: any):
  value is string =>
  typeof value === 'string';

export const isNumber = (value: any):
  value is number =>
  typeof value === 'number' && Number.isFinite(value);

export const isBoolean = (value: any):
  value is boolean =>
  typeof value === 'boolean';

export const isNull = (value: any):
  value is null =>
  value === null;

export const isUndefined = (value: any):
  value is undefined =>
  value === undefined;

export const isObject = (value: any):
  value is Record<string, any> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const isArray = (value: any):
  value is any[] =>
  Array.isArray(value);

export const isNanValue = (value: any):
  value is number =>
  typeof value === 'number' && Number.isNaN(value);

export const isRegex = (value: any):
  value is RegExp =>
  value instanceof RegExp;
