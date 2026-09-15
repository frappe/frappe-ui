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
`@tailwindcss/typography`, the theme plugin, the Lucide icon plugin). That's
the whole exported surface — a default export (the preset) and the named
`content` export below.

Requires **Tailwind `>=3.4.0 <4`**. It is a peer dependency. Tailwind v4 reads
none of this shape, so the design tokens never load there.

## What the preset replaces

Five theme sections are **replaced**, not extended:

| Section | What you get | What you lose |
| --- | --- | --- |
| `colors` | the frappe-ui palette (`ink-*`, `surface-*`, `outline-*`, and the raw ramps) | Tailwind's stock palette (`slate`, `sky`, `emerald`, …) |
| `fontSize` | the type scale (`text-sm`, `text-base`, `text-lg`, …, at frappe-ui's values) | Tailwind's sizes and their paired line heights |
| `screens` | `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px | `2xl:` |
| `borderRadius` | the numbered scale (`rounded-4`, `rounded-9`, …) | `rounded-sm` … `rounded-3xl` |
| `boxShadow` | the elevation scale (`shadow-sm` … `shadow-2xl`, each a `--elevation-*` variable) | `shadow-inner` |

A class from a replaced section is simply not generated. `2xl:flex` and
`shadow-inner` compile to nothing, with no error. Everything else (`spacing`,
`textColor`, `backgroundColor`, and the rest) is **extended**, so Tailwind's
own values stay.

## The spacing scale

Every integer from `1` to `128` and every half step from `0.5` to `19.5`, all
at the canonical `0.25rem` step. Stock Tailwind has gaps above `12` (`13`,
`15`, `17`, `18`, `19`, `21`… are undefined), so `h-17` and `size-17` silently
do not compile there.

The scale is declared once. Tailwind 3.4 reads `theme('spacing')` for `width`,
`height`, `size`, `minWidth`, `maxWidth`, `minHeight` and `maxHeight`, so
`w-17`, `min-w-40`, `max-h-52` and `size-3.5` all come from the same numbers.
The list styling hooks read it too: `list-gap-3` and `list-row-px-2.5` take
any spacing key.

## Why you have to list `content` yourself

Tailwind v3 does not merge a preset's `content` into your app's config — it
only reads the top-level `content.files` array. A preset can ship `theme` and
`plugins`, which do merge, but not `content`. This is a Tailwind v3
limitation, not a choice `frappe-ui` makes.

That means every app consuming `frappe-ui` has to know which of its source
folders emit Tailwind classes and list them itself. Left hand-maintained, that
list drifts: two apps on `frappe-ui@1.0.0-beta` only glob
`src/components/**`, missing `src/molecules/` entirely — every utility class
the editor and list molecules emit never gets compiled into those apps' CSS.
The exported list mirrors this repo's own `tailwind.config.js` `content`
array, so the two can't drift apart from each other either.

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
//   '.../frappe-ui/experimental/SpriteIcons/**/*.{vue,js,ts,jsx,tsx}',
//   … one glob per parked family
// ]
```

The rest of `experimental/` is not covered — it carries no stability promise.
The exceptions are the parked families: surfaces that were supported at the
root and now live in `experimental/` while apps migrate (`SpriteIcons`,
`TextEditor`, `Calendar`, `Charts`, `CommandPalette`, `FloatingWindow`). Their
classes stay compiled until they are removed.

The paths are resolved against wherever `frappe-ui` is actually installed
(`node_modules`, a monorepo symlink, a local workspace checkout), so they work
regardless of your app's working directory. When `frappe-ui` adds a new
source directory that emits classes, bumping the dependency picks up the new
glob automatically — you don't need to touch your `tailwind.config.js` again.
