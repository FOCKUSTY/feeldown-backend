/** @type {import('jest').Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        jsc: {
          parser: {
            syntax: "typescript",
            decorators: true,
          },
          transform: {
            legacyDecorator: true,
            decoratorMetadata: true,
          },
        },
      },
    ],
  },
  transformIgnorePatterns: ["node_modules/(?!(.*uuid))"],
  moduleNameMapper: {
    "^@1/(.*)$": "<rootDir>/src/v1/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "../",
  testRegex: ".spec.ts$",
};
