import { makeWysiwyv } from "../src/wysiwyv";

describe('Simple Expected JSON Object', () => {
  let expected = {
    "a": 1,
    "b": "c",
    "d": true,
    "e": null,
    "f": [1, 2, 3],
    "g": { "h": 4 },
    "i": 5.67,
    "j": { "nested": { "value": "test" } }
  }
  let wyv: ReturnType<typeof makeWysiwyv>;

  beforeEach(() => {
    // Initialize the WYSIWYV validator before each test
    wyv = makeWysiwyv();
  });

  it('should pass when candidate matches the expected object', () => {
    const candidate = { ...expected };
    const result = wyv.validate(expected, candidate);
    expect(result).toEqual([]);
  });

  it('should fail when candidate has extra properties', () => {
    const candidate = { ...expected, "extra": "value" };
    const result = wyv.validate(expected, candidate);

    expect(result).toEqual([
      {
        message: "Unexpected object key 'extra': got 'value', expected nothing",
        path: ".extra",
      }
    ]);
  });

  it('should fail when candidate is missing properties', () => {
    const { a, b, ...candidate } = expected; // create a candidate missing 'a' and 'b'
    const result = wyv.validate(expected, candidate);

    expect(result).toEqual([
      {
        message: "Missing object key 'a': expected '1', got 'undefined'",
        path: ".a",
      },
      {
        message: "Missing object key 'b': expected 'c', got 'undefined'",
        path: ".b",
      }
    ]);
  });

  it('should fail when candidate has wrong number', () => {
    const candidate = { ...expected, "a": 2 };
    const result = wyv.validate(expected, candidate);

    expect(result).toEqual([
      {
        message: "Value mismatch: expected '1', got '2'",
        path: ".a",
      }
    ]);
  });

  it('should fail when candidate has wrong type for number', () => {
    const candidate = { ...expected, "a": "not a number" };
    const result = wyv.validate(expected, candidate);

    expect(result).toEqual([
      {
        message: "Type mismatch: expected type 'number', got type 'string'",
        path: ".a",
      }
    ]);
  });

  it('should fail when candidate has wrong string', () => {
    const candidate = { ...expected, "b": "wrong string" };
    const result = wyv.validate(expected, candidate);

    expect(result).toEqual([
      {
        message: "Value mismatch: expected 'c', got 'wrong string'",
        path: ".b",
      }
    ]);
  });

  it('should fail when candidate has wrong type for string', () => {
    const candidate = { ...expected, "b": 123 };
    const result = wyv.validate(expected, candidate);

    expect(result).toEqual([
      {
        message: "Type mismatch: expected type 'string', got type 'number'",
        path: ".b",
      }
    ]);
  });

  it('should fail when candidate has wrong boolean', () => {
    const candidate = { ...expected, "d": false };
    const result = wyv.validate(expected, candidate);

    expect(result).toEqual([
      {
        message: "Value mismatch: expected 'true', got 'false'",
        path: ".d",
      }
    ]);
  });

  it('should fail when candidate has wrong type for boolean', () => {
    const candidate = { ...expected, "d": "not a boolean" };
    const result = wyv.validate(expected, candidate);

    expect(result).toEqual([
      {
        message: "Type mismatch: expected type 'boolean', got type 'string'",
        path: ".d",
      }
    ]);
  });

  it('should fail when candidate has wrong null value', () => {
    const candidate = { ...expected, "e": undefined };
    const result = wyv.validate(expected, candidate);

    expect(result).toEqual([
      {
        message: "Type mismatch: expected 'null', got 'undefined' (undefined)",
        path: ".e",
      }
    ]);
  });

  it('should fail when candidate has wrong type for null', () => {
    const candidate = { ...expected, "e": 0 };
    const result = wyv.validate(expected, candidate);

    expect(result).toEqual([
      {
        message: `Type mismatch: expected 'null', got '0' (number)`,
        path: ".e",
      }
    ]);
  });

  it('should fail when candidate has wrong type for array', () => {
    const candidate = { ...expected, "f": { "a": "b" } }
    const result = wyv.validate(expected, candidate);

    expect(result).toEqual(
      [
        {
          "message": "Type mismatch: expected type 'array', got type 'object'",
          "path": ".f",
        }])
  });

  it('should fail when candidate has short array', () => {
    const candidate = { ...expected, "f": [1] };
    const result = wyv.validate(expected, candidate);

    expect(result).toEqual([
      {
        message: `Array length mismatch: expected length ${expected.f.length}, got length ${candidate.f.length}`,
        path: ".f",
      },
      {
        "message": "Missing array item at index 1: expected '2', got 'undefined'",
        "path": ".f[1]",
      },
      {
        "message": "Missing array item at index 2: expected '3', got 'undefined'",
        "path": ".f[2]",
      },
    ]);
  });

  it('should fail when candidate has long array', () => {
    const candidate = { ...expected, "f": [1, 2, 3, 4] };
    const result = wyv.validate(expected, candidate);

    expect(result).toEqual([
      {
        message: `Array length mismatch: expected length ${expected.f.length}, got length ${candidate.f.length}`,
        path: ".f",
      },
    ]);
  });

  it('should fail when candidate has wrong type in array', () => {
    const candidate = { ...expected, "f": [1, "not a number", 3] };
    const result = wyv.validate(expected, candidate);

    expect(result).toEqual([
      {
        message: "Type mismatch: expected type 'number', got type 'string'",
        path: ".f[1]",
      }
    ]);
  });

  it('should fail when candidate has wrong value in array', () => {
    const candidate = { ...expected, "f": [1, 99, 3] };
    const result = wyv.validate(expected, candidate);

    expect(result).toEqual([
      {
        message: "Value mismatch: expected '2', got '99'",
        path: ".f[1]",
      }
    ]);
  });

  it('should fail when candidate has wrong type for object', () => {
    const candidate = { ...expected, "g": [] }
    const result = wyv.validate(expected, candidate);

    expect(result).toEqual([
      {
        "message": "Type mismatch: expected type 'object', got type 'object'",
        "path": ".g",
      },
    ]);
  })

  it('should fail when candidate has wrong nested object value', () => {
    const candidate = { ...expected, "g": { "h": 5 } };
    const result = wyv.validate(expected, candidate);

    expect(result).toEqual([
      {
        message: "Value mismatch: expected '4', got '5'",
        path: ".g.h",
      }
    ]);
  });

  it('should fail when candidate has wrong nested object type', () => {
    const candidate = { ...expected, "g": { "h": "not a number" } };
    const result = wyv.validate(expected, candidate);

    expect(result).toEqual([
      {
        message: "Type mismatch: expected type 'number', got type 'string'",
        path: ".g.h",
      }
    ]);
  });

  it('should fail when candidate has wrong nested object value in deeper nesting', () => {
    const candidate = { ...expected, "j": { "nested": { "value": "wrong value" } } };
    const result = wyv.validate(expected, candidate);

    expect(result).toEqual([
      {
        message: "Value mismatch: expected 'test', got 'wrong value'",
        path: ".j.nested.value",
      }
    ]);
  })

  it('should fail when candidate has missing key in deeper nesting', () => {
    ;
    const candidate = { ...expected, "j": { "nested": {} } };
    const result = wyv.validate(expected, candidate);

    expect(result).toEqual([
      {
        message: "Missing object key 'value': expected 'test', got 'undefined'",
        path: ".j.nested.value",
      }
    ]);
  });

  it('should fail when candidate has extra key in deeper nesting', () => {
    const candidate = { ...expected, "j": { "nested": { "value": "test", "extra": "value" } } };
    const result = wyv.validate(expected, candidate);

    expect(result).toEqual([
      {
        message: "Unexpected object key 'extra': got 'value', expected nothing",
        path: ".j.nested.extra",
      }
    ]);
  });
});