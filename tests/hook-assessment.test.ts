import { HookAssessor } from "../src/util/HookAssessment";
import { errAttr } from "../src/util/HookError";
import { assertErrors } from "../test-util";

describe("HookAssessment", () => {
  it("returns the new assessment if one is included onto SUCCESS", () => {
    const success = HookAssessor.SUCCESS;
    const newAssessment = HookAssessor.start().fault(
      errAttr("purple", "red", "blue", ".it"),
    );

    const result = success.include(newAssessment);
    expect(result).toBe(newAssessment);
  });

  it("initializes with errors if passed to start", () => {
    const errors = HookAssessor.fault(errAttr("purple", "red", "blue", ".it"));
    const newAssessment = HookAssessor.start(errors.errors);

    assertErrors(newAssessment, [
      {
        message: "purple: Expected 'red', got 'blue'",
        path: ".it",
      },
    ]);
  });
});
