export default {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": ["plugin:react/recommended",
    "eslint:recommended",
    'plugin:@next/next/recommended',],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "@typescript-eslint"
    ],
    "rules": {
        "react/react-in-jsx-scope": "off",
   "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    }
}
