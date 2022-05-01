module.exports = {
  root: true,
  env: {
    "node": true,
    "es2021": true,
    "commonjs": true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  plugins: [
    "@typescript-eslint"
  ],
  extends: [
    "airbnb-base",
    "airbnb-typescript/base"
  ],
  rules: {
    '@typescript-eslint/semi': [2, 'never'],
    'no-underscore-dangle': 'off',
    'class-methods-use-this': 'off'
  },
}
