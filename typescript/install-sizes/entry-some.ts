import { makeWysiwyv } from "wysiwyv/core";
import {
  andWyvern,
  arrayWyvern,
  objectWyvern,
  stringWyvern,
} from "wysiwyv/plugins";

const wyv = makeWysiwyv({
  plugins: [andWyvern, arrayWyvern, objectWyvern, stringWyvern],
});

const result = wyv.validate(
  {
    dept: { $array: { $minlength: 1 } },
    team: {
      $array: {
        $each: {
          $and: [
            {
              $object: {
                $partial: {
                  team: "sales",
                },
              },
            },
            { name: "$string" },
          ],
        },
      },
    },
  },
  {
    dept: ["sales", "acquisitions"],
    team: [
      { name: "Joan Duet", team: "sales" },
      { name: "Jonn Tray", team: "sales" },
      { name: "Jane Quay", team: "sales" },
    ],
  },
);
console.log(result);
