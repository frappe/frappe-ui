import plugin from 'tailwindcss/plugin'
import { generateColorPalette, generateSemanticColors } from './colorPalette.js'
import {
  cssVariables,
  focusRing as focusRingTokens,
  fontSize as fontSizeTokens,
  fontWeight as fontWeightTokens,
  radius as radiusTokens,
  screens as screenTokens,
  shadows as shadowTokens,
  tracking as trackingTokens,
} from './tokens.js'
import typographyTokens from './tokens/typography.js'
import { listColumnRules } from './listColumns.js'

// Read straight from the token module. `textTransform` is not a public token
// export: it is empty, and the one style that filled it went away in #940.
const textTransformTokens = typographyTokens.textTransform

let colorPalette = generateColorPalette()
let semanticColors = generateSemanticColors()

// The `shadow-*` key list is declared once, in tokens.js#shadows, so a new
// elevation step reaches both the token map and the utility from one edit.
// The theme values stay `var(--elevation-*)` so a themed page can retune a
// step at runtime. `none` and `DEFAULT` are Tailwind key names, not tokens:
// `none` has no variable and `DEFAULT` shares the `base` one.
function buildBoxShadowConfig() {
  const out = {}
  for (const key of Object.keys(shadowTokens)) {
    if (key === 'none') out[key] = 'none'
    else if (key === 'DEFAULT') out[key] = 'var(--elevation-base)'
    else out[key] = `var(--elevation-${key})`
  }
  return out
}

// `--radius-{key}` is emitted for every token by tokens.js#cssVariables, and
// `borderRadius` consumes those vars, so `rounded-4` and `--radius-4` stay in
// sync by construction.
//
// Each value carries a trailing `/* {px} */` comment so editor tooling
// (Tailwind IntelliSense) surfaces the resolved px on hover, instead of
// the opaque `var(--radius-*)` reference. No `DEFAULT` key: the bare
// `rounded` utility no longer exists, so write `rounded-4`.
function buildRadiusConfig() {
  const out = {}
  for (const [key, value] of Object.entries(radiusTokens)) {
    out[key] = `var(--radius-${key}) /* ${value} */`
  }
  return out
}

// Weight variants are exposed as component classes — `text-<size>-<weight>` and
// the paragraph counterpart `text-p-<size>-<weight>` — one per Figma named
// style. Figma tracks each weight differently per size and CSS letter-spacing
// can't follow font-weight, so each (size, weight) must ship as a self-contained
// class. `regular` stays the bare `text-<size>` / `text-p-<size>` utility.
// (Component classes are JIT-purged, so only the ones used in content emit.)
// `black` was dropped in #998 — zero usage, and the Figma weights behind it
// were corrupt export data.
const WEIGHT_VARIANTS = ['medium', 'semibold', 'bold']

// tokens.js holds each style as a plain object — it does not speak Tailwind.
// Tailwind's `fontSize` theme wants the `[size, meta]` tuple. Convert here.
// Both families are already present: `base` is the text style, `p-base` the
// paragraph one (same size, looser line-height, its own letter-spacing).
function buildFontSize() {
  return Object.fromEntries(
    Object.entries(fontSizeTokens).map(([key, { fontSize, ...meta }]) => [
      key,
      [fontSize, meta],
    ]),
  )
}

// Focus ring utilities backed by `--focus-outline-*` CSS vars (theme-flipped
// in tokens.js#cssVariables). Implemented as `outline`, not
// box-shadow, so rings never collide with shadow/ring utilities on the same
// element and survive forced-colors mode. The default ring is applied
// globally via `:focus-visible` (see globalStyles); these utilities are for
// themed overrides (`focus-visible:focus-ring-red`) and non-focus states
// (`data-[state=open]:focus-ring`). Registered via `addComponents` so
// Tailwind IntelliSense picks them up.
function buildFocusRingUtilities() {
  const out = {}
  for (const name of Object.keys(focusRingTokens.light)) {
    const className = name === 'default' ? '.focus-ring' : `.focus-ring-${name}`
    out[className] = {
      outline: `var(--focus-outline-${name})`,
      outlineOffset: '0px',
    }
  }
  return out
}

