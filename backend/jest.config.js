import { createDefaultPreset } from 'ts-jest';

/** @type {import("jest").Config} **/
export default {
  preset: 'ts-jest',
  transform: {
      "^.+\\.[t|j]sx?$": "babel-jest"
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1', 
  },
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.js)$)' 
  ],
};
