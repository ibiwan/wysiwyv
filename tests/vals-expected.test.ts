import { makeWysiwyv, type WysiwyvInstance } from "../src/wysiwyv";


describe('Val Expected JSON Object', () => {
  const predefs = {
    'apple': 'ball',
    'banana': 'bat',
    'peach': 'cat',
  };
  let wyv: WysiwyvInstance;

  beforeEach(() => {
    wyv = makeWysiwyv({ values: predefs });
  });

  test('Valid generic UUID', () => {
    const expected = {
      team: { $val: 'team' },
      base: { $val: 'apple' },
      diamond: { swing: { $val: 'banana' } },
      uniform: { homeColors: { $val: 'team' } }
    }

    const candidate = {
      team: 'Yankees',
      base: 'ball',
      diamond: { 'swing': 'bat' },
      uniform: { homeColors: 'Yankees' }
    };

    const result = wyv.validate(expected, candidate);
    expect(result).toEqual([]);
  });


  test('shallow mismatch', () => {
    const expected = {
      shape: { $val: 'apple' },
    }

    const candidate = {
      shape: 'spheroid'
    };

    const result = wyv.validate(expected, candidate);
    expect(result).toEqual([
      {
        message: "Expected value with key 'apple' to match previous value 'ball', got 'spheroid'",
        path: '.shape'
      }
    ]);
  });

  test('deep mismatch', () => {
    const expected = {
      nested: {
        fuzzbearer: { $val: 'peach' },
      }
    }

    const candidate = {
      nested: {
        fuzzbearer: 'dog'
      }
    };

    const result = wyv.validate(expected, candidate);
    expect(result).toEqual([
      {
        message: "Expected value with key 'peach' to match previous value 'cat', got 'dog'",
        path: '.nested.fuzzbearer'
      }
    ]);
  });

  test('repeat mismatch', () => {
    const expected = {
      shape: { $val: 'crunch' },
      nested: {
        crunchable: { $val: 'crunch' },
      }
    }

    const candidate = {
      shape: 'carrot',
      nested: {
        crunchable: 'celery'
      }
    };

    const result = wyv.validate(expected, candidate);
    expect(result).toEqual([
      {
        message: "Expected value with key 'crunch' to match previous value 'carrot', got 'celery'",
        path: '.nested.crunchable'
      }
    ]);
  });

});