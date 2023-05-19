module.exports = {
  extends: ['../.eslintrc.js', 'plugin:jest/recommended'],
  globals: {
    jest: 'readonly',
    expect: 'readonly',
    describe: 'readonly',
    test: 'readonly',
    beforeEach: 'readonly',
    beforeAll: 'readonly',
    afterAll: 'readonly',
    afterEach: 'readonly',
  },
  ignorePatterns: [],
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['jest'],
  rules: {
    '@typescript-eslint/no-unsafe-assignment': 'off',
    rules: {
      semi: ['error', 'never'], // Disable semicolon rule
    },
  },
}
