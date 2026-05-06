import { isArray, isBoolean, isNanValue, isNull, isNumber, isObject, isRegex, isString, isUndefined } from "../src/util/types";

const values = [1, 'a', true, null, undefined, { a: 1 }, [1, 2, 3], () => { }, /regex/];
const functions = [isString, isNumber, isBoolean, isNull, isUndefined, isObject, isArray, isNanValue, isRegex];
describe('values get typed correctly', () => {
  test('isString', () => {
    expect(values.map(isString)).toEqual([false, true, false, false, false, false, false, false, false]);
  });

  test('isNumber', () => {
    expect(values.map(isNumber)).toEqual([true, false, false, false, false, false, false, false, false]);
  });

  test('isBoolean', () => {
    expect(values.map(isBoolean)).toEqual([false, false, true, false, false, false, false, false, false]);
  });

  test('isNull', () => {
    expect(values.map(isNull)).toEqual([false, false, false, true, false, false, false, false, false]);
  });

  test('isUndefined', () => {
    expect(values.map(isUndefined)).toEqual([false, false, false, false, true, false, false, false, false]);
  });

  test('isObject', () => {
    expect(values.map(isObject)).toEqual([false, false, false, false, false, true, false, false, true]);
  });

  test('isArray', () => {
    expect(values.map(isArray)).toEqual([false, false, false, false, false, false, true, false, false]);
  });

  test('isNanValue', () => {
    expect(values.map(isNanValue)).toEqual([false, false, false, false, false, false, false, false, false]);
  });

  test('isRegex', () => {
    expect(values.map(isRegex)).toEqual([false, false, false, false, false, false, false, false, true]);
  });
});