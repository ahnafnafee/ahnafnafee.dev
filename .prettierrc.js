/** @type {import('prettier').Config} */
const config = {
  semi: false,
  tabWidth: 2,
  printWidth: 120,
  singleQuote: true,
  jsxSingleQuote: true,
  trailingComma: 'none',
  arrowParens: 'always',
  endOfLine: 'auto',
  plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
  importOrder: [
    '^@/components(.*)$',
    '',
    '^@/UI(.*)$',
    '',
    '^@/services(.*)$',
    '',
    '^@/libs(.*)$',
    '',
    '^@/(?!styles)(.*)$',
    '',
    '^[./]',
    '',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@/styles/(.*)$'
  ],
  importOrderTypeScriptVersion: '5.0.0',
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy']
}

module.exports = config
