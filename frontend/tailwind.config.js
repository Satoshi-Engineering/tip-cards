const plugin = require('tailwindcss/plugin')
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'grey': '#a5a5a5',
        'grey-light': '#f1f1f1',
        'grey-dark': '#777777',
        'black': '#000',
        'white': '#fff',
        'btcorange': colors.orange[400],
        'btcorange-effect': colors.orange[500],
        'lightningpurple': '#7B1AF7',
      },
      fontFamily: {
        emoji: ['Apple Color Emoji', 'Segoe UI Emoji', 'NotoColorEmoji', 'Segoe UI Symbol', 'Android Emoji', 'EmojiSymbols', 'EmojiOne Mozilla'],
      },
      borderColor: ({ theme }) => ({
        DEFAULT: theme('colors.black', 'currentColor'),
      }),
      spacing: {
        '18': '4.5rem',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'spin-reverse': 'spin 1s linear infinite reverse',
        'spin-reverse-slow': 'spin 3s linear infinite reverse',
        'fade-in': 'fade 0.3s ease',
        'fade-in-slow': 'fade 1s ease',
        'fade-out': 'fade 0.3s ease reverse forwards',
        'fade-out-slow': 'fade 1s ease reverse forwards',
      },
      keyframes: {
        'spin': {
          from: {
            transform: 'rotate(0deg)',
          },
          to: {
            transform: 'rotate(360deg)',
          },
        },
        'fade': {
          from: {
            opacity: '0',
          },
          to: {
            opacity: '1',
          },
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.break-anywhere': {
          overflowWrap: 'anywhere',
          wordBreak: 'break-word',
        },
      })
    }),
  ],
}
