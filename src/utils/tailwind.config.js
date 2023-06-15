const plugin = require('tailwindcss/plugin')

module.exports = {
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
    colors: ({ colors }) => ({
      inherit: colors.inherit,
      current: colors.current,
      transparent: colors.transparent,
      black: colors.black,
      white: colors.white,
      gray: {
        50: '#F8F8F8',
        100: '#F3F3F3',
        200: '#EDEDED',
        300: '#E2E2E2',
        400: '#C7C7C7',
        500: '#999999',
        600: '#7C7C7C',
        700: '#525252',
        800: '#383838',
        900: '#171717',
      },
      blue: {
        50: '#F7FBFD',
        100: '#EDF6FD',
        200: '#E3F1FD',
        300: '#C9E7FC',
        400: '#70B6F0',
        500: '#0289F7',
        600: '#007BE0',
        700: '#0070CC',
        800: '#005CA3',
        900: '#004880',
      },
      green: {
        50: '#F3FCF5',
        100: '#E4F5E9',
        200: '#DAF0E1',
        300: '#CAE5D4',
        400: '#B6DEC5',
        500: '#59BA8B',
        600: '#30A66D',
        700: '#278F5E',
        800: '#16794C',
        900: '#173B2C',
      },
      red: {
        50: '#FFF7F7',
        100: '#FFF0F0',
        200: '#FCD7D7',
        300: '#F9C6C6',
        400: '#EB9091',
        500: '#E03636',
        600: '#CC2929',
        700: '#B52A2A',
        800: '#941F1F',
        900: '#6B1515',
      },
      orange: {
        50: '#FFF9F5',
        100: '#FFF1E7',
        200: '#FCE6D5',
        300: '#F7D6BD',
        400: '#F0B58B',
        500: '#E86C13',
        600: '#D45A08',
        700: '#BD3E0C',
        800: '#9E3513',
        900: '#6B2711',
      },
      yellow: {
        50: '#FFFCEF',
        100: '#FFF7D3',
        200: '#F7E9A8',
        300: '#F5E171',
        400: '#F2D14B',
        500: '#EDBA13',
        600: '#D1930D',
        700: '#AB6E05',
        800: '#8C5600',
        900: '#733F12',
      },
      teal: {
        50: '#F0FDFA',
        100: '#E6F7F4',
        200: '#BAE8E1',
        300: '#97DED4',
        400: '#73D1C4',
        500: '#36BAAD',
        600: '#0B9E92',
        700: '#0F736B',
        800: '#115C57',
        900: '#114541',
      },
      violet: {
        50: '#FBFAFF',
        100: '#F5F2FF',
        200: '#E5E1FA',
        300: '#DAD2F7',
        400: '#BDB1F0',
        500: '#6846E3',
        600: '#5F46C7',
        700: '#4F3DA1',
        800: '#392980',
        900: '#251959',
      },
      cyan: {
        50: '#F5FBFC',
        100: '#E0F8FF',
        200: '#B3ECFC',
        300: '#94E6FF',
        400: '#6BD3F2',
        500: '#34BAE3',
        600: '#32A4C7',
        700: '#267A94',
        800: '#125C73',
        900: '#164759',
      },
      amber: {
        50: '#FDFAED',
        100: '#FCF3CF',
        200: '#F7E28D',
        300: '#F5D261',
        400: '#F2BE3A',
        500: '#E79913',
        600: '#DB7706',
        700: '#B35309',
        800: '#91400D',
        900: '#763813',
      },
      pink: {
        50: '#FFF7FC',
        100: '#FEEEF8',
        200: '#F8E2F0',
        300: '#F2D4E6',
        400: '#E9C4DA',
        500: '#E34AA6',
        600: '#CF3A96',
        700: '#9C2671',
        800: '#801458',
        900: '#570F3E',
      },
      purple: {
        50: '#FDFAFF',
        100: '#F9F0FF',
        200: '#F1E5FA',
        300: '#E9D6F5',
        400: '#D6C1E6',
        500: '#9C45E3',
        600: '#8642C2',
        700: '#6E399D',
        800: '#5C2F83',
        900: '#401863',
      },
      'white-overlay': {
        50: 'rgba(255, 255, 255, 0.09)',
        100: 'rgba(255, 255, 255, 0.18)',
        200: 'rgba(255, 255, 255, 0.27)',
        300: 'rgba(255, 255, 255, 0.36)',
        400: 'rgba(255, 255, 255, 0.45)',
        500: 'rgba(255, 255, 255, 0.54)',
        600: 'rgba(255, 255, 255, 0.63)',
        700: 'rgba(255, 255, 255, 0.72)',
        800: 'rgba(255, 255, 255, 0.81)',
        900: 'rgba(255, 255, 255, 0.90)',
      },
      'black-overlay': {
        50: 'rgba(0, 0, 0, 0.09)',
        100: 'rgba(0, 0, 0, 0.18)',
        200: 'rgba(0, 0, 0, 0.27)',
        300: 'rgba(0, 0, 0, 0.36)',
        400: 'rgba(0, 0, 0, 0.45)',
        500: 'rgba(0, 0, 0, 0.54)',
        600: 'rgba(0, 0, 0, 0.63)',
        700: 'rgba(0, 0, 0, 0.72)',
        800: 'rgba(0, 0, 0, 0.81)',
        900: 'rgba(0, 0, 0, 0.90)',
      },
    }),
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
    plugin(function ({ addBase, theme }) {
      addBase({
        html: {
          'font-family': `Inter, ${theme('fontFamily.sans')}`,
        },
        '@supports (font-variation-settings: normal)': {
          html: {
            'font-family': `InterVar, ${theme('fontFamily.sans')}`,
            'font-optical-sizing': 'auto',
          },
        },
      })
    }),
  ],
}
