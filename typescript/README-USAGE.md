| [README](README.md) | _USAGE_ | [INCLUDED PLUGINS](README-INCLUDED-PLUGINS.md) | [PLUGIN AUTHORING](README-PLUGIN-AUTHORING.md) | [INTEGRATION](README-INTEGRATION.md) |
| :------------------ | :------ | :--------------------------------------------- | :--------------------------------------------- | :----------------------------------- |

# WYSIWYV - Usage

- [Basics](#basics)
- [Result Format](#result-format)
- [Literal Matching](#literal-matching)
- [Plugins](#plugins)
- [Escaping](#escaping)
- [Plugin Parameters](#plugin-parameters)
- [Initialization](#initialization)
- [Template Parameters](#template-parameters)
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

   ```json
   true
   ```

[↑ top](#wysiwyv---usage)

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

[↑ top](#wysiwyv---usage)

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

[↑ top](#wysiwyv---usage)

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

[↑ top](#wysiwyv---usage)

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

[↑ top](#wysiwyv---usage)

## Plugin Parameters

When referencing a plugin, it can be passed 0, 1, or more parameters.

0 Params: Just use the plugin key as a string.

```json
{
  "datum-list": "$array"
}
```

1 Param: Use a simple object with plugin as key and parameter as value. The plugin's docs will tell you what argument a single parameter will correspond to, if there are multiple.

```js
{
  // default arg is $uuid.$version
  "id": { "$uuid": 4 },
}
```

More Params: Use a nested object. The outer just has the plugin key, and the inner has the parameters paired with named keys.

```json
{
  "datum-list": {
    "$array": {
      "$minlength": 2,
      "$maxlength": 10
    }
  }
}
```

[↑ top](#wysiwyv---usage)

## Initialization

Plugins can accept pre-filled setup objects. For example, when matching values, you could have some that you got from another source during a test, but after setting up the validation template.

```js
const wyv = makeWysiwyv({
  pluginSetups: {
    $val: {
      entityId: 24601,
    },
  },
});

const data = {
  id: 24601,
};

const template = {
  id: { $val: "entityId" },
};

const result = wyv.validate(template, data);

// result.success === true
```

[↑ top](#wysiwyv---usage)

## Template Parameters

### (Meta-Plugins)

Some plugins accept matcher templates as parameters.

- `$and` and `$or` each take an array of templates to evaluate
- `$array.$each` is an optional template that every element of an array must individually match
- `$object.$eachElement` and `$plainobject.$eachElement` are similar, every value (regardless of key) must match
- `$object.$partial` and `$plainobject.$partial` are optional (mutually exclusive with `.$eachElement`) templates. Every k-v present in the provided template must be present in the candidate data being evaluated. Extra candidate-object keys beyond those listed are ignored (accepted).

### $or template:

```json
{
  "department": {
    "$or": ["Sales", "Marketing", "Ideation", "Finance"]
  }
}
```

### $object.$partial

#### candidate data:

```js
{
  id: 24680,
  name: "Jane Doe-Smith",
}
```

#### matcher template:

```json
{
  "$object": {
    "$partial": {
      "id": 24680
      // ignores .name
    }
  }
}
```

[↑ top](#wysiwyv---usage)

## Composition

Any Meta-Plugins can be nested and alternated arbitrarily with other plugins and with core behavior. Because control is handed back to the engine for each node in descent, nested claims are treated identically to ones in the base tree.

data:

```js
{
  people: [
    {
      name: "Jon Deo",
      title: "CEO",
      salary: 800_000,
    },
    {
      name: "Don Jo",
      department: "Burger-Flippin",
      wage: 3.75,
    },
  ],
}
```

template:

```js
{
  people: {
    $array: { $each: {
        $and: [
          { $object: { $partial:
            { name: "$string" }
          }},
          { $or: [
            { name: "$any", title: "$string", salary: "$number" },
            { name: "$any", department: "$string", wage: "$number" },
          ]},
        ],
      },
    },
  },
}
```

[↑ top](#wysiwyv---usage)
