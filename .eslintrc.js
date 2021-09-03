module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    /* ======================================= */
    /* POSSIBLE ERRORS ----------------------- */
    // These rules relate to possible syntax or
    // logic errors in the code.
    /* ======================================= */
    'for-direction': ['error'],
    'getter-return': ['error'],
    'no-async-promise-executor': ['off'],
    'no-await-in-loop': ['off'],
    'no-compare-neg-zero': ['error'],
    'no-cond-assign': ['error', 'except-parens'],
    'no-constant-condition': ['error', { checkLoops: true }],
    'no-control-regex': ['error'],
    'no-debugger': ['error'],
    'no-dupe-args': ['error'],
    'no-dupe-else-if': ['error'],
    'no-dupe-keys': ['error'],
    'no-duplicate-case': ['error'],
    'no-empty': ['error', { allowEmptyCatch: true }],
    'no-empty-character-class': ['error'],
    'no-ex-assign': ['error'],
    'no-extra-boolean-cast': ['error', { enforceForLogicalOperands: true }],
    'no-extra-parens': ['off'],
    'no-extra-semi': ['error'],
    'no-func-assign': ['error'],
    'no-import-assign': ['error'],
    'no-inner-declarations': ['off'],
    'no-invalid-regexp': ['error', { allowConstructorFlags: ['u', 'y'] }],
    'no-irregular-whitespace': [
      'error',
      {
        skipStrings: true,
        skipComments: true,
        skipRegExps: true,
        skipTemplates: true
      }
    ],
    'no-loss-of-precision': ['error'],
    'no-misleading-character-class': ['error'],
    'no-obj-calls': ['error'],
    'no-promise-executor-return': ['error'],
    'no-prototype-builtins': ['error'],
    'no-regex-spaces': ['error'],
    'no-setter-return': ['error'],
    'no-sparse-arrays': ['error'],
    'no-template-curly-in-string': ['error'],
    'no-unexpected-multiline': ['error'],
    'no-unreachable': ['error'],
    'no-unreachable-loop': ['error'],
    'no-unsafe-finally': ['error'],
    'no-unsafe-negation': ['error'],
    'use-isnan': ['error'],
    'valid-typeof': ['error'],

    /* BEST PRACTICES ---------------------- */
    // These rules relate to better ways of
    // doing things to help avoid problems
    // in the codebase.
    /* ===================================== */
    'accessor-pairs': ['error'],
    'array-callback-return': ['error'],
    'block-scoped-var': ['error'],
    'consistent-return': ['error'],
    'curly': ['error', 'all'],
    'default-case': ['error'],
    'default-case-last': ['error'],
    'default-param-last': ['error'],
    'dot-location': ['error', 'property'],
    'dot-notation': ['error'],
    'eqeqeq': ['error'],
    'grouped-accessor-pairs': ['error', 'getBeforeSet'],
    'no-case-declarations': ['off'],
    'no-constructor-return': ['error'],
    'no-div-regex': ['error'],
    'no-else-return': ['off'],
    'no-empty-function': ['error'],
    'no-empty-pattern': ['off'],
    'no-eq-null': ['error'],
    'no-eval': ['error'],
    'no-extend-native': ['off'],
    'no-fallthrough': ['off'],
    'no-floating-decimal': ['error'],
    'no-global-assign': ['error'],
    'no-invalid-this': ['error'],
    'no-nested-ternary': ['off'],
    'prefer-destructuring': ['off'],
    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/ban-ts-comment': ['off'],
    '@typescript-eslint/no-var-requires': ['off'],

    /* VARIABLES --------------------------- */
    // These rules relate to variables and
    // variable declarations.
    /* ===================================== */
    'no-unused-vars': ['off'],
    '@typescript-eslint/no-unused-vars': ['off'],
    'no-undef': ['error'],
    'no-use-before-define': ['error']
  },
  globals: {
    NodeJS: 'readonly'
  }
};
