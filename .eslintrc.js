module.exports = {
  env: {
    browser: true,
    commonjs: false,
    es6: true,
    node: false
  },
  extends: "eslint:recommended",
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 6
  },
  rules: {
    "no-console": 0
  }
};
