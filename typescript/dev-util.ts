import { repr } from "./src/util/stringify";

export const d = (val: unknown) => {
  console.log(repr(val));
};
