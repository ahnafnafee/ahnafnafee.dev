/* eslint-disable @typescript-eslint/no-var-requires */
const colors = require('tailwindcss/colors')
const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import("tailwindcss").Config } */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,mdx}'],
  darkMode: 'class', // or 'media' or 'class' or false
  theme: {
    extend: {
      fontFamily: {
        primary: ['"Inter"', ...fontFamily.sans]
      },
      colors: {
        primary: colors.blue,
        ternary: colors.teal,
        theme: colors.neutral,
        gray: {
          0: '#fff',
          100: '#fafafa',
          200: '#eaeaea',
          300: '#999999',
          400: '#888888',
          500: '#666666',
          600: '#444444',
          700: '#333333',
          800: '#222222',
          900: '#111111'
        }
      },
      keyframes: {
        enter: {
          '0%': { transform: 'translateY(1.75rem)', opacity: '0' },
          '50%': { transform: 'translateY(0.75rem)', opacity: '0.5' },
          '100%': { transform: 'translateY(0)', scale: '1', opacity: '1' }
        },
        leave: {
          '0%': { transform: 'translateY(0)', scale: '1', opacity: '1' },
          '50%': { transform: 'translateY(0.75rem)', opacity: '0.5' },
          '100%': { transform: 'translateY(1.75rem)', opacity: '0' }
        }
      },
      animation: {
        enter: 'enter 0.15s ease-out',
        leave: 'leave 0.15s ease-out'
      }
    }
  },
  variants: {
    typography: ['dark']
  },
  plugins: [require('@tailwindcss/typography')]
}
