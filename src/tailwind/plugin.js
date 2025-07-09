import plugin from 'tailwindcss/plugin'
import {
  generateColorPalette,
  generateSemanticColors,
  generateCSSVariables,
} from './colorPalette.js'

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
    '@apply h-7 rounded border border-[--surface-gray-2] bg-surface-gray-2 py-1.5 pl-2 pr-2 text-base text-ink-gray-8 placeholder-ink-gray-4 transition-colors hover:border-outline-gray-modals hover:bg-surface-gray-3 focus:border-outline-gray-4 focus:bg-surface-white focus:shadow-sm focus:ring-0 focus-visible:ring-2 focus-visible:ring-outline-gray-3':
      {},
  },
  '.form-checkbox': {
    '@apply rounded-md bg-surface-gray-2 text-ink-blue-2 focus:ring-0 focus-visible:ring-1':
      {},
  },
  "[data-theme='dark'] [type='checkbox']:checked": {
    'background-image': `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='%230F0F0F' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")`,
  },
  "[data-theme='dark'] img": {
    filter: 'brightness(.8) contrast(1.2)',
  },
}

export default plugin(
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
          surface: semanticColors.surface,
        },
        stroke: {
          ink: semanticColors.ink,
        },
        placeholderColor: {
          ink: semanticColors.ink,
        },
        borderColor: () => ({
          DEFAULT: 'var(--outline-gray-1)',
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
              '--tw-prose-body': 'var(--ink-gray-8)',
              '--tw-prose-headings': 'var(--ink-gray-9)',
              '--tw-prose-lead': 'var(--ink-gray-5)',
              '--tw-prose-links': 'var(--ink-gray-9)',
              '--tw-prose-bold': 'var(--ink-gray-9)',
              '--tw-prose-counters': 'var(--ink-gray-4)',
              '--tw-prose-bullets': 'var(--ink-gray-2)',
              '--tw-prose-hr': 'var(--ink-gray-1)',
              '--tw-prose-quotes': 'var(--ink-gray-8)',
              '--tw-prose-quote-borders': 'var(--ink-gray-1)',
              '--tw-prose-captions': 'var(--ink-gray-4)',
              '--tw-prose-kbd': 'var(--ink-gray-9)',
              '--tw-prose-code': 'var(--ink-gray-9)',
              '--tw-prose-pre-code': 'var(--ink-gray-1)',
              '--tw-prose-pre-bg': 'var(--ink-gray-8)',
              '--tw-prose-th-borders': 'var(--ink-gray-2)',
              '--tw-prose-td-borders': 'var(--ink-gray-1)',
              h1: {
                fontWeight: 600,
              },
              h2: {
                fontWeight: 600,
              },
              h3: {
                fontWeight: 600,
              },
              h4: {
                fontWeight: 600,
              },
              h5: {
                fontWeight: 600,
              },
              'h1 strong': {
                fontWeight: 600,
              },
              'h2 strong': {
                fontWeight: 600,
              },
              'h3 strong': {
                fontWeight: 600,
              },
              'h4 strong': {
                fontWeight: 600,
              },
              'h5 strong': {
                fontWeight: 600,
              },
              'img[data-align=right]': {
                marginLeft: 'auto',
                marginRight: '0',
              },
              'img[data-align=center]': {
                marginLeft: 'auto',
                marginRight: 'auto',
              },
            },
          },
          sm: {
            css: {
              fontSize: '14px',
              fontWeight: 420,
              lineHeight: 1.5,
              letterSpacing: '0.02em',
              h1: {
                fontSize: em(20, 14),
              },
              h2: {
                fontSize: em(18, 14),
              },
              h3: {
                fontSize: em(16, 14),
              },
              h4: {
                fontSize: em(14, 14),
              },
              h5: {
                fontSize: em(13, 14),
              },
              p: {
                marginTop: '0.5rem',
                marginBottom: '0.5rem',
              },
              'ul > li': {
                margin: '0.5rem 0',
                '> p': {
                  margin: '0.5rem 0',
                },
                '> p:first-child:last-child': {
                  margin: '0.5rem 0',
                },
                '> p:first-child': {
                  marginTop: '0.5rem',
                },
                '> p:last-child': {
                  marginBottom: '0.5rem',
                },
              },
              'ol > li': {
                margin: '0.5rem 0',
                '> p': {
                  margin: '0.5rem 0',
                },
                '> p:first-child:last-child': {
                  margin: '0.5rem 0',
                },
                '> p:first-child': {
                  marginTop: '0.5rem',
                },
                '> p:last-child': {
                  marginBottom: '0.5rem',
                },
              },
            },
          },
        }),
      },
    },
  },
)

function em(pixels, base = 16) {
  return `${pixels / base}em`
}
