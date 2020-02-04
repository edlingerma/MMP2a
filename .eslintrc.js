const fs = require('fs');
const prettierOptions = JSON.parse(fs.readFileSync('./.prettierrc', 'utf8'));

module.exports = {
  parser: 'babel-eslint',
  extends: ['standard', 'prettier'],
  plugins: ['prettier', 'babel', 'standard', 'import'],
  parserOptions: {
    ecmaVersion: 2017,
    ecmaFeatures: {
      experimentalDecorators: true,
      jsx: true,
    },
    sourceType: 'module',
  },
  rules: {
    'import/order': ['warn', { 'newlines-between': 'always' }],
    'prettier/prettier': ['error', prettierOptions],
  },
};