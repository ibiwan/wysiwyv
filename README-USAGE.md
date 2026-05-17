| [README](README.md) | _USAGE_ | [INCLUDED PLUGINS](README-INCLUDED-PLUGINS.md) | [PLUGIN AUTHORING](README-PLUGIN-AUTHORING.md) |
| :------------------ | :------ | :--------------------------------------------- | :--------------------------------------------- |

# WYSIWYV - Usage

- [Basics](#basics)
- [Result Format](#result-format)
- [Literal Matching](#literal-matching)
- [Plugins](#plugins)
- [Escaping](#escaping)
- [Plugin Parameters](#plugin-parameters)
- [Initialization](#initialization)
- [Composition](#composition)

## Basics

1. Get your data.

   Any data will do; it does not need to be an object at root.

   `const data = {name: "Joe"};`

2. Write your template.

   You can start by copy-pasting your data, if that helps.

   Anything that should be dynamic, replace with a matcher.

   `const template = {name: "$string"};`

3. Make your validator

   You can select custom plugin sets, add your own, or initialize data for smart plugins

   `const wyv = makeWysiwyv();`

4. Run the validation

   `const result = wyv.validate(template, data);`

5. Enjoy Success!

   `console.log(result.success);`

   ```js
   true;
   ```

## Result Format

The result format is consistent whether successful, partially successful, or if a validation is fully rejected.

Every error includes a detailed message and a full path to where in the comparison the error was encountered.

- Object keys look like `.key`
- Array indexes look like `[10]`

On success:

```js
{ success: true, errors: [] }
```

On errors:

```js
{
  success: false,
  errors:[
    {
      message: "Type: Expected 'number', got value 'old enough'",
      path: ".age"
    },
    {
      message: "Value: Expected 'Sales', got value 'Delivery'",
      path: ".jobs[1].dept.name"
    }
  ]
}
```

## Literal Matching

The core behavior is just a simple deep-comparison matcher. Your data should look exactly like your template. Only an exact match will achieve `success`!

All templates must consist only of values representable by JSON; the data being matched can be arbitrary, but plugins must be used to validate anything not representable in JSON.

### Valid Types:

- _scalars_: null, number, string, boolean
- _arrays_ with elements of any valid type
- _objects_ with string keys and values of any valid type

### Example

data:

```js
{
  name: "Jawn Deaux",
  jobs:[
    {
      title: "CEO",
      dept: {
        name: "Delivery"
      }
    },
    {
      title: "Director",
      dept: {
        name: "Sales"
        }
    }
  ]
}
```

template:

```json
{
  "name": "Jawn Deaux",
  "jobs": [
    {
      "title": "CEO",
      "dept": {
        "name": "Delivery"
      }
    },
    {
      "title": "Director",
      "dept": {
        "name": "Sales"
      }
    }
  ]
}
```

## Plugins

Plugins are where everything gets flexible. You can assess data types, sub-object shapes, array length, array elements, combine assessments with boolean logic, or write your own plugins for anything we didn't think of.

We will gladly include or link any plugins you care to share!

- Every plugin is identified by a `key` -- a string starting with a dollar sign (`$`). For example: `$and`, `$uuid`.

- Plugins are used in place of values in the matching template.

static:

```json
{
  "id": "John"
}
```

loose:

```json
{
  "id": "$string"
}
```

## Escaping

Sometimes you really will want to match a string starting with a dollar sign. Just use a second dollar sign (`$$`) in your matching string to indicate it's not meant to be a plugin key.

data (starts with single dollar):

```json
{
  "name": "$heka"
}
```

matching template (double dollar):

```json
{
  "name": "$$heka"
}
```

## Plugin Parameters

## Initialization

## Composition
