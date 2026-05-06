import type { HookError, HookKey, HookPlugin } from "../wysiwyv";

const YEAR = '(?:\\d{4})';              // 0000-9999
const MONTH = '(?:0[1-9]|1[0-2])';      // 01-12;
const DAY = `(?:0[1-9]|[12]\\d|3[01])`; // 01-31
const HOUR = `(?:[01]\\d|2[0-3])`;      // 00-23
const MINUTE = '(?:[0-5]\\d)';          // 00-59
const SECOND = '(?:[0-5]\\d)';          // 00-59
const MILLI_EXT = '(?:[,.]\\d+)';       // .123...
const MILLI_RFC = '(?:\\.\\d+)';        // .123...

// Validates numeric ranges: YYYY-MM-DD
const DATE_EXT = `(?:${YEAR}-${MONTH}-${DAY})`;
const DATE_BAS = `(?:${YEAR}${MONTH}${DAY})`;

// Validates numeric ranges: HH:mm:ss.SSS (seconds/ms optional)
const TIME_EXT = `(?:${HOUR}:${MINUTE}(?::${SECOND}(?:${MILLI_EXT})?)?)`
const TIME_BAS = `(?:${HOUR}${MINUTE}(?:${SECOND}(?:${MILLI_EXT})?)?)`
const TIME_RFC = `(?:${HOUR}:${MINUTE}(?::${SECOND}(?:${MILLI_RFC})?)?)`

// Validates Z or ±HH:mm or ±HHmm
const ZONE_EXT = `(?:Z|[+-]${HOUR}:?${MINUTE})`;
const ZONE_BAS = `(?:Z|[+-]${HOUR}${MINUTE})`;
const ZONE_RFC = `(?:Z|[+-]${HOUR}:${MINUTE}|-00:00)`;

const make8601 = () => {
  return new RegExp(`^${DATE_EXT}T${TIME_EXT}${ZONE_EXT}$`, 'i')
}

const RE_ISO_8601 = make8601();

const make8601basic = () => {
  return new RegExp(`^${DATE_BAS}T${TIME_BAS}${ZONE_BAS}$`, 'i')
}

const RE_ISO_8601_BASIC = make8601basic();

const make3339 = () => {
  // Full Pattern: YYYY-MM-DDTHH:mm:ss.sssZ
  return new RegExp(`^${DATE_EXT}[T ]${TIME_RFC}${ZONE_RFC}$`, 'i');
}

const RE_ISO_3339 = make3339();

export const WYV_KEY_ISODATE: HookKey = '$isodate';
export const WYV_KEY_BASICISODATE: HookKey = '$basicisodate';
export const WYV_KEY_STRICTISODATE: HookKey = '$strictisodate';

const checkParsedDate = (value: any): boolean => {
  if (typeof value !== "string") return false;
  const date = new Date(value);
  return !isNaN(date.getTime());
}

const checkIsoDate = (value: any): boolean => {
  if (!RE_ISO_8601.test(value)) return false;
  return checkParsedDate(value);
}

const checkBasicIsoDate = (value: any): boolean => {
  if (!RE_ISO_8601_BASIC.test(value)) return false;
  // return checkParsedDate(value); // built-in can't parse basic.
  return true
}

const checkStrictIsoDate = (value: any): boolean => {
  if (!RE_ISO_3339.test(value)) return false;
  return checkParsedDate(value);
}

const datetimeWyvern: HookPlugin = {
  handles: (value) => [
    WYV_KEY_ISODATE,
    WYV_KEY_BASICISODATE,
    WYV_KEY_STRICTISODATE,
  ].includes(value),
  handlers: {
    [WYV_KEY_ISODATE]: (value: any, _expected, path) => {
      if (!checkIsoDate(value)) return [{
        message: `Expected value to be a valid ISO 8601 date string, got '${value}'`,
        path
      }];
      return []
    },
    [WYV_KEY_BASICISODATE]: (value: any, _expected, path) => {
      if (!checkBasicIsoDate(value)) return [{
        message: `Expected value to be a valid ISO 8601 basic date string, got '${value}'`,
        path
      }];
      return []
    },
    [WYV_KEY_STRICTISODATE]: (value: any, _expected, path) => {
      if (!checkStrictIsoDate(value)) return [{
        message: `Expected value to be a valid RFC 3339 date string, got '${value}'`,
        path
      }];
      return []
    }
  }
}

export default datetimeWyvern;
