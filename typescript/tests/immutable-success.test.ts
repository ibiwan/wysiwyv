import { HookAssessor } from "../src/util/HookAssessment";
import { HookErrorType } from "../src/util/HookError";

it("SUCCESS is immutable", () => {
  const blah = HookAssessor.SUCCESS;
  blah.fault({ code: HookErrorType.IncorrectValue, path: [] });

  const halb = HookAssessor.SUCCESS;

  expect(halb.errors).toEqual([]);
});
