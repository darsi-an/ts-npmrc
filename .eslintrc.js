module.exports = {
  env: {
    node: true,
    es6: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    //  "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier/@typescript-eslint", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    "plugin:prettier/recommended" // Make sure this is always the last configuration in the extends array.   
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    "@typescript-eslint/interface-name-prefix": [
      "error",
      {
        "prefixWithI": "always",
        "allowUnderscorePrefix": true
      }
    ],
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: false
      },
    ],
    "@typescript-eslint/no-inferrable-types": ["warn"],
    "@typescript-eslint/typedef": [
      "error",
      {
        "arrayDestructuring": false,
        "arrowParameter": false,
        "memberVariableDeclaration": true,
        "parameter": false,
        "objectDestructuring": false,
        "propertyDeclaration": true,
        // "variableDeclaration": true,
      },
    ],
    // "@typescript-eslint/semi": ["error"], 
  }
};