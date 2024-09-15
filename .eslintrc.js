module.exports = {
  root: true,
  "extends": [
    "@react-native",
    "prettier",
    "plugin:prettier/recommended"
  ],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "prettier/prettier": [
      "error",
      {
        "quoteProps": "consistent",
        "singleQuote": true,
        "tabWidth": 2,
        "trailingComma": "es5",
        "useTabs": false
      }
    ]
  },
  ignorePatterns: [
    '**/lib/**',
    '**/dist/**',
    '**/node_modules/**',
  ],
};
