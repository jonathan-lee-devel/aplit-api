module.exports = {
  preset: 'ts-jest/presets/default-esm',
  globals: {
    "ts-jest": {
      "useESM": true
    }
  },
  testEnvironment: 'node',
  collectCoverage: true,
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
};