function buildTextStyleUtilities() {
  const out = {}
  const groups = [
    {
      className: (s, w) => `.text-${s}-${w}`,
      tracking: trackingTokens?.text || {},
      style: (s) => fontSizeTokens[s],
    },
    {
      className: (s, w) => `.text-p-${s}-${w}`,
      tracking: trackingTokens?.paragraph || {},
      style: (s) => fontSizeTokens[`p-${s}`],
    },
  ]
  for (const group of groups) {
    for (const [size, byWeight] of Object.entries(group.tracking)) {
      const style = group.style(size)
      if (!style) continue
      const transform = textTransformTokens?.[size]
      for (const weight of WEIGHT_VARIANTS) {
        if (!(weight in byWeight)) continue
        out[group.className(size, weight)] = {
          fontSize: style.fontSize,
          lineHeight: style.lineHeight,
          fontWeight: String(fontWeightTokens[weight]),
          letterSpacing: byWeight[weight],
          ...(transform ? { textTransform: transform } : {}),
        }
      }
    }
  }
  // An uppercase eyebrow style needs the text-transform on its bare regular
  // utility too — Tailwind's fontSize tuple can't express one. Empty today:
  // `tiny`, the only such style, was dropped in #940.
  for (const [size, transform] of Object.entries(textTransformTokens || {})) {
    out[`.text-${size}`] = {
      ...(out[`.text-${size}`] || {}),
      textTransform: transform,
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
  // A bare `<p>` reads as body copy, so it defaults to a relaxed line-height
  // instead of the tight value baked into the `text-<size>` utilities. Kept at
  // element specificity (0,0,1) with `:where()` (which adds none) so any explicit
  // `text-*` / `text-p-*` line-height wins, and scoped out of rich text so the
  // `prose` / editor line-heights are untouched.
  'p:not(:where(.prose, .ProseMirror) *)': {
    lineHeight: '1.5',
  },
  // Global keyboard focus indicator (espresso v2 focus/default token).
  // Lives in the base layer so any utility on the element can override it:
  // suppress with `focus-visible:outline-none`, retheme with
  // `focus-visible:focus-ring-<color>`.
  ':focus-visible': {
    outline: 'var(--focus-outline-default)',
    outlineOffset: '0px',
  },
})

let componentStyles = {
  '.form-input, .form-textarea, .form-select': {
    '@apply h-7 rounded-4 border border-[--surface-gray-2] bg-surface-gray-2 py-1.5 pl-2 pr-2 text-base text-ink-gray-8 placeholder-ink-gray-4 transition-colors hover:border-outline-elevation-2 hover:bg-surface-gray-3 focus:border-outline-gray-4 focus:bg-surface-base focus:shadow-sm focus:ring-0':
      {},
  },
  '.form-checkbox': {
    '@apply rounded-5 bg-surface-gray-2 text-ink-blue-4 focus:ring-0': {},
  },
}

// The checkbox's check and dash are espresso's own (checkbox new,
// 23513:153494): the 12px icon/line/check and icon/line/dash, a 1px
// round-capped line set 2px into the 16px box — not the forms plugin's
// bolder 2px marks. They are drawn in ink/base, white on the light theme's
// gray-900 fill and #171717 (oklch 0.205) on the dark theme's near-white
// one; a data URI cannot read a CSS variable, so each theme writes its own.
// These live in the base layer, not in `addComponents`, because their keys
// are attribute selectors: Tailwind v4 reads a v3 preset through `@config`
// and rejects any `addComponents` key that is not a single class name,
// which fails the whole build. Each selector is (0,3,0), above both the
// forms base rule `input:where([type='checkbox']):checked` (0,1,1) and the
// forms class rule `.form-checkbox:checked` (0,2,0); the dark rules come
// after the light ones at the same weight, so they win on the dark theme.
const CHECK_PATH =
  'M9.71757 2.45503C9.89809 2.24626 10.2137 2.22384 10.4226 2.40425C10.6314 2.58477 10.6548 2.9004 10.4744 3.10933L4.91581 9.54487C4.82201 9.65322 4.68608 9.71626 4.54276 9.71773C4.39936 9.71911 4.26176 9.65928 4.16581 9.55269L1.533 6.6269C1.34863 6.42176 1.36527 6.10554 1.5701 5.92085C1.77536 5.73612 2.09241 5.75271 2.27714 5.95796L4.52909 8.46089L9.71757 2.45503Z'
const DASH_PATH =
  'M9 5.49994C9.27614 5.49994 9.49999 5.72381 9.5 5.99994C9.5 6.27608 9.27614 6.49994 9 6.49994H3C2.72386 6.49994 2.5 6.27608 2.5 5.99994C2.50001 5.72381 2.72386 5.49994 3 5.49994H9Z'
const checkboxMark = (path, fill) =>
  `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='${fill}' xmlns='http://www.w3.org/2000/svg'%3e%3cpath transform='translate(2 2)' d='${path}'/%3e%3c/svg%3e")`

let checkboxMarkStyles = {
  ":root [type='checkbox']:checked": {
    'background-image': checkboxMark(CHECK_PATH, 'white'),
  },
  ":root [type='checkbox']:indeterminate": {
    'background-image': checkboxMark(DASH_PATH, 'white'),
  },
  "[data-theme='dark'] [type='checkbox']:checked": {
    'background-image': checkboxMark(CHECK_PATH, '%23171717'),
  },
  "[data-theme='dark'] [type='checkbox']:indeterminate": {
    'background-image': checkboxMark(DASH_PATH, '%23171717'),
  },
  // disabled, the mark is ink/gray-4: #999999, and #7A7A7A on dark
  ":root [type='checkbox']:disabled:checked": {
    'background-image': checkboxMark(CHECK_PATH, '%23999999'),
  },
  ":root [type='checkbox']:disabled:indeterminate": {
    'background-image': checkboxMark(DASH_PATH, '%23999999'),
  },
  "[data-theme='dark'] [type='checkbox']:disabled:checked": {
    'background-image': checkboxMark(CHECK_PATH, '%237A7A7A'),
  },
  "[data-theme='dark'] [type='checkbox']:disabled:indeterminate": {
    'background-image': checkboxMark(DASH_PATH, '%237A7A7A'),
  },
}

export default plugin(
  function ({ addBase, addComponents, matchUtilities, theme }) {
    // tokens.js keys the variables by theme; the selector each theme lands on
    // is a Tailwind concern, so it is decided here.
    addBase({
      ...globalStyles(theme),
      ':root': cssVariables.light,
      '[data-theme="dark"]': cssVariables.dark,
    })
    // Resolves <List :columns="{ base, md, … }"> against this app's own
    // breakpoints, so list tracks and `md:hidden` cells switch at the same
    // width. See tailwind/listColumns.js.
    addBase(listColumnRules(theme('screens')))
    addBase(checkboxMarkStyles)
    addComponents(componentStyles)
    addComponents(buildTextStyleUtilities())
    addComponents(buildFocusRingUtilities())
    // Authoring sugar for the list-family styling hooks (frappe-ui/list),
    // on the spacing scale with variants and arbitrary values:
    // `max-sm:list-gap-3` instead of `max-sm:[--list-gap:0.75rem]`.
    matchUtilities(
      {
        'list-gap': (value) => ({ '--list-gap': value }),
        'list-row-px': (value) => ({ '--list-row-padding-x': value }),
      },
      { values: theme('spacing') },
    )
  },
  {
    theme: {
      colors: colorPalette,
      borderRadius: buildRadiusConfig(),
      boxShadow: buildBoxShadowConfig(),
      container: {
        padding: {
          xl: '5rem',
        },
      },
      fontSize: buildFontSize(),
      screens: screenTokens,
      extend: {
        // `leading-tighter` pins text to 1.15. It is the opt-out for
        // single-line chrome whose height must not move: buttons, badges,
        // labels, table headers. It sits between Tailwind's `leading-none` (1)
        // and `leading-tight` (1.25). Tailwind's `leading-tight` does not change.
        lineHeight: {
          tighter: '1.15',
        },
        textColor: {
          ink: semanticColors.ink,
        },
        backgroundColor: {
          surface: semanticColors.surface,
          'surface-alpha': semanticColors['surface-alpha'],
        },
        gradientColorStops: {
          surface: semanticColors.surface,
          'surface-alpha': semanticColors['surface-alpha'],
          ink: semanticColors.ink,
          outline: semanticColors.outline,
          'outline-alpha': semanticColors['outline-alpha'],
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
          'outline-alpha': semanticColors['outline-alpha'],
        }),
        ringColor: {
          outline: semanticColors.outline,
          'outline-alpha': semanticColors['outline-alpha'],
        },
        divideColor: {
          outline: semanticColors.outline,
          'outline-alpha': semanticColors['outline-alpha'],
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
          // empty <p> = 15px × 1.7 line-height ≈ 25.5px (the user's spacing unit)
          //
          // Base font-size is customizable via `--prose-font-size` (default 15px).
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
                  borderBottom: '1px solid var(--ink-gray-4)',
                  transition: 'border-color 0.08s ease',
                },
                'a:hover': {
                  borderBottom: '1px solid var(--ink-gray-6)',
                },

                // named text color + bold: the color lives on a `textStyle`
                // span that wraps (or is wrapped by) `<strong>`. Typography's
                // `strong { color: var(--tw-prose-bold) }` otherwise overrides
                // the inherited named color, painting bold text gray. Mirror the
                // base preset's `a strong { color: inherit }` so bold keeps the
                // span's color in both nesting orders.
                ':where(span[style*="--prose-color-"]) strong': {
                  color: 'inherit',
                },
                'strong:where([style*="--prose-color-"])': {
                  color: 'inherit',
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
                  paddingInlineStart: '1.7em',
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
