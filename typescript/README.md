| _README_ | [USAGE](README-USAGE.md) | [INCLUDED PLUGINS](README-INCLUDED-PLUGINS.md) | [PLUGIN AUTHORING](README-PLUGIN-AUTHORING.md) | [INTEGRATION](README-INTEGRATION.md) |
| :------- | :----------------------- | :--------------------------------------------- | :--------------------------------------------- | :----------------------------------- |

## WYSIWYV: What You See is What You Validate

Composable validation for TypeScript. 1.6 KB core. Zero dependencies. Templates are just JSON.

Validation templates look like your data; plugins give you everything beyond static comparison.

<table>
<tr><th>data</th><th>template</th></tr>
<tr><td valign="top">

```json
{
  "name": "John Smythe-Do",
  "id": "c522fc68-ca27-4391-ac43-494c023e24a7",
  "age": 27
}
```

</td><td valign="top">

```json
{
  "name": "$string",
  "id": "$uuid",
  "age": "$number"
}
```

</td></tr>

<tr><td valign="top">

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

</td><td valign="top">

```js
{
  dept: { $array: { $minlength: 1 } },
  team: { $array: { $each: {
    $object: { $partial: {
      team: "sales",
    }},
  }}}
}
```

</td></tr>
<tr><th>simple success</th><th>detailed rejections</th></tr>
<tr><td valign="top">

```js
{ success: true, errors: [] }
```

</td><td valign="top">

```js
{
  success: false,
  errors: [{
    message: "Type: Expected 'number', got value 'old enough'",
    path: ".age"
  }]
}
```

</td></tr>
</table>

[↑ top](#wysiwyv)

## Why You Wyv?

- Templates: JSON-compatible
  - $-prefix for plugins
- Tiny: Core is ~ 1.6kB
- Flexible: Rich Plugin API
- Performant: Faster than yup and joi\*
- Simple: Reuse in:
  - jest assertions
  - express middleware
  - cli tools
  - custom exceptions
- Batteries: Included
- Strict: By Default

### The real reason:

- You like that the plugins are called wyverns.

###### \* _I'll get you yet, Zod_

[↑ top](#wysiwyv)

## Included Plugins

Read the [Included Plugins Documentation](README-INCLUDED-PLUGINS.md)

<table>
<tr>
<td width="">$and</td>
<td width="">$or</td>
<td width="">$email</td>
</tr>
<tr>
<td>$any</td>
<td>$int</td>
<td>$number</td>
</tr>
<tr>
<td>$array</td>
<td>$object</td>
<td>$plainobject</td>
</tr>
<tr>
<td>$bool</td>
<td>$uuid</td>
<td>$string</td>
</tr>
<tr>
<td>$isodate</td>
<td>$basicisodate</td>
<td>$strictisodate</td>
</tr>
</table>

- $val:
  - Match values known at call time
  - Ensure values match within data (back-references)

[↑ top](#wysiwyv)

## Make Your Own Plugins

Read the [Plugin Authoring Documentation](README-PLUGIN-AUTHORING.md)

- Full Type System enables clean interfacing
  - See `src/type/plugin.ts` for contract
  - See `src/hooks/string.ts` for a simple example
- Rich data: inject at setup time or call time, or add during validation
  - All scoped to your plugin for safety
  - Alternately, use a shared context to communicate across plugins
  - See `src/hooks/val.ts` for context use example
- `evaluate` function provided for custom recursive descent
  - See `src/hooks/object.ts` for descent example

[↑ top](#wysiwyv)

## The raw data

Sizes with Tree-shaking, .min.gz

<table>
<tr><td>core only</td><td>1.65 KB</td></tr>
<tr><td>one plugin ($int)</td><td>1.8 KB</td></tr>
<tr><td>typical usage<br>($and, $ KBarray, $object, $string)</td><td>2.6 KB</td></tr>
<tr><td>full, all plugins</td><td>3.9 KB</td></tr>
</table>

Competition

<table> 
<tr>
<th>Package</th>
<th>Dependencies</th>
<th>Bundle, .min.gz</th>
<th>Bench, ns/iter</th>
<th>Schema Format</th>
</tr>
<tr><td>zod</td></tr>
<tr><td>valibot</td></tr>
<tr><td>yup</td></tr>
<tr><td>joi</td></tr>
<tr><td>arktype</td></tr>
<tr><td>ajv</td></tr>

</table>

[↑ top](#wysiwyv)
