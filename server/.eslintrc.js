/* eslint-env node */
module.exports = {
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended-type-checked',
      'plugin:@typescript-eslint/stylistic-type-checked',
      'airbnb-base',
      'airbnb-typescript/base'
    ],
    plugins: ['@typescript-eslint'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: true,
      tsconfigRootDir: __dirname,
    },
    root: true,
    rules: {
        '@typescript-eslint/semi': 'off',
        'no-console': 'off',
        'import/no-extraneous-dependencies': 'off',
        '@typescript-eslint/no-misused-promises': ['error', {"checksVoidReturn": false}]
      },
    ignorePatterns: [".eslintrc.js"]
  };