const plugin = require('tailwindcss/plugin')
const {
  generateColorPalette,
  generateSemanticColors,
  generateCSSVariables,
} = require('./colorPalette')

let colorPalette = generateColorPalette()
let semanticColors = generateSemanticColors()
let cssVariables = generateCSSVariables()

let globalStyles = (theme) => ({
  html: {
    'font-family': `Inter, ${theme('fontFamily.sans')}`,
  },
  '@supports (font-variation-settings: normal)': {
    html: {
      'font-family': `InterVar, ${theme('fontFamily.sans')}`,
      'font-optical-sizing': 'auto',
    },
  },
  'html, body, button, p, span, div': {
    fontVariationSettings: "'opsz' 24",
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  },
  select: {
    backgroundImage:
      'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="%237C7C7C" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" aria-hidden="true" viewBox="0 0 24 24" ><path d="m6 9 6 6 6-6" /></svg>\')',
    backgroundSize: '1.13em',
    backgroundPosition: 'right 0.44rem center',
  },
})

let componentStyles = {
  '.form-input, .form-textarea, .form-select': {
    '@apply h-7 rounded border border-gray-100 bg-gray-100 py-1.5 pl-2 pr-2 text-base text-gray-800 placeholder-gray-500 transition-colors hover:border-gray-200 hover:bg-gray-200 focus:border-gray-500 focus:bg-white focus:shadow-sm focus:ring-0 focus-visible:ring-2 focus-visible:ring-gray-400':
      {},
  },
  '.form-checkbox': {
    '@apply rounded-md bg-gray-100 text-blue-500 focus:ring-0 focus-visible:ring-1':
      {},
  },
}

