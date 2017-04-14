module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  extends: "standard",
  env: {
    browser: true
  },
  globals: {
    componentHandler: true,
    dialogPolyfill: true,
    marked: true,
    hljs: true,
    Isotope: true
  },
  rules: {
  }
}
