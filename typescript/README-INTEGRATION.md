| [README](README.md) | [USAGE](README-USAGE.md) | [INCLUDED PLUGINS](README-INCLUDED-PLUGINS.md) | [PLUGIN AUTHORING](README-PLUGIN-AUTHORING.md) | _INTEGRATION_ |
| :------------------ | :----------------------- | :--------------------------------------------- | :--------------------------------------------- | ------------- |

# Integration

## jest

See [test-util](./test-util.ts)

## express

```ts
const wyv = makeWysiwyv();

export const validateBody =
  (template: HookValue) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = wyv.validate(template, req.body);
    if (result.success) return next();
    res.status(400).json({
      error: "Validation failed",
      details: result.errors,
    });
  };

const newUserTemplate = {
  name: "$string",
  email: "$email",
  age: { $int: { $min: 18 } },
};

app.post("/users", validateBody(newUserTemplate), createUserHandler);
```

## zod

```ts
const toZodLike = (assessment: HookAssessment) => ({
  success: assessment.success,
  issues: assessment.errors.map((e) => ({
    message: e.message,
    path: e.path.split(".").filter(Boolean), // convert ".age" to ["age"]
  })),
});
```
