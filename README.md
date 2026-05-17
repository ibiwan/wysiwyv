| _README_ | [USAGE](README-USAGE.md) | [INCLUDED PLUGINS](README-INCLUDED-PLUGINS.md) | [PLUGIN AUTHORING](README-PLUGIN-AUTHORING.md) |
| :------- | :----------------------- | :--------------------------------------------- | :--------------------------------------------- |

# WYSIWYV

## What You See is What You Validate

### candidate data:

```json
{
  "name": "John Smythe-Do",
  "id": "c522fc68-ca27-4391-ac43-494c023e24a7",
  "age": 27
}
```

### validation template:

```json
{
  "name": "$string",
  "id": "$uuid",
  "age": "$number"
}
```

### plugins nest and compose:

```js
{
  dept: ["sales", "acquisitions"],
  team: [
    { name: "Joan Duet", team: "sales" },
    { name: "Jonn Tray", team: "sales" },
    { name: "Jane Quay", team: "sales" }
  ]
}
```

```js
{
  dept: { $array: { $minlength: 1 } },
  team: {
    $array: { $each: {
        $object: { $partial: {
            team: "sales",
        }},
      }},
  },
}
```

### success is simple:

```js
{ success: true, errors: [] }
```

### rejection is clear:

```js
{
  success: false,
  errors:[
    {
      message: "Type: Expected 'number', got value 'old enough'",
      path: ".age"
    }
  ]
}
```

## Why You Wyv?

- Templates: JSON
  - Or directly in JS
  - $-prefix for plugins
  - Templates are Language-Agnostic
    - Other language libraries to follow
- Tiny: Core is < 1.5kB
- Batteries: Included
- Flexible: Rich Plugin API
- Fast: <benchmarks tbd>
- Simple: Reuse in:
  - jest assertions
  - express middleware
  - cli tools
  - custom exceptions

### The real reason:

- You like that the plugins are called wyverns.

## Included Plugins

Read the [Included Plugins Documentation](README-INCLUDED-PLUGINS.md)

- $and / $or
- $any
- $array / $object
- $bool
- $isodate / $basicisodate / $strictisodate
- $email
- $int / $number
- $string
- $uuid
- $val
  - Match values known at call time
  - Ensure values match within data (back-references)

## Make Your Own Plugins

Read the [Plugin Author Documentation](README-PLUGIN-AUTHORS.md)

- Full Type System enables clean interfacing
  - See `src/type/plugin.ts` for contract
  - See `src/hooks/string.ts` for a simple example
- Rich data: inject at setup time or call time, or add during validation
  - All scoped to your plugin for safety
  - Alternately, use a shared context to communicate across plugins
  - See `src/hooks/val.ts` for context use example
- `evaluate` function provided for custom recursive descent
  - See `src/hooks/object.ts` for descent example

# TODO

- [x] Base Plugin Set
- [x] Test Coverage
- [ ] Documentation
  - [ ] Plugin Authors
  - [ ] Included Plugins
- [ ] Benchmarks
- [ ] Harnesses (readme examples)
- [ ] Distro Builds
- [ ] To Npm!
