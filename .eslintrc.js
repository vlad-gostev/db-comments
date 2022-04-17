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
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  rules: {
    semi: ['error', 'never'],
    "@typescript-eslint/no-misused-promises": 0
  },
}
