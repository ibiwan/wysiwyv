import type { HookValue } from "../type";

const stringify = (value: unknown) => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return value.toString();
  if (typeof value === "boolean") return value.toString();
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  return JSON.stringify(value);
};

export class HookError {
  message: string;
  path: string;

  constructor(messageTemplate: string, path: string, candidate: unknown) {
    this.message = messageTemplate.replace("%s", stringify(candidate));
    this.path = path;
  }

  static with(message: string, path: string) {}
}

export class UnexpectedElementError extends HookError {
  constructor(key: string, candidate: unknown, path: string) {
    super(`Unexpected element at '${key}': got '%s'`, path, candidate);
  }
}

export class UnexpectedElementsError extends HookError {
  constructor(keys: string[], path: string) {
    super(`Unexpected elements: '%s'`, path, keys);
  }
}

export class MissingElementError extends HookError {
  constructor(key: string, expected: HookValue | unknown, path: string) {
    super(`Missing element at ${key}: '${expected}'`, path);
  }
}

export class ValueError extends HookError {
  constructor(expected: HookValue, candidate: unknown, path: string) {
    super(`Value: Expected '${expected}', got '%s'`, path, candidate);
  }
}

export class MatchError extends HookError {
  constructor(
    expected: unknown,
    candidate: unknown,
    matcher: string,
    path: string,
  ) {
    super(
      `Expected value '${expected}' for key '${matcher}', got '%s'`,
      path,
      candidate,
    );
  }
}

export class SpecError extends HookError {
  constructor(expectedType: string, candidate: unknown, path: string) {
    super(`Type: Expected '${expectedType}', got value '%s'`, path, candidate);
  }
}

export class AttributeError extends HookError {
  constructor(
    attribute: string,
    expectedAttribute: unknown,
    candidateAttribute: unknown,
    path: string,
  ) {
    super(
      `${attribute}: Expected '${expectedAttribute}', got '%s'`,
      path,
      candidateAttribute,
    );
  }
}

export class ConfigError extends HookError {
  constructor(messageDetail: string, path: string) {
    super(`Configuration Error: ${messageDetail}`, path);
  }
}

export class CollectionError extends HookError {
  constructor(booleanFunction: string, path: string) {
    super(`Aggregate Error: ${booleanFunction}`, path);
  }
}
