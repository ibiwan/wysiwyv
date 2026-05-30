| [README](README.md) | [USAGE](README-USAGE.md) | [INCLUDED PLUGINS](README-INCLUDED-PLUGINS.md) | _PLUGIN AUTHORING_ | [INTEGRATION](README-INTEGRATION.md) |
| :------------------ | :----------------------- | :--------------------------------------------- | :----------------- | :----------------------------------- |

# Plugin Authoring

## 1. Pick a key.

Select a string to identify your plugin. It should start with a dollar sign and should be unique among loaded plugins. We can use `$us-ssn` as an example.
Your key will be used in several contexts:

1. In a matching template, to select your plugin for matching a given node.
2. In initial Wysiwyv factory, to specify plugin setup data.
3. When the engine is calling your plugin, to give you exclusive access to setup and scratch data.

[↑ top](#plugin-authoring)

## 2. Scaffold your plugin.

1. Start with a `WyvPlugin` object.
2. Populate `handles` with a function that will return true when passed your key.
3. Populate `handlers` with an object that maps your key to a function that should evaluate the node being evaluated.

```ts
export const WYV_KEY_US_SSN = "$us-ssn";
const ssnWyvern: WyvPlugin = {
  handles: (value) => [WYV_KEY_US_SSN].includes(value),
  handlers: {
    [WYV_KEY_US_SSN]: (value, expected, options) => {
      // ...
    },
  },
};
```

[↑ top](#plugin-authoring)

## 3. Evaluate data and return your assessment.

1. The `value` parameter is the value to be evaluated.  
   The `expected` parameter is the template node the value should be assessed against.
1. If you have determined the value is acceptable, just  
   `return HookAssessor.SUCCESS;`
1. If you have one reason for rejecting a value
   1. create an error with one of the helpers from `HookError.ts`:  
      `const e = errValue(3, 6, '.employee[3].id');`
   2. return it with  
      `return HookAssessor.fault(myError);`
1. If you have multiple reasons for rejecting a value
   1. start an assessement with:  
      `const errors = HookAssessment.start()`
   2. add encountered errors one at a time with `errors.fault(myNextError);`
   3. incorporate another assessent into your open one with `errors.include(myOtherErrors);`
   4. when finished, just `return errors;`
1. All assessments follow the same format:

if no issues encountered:

```ts
{
  success: true,
  errors: [],
}
```

if faults are found:

```ts
{
  success: false,
  errors: [
    {message: '...', path: '...'},
    ...,
  ],
}
```

[↑ top](#plugin-authoring)

## 4. Know your Options

The `options` parameter has several fields.

```ts
options = {
  path: string;
  params: ParamsType;
  setup: SetupType;
  context: ContextType;
  shared: Record<string, unknown>;
  evaluate: WysiwyvEvaluatorFunction;
}
```

- `path`:
  - Your current path in the original data structure.
  - Components look like `.fieldname` for objects or `[#]` for arrays.
  - Use this as the path value when making HookErrors
- `params`:
  - Parameters to your plugin specified at the current position in the matching template object.
  - Customize by defining a `MyHookParams` type reflecting how they should be passed.
  - This can be any kind of data representable in JSON since it comes from the template.  
    `type WyvParams = { version: number }`
- `setup`:
  - Parameters to your plugin specified at the time the matching engine is instantiated (makeWysiwyv)
  - Customize by defining a `MyHookSetup` type similar to that for `params`
  - How to provide the data is shown below, at [Register Plugin](#6-register-plugin)
- `context`:
  - A private data store for any information your plugin needs to track from one instance to the next.
  - Only plugins with the same `key` will see this data.
  - Customize with a `MyHookContext` type similar to that for `params`.
- `shared`:
  - A shared data store for any information that needs to be reused across multiple plugin types.
  - This is the Wild West. No type enforcement, no privacy.
- `evaluate`:
  - A callback function provided by the engine. See [Recurse and Descend](#5-recurse-and-descend)

⚠️ If you customize any types, all should be provided as type params when defining your plugin:

```ts
const ssnWyvern: WyvPlugin<MyParams, MySetup, MyContext> = {...};
```

[↑ top](#plugin-authoring)

## 5. Recurse and Descend

Your plugin can behave like `$array` or `$object`, descending recursively into a subtree of the data. This could even be a virtual tree, generated during validation by your custom logic.

1. Open an assessment:  
   `const errors = HookAssessment.start();`

2. Call `options.evaluate` on the subtree:

- This is a function provided by the engine for recursive descent. Call it when you need to hand control back, for example in the case of evaluating individual array or object children.
- Call with the following arguments:
  - `expected` A Wysiwyv template object to be evaluated on the subtree
  - `candidate` The child (or derived) field or subtree being evaluated
  - `path` Use the `options.path` parameter you received, appending information about how the child element is being selected (key, index, hash, etc)

  `const subErrors = options.evaluate(subTemplate, subTree, path + 'my selector');`

3. Include any errors back into your assessment:

   `errors.include(subErrors);`

4. Return your final assessment with errors from your level plus any errors from the recursion.

   `return errors;`

[↑ top](#plugin-authoring)

## 6. Register Plugin

Pass your plugin into `config.plugins` when making your engine instance.

If you have preconfig data to provide, pass it in to `config.pluginSetups.$myPlugin`.

```ts
import { makeWysiwyv } from "./src/wysiwyv-core";
// or, if you want to include all default plugins:
// import { makeWysiwyv } from "./src/wysiwyv";

import usSsnWyvern from "./src/hooks/us-ssn";

const wyv = makeWysiwyv({
  plugins: [usSsnWyvern],
  pluginSetups: {
    "$us-ssn": {
      defaultFormat: "###-##-####",
    },
  },
});

const result = wyv.validate(myExpected, myCandidate);
```

[↑ top](#plugin-authoring)
