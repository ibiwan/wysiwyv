| [README](README.md) | [USAGE](README-USAGE.md) | _INCLUDED PLUGINS_ | [PLUGIN AUTHORING](README-PLUGIN-AUTHORING.md) |
| :------------------ | :----------------------- | :----------------- | :--------------------------------------------- |

# Included Plugins

- [Basic Syntax](#basic-syntax)
- [$and](#and) / [$or](#or)
- [$any](#any)
- [$array](#array) / [$object](#object) / [$plainobject](#plain-object)
- [$basicisodate](#basic-iso-date) / [$isodate](#iso-date) / [$strictisodate](#strict-iso-date)
- [$bool](#bool)
- [$email](#email)
- [$int](#int) / [$number](#number)
- [$string](#string)
- [$uuid](#uuid)
- [$val](#val)

## BASIC SYNTAX

Each plugin has a unique tag starting with a dollar sign, e.g. `$myplugin`.

Syntax varies by number of parameters being passed to the plugin.

### No Parameters

Matcher is a simple string with just the plugin tag:

```js
{ "id": "$uuid" }
```

### One Parameter

Matcher is an object with the tag as its only key, and parameter as its value. (Here, the UUID version)

```js
{ "id": { "$uuid": 4 } }
```

### Named Parameters

Matcher is an object with the tag as its only key, and a sub-object with the named parameters. Parameter names also start with `$`

```js
{ "age": {
    "$int": {
        "$min": 20,
        "$max": 80
    }
}}
```

[↑ top](#included-plugins)

## AND

Key: `$and`

Takes an array of predicates.

- If array is empty, returns success
- If ALL predicates are passed, returns success
- If ANY predicates fail:
  - One error is recorded for the $and block itself
  - All errors from failed predicates are returned
  - The same path will be set for all for easy association
- No short-circuiting; all predicates are evaluated

```js
{
  "id": {
      "$and": [
          "$uuid",
          { "$val": "store_id" }
      ],
  },
}
```

See [and-plugin.test.ts](tests/plugins/and-plugin.test.ts) for exhaustive cases

[↑ top](#included-plugins)

## ANY

Key: `$any`

Succeeds on any input value.

```js
{ "biography": "$any" }
```

See [any-plugin.test.ts](tests/plugins/any-plugin.test.ts) for exhaustive cases

[↑ top](#included-plugins)

## ARRAY

Key: `$array`

Validates that the input is an array.

- No parameters: accepts any array
- Optional named parameters:
  - `$length` — exact length match
  - `$minlength` — minimum length (inclusive)
  - `$maxlength` — maximum length (inclusive)
  - `$each` — validate every element against a template
- All length constraints are checked independently; a value can fail multiple constraints
- ⚠️ Unknown parameters alongside recognized ones generate a config error

```js
// bare — any array
{ "tags": "$array" }
```

```js
// length constraints
{ "tags": { "$array": { "$minlength": 1, "$maxlength": 10 } } }
```

```js
// explicit $each — validate every element
{ "tags": {
    "$array": {
        "$each": "$string"
    }
}}
```

```js
// implicit each shorthand — if no recognized parameters are present,
// the params object itself becomes the element template
{ "team": {
    "$array": {
        "name": "$string",
        "role": "$string"
    }
}}
```

**Note:** The implicit shorthand only activates when _no_ recognized parameters (`$length`, `$minlength`, `$maxlength`, `$each`) are present. Mixing recognized parameters with extra keys produces a config error.

See [array-plugin.test.ts](tests/plugins/array-plugin.test.ts) for exhaustive cases

[↑ top](#included-plugins)

## BASIC ISO DATE

Key: `$basicisodate`

Validates ISO 8601 Basic format — the compact form with no separators.

- Must be a string
- Format: `YYYYMMDDTHHmmssZ` (no dashes or colons)
- Seconds and fractional seconds are optional
- Timezone designator is required (`Z` or `±HHmm`)
- Case-insensitive `T` separator
- Validates numeric ranges for date/time components

```js
// accepts "20201209T160953Z"
{ "timestamp": "$basicisodate" }
```

See [datetime-plugin.test.ts](tests/plugins/datetime-plugin.test.ts) for exhaustive cases

[↑ top](#included-plugins)

## BOOL

Key: `$bool`

Validates that the input is a boolean.

- Accepts `true` and `false` only
- Rejects truthy/falsy stand-ins: `"true"`, `"false"`, `0`, `1`, etc.
- No parameters

```js
{ "active": "$bool" }
```

See [bool-plugin.test.ts](tests/plugins/bool-plugin.test.ts) for exhaustive cases

[↑ top](#included-plugins)

## EMAIL

Key: `$email`

Validates email address format.

- Must be a string
- Covers common email formats; not an exhaustive RFC 5322 implementation
- Rejects: missing `@`, double `@`, trailing dot in domain, consecutive dots in local part, spaces, bare addresses without a domain dot
- No parameters

```js
{ "contact": "$email" }
```

See [email-plugin.test.ts](tests/plugins/email-plugin.test.ts) for exhaustive cases

[↑ top](#included-plugins)

## INT

Key: `$int`

Validates that the input is an integer.

- Uses `Number.isInteger()` under the hood
- Accepts whole-valued floats like `1.0` and `-0`
- Rejects floats, NaN, Infinity, bigints, and non-numbers
- Optional named parameters:
  - `$min` — inclusive lower bound (≥)
  - `$max` — inclusive upper bound (≤)
- Both constraints are checked independently; a value can fail both

```js
// bare — any integer
{ "count": "$int" }
```

```js
// with bounds
{ "age": {
    "$int": {
        "$min": 0,
        "$max": 150
    }
}}
```

See [int-plugin.test.ts](tests/plugins/int-plugin.test.ts) for exhaustive cases

[↑ top](#included-plugins)

## ISO DATE

Key: `$isodate`

Validates ISO 8601 Extended format — the common form with separators.

- Must be a string
- Format: `YYYY-MM-DDTHH:mm:ssZ` (with dashes and colons)
- Seconds and fractional seconds are optional
- Timezone designator is required (`Z` or `±HH:mm`)
- Case-insensitive `T` separator
- Validates numeric ranges for date/time components
- Also checks that the string parses to a valid JS Date (catches things like Feb 30)

```js
// accepts "2026-05-05T20:41:00Z", "2026-05-05T13:41:00-07:00"
{ "createdAt": "$isodate" }
```

See [datetime-plugin.test.ts](tests/plugins/datetime-plugin.test.ts) for exhaustive cases

[↑ top](#included-plugins)

## NUMBER

Key: `$number`

Validates that the input is a finite number.

- Accepts integers, floats, `-0`
- Rejects NaN, Infinity, -Infinity, bigints, and non-numbers
- Optional named parameters:
  - `$min` — inclusive lower bound (≥)
  - `$max` — inclusive upper bound (≤)
  - `$gt` — exclusive lower bound (>)
  - `$lt` — exclusive upper bound (<)
- All constraints are checked independently

```js
// bare — any finite number
{ "score": "$number" }
```

```js
// inclusive bounds
{ "rating": {
    "$number": {
        "$min": 0,
        "$max": 5
    }
}}
```

```js
// exclusive bounds
{ "temperature": {
    "$number": {
        "$gt": -273.15
    }
}}
```

See [number-plugin.test.ts](tests/plugins/number-plugin.test.ts) for exhaustive cases

[↑ top](#included-plugins)

## OBJECT

Key: `$object`

Validates that the input is an object in the broad sense — includes Date, RegExp, Map, Set, wrapped primitives, etc.

- Rejects `null`, arrays, functions, and classes
- For plain objects only, see [$plainobject](#plain-object)
- Optional named parameters (mutually exclusive):
  - `$partial` — validate a subset of keys; extra keys in the candidate are allowed; missing expected keys produce errors
  - `$eachElement` — validate every value in the object against a template
- Using both `$partial` and `$eachElement` together produces a config error
- Unknown parameters produce a config error

```js
// bare — accepts any object, including Date, Map, Set, etc.
{ "metadata": "$object" }
```

```js
// partial match — only check specified keys, ignore extras
{ "user": {
    "$object": {
        "$partial": {
            "name": "$string",
            "email": "$email"
        }
    }
}}
```

```js
// each element — every value must match the template
{ "scores": {
    "$object": {
        "$eachElement": "$number"
    }
}}
```

```js
// each element with nesting
{ "teams": {
    "$object": {
        "$eachElement": { "$array": { "$length": 2 } }
    }
}}
```

See [object-plugin.test.ts](tests/plugins/object-plugin.test.ts) for exhaustive cases

[↑ top](#included-plugins)

## OR

Key: `$or`

Takes an array of predicates.

- If array is empty, returns an error
  - Boolean algebra defines the OR identity as false
- If ANY predicates are passed, returns success
  - Short-Circuiting: Further predicates are not evaluated
- If ALL predicates fail:
  - One error is recorded for the $or block itself
  - All errors from all predicates are returned
  - The same path will be set for all for easy association

```js
{
  "id": {
      "$or": [
          "$uuid",
          "$number"
      ]
  }
}
```

See [or-plugin.test.ts](tests/plugins/or-plugin.test.ts) for exhaustive cases

[↑ top](#included-plugins)

## PLAIN OBJECT

Key: `$plainobject`

Validates that the input is a plain object — only literal `{}`, `new Object()`, and `Object.create(null)`.

- Rejects Date, RegExp, Map, Set, wrapped primitives, and other non-plain objects
- Stricter than [$object](#object), which accepts any object type
- Same optional parameters as `$object`:
  - `$partial` — validate a subset of keys
  - `$eachElement` — validate every value
- `$partial` and `$eachElement` are mutually exclusive

```js
// bare — any plain object
{ "config": "$plainobject" }
```

```js
// with $partial
{ "config": {
    "$plainobject": {
        "$partial": {
            "debug": "$bool",
            "port": "$int"
        }
    }
}}
```

See [object-plugin.test.ts](tests/plugins/object-plugin.test.ts) for exhaustive cases

[↑ top](#included-plugins)

## STRICT ISO DATE

Key: `$strictisodate`

Validates RFC 3339 format — a strict profile of ISO 8601 commonly used in APIs.

- Must be a string
- Format: `YYYY-MM-DDTHH:mm:ss.sssZ`
- Allows space as date/time separator (not just `T`)
- Seconds and fractional seconds are optional
- Timezone designator is required (`Z` or `±HH:mm`, including `-00:00`)
- Case-insensitive `T`/`t` separator
- Also checks that the string parses to a valid JS Date

```js
// accepts "2026-05-05T20:41:00Z", "2026-05-05 20:41:00Z"
{ "timestamp": "$strictisodate" }
```

See [datetime-plugin.test.ts](tests/plugins/datetime-plugin.test.ts) for exhaustive cases

[↑ top](#included-plugins)

## STRING

Key: `$string`

Validates that the input is a string.

- Accepts any primitive string value
- Rejects non-strings, including numbers, booleans, null, undefined, and boxed `new String()` objects
- No parameters

```js
{ "name": "$string" }
```

See [string-plugin.test.ts](tests/plugins/string-plugin.test.ts) for exhaustive cases

[↑ top](#included-plugins)

## UUID

Key: `$uuid`

Validates UUID format.

- No parameter: accepts any valid UUID (versions 1–8, NIL, and max)
- Single parameter (version): validates a specific UUID version
  - `0` — NIL UUID (all zeros)
  - `1` through `8` — specific version
  - `"F"` — max UUID (all f's)
- Invalid version numbers produce a config error
- Must be a string
- Case-insensitive

```js
// any UUID
{ "id": "$uuid" }
```

```js
// specific version
{ "id": { "$uuid": 4 } }
```

```js
// NIL UUID
{ "id": { "$uuid": 0 } }
```

See [uuid-plugin.test.ts](tests/plugins/uuid-plugin.test.ts) for exhaustive cases

[↑ top](#included-plugins)

## VAL

Key: `$val`

Matches values by name — either against predefined values supplied at setup time, or by capturing and back-referencing values seen during validation.

### Predefined Values

Supply known values when creating the validator. The template checks that candidate values match.

```js
const wyv = makeWysiwyv({
  pluginSetups: {
    $val: {
      expectedTeam: "Yankees",
      fruit: "apple",
    },
  },
});

const expected = {
  team: { $val: "expectedTeam" },
  snack: { $val: "fruit" },
};

// passes if team === "Yankees" and snack === "apple"
```

### Back-References

If a val name hasn't been predefined, the first occurrence captures whatever value appears in the candidate. Subsequent uses of the same name check that the value matches.

```js
const expected = {
  billing: {
    customerId: { $val: "cid" },
  },
  shipping: {
    customerId: { $val: "cid" },
  },
};

// passes if billing.customerId === shipping.customerId
// (whatever the value is)
```

### Combined

Predefined values and back-references work together. Predefined keys are checked immediately; undefined keys are captured on first encounter and enforced on subsequent encounters.

```js
const wyv = makeWysiwyv({
  pluginSetups: {
    $val: { region: "us-east-1" },
  },
});

const expected = {
  region: { $val: "region" },
  primaryId: { $val: "id" },
  backupId: { $val: "id" },
};

// region must be "us-east-1" (predefined)
// primaryId and backupId must match each other (back-reference)
```

See [vals-plugin.test.ts](tests/plugins/vals-plugin.test.ts) for exhaustive cases

[↑ top](#included-plugins)
