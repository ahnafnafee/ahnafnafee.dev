/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
  extends: ['plugin:@typescript-eslint/recommended', 'next/core-web-vitals'],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }],
    '@typescript-eslint/no-explicit-any': 'off',
    'prefer-const': 'warn',
    'import/no-duplicates': 'error',
    '@typescript-eslint/no-extra-semi': 'off'
  }
}
