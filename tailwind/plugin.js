import plugin from 'tailwindcss/plugin'
import {
  generateColorPalette,
  generateSemanticColors,
  generateCSSVariables,
  generateEffectVariables,
} from './colorPalette.js'
import radiusTokens from './generated/radius.json'
import typographyTokens from './generated/typography.json'
import effectsData from './generated/effects.json'

let colorPalette = generateColorPalette()
let semanticColors = generateSemanticColors()
let cssVariables = mergeVariableLayers(
  generateCSSVariables(),
  generateEffectVariables(),
  generateRadiusVariables(),
)

// Emit `--radius-{key}` for every radius token (numeric scale + aliases) so
// the values are inspectable as real CSS variables. `borderRadius` is rewired
// below to consume these vars, so `rounded-4` and `--radius-4` stay in sync.
function generateRadiusVariables() {
  const vars = {}
  for (const [key, value] of Object.entries(radiusTokens)) {
    if (key === 'DEFAULT') continue
    vars[`--radius-${key}`] = value
  }
  return { ':root': vars }
}

// Map `DEFAULT` (Tailwind's `rounded` class) onto the numeric var that
// shares its value, so we don't emit a `--radius-DEFAULT` (awkward name).
function buildRadiusConfig() {
  const numericByValue = {}
  for (const [key, value] of Object.entries(radiusTokens)) {
    if (/^\d+$/.test(key)) numericByValue[value] = key
  }
  const out = {}
  for (const [key, value] of Object.entries(radiusTokens)) {
    if (key === 'DEFAULT') {
      const numeric = numericByValue[value]
      out[key] = numeric ? `var(--radius-${numeric})` : value
    } else {
      out[key] = `var(--radius-${key})`
    }
  }
  return out
}

// Merge two `{ selector: { var: value } }` objects into one, preserving any
// vars already declared under the same selector.
function mergeVariableLayers(...layers) {
  const out = {}
  for (const layer of layers) {
    for (const [selector, vars] of Object.entries(layer)) {
      out[selector] = { ...(out[selector] || {}), ...vars }
    }
  }
  return out
}

// Per-size augmentation preserved from pre-Figma config — letterSpacing and
// fontWeight aren't modelled on `font.size.*` in the Figma export, so we keep
// the historical values keyed by size name.
const FONT_SIZE_AUGMENT = {
  '2xs': { letterSpacing: '0.01em', fontWeight: '420' },
  xs: { letterSpacing: '0.02em', fontWeight: '420' },
  sm: { letterSpacing: '0.02em', fontWeight: '420' },
  base: { letterSpacing: '0.02em', fontWeight: '420' },
  lg: { letterSpacing: '0.02em', fontWeight: '400' },
  xl: { letterSpacing: '0.01em', fontWeight: '400' },
  '2xl': { letterSpacing: '0.01em', fontWeight: '400' },
  '3xl': { letterSpacing: '0.005em', fontWeight: '400' },
}

// Tracking for the `medium` weight variant of each size. Figma models typography
// as named styles (`text/base/medium`, `text/lg/medium`, …) where medium-weight
// text is tracked tighter than its regular-weight sibling. Tailwind's fontSize
// utility is keyed by size only, so we expose these as component classes
// (`.text-base-medium`, `.text-lg-medium`) via `buildTextStyleUtilities()`.
// Only add entries here for sizes whose medium tracking is confirmed in Figma.
const FONT_SIZE_MEDIUM_TRACKING = {
  base: '0.015em',
  lg: '0.015em',
}

// Paragraph variants — same sizes but looser line-heights for reading.
const PARAGRAPH_LINE_HEIGHT = {
  '2xs': '1.6',
  xs: '1.6',
  sm: '1.5',
  base: '1.5',
  lg: '1.5',
  xl: '1.42',
  '2xl': '1.38',
  '3xl': '1.2',
}

function buildFontSize() {
  const out = {}
  for (const [key, [size, meta]] of Object.entries(typographyTokens.fontSize)) {
    // `tiny` arrives with lineHeight 0px from Figma — fall back to a sane ratio.
    const lineHeight = meta.lineHeight === '0px' ? '1.15' : meta.lineHeight
    out[key] = [size, { lineHeight, ...(FONT_SIZE_AUGMENT[key] || {}) }]
  }
  // Paragraph variants for the size set that defined them previously.
  for (const [key, lineHeight] of Object.entries(PARAGRAPH_LINE_HEIGHT)) {
    if (!out[key]) continue
    const [size, meta] = out[key]
    out[`p-${key}`] = [size, { ...meta, lineHeight }]
  }
  return out
}

// Focus ring utilities backed by `--focus-*` CSS vars (theme-flipped in
// colorPalette.js#generateEffectVariables). Registered via `addComponents` so
// Tailwind IntelliSense picks them up. Usage: `focus-visible:focus-ring-blue`.
function buildFocusRingUtilities() {
  const out = {}
  for (const name of Object.keys(effectsData.focus.light)) {
    const className = name === 'default' ? '.focus-ring' : `.focus-ring-${name}`
    out[className] = { boxShadow: `var(--focus-${name})` }
  }
  return out
}

