| [README](README.md) | [USAGE](README-USAGE.md) | _INCLUDED PLUGINS_ | [PLUGIN AUTHORING](README-PLUGIN-AUTHORING.md) |
| :------------------ | :----------------------- | :----------------- | :--------------------------------------------- |

# Included Plugins

- [Basic Syntax](#basic-syntax)
- [$and](#and) / [$or](#or)
- [$any](any)
- [$array](#array) / [$object](#object)
- [$bool](#bool)
- [$isodate](#isodate) / [$basicisodate](#basicisodate) / [$strictisodate](#strictisodate)
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
- If ANY predicates fail
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

## OR

Key: `$or`

Takes an array of predicates.

- If array is empty, returns an error
  - Boolean algebra defines the OR identity as false
- If ANY predicates are passed, returns success
  - Short-Circuiting: Further predicates are not evaluated
- If ALL predicates fail=
  - One error is recorded for the $or block itself
  - all errors from all predicatees are returned
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
