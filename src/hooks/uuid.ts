import type { HookKey } from "../type/plugin";
import type { WyvPlugin } from "../type/plugin";
import { HookAssessor } from "../util/HookAssessment";
import { ConfigError, SpecError } from "../util/HookError";
import { isEmptyObject, isNumber, isString } from "../util/types";

const hex = "[0-9a-f]";
const seg8 = `${hex}{8}`;
const seg4 = `${hex}{4}`;
const seg3 = `${hex}{3}`;
const seg12 = `${hex}{12}`;
const variant = "[89ab]";

const RE_UUID_NIL_STR = `0{8}-0{4}-0{4}-0{4}-0{12}`;
const RE_UUID_FFF_STR = `f{8}-f{4}-f{4}-f{4}-f{12}`;

const makeFullRe = (pattern: string) => new RegExp(`^${pattern}$`, "i");

const UUID_VERSIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, "F", null] as const;
type Version = (typeof UUID_VERSIONS)[number];
const isVersion = (val: unknown): val is Version =>
  (UUID_VERSIONS as readonly unknown[]).includes(val);

const buildVersion = (version: number | string) =>
  `${seg8}-${seg4}-${version}${seg3}-${variant}${seg3}-${seg12}`;

const RE_UUID_V1 = makeFullRe(buildVersion(1));
const RE_UUID_V2 = makeFullRe(buildVersion(2));
const RE_UUID_V3 = makeFullRe(buildVersion(3));
const RE_UUID_V4 = makeFullRe(buildVersion(4));
const RE_UUID_V5 = makeFullRe(buildVersion(5));
const RE_UUID_V6 = makeFullRe(buildVersion(6));
const RE_UUID_V7 = makeFullRe(buildVersion(7));
const RE_UUID_V8 = makeFullRe(buildVersion(8));
const RE_UUID_NIL = makeFullRe(RE_UUID_NIL_STR);
const RE_UUID_FFF = makeFullRe(RE_UUID_FFF_STR);

const RE_UUID_ANY_VERSIONED = buildVersion("[1-8]");

const RE_UUID_ANY = makeFullRe(
  [RE_UUID_ANY_VERSIONED, RE_UUID_NIL_STR, RE_UUID_FFF_STR]
    .map((s) => `(${s})`)
    .join("|"),
);

export const WYV_KEY_UUID: HookKey = "$uuid";

const testByVersion = (version: Version, value: string) => {
  switch (version) {
    case 0:
      return RE_UUID_NIL.test(value);
    case 1:
      return RE_UUID_V1.test(value);
    case 2:
      return RE_UUID_V2.test(value);
    case 3:
      return RE_UUID_V3.test(value);
    case 4:
      return RE_UUID_V4.test(value);
    case 5:
      return RE_UUID_V5.test(value);
    case 6:
      return RE_UUID_V6.test(value);
    case 7:
      return RE_UUID_V7.test(value);
    case 8:
      return RE_UUID_V8.test(value);
    case "F":
      return RE_UUID_FFF.test(value);
    default:
      return RE_UUID_ANY.test(value);
  }
};

const uuidWyvern: WyvPlugin = {
  handles: (value) => [WYV_KEY_UUID].includes(value),
  handlers: {
    $uuid: (value: unknown, _expected, { path, params }) => {
      const version = isEmptyObject(params) ? null : params;

      if (!isVersion(version)) {
        return HookAssessor.fault(
          new ConfigError(`Unknown UUID version: '${version}'`, path),
        );
      }

      if (!isString(value)) {
        return HookAssessor.fault(new SpecError("string", value, path));
      }

      if (!testByVersion(version, value)) {
        const subMessage =
          isNumber(version) || isString(version)
            ? ` of version '${version}'`
            : "";
        return HookAssessor.fault(
          new SpecError(`UUID${subMessage}`, value, path),
        );
      }
      return HookAssessor.SUCCESS;
    },
  },
};

export default uuidWyvern;
