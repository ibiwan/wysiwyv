import { HookAssessor } from "../src/util/HookAssessment";
import { errAttr } from "../src/util/HookError";

it("returns the new assessment if one is included onto SUCCESS", () => {
  const success = HookAssessor.SUCCESS;
  const newAssessment = HookAssessor.start().fault(
    errAttr("purple", "red", "blue", ".it"),
  );
  const result = success.include(newAssessment);
  expect(result).toBe(newAssessment);
});
