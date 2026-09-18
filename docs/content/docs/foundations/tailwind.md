# Tailwind Setup

`frappe-ui` ships as a Tailwind v3 preset. Add it to your app's
`tailwind.config.js`:

```js
import preset, { content } from 'frappe-ui/tailwind'

export default {
  presets: [preset],
  content: [...content, './src/**/*.{vue,js,ts,jsx,tsx}'],
}
```

The preset sets `darkMode`, the spacing scale, the `prose` / `prose-v3`
typography safelist, and four plugins (`@tailwindcss/forms`,
`@tailwindcss/typography`, the theme plugin, the Lucide icon plugin). Beside the
preset, `frappe-ui/tailwind` exports the `content` glob list, covered below. The
design tokens are a separate entry point,
[`frappe-ui/tailwind/tokens`](#the-token-exports).

Requires **Tailwind `>=3.4.2 <4`**. It is a peer dependency. Tailwind v4 reads
none of this shape, so the design tokens never load there.

## What the preset replaces

Five theme sections are **replaced**, not extended:

| Section        | What you get                                                                      | What you lose                                           |
| -------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `colors`       | the frappe-ui palette (`ink-*`, `surface-*`, `outline-*`, and the raw ramps)      | Tailwind's stock palette (`slate`, `sky`, `emerald`, …) |
| `fontSize`     | the type scale (`text-sm`, `text-base`, `text-lg`, …, at frappe-ui's values)      | Tailwind's sizes and their paired line heights          |
| `screens`      | `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px                                  | `2xl:`                                                  |
| `borderRadius` | the numbered scale (`rounded-4`, `rounded-9`, …)                                  | `rounded-sm` … `rounded-3xl`                            |
| `boxShadow`    | the elevation scale (`shadow-sm` … `shadow-2xl`, each a `--elevation-*` variable) | `shadow-inner`                                          |

A class from a replaced section is simply not generated. `2xl:flex` and
`shadow-inner` compile to nothing, with no error. Everything else (`spacing`,
`textColor`, `backgroundColor`, and the rest) is **extended**, so Tailwind's own
values stay.

## The spacing scale

Every integer from `1` to `128` and every half step from `0.5` to `19.5`, all at
the canonical `0.25rem` step. Stock Tailwind has gaps above `12` (`13`, `15`,
`17`, `18`, `19`, `21`… are undefined), so `h-17` and `size-17` silently do not
compile there.

The scale is declared once. Tailwind 3.4 reads `theme('spacing')` for `width`,
`height`, `size`, `minWidth`, `maxWidth`, `minHeight` and `maxHeight`, so
`w-17`, `min-w-40`, `max-h-52` and `size-3.5` all come from the same numbers.
The list styling hooks read it too: `list-gap-3` and `list-row-px-2.5` take any
spacing key.

## Why you have to list `content` yourself

Tailwind v3 does not merge a preset's `content` into your app's config — it only
reads the top-level `content.files` array. A preset can ship `theme` and
`plugins`, which do merge, but not `content`. This is a Tailwind v3 limitation,
not a choice `frappe-ui` makes.

That means every app consuming `frappe-ui` has to know which of its source
folders emit Tailwind classes and list them itself. Left hand-maintained, that
list drifts: two apps on `frappe-ui@1.0.0-beta` only glob `src/components/**`,
missing `src/molecules/` entirely — every utility class the editor and list
molecules emit never gets compiled into those apps' CSS. The exported list
mirrors this repo's own `tailwind.config.js` `content` array, so the two can't
drift apart from each other either.

## The `content` export

`frappe-ui/tailwind` exports the glob list it needs as `content`, so your
`content` array becomes "the library's globs, plus mine" instead of a
hand-copied path list:

```js
import { content } from 'frappe-ui/tailwind'

console.log(content)
// [
//   '.../frappe-ui/src/**/*.{vue,js,ts,jsx,tsx}',
//   '.../frappe-ui/icons/**/*.{vue,js,ts,jsx,tsx}',
//   '.../frappe-ui/experimental/Accordion/**/*.{vue,js,ts,jsx,tsx}',
//   … one glob per re-exported experimental directory, then vitepress
// ]
```

One rule decides what is listed under `experimental/`: every directory the
`frappe-ui/experimental` barrel re-exports. Today that is `Accordion`,
`Calendar`, `Charts`, `CommandPalette`, `FloatingWindow`,
`ListView`, `MultiEmailInput`, `SpriteIcons`, `TextEditor` and
`ThemeSwitcher`. Importing any of them pulls that directory's classes into
your build, so they have to be scanned. A test derives the list from the
barrel, so the two cannot drift. Directories the barrel does not re-export
stay out, because nothing you can import reaches them.

`vitepress/**` is listed for the same reason on its own subpath: a docs site
built on `frappe-ui/vitepress` has no other way to emit the theme's classes.

The paths are resolved against wherever `frappe-ui` is actually installed
(`node_modules`, a monorepo symlink, a local workspace checkout), so they work
regardless of your app's working directory. When `frappe-ui` adds a new source
directory that emits classes, bumping the dependency picks up the new glob
automatically — you don't need to touch your `tailwind.config.js` again.

## The token exports

`frappe-ui/tailwind/tokens` exports the design tokens as data. Every value is
framework-neutral: a resolved `oklch(...)` colour, a plain px string, a plain
number. No Tailwind sentinel reaches them, so nothing carries `<alpha-value>` or
a `color-mix(...)` wrapper that renders as an empty swatch outside Tailwind.

It is its own entry point, not part of `frappe-ui/tailwind`, because the preset
statically imports `tailwindcss/plugin`, which plain Node does not resolve. That
one import keeps the preset entry inside a bundler. The token module imports
nothing but the four data modules beside it and loads anywhere — a codegen step,
a design tool or a script needs no build setup.

A style picker is the common case. Build the options from
`semanticColors.light`, and point each value at the matching CSS variable. A
themed page then flips the colour, and anything else falls back to the light
value:

```js
import { semanticColors } from 'frappe-ui/tailwind/tokens'

const backgroundOptions = Object.entries(semanticColors.light.surface).map(
  ([name, value]) => ({
    label: name,
    value: `var(--surface-${name}, ${value})`,
  }),
)
// [
//   { label: 'base', value: 'var(--surface-base, oklch(1 0 0))' },
//   { label: 'gray-1', value: 'var(--surface-gray-1, oklch(0.979 0 0))' },
//   … one option per semantic surface
// ]
```

| Export           | Shape                                                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `colors`         | `{ light, dark, overlay, neutral }`. Primitive ramps keyed by step: `colors.light.gray[500]`.                                         |
| `semanticColors` | `{ light, dark }`, each keyed by category (`surface`, `surface-alpha`, `ink`, `outline`, `outline-alpha`) and then by name.           |
| `cssVariables`   | Every token as a custom property, keyed by theme: `light` and `dark`. `dark` holds only the properties that change.                   |
| `radius`         | px per key: `0` to `9`, plus `none` and `full`.                                                                                       |
| `shadows`        | A flat map of composed `box-shadow` strings, keyed like the `shadow-*` utilities: `none`, `sm` … `2xl`, and `DEFAULT`.                |
| `focusRing`      | `{ light, dark }`, each an `outline` shorthand per colour: `'2px solid #c9c9c9e5'`. frappe-ui draws focus as an outline.              |
| `fontSize`       | One object per size: `{ fontSize, lineHeight, letterSpacing, fontWeight }`. `base` is the text family, `p-base` the paragraph family. |
| `fontWeight`     | Numbers. `regular` is 420, not 400.                                                                                                   |
| `fontFamily`     | `{ text: 'Inter Variable' }`.                                                                                                         |
| `tracking`       | Letter-spacing per size and weight, for the `text` and `paragraph` families separately.                                               |
| `spacing`        | The spacing scale above, in rem.                                                                                                      |
| `screens`        | The four breakpoint minimums.                                                                                                         |

`semanticColors` splits by theme because a consumer outside a frappe-ui page has
no `[data-theme]` to resolve against and must pick a side. Inside a themed page,
read the `--<category>-<name>` variables instead. They flip on their own.

`fontSize` entries are objects, not Tailwind's `[size, meta]` tuple. The tuple
is a Tailwind convention and this data does not speak Tailwind. `plugin.js`
converts on the way into the theme.

One type ships with the values: `TextStyle`, the shape of a single `fontSize`
entry. Import it with `import type { TextStyle } from 'frappe-ui/tailwind/tokens'`.

The names are additive-only until 2.0.0: names may be added, none renamed or
removed.

Every key is typed as a literal, so your editor completes the real names and
`semanticColors.light.surface.typo` does not compile. Values stay `string`
(a font weight is a `number`, in `fontWeight` and in each `fontSize` entry),
which keeps a token sync out of your build: it
moves values, never types.

## Where the tokens come from

The committed source is `tailwind/tokens/*.js` (`colors`, `radius`,
`typography`, `effects`) — plain modules, each an `export default` of its data.
They are not JSON, because reading JSON from an ES module needs an import
attribute that the oldest supported config loaders cannot parse.
`yarn sync-tokens` runs `tailwind/tokens/build.js`,
which reads a raw Figma export from a gitignored `.figma-export/` directory and
writes those four files. The raw export is an input, not a record, so it is not
committed. `tailwind/tokens/provenance.json` holds the Figma file id and a
sha256 per input file, which says which export produced the current values.

`tailwind/tokens.d.ts` is generated too, from the token module rather than the
export. `yarn sync-tokens` rewrites it last, off the values it just wrote. An
edit to `tokens.js` that adds or renames a key needs no Figma export: run
`yarn sync-token-types`, which writes that file alone.

`build.js` also holds every rule where frappe-ui overrules the export: the
radius `9` value, the font-weight map, the dropped sizes, and the conversion of
every colour to oklch. Read the values from `tailwind/tokens/*.js`, not from
an export.

## Hover styles

The preset sets `future.hoverOnlyWhenSupported`, so `hover:` compiles under
`@media (hover: hover) and (pointer: fine)` and applies only on a device that
can point at something. Without it a phone applies `:hover` on tap and keeps it
until the next tap lands elsewhere, so a ghost button a thumb touched stayed
filled. A laptop with a touchscreen answers `(hover: hover)` and keeps both.

That leaves a rule for anything shown only on hover: it needs a touch path,
because the sticky tap-hover was the only route a phone ever had to it. Either a
tap already reaches what the reveal is for — tapping a sortable header sorts it
and its glyph appears, tapping a playing video pauses it and its controls appear
— or the device that cannot hover shows it outright:

```html
<button
  class="opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
></button>
```

Do not stand a breakpoint in for hover:
`sm:opacity-0 sm:group-hover:opacity-100` hides the control from a tablet and
shows it to a narrow desktop window, and neither is the device the rule is
about.
