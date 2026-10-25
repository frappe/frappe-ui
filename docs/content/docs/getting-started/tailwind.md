# Tailwind Setup

frappe-ui comes with a Tailwind CSS v3 preset. It gives your app the same
colors, type, spacing and icons as the components. It doesn't work with
Tailwind CSS v4.

```js
import preset, { content } from 'frappe-ui/tailwind'

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset],
  content: [...content, './index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
}
```

The preset turns on dark mode with `data-theme="dark"`, and adds the forms,
typography and Lucide icon plugins.

## What the preset replaces

Five parts of the theme are replaced, not extended. Classes from the stock
Tailwind versions of these compile to nothing, with no error.

| Section        | You get                                                  | You lose                                   |
| -------------- | -------------------------------------------------------- | ------------------------------------------ |
| `colors`       | frappe-ui colors: `ink-*`, `surface-*`, `outline-*`      | Tailwind's palette: `slate`, `sky`, …      |
| `fontSize`     | frappe-ui's type scale, with the same names               | Tailwind's sizes and line heights          |
| `screens`      | `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px         | `2xl:`                                     |
| `borderRadius` | A numbered scale: `rounded-4`, `rounded-9`, …            | `rounded-sm` to `rounded-3xl`              |
| `boxShadow`    | Elevation: `shadow-sm` to `shadow-2xl`                   | `shadow-inner`                             |

Everything else, like spacing and text color, is extended. Tailwind's own values
still work.

## Spacing

Every whole step from `1` to `128`, and every half step from `0.5` to `19.5`,
at `0.25rem` each. Stock Tailwind skips some numbers above `12`, such as `13`,
`15` and `17`. Here `h-17` works.

Widths, heights and sizes use the same scale, so `w-17`, `min-w-40`, `max-h-52`
and `size-3.5` all work. So do the list spacing classes, like `list-gap-3`.

## Content paths

Tailwind only generates the classes it finds in the files you list in
`content`. frappe-ui's classes are in its own files, so they need to be in that
list too.

Tailwind v3 ignores `content` inside a preset, so frappe-ui exports its paths
for you to spread in:

```js
content: [...content, './index.html', './src/**/*.{vue,js,ts,jsx,tsx}']
```

Leave this out and frappe-ui's components render without styles.

The paths point to wherever frappe-ui is installed, so they work in a monorepo
or a linked checkout too. When a new version adds folders, updating frappe-ui
picks them up. You don't need to edit your config.

## Hover styles

`hover:` styles apply only on devices with a mouse or trackpad. Otherwise a
phone would keep a button in its hover state after a tap.

Anything that appears only on hover needs another way in on touch screens. Show
it on devices that can't hover:

```html
<button
  class="opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
></button>
```

Don't use a breakpoint for this. `sm:opacity-0` hides the control on a tablet
and shows it in a narrow desktop window, which is the opposite of what you want.

## Design tokens

`frappe-ui/tailwind/tokens` exports the design tokens as plain data. Use it
where Tailwind isn't available, such as a script, a design tool or a style
picker. Colors are `oklch(...)` strings, radii are px strings, and weights are
numbers.

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
//   …
// ]
```

Pointing each value at its CSS variable lets it change with the theme, and fall
back to the light value outside a frappe-ui page.

| Export           | What it has                                                                         |
| ---------------- | ----------------------------------------------------------------------------------- |
| `colors`         | The color ramps, by theme: `colors.light.gray[500]`                                 |
| `semanticColors` | `surface`, `ink`, `outline` and their alpha versions, by theme: `light` and `dark`  |
| `cssVariables`   | Every token as a CSS variable. `light` goes on `:root`, `dark` on `[data-theme="dark"]` |
| `radius`         | px values for `0` to `9`, `none` and `full`                                         |
| `shadows`        | `box-shadow` values, named like the `shadow-*` classes                              |
| `focusRing`      | The focus outline, by theme: `'2px solid #c9c9c9e5'`                                |
| `fontSize`       | Each size as `{ fontSize, lineHeight, letterSpacing, fontWeight }`                  |
| `fontWeight`     | Weights as numbers. `regular` is 420, not 400                                       |
| `fontFamily`     | `{ text: 'Inter Variable' }`                                                        |
| `tracking`       | Letter spacing per size and weight                                                  |
| `spacing`        | The spacing scale, in rem                                                           |
| `screens`        | The four breakpoints                                                                |

Every key is typed, so your editor suggests the real names and a typo doesn't
compile. The `TextStyle` type describes one `fontSize` entry:

```ts
import type { TextStyle } from 'frappe-ui/tailwind/tokens'
```

Until 2.0, token names are only added, never renamed or removed.

## Updating the tokens

This section is for frappe-ui maintainers. The tokens come from Figma and live
in `tailwind/tokens/*.js`. To update them, put a Figma export in
`.figma-export/` and run `yarn sync-tokens`. It rewrites the token files and
their types, and records which export it used in
`tailwind/tokens/provenance.json`.

Any value where frappe-ui differs from Figma is set in `tailwind/tokens/build.js`.
If you only add or rename a key by hand, run `yarn sync-token-types` to update
the types.
