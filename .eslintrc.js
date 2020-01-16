module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    plugins: [
        '@typescript-eslint',
    ],
    // extends: [
    //     'eslint:recommended',
    //     'plugin:@typescript-eslint/eslint-recommended',
    //     'plugin:@typescript-eslint/recommended',
    //     //'plugin:@typescript-eslint/recommended-requiring-type-checking'
    // ],
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

          "@typescript-eslint/typedef": [
            "error",
            {
              "arrayDestructuring": false,
              "arrowParameter": false,
              "memberVariableDeclaration": true,
              "parameter": false,
              "objectDestructuring": false,
              "propertyDeclaration": true,
              //"variableDeclaration": true,
            },
          ],
          "@typescript-eslint/semi": ["error"], 
    }
};