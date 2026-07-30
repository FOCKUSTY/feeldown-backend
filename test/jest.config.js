/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "\\.[jt]sx?$": ["babel-jest", { excludeJestPreset: true }],
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(uuid)/)",
    "/node_modules/.pnpm/(?!(uuid@)/)",
  ],
  moduleNameMapper: {
    "^@1/(.*)$": "<rootDir>/src/v1/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "../",
  testRegex: "\\.test\\.ts$",
  collectCoverageFrom: ["src/**/*.(t|j)s"],
  modulePathIgnorePatterns: ["<rootDir>/bad-fockarch/"],
};
