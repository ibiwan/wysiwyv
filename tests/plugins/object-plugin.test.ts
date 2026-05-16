import type { HookValue } from "../../src/type/template";
import type { WysiwyvInstance } from "../../src/type/engine";
import { makeWysiwyv } from "../../src/wysiwyv";

describe("Object Type Plugin", () => {
  let wyv: WysiwyvInstance;

  beforeEach(() => {
    wyv = makeWysiwyv();
  });

  const aDate = new Date();
  const aDateString = aDate.toISOString();

  const OBJECTS: {
    val: unknown;
    repr: string;
    isPlainObject: boolean;
    isFullObject: boolean;
  }[] = [
    { val: {}, repr: "empty", isPlainObject: true, isFullObject: true },
    {
      val: { a: "b" },
      repr: "simple",
      isPlainObject: true,
      isFullObject: true,
    },
    {
      val: new Object(),
      repr: "new Object",
      isPlainObject: true,
      isFullObject: true,
    },
    {
      val: Object.create(null),
      repr: "Object.create",
      isPlainObject: true,
      isFullObject: true,
    },
    { val: null, repr: "null", isPlainObject: false, isFullObject: false },
    { val: [], repr: "[]", isPlainObject: false, isFullObject: false },
    {
      val: aDate,
      repr: aDateString,
      isPlainObject: false,
      isFullObject: true,
    },
    { val: /a/, repr: "/a/", isPlainObject: false, isFullObject: true },
    {
      val: new String("a"),
      repr: "a",
      isPlainObject: false,
      isFullObject: true,
    },
    {
      val: new Map(),
      repr: "Map {}",
      isPlainObject: false,
      isFullObject: true,
    },
    {
      val: new Set(),
      repr: "Set {}",
      isPlainObject: false,
      isFullObject: true,
    },
    {
      val: class Foo {},
      repr: "class Foo {\n      }",
      isPlainObject: false,
      isFullObject: false,
    },
    {
      val: () => {},
      repr: "() => {}",
      isPlainObject: false,
      isFullObject: false,
    },
  ];

  test.each(OBJECTS)("Handles simpleObject $repr", (row) => {
    const { val, repr, isPlainObject } = row;

    const expected = { obj: "$plainobject" };
    const candidate = { obj: val };
    const result = wyv.validate(expected, candidate);

    if (isPlainObject) {
      expect(result.success).toBe(true);
    } else {
      expect(result.errors).toEqual([
        {
          message: `Type: Expected 'plainobject', got value '${repr}'`,
          path: ".obj",
        },
      ]);
    }
  });

  test.each(OBJECTS)("Handles Object $repr", (row) => {
    const { val, repr, isFullObject } = row;

    const expected = { obj: "$object" };
    const candidate = { obj: val };
    const result = wyv.validate(expected, candidate);

    if (isFullObject) {
      expect(result.success).toBe(true);
    } else {
      expect(result.errors).toEqual([
        {
          message: `Type: Expected 'object', got value '${repr}'`,
          path: ".obj",
        },
      ]);
    }
  });

  it("validates entire value of an object, allow extra keys", () => {
    const expected = {
      obj: { $object: { $partial: { a: "b", c: "d" } } },
    };
    const candidate = { obj: { a: "b", c: "d", e: "f" } };
    const result = wyv.validate(expected, candidate);

    expect(result.success).toBe(true);
  });

  it("validates expected $partial is reasonable", () => {
    const expected = {
      obj: { $object: { $partial: "not an object" } },
    };
    const candidate = { obj: { a: "b", c: "d", e: "f" } };
    const result = wyv.validate(expected, candidate);

    expect(result.errors).toEqual([
      {
        message:
          "Configuration Error: $object.$partial option should be an object",
        path: ".obj",
      },
    ]);
  });

  it("validates expected $partial candidate value is reasonable", () => {
    const expected = {
      obj: { $object: { $partial: {} } },
    };
    const candidate = { obj: new Map() };
    const result = wyv.validate(expected as unknown as HookValue, candidate);

    expect(result.errors).toEqual([
      {
        message:
          "Type: Expected 'plainobject for $partial', got value 'Map {}'",
        path: ".obj",
      },
    ]);
  });

  it("validates expected $eachElement candidate value is reasonable", () => {
    const expected = {
      obj: { $object: { $eachElement: {} } },
    };
    const candidate = { obj: new Map() };
    const result = wyv.validate(expected as unknown as HookValue, candidate);

    expect(result.errors).toEqual([
      {
        message:
          "Type: Expected 'plainobject for $eachElement', got value 'Map {}'",
        path: ".obj",
      },
    ]);
  });

  it("validates no unexpected config", () => {
    const expected = {
      obj: { $object: { $reverseObject: "no idea", $arrayLength: 2 } },
    };
    const candidate = { obj: { a: "b", c: "d", e: "f" } };
    const result = wyv.validate(expected, candidate);

    expect(result.errors).toEqual([
      {
        message:
          "Configuration Error: Unexpected $object parameters: $reverseObject,$arrayLength",
        path: ".obj",
      },
    ]);
  });

  it("validates no conflicting config", () => {
    const expected = {
      obj: { $object: { $partial: "no idea", $eachElement: 2 } },
    };
    const candidate = { obj: { a: "b", c: "d", e: "f" } };
    const result = wyv.validate(expected, candidate);

    expect(result.errors).toEqual([
      {
        message:
          "Configuration Error: $object options can specify $partial or $eachElement but not both",
        path: ".obj",
      },
    ]);
  });

  it("validates partial value of an object, rejects missing keys", () => {
    const expected = {
      obj: { $object: { $partial: { a: "b", c: "d" } } },
    };
    const candidate = { obj: { a: "b" } };
    const result = wyv.validate(expected, candidate);

    expect(result.errors).toEqual([
      {
        message: "Missing element at 'c': expected 'd'",
        path: ".obj.c",
      },
    ]);
  });

  it("checks each value of an object, string", () => {
    const expected = {
      obj: {
        $object: {
          $eachElement: "$string",
        },
      },
    };
    const candidate = { obj: { a: "b", c: "d", e: "f" } };
    const result = wyv.validate(expected, candidate);

    expect(result.success).toBe(true);
  });

  it("checks each value of an object, string, rejects", () => {
    const expected = {
      obj: {
        $object: {
          $eachElement: "$string",
        },
      },
    };
    const candidate = { obj: { a: "b", c: 3, e: "f" } };
    const result = wyv.validate(expected, candidate);

    expect(result.errors).toEqual([
      { message: "Type: Expected 'string', got value '3'", path: ".obj.c" },
    ]);
  });

  it("checks each value of an object, nested", () => {
    const expected = {
      obj: {
        $object: {
          $eachElement: { $array: { $length: 2 } },
        },
      },
    };
    const candidate = { obj: { a: [1, 2], b: ["a", "b"], q: [true, false] } };
    const result = wyv.validate(expected, candidate);
    expect(result.success).toBe(true);
  });

  it("checks each value of an object, nested, rejects", () => {
    const expected = {
      obj: {
        $object: {
          $eachElement: { $array: { $length: 2 } },
        },
      },
    };
    const candidate = { obj: { a: [1, 2], b: "abcdef", q: [true, false] } };
    const result = wyv.validate(expected, candidate);
    expect(result.errors).toEqual([
      {
        message: "Type: Expected 'array', got value 'abcdef'",
        path: ".obj.b",
      },
    ]);
  });
});
