const themePlugin = require('./theme/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
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
      borderColor: (theme) => ({
        DEFAULT: theme('colors.gray.200'),
      }),
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
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    themePlugin,
  ],
}