module.exports = plugin(
  function ({ addBase, addComponents, theme }) {
    addBase({ ...globalStyles(theme), ...cssVariables })
    addComponents(componentStyles)
  },
  {
    theme: {
      colors: colorPalette,
      borderRadius: {
        none: '0px', // 0
        sm: '0.25rem', // 4px
        DEFAULT: '0.5rem', // 8px
        md: '0.625rem', // 10px
        lg: '0.75rem', // 12px
        xl: '1rem', // 16px
        '2xl': '1.25rem', // 20px
        full: '9999px', // 9999px
      },
      boxShadow: {
        sm: '0px 1px 2px rgba(0, 0, 0, 0.1)',
        DEFAULT:
          '0px 0px 1px rgba(0, 0, 0, 0.45), 0px 1px 2px rgba(0, 0, 0, 0.1)',
        md: '0px 0px 1px rgba(0, 0, 0, 0.12), 0px 0.5px 2px rgba(0, 0, 0, 0.15), 0px 2px 3px rgba(0, 0, 0, 0.16)',
        lg: '0px 0px 1px rgba(0, 0, 0, 0.35), 0px 6px 8px -4px rgba(0, 0, 0, 0.1)',
        xl: '0px 0px 1px rgba(0, 0, 0, 0.19), 0px 1px 2px rgba(0, 0, 0, 0.07), 0px 6px 15px -5px rgba(0, 0, 0, 0.11)',
        '2xl':
          '0px 0px 1px rgba(0, 0, 0, 0.2), 0px 1px 3px rgba(0, 0, 0, 0.05), 0px 10px 24px -3px rgba(0, 0, 0, 0.1)',
        none: 'none',
      },
      container: {
        padding: {
          xl: '5rem',
        },
      },
      fontSize: {
        '2xs': [
          '11px',
          {
            lineHeight: '1.15',
            letterSpacing: '0.01em',
            fontWeight: '420',
          },
        ],
        xs: [
          '12px',
          {
            lineHeight: '1.15',
            letterSpacing: '0.02em',
            fontWeight: '420',
          },
        ],
        sm: [
          '13px',
          {
            lineHeight: '1.15',
            letterSpacing: '0.02em',
            fontWeight: '420',
          },
        ],
        base: [
          '14px',
          {
            lineHeight: '1.15',
            letterSpacing: '0.02em',
            fontWeight: '420',
          },
        ],
        lg: [
          '16px',
          {
            lineHeight: '1.15',
            letterSpacing: '0.02em',
            fontWeight: '400',
          },
        ],
        xl: [
          '18px',
          {
            lineHeight: '1.15',
            letterSpacing: '0.01em',
            fontWeight: '400',
          },
        ],
        '2xl': [
          '20px',
          {
            lineHeight: '1.15',
            letterSpacing: '0.01em',
            fontWeight: '400',
          },
        ],
        '3xl': [
          '24px',
          {
            lineHeight: '1.15',
            fontWeight: 400,
            letterSpacing: '0.005em',
          },
        ],
        // font size for paragraphs
        'p-2xs': [
          '11px',
          {
            lineHeight: '1.6',
            letterSpacing: '0.01em',
            fontWeight: '420',
          },
        ],
        'p-xs': [
          '12px',
          {
            lineHeight: '1.6',
            letterSpacing: '0.02em',
            fontWeight: '420',
          },
        ],
        'p-sm': [
          '13px',
          {
            lineHeight: '1.5',
            letterSpacing: '0.02em',
            fontWeight: '420',
          },
        ],
        'p-base': [
          '14px',
          {
            lineHeight: '1.5',
            letterSpacing: '0.02em',
            fontWeight: '420',
          },
        ],
        'p-lg': [
          '16px',
          {
            lineHeight: '1.5',
            letterSpacing: '0.02em',
            fontWeight: '400',
          },
        ],
        'p-xl': [
          '18px',
          {
            lineHeight: '1.42',
            letterSpacing: '0.01em',
            fontWeight: '400',
          },
        ],
        'p-2xl': [
          '20px',
          {
            lineHeight: '1.38',
            letterSpacing: '0.01em',
            fontWeight: '400',
          },
        ],
        'p-3xl': [
          '24px',
          {
            lineHeight: '1.2',
            fontWeight: 400,
            letterSpacing: '0.005em',
          },
        ],
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
      extend: {
        textColor: {
          ink: semanticColors.ink,
        },
        backgroundColor: {
          surface: semanticColors.surface,
        },
        fill: {
          ink: semanticColors.ink,
        },
        stroke: {
          ink: semanticColors.ink,
        },
        borderColor: (theme) => ({
          DEFAULT: theme('colors.gray.200'),
          outline: semanticColors.outline,
        }),
        ringColor: {
          outline: semanticColors.outline,
        },
        divideColor: {
          outline: semanticColors.outline,
        },
        spacing: {
          4.5: '1.125rem',
          5.5: '1.375rem',
          6.5: '1.625rem',
          7.5: '1.875rem',
          8.5: '2.125rem',
          9.5: '2.375rem',
          10.5: '2.625rem',
          11.5: '2.875rem',
          12.5: '3.125rem',
          13: '3.25rem',
          13.5: '3.375rem',
          14.5: '3.625rem',
          15: '3.75rem',
          15.5: '3.875rem',
        },
        width: {
          3.5: '0.875rem',
          112: '28rem',
          wizard: '650px',
        },
        height: {
          3.5: '0.875rem',
        },
        minWidth: {
          40: '10rem',
          50: '18rem',
        },
        maxHeight: {
          52: '13rem',
        },
        typography: (theme) => ({
          DEFAULT: {
            css: {
              '--tw-prose-body': theme('colors.gray.800'),
            },
          },
          sm: {
            css: {
              fontSize: '14px',
              fontWeight: 420,
              lineHeight: 1.6,
              letterSpacing: '0.02em',
              p: {
                marginTop: '0.5rem',
                marginBottom: '1rem',
              },
              '> ul > li p': {
                marginTop: '0.5rem',
                marginBottom: '0.5rem',
              },
              '> ul > li > *:first-child': {
                marginTop: '0.5rem',
              },
              '> ul > li > *:last-child': {
                marginBottom: '0.5rem',
              },
              '> ol > li p': {
                marginTop: '0.5rem',
                marginBottom: '0.5rem',
              },
              '> ol > li > *:first-child': {
                marginTop: '0.5rem',
              },
              '> ol > li > *:last-child': {
                marginBottom: '0.5rem',
              },
            },
          },
        }),
      },
    },
  },
)
