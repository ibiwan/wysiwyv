import { d } from "../dev-util";
import type { HookValue } from "../src/type/template";
import { makeWysiwyv } from "../src/wysiwyv";
import { assertSuccess } from "../test-util";

it("bug-scratch file", () => {
  const wyv = makeWysiwyv();

  const data = {
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
  };

  const expected: HookValue = {
    people: {
      $array: {
        $each: {
          $and: [
            { $object: { $partial: { name: "$string" } } },
            {
              $or: [
                { name: "$any", title: "$string", salary: "$number" },
                { name: "$any", department: "$string", wage: "$number" },
              ],
            },
          ],
        },
      },
    },
  };

  const result = wyv.validate(expected, data);
  d(result);
  assertSuccess(result);
});
