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

The preset sets `darkMode`, the integer spacing scale (`1`–`64`, filling the
gaps in Tailwind's default scale), the `prose` / `prose-v3` typography
safelist, and four plugins (`@tailwindcss/forms`, `@tailwindcss/typography`,
the theme plugin, the Lucide icon plugin). That's the whole exported surface —
a default export (the preset) and the named `content` export below.

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
// ]
```

The rest of `experimental/` is not covered — it carries no stability promise.
`SpriteIcons` is the one exception: it holds a previously supported surface
(`Icon`, `IconPicker`, `spritePlugin`, moved out of `frappe-ui/icons`), so its
classes stay compiled until it is removed.

The paths are resolved against wherever `frappe-ui` is actually installed
(`node_modules`, a monorepo symlink, a local workspace checkout), so they work
regardless of your app's working directory. When `frappe-ui` adds a new
source directory that emits classes, bumping the dependency picks up the new
glob automatically — you don't need to touch your `tailwind.config.js` again.
