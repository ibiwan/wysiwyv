import { HookAssessor } from "../src/util/HookAssessment";

it("bug-scratch file", () => {
  const blah = HookAssessor.SUCCESS;
  blah.fault({ message: "purple", path: "" });

  const halb = HookAssessor.SUCCESS;

  expect(halb.errors).toEqual([]);
});