function buildTextStyleUtilities() {
  const out = {}
  for (const [key, tracking] of Object.entries(FONT_SIZE_MEDIUM_TRACKING)) {
    const entry = typographyTokens.fontSize[key]
    if (!entry) continue
    const [size, meta] = entry
    const lineHeight = meta.lineHeight === '0px' ? '1.15' : meta.lineHeight
    out[`.text-${key}-medium`] = {
      fontSize: size,
      lineHeight,
      fontWeight: '500',
      letterSpacing: tracking,
    }
  }
  return out
}

let globalStyles = (theme) => ({
  html: {
    'font-family': `InterVar, ${theme('fontFamily.sans')}`,
    'font-optical-sizing': 'auto',
  },
  'html, body, button, p, span, div': {
    fontVariationSettings: "'opsz' 24, 'cv11' 1",
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
    '@apply h-7 rounded border border-[--surface-gray-2] bg-surface-gray-2 py-1.5 pl-2 pr-2 text-base text-ink-gray-8 placeholder-ink-gray-4 transition-colors hover:border-outline-elevation-2 hover:bg-surface-gray-3 focus:border-outline-gray-4 focus:bg-surface-base focus:shadow-sm focus:ring-0 focus-visible:ring-2 focus-visible:ring-outline-gray-3':
      {},
  },
  '.form-checkbox': {
    '@apply rounded-md bg-surface-gray-2 text-ink-blue-5 focus:ring-0 focus-visible:ring-1':
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
    addComponents(buildTextStyleUtilities())
    addComponents(buildFocusRingUtilities())
  },
  {
    theme: {
      colors: colorPalette,
      borderRadius: buildRadiusConfig(),
      boxShadow: {
        none: 'none',
        sm: 'var(--elevation-sm)',
        base: 'var(--elevation-base)',
        DEFAULT: 'var(--elevation-base)',
        md: 'var(--elevation-md)',
        lg: 'var(--elevation-lg)',
        xl: 'var(--elevation-xl)',
        '2xl': 'var(--elevation-2xl)',
        status: 'var(--elevation-status)',
        'dark-sm': 'var(--dark-elevation-sm)',
        'dark-base': 'var(--dark-elevation-base)',
        'dark-md': 'var(--dark-elevation-md)',
        'dark-lg': 'var(--dark-elevation-lg)',
        'dark-xl': 'var(--dark-elevation-xl)',
        'dark-2xl': 'var(--dark-elevation-2xl)',
      },
      container: {
        padding: {
          xl: '5rem',
        },
      },
      fontSize: buildFontSize(),
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
        gradientColorStops: {
          surface: semanticColors.surface,
          ink: semanticColors.ink,
          outline: semanticColors.outline,
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
          // prose-v3: zero paragraph margins, user controls spacing with Enter
          // all spacing on 8px grid: 4, 8, 16, 24, 32px
          // empty <p> = 14px × 1.7 line-height ≈ 23.8px (the user's spacing unit)
          //
          // Base font-size is customizable via `--prose-font-size` (default 14px).
          // Every child size is `em`-relative to this base, so overriding the
          // variable rescales the whole editor proportionally — headings, lists,
          // code — while line-height (unitless) and em letter-spacing scale too.
          // Set it with an arbitrary-property utility or inline style, e.g.
          //   <EditorContent class="[--prose-font-size:1rem]" />
          v3: {
            css: [
              {
                fontSize: 'var(--prose-font-size, 15px)',
                fontWeight: 420,
                lineHeight: '1.7',
                letterSpacing: '0.02em',

                // prose-v3 color tokens — calmer, softer than defaults
                '--tw-prose-body': 'var(--ink-gray-7)',
                '--tw-prose-bold': 'var(--ink-gray-8)',
                '--tw-prose-quotes': 'var(--ink-gray-7)',
                '--tw-prose-quote-borders': 'var(--ink-gray-3)',
                '--tw-prose-kbd': 'var(--ink-gray-8)',
                '--tw-prose-code': 'var(--ink-gray-8)',

                // links: subtle bottom border, darkens on hover
                a: {
                  textDecoration: 'none',
                  borderBottom: '1px solid var(--ink-gray-3)',
                  transition: 'border-color 0.08s ease',
                },
                'a:hover': {
                  borderBottom: '1px solid var(--ink-gray-6)',
                },

                // inline code: subtle pill — strip Tailwind's added quotes
                'code::before': { content: 'none' },
                'code::after': { content: 'none' },
                code: {
                  backgroundColor: 'var(--surface-gray-2)',
                  borderRadius: '4px',
                  paddingTop: '1px',
                  paddingBottom: '1px',
                  paddingInlineStart: '5px',
                  paddingInlineEnd: '5px',
                  fontWeight: 420,
                  fontSize: em(12, 14),
                },
                // code inside pre should not get the pill styles
                'pre code': {
                  backgroundColor: 'transparent',
                  borderRadius: '0',
                  padding: '0',
                  fontWeight: 'inherit',
                  fontSize: 'inherit',
                },

                // blockquote: left border, receded color, no italic, no quote marks
                blockquote: {
                  'border-inline-start-width': '2px',
                  borderInlineStartColor: 'var(--ink-gray-3)',
                  borderInlineStartStyle: 'solid',
                  marginTop: '16px',
                  marginBottom: '16px',
                  paddingInlineStart: '1em',
                  fontStyle: 'normal',
                  color: 'var(--ink-gray-6)',
                  quotes: 'none',
                },
                'blockquote p:first-of-type::before': { content: 'none' },
                'blockquote p:last-of-type::after': { content: 'none' },
                'blockquote p': {
                  marginTop: '0',
                  marginBottom: '0',
                },

                // paragraphs: zero margin — user controls spacing with empty paragraphs
                p: {
                  marginTop: '0',
                  marginBottom: '0',
                },

                // headings: marginTop creates section break (32/24px),
                // marginBottom keeps heading close to its content (8px, proximity)
                // h1/h2: full weight + darkest; h3-h5: softer weight + stepped-back color
                h1: {
                  fontSize: em(20, 14),
                  marginTop: '32px',
                  marginBottom: '8px',
                  lineHeight: '1.3',
                },
                h2: {
                  fontSize: em(18, 14),
                  marginTop: '32px',
                  marginBottom: '8px',
                  lineHeight: '1.35',
                },
                h3: {
                  fontSize: em(16, 14),
                  marginTop: '24px',
                  marginBottom: '8px',
                  lineHeight: '1.4',
                },
                h4: {
                  fontSize: em(14, 14),
                  marginTop: '24px',
                  marginBottom: '8px',
                  lineHeight: '1.45',
                },
                h5: {
                  fontSize: em(13, 14),
                  marginTop: '24px',
                  marginBottom: '8px',
                  lineHeight: '1.45',
                },

                // element after heading gets no extra top margin
                'h1 + *': { marginTop: '0' },
                'h2 + *': { marginTop: '0' },
                'h3 + *': { marginTop: '0' },
                'h4 + *': { marginTop: '0' },
                'h5 + *': { marginTop: '0' },

                // lists: small outer margin (4px), tight internal spacing
                ul: {
                  marginTop: '4px',
                  marginBottom: '4px',
                  paddingInlineStart: '1.5em',
                },
                ol: {
                  marginTop: '4px',
                  marginBottom: '4px',
                  paddingInlineStart: '1.5em',
                },
                li: {
                  marginTop: '4px',
                  marginBottom: '4px',
                },
                'li p': {
                  marginTop: '4px',
                  marginBottom: '4px',
                },
                'ul ul, ul ol, ol ul, ol ol': {
                  marginTop: '4px',
                  marginBottom: '4px',
                },

                // code blocks: breathing room (16px)
                pre: {
                  fontSize: em(12, 14),
                  lineHeight: '1.6',
                  marginTop: '16px',
                  marginBottom: '16px',
                  borderRadius: '0.375rem',
                  paddingTop: '0.75em',
                  paddingInlineEnd: '1em',
                  paddingBottom: '0.75em',
                  paddingInlineStart: '1em',
                },

                // tables: breathing room (16px)
                table: {
                  fontSize: em(12, 14),
                  lineHeight: '1.5',
                  marginTop: '16px',
                  marginBottom: '16px',
                },

                // images, video, figures: breathing room (16px)
                img: {
                  marginTop: '16px',
                  marginBottom: '16px',
                },
                picture: {
                  marginTop: '16px',
                  marginBottom: '16px',
                },
                'picture > img': {
                  marginTop: '0',
                  marginBottom: '0',
                },
                video: {
                  marginTop: '16px',
                  marginBottom: '16px',
                },
                figure: {
                  marginTop: '16px',
                  marginBottom: '16px',
                },
                'figure > *': {
                  marginTop: '0',
                  marginBottom: '0',
                },

                // hr: short centered line, not edge-to-edge
                hr: {
                  marginTop: '24px',
                  marginBottom: '24px',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  width: '20%',
                },
                'hr + *': {
                  marginTop: '0',
                },
              },
              {
                // first/last child: no extra margin
                '> :first-child': {
                  marginTop: '0',
                },
                '> :last-child': {
                  marginBottom: '0',
                },
              },
            ],
          },
          // prose-p-spacing: restores paragraph margins for content authored before prose-v3.
          // Apply alongside prose-v3 for pre-migration content:
          //   new content: "prose prose-v3"
          //   old content: "prose prose-v3 prose-p-spacing"
          // Must be defined after v3 in this config so its rules come later in
          // the generated CSS and override v3's zero paragraph margins.
          'p-spacing': {
            css: {
              p: {
                marginTop: '0.5rem',
                marginBottom: '0.5rem',
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
