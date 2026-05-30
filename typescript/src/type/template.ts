export type ScalarValue = string | number | boolean | null;

export type HookValue = ScalarValue | HookObject | HookValue[];

export interface HookObject {
  [key: string]: HookValue;
}
