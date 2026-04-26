import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import tseslint from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
const config = [
  {
    ignores: [
      'temp_api_backup/**',
      'public/sw.js',
      'public/sw.js.map',
      'public/workbox-*.js',
      'public/workbox-*.js.map',
      'public/fallback-*.js',
      'public/fallback-*.js.map',
      '.vercel/**',
      'coverage/**',
      'indexing/**'
    ]
  },
  ...nextCoreWebVitals,
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    plugins: {
      '@typescript-eslint': tseslint.plugin
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { vars: 'all', args: 'after-used', ignoreRestSiblings: false }
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-extra-semi': 'off'
    }
  },
  {
    rules: {
      'no-unused-vars': 'off',
      'prefer-const': 'warn',
      'import/no-duplicates': 'error'
    }
  }
]

export default config
