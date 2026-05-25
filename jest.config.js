/** @type {import('jest').Config} */
export default {
  testMatch: ["**/tests/**/*.test.ts"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/import-tests/",
    "/bench/",
    "dump\\.test\\.ts$",
  ],
  transform: {
    "^.+\\.tsx?$": "@swc/jest",
  },
  moduleNameMapper: {
    "^(\\.\\.?/.*)\\.js$": "$1",
  },
  coverageProvider: "v8",
};
