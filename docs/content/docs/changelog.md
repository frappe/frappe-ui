---
outline: [2, 4]
---

# Frappe UI v1 Changelog

This page lists the v1 changes that affect apps. The **Unreleased** section
lists every change since **v0.1.278**. It records breaking changes,
deprecations, behavior changes you can see, and migration steps. It does not
record internal refactors or new tests.

A deprecated API keeps working through v1.x and logs a one-time warning in
development, unless the entry says otherwise. Deprecated APIs are removed after
v1. This rule does not cover members deprecated during the betas. Under
[ADR-0008](https://github.com/frappe/frappe-ui/blob/main/spec/adr/0008-no-deprecated-members-in-1-0-0.md)
(no deprecated member ships in `1.0.0`), each of them was removed before
`1.0.0`, or moved to `frappe-ui/experimental`, which has no stability promise.
`ThemeSwitcher` and the v0 `TextEditor` took the second path. Each entry says
which, and the [Deprecation log](#deprecation-log) lists them.

## How to read an entry

Each entry says what changed, what to do, and where the
[migration guide](/docs/migration) covers it. The tag in the heading says how
the change reaches your app:

| Tag | What it means for your app |
| --- | --- |
| **breaking, loud** | The build, the type-check or the import fails, so the tools show you every place to change. |
| **breaking, silent** | Old code still compiles and runs, but it behaves differently. Nothing fails. Search your code for the old names. The migration guide usually has a before/after for these. |
| **breaking; loud in TS, silent in JS** | TypeScript reports the change. JavaScript call sites, and values bound at runtime, do not. |
| **breaking** | The entry lists which parts are loud and which are silent. |
| **fix**, **additive** | Nothing to change, unless you depended on the old behavior. |

Entries are grouped by area. Inside each area, they keep the order they had in the single list this page used before.

## Unreleased

- [Packaging and setup](#packaging-and-setup)
- [Tailwind preset and design tokens](#tailwind-preset-and-design-tokens)
- [Data fetching, HTTP and the `FrappeUI` plugin](#data-fetching-http-and-the-frappeui-plugin)
- [Uploads and FileUploader](#uploads-and-fileuploader)
- [Inputs and forms](#inputs-and-forms)
- [Date and time pickers](#date-and-time-pickers)
- [Select, Combobox, MultiSelect and Dropdown](#select-combobox-multiselect-and-dropdown)
- [Dialog, Popover, Tooltip, HoverCard and Toast](#dialog-popover-tooltip-hovercard-and-toast)
- [Sidebar, tabs and navigation](#sidebar-tabs-and-navigation)
- [App shell, page header and color scheme](#app-shell-page-header-and-color-scheme)
- [Keyboard shortcuts](#keyboard-shortcuts)
- [Other components](#other-components)
- [Lists](#lists)
- [Editor](#editor)
- [Code editor](#code-editor)
- [Charts](#charts)
- [Calendar](#calendar)

### Packaging and setup

#### `npm create frappe-ui` sets up a new app (additive) {#npm-create-frappe-ui-sets-up-a-new-app}

`npm create frappe-ui@latest` creates a frappe-ui project with Vue, TypeScript,
Vite and Tailwind CSS. Run it from `apps/<app>` for the frontend of a Frappe
app, or anywhere else for a plain Vite app. In a Frappe app it also adds:

- the page that serves the frontend
- the route rule in `hooks.py`
- the scripts in the app's `package.json` that let bench build it
- the build output to `.gitignore`

It lists these changes and asks before it writes them.

#### Package contract: peers, dependencies and the tarball (breaking)

The package now declares what it needs, ships less, and resolves its own
imports for your type-checker.

- **`tailwindcss` is a peer dependency, pinned to `>=3.4.2 <4`.** 3.4 is the
  first version that derives the sizing families from `theme('spacing')`, and
  the preset depends on that. Tailwind v4 does not read the JavaScript config
  the preset is written in. The install now fails, instead of half-working at
  build time. The floor is 3.4.2, not 3.4.0: the preset uses
  `import.meta.url`, and the config loader in 3.4.0 and 3.4.1 cannot transform
  it, so the config fails to load with a `SyntaxError`.
- **`vite` and `vitepress` are optional peers**, together with `shiki`,
  `@shikijs/transformers` and `@vue/compiler-dom`, which `frappe-ui/vitepress`
  imports. An app that never imports `frappe-ui/vite` or `frappe-ui/vitepress`
  installs none of them.
- **`@floating-ui/vue` is now a direct dependency**, not a transitive install.
  So are the five `@codemirror/*` packages and `@lezer/highlight` that the
  CodeEditor imports. They resolved before only because another package
  happened to install them.
- **Removed from `dependencies`:** `@tailwindcss/line-clamp` (in Tailwind core
  since 3.3), `prosemirror-tables`, `ora`, `slugify`, and the
  `@tiptap/extension-{bubble-menu,color,highlight,image,mention,node-range}`
  packages. The shipped code imports none of them. `prettier` moved to
  `devDependencies`.
- **The `frappe-ui/src/utils/tailwind.config` shim is deleted.** The `exports`
  map already refused that path, so an app still on it fails with
  `Package subpath '…' is not defined`. Now the file is gone too. Nothing under
  `frappe-ui/src/...` resolves, because the map has no wildcard.
- **`frappe-ui/tailwind`, `frappe-ui/icons` and
  `frappe-ui/vite/lucideIconsPlugin` now carry a `types` condition.** The
  preset's type declaration says which Tailwind sections it replaces.
- **`frappe-ui/style.css` also resolves under the `style` condition**
  (additive). Tailwind v4 looks up package CSS with that condition. The export
  listed only `import`, so `@import "frappe-ui/style.css"` failed with
  `not exported under the condition "style"`. Both conditions point at the same
  file, and the file is unchanged.
- **The tarball ships no tests.** `*.test.*`, `*.spec.ts`, `*.cy.ts`,
  `*.story.vue`, `*.playground.vue`, `stories/` and `src/mocks` are excluded.
  The tarball went from 1449 files to 934, and the 520 test, story,
  playground, mock and helper files it carried went to none.
- **Fix: the internal `#` imports resolve for your app.** The package ships
  TypeScript source, so your compiler resolves these imports through the
  `imports` map. A type-check of an app that imports `frappe-ui/editor` used to
  report 136 unresolved modules. It now reports none.

**What to do:** import the preset from `frappe-ui/tailwind`. Run
`npx -p frappe-ui packaging-v1 .` from your app's root to fix the preset path.
Point it at the root, not `./src`: the preset is imported in
`tailwind.config.js`, which sits outside `src`. The
[packaging migration guide](/docs/migration#packaging-and-tokens) lists the
manual steps.

#### `frappe-ui/vite`: `lucideIcons` is off by default (breaking, loud at build time)

`frappeui()` no longer installs `unplugin-icons`, `unplugin-auto-import` and
`unplugin-vue-components`. frappe-ui draws its own icons as CSS mask classes
(`lucide-check`), so the library needs none of them. Before this change, every
app ran three extra plugins over every file it built.

If your own code writes `<LucideCheck />` or imports `~icons/lucide/*`, you
need the option. Without it, Vite fails the import with
`Failed to resolve import "~icons/lucide/check"`, and a `<LucideCheck />` tag
renders as an unknown element with a Vue warning.

**What to do:** pass `lucideIcons: true`.

```js
frappeui({ lucideIcons: true })
```

`npx -p frappe-ui packaging-v1 .` adds the option when it finds either form in
the folder you point it at. When it cannot tell, it reports the plugin call.

#### Root exports — `FrappeUIError` removed, `InputLabelingProps` and `RouteDestination` added (breaking, loud)

- **`FrappeUIError` is removed** from `frappe-ui` and from
  `frappe-ui/experimental`. An input's `error` prop is typed where it is
  declared. To forward it, use `InputLabelingProps['error']`, which the root
  now exports. The prop accepts everything it accepted before.
- **`RouteDestination` and `RouteLocationObject` are exported.** Every prop
  that takes a router destination is typed with them, instead of vue-router's
  `RouteLocationRaw`. The accepted values are the same. The generated API docs
  can now print the name.
- `dayjs` and `dayjsLocal` stay exported and public. `dayjsSystem` stays
  internal.

#### `frappe-ui/resources` and `frappe-ui/editor` — named exports (breaking, loud)

Both entry files used `export *` from implementation files, so they published
whatever those files exported next. Each now lists its exports by name, and a
test fails when the lists drift apart. Every name that apps import is still
there.

#### `frappe-ui/vite` — types and docs (additive) {#frappe-ui-vite-—-types-and-docs}

`frappe-ui/vite` now ships hand-written types (`vite/index.d.ts`, wired through
the `types` export condition). `frappeui(...)` and its options
(`frontendRoute`, `lucideIcons`, `barrelImports`, `frappeProxy`,
`jinjaBootData`, `buildConfig`, `frappeTypes`) are typed, so you no longer need
a `// @ts-expect-error`. A new [docs page](/docs/other/vite) covers every
sub-plugin, including `barrelImports`, which had no docs before.

#### list-style.css and editor-style.css exports — removed (breaking, loud) {#list-style-css-and-editor-style-css-exports-—-removed}

The manual `frappe-ui/list-style.css` and `frappe-ui/editor-style.css` exports
are gone. The build fails with `Missing "./list-style.css" specifier`.

They existed only because bundlers tree-shook the side-effect
`import './style.css'` inside the `frappe-ui/list` and `frappe-ui/editor`
entry files. This was never specific to Rolldown: plain Rollup and Vite
production builds dropped the CSS too. Those entry files are now listed in
`sideEffects`, so each family's CSS ships as soon as you import anything from
its subpath.

**What to do:** delete the manual `@import` lines.

#### Node.js requirement (breaking) {#node-js-requirement}

The minimum Node version is now `>=20.19.0`. It was Node 18 on 0.1.x. It is
declared in `package.json` `engines`, so installers and CI show the requirement,
instead of unclear engine errors from dependencies.

#### `experimental` entry — tidied, and `FrappeUIError` (breaking) {#experimental-barrel-—-tidy-and-frappeuierror}

- **Breaking:** `LabelingWrapper` is no longer exported from
  `frappe-ui/experimental`. It stays exported from its own entry file
  (`src/components/InputLabeling`), where `Combobox`, `Select`, `MultiSelect`
  and `MultiEmailInput` import it internally. Only the `experimental`
  re-export had zero outside importers, so only that goes. It is the only
  member removed in this tidy-up.
- `FrappeUIError` was exported from `frappe-ui/experimental` as a type during
  the betas. It is removed again before `1.0.0`; see
  [the root exports entry](#root-exports-—-frappeuierror-removed-inputlabelingprops-and-routedestination-added-breaking-loud).
  Type a forwarded `error` prop with `InputLabelingProps['error']`.

#### `tsconfig.base.json` — cleaned up (breaking for extenders)

**Breaking:** `tsconfig.base.json` no longer sets `types` (`vitest/globals`,
`unplugin-icons/types/vue`, `node`). If your app extends this file and relies on
any of these globals, `tsc` fails with a missing-global error (for example
`Cannot find name 'vi'`) the first time the code uses a global that came from
`vitest/globals` or `unplugin-icons/types/vue`.

`noEmit` stays, because `allowImportingTsExtensions` is only legal with it. The
`declaration` / `emitDeclarationOnly` pair is gone: it contradicted `noEmit`,
and frappe-ui's own build did not use it.

**What to do:** add `types` to your own `tsconfig.json`.

#### `./hljs-theme.css` export removed (breaking) {#hljs-theme-css-export-removed}

**Breaking:** `frappe-ui/hljs-theme.css` is no longer exported. It had zero
importers. The file behind it (`experimental/TextEditor/hljs-github.css`) ships
until the deprecated `TextEditor` is removed.

#### `frappe` and `drive` subpaths — removed (breaking)

frappe-ui is a plain UI library, so framework-specific code moves out. This was
decided in #867, and the code moved in frappe/frappe#41671.

- **Breaking:** `frappe-ui/frappe` is removed and the `frappe/` directory is
  deleted. `useTelemetry`, `telemetryPlugin`, `useOnboarding`,
  `GettingStartedBanner`, `IntermediateStepModal`, `HelpModal`,
  `showHelpModal`, `minimize`, `TrialBanner`, `SignupBanner`, `DataImport`,
  `Link`, `Filter` and `LinkProps` now live in `@framework/ui`. The `Link` and
  `Filter` there do more than the old ones. `Link` adds the
  `redirectable`/`editable` props and the `redirect`/`edit` emits. `Filter`
  adds `useFilters`, `parseFilters`/`serializeFilters` and an operator
  registry.
- **Breaking:** `OnboardingSteps`, `HelpCenter` and `showHelpCenter` are
  removed with no standalone replacement. They had zero call sites across all
  consumer apps. They still power `HelpModal` inside `@framework/ui`.
- **Breaking:** `frappe-ui/drive` and `frappe-ui/drive/*` are removed with no
  replacement. No app imported them. The drive app owns the live copy of all
  six components.
- The `content` export from `frappe-ui/tailwind` and the docs no longer list a
  `frappe/**` glob.

**What to do:** import these from `@framework/ui`. If your
`tailwind.config.js` lists `node_modules/frappe-ui/frappe/**` by hand, delete
that line.

### Tailwind preset and design tokens

#### Typography — `text-*` line height is 1.35 (breaking, silent)

The tight text styles, `text-2xs` to `text-4xl` and their `-medium`,
`-semibold` and `-bold` variants, move from line height 1.15 to 1.35. At 14px,
one line of `text-base` is now 18.9px, not 16.1px. Text that wraps now has room
between its lines. The `text-p-*` styles, and `text-5xl` and up, do not change.

`leading-tighter` is a new class that sets 1.15. Use it to keep the old box:
`text-base leading-tighter` is the old 1.15. `leading-tight` keeps Tailwind's
1.25.

- **frappe-ui components keep their height.** Their single-line label text
  carries `leading-tighter`: Button, Badge, Breadcrumbs, the input, the Select,
  Combobox and MultiSelect triggers, menu items and group labels, picker cells,
  `FormLabel`, `InputLabel`, `ItemListRow`, `MobileNavItem`, the `SettingsRow`
  title, Sidebar, Tree items, tabs and the list header. A bare `Switch` no
  longer takes its height from the parent's line height.
- **Who is affected:** app code with single-line text in a tight style. A
  fixed-height box can clip its text or push it off-centre. Repeated rows grow
  by 2.4 to 5px each: menus, kanban cards, timelines, search results, tree rows.
  Text does not re-wrap, because line height does not move line breaks.

**What to do:** add `leading-tighter` to single-line UI text in a fixed-height
box. Use `text-p-*` for long prose. See the
[migration guide](/docs/migration#line-height).

#### Tailwind preset — the design tokens are exported as data

`frappe-ui/tailwind/tokens` exports the tokens by name: `colors`,
`cssVariables`, `focusRing`, `fontFamily`, `fontSize`, `fontWeight`, `radius`,
`screens`, `semanticColors`, `shadows`, `spacing` and `tracking`. One type ships
with them: `TextStyle`, the shape of one `fontSize` entry.

Every value works without Tailwind: a resolved `oklch(...)` colour, a plain px
string, a plain number. No value carries a Tailwind placeholder, so no
`<alpha-value>` and no `color-mix(...)` reaches code that wants a value rather
than a class. Tailwind-only shaping stays in `colorPalette.js` and `plugin.js`.

The tokens get their own subpath because `frappe-ui/tailwind` imports
`tailwindcss/plugin` at the top level, and plain Node does not resolve it. So
the preset entry only works inside a bundler. The token module imports nothing
but the four data modules next to it, and it loads anywhere. Per ADR-0010,
build-time entries are additive-only until `2.0.0`: a new one can be added, but
none can be renamed or removed. So a second entry is allowed, and neither one
may be renamed.

- `semanticColors` is `{ light, dark }` with resolved values, keyed by category
  (`surface`, `surface-alpha`, `ink`, `outline`, `outline-alpha`).
- `fontSize` entries are objects `{ fontSize, lineHeight, letterSpacing,
  fontWeight }`, not Tailwind's `[size, meta]` tuple. Both families ship:
  `base` for text, `p-base` for paragraph.
- `shadows` is a flat map of complete `box-shadow` strings, keyed like the
  `shadow-*` utilities: `none`, `sm` through `2xl`, and `DEFAULT`. Only the
  light elevation ramp ships, because both themes render that one.
- `focusRing` is `{ light, dark }` and holds `outline` shorthands, not
  box-shadows. frappe-ui draws focus with `outline` (ADR-0005).
- `cssVariables` is keyed by theme: `light` goes on `:root`, `dark` on
  `[data-theme="dark"]`. `dark` gives new values to the semantic and focus
  properties, and adds the dark ramps under `--dark-*` names. The light ramps,
  elevation and radius are in `light` only, because they do not change with the
  theme.
- Keys are typed literally, so a wrong key does not compile and your editor
  completes the real names. Values stay `string`, or `number` for a font
  weight, so a token sync changes values and never a type. A font weight is a
  number in both places: `fontSize.base.fontWeight === fontWeight.regular`.

This is additive. It replaces the removed `tailwind/tokens.js`, but the names
and shapes differ from that module. The
[migration guide](/docs/migration#hljs-theme-css-and-tailwind-tokens-js-removed)
gives the before and after, and
[Tailwind Setup](/docs/getting-started/tailwind#design-tokens) documents each
export.

#### Tailwind tokens — one committed source, no vendored Figma export

The token files moved. `tailwind/generated/*.json` is now
`tailwind/tokens/*.js` (`colors`, `radius`, `typography`, `effects`), and those
four files are the one source for the tokens. The importer
`tailwind/figma-tokens-to-theme.js` is now `tailwind/tokens/build.js`. It still
runs through `yarn sync-tokens`.

One token value changed, and only its type. Each `fontSize` entry now carries
the number `420` for `fontWeight`, where it carried the string `"420"` before.
`fontWeight.regular` was already a number, so
`fontSize.base.fontWeight === fontWeight.regular` is now true. The resolved
preset theme carries the number too: `theme.fontSize.base[1].fontWeight` is
`420`, not `'420'`. Tailwind writes `font-weight: 420` from either, so the
compiled CSS is byte-identical. Every other value is unchanged.

No package export pointed at any of these paths, so nothing you can import
moves. A fork, or a script that reads the files from `node_modules` by path,
needs the new path and the new extension.

- **`tailwind/colors.json` is deleted.** It was byte-identical to the generated
  copy. A hand-edit to it took effect in the build, and the next sync silently
  undid it.
- **`espresso-v2-design-tokens/` is deleted.** This raw Figma export never
  shipped (it was not in `files`). It changed six times in four months, and
  four of its ten files were never read. It also does not describe what
  frappe-ui uses: `build.js` overrides the radius `9` value, overrules a
  corrupt font-weight column, drops five sizes, and converts every colour to
  oklch. The export is an input, so it now goes in a gitignored
  `.figma-export/` folder that the person running the sync fills.
- **`tailwind/tokens/provenance.json` is new.** It holds the Figma file id and
  a sha256 per input file. This records which export produced the committed
  values.
- **The four token files are JS modules, not JSON.** They are
  `tailwind/tokens/*.js`. Each is an `export default` of the same data under a
  generated-file header. Reading JSON from an ES module needs an import
  attribute (`with { type: 'json' }`), and the oldest config loaders in the
  supported peer range cannot parse one. Your `tailwind.config.js` reaches this
  data through the preset, so the attribute is gone. Values are unchanged.

A script that reads `tailwind/generated/*.json` or `tailwind/colors.json` out of
`node_modules` by path has no file to read. Raven, wiki and the LMS tests read
by path today.

**What to do:** import the values instead:
`import { semanticColors } from 'frappe-ui/tailwind/tokens'`.

To re-sync the tokens: export into `.figma-export/`, run `yarn sync-tokens`,
review the diff on `tailwind/tokens/*.js`, and commit.

#### Tailwind preset — `hover:` applies only where hovering is possible

The preset sets `future.hoverOnlyWhenSupported`, so every `hover:` utility
compiles under `@media (hover: hover) and (pointer: fine)`. A phone applied
`:hover` on tap and kept it until the next tap landed somewhere else, so every
ghost button a thumb touched stayed filled.

- **Behavior change:** touch screens no longer show hover styles at all. This
  applies to your app's own `hover:` classes too, not only the library's.
- Anything shown *only* on hover, such as `opacity-0 group-hover:opacity-100`
  or a `hidden` that hover undoes, is now unreachable on touch unless a tap also
  reaches it.

**What to do:** give such controls a touch path. Add
`[@media(hover:none)]:opacity-100` so a device that cannot hover shows them all
the time, as the library's own editor controls now do. See
[Tailwind setup](/docs/getting-started/tailwind#hover-styles).

#### Tailwind preset: one sizing scale, one focus ring form (breaking)

- **Spacing is declared once and every sizing family reads it.** The scale is
  the integers 1 to 128 and the half steps 0.5 to 19.5, all `n * 0.25rem`.
  Tailwind 3.4 reads `theme('spacing')` for `width`, `height`, `size`,
  `minWidth`, `maxWidth` and `minHeight`. So `p-4.5`, `w-112`, `h-13`,
  `max-h-52` and `gap-7.5` now exist because the scale has them, not because
  someone added that one value. The plugin's hand-written `spacing`, `width`,
  `height`, `minWidth` and `maxHeight` blocks are deleted. Two classes change:
  - `w-wizard` (650px, named after an app screen) is removed. Use `w-[650px]`.
  - `min-w-50` follows the scale, so it is 12.5rem instead of 18rem. Use
    `min-w-[18rem]` to keep the old size.
- **The `--focus-<name>` box-shadow variables are removed.** Keep
  `--focus-outline-<name>` and apply it as an outline:
  `outline: var(--focus-outline-default)`. The names are `default`, `red`,
  `green`, `amber`, `blue` and `violet`. There is one form: 2px in light mode
  and 3px in dark. A ring no longer changes the element's size.
- **`rounded-9` is 100px**, not 999px. It is the pill radius for large
  surfaces. `rounded-full` (9999px) is still the circle.
- **Documented, not changed:** the preset replaces Tailwind's `colors`,
  `fontSize`, `screens`, `borderRadius` and `boxShadow` sections. Stock classes
  from those five sections (`text-base` at Tailwind's own size, `2xl:`,
  `shadow-inner`) are not generated. Alpha token names are unchanged: `alpha`
  stays a suffix on the group key (`bg-gray-alpha-100`,
  `bg-surface-alpha-gray-2`).
- `frappe-ui/tailwind` exports `content`, the source globs that produce classes
  inside the package. `experimental/FloatingWindow` and `vitepress` are now in
  that list. Without the `vitepress` glob, a docs site on `frappe-ui/vitepress`
  never gets the theme's own layout classes.

#### Radius aliases and `text-*-black` styles removed (breaking, silent)

Per ADR-0006 and ADR-0008 (#998, decided in #993):

- The named radius aliases (`rounded`, `rounded-sm`, `rounded-md`,
  `rounded-lg`, `rounded-xl`, `rounded-2xl`, and their directional forms) are
  removed. The numbered tokens are the only radius names. The px values are
  identical:

  | Removed | Use |
  | --- | --- |
  | `rounded` | `rounded-4` |
  | `rounded-sm` | `rounded-1` |
  | `rounded-md` | `rounded-5` |
  | `rounded-lg` | `rounded-6` |
  | `rounded-xl` | `rounded-7` |
  | `rounded-2xl` | `rounded-8` |

  `rounded-none` and `rounded-full` stay. **Silent break:** the preset replaces
  Tailwind's scale, so an alias you did not migrate produces no CSS. You get
  square corners and no build error.
- The `text-<size>-black` and `text-p-<size>-black` style classes are removed.
  They had zero usage, and the Figma black weights were corrupt export data.
  This is also a silent break.

**What to do:** run the `tokens-v2` codemod. It now does these renames. It is
safe to run more than once, and it runs in every mode. It rewrites a bare
`rounded` only inside quoted strings and `@apply` rules, so search for
leftovers. For `font-extrabold` / `font-black` next to a text size, the codemod
reports the site instead of merging it onto the removed class.

#### Tailwind preset — `content` export added (additive) {#tailwind-preset-—-content-export-added}

`frappe-ui/tailwind` exports `content`, the list of globs for the frappe-ui
source folders that produce Tailwind classes. Tailwind v3 does not merge a
preset's `content`, so apps had to maintain these paths by hand. They had
already drifted: some apps on `frappe-ui@1.0.0-beta` glob `src/components/**`
only, which silently drops every class that the editor and list components
produce.

**What to do:** spread `content` into the `content` array of your app's
`tailwind.config.js`, instead of maintaining the paths by hand. See the new
[Tailwind Setup](/docs/getting-started/tailwind) docs page.

#### Tailwind preset — `tokens.js` export removed (breaking)

The `./tailwind/tokens.js` export is removed outright, with no deprecation
period. It re-exported `colorPalette.js` through `export *`. The library does
not allow `export *` from an implementation module.

This ships before the `1.0.0` tag, while the library can still change freely. The rule that requires a deprecation period starts at the tag.

**Correction.** This entry used to say the export had zero importers anywhere.
That was wrong. `frappe/studio` imports it at
`frontend/src/utils/espressoTokens.ts`. A code search across `org:frappe` finds
Studio as the only consumer, and Studio pins `frappe-ui@1.0.0-beta.25`, so the
break has not reached it. The advice to use the preset directly was also wrong:
the preset is a Tailwind `Config` and carries no readable values. The subpath
is back as `frappe-ui/tailwind/tokens`, without the `.js` and in a new shape.

**What to do:** import from `frappe-ui/tailwind/tokens`. See
[the design tokens entry](#tailwind-preset-—-the-design-tokens-are-exported-as-data)
and the
[migration guide](/docs/migration#hljs-theme-css-and-tailwind-tokens-js-removed).

#### Tailwind preset — unused token vocabulary and utilities removed (breaking)

This is the design-token audit before the additive-only token freeze (#940). Every family
in `tailwind/generated/*.json`, and every utility and `--*` variable that
`plugin.js` produces, was checked against frappe-ui's own source, docs and
stories. It was also checked against a new survey of all consumer apps (crm,
helpdesk, gameplan, insights, builder, suite, central, frappe_calendar,
frappe-ui-starter, and frappe's `ui/` package).

These are in use and are not touched: the primitive and semantic color ramps
(all twelve hues, in `surface-*`/`ink-*`/`outline-*`), every typography weight
(including `bold`/`black`), and every size through `text-12xl`.

These had zero call sites anywhere, and are removed:

- **`text-tiny`** and its uppercase text-transform. Even the docs' own
  type-scale page did not show it.
- **`text-13xl` through `text-16xl`** (and their `-medium`/`-semibold`/
  `-bold`/`-black` variants). The docs' own "display sizes" showcase stops at
  `text-12xl`. Even the type-scale demo did not use these four sizes.
- **`shadow-status`** and its `--elevation-status` variable. It was named once
  in the text of the elevation docs page, but never rendered there or anywhere
  else.
- **`surface-alert-button-*` / `ink-alert-button-*`** (`default`, `info`,
  `success`, `warning`, `error`). `Alert`'s buttons get their color from the
  shared `variant` + `theme` props. This Figma spec was never wired to
  code.
- **`surface-alpha-gray-2-overlay`**. It resolved to the black/white overlay
  ramp rather than the gray-alpha ramp its name implies. That broke the
  `{family}-{step}` pattern every other `surface-alpha` entry follows.

All five are silent breaks. A missing Tailwind class or `--*` variable stops
applying, with no build or type error. See the
[migration guide](/docs/migration#unused-tokens-and-utilities-removed).

The token generator (`tailwind/figma-tokens-to-theme.js`, since renamed; see
[the tokens source entry](#tailwind-tokens-—-one-committed-source-no-vendored-figma-export))
now filters these out at the source. They stay gone on the next
`yarn sync-tokens` run. `ALPHA_FAMILIES` also dropped a dead `'red-alpha'`
entry that never matched anything in the Figma export. No generated token changed.

**Also removed:** `tailwind/colors.js`, a 642-line legacy color module that
`colors.json` + `colorPalette.js` replaced. It had zero importers, and no
`frappe-ui` package export reached it (there is no `./tailwind/*` wildcard). So
deleting it changes nothing for apps.

### Data fetching, HTTP and the `FrappeUI` plugin

#### Data fetching (v2) — stale responses no longer write the shared stores (fix)

Two writes to one document at the same time could leave `docStore` and
`listStore` (and every view bound to them) on the response that arrived last,
instead of the newest one. Meanwhile `data` already held the fresh response
(#1017).

The check now lives in the stores:

- Every request takes an increasing sequence number when it is sent. The
  response's store writes carry that number. The stores reject a write for a
  document that a request sent later has already written. It is a sequence, not
  a timestamp, because clocks move and two responses can share a millisecond.
- One ordering covers every writer: the `docs` side channel, the `useDoctype` /
  `useList` / `useDoc` hooks, and any mix of instances or paths that write the
  same document.
- A sequence is recorded only when a write that changes data lands. A newer
  request that failed wrote nothing on the server, so it does not make the
  older success stale.
- A read (GET) is accepted on its sequence but records nothing. The server may
  answer a later reload before an earlier save commits, and the save must
  still land.
- A delete seals the document when it settles, because a delete is final. No
  write or reload still in flight, whatever order it was sent in, can
  re-create a deleted document.
- One known limitation: the check orders by send time. A read sent after a
  save, handled by the server before the save committed, and answered after it,
  is accepted and puts the pre-save value back. Fixing that needs ordering on
  the server, which this design does not do.

`useAction` still skips the `onSuccess`/`onError` hooks of a submit when a
newer submit with the same key, on the same instance, has already overtaken it.
The store check protects the stores. This skip only avoids re-running hook side
effects with a stale response. `useDoc`'s write members and `useNewDoc` skip
their hooks the same way. None of these skips decides a store write: only the
store check does. It compares per document and knows whether the newer request
landed. So an overtaken insert of a different document still lands, and an
older success is kept when the newer submit failed.

No API change. Behavior changes, if you relied on the old behavior:

- A stale `setValue`/`delete` on the same document no longer triggers
  `useList`'s automatic refetch. The newest submit's refetch already ran.
- Submits with different keys, and submits with no key (inserts), are
  independent. All of their hooks still fire, as before.

#### Data fetching (v2) — `useDoc` writes and `useNewDoc` get one request per submit (fix)

`useDoc`'s `setValue`, `delete` and every `methods:` entry, and `useNewDoc`,
still shared one request after
[the `useDoctype`/`useList` fix](#data-fetching-v2-—-one-request-per-submit).
Two submits at once cancelled each other, and every submit resolved from the
same `data`, so a caller could get another caller's answer, or `null`. Each
submit now sends its own request and resolves with its own response (#991).

- No API change. These members keep the full `useCall` surface: same members,
  same types. (At the time, `submit()` resolved `null` on a failed request. It
  rejects now; see
  [writes reject, reads resolve](#data-fetching-v2-—-writes-reject-reads-resolve-breaking-silent).)
- `data` and `error` belong to the submit that started last, the same as
  `useDoctype` and `useList`. A stale submit answers its own caller and writes
  nothing shared. `loading` stays `true` until every submit settles.
- Behavior change, if you relied on it: a second submit no longer cancels the
  first. Both requests reach the server.

#### Data fetching (v2) — writes reject, reads resolve (breaking, silent)

One rule now covers every composable: a write rejects when it fails, and a read
resolves. A failed write must not let its caller continue down the success
path.

- **Now rejects:** `useCall`'s `submit()`, and `useDoc`'s `setValue`, `delete`
  and every `methods:` member. They used to resolve with `null`.
- **Still resolves:** `execute()`, `fetch()` and `reload()` in every
  composable. Read `error` after you await them.
- `useDoctype` and `useList` write methods already rejected. Nothing changes
  for them.
- `useCall({ refetch: true }).submit()` follows the rule too. It used to return
  `undefined` at once and leave the request to the params watcher, so a failed
  write could neither reject nor resolve with its response. It now settles on a
  request that carried its params. That is the request the params change
  started, or a request it sends itself when the change started none: the same
  object twice, a `GET` whose params build the same URL, or a `submit()` with no
  argument (which used to send nothing at all). Two submits in the same tick
  still share one request, and a params change replaces the request in flight.
  The [`refetch` and `submit`](/docs/data-fetching/use-call#refetch-and-submit)
  section explains what that means.

A related fix: a successful response now clears `error`. Before, two
overlapping submits ended with the newer one rejecting, on the cancelled
request it replaced, even though its own request succeeded.

`error`, `onError` and the stores otherwise behave as before. This break is
silent: nothing fails to build, the success path simply stops running, and a
`submit()` you do not await becomes an unhandled rejection. `null` is a valid
response now, so `if (!result)` after a `submit()` is no longer a failure
check.

**What to do:** await write calls inside `try`/`catch`, or add `.catch()`. Do
not treat a `null` result as a failure. The
[migration guide](/docs/migration#data-fetching-writes-reject) has the
before/after and what to search for.

#### Data fetching (v2) — `useDoc` method names cannot shadow built-in members (breaking, loud)

A `methods:` key with the same name as a member of the object `useDoc` returns
(`doc`, `error`, `loading`, `reload`, `setValue`, `delete`, and the rest) used
to replace that member silently, which broke the document. `useDoc` now throws
at setup, and names the key and the collision.

**What to do:** rename the key and keep the server method name:
`{ reloadItems: { name: 'reload_items' } }`.

#### Data fetching (v2) — `useNewDoc` and `useDoc` methods take fewer options (breaking)

An insert and a document method run when `submit()` is called, so the options
that say otherwise are gone.

- `useNewDoc` options no longer accept `refetch`, `cacheKey` or `staleOnError`.
  It already fixed `url`, `method`, `params` and `immediate`. `refetch: true`
  used to re-send the insert on every edit to `doc`.
- `useDoc`'s `methods:` options no longer accept `immediate` or `refetch`.
- Both force `immediate: false, refetch: false` at runtime. A JavaScript app
  that still passes them is safe: the values are ignored.

**What to do:** delete these options.

#### Data fetching — `FrappeRequestError` is renamed `FrappeResourceError` (breaking, loud)

The error type that the resource layer raises (`call`, `frappeRequest`,
`createResource` and the other v1 resources) is now `FrappeResourceError`. Both
errors in the library are server responses, so "request" versus "response"
said nothing. Each is now named for the layer that raises it. Only the v1 betas
ever exported the old name: v0.1.278 did not export it at all.

- `FrappeResponseError`, which the v2 composables raise, does not change.
- The fields do not change, and neither does how you narrow either one.
  `FrappeResponseError` is a class. `FrappeResourceError` is a type over a
  plain `Error`, so read a field such as `exc_type`.
- There is no alias (ADR-0008), so importing the old name fails the build.

**What to do:** rename the import. The
[migration guide](/docs/migration#errors-renamed) has the before/after.

#### Data fetching (v2) — error classes and read aliases documented

No code change. The docs now state two facts:

- `FrappeResponseError` (the v2 composables) and `FrappeResourceError` (`call`,
  `frappeRequest`, v1 resources) stay separate, with different fields.
  `UploadError` is the third error.
  [A table](/docs/data-fetching/use-call#which-error-class) says which API
  raises which. It also says which of the three you can narrow with
  `instanceof`: `FrappeResourceError` is a TypeScript type over a plain `Error`,
  not a class, so only the other two have a value to test.
- `execute`/`fetch`/`reload`, and `loading`/`isFetching`, stay as aliases of
  one another. This is the one place the library publishes two names for one
  thing. The docs use `reload()` and `loading`.

#### `createListResource` — `hasPreviousPage` stale after `reload()` (fix)

`reload()` sets `start` to `0` for a moment, to re-fetch the loaded pages as one
request, and then restores it. `hasPreviousPage` was computed while `start` was
still `0` and was not computed again after the restore. So it stayed `false`
even when `start` was back above `0`. `reload()` now recomputes
`hasPreviousPage` after restoring `start`.

#### v1 resources — stay JavaScript, and `createListResource` gets tests {#v1-resources-—-at-bar-exception-documented-listresource-gets-test-coverage}

The v1 resources (`createResource`, `createListResource`,
`createDocumentResource`, `getCachedResource`, `getCachedListResource`,
`getCachedDocumentResource`, `resourcesPlugin`, `saveLocal`, `getLocal`,
`deleteLocal`, `onDocUpdate`) ship without deprecation, frozen at `1.0.0`
(#886).

Every other export had to meet the v1 quality bar.
[ADR-0013](https://github.com/frappe/frappe-ui/blob/main/spec/adr/0013-v1-resources-implementation-freeze.md)
records the one exception: the implementation stays hand-written JavaScript,
not TypeScript, permanently. With 344 call sites in production, a rewrite is
riskier than the freeze. `createListResource`, the second-most-used export
with 57 call sites, gets tests for the first time (`listResource.test.ts`):
pagination, `insert`/`setValue` refreshing the list, caching, and how
`reload()` restores the pagination state.

#### HTTP transport — four paths collapse to one (breaking)

`frappeRequest` is now the only transport. Removed from the root export:

- **`request`**: the bare `fetch` wrapper under `frappeRequest`, now internal.
  Use `frappeRequest`.
- **`createCall`**: no app used it.
- **`initSocket`**: no app used it; every app defines its own.
  `socket.io-client` stays a dependency, because `resources/realtime.ts`
  exports functions typed against its `Socket`.

All three fail the build at the import.

**`call` now honours `setConfig` (silent).** `call` keeps its
`(method, args, options)` signature, the value it resolves to, and the
`{ response, status, error }` shape it passes to `onError`. But it now hands the
request to `frappeRequest` instead of building its own `fetch`. It never
imported `getConfig`, so `requestBaseUrl` and `requestHeaders` were ignored on
every `call()`, while `frappeRequest` respected them. In apps that set either
one, there are two effects: `call` now goes to the configured base URL with
`credentials: 'include'`, and `_server_messages` from a `call` now reach
`serverMessagesHandler`.

**`FrappeResourceError` is now exported.** `frappeRequest` threw it, but nothing
exported it, so you could not type a `catch`.

#### `frappeRequest` — `onError` fired twice per failure (fix)

`request()` attached `transformError` with a `.catch` at the end, which also
caught what `transformResponse` threw. So every failed HTTP response ran
`onError` twice. It now runs once. The fix is that `frappeRequest` marks an
error it has already reported, not that the rejection handler sees less. That
matters: a response that is *ok* but whose body does not parse is a failure
only that handler sees, and it still reaches `onError`. Frappe answers an
expired session with 200 and its login page, so `response.json()` throws.

**A method name starting with `http` skipped the `/api/method/` prefix (fix).**
The check for an absolute URL was `url.startsWith('http')`. That matches the
four letters, not a scheme, so `http_utils.api.run` was fetched as a relative
path. It now matches `https?://`.

`frappeRequest` also has an explicit return type now and passes its type
argument through, so `frappeRequest<Foo>()` resolves to `Foo` rather than
`unknown`.

**`login` returned only `message` when `requestBaseUrl` was set (fix).**
`login` is the one endpoint that resolves to the whole body, so a caller can
read `full_name` and `home_page`. The check compared the whole URL with
`/api/method/login`. `requestBaseUrl` makes that URL absolute, so it stopped
matching, and `login` quietly resolved to `data.message`. It now matches on the
path.

#### `FrappeUI` plugin — one option left (breaking)

`app.use(FrappeUI)` accepts `resources` and nothing else, and it no longer
installs it by default.

- **`socketio` removed.** It defaulted to `true`, so apps that also built their
  own socket opened two live socket.io connections per page load.
- **`call` removed.** It installed a `$call` global that nothing used.
- **`config` removed (silent).** `setConfig` is the entry point. One app passed
  it.
- **`resources` no longer defaults to `true`.** The v1 resources Options API
  mixin (`this.$resources`, `$getResource`, `$getDoc`, `$getListResource`,
  `$refetchResource`) installs only with
  `app.use(FrappeUI, { resources: true })`. Composition API resources are not
  affected. `resourcesPlugin` stays exported for direct installation.

A removed *option* is ignored rather than rejected, so the plugin logs a warning
in development that names any option it does not accept and what to use
instead.

**Removed features fail loudly, in production too.** A dropped option that
disappears is an annoyance. A dropped feature that disappears causes a crash
somewhere else that is hard to trace. So:

- A component that declares a `resources` option without
  `app.use(FrappeUI, { resources: true })` throws when it is created. The error
  names the component and the fix.
- Reading `this.$resources` with the option off throws the same advice. Both
  checks exist because Vue passes what a lifecycle hook throws through its own
  error handling, which only logs in production. A read throws straight into
  app code in every build.
- Reading `this.$socket` or `this.$call`, the two globals the plugin no longer
  installs, throws a message that names the replacement, instead of returning
  `undefined`. If you assign your own
  (`app.config.globalProperties.$socket = io(…)`), it replaces the check. This
  works before or after `app.use(FrappeUI)`.

`realtime: true` on a v1 resource still falls back quietly to a non-realtime
resource when no socket is set. That was always its behaviour, and it does not
change.

**What to do:** if you use `this.$resources`, write
`app.use(FrappeUI, { resources: true })`. Move `config` to `setConfig`.

#### `FrappeUI` plugin — `resources` is a boolean (breaking)

The option was typed as an object of resource definitions, but the plugin never
read what was in it, only whether it was set. It is `boolean` now.

Passing an object is a type error, and it still installs the mixin at runtime,
so an app that misses the change keeps working.

**What to do:** run `npx -p frappe-ui data-v1 ./src`. It rewrites the call. It
reports any site it will not touch (a spread, a computed key, a variable)
instead of guessing.

#### Data fetching (v2) — one request per submit (breaking) {#data-fetching-v2-—-one-request-per-submit}

`useDoctype`'s `insert`, `delete`, `setValue`, `runDocMethod` and `runMethod`,
and `useList`'s `insert`, `setValue` and `delete`, each shared one request. Two
submits at once cancelled each other, and every submit resolved from the same
`data`, so a caller could get another caller's answer, or `null`. Each submit
now sends its own request and resolves with its own response.

- **Breaking:** these eight members no longer carry the `useCall` surface.
  Removed: `params`, `promise`, `url`, `reset`, `abort`, `execute`, `fetch`,
  `reload`, `isFetching`, `isFinished`, `canAbort`, `aborted`. Each of them
  described one shared request, which no longer exists.
- What is left, on all eight: `submit()`, `data`, `error`, `loading` and
  `isLoading()`. `loading` is true while any submit is in flight.
- New: `delete.isLoading(name)` and `setValue.isLoading(name)` on both
  `useDoctype` and `useList`. This replaces the
  `delete.loading && delete.params.name === row.name` pattern, which showed the
  same spinner on every row once two deletes overlapped.
- New: `insert.isLoading()` on both, with no argument. A new document has no
  name to key on, so it answers for the whole method, with the same value as
  `insert.loading`. It exists so all eight methods read the same way.
- `runDocMethod.isLoading(name, method)` and `runMethod.isLoading(method)` keep
  their signatures, and now answer correctly with several submits in flight.
  Before, they compared the shared URL, so only the newest submit read as
  loading.
- `data` and `error` belong to the submit that started last, not the one that
  answered last. A slow submit that comes back after a newer one is dropped: it
  writes no `data`, writes no `error` and clears nothing. It still answers its
  own caller with its own outcome: it resolves with its response, or rejects
  with its error.
- The winning submit writes `data` and `error` together. Success sets `data`
  and clears `error`. Failure sets `error` and leaves `data` alone.
- **`data` is no longer reset on failure.** The old shared `useCall` set `data`
  back to `null` whenever a response came back not-ok. It now keeps the last
  successful response. Read `error`, not `data`, to tell a failed submit from a
  successful one.
- `error` is no longer cleared when a submit starts. Clearing it there erased
  the error of another submit that was still in flight. An error stays until
  the newest submit settles.
- **`submit()` now rejects on any failure.** It resolves with the response or
  rejects with the error: one channel, not two. A failed `validate` already
  rejected. A failed request used to resolve with `null`. Both reject now, and a
  server that answers with `null` resolves with `null`.
- `useList`'s `insert` and `delete` now send to `baseUrl`, which they silently
  dropped before. `setValue` already used it, so all three write methods now
  agree. `useDoctype` was never affected: every one of its methods already
  passed `baseUrl`.

**What to do:** replace reads of the removed members. Use
`delete.isLoading(name)` for per-row spinners. Check `error`, not `data`, after
a submit. See the
[migration guide](/docs/migration#data-fetching-usedoctype-uselist).

#### Data fetching (v2) — `useFrappeFetch` off the root export (breaking)

**`useFrappeFetch` removed.** It is the raw `createFetch` instance that
`useCall`, `useDoc` and `useList` are built on. It handles headers, response
parsing and error shaping, and nothing above that: no URL building, no params,
no caching, no typed return. No app imports it. The build fails at the import.

**What to do:** use `useCall` for a whitelisted method, `useDoc` for one
document, and `useList` for a query.

**`FrappeResponseError` is now exported.** The composables raise it on a Frappe
error response and put it on `.error`, and `submit()` rejects with it. But
nothing exported the class, so you could not narrow the error. This is the same
gap that exporting `FrappeResourceError` closed for `frappeRequest`.

#### Data fetching (v2) — docs, and the sidebar splits from Resources

`useCall`, `useDoc`, `useList`, `useDoctype` and `useNewDoc` each get a docs
page for the first time, under a new **Data Fetching** sidebar section:
`useCall` for a whitelisted method, `useDoc` for one document, `useList` for a
query, `useDoctype` for write-only access to a DocType, and `useNewDoc` for a
draft-and-insert form.

The old **Data Fetching** section is renamed **Resources** and keeps its three
pages (Resource, List Resource, Document Resource) unchanged. Both sections
link to each other. Resources stays fully supported through `1.x`. The new
composables are the recommended layer for new code.

#### Data fetching (v2) — `useNewDoc` lost reactivity after submit (fix)

`useNewDoc` built its return value with `reactive({ ...out, submit, doc })`.
Spreading a `reactive()` proxy reads every ref and computed once and freezes the
result. So `data`, `error` and `loading` stopped updating as soon as the object
was built: a template bound to `newDoc.loading` never saw it change. The return
value is now built by changing the underlying object in place, so its
properties stay live.

#### Data fetching (v2) — `initialData` did nothing on `useCall` and `useList` (fix)

Both documented an `initialData` option, to show a placeholder before the first
response. Neither worked.

- `useCall` passed it straight to the underlying fetch, which expects the
  wrapped `{ data: ... }` shape the API actually returns. The unwrapped value
  was invisible, so `call.data` stayed `null` until the first response.
- `useList` reads `data` from a separate list built in `afterFetch`, which
  `initialData` never touched. So `list.data` stayed `null` the same way.

Both now show the seeded value immediately, as documented.

### Uploads and FileUploader

#### FileUploader — uploads default to private (security fix, breaking)

- **Silent break:** `isPrivateUpload()` is the one function that `useFileUpload`
  and `FileUploadHandler` use to decide privacy. It now makes an upload with no
  stated `private` / `is_private` **private**, not public. Before,
  `FileUploader` set this default itself, while
  `useFileUpload().upload(file, {})` and
  `new FileUploadHandler().upload(file, {})` made the same upload public. That
  mismatch was [#922](https://github.com/frappe/frappe-ui/issues/922).
  `FileUploader` itself already uploaded private (since `v1.0.0-beta.21`) and
  is not affected. A caller of `useFileUpload` or `FileUploadHandler` that sets
  no privacy option now gets a private file, where it got a public one before.
- Fixed: the standalone `upload(file, options)` export (exported from
  `frappe-ui` next to `useFileUpload`) crashed at runtime. It required internal
  `state`/`reset` arguments that the public signature gave no way to pass. It
  is now a real standalone function, and `useFileUpload()` wraps it with
  reactive state.

**What to do:** pass `private: false` where an upload must be public. See the
[migration guide](/docs/migration#fileuploader). (The `is_private` option was
removed later; see
[the next entry](#uploads-—-uploaderror-and-the-is-private-option-removed-breaking).)

#### Uploads — `UploadError`, and the `is_private` option removed (breaking)

`upload`, `useFileUpload` and `FileUploadHandler` reject with an exported
`UploadError` instead of a plain `Error`. `useFileUpload`'s `state.error` is
typed with it.

- `error.kind` is `'file-size' | 'network' | 'server' | 'abort'`. Branch on it
  instead of matching the message text.
- A server failure also carries `status`, the parsed `messages` and the raw
  `response`. `FileUploadHandler` now rejects on abort, instead of leaving the
  promise open. `upload` and `useFileUpload` already rejected.
- **Breaking, silent in JS:** an aborted `upload()` / `useFileUpload()` used to
  reject with `new DOMException('Upload cancelled', 'AbortError')`. It now
  rejects with an `UploadError` with `kind: 'abort'`. `error.name` is
  `'UploadError'` and `error instanceof DOMException` is false. So a `catch`
  that tells a cancel from a failure by either check stops matching.
  `options.signal` is public. See the
  [migration guide](/docs/migration#upload-abort-error).
- Existing `catch` blocks keep working: `UploadError` is an `Error`, and its
  `message` is unchanged.
- **Breaking, silent in JS:** the `is_private` upload option is removed.
  `private` is the only spelling. An `is_private` that is still passed is
  ignored, so `{ is_private: 0 }` now uploads private. The `is_private` field
  on the returned file record is unchanged.
- `isPrivateUpload` and the `UploadPrivacy` type are no longer exported.

**What to do:** check `error.kind === 'abort'` to detect a cancel. Replace
`is_private` with `private`.

#### FileUploader — flat props replace the `uploadArgs` blob (breaking, silent) {#fileuploader-—-flat-props-replace-the-uploadargs-blob-breaking-p3}

**Silent break:** `uploadArgs` is removed. The fields of it that apps actually
use are now flat props: `private`, `folder`, `doctype`, `docname`, `fieldname`,
`uploadEndpoint`, `optimize`. Old code keeps compiling, because `uploadArgs`
becomes an unused attribute on the root element. So an app that relied on it
(`folder`, `doctype`, custom `private`, …) silently stops applying those
options.

The advanced options with no flat prop (`file_url`, `method`, `type`, `params`,
`maxWidth`/`maxHeight`, upload cancellation) had zero measured use on the
component. For those, use `useFileUpload()` directly.

**What to do:** move each `uploadArgs` field to its flat prop. See the
[migration guide](/docs/migration#fileuploader).

#### FileUploader — `success` / `failure` emits declared stable

- Both emits lost their `@deprecated` tag (ADR-0008 does not allow
  `@deprecated` members in `1.0.0`) and gained real types:
  `success: [data: UploadedFile]` and `failure: [error: unknown]`. They were
  untyped `any` before. Apps depend on both, and they keep their names, because
  the names already describe the result rather than the user action.
- Fixed: `failure` did not fire when `validateFile` rejected a file, only on an
  actual upload error. `error` was set on the slot props either way, but a
  `@failure` listener never heard about a rejected file. It now emits `failure`
  with the validation error (a string or an `Error`) in both cases, as the type
  already promised.

#### FileUploader — slot prop `error` is now always a string (breaking, silent) {#fileuploader-—-slot-prop-error-is-now-always-a-string}

**Silent break:** `FileUploaderSlotProps.error` changed from `unknown` to
`string | null`. Upload failures were already turned into a message string.
Validation failures (`validateFile` returning an `Error`) were not, so a custom
slot could get either a string or an `Error` object. Both paths now turn the
error into a message string before it reaches the slot. A slot that did
<span v-pre>`{{ error.message }}`</span> for the validation `Error` case
(uncommon, but possible) now renders nothing, because `error` is always a
string.

**What to do:** render <span v-pre>`{{ error }}`</span> instead. See the
[migration guide](/docs/migration#fileuploader).

#### FileUploader — `inputRef` removed, nothing in its place

**Breaking, loud:** per
[ADR-0012](https://github.com/frappe/frappe-ui/blob/main/spec/adr/0012-template-ref-surface.md),
`FileUploader` exposes nothing on its template ref. `inputRef` was a function
that looked like a ref (`uploader.value.inputRef().focus()`). The
`openFileSelector` slot prop already covers what it was used for. There were
zero known call sites.

**What to do:** use the `openFileSelector` slot prop.

#### FileUploader — TypeScript types, tests, docs and styling hooks {#fileuploader-—-structural-bar-typescript-types-ts-tests-docs}

- `FileUploader` is now fully typed (`FileUploaderProps`, `FileUploaderEmits`,
  `FileUploaderSlotProps` in `types.ts`).
- It has `*.cy.ts` component tests that cover the five required behaviors:
  render, `v-model`, disabled and loading, keyboard and focus, and slots.
- It has a `data-slot="root"` /
  `data-state="idle" | "uploading" | "success" | "error"` pair for CSS hooks,
  so you can style it without class props.
- The default trigger now shows validation and upload errors through
  `<ErrorMessage>` (`role="alert"`). Before, errors were invisible unless the
  caller used a custom slot.

#### `fileToBase64` and the `fileSize` helpers — unexported from root (breaking, loud) {#filetobase64-and-the-filesize-helpers-—-unexported-from-root}

**Breaking, loud:** `fileToBase64`, `formatBytes`, `getMaxFileSize`, and
`fileSizeLimitMessage` are no longer exported from `frappe-ui`. They had zero
outside call sites at the v1 review. All four stay as internal helpers shared
by `useFileUpload`, `FileUploadHandler`, and the editor's media upload engine.

### Inputs and forms

#### Inputs — the size scale is `xs / sm / md / lg` (breaking; loud in TS, silent in JS)

The input family gains `xs` and loses `xl`. The four sizes are fixed
single-line heights: **24 / 28 / 32 / 40px**. `sm`, `md` and `lg` render as
before. `xs` matches `Button`'s own `xs`, so a 24px input and a 24px button line
up.

`xl` was never a bigger box. It drew `lg`'s 40px height with an 18px font, so it
was a font override with a size name.

Every component on the shared scale changes together: `TextInput`, `Textarea`,
`Password`, `Rating`, `Select`, `Combobox`, `MultiSelect`, `ItemListRow`,
`FormControl`, the `DatePicker` family, `TimePicker`, `Duration`, and the
experimental `CodeEditor` and `MultiEmailInput`. `Progress`, `Slider`,
`Switch`, `Checkbox`, `Radio`, `Avatar`, `Badge`, `Button` and `Dialog` keep
their own scales, so `<Dialog size="xl">` and `<Avatar size="xl">` still work.

- `FormControl.size` widens from `sm | md` to the whole scale.
  `type="checkbox"` renders on the smaller toggle scale, so `lg` there becomes
  `md` rather than falling off the end.
- **A leftover `size="xl"` no longer loses its styling.** Every input size
  lookup goes through `resolvePropValue`. An unsupported value falls back to the
  component's own default and warns once in development. Before, it shipped an
  element with no height, font, radius or padding class, and no warning.
  `Badge` got the same treatment for `theme`.
- `InputSize`, `InputVariant`, `ToggleSize` and `RangeSize` are now exported
  from the root, so a typed wrapper can name the scale that the API tables
  already print.

TypeScript flags `xl` at the call site. JavaScript call sites and bound values
(`:size="config.size"`) only show up through the development warning.

**What to do:** replace `size="xl"` with `size="lg"`. After upgrading, check the
console for the warning.

#### Form typography — 13px labels, descriptions and Textarea text (breaking, silent)

Labels, descriptions and `Textarea` text are a fixed 13px. Labels and
descriptions default to `ink-gray-6`. This is a rendering change: there is
nothing to change in your source, except `FormLabel.size` below.

| Member | Before | After |
| --- | --- | --- |
| Label (`InputLabel`) | 14px, `ink-gray-5` | 13px, `ink-gray-6` |
| Label (`FormLabel`) | 12px `sm` / 14px `md`, `ink-gray-5` | 13px, `ink-gray-6` |
| Description | 13px, `ink-gray-5` | 13px, `ink-gray-6` |
| Description, disabled | `ink-gray-3` | `ink-gray-4` |
| `Textarea` text, every size | 14 / 16 / 18 / 20px | 13px |

The two label components used to disagree. `InputLabel`, which `FormControl`
renders through, was a flat 14px. `FormLabel` was 12px or 14px depending on
`size`. Both are 13px now, so a `FormLabel` and a `TextInput` label match.

`ink-gray-5` measured 4.18:1 against the page in both themes, which is below
WCAG AA for body text. `ink-gray-6` measures 7.80:1 in light and 6.29:1 in
dark. The disabled description moved off `ink-gray-3` (1.69:1) to match the
disabled label.

- **`FormLabel.size` is removed**, not kept as a prop that does nothing: with
  the size fixed, the prop had nothing to choose. `size` falls through as a
  plain HTML attribute, so nothing throws, and the label renders at 13px.
  TypeScript call sites get a build error. `size="md"` was 14px and the `sm`
  default was 12px. Both become 13px.
- `Textarea.size` still changes padding, corner radius and minimum height. It
  no longer changes the text size. The single-line input heights do not set a
  `Textarea` height, so a `lg` `Textarea` is a roomier box with the same 13px
  text. The colour of the `Textarea` *value* is unchanged.

**What to do:** delete `size` from `FormLabel`.

#### ErrorMessage — several messages (additive) {#errormessage-—-several-messages}

`message` accepts `string[]`. An `Error` that carries a `messages` array (what
Frappe's whitelisted methods return) renders one line per message, instead of
`[object Object]`. A single string and a plain `Error` render as before. The
prop type is exported as `ErrorMessageValue`.

Every input takes the same value on its `error` prop, so
`<TextInput :error="['Email is required', 'Password too short']" />` renders
both lines and sets `aria-invalid`. An empty array means no error. One function
decides this for the whole library, so the error text and the input state
always agree.

#### Inputs — `focus()` on every control, `open()`/`close()` on the pickers (additive)

Every input exposes `focus()` on a template ref, typed as the new exported
`InputExposed`. A generic form that holds a ref to a control it did not choose
now has one action it can always call. `FormControl` forwards `focus()` to the
control its `type` resolved to.

Where focus lands is part of the contract. It is the element that `Tab`
reaches: `Slider` focuses the thumb. `RadioGroup` focuses the selected option
(the first enabled one when nothing is selected). `Rating` focuses the selected
star (the first star when the value is empty), except in half-star mode, where
the whole control is one slider.

The three date pickers and `TimePicker` add `open()` and `close()` next to
`focus()`, typed as the new exported `PickerExposed`. They render their own
trigger, so a parent's script has no other handle on the panel. `open()` does
nothing while the picker is disabled. `clear()` stays on `Select`, `Combobox`
and `MultiSelect` and is not added anywhere else (ADR-0012).

`Duration` now forwards the `#label` and `#description` slots to its
`TextInput`. It used to drop them.

#### Inputs — attributes route to the control, `class` and `style` to the wrapper (breaking, silent)

An input has a layout wrapper and an interactive element. An attribute you pass
that the component does not declare has to land on one of them. The rule is
now the same everywhere: `class` and `style` go to the wrapper. `name`,
`aria-*`, `data-*` and listeners go **once** to the interactive element.

`Checkbox` applied the whole set twice, so `aria-label` also named a `<div>`,
and a caller's `@click` ran twice. `Switch`, `RadioGroup` and `Rating` sent
everything to the wrapper, so `aria-label` never reached the control at all.

This is silent. Check your code if you relied on the old placement:

```vue
<!-- the listener used to fire on the padded row too; now only on the input -->
<Checkbox padded label="Agree" @click="onClick" />
```

`TextInput`, `Textarea`, `Password`, `Select`, `Combobox`, `MultiSelect`,
`Slider`, `FormControl`, `Duration` and the date pickers already followed the
rule and are unchanged.

#### `Rating` — `size` defaults to `sm` (breaking, silent)

Every other input defaults to `sm`, but `Rating` defaulted to `md`. A
`<Rating>` with no `size` now renders smaller. An unrecognized size resolves to
`sm` too, so the default and the fallback agree.

**What to do:** pass `size="md"` to keep the old size.

#### Input types — `SelectionOption`, `SelectionGroup`, `Dayjs`, `DateRangeValue` (additive, with one removal)

- `SelectionOption` and `SelectionGroup` are exported from the root, so a
  wrapper around any of the three selection components can name its option
  shape once. The component-specific types stay.
- `Dayjs` is exported. The date pickers pass one to `formatter`,
  `disabledDate` and the setter slot props, so you need to be able to name the
  type.
- `DateRangeValue` types both sides of `DateRangePicker`'s `v-model`. The prop
  was `string[]`, which let a one-element array in and made a round-trip
  through the model fail to type-check.
- **Removal:** `DatePicker`'s entry file lists its public types, instead of
  re-exporting the whole module. `DatePickerViewMode` and `DatePickerDateObj`
  were calendar internals that the wildcard published. They leave the root.
- `SelectEmits`, `ComboboxEmits` and `MultiSelectEmits` no longer declare the
  model events a second time (`defineModel` already declares them). See
  [Selection emit interfaces](#selection-emit-interfaces-drop-the-model-events-breaking-in-ts-only).
  `RadioGroupEmits` says `RadioValue | undefined`, which is what an unbound
  group starts at.

#### Inputs — `control` versus `trigger`, and picker ARIA (additive)

`data-slot="trigger"` belongs to the selection family only: `Select`,
`Combobox` and `MultiSelect` render a box that shows the selection and opens the
popover. Every other input, the date and time pickers included, marks its main
interactive element `data-slot="control"`. You type into a picker's `<input>`,
so it is a control that also opens a panel.

- `FormLabel` carries `data-slot="label"`, the hook `InputLabel` already
  rendered. One selector now reaches every label in the library.
- The picker chevron carries `data-slot="chevron"`.
- The picker `<input>` carries `role="combobox"`, `aria-haspopup` (`dialog` on
  the date pickers, `listbox` on `TimePicker`) and `aria-expanded`. While the
  panel is open, it also carries `aria-controls` pointing at the panel element.
  `TimePicker` puts `aria-activedescendant` on the input, where the ARIA
  combobox pattern expects it, instead of on the listbox.

#### `FormControl` — `variant` is not forwarded to a checkbox (breaking, silent)

A checkbox draws no container surface, so it has no `variant`. `FormControl`
forwarded one anyway, and it landed on the `<input>` as a stray
`variant="subtle"` attribute. `type="checkbox"` no longer receives it.

The `type` routes are unchanged: `date` renders `DatePicker`, `time` renders
`TimePicker`, and a native date field is `<TextInput type="date" />`.

#### Toggles and ranged inputs — deprecated members removed (breaking, silent) {#toggles-and-ranged-inputs-—-deprecated-members-removed}

Per ADR-0008, this family's deprecated aliases are **removed**, not kept.
All five had zero call sites across the consumer apps. These are silent breaks:
old code compiles and runs, but the old name is ignored. See the migration
guide's [Inputs table](/docs/migration#inputs).

| Removed | Use |
| --- | --- |
| `Rating.rating_from` | `max` |
| `Rating.readonly` | `disabled` |
| `Switch.change` emit | `v-model` / `@update:modelValue` |
| `Switch.labelClasses` | `data-*` styling hooks |
| `Checkbox.padding` | `padded` |

`Slider` now exports its types (`SliderProps`, `SliderEmits`, `SliderValue`),
and `Rating` exports `RatingEmits`.

#### Input family — shared labeling contract

`TextInput`, `Textarea`, `Password`, `Checkbox`, `Switch`, `Rating`, and
`Slider` accept `label`, `description`, `error` and `required`. The id is
generated for you. `<label for>`, `aria-describedby`, `aria-errormessage`,
`aria-invalid` and `aria-required` are wired automatically. `error` accepts a
`string` or an `Error` (with `Error.messages` rendered as stacked plain text).
Existing call sites do not change.

#### Input family — `data-*` styling hooks

Every input renders the same `data-*` attributes, so your CSS can target inputs
without props that inject classes:

- `data-slot` (`"label"`, `"control"`, `"description"`, `"error"`)
- `data-size`, `data-variant` (where the input has them)
- `data-state` (`"valid" | "invalid" | "checked" | "unchecked" | …`)
- `data-disabled`, `data-required`

#### Password — `v-model` fix

`Password` now uses `defineModel<string>()`. This fixes a bug where
`<Password v-model>` did not update when the user typed. Explicit `size`,
`variant`, `disabled`, `placeholder`, `id` and `required` props replace
`$attrs` routing.

#### Password — `value` prop removed (breaking)

Per [ADR-0008](https://github.com/frappe/frappe-ui/blob/main/spec/adr/0008-no-deprecated-members-in-1-0-0.md),
no deprecated member ships in `1.0.0`. Since `value` was deprecated earlier in
this cycle, it warned and seeded `v-model`. A survey of every downstream app
found zero call sites still passing it.

**What to do:** use `v-model` / `modelValue`.

#### TextInput / Textarea / Password / Duration — `focus()` and `inputElement` on the ref (breaking) {#textinput-textarea-password-duration-—-focus-and-inputelement-on-the-ref}

This implements
[ADR-0012](https://github.com/frappe/frappe-ui/blob/main/spec/adr/0012-template-ref-surface.md).

- **Breaking:** `TextInput.el` and `Textarea.el` are renamed to
  `inputElement`. It is a computed, typed `HTMLInputElement | null` /
  `HTMLTextAreaElement | null`, never a raw ref.
- All three, and `Duration`, now expose `focus(options?: FocusOptions)`.
  `Password` exposed nothing before.
- `TextInput`, `Textarea` and `Password` share one exported type,
  `TextInputExposed`, from `TextInput`'s `types.ts`.
- `DurationExposed.focus` gained the same `options?` parameter. Its set of
  members is unchanged.

**What to do:** rename `.el` to `.inputElement`.

#### Rating — `max` replaces `rating_from`

The default is `5`. The old name was kept as a deprecated alias during the betas
and is now removed; see
[Toggles and ranged inputs](#toggles-and-ranged-inputs-—-deprecated-members-removed).
`Rating` no longer imports `FeatherIcon`. The default star comes from
`lucide-star` through the shared Tailwind plugin. Filled stars now render
visibly for values above zero.

#### Slider — additive props and a11y fix

- `disabled` prop added.
- `size: 'sm' | 'md'` added. `'md'` scales the track and thumb in proportion.
- New `value-commit` emit. It fires when dragging ends. Use it for side effects
  you do not want on every step.
- Removed the hardcoded `aria-label="Volume"`. The label now comes from the
  shared labeling contract, so pass `label` explicitly. This counts as a bug
  fix: assistive tech announced every Slider that was not a volume control as
  "Volume".
- The track is visible in collapsed wrappers, and the slider is full-width by
  default.
- An uncontrolled `Slider` starts at `min`, instead of rendering with no thumb.

#### Switch — Lucide icons; deprecations

`Switch` no longer imports `FeatherIcon`. `icon` is now `string | Component`,
and `lucide-*` strings go through the shared Tailwind plugin. `labelClasses` and
the `change` emit were deprecated during the betas and are now removed; see
[Toggles and ranged inputs](#toggles-and-ranged-inputs-—-deprecated-members-removed).
The row's hover and active background is removed.

#### Checkbox — `padding` deprecated

`padding` was deprecated in favor of `padded`. It is now removed; see
[Toggles and ranged inputs](#toggles-and-ranged-inputs-—-deprecated-members-removed).

#### Textarea — `ghost` variant; `required` prop

`Textarea` now accepts the `'ghost'` variant (like `TextInput` and `Password`)
and the shared `required` prop.

#### TextInput / Textarea — `ghost` variant paints transparent (fix)

`ghost` set no `bg-*` class, so the `@tailwindcss/forms` preflight painted the
input `#fff`, which showed as a white pill in dark mode. `ghost` now sets
`bg-transparent`, like Combobox's own ghost search input. Closes #851.

#### Input — removed (breaking)

**Breaking:** `Input` and its `Input.cy.ts` tests are deleted. Per
[ADR-0008](https://github.com/frappe/frappe-ui/blob/main/spec/adr/0008-no-deprecated-members-in-1-0-0.md),
no deprecated member ships in `1.0.0`. A survey of downstream apps found no
live call sites that render `<Input>`. Five registrations were global component
registrations that never rendered it.

**What to do:** use `TextInput` for text-like modes, or `Textarea` / `Select` /
`Checkbox` for the other `type` modes that `Input` accepted.

#### FormLabel — moved to a component directory (non-breaking)

`FormLabel` now lives at `src/components/FormLabel/FormLabel.vue` instead of a
bare `src/components/FormLabel.vue`, like the rest of the input family. It gains
`types.ts`, tests, stories and a docs page. The import path
(`import { FormLabel } from 'frappe-ui'`) is unchanged.

#### InputLabel — slot polish

The default required indicator is not rendered when you use `#label` (the slot
receives `{ required }`). The labeling wrapper is not rendered at all when there
is nothing to label.

### Date and time pickers

#### Pickers — `open` is honored at mount (breaking, silent)

`DatePicker`, `DateRangePicker`, `DateTimePicker` and `TimePicker` set their
own open state to `false` at the start, and only watched `open` for later
changes. So a parent that mounted one with `open` already `true` got a closed
panel.

The initial value is now read on the first render, and the panel opens fully
set up: the calendar shows the bound date, `TimePicker` scrolls to the bound
time, and the trigger's `aria-controls` points at the panel. Mounting open
emits no `update:open` and moves no focus: the panel is on the page from the
first render, so focus stays wherever you put it. Opening the panel later still
moves focus into it when the trigger is a custom `#trigger`.

- **Behavior change:** if you passed `open` as a constant `true` and relied on
  it being ignored, the panel now opens.
- `open: true` together with `disabled: true` shows the panel. This matches
  the controlled path, which already skipped the disabled check. The
  imperative `open()` still does nothing while disabled.

**What to do:** if you passed a constant `open`, drop the prop or bind it to
your own state.

#### DatePicker internals are no longer exported (breaking, loud)

`src/components/DatePicker/index.ts` re-exported its whole `utils` module, so
`months`, `monthStart`, `generateWeeks` and `getDateValue` reached the package
root. The library does not allow `export *` from an implementation module: any
helper a later commit added to `utils.ts` would have joined the public API
without review, and been frozen.

**Breaking, loud:** `import { months, getDateValue } from 'frappe-ui'` fails to
resolve. Nothing replaces them. `months` was a hardcoded English-only
`'Jan'..'Dec'` array with no way to translate it, so freezing it would have been
worse.

**What to do:** copy what you need into your app, or use `dayjs` directly.

The `DatePicker`, `DateTimePicker` and `DateRangePicker` components and their
types are unchanged.

#### DatePicker family — trigger slot props renamed to `open` / `toggle` (breaking, silent)

`#trigger`, `#prefix` and `#suffix` on `DatePicker`, `DateRangePicker`,
`DateTimePicker` and `TimePicker` now receive `{ open, toggle }` instead of
`{ isOpen, togglePopover }` (#1054).

`Popover`, `HoverCard`, `Dropdown`, `Select`, `Combobox` and `MultiSelect` all
name the boolean `open`, and `Popover`'s trigger slot already names the flip
`toggle`. `isOpen` is on `CONTEXT.md`'s list of names to avoid in a public API,
and `togglePopover` named the mechanism rather than the behavior. These
components also already gave `#actions` a `close()`, so one component used two
sets of names for one concept. `displayLabel` and `inputValue` are unchanged.

**Silent break:** a destructured `isOpen` becomes `undefined`, so a class bound
to it stops applying, with no error. `togglePopover()` throws only when you
call it.

**What to do:** search for both names and rename them. See the
[migration guide](/docs/migration#trigger-slot-props).

#### `TimePicker` — four emits removed (breaking, loud in TS, silent in JS)

`update:open` carries both the open and the close, with the state in the
payload, so `open` and `close` are gone. `input-invalid` and `invalid-change`
are gone too: typed text that does not parse goes back to the last valid value,
which the user sees.

```vue
<!-- Before -->
<TimePicker @open="onOpen" @close="onClose" @invalid-change="setInvalid" />

<!-- After -->
<TimePicker @update:open="(open) => (open ? onOpen() : onClose())" />
```

`TimePickerEmits` is exported. `Variant` is an alias of the shared
`InputVariant`, not a second scale.

#### DatePicker family — v1 spec

`DatePicker`, `DateRangePicker` and `DateTimePicker` use the same
popover-trigger names as `Combobox` / `Dropdown` / `Select`.

- `side` (default `'bottom'`) + `align` (default `'start'`) + `offset`
  (default `4`) replace `placement` (removed).
- `keepOpen` (default `false`) replaces `autoClose` (removed; it is the
  inverse).
- `typeable` (default `true`) replaces picker-level `readonly` and
  `allowCustom` (both removed). `:typeable="false"` blocks typing and keeps the
  popover interactive.
- Constraints: `min?: string` and `max?: string` (`YYYY-MM-DD`, plus
  `YYYY-MM-DD HH:mm:ss` on `DateTimePicker`), and
  `isDateUnavailable?: (date: Dayjs) => boolean` to disable any date. Min/max
  and the function work together. On `DateTimePicker`,
  `minDateTime`/`maxDateTime` are removed in favor of `min`/`max`.
- `v-model:open` works on all three pickers, through `open` + `update:open`.
- `openOnFocus` (default `false`) and `openOnClick` (default `true`) let you
  turn off either way of opening. `Combobox` got the same defaults.
- `#trigger` is the slot for a custom trigger. `#target` is removed.
- `DateRangePicker.clearable` now defaults to `true`. The footer hides when
  there is nothing to clear. (The footer was removed later; see
  [footer removed](#datepicker-family-—-footer-removed-new-actions-sidebar-slot).)
  The same change added a live hover preview while picking the end date, and a
  stable trigger width derived from `format`.
- Public type exports added: `DateTimePickerProps`, `DateRangePickerEmits`,
  `DateTimePickerEmits`, `DateRangeValue`.

#### DatePicker family — `DateRangePicker` emit shape (breaking)

`DateRangePicker` emits `update:modelValue` / `change` as a `[from, to]` tuple
(`DateRangeValue = [string, string] | []`) instead of a comma-joined string.
The `modelValue` prop already accepted `string[]`. Only the emit changes.

```ts
// before
function onChange(v: string) { const [from, to] = v.split(',') }
// after
function onChange(v: DateRangeValue) { const [from, to] = v } // [] when cleared
```

Reactive forms that pass the value through unchanged are not affected.

#### DatePicker family — footer removed; new `#actions` sidebar slot

The popover footer on `DatePicker`, `DateRangePicker` and `DateTimePicker` is
removed, including the Clear button it rendered automatically when
`clearable && hasValue`. `clearable` still controls the clear control on the
input.

- The new `#actions` slot renders as a **left sidebar** inside the popover. Its
  slot props include `close`, `setDate` / `setRange`, and `clear`.
  `DateRangePicker`'s `setRange([from, to])` sets both ends in one step. Use it
  for fixed-window presets ("Last 7 days").
- The popover content is `w-fit` when you provide the slot.
- The sidebar `<aside>` carries `data-slot="actions"` for CSS.

**What to do:** if you relied on the automatic Clear button, render your own
Clear row inside `#actions`, using the `clear` slot prop.

#### DateTimePicker — date selection keeps popover open (breaking)

Selecting a date in `DateTimePicker` no longer closes the popover. Focus moves
into the embedded `TimePicker` instead, so the user goes straight from date to
time. The popover closes on `Esc`, on a click outside, or on a call to
`close()`.

**What to do:** if you relied on the automatic close, bind `v-model:open` and
close it from `@update:modelValue`. Or render an "Apply" button in `#actions`,
which receives `close` in its slot props.

#### TimePicker — v1 refresh

The same names as the DatePicker family, plus a flexible parser.

- `side` / `align` / `offset` replace `placement` (removed).
- `keepOpen` (default `false`) replaces `autoClose` (removed).
- `typeable` (default `true`) replaces picker-level `readonly` / `allowCustom`
  (both removed).
- `v-model:open` through `open` + `update:open`. New `openOnFocus` (default
  `false`) and `openOnClick` (default `true`) props.
- Flexible typed input: `"3pm"`, `"3.30pm"`, `"1500"` and `"9:30:15 am"` parse
  to the canonical `HH:mm[:ss]`.
- `min` / `max` replace `minTime` / `maxTime` (removed).
- `scrollMode` is removed. The list is always centered on the selection.
- The template ref exposes only `focus()` (ADR-0012). `selectAll()` and
  `blurInput()` had no callers and are removed.

#### DatePicker family — keyboard navigation

Full keyboard navigation inside the calendar grid, following the WAI-ARIA APG
Date Picker Dialog pattern.

- `↓` on the trigger input opens the popover and moves focus to the selected
  cell, or to today.
- In the grid: `←`/`→` move ±1 day, `↑`/`↓` ±1 week, `Home`/`End` to the week
  edges, `PageUp`/`PageDown` ±1 month, `Shift+PageUp`/`Shift+PageDown` ±1 year.
- `Enter` / `Space` selects. `Esc` closes and returns focus to the input.
- Disabled dates (from `min` / `max` / `isDateUnavailable`) are skipped.
- Arrow keys move across month boundaries on their own.
- `DateRangePicker` shows two months: arrow keys cross between them without
  moving the view, and the range shading follows the cell with keyboard focus.

Only one cell is in the tab order at a time, so `Tab` enters and leaves the
grid as one unit. Custom `#trigger` slots get this too: any way of opening
moves focus into the grid, because a trigger that is not a `TextInput` has
nothing to type into.

#### DatePicker family — legacy composable removed (breaking, loud) {#datepicker-family-—-legacy-composable-removed}

`useDatePicker` and its helpers (`getDate`, `getDatesAfter`, `getDaysInMonth`,
`isLeapYear`) were not used by any picker component and were not part of the
v1 API. They are deleted outright. The import fails, so the break is loud.

**What to do:** use the picker components directly.

#### DatePicker / TimePicker family — deprecated aliases removed (breaking, silent) {#datepicker-timepicker-family-—-deprecated-aliases-removed-adr-0008}

The compatibility aliases these components carried through the betas are
deleted, not kept as shims that warn and map to the new name. Per
[ADR-0008](https://github.com/frappe/frappe-ui/blob/main/spec/adr/0008-no-deprecated-members-in-1-0-0.md),
no deprecated member ships in `1.0.0`.

- **`placement`, `autoClose`, `allowCustom`, picker-level `readonly`,
  `inputClass`, and the `value` prop are removed.** All silent: a leftover prop
  lands as an unused extra attribute and does nothing.
- **The `#target` slot is removed.** Content in a leftover
  `<template #target>` silently stops rendering. Use `#trigger`.
- **`DateTimePicker.minDateTime`/`maxDateTime` and
  `TimePicker.minTime`/`maxTime` are removed.** Silent: the limit is no longer
  enforced. Use `min`/`max`.
- **`TimePicker.scrollMode` is removed.** Silent. The list is always centered.

`change` stays as a supported second emit next to `update:modelValue`. It was
never deprecated on `TimePicker`, and `DateTimePicker` depends on it
internally, so removing it from the other two pickers would have been an
inconsistent break that nothing required.

**What to do:** see the before/after for each in the
[migration guide](/docs/migration#datepicker-timepicker-family), and the
[Deprecation log](#deprecation-log) for each replacement.

#### MonthPicker — removed (breaking)

`MonthPicker` and all its files (`MonthPicker.vue`, types, stories) are
deleted. It duplicated `Select` for a narrower case. The import fails, so the
break is loud.

**What to do:** use `Select` with month options. See the
[migration guide](/docs/migration#monthpicker).

### Select, Combobox, MultiSelect and Dropdown

#### Selection emit interfaces drop the model events (breaking in TS only)

`ComboboxEmits` and `MultiSelectEmits` no longer declare `'update:open'` and
`'update:query'`. `SelectEmits` no longer declares `'update:modelValue'`. Each
component already declares those events through `defineModel`. Declaring them
twice collapsed `$emit`'s signature to `(event, ...args: unknown[])`, so a typed
`@update:open` listener did not compile. `SelectEmits` also disagreed with the
generated payload, which carries `undefined` because the model prop is
optional. So a wrapper that re-bound `@update:model-value` failed to compile.

**The runtime events are unchanged.** `v-model`, `v-model:open`,
`v-model:query` and the matching listeners all fire exactly as before, and the
API tables still list every event. Only these five interface *members* are
gone:

| Removed member | Still emitted at runtime |
| --- | --- |
| `ComboboxEmits['update:open']` | yes |
| `ComboboxEmits['update:query']` | yes |
| `MultiSelectEmits['update:open']` | yes |
| `MultiSelectEmits['update:query']` | yes |
| `SelectEmits['update:modelValue']` | yes |

You are affected only if you indexed those interfaces by hand, as in
`type Handler = ComboboxEmits['update:open']`, or passed one to `defineEmits` in
a wrapper.

**What to do:** type the handler from the model instead:
`(value: boolean) => void` for `open`, and
`(value: SelectOptionValue | null | undefined) => void` for a selection model.
The `undefined` is there because the model prop is optional. The component
never emits it.

#### `Select` — nothing selected is `null` (breaking, silent)

`Select` emitted `undefined` for an empty value, while `Combobox` emitted
`null`. So one single-value family had two answers. Both are `null` now.
`MultiSelect` keeps `[]`, because apps loop over an empty array.

```js
// Before — Select
watch(value, (v) => { if (v === undefined) reset() })

// After
watch(value, (v) => { if (v === null) reset() })
```

An empty string is still a real value, so a "None" row with `value: ''` still
round-trips. `clear()` and the `clear` slot prop both write `null`.

#### Autocomplete — removed (breaking)

- **Breaking:** `Autocomplete` and its `AutocompleteProps` type are deleted.
  Use `Combobox` for one value and `MultiSelect` for several. The import fails,
  so the build names every call site. `trigger="button"` on either replacement
  gives the shape of `Autocomplete`'s default target: a button that shows the
  selection, with the search box inside the popover.
- **Breaking, silent:** `FormControl type="autocomplete"` is removed.
  `FormControl` falls through to `TextInput` and still forwards the type, so the
  result is `<input type="autocomplete">`: a plain text box, with no build or
  runtime error. A `console.error` in development names the removal. Use
  `type="combobox"`, or `Combobox` on its own.
- **Breaking, silent:** the `v-model` value changes shape. `Autocomplete` held
  the whole option object. Both replacements hold only the value. Listen to
  `@update:selectedOption` where you need the whole option.
- **Breaking, silent:** `#target`'s `open` slot prop was the *function* that
  opened the popover. `#trigger`'s `open` is the open *state*. Anything that
  read it as a value (`v-if="open"`) was always true, and now is not.
- Otherwise, `#target` becomes `#trigger`. `Combobox` and `MultiSelect` attach
  the open toggle to the trigger element themselves, so drop your click
  handler. A `togglePopover()` carried through the rename throws on click. The
  popover still opens, so it looks like it works while it logs an error.
- Grouped options use `{ group, options }`, not `{ group, items }`. Both
  option normalizers now throw an error that names the group and the rename,
  instead of failing inside a `map` call.

**What to do:** see the before/after for each silent break in the
[migration guide](/docs/migration#autocomplete-removed).

#### Dropdown / ContextMenu — deprecated members removed (breaking; loud in TS, silent in JS) {#dropdown-contextmenu-—-deprecated-members-removed-adr-0008}

Per ADR-0008, three surfaces that shipped as deprecated aliases in the betas are
deleted, not aliased. All three are **silent breaks** in plain-JavaScript apps.
TypeScript callers get compile errors, because the removed keys stay typed as
`never`. A warning also fires in development when the old shape reaches the
menu at runtime.

- **The `placement` prop and the `DropdownPlacement` type are removed.** Use
  `align` (`left`→`start`, `center`→`center`, `right`→`end`). A leftover
  `placement` is ignored, and the menu falls back to `align="start"`.
- **`{ group, items }` is removed.** Use `{ group, options }`, like `Combobox` /
  `MultiSelect` / `Select`. A leftover `items` group renders as an empty menu.
- **`component:` option rows are removed** (`DropdownComponentOption`,
  `ContextMenuComponentOption`). Use `slots: { item: fn }`. A leftover
  `component:` row renders as a plain action row from its `label`.

Also removed: the **`DropdownExposed` type**. It described a `close()`
template-ref member that `Dropdown` never had.
[ADR-0012](https://github.com/frappe/frappe-ui/blob/main/spec/adr/0012-template-ref-surface.md)
keeps `Dropdown`'s template ref empty: `v-model:open` and the `close` slot prop
cover it. It is type-only, so this break is loud.

**What to do:** see the before/afters in the
[migration guide](/docs/migration#dropdown-and-contextmenu).

#### Dropdown — disabled state reaches the menu primitive

The trigger now passes its disabled state (from `button.disabled` or a
`disabled` attribute you pass) to the underlying menu primitive. Before, only
the generated `Button` was natively disabled. A custom trigger slot with a
`disabled` attribute could still open the menu from the keyboard or with
synthetic clicks.

#### Select — `#item-*` slot prop renamed to `item` (breaking, silent) {#select-—-item-slot-prop-renamed-to-item}

`#item-prefix`, `#item-label` and `#item-suffix` on `Select` pass the option as
`item`, like `Combobox` and `MultiSelect`. The old `option` key is removed with
the rest of the deprecated surface (ADR-0008). Destructuring `{ option }` gives
`undefined`, silently. No runtime warning is possible, because destructuring a
slot prop cannot be detected.

**What to do:** search for `#item-` slots that destructure `option`, and rename
them to `item`.

```vue
<!-- before -->
<Select :options="people">
  <template #item-prefix="{ option }">
    <Avatar :image="option.image" />
  </template>
</Select>

<!-- after -->
<Select :options="people">
  <template #item-prefix="{ item }">
    <Avatar :image="item.image" />
  </template>
</Select>
```

#### Combobox — trigger sizing matches Select

The root renders as a transparent layout box, so the trigger sizes like
`Select` inside flex and grid containers. In button mode, the query is
separate from the model.

#### Combobox / MultiSelect — `#suffix` slot replaces the chevron

A new `#suffix` slot on `Combobox` (input and button modes) and `MultiSelect`,
like the one `Select` already has. When you provide the slot, it replaces the
default chevron. If your content is conditional, render a chevron yourself as
the fallback. The main use is an inline clear button. See
`Combobox/stories/Clearable.vue`.

#### Combobox — `condition` authoritative for `type: 'custom'` rows

A custom row's `condition({ query })` is now called even before the user types
after opening. So it can fully control its own visibility, based on the
selection and the typed query. Selectable rows are unchanged. This lets you
build "create new" rows directly with `condition`, with no need for a separate
`createOption` prop. See `Combobox/stories/CreateNew.vue`.

#### MultiSelect — `#summary` suppresses the phantom sizer

By default, the trigger sets a minimum width from the longest default summary
(`placeholder` or `"N selected"`), so the trigger does not change width as the
count changes. That sizing cannot predict custom text, so it is now skipped
when you provide `#summary`. The trigger then sizes to its content, and you
control the width.

### Dialog, Popover, Tooltip, HoverCard and Toast

#### Toast: the compat shims are removed (breaking, one of them silent)

`spec/toast.md` defines the official API as sonner's namespace. These four
surfaces were never part of it. They carried no `@deprecated` tag, only a
runtime warning, so a search for the tag could not find them. (A "census" below
is a count of call sites across the surveyed apps.)

**Loud: the member is gone and the call throws.**

- `toast.create({ message, … })` → `toast(message, { … })` or
  `toast.message(…)`. Census: 7 sites, helpdesk 5 and suite 2. Suite's two are
  local wrapper functions, so fixing them covers roughly 42 files downstream.
- `toast.remove(id)` → `toast.dismiss(id)`. Census: 0 sites.
- `toast.removeAll()` → `toast.dismiss()`. Census: 4 sites in suite (mail 3,
  calendar 1). An earlier count said 0; that was wrong.

**Silent, and this is the dangerous one.**

- The legacy object form `toast({ title, text, … })` is gone. Nothing throws.
  The object goes straight to sonner as the message, and sonner expects a
  string, a component or a VNode, so the toast renders empty or wrong. The
  census found no direct call sites in the surveyed apps. But a search for
  `toast(` will not find these calls; search for the `title`, `text` and
  `message` keys instead. See the before/after in the
  [migration guide](/docs/migration#toast-legacy-object).

`renderSafeHTML`, `dispatch` and the four semantic creators
(`success`/`error`/`warning`/`info`) are unchanged.

#### Toast: `description` supports the same limited inline HTML as the message (breaking, silent)

`description` passed through the options object untouched, so sonner rendered
it as text, while the message was sanitized and rendered as HTML. It now goes
through the same DOMPurify safelist (`a`, `em`, `strong`, `i`, `b`, `u`).

- **Breaking, silent:** a description that holds a `<` outside that safelist
  loses those characters. `description: 'Set <Button> variant'` rendered
  literally before. Now DOMPurify strips `<Button>` and the user sees
  `Set  variant`. There is no warning and no error.
- A census across builder, crm, gameplan, helpdesk, insights and suite found no
  toast `description` containing a `<`. The one hit was a Gameplan Cypress
  fixture for a space description, not a toast.
- Descriptions that are not strings (components, VNodes, render functions)
  pass through untouched, as before.
- **Also breaking, silent:** `toast.message` and `toast.loading` now sanitize
  their *message* and render it as inline HTML too. Before, they came from
  vue-sonner's namespace untouched, so `toast.message('<b>hi</b>')` printed the
  tags literally. Now it renders bold. This makes them consistent with
  `toast()` and the four semantic creators, and the `toast.create` migration
  advice in the entry above depends on it.
- `toast.custom` takes a component rather than a message, so only its
  `description` is covered. `toast.promise` keys its strings by state, and its
  `success`/`error` may be async functions, so only its `description` is
  covered. The state strings render as vue-sonner renders them.

This lands before the tag on purpose. Doing it in a `1.x` release would
silently change the rendered output for every existing caller.

#### HoverCard's `side`, `align` and `portalTo` use our own vocabulary (breaking in TS)

`HoverCard` took the types of these three props from `reka-ui` instead of
declaring them. So `portalTo` accepted `null` and any object, while the other
six overlays accepted `string | HTMLElement`.
`:portal-to="document.querySelector('#panel')"` compiled against `HoverCard`
and failed against `Popover`.

- `side` is now `PopoverSide`, `align` is `PopoverAlign`, and `portalTo` is
  `PortalTarget` (`string | HTMLElement`), like every other overlay.
- **Breaking in TS:** passing `null` or an object to `portalTo` no longer
  compiles. Runtime behavior is unchanged.
- `side` and `align` are not a break. reka's `Side` and `Align` resolve to
  exactly `PopoverSide` and `PopoverAlign` today.

A type cannot be narrowed inside `1.x` once it is wide, which is why this lands
before the tag rather than after.

**What to do:** pass a selector string or an element to `portalTo`.

#### SettingsDialog — open state moves to `v-model:open` (breaking, silent)

`v-model` → `v-model:open`, and `update:modelValue` → `update:open` (#1054).
`CONTEXT.md` says the visibility of an overlay is `open`, "always bound via
`v-model:open`", and lists bare `v-model` for visibility among the names to
avoid. `Dialog`'s support for both bindings is a documented exception for
`Dialog` only, and new components do not copy it. `v-model:tab` is unchanged.

**Silent break:** Vue accepts the unknown `modelValue` prop with no error, so
the dialog never opens.

**What to do:** change `v-model` to `v-model:open`. See the
[migration guide](/docs/migration#settingsdialog).

#### Dialog — `theme: 'yellow'` renamed to `'amber'` (breaking, silent)

`DialogTheme` held the library's last `yellow` (#1054). `Alert`,
`SidebarCard`, `Badge` and `Avatar` all spell the warning tone `amber`, and
`Dialog` already rendered `yellow` with the amber tokens
(`bg-surface-amber-2`, `text-ink-amber-5`). So the value name disagreed with
the token it resolved to. This applies to `icon.theme` and to the `theme`
argument of `dialog.confirm` / `dialog.danger`. Only the word changes, not the
color.

**Silent break** for JavaScript call sites: `yellow` is no longer a key in the
tone maps, so the icon renders with no tint and nothing throws. TypeScript call
sites get a union error. The same change corrected the mapping in the
[`icon.appearance` entry](#dialog-—-deprecated-surface-removed-breaking),
which used to say `warning → yellow` and now says `warning → amber`.

**What to do:** replace `yellow` with `amber`. See the
[migration guide](/docs/migration#dialog).

#### Dialog — `icon` takes a string or a component, tone moves to `theme` (breaking)

The structured `DialogIcon` object is gone. `icon` is a `lucide-*` class name
or a Vue component, and `theme` (`amber | blue | red | green`) colors the badge
behind it. The same split applies to `dialog.confirm`, `dialog.danger` and
`dialog.prompt`, which already had a top-level `theme`.

- **Loud in development, silent in production:** an object still passed to
  `icon` renders an empty icon badge. The circle paints in the neutral tone
  with no glyph in it. A development build warns once per component and prop:
  `[frappe-ui] Dialog.icon received a plain object ...`.
- **Loud in TypeScript:** the `DialogIcon` export is removed.
- `paddingTop` accepts a number again. A length with no unit never reached the
  CSSOM, so `:padding-top="80"` removed the position padding and added nothing
  back. A number is pixels now.
- Styling hooks: `data-slot="content"` on the card, `data-slot="icon"` on the
  header badge, `data-slot="actions"` on the footer row. BottomSheet's content
  carries `data-slot="content"` too, and the sheet finds itself through that
  hook instead of a class name.

**What to do:** pass the icon name or component to `icon`, and the tone to
`theme`. See the
[migration guide](/docs/migration#dialog-icon-theme).

#### `dialog.*` actions are typed `ImperativeDialogAction` (breaking, loud)

Two different action shapes shared the name `DialogAction`. The component's
`actions` prop keeps it. The array for the imperative helpers is
`ImperativeDialogAction`, which the root now exports. Its `onClick` receives
`{ close, setError }` and is awaited. This changes types only.

#### Toast — the default duration is 4000ms, and the option types are exported

- No behavior change. The toast container never set a duration, so
  vue-sonner's own 4000ms applied, while `spec/toast.md` promised 5000ms. The
  spec and the docs say 4000ms now. Pass `duration` per toast to change it.
- `ToastOptions`, `ToastAction` and `ToastId` are exported from `frappe-ui`. An
  app that wraps `toast` no longer imports types from vue-sonner, which it does
  not depend on.
- `ToastProvider` still takes no props, on purpose.

#### Documented, not changed: Dialog, Breadcrumbs and Alert contracts

- `Dialog.Title`, `Dialog.Description` and `Dialog.Close` are public parts. A
  `bare` dialog needs `Dialog.Title` for its accessible name.
- Dialog `message` stays. It is the body of a confirm-style dialog, and it is
  announced with the dialog through reka's `DialogDescription`.
- `BreadcrumbItem` keeps its open index signature, so a crumb can carry extra
  fields for the `#prefix` / `#suffix` slots.
- Alert and SidebarCard keep `data-color` for tone. `data-theme` is the
  light/dark attribute on the document, which is why the tone hook does not use
  that name. `PHILOSOPHY.md` lists it with the other styling hooks.
- Alert `icon: true` means "the theme's automatic icon", the same as leaving it
  unset.

#### SettingsDialog — `SettingsBody`'s exposed type

`SettingsBody`'s exposed `viewportElement` now has a type,
`SettingsBodyExposed` (ADR-0012), exported from `frappe-ui`. No behavior
change.

#### Portal target for embedded apps (additive) {#portal-target-for-embedded-apps}

- `portalTo` on `Popover`, `HoverCard`, `Dropdown`, `Select`, `Combobox` and
  `MultiSelect` no longer declares a `'body'` prop default. An app that is not
  embedded still gets `'body'`, now as a fallback. No existing call behaves
  differently.
- New `usePortalTarget` / `providePortalTarget` / `portalTargetKey` exports let
  a host page that embeds your app redirect every overlay at once. See
  [`spec/portal-target.md`](https://github.com/frappe/frappe-ui/blob/main/spec/portal-target.md).

#### Dialog — v1 spec

- Flat top-level props (`title`, `message`, `icon`, `size`, `position`,
  `paddingTop`, `actions`) are the standard way. The legacy `options` blob is
  removed; see
  [deprecated surface removed](#dialog-—-deprecated-surface-removed-breaking).
- `v-model:open` is the standard binding. `v-model` (`modelValue`) still works,
  with no warning.
- New props: `dismissible` (default `true`, replaces
  `disableOutsideClickToClose`), `bare`, and `showCloseButton` (default `true`,
  independent of the automatic header).
- The standard slots are `#default`, `#title` and `#actions` (with slot props
  `{ close, actions }`). The legacy `#body*` slots are removed.
- `icon.theme` (`amber | blue | red | green`) replaces `icon.appearance`, which
  is removed.
- The automatic header no longer shows "Untitled" when there is no title.

#### Dialog — imperative `dialog.*` API

- New callback-based helpers: `dialog.confirm()`, `dialog.danger()`,
  `dialog.prompt()`. The `onConfirm` callback runs on click. If it resolves,
  the dialog closes. If it throws, the dialog stays open and shows the thrown
  message inline. The action button shows a loading state until `onConfirm`
  settles. Each helper also returns a handle right away, with `close()` to
  dismiss the dialog from code.
- `<FrappeUIProvider>` now renders `<Dialogs />` next to `<Toasts />`, so apps
  wrapped with the provider get the imperative dialogs with no extra setup.
  `<Dialogs />` is still exported for apps that do not use the provider.
- `ConfirmDialog` and `confirmDialog()` are removed (see below). Use
  `dialog.confirm()` / `dialog.danger()`.
- New root exports: `DangerArgs`, `DialogControl`, `PromptControl`,
  `DialogHandle`, `PromptFieldValidator`. `DialogSlotProps` is exported from
  the `Dialog` entry file.

#### Dialog — deprecated surface removed (breaking)

Every member marked `@deprecated` is deleted, per
[ADR-0008](https://github.com/frappe/frappe-ui/blob/main/spec/adr/0008-no-deprecated-members-in-1-0-0.md).
Nothing is aliased and nothing warns.

- **Breaking, silent:** the `options` blob prop and the `DialogOptions` type are
  gone. It bundled `title`/`size`/`icon`/`actions` into one object. An
  `:options="{...}"` call site still compiles, because Vue drops the unknown
  prop as an unused attribute. But the dialog silently loses its title, size
  and actions. Use the flat top-level props.
- **Breaking, silent:** `disableOutsideClickToClose` is gone. It still lands as
  an unused attribute, and `dismissible` (the inverse) defaults to `true`, so
  the dialog silently becomes dismissible. Use `dismissible`.
- **Breaking, silent:** `icon.appearance` and `DialogIconAppearance` are gone.
  Only `icon.theme` remains. An `appearance` key is dropped, so the icon
  renders with no tone. Map `warning → amber`, `info → blue`, `danger → red`,
  `success → green`.
- **Breaking, silent:** the legacy `#body`, `#body-content`, `#body-main`,
  `#body-title` and `#body-header` slots are gone. Vue drops an unknown named
  slot with no error, so a call site you missed renders nothing where that
  slot's content used to be. Use `#default`, `#title` and `#actions`. `#body`
  maps to `bare` + `#default`.
- **Breaking:** the callable context on action `onClick` is gone. The context
  used to be callable as well as a plain object (`ctx()` closed the dialog). It
  is `{ close }` only now, so calling it as a function throws
  `TypeError: ctx is not a function`.
- **Breaking:** `defineExpose({ close })` and the `DialogExposed` type are gone.
  Dialog exposes nothing on its template ref (ADR-0012). A template-ref
  `.close()` call throws a `TypeError`. Use `v-model:open = false`, or the
  `close` slot prop. There were zero known call sites.
- **Breaking:** `ConfirmDialog` and `confirmDialog()` are deleted. The import
  fails, so the build names every call site. Use `dialog.confirm()` /
  `dialog.danger()`.

**What to do:** see the before/after for the silent breaks in the
[migration guide](/docs/migration#dialog).

#### Popover — v0 API removed (breaking)

Every member marked `@deprecated` is deleted, per
[ADR-0008](https://github.com/frappe/frappe-ui/blob/main/spec/adr/0008-no-deprecated-members-in-1-0-0.md).
Nothing is aliased and nothing warns.

- **Breaking, silent:** the `#target`, `#body` and `#body-main` slots are gone.
  Vue drops an unknown slot with no error, so a call site you missed renders a
  popover with no trigger, or an empty one. Use `#trigger` and `#default`.
- **Breaking, silent:** `#trigger` wires the click itself, through reka's
  `PopoverTrigger`. A click handler carried over from `#target` toggles the
  popover a second time, so it opens and closes on one click.
- **Breaking, silent:** the `togglePopover` and `updatePosition` slot props are
  gone. `toggle` replaces the first. reka repositions on its own, so the second
  has no replacement.
- **Breaking, silent:** `placement`, `show`, `hideOnBlur`, `matchTargetWidth`,
  `trigger`, `hoverDelay`, `leaveDelay`, `popoverClass` and `transition` are
  removed, and the `update:show` emit no longer fires. An unknown prop is
  ignored, so the popover renders in its default position and state.
- **Breaking, silent:** attributes on `<Popover>` are no longer inherited. They
  used to land on a wrapper that the legacy `#target` rendered. `#trigger`
  renders its child directly (as-child), with no wrapper. Move `class` and
  `style` onto the element inside `#trigger`.
- **Breaking:** the `PopoverPlacement` and `PopoverLegacySlotProps` types are
  removed. Use `PopoverSide` + `PopoverAlign` and `PopoverSlotProps`. The import
  fails, so the build names every call site.
- Fixed: `CalendarWeekDayEvent` passed `placement="center"` in month view,
  which is not a side, and reached reka as one. It is now `side="bottom"` +
  `align="center"`.
- **Breaking, silent:** the slot props are `{ open, close, toggle }`. `open` is
  now the boolean state, like `Dropdown`, `Select`, `MultiSelect`, `HoverCard`
  and `Sidebar`. The `open()` method it used to be had no callers, because
  `#trigger` opens itself. `isOpen` is gone; read `open` instead. A
  destructured `isOpen` becomes `undefined` with no error, so styling that
  depends on it silently stops applying.
- Fixed: `MonthPicker` styled its panel through `popoverClass`, which already
  did nothing, so the panel rendered with no surface at all. It uses the
  standard panel now.
- Fixed: `:dismissible="false"` still closed on `Escape`. Only the
  outside-click path was wired, while `CONTEXT.md` defines `dismissible` as
  covering both.

**What to do:** see the before/after for each silent break in the
[migration guide](/docs/migration#popover-hovercard-tooltip).

#### NestedPopover — removed (breaking)

**Breaking:** `NestedPopover` is deleted. It never nested anything. It was the
library's last popover built on `@headlessui/vue` + `@popperjs/core`, and
`@popperjs/core` leaves `dependencies` with it. The import fails, so the build
names every call site.

**What to do:** use `Popover`.

#### Tooltip — vocabulary aligned with Popover and HoverCard (breaking)

- **Breaking, silent:** the delay props on Tooltip, TooltipProvider and
  HoverCard now use milliseconds. For example, change `0.5` to `500`. Run
  `overlays-v1` to convert fixed values. It reports expressions it cannot
  convert, for you to check by hand.
- **Breaking, silent:** `placement` is renamed to `side`, like `Popover` and
  `HoverCard`. An unknown prop is ignored, so the tooltip keeps working and
  points at its default side.
- **Breaking, silent:** `arrowClass` is removed, because the library does not
  use props that inject classes. Style the arrow through
  `[data-slot="arrow"]`. It was documented as the arrow's fill, but was mostly
  used to nudge the bubble's position, which the new `offset` prop does
  directly.
- Added: `offset` sets the gap in px between the trigger and the bubble, like
  `Popover` and `HoverCard`. The bubble is no longer fixed at 4px.
- Added: `[data-slot="content"]`, `[data-slot="bubble"]` and
  `[data-slot="arrow"]` styling hooks.
- **Breaking, silent:** the `#body` slot is replaced by `#content`, which
  renders *inside* the bubble instead of replacing it. `#body` is not one of
  the library's standard slot names, and it had the wrong shape: it removed the
  bubble's surface. So six of the seven call sites in the apps copied
  `rounded bg-surface-gray-10 px-2 py-1 text-xs text-ink-base shadow-xl` by hand
  to put it back. Moving to `#content` usually means deleting that wrapper. Vue
  drops an unknown slot with no error, so a call site you missed shows an empty
  tooltip.
- Added: `bare` renders `#content` without the bubble, for content that brings
  its own surface, such as an image preview. The arrow still renders. This is
  the proper way to do what `#body` was used for.
- `TooltipBubble` is no longer exported. It is the internal bubble shared by
  `Tooltip` and `Button`, with no call sites outside the library.
- `Tooltip` keeps `#default` as the **trigger**, on purpose. It is the one
  exception in the library to the standard slot names, and `PHILOSOPHY.md`
  records it. Over 200 call sites use the `<Tooltip text="…"><Button /></Tooltip>`
  shorthand, and renaming the slot would change every one of them for no change
  in behavior.

**What to do:** see the before/after in the
[migration guide](/docs/migration#tooltip).

#### HoverCard — `open()` and `close()` on the template ref

- Added: `open()` and `close()` on the component instance, like `Popover`.
- The trigger slot's props are now typed (`HoverCardSlotProps`) instead of
  `any`.

#### BottomSheet — focus stays inside an open sheet

The sheet does not focus its first field on open, so it does not bring up the
keyboard on a phone. That also left focus on the trigger behind the overlay,
with nothing holding it, so `Tab` moved through the page behind an open modal.
The sheet now takes focus itself on open. The keyboard still stays down.

### Sidebar, tabs and navigation

#### `SidebarItem` attributes land on the link or the button (breaking, silent)

A `SidebarItem` is a row container that holds the link or the button, with the
`#suffix` area next to it. Every attribute you wrote on the component used to
stop at that container, so `target`, `rel`, `id`, `title`, `data-*` and
`aria-*` never reached the control. They now land on the control. `class`,
`style` and event listeners stay on the container, which is what a row
background, a drag-and-drop ring and a `@drop` over the suffix need.

- **Who is affected:** apps that select a row by an attribute they pass in
  (`data-testid`, `id`), and apps that set `aria-label` on a row.

**What to do:** select the container with `[data-slot="sidebar-item"]`, and the
control with `[data-slot="sidebar-item"] > a` or `> button`. An `aria-label`
you pass now wins over the one taken from the label text, so drop any
workaround for the old behavior.

#### `Sidebar` is the `<nav>` landmark; sections are groups

`Sidebar`'s root element is a `<nav>`, labelled `Main`. The new `ariaLabel`
prop changes the label. `SidebarSection`'s body is a `<div role="group">`, not a
nested `<nav>`, and it takes its accessible name from the section's heading.
Before, only a `collapsible` section had a name.

- **Who is affected:** apps whose sidebar body wraps rows in their own `<nav>`,
  and CSS or tests that select `nav` inside the sidebar.

**What to do:** turn the `<nav>` wrappers your app writes inside `Sidebar` into
`div`s, so the page reports one navigation landmark. Select
`[data-slot="sidebar-section"] [role="group"]` for a section body.

#### `SidebarHeader` without `menuItems` is no longer a button

A header with no `menuItems` rendered a dropdown trigger anyway: it took focus,
showed a hover background and a chevron, and opened an empty menu. It now
renders a plain `<div>` with the same box, without the chevron and the tab
stop. The logo and the title sit in the same place either way.

- **Who is affected:** apps that style or query the header's inner `<button>`,
  or that relied on the chevron to signal a menu that was never there.

**What to do:** nothing, unless a selector targets that button. Pass
`menuItems` to get the trigger back.

#### `SidebarItem.icon` takes the same strings as every other icon (breaking, silent)

`SidebarItem` rendered its `icon` prop through a private `SidebarItemIcon`
component, which printed any string that was not a lucide name as text. It now
uses the shared `Icon`, so a `lucide-*` class, an emoji and a component render
exactly as before, at the same `size-4 text-ink-gray-6`.

- **Who is affected:** rows with a plain-text `icon`, for example
  `icon="home"` or `icon="AB"`. The text used to show. It now renders nothing
  and warns once in development, the same as `Icon`, `Button` and
  `MobileNavItem`.

**What to do:** pass a `lucide-*` class for an icon. Put initials and other text
in the `#prefix` slot:
`<SidebarItem><template #prefix>AB</template></SidebarItem>`.

#### Tabs — a clicked tab clears when the route leaves its page (fix)

In route mode, a tab without a route that you click stays selected until the
route moves. "Moves" used to mean "a different tab matches". So opening a child
route under one routed tab (`/inbox` → `/inbox/42`) left the clicked tab
selected on a page it does not stand for. A navigation that lands on a
different path now clears it too.

- A navigation that did not land keeps the clicked tab: one stopped by a guard,
  one cancelled by a newer navigation, or a duplicate of the URL already
  showing. A redirect clears it, because the redirect target lands.
- **The trade-off:** a navigation that changes only the query or the hash and
  keeps the same tab matched (`/inbox` → `/inbox?page=2`) no longer clears the
  click. A panel that keeps its own state in the URL makes exactly that
  change, and clearing there threw the user out of the panel they were in. A
  change of matched tab with no navigation behind it does still clear it: a
  trigger's `route` prop changing, or a routed trigger mounting that matches the
  current URL.
- Tabs still works with no router installed. The listener is registered only
  when a router is present, and is removed on unmount.

#### TabButtons — `focus()` on the component ref

A template ref now exposes `focus(options?)`, the method every focusable
control in the library shares. It focuses the selected option, or the first
enabled one when nothing is selected. Disabled options are skipped, including
`route` and `href` options that render disabled. A group with no options, or
with every option disabled, does nothing. `FocusOptions` is passed through,
`preventScroll` included. The type is exported as `TabButtonsExposed`.

#### `Rail` renamed to `SidebarRail`, `RailItem` to `SidebarRailItem` (breaking) {#rail-renamed-to-sidebarrail-railitem-to-sidebarrailitem-breaking-loud}

The rail joins the Sidebar family by name. Nothing else changes. `SidebarRail`
is still a bare frame that renders on its own or next to `Sidebar`. `Sidebar`
does not own the rail layout, and the rail is not a collapsed mode of the
sidebar. Props, slots and events are unchanged.

- `RailItemProps` is now `SidebarRailItemProps`, and the root exports it the
  way it exports `SidebarItemProps`.
- **Breaking, silent:** the styling hooks follow the name. `data-slot="rail"`
  becomes `"sidebar-rail"`, `rail-item` becomes `sidebar-rail-item`, and the
  same goes for `rail-item-indicator` and `rail-item-badge-dot`. A CSS rule
  written against an old value still parses. It just stops matching.
- `DesktopShell`'s `#rail` slot keeps its name. It names a layout area, not the
  component that goes in it.

There is no alias export. The import fails, so the build names every call site.

**What to do:** find and replace the old names, as with every other component
rename in v1. Update CSS selectors on the `data-slot` values.

#### TabButtons: `class` on an option is replaced by `data-value` (breaking, silent in JS)

The library customizes through slots and `data-*` attributes, never through
props that take class names. `class` on a `TabButton` option was the last
per-item class field in the library, and it added two more names to the frozen
API.

- The tab button now renders `:data-value`, so CSS can target one tab:
  `[data-slot="tab-button"][data-value="open"] { … }`. This was not possible
  before: the rendered button carried `data-slot`, `data-state` and
  `data-disabled`, but no per-value hook.
- **Breaking, silent in JS:** `class` on an option object stops applying. A
  JavaScript caller keeps compiling and loses the styling with no warning.
- **Breaking, loud:** the `NativeButtonClass` type is no longer exported.
- **Breaking:** `customClass` is removed from the `#prefix` and `#suffix` slot
  props. This is loud if you destructure it, and silent if you spread it.

The composed `Tabs` family is unchanged. There you write the `<TabTrigger>`
yourself, so a class goes on the element directly.

**What to do:** move the styling to a `[data-value="…"]` selector. See the
[migration guide](/docs/migration#tabbuttons-class) for the before/after.

#### Sidebar — deprecated config API removed (breaking)

Per ADR-0008, every member marked `@deprecated` is deleted. `Sidebar` is now a
bare frame that you compose: `SidebarHeader` / `SidebarSection` /
`SidebarLabel` / `SidebarItem` go in the default slot, as agreed in
`v1-release/plan.md`.

- **Breaking, silent:** `Sidebar`'s `header` and `sections` config-object props
  are gone. Old code still compiles, because Vue drops them as unused
  attributes, but the sidebar renders empty instead of the configured header
  and sections. Compose `SidebarHeader` and `SidebarLabel` + `SidebarItem` (or
  `SidebarSection`) directly in the default slot.
- **Breaking, silent:** `Sidebar`'s `#header-logo` and `#footer-items` slots are
  gone. They only existed to reach into the config-object layout. Old
  `<template #header-logo>` / `#footer-items>` content stops rendering. Put
  that markup directly in the default slot.
- **Breaking, silent:** `SidebarSection`'s `items` prop and `#sidebar-item`
  scoped slot are gone. It is now a plain collapsible group (`label`,
  `collapsible`, `v-model:collapsed`) whose children are `SidebarItem`s you put
  directly in its default slot. Before, it took an `items` array plus a slot to
  customize each row.
- **Breaking, silent:** `SidebarItemProps.isActive` (an alias for `active`) and
  `.condition` (a config-object visibility filter) are gone. Use `active`. Use
  `v-if` on the composed `SidebarItem` instead of `condition`.
- **Breaking, silent:** `SidebarHeader`'s `#logo` slot is renamed to `#prefix`,
  because the library uses generic slot names when one covers the case. Old
  `<template #logo>` content stops rendering, and the default logo/initial box
  shows instead.
- `SidebarItem`'s icon in the collapsed rail no longer jumps to a centered
  square and back while the sidebar's width animates. It holds one position
  through the transition. This also fixes the icon sitting 2px off the rail's
  center line.
- `SidebarSection`'s collapsible label is now a real `<button>` with
  `aria-expanded` / `aria-controls`, and works from the keyboard. It was a
  `<div>` with a click handler and no keyboard path.

**What to do:** see the [migration guide](/docs/migration#sidebar).

#### Navigation destinations use `route` and `href` (breaking)

Router destinations are now named `route` on `ListRow`, `SidebarItem`,
`SidebarRailItem` and `MobileNavItem`. Plain external URLs use `href`, and that
includes the former Button `link` prop.

TabButton options keep `route`, `href` and `onClick`, require a string
`label`, and no longer accept `tooltip`. Move extra help text into UI your app
owns.

**What to do:** run `npx destinations-v1 .`. It rewrites template props with
fixed names on components imported from `frappe-ui`. Then check by hand:
globally registered components, option objects, render functions, and
`v-bind` spreads. See the
[migration guide](/docs/migration#navigation-destinations).

#### PageHeaderBackButton — `to` is now `fallbackRoute` (breaking) {#pageheaderbackbutton-—-to-is-now-fallbackroute}

`fallbackRoute` is used only when there is no in-app history to go back to,
such as a cold load onto a deep link. Every other tap goes back through
history. The old `to` prop is removed.

A back button that always lands on one fixed route is not a back button. It
sends the user wherever the page author guessed they came from, which is wrong
for every other way into the page.

**What to do:** rename `to` to `fallbackRoute` if it already named the page
users came from. If you need a push that always happens, use a plain `Button`
with your own `router.push`.

### App shell, page header and color scheme

#### ThemeSwitcher — moved to `frappe-ui/experimental` (breaking, loud)

`ThemeSwitcher` is not being brought up to the v1 quality bar at the root for `1.0.0`
(#1094). It moves to `frappe-ui/experimental`, which has no stability promise.
It stays deprecated there while apps migrate.

- **Breaking, loud:** `import { ThemeSwitcher } from 'frappe-ui'` fails to
  resolve. Import `ThemeSwitcher` and the type `ThemeSwitcherProps` from
  `frappe-ui/experimental` instead.
- **The replacement covers the behavior, not the look.** `ThemeSwitcher`
  renders a reka-ui `RadioGroupRoot` of theme preview cards. A `Select` bound
  to the `useColorScheme` composable replaces the behavior, not the markup, so
  an app that wants the cards has to rebuild them. Changing the import is the
  smaller change and keeps the current UI.

**What to do:** change the import, or build your switcher from `Select` and
`useColorScheme`. See the before/after in the
[migration guide](/docs/migration#themeswitcher).

#### Shells — a page reads the shell it is inside (fix)

`DesktopShell` and `MobileShell` now pass their scroll element and their
`PageHeaderTarget` to everything they render, and a page prefers the shell
above it over the module-level registry. No caller code changes.

The registries answer "the shell that mounted most recently". That is the wrong
answer while two shells are mounted at once: during a desktop-to-mobile swap,
or in a test that mounts both. A `PageHeader` could teleport into the other
frame, and `useShellScrolled()` could track the other scroll element. The
registries stay as the fallback for code that `inject` cannot reach: a router
`scrollBehavior`, a navigation guard, a header teleported out of the shell.
`shellScrollContainer` itself is unchanged.

#### `DesktopShell` — `:scroll="false"` (additive)

`scroll` defaults to `true`. Pass `false` and the content area fills the
remaining height and never scrolls as a page. This is for layouts whose panes
handle their own overflow: a list-and-detail split, or a board where each
column scrolls. Apps used to fake this with `absolute inset-0`, a hardcoded
`h-[calc(100vh-3rem)]`, or `[&>div]:h-full`.

With `:scroll="false"` the shell has no scroll element, so
`shellScrollContainer` is `null` and `useShellScrolled()` stays `false`.
`DesktopShellProps` is exported and now includes the prop.

#### `useShellScrolled` — `threshold` is required (breaking, loud in TS)

`useShellScrolled()` with no argument is a type error. At runtime it warns in
development and stays `false`. The old default was 200px, which suits a long
document and nothing else: a header border that appears 200px late looks like a
bug, not like a missing argument.

**What to do:** pass `{ threshold: 12 }`.

#### `ScrollBar` — no longer exported (breaking, loud)

`import { ScrollBar } from 'frappe-ui'` fails, and so does `ScrollBarProps`.
There is no replacement. `ScrollArea` draws its own scrollbars, and `ScrollBar`
only worked inside reka-ui's `ScrollAreaRoot`, which frappe-ui does not export.
So the export named a component you could not use.

`ScrollArea.viewportClass` stays. It is the one class-name prop the library
ships, and the documented exception to the rule against class-name props in
`PHILOSOPHY.md`: the scrolling viewport is an element reka-ui owns inside the
root, so a `class` on the root cannot reach it.

**What to do:** use `ScrollArea` and its `orientation` prop.
`orientation="both"` renders one scrollbar per axis.

#### `useSheetDrag` — no longer exported (breaking, loud)

`useSheetDrag`, `UseSheetDrag` and `UseSheetDragOptions` leave the root.
`BottomSheet` still uses the composable internally and is unchanged. There is
no standalone replacement: the drag thresholds are constants tuned for that one
component. It can come back when a second component needs it.

#### Documented, not changed: shell slot names

`DesktopShell` keeps `#rail` and `#sidebar`. `MobileShell` keeps `#nav`. The
names describe areas of the screen, not components. The desktop frame has two
side areas that can appear together, and the mobile frame has one bar along the
bottom, so one shared name would have to mean three things at once.

#### `resolvedColorScheme` is a ref on `useColorScheme()` (breaking, loud)

`import { resolvedColorScheme } from 'frappe-ui'` fails. The same name now
comes from `useColorScheme()` as a read-only `Ref<'light' | 'dark'>`. So an app
reads `.value` instead of calling a function, and drops the `MutationObserver`
it needed to know when to call it again. The ref follows `setColorScheme`, and
follows the OS setting while the preference is `system`.

`colorScheme` is the preference and can be `system`. `resolvedColorScheme` is
what the page shows. `ColorScheme` and `ResolvedColorScheme` stay exported.
Internally the function is `getResolvedColorScheme`, which charts use to pick a
palette outside a component. It is not part of the package's public API.

There is no codemod, because a call has to become a `.value` read, and that
depends on the code around it.

**What to do:** replace `resolvedColorScheme()` with
`useColorScheme().resolvedColorScheme.value`, and delete your observer.

#### `useResolvedColorScheme()` reads the scheme without owning it (addition)

A new root export for a page that must not write `data-theme`: an app that
applies its own theme before paint, a page inside a host shell, or a demo in an
iframe. It returns the same read-only `Ref<'light' | 'dark'>`, read from the
document and kept current. It writes no attribute, no class and no storage
key. `useColorScheme()` applies the saved preference on its first call, so
calling it only to read creates a second writer.

Nothing changes for an app that owns the scheme: keep reading
`useColorScheme().resolvedColorScheme`.

#### `toggleColorScheme()` flips what is on screen (breaking, silent)

It used to read the stored preference. So under `system` on a dark OS, it wrote
`dark`, the value the page already showed, and the first press did nothing
visible. It now reads the resolved value, so every press changes the scheme.
Apps that shipped their own toggle for this reason can delete it.

#### `--mobile-header-height` — removed (breaking, silent)

`PageHeaderMobile` is 52px tall, fixed, and reads no CSS variable for its
height. Setting `--mobile-header-height` changes nothing in the library. Your
app can keep using the name for its own rules. The variable had no prefix, no
docs, and was not named after a component, which is the kind of variable
ADR-0017 exists to prevent.

The internal title inset follows the ADR's naming for internal variables and is
now `--_page-header-mobile-title-inset`.

**What to do:** for a header of another height, use `PageHeaderBase` with your
own class.

#### PageHeader — every prop type has a name (additive)

`PageHeaderTitleProps`, `PageHeaderMobileProps`, `PageHeaderMobileTitleProps`
and `PageHeaderBackButtonProps` are exported from the root, so a wrapper
component can extend them. `PageHeader`, `PageHeaderBase` and
`PageHeaderTarget` take no props and get no empty interface.

#### Documented, not changed: header click-to-top

A single click on the empty area of the header scrolls the page to the top. The
attributes that turn this off keep their names: `data-no-scroll-top` on
`PageHeader`, and `data-no-sheet-drag` on `BottomSheet`. Both are now
documented. There is no `data-fui-` prefix rule for data attributes.

#### Root composables and directives — renamed and shrunk (breaking, loud) {#root-composables-and-directives-—-renamed-and-shrunk}

Every change below is a **loud break**: the import fails, so the build, the
type-check or the dev server tells you. There are no silent behavior changes,
and none of these needs a before/after in the migration guide.

**`useTheme` is now `useColorScheme`.** `theme` means color tone everywhere
else in the library (`theme="blue"` on a Button, ~300 sites), so the light/dark
composable stops using the word.

```ts
// before
import { useTheme, type Theme } from 'frappe-ui'
const { currentTheme, setTheme, toggleTheme } = useTheme()

// after
import { useColorScheme, type ColorScheme } from 'frappe-ui'
const { colorScheme, setColorScheme, toggleColorScheme } = useColorScheme()
```

- `colorScheme` is **read-only**. Assigning to the old `currentTheme` ref
  changed the ref without setting `data-theme` or `localStorage`, so the app
  silently fell out of sync. Use `setColorScheme`.
- `initializeTheme` and `getSystemTheme` are gone. `useColorScheme()` already
  restores the saved preference and follows the OS on its first call.
- **The `data-theme` attribute and the `theme` `localStorage` key are
  unchanged.** App CSS that targets `[data-theme='dark']`, and users' saved
  preferences, keep working.

**Nine scroll members become two.**

```ts
// before
import { activeScrollContainer, useScrollContainer, scrollToTop } from 'frappe-ui'
const { isScrolled } = useScrollContainer({ threshold: 12 })

// after
import { shellScrollContainer, useShellScrolled } from 'frappe-ui'
const scrolled = useShellScrolled({ threshold: 12 })
shellScrollContainer.value?.scrollTo({ top: 0, behavior: 'smooth' })
```

| Removed | Use instead |
| --- | --- |
| `activeScrollContainer` | `shellScrollContainer` |
| `useScrollContainer().isScrolled` | `useShellScrolled({ threshold })` |
| `useScrollContainer().el` | `shellScrollContainer` |
| `getScrollContainer()` | `shellScrollContainer.value` (works outside `setup()` too) |
| `scrollTo(o)` | `shellScrollContainer.value?.scrollTo(o)` |
| `scrollToTop()` | `shellScrollContainer.value?.scrollTo({ top: 0, behavior: 'smooth' })` |
| `registerScrollContainer` / `unregisterScrollContainer` | internal to `DesktopShell` / `MobileShell` |
| `UseScrollContainer`, `UseScrollContainerOptions` | no replacement needed |

The `shell` prefix is on purpose: both work only while a `DesktopShell` or
`MobileShell` is mounted. `useShellScrolled` now warns once in development when
no shell is registered, instead of silently reporting `false` forever.

**Directives are `vFocus` and `vOnOutsideClick`.** `<script setup>` registers a
directive automatically only when the binding is named `vFoo`, so the old names
forced a manual alias at every call site.

```vue
<!-- before -->
<script setup>
import { onOutsideClickDirective as vOnOutsideClick } from 'frappe-ui'
</script>

<!-- after -->
<script setup>
import { vOnOutsideClick } from 'frappe-ui'
</script>
```

`visibilityDirective` is removed with no replacement (0 call sites). Use an
`IntersectionObserver` directly, or `@vueuse/core`'s
`useIntersectionObserver`.

**`useScreenSize`, `useIsMobile` and `ScreenSize` are no longer exported.** They
were a thin wrapper over a `resize` listener that the library itself never
used. Copy the ~20 lines into your app, or use `@vueuse/core`'s
`useWindowSize` / `useMediaQuery`.

#### pageMetaPlugin — removed (breaking) {#pagemetaplugin-—-removed}

- **Breaking, loud:** `pageMetaPlugin` is no longer exported, so
  `import { pageMetaPlugin } from 'frappe-ui'` fails. Delete
  `app.use(pageMetaPlugin)`.
- **Silent break:** `pageMetaPlugin` and the global mixin it installed are
  gone. A leftover `pageMeta()` component option still compiles, but nothing
  reads it, so `document.title` and the favicon quietly stop updating. See the
  [migration guide](/docs/migration#pagemetaplugin-removed).
- `usePageMeta` is unchanged, and now exports its `PageMeta` type.

**What to do:** move `pageMeta()` options to `usePageMeta`.

#### App shell family — docs, tests and slot renames (breaking) {#app-shell-family-—-brought-to-bar}

`DesktopShell`, `MobileShell`, `MobileNav`, `PageHeader`, `ScrollArea` and
`FrappeUIProvider` all keep their current exports and names. The rail was in
this list until it was renamed to `SidebarRail`; see
[the rename entry](#rail-renamed-to-sidebarrail-railitem-to-sidebarrailitem-breaking-loud).

- Every slot across the family now has a documented description. Each
  component has a docs page, a story, and Cypress tests (several had none).
- **Breaking, silent:** `PageHeaderMobile`'s `#left`/`#right` slots and
  `PageHeaderMobileTitle`'s `#icon` slot are renamed to the shared
  `#prefix`/`#suffix` names. `PHILOSOPHY.md` does not allow type-specific slots
  like `#icon` outside `Button`, and `#left`/`#right` were never among the
  standard names. Vue drops content passed to an unknown slot name with no
  error, so the old names do not warn. They just stop rendering. See the
  [migration guide](/docs/migration#pageheadermobile-family-slot-names).
- `ScrollArea` gets a `types.ts` (`ScrollAreaProps`, `ScrollAreaExposed`) and
  the styling hooks `data-slot="scroll-area"` / `"scroll-area-viewport"` /
  `"scroll-area-scrollbar"` / `"scroll-area-thumb"`. It had none.
  `viewportElement` on the template ref is now typed through
  `ScrollAreaExposed`. (`SettingsDialog`'s `SettingsBody` exposes the same
  shape, but it is typed by its own `SettingsBodyExposed`, not by
  `ScrollAreaExposed`; see
  [its entry](#settingsdialog-—-settingsbody-s-exposed-type).)
- `FrappeUIProvider`'s source folder moved from `src/components/Provider` to
  `src/components/FrappeUIProvider`, to match its file name. This is internal
  only: `import { FrappeUIProvider } from 'frappe-ui'` is not affected.
- **Breaking:** `FrappeUIProviderProps` is no longer exported. The component
  has no props, so the type was empty and was never wired to `defineProps`.
  Freezing it would lock in nothing. There were zero known consumers. The
  mismatched folder name had also hidden the whole component from the docs
  generator, so it had no docs page before.

### Keyboard shortcuts

#### `useShortcut` renamed to `useKeyboardShortcut`, config reshaped (breaking; loud in TS, silent in JS)

The import fails to resolve, so the rename itself is loud. The config is the
silent part: 14 fields become 10, and Vue drops the removed ones without a
word.

- `key` + `ctrl` + `shift` + `alt` become one `combo` string, written
  `Mod+Ctrl+Alt+Shift+<Key>`. `ctrl` never meant Control. It matched
  `ctrlKey || metaKey`, so `{ key: 's', ctrl: true }` fired on ⌘S, on ⌃S and on
  Win+S alike. `Mod+S` compares every modifier exactly, so only ⌘S fires on
  macOS, and only Ctrl+S elsewhere. The two extra ways to trigger it stop.
- `condition` becomes `enabled`, and takes a ref, a getter or a boolean.
- `triggeredOn` is removed. `onHold` selects hold mode, and a hold registration
  takes no `handler`. This ends the old surprise where `triggeredOn: 'hold'`
  fired `handler` too.
- Punctuation and digits now use a key name (`Mod+Slash`, `Mod+Shift+Digit1`),
  because `+` is the separator and `'Mod++'` splits into empty parts. Digits
  and punctuation match `event.code`, so a shifted character still resolves.
  Letters and named keys match `event.key`. The old US-layout guesswork is
  deleted.

TypeScript rejects an unknown combo at compile time. A JavaScript call site
that still passes the v0 shape logs one warning in development and never fires.

**What to do:** see the
[`useShortcut` migration](/docs/migration#useshortcut-is-now-usekeyboardshortcut).

#### Shortcut precedence is now last-registered-wins (breaking, silent)

When two shortcuts share one combo, the first one the registry reached used to
run. Now the last registration that is **enabled at the time of the keypress**
wins. `enabled` is checked before precedence, so two registrations with
mutually exclusive conditions both keep working. Suite's slides app uses that
pattern on seven combos.

A real collision, where two live shortcuts match one keypress, logs one
warning per combo in development. It names the hidden shortcut and the active
one.

#### `formatShortcutLabel` and `getActiveShortcuts` removed (breaking, loud)

Neither had a consumer in ten apps, and `formatShortcutLabel` was not used
inside the library either. Reading the registry is now internal.
`KeyboardShortcutsDialog`'s new default slot passes out the same data.

#### `KeyboardShortcutsModal` renamed to `KeyboardShortcutsDialog` (breaking, loud)

The library calls every modal a dialog. Props are unchanged. The component
gains a default slot that carries the grouped shortcuts, and a `data-slot` on
every part.

**What to do:** rename the import. See the
[`KeyboardShortcutsModal` migration](/docs/migration#keyboardshortcutsmodal-is-now-keyboardshortcutsdialog).

#### KeyboardShortcut — one combo vocabulary, and `data-slot` hooks (breaking, silent)

The root, each key, the `+` separators and the alternative combos carry a
`data-slot`. The root also carries `data-bg` when `bg` is set. Style through
those, not through a class prop. The parser also reads the key names a combo
uses, so `Digit1` renders `1` and `Slash` renders `/`.

`combo` now reads the one grammar that `useKeyboardShortcut` fires on. The older
display-only spellings are gone: a chip for a combo that can never fire is
the exact problem this family exists to remove. An unknown token renders as
written and warns once in development.

**Silent break:** `combo` stays typed `string`, because callers compute it. So
no type-check finds the call sites, and production logs nothing.

| Gone | Write |
| --- | --- |
| `Cmd`, `Command`, `⌘`, `Meta` | `Mod` |
| `Control` | `Ctrl` |
| `Option`, `Opt`, `⌥` | `Alt` |
| `⇧` | `Shift` |
| `Win`, `Windows` | nothing; the grammar has no Windows key |
| `Esc` | `Escape` |
| `Return` | `Enter` |
| `Del` | `Delete` |
| `Up`, `Down`, `Left`, `Right` | `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight` |
| `=` | `Equal` |
| `F13` and above | nothing; the grammar stops at `F12` |

The root's `role` is now `img` when `combo` is set, and absent otherwise. It
was always `note` before. A labelled `img` replaces its content for screen
readers, so a screen reader reads each key once, instead of once per chip.

`useIcons` now also applies in `bg` mode, where it was ignored.
`:use-icons="false"` now drops the arrow, Enter, Backspace and Delete icons in
both modes. The default is `true`, so a chip that never set the prop draws what
it drew before.

**What to do:** rewrite old spellings with the table above. See the
[`KeyboardShortcut` migration](/docs/migration#keyboardshortcut).

#### KeyboardShortcut — deprecated `shortcut` and unused modifier props removed (breaking)

Per ADR-0008, the deprecated `shortcut` prop (replaced by `combo`) is removed
rather than frozen. It had zero call sites. The `meta` / `ctrl` / `shift` /
`alt` boolean props are also removed: they had no real usage, and `combo`
replaces them. Both are **loud** breaks (removed props on a typed component).

The component also moved from a bare `KeyboardShortcut.vue` into its own
folder, with a `types.ts`, a docs page and a Cypress test.

#### useShortcut — `matchesShortcut` no longer public (breaking)

`matchesShortcut` is removed from the `frappe-ui` package export. Its own doc
comment already said "exported for unit tests only". It was never meant to be
public API, and it had no real usage. This is a loud break (an import error)
for anyone who imported it directly. There is no sign of any real consumer
doing so. The composable itself is now `useKeyboardShortcut`; see
[the rename entry](#useshortcut-renamed-to-usekeyboardshortcut-config-reshaped-breaking-loud-in-ts-silent-in-js).

#### KeyboardShortcutsModal / useShortcut — types, tests and docs {#keyboardshortcutsmodal-useshortcut-—-brought-to-bar}

`KeyboardShortcutsModal` gained a `types.ts` and a Cypress test (it only had
unit tests before). `useShortcut` gained a short entry on the
[composables page](/docs/other/composables). Both were renamed later in this
release, to `KeyboardShortcutsDialog` and `useKeyboardShortcut`. Read the
entries at the top of this section for the API that ships.

### Other components

#### Tree — expansion moves to a keyed `v-model:expanded` (breaking, silent)

`expanded` was a boolean that expanded everything, and each node's open or
closed state was the `expanded` field on the node object, which the component
wrote (#1142). A library must not write to the data its caller passes in: that
defeats `readonly` and frozen data, writes through to a store, and a shallow
watcher never sees it.

`expanded` is now `TreeKey[]`, the keys of the open nodes. It is replaced as a
whole on every toggle. The per-node `expanded` field is gone. `expand`,
`collapse`, `toggle`, `expandAll` and `collapseAll` on the component ref cover
what the boolean did. Their type is exported as `TreeExposed`.

- **The default flips:** an unbound tree used to open every node under
  `:expanded="true"`. It now renders only its root nodes.
- **Silent break:** a node that keeps `expanded: true` still type-checks,
  because `TreeNode` has an index signature, and the node stays closed.
  Development mode warns about the leftover field, and about the removed
  boolean model.

**What to do:** bind `v-model:expanded` to an array of keys, or call
`expandAll()` on the ref. See the [migration guide](/docs/migration#tree).

#### Base component contracts for v1 (breaking)

- `Icon` adds the standard `icon` prop and keeps `name` fully supported. Both
  accept `string | Component | null`. `icon` wins when both are passed. No
  migration is needed.
- `Progress.intervals` is now the number of segments, and `intervalCount` is
  removed. Leave out `intervals` for a continuous bar. Labels and hints now
  render independently.
- `Badge.label` accepts only `string | number`. Put rich content in the default
  slot.
- `Divider.position` is replaced by `align`. An old `position` value is ignored,
  and the action falls back to the center. `DividerAction` now accepts the
  shared Button action fields.

**What to do:** the
[base component migration guide](/docs/migration#base-component-props) has the
codemod and the manual steps.

#### CommandPalette — removed from the root export, rebuilt in `frappe-ui/experimental` (breaking, loud)

`CommandPalette` and `CommandPaletteItem` leave the root export. The family is
rebuilt as seven parts you compose (`CommandPalette`, `CommandPaletteInput`,
`CommandPaletteList`, `CommandPaletteGroup`, `CommandPaletteItem`,
`CommandPaletteEmpty` and `CommandPaletteFooter`) in `frappe-ui/experimental`,
which has no stability promise. It stays there until gameplan, helpdesk and
this site all run on it.

Four apps copied and changed the old palette instead of using it, because it
had one shape and no filtering. The new parts fit all four.

- **Breaking, loud:** `import { CommandPalette } from 'frappe-ui'` fails to
  resolve.
- **Breaking:** the `groups` prop is gone. Groups and items are markup now, so
  a group renders whatever it needs, without a `component` escape hatch.
- **Breaking:** `select` carries the value and the click that picked it. Call
  `event.preventDefault()` to keep the palette open.
- **Behavior change:** the palette filters against the query. The old one
  rendered `groups` as given and left filtering to the caller. `filterable`
  (default `true`) turns it off for server search. It is the same word
  `Combobox` and `MultiSelect` use (ADR-0009).
- **Breaking:** `Mod+K` moves to the caller. The old component registered it
  itself, and skipped it whenever a rich-text editor had focus, which put
  knowledge of the editor inside the palette.
- Every part sets `data-slot`. An item sets `data-state="active"` and
  `data-disabled`, and passes `active` and `disabled` to its slots.
- Rows go inside `CommandPaletteList`, the only part that scrolls. A list may
  hold rows and groups and nothing else, so the input, the empty state and the
  footer sit next to it.
- `@headlessui/vue` leaves `dependencies`. The palette was its last import in
  the library.

**What to do:** see the before/after for each break in the
[migration guide](/docs/migration#commandpalette).

#### Button no longer hands back `rootRef` (breaking; loud in TS, silent in JS)

`Button` exposed an untyped, writable template ref to its root element.
ADR-0012 does not allow that: a component exposes a template ref only when a
parent's script needs it and nothing else can reach it.

- **Breaking:** `buttonRef.value.rootRef` is gone. In TypeScript it fails to
  compile. In JavaScript it reads `undefined`, so guard for it.
- What it returned was never one thing. Depending on props, it was a
  `<button>`, an `<a>`, or a vue-router component instance, and you could
  assign to it.
- Nothing replaces it. If you need control from script, ask for it: a typed
  `focus(options?)` can ship in a `1.x` minor release, and additions are
  cheap.

#### Badge — `theme="orange"` removed (breaking; loud in TS, silent in JS)

`orange` was a deprecated alias that resolved to `amber`, so `theme="amber"`
renders exactly what `theme="orange"` used to. ADR-0008 keeps nothing
deprecated in `1.0.0`. The alias was never on the removal list, so no earlier
survey counted it (found by #1054).

TypeScript call sites fail at `vue-tsc`, because the `theme` union no longer
accepts the string. JavaScript call sites and bound values render the default
`gray` theme, and log a one-time warning in development that names the
component, prop and value. Check bound themes as well as literal attributes. A
status-to-theme map that returns `'orange'`, or an `?? 'orange'` default, turns
grey, and a search for `theme="orange"` does not find it.

**What to do:** replace `orange` with `amber`, including in maps and defaults.
See the [migration guide](/docs/migration#badge).

#### Badge — an unsupported `theme`, `variant` or `size` no longer crashes (fix)

`Badge` looked up a class map by theme, and then looked up that result by
variant. A theme outside the union made the second lookup read a property of
`undefined`, which threw
`TypeError: Cannot read properties of undefined (reading 'subtle')` during
render. The badge disappeared and the error took the parent render with it, so
one old colour name in a status map could blank a page.

All three props now fall back to their defaults (`gray` / `subtle` / `md`) and
warn once per bad value in development. `variant` and `size` never threw: their
lookups ended early and rendered without tint or size. But they were silently
wrong, and now they report themselves too.

The public types are unchanged. `theme` still accepts only the six supported
values, so TypeScript still rejects anything else at compile time. The fallback
is a runtime safety net for JavaScript call sites and bound values. It does not
widen the API.

#### Sprite icon trio — moved to `frappe-ui/experimental` (breaking)

The sprite-based `Icon`, `IconPicker` and `spritePlugin` leave
`frappe-ui/icons` (#904). Apps still use them, so they move to
`frappe-ui/experimental`, which has no stability promise, instead of being
deleted. `lucide-*` classes are the standard way to render icons. The named SFC
icons (`CircleCheckIcon`, `HelpIcon`, ...) stay on `frappe-ui/icons`.

- **Breaking, loud:**
  `import { Icon, IconPicker, spritePlugin } from 'frappe-ui/icons'` fails to
  resolve. Import them from `frappe-ui/experimental` instead. Changing the
  import path is the whole migration. Apps that spread `content` from
  `frappe-ui/tailwind` keep the `IconPicker` styles automatically, with no
  Tailwind change.
- `frappe-ui/experimental` exports `Icon` (sprite), and the root `frappe-ui`
  exports a different `Icon`. If you import both, rename one:
  `import { Icon as SpriteIcon } from 'frappe-ui/experimental'`.

See the [migration guide](/docs/migration#sprite-icons-—-moved-to-frappe-ui-experimental).

#### CircularProgressBar — removed (breaking, loud) {#circularprogressbar-—-removed}

**Breaking:** `CircularProgressBar` is no longer exported. The import fails. It
was a second component for the same idea as `Progress`, with hardcoded
light-mode colors and a structured `theme` object prop. One call site existed
across all consumer apps.

**What to do:** use `Progress`, or copy the old SFC into your app if you need
the round form.

#### FeatherIcon — removed (breaking)

Per [ADR-0008](https://github.com/frappe/frappe-ui/blob/main/spec/adr/0008-no-deprecated-members-in-1-0-0.md),
the deprecated `FeatherIcon` component is deleted, along with the
`feather-icons` dependency. `lucide-*` strings (or a `Component`) are now the
only supported icon forms.

- **Breaking, loud:** `import { FeatherIcon } from 'frappe-ui'` and
  `<FeatherIcon>` fail at the import.
- **Breaking, silent:** every icon-name prop across the library
  (`Button.icon` / `iconLeft` / `iconRight`, `Dialog.icon`, `Dropdown` /
  `ContextMenu` item `icon`, `TabButtons` options `icon` / `iconLeft` /
  `iconRight`, `Icon.name`) used to fall back to `FeatherIcon` for a bare
  feather-style name (for example `"edit"`). That fallback is gone. An
  unrecognized string now renders nothing, with a console warning in
  development, once per component and prop.

**What to do:** add the `lucide-` prefix to the name.

```vue
<!-- before -->
<FeatherIcon name="plus" class="size-4" />
<Button icon="plus" />

<!-- after -->
<span class="lucide-plus size-4" aria-hidden="true" />
<Button icon="lucide-plus" />
```

The core components' own hardcoded `FeatherIcon` usages were moved to
`lucide-*` in this release.

See the before/after for the silent break in the
[migration guide](/docs/migration#icons).

#### Card, ListItem, standalone Toast — removed (breaking)

Per [ADR-0008](https://github.com/frappe/frappe-ui/blob/main/spec/adr/0008-no-deprecated-members-in-1-0-0.md),
three unmaintained wrappers that shipped `@deprecated` in code are deleted, not
carried forward. All three had zero call sites across the survey of downstream
apps.

- **Breaking:** `Card` and its `.vue` file are removed. There is no drop-in
  replacement. Rebuild the title/subtitle/actions/loading layout with plain
  markup, and use `LoadingText` or `Skeleton` for the loading state.
- **Breaking:** `ListItem` and its `.vue` file are removed. There is no drop-in
  replacement. Rebuild the title/subtitle/actions row with plain markup.
- **Breaking:** the standalone `Toast` SFC (`import { Toast } from 'frappe-ui'`)
  is removed. This only affects direct use of the raw `ToastRoot`-based
  component. The imperative API (`toast()` / `toast.success()` /
  `toast.error()` / `toast.info()`) and `<ToastProvider>` are not affected.

All three fail loudly at the import. The
[migration guide](/docs/migration#card-listitem-standalone-toast-removed) has
before/after examples.

#### LoadingIndicator / LoadingText — moved to component directories (non-breaking)

The same move as `FormLabel`, for the same reason: both now live at
`src/components/LoadingIndicator/` and `src/components/LoadingText/`, instead
of as bare `.vue` files directly under `src/components/`. Each gains `types.ts`
(`LoadingIndicatorProps`, `LoadingTextProps`), stories, a docs page and Cypress
tests. The import path
(`import { LoadingIndicator, LoadingText } from 'frappe-ui'`) is unchanged.

They stay separate from `Spinner` and `Skeleton`. Usage across the surveyed
apps shows real, separate demand: `LoadingIndicator` (~60 files) and
`LoadingText` (~11 files) are both in active use, not duplicates.

#### Icon — docs page and stories added

`Icon` had no `stories/` folder, so it did not appear in the docs site, even
though it is a public export. It now has a docs page and two stories (the
lucide string form, and the `Component` form).

#### `Pill` unexported, `ThemeSwitcher` warns in development {#legacy-components-—-dev-mode-warnings}

`Pill` is no longer exported from the package entry point. It stays an internal
part of `TabButtons`.

`ThemeSwitcher` moved to `frappe-ui/experimental` and stays deprecated there.
It logs a one-time deprecation warning in development.
For new theme switchers, compose `Select` with the `useColorScheme` composable.
See [the ThemeSwitcher entry](#themeswitcher-—-moved-to-frappe-ui-experimental-breaking-loud).

#### Divider — `action.handler` removed (breaking)

Per [ADR-0008](https://github.com/frappe/frappe-ui/blob/main/spec/adr/0008-no-deprecated-members-in-1-0-0.md),
`action.handler` is deleted, not kept with a warning. There were zero call
sites across the survey. It is a silent break: a leftover `handler` is dropped
as an unknown key, so the action button renders but does nothing on click. In
action mode the divider still reads as a separator for assistive technologies.

**What to do:** use `action.onClick`. See the
[migration guide](/docs/migration#divider).

#### GridLayout — removed (breaking)

- **Breaking:** `GridLayout` is no longer exported. It was a thin passthrough to
  `grid-layout-plus`, with no docs page and no tests. The import fails, so the
  build names every call site.
- `grid-layout-plus` is removed from `dependencies`. Nothing else in `src/`
  imported it.
- The deleted component had two bugs, so if you now wire up `grid-layout-plus`
  yourself, expect different behavior:
  - `cols` and `rowHeight` were read once at setup inside a `reactive()`
    options object, not `computed`, so changing either prop after mount did
    nothing.
  - The drag placeholder color was a hardcoded `#b1b1b1`, not a theme token, so
    it ignored dark mode.

**What to do:** depend on `grid-layout-plus` directly.

### Lists

#### List — select-all follows items that change in place (fix)

`<ListRows>` updated the set of rows that the header's select-all covers only
when `items` was replaced with a different array. A row pushed in or spliced
out, an entry swapped in place, a changed id, or a changed `rowKey` left
select-all working from old values: it checked rows that were gone and missed
rows that were there. It now tracks the same identities the rows render with.

Selection itself is still yours to manage: a removed row's value stays in
`v-model:selection` until you drop it.

#### `frappe-ui/list` — responsive columns, and the CSS hook contract frozen (breaking)

`List.columns` now takes a breakpoint object as well as a plain array:

```vue
<List
  :columns="{
    base: ['minmax(0,1fr)', '80px', '64px'],
    md: ['minmax(0,1fr)', '140px', '100px'],
    lg: ['minmax(0,2fr)', '180px', '120px'],
  }"
>
```

`base` is required and applies from zero width. Every other key names a
breakpoint from your own Tailwind `screens`. It applies from that width up to
the next key you supplied, so a breakpoint you leave out keeps the template
below it. Each value replaces the whole template. Nothing is merged track by
track, so a breakpoint can also change the number of tracks. Changing the number
does not hide cells: pair it with matching visibility classes on the header and
rows.

The switch is plain CSS, generated from your app's own breakpoint values. So
the tracks change together with your `md:` utilities, and the server-rendered
markup is already correct: there is no viewport measurement, no resize
listener, and no flash on first paint. Arrays keep working exactly as before. A
key can name any screen your config defines, not only a plain width. A
`{ min, max }` screen gives a tier that ends where the screen ends, and `{ max }`
and `{ raw }` screens work too. Each tier applies in exactly the same places as
that screen's own variants.

Responsive columns need the frappe-ui Tailwind preset, because the preset knows
your breakpoints. Without it, a breakpoint object uses its `base` tier at every
width.

A key that is not one of your screens is ignored: `{ base, medium }` renders
`base` everywhere, because `medium` names no breakpoint. Screen names come from
your Tailwind config, so `ListColumnsByBreakpoint` keeps an open index
signature, and the type cannot reject the key. A development build now warns
instead. The warning names the key and lists the screens it could have been. It
is removed from production builds.

The list family's public CSS hooks for v1 are now exactly `--list-gap` and
`--list-row-padding-x` (with the preset shortcuts `list-gap-*` and
`list-row-px-*`). The changes you can see from freezing them:

- **`--list-columns` and `list-cols-[…]` are gone.** Column templates come from
  the `columns` prop, which now covers the responsive case the hook existed
  for. The variable is internal (`--_list-columns`), and setting it by hand is
  not supported.
- **Every `List` owns its columns.** A wrapper's `--list-columns` used to
  override a nested list's own `columns` prop, with `[--list-columns:initial]`
  as the way out. Nested lists now always keep their own template, or the
  default feed template when they set none.
- **Both remaining hooks work from any ancestor.** They resolve through `var()`
  fallbacks where they are used, so one declaration on a wrapper styles every
  list inside it.
- **Internal variables are renamed with a `--_list` prefix**, and are
  explicitly not API: `--list-columns-default` → `--_list-columns` (plus one
  `--_list-columns-<breakpoint>` variable per tier and one generated
  `--_list-tier-<screen>`), `--list-checkbox-width` → `--_list-checkbox-width`,
  `--list-row-height` → `--_list-row-height`. None of them was documented.
  Anything that targets the old names breaks. Row height is the `rowHeight`
  prop. Overriding the variable would break `virtual` windowing, so it is not a
  hook on purpose, and it stays one number at every width.
- **Internal variables reset at every `List`.** A list nested inside another
  list no longer inherits the outer list's `columns` template, checkbox inset,
  or `rowHeight` when it does not set those props itself. This was an existing
  leak, fixed during the freeze.
- **`--list-row-padding-x` now reaches static rows too.** Before, only
  interactive rows and the header used the hook, so a static table with a
  header came out misaligned when it was set. Now one declared value applies to
  every row and the header. The defaults when it is unset do not change
  (interactive rows `0.75rem`, everything else flush).

**What to do:** replace `class="max-sm:list-cols-[auto_minmax(0,1fr)_auto]"`
with a `base` tier in the `columns` prop. Delete any `[--list-columns:initial]`;
they are no longer needed. Stop targeting the renamed internal variables.

The rules behind this, which apply to every future component with CSS hooks,
are in
[ADR-0017](https://github.com/frappe/frappe-ui/blob/main/spec/adr/0017-css-variable-styling-hooks.md).

#### `frappe-ui/list` — row state and slot vocabulary (breaking, silent)

- `ListRowBase` now uses `data-state="active|inactive"`, plus separate boolean
  `data-selected` and `data-interactive` attributes.
- `ListGroup`'s `#header` slot is renamed to `#label`.
- `ListHeaderCellSort`'s `#suffix` slot is renamed to `#sort-indicator`. Its
  edge-aware placement is unchanged.

**What to do:** run `npx list-v1 .` for the mechanical selectors and the slots
with fixed names. See the [migration guide](/docs/migration#list-family) for the
manual checks.

#### ListFilter — removed (breaking)

**Breaking, loud:** `ListFilter` is no longer exported, so the import fails. Its
internals (`SearchComplete`, `FilterIcon`) are gone with it (#992, #999). No
consumer app used it.

**What to do:** build filter UI in your app with `Select` and `Combobox`.

#### ListView family — moved to `frappe-ui/experimental` (breaking)

`ListView` is not being brought up to the v1 quality bar at the root for `1.0.0`.
`frappe-ui/list` is the recommended building block for new code, but it is a
narrower family that you compose, by design. It has no equivalent for
`ListView`'s config-driven columns: resizable widths, per-column
`getLabel`/`prefix` functions, cell tooltips, excluding disabled rows, and the
built-in select banner. So instead of freezing all 13 exports at the root
without deprecation (12 components: `List` and `ListView` are two names for one
component), the family moves to `frappe-ui/experimental`, which has no
stability promise. It stays there until `frappe-ui/list` can do everything it
does.

**Breaking, loud:** `import { ListView, ... } from 'frappe-ui'` fails to
resolve.

**What to do:** import from `frappe-ui/experimental` instead: `List`,
`ListView`, `ListEmptyState`, `ListFooter`, `ListGroupHeader`, `ListGroupRows`,
`ListGroups`, `ListHeader`, `ListHeaderItem`, `ListRow`, `ListRowItem`,
`ListRows`, `ListSelectBanner`.

### Editor

#### The editor's `UploadedFile` is now `UploadedMedia` (breaking)

`frappe-ui` and `frappe-ui/editor` both exported a type named `UploadedFile`,
and the two shapes did not match. The editor type is now `UploadedMedia`. The
root `UploadedFile` keeps its name and its shape.

- **`upload` fits `uploadFunction`.** The root `UploadedFile` is now a type
  alias, not an interface, so `useEditor({ uploadFunction: upload })` compiles.
  Before, TypeScript reported TS2322 because the index signature was missing.
  A bare `upload` stores a private file that is attached to nothing, so
  [pass an owner document or `private: false`](/docs/migration#editor-option-types).
- **`UploadedFile` no longer merges.** A type alias does not support
  declaration merging, so `declare module 'frappe-ui'` cannot add fields to it.
  Extend it instead: `type MyFile = UploadedFile & { ... }`.
- **Who is affected:** code that imports `UploadedFile` from
  `frappe-ui/editor`. TypeScript reports the missing export.

**What to do:** rename the import to `UploadedMedia`. See the
[migration guide](/docs/migration#editor-option-types).

#### Editor suggestion roles and fixed-menu size have explicit names (breaking)

Suggestion configuration now calls the rendered mention node `nodeView` and the
suggestion popup `listComponent`. Both replace the unclear `component` key.
`EditorFixedMenu.buttonSize` is now `size`, like the rest of the component
library. TypeScript reports the removed names.

**What to do:** in JavaScript, run the `editor-v1` codemod for fixed menus.
Migrate suggestion options by hand, because the replacement depends on the
component's role. See the
[migration guide](/docs/migration#editor-suggestion-and-fixed-menu-names).

#### Editor kit, upload and menu options are typed (breaking)

Every kit member, the upload handler and the two floating menus now have a
named option type. TypeScript reports a misspelled or removed key at the call
site. The runtime ignores it, as it always did.

- **StarterKit drops `code`, `codeBlock` and `link`.** The frappe `Code`,
  `CodeBlock` and `Link` extensions own those names, so the three keys never
  reached an extension. Delete them.
- **A kit's `starterKit` leaves out `heading`.** The kit's own top-level
  `heading` member overwrites it. Move the value up one level.
- **`InlineKit.starterKit` accepts only `false` per member.** InlineKit
  registers a stock extension or none, so `bold: { HTMLAttributes: … }` was
  read as "keep bold" and its options were dropped. The new
  `InlineStarterKitOptions` type says so.
- **`slashCommands` honours `items`.** `{}` keeps the built-in menu, `false`
  removes it, and `{ items }` now replaces the built-in list, where it used to be
  ignored. `items` takes a ref, a getter or a plain array, and is read every time
  the menu opens.
- **`toc` and `styleClipboard` are off by default in `RichTextKit`.** Both add
  UI most editors never show: a table-of-contents node and a format painter.
  Add `toc: {}` or `styleClipboard: {}` where you use them. `imageViewer` stays
  on.
- **Mention and tag items are `{ label, value }`.** `label` is the text, and
  `value` is the stored id. Extra fields are yours: the list passes your own
  object to the item slot untouched, so an avatar or a colour still reaches the
  template. `getMentions()` returns the same two fields.
- **`UploadedMedia.file_url` is required**, and the handler type is exported as
  `UploadFunction`. A handler may take a second `MediaUploadRequestOptions`
  argument to report progress. A handler with one argument still compiles.
- **`EditorBubbleMenu` and `EditorFloatingMenu` share `EditorMenuOptions`.**
  `side`, `align`, `strategy`, `offset`, `flip`, `shift`, `hide`, `inline`,
  `scrollTarget` and `shouldShow` are the whole supported set.
- **The menus position with `side` and `align`**, the same two axes as
  `Popover` and every overlay built on it, with the same `PopoverSide` and
  `PopoverAlign` types. `placement` and `EditorMenuPlacement` are removed.
  `placement: 'top-start'` becomes `side: 'top', align: 'start'`, and a bare
  `placement: 'bottom'` becomes `side: 'bottom'`. If you set neither, TipTap's
  own default still applies: `top` for the bubble menu and `right` for the
  floating menu.
- **The rest of TipTap's Floating UI options are gone.** The prop used to take
  all of them, so `arrow`, `size`, `autoPlacement`, `onShow`, `onHide`,
  `onUpdate`, `onDestroy`, and the object forms of the `offset`, `flip`,
  `shift`, `hide` and `inline` middleware type-checked and reached Floating UI.
  They are removed. Replace an object form with `true` to keep the middleware
  on its defaults, or drop the key: `flip: { fallbackPlacements: ['bottom'] }`
  becomes `flip: true`.
- `Editor.extensions` and `useEditor({ extensions })` take TipTap's
  `Extensions`, so a nested array of extensions is accepted.

New exports: `UploadFunction`, `MediaUploadProgress`, `InlineStarterKitOptions`,
`CommandItem`, `SlashCommandsOptions`, `EditorMenuOptions`,
`EditorMenuShouldShowContext`.

**What to do:** the
[editor migration guide](/docs/migration#editor-option-types) lists the edits
per file.

#### Editor — mentions open after brackets and quotes

Typing `@` after an opening bracket or quote (`(@jane`, `[@jane`, `"@jane`) now
opens the mention list. TipTap only allowed a space before the trigger, so those
sequences never matched. Emails (`jane@example.com`) still do not open it.

`SuggestionExtension.configure` accepts `allowedPrefixes` for custom suggestion
extensions that need the same behaviour.

#### Editor — images and embeds resize from a bottom-right corner handle

Selecting an image, video or embed used to show two vertical handles centered
on its left and right edges. They sat in the middle of the media, were easy to
miss, and only responded to horizontal drags. A selected image or embed now
shows one handle in its bottom-right corner, with the diagonal resize icon that
every OS window and image editor already uses. It uses the same 28px button as
the actions menu in the opposite corner, mirrored across the media.

The drag reads both axes. The pointer's movement is projected onto the diagonal
that keeps the aspect ratio, so dragging down grows the media (an edge handle
could not do that), and a diagonal drag keeps the corner under the cursor.
Media keeps its aspect ratio, as before. Keyboard resize on a focused handle now
takes Up/Down as well as Left/Right. The embed's handle responds to the arrow
keys for the first time; they used to move the caret out of the node instead.

Videos keep the edge handles. Their playback bar takes the bottom of the frame,
so a corner handle there would either sit on the controls or float above them.

No API change: the handles and controls are internal to the media and iframe
node views.

#### Editor — video controls sit on a gradient instead of a floating pill

The playback row was a dark pill set in from the video's edges. It drew a hard
rectangle across the picture, and had to stay dark enough for white icons on
any frame. It now spans the full width of the video, on a gradient that fades
up into the footage, so the contrast is only where the controls are. The
gradient follows an eased curve to a lighter peak, instead of a straight
two-stop fade, which left a visible edge where the band ended.

The row itself was restyled to look like a player rather than a toolbar: solid
play/pause and volume icons, a seek bar the width of the video with a round
thumb marking the playhead, and the elapsed/total time moved to the right,
next to the volume and fullscreen buttons. The controls used `ink-*` color
tokens, which flip with the theme and dimmed them into the video in dark mode.
They now use the fixed white scale in both themes.

The playhead moves with the footage. It used to be driven by `timeupdate`,
which fires about four times a second and moved the thumb along the track in
steps. While the video plays, the position is now read once per frame. A tap
elsewhere on the track slides the thumb there instead of jumping. A drag
follows the pointer directly. This also fixes a scrub that stopped at the
first pixel of movement: pressing and moving started a native drag of the node
view, and the browser cancelled the pointer.

No API change: the handles and controls are internal to the media and iframe
node views.

#### Editor — media actions live in a single menu

Selecting an image, video or embed used to show a row of six buttons across its
top-right corner (caption, three alignments, replace, and on video a playback
dropdown) on one 65%-black pill. It covered every selected image with controls,
most of them rarely used, and it grew with each new action.

There is now one 28px `⋯` button there instead. It uses the `black-overlay-300`
fill from the design (espresso-2.0, node 31403-45433), `rounded-4`, and a
full-white 16px icon. It opens a menu that holds the same actions, grouped: a
caption switch, Align (left/center/right, with the current one marked), the
video-only Playback switches (autoplay, loop, muted), and replace. The resize
handle in the opposite corner is the same button, so the media has one control
style instead of the raw `black/65` and `white/50` it used to approximate.

No API change: the handles and controls are internal to the media and iframe
node views.

#### Editor — selected media no longer wears a white halo in dark mode (fix)

The ring around a selected image, video, embed or gallery is drawn with a 2px
offset, and Tailwind's default offset color is a hard `#fff`. On a white page
that gap is invisible. In dark mode it was a bright white band around every
selected node. The offset now uses `--surface-base`, the page background in
both themes.

No API change: the handles and controls are internal to the media and iframe
node views.

#### Editor — fullscreen video fills the screen (fix)

Fullscreen stretched the container to the viewport, but the video kept its
saved pixel size. It sat small at the top of the screen, with the playback bar
right under it and a black area filling everything below. The video is now
centered and scaled to fit the screen, and the controls run along its bottom.
The editing controls (toolbar, resize handles, caption) are not rendered in
fullscreen, where you cannot use any of them.

No API change: the handles and controls are internal to the media and iframe
node views.

#### `TextEditor` and its v0 exports — removed from root (breaking)

Per ADR-0008, the deprecated v0 editor exports are removed from the top-level
`frappe-ui`. These are loud breaks: the import fails to resolve.

- `TextEditor`, `TextEditorBubbleMenu`, `TextEditorFixedMenu`,
  `TextEditorFloatingMenu`, `TextEditorContent`, `createEditorButton`
- `ImageExtension`, `SetImageOptions`, `createSuggestionExtension`,
  `BaseSuggestionItem`, `CreateSuggestionExtensionOptions` (the two
  `TextEditor/extensions/*` entry files that were also re-exported from the
  root)

This confirms `CONTEXT.md`'s rule: the editor family is the only one that
exports from a subpath instead of the root, and nothing editor-related is
exported from the root anymore.

The v0 component files still ship, unchanged, as a safety net while apps move
to `frappe-ui/editor`. They are parked in `frappe-ui/experimental`
(`experimental/TextEditor/`, #1007), so apps in the middle of migrating keep an
import path:

```ts
import { TextEditor } from 'frappe-ui/experimental'
```

This path is unstable, with no deprecation period. Sharing the `experimental`
entry costs its other importers nothing in production: #870's rollup
measurement shows that unused re-export chains are removed before `sideEffects`
marking applies, so the editor code is tree-shaken out of imports that do not
use the editor. Removing the files is a separate cleanup, which a person
decides, once every consumer has migrated (spec/editor.md §12). Redesigning the
`TextEditor` public API is out of scope for `1.0.0` and moved to `1.1`.

**What to do:** use [`Editor`](/docs/molecules/editor) and its kits and building
blocks from the `frappe-ui/editor` subpath. See the migration guide's
[Editor section](/docs/migration#editor).

#### Editor and TextEditor styles — Tailwind v4 `theme()` call fixed

`.ProseMirror ul[data-type='taskList'] input[type='checkbox']` used a
`theme('colors.gray.900')` call that only works in Tailwind v3, in both
`frappe-ui/editor`'s and the v0 `TextEditor`'s stylesheet. It broke Tailwind v4
builds (#861, a remaining case of #299). It is replaced with the same
`var(--ink-gray-9)` token the rest of both files already use.

#### Editor — media captions moved off `alt` (breaking)

Text in an image's or video's `alt` no longer renders as a caption. Captions
live in a separate `caption` attribute, saved as `data-caption`. `alt` goes back
to being only the description for screen readers.

Existing `alt` values still parse and still round-trip untouched. They just do
not show as a caption any more.

The editor no longer edits `alt` at all. The caption field used to write it. It
now writes `caption`, and no other control took over `alt`. Set `alt` from your
own content pipeline until an alt field is added.

There is no fallback from `caption` to `alt`, on purpose. Stored `alt` values
are mostly upload filenames and emoji shortcodes, and a real caption cannot be
told apart from those automatically. Showing all of them is worse than showing
none.

**What to do:** to keep a caption visible, copy the text into `caption`. A
one-off content migration can do that where you know the old `alt` values were
captions.

### Code editor

#### Code editor — a new family at `frappe-ui/code-editor` (breaking, loud)

- **Breaking:** the `CodeEditor` and `CodePreview` pair is deleted from
  `frappe-ui/experimental`, with no deprecation period (`experimental` has no
  stability promise). A CodeMirror 6 family ships at `frappe-ui/code-editor`
  instead: the `useCodeEditor` engine, a renderless `CodeEditor`,
  `CodeEditorContent`, `CodeKit`, the `codeChrome`, `codeHighlight` and
  `codeKeymap` extensions, and `loadLanguage`.

  ```ts
  // before
  import { CodeEditor, loadLanguage } from 'frappe-ui/experimental'

  // after
  import { CodeEditor, CodeEditorContent, CodeKit } from 'frappe-ui/code-editor'
  ```

  The library ships no labeled field. Each app builds its own thin component on
  `<CodeEditor>`, the way each app already builds its own editor component. The
  Desk/FormLayout field lives in `@framework/ui`.

- **Breaking:** features come from a required `extensions` array of raw
  CodeMirror extensions. The `language`, `variant`, `size` and `placeholder`
  props are gone, and so are the label, description, error and required props.
  `--cm-max-height` becomes `--code-max-height`.

- **Breaking:** `CodePreview` leaves frappe-ui. It is a markdown renderer, not a
  code editor, and it moves to `@framework/ui`.

- **Breaking:** the ten `@codemirror/lang-*` packages and `@codemirror/lint`
  move from dependencies to optional peer dependencies. Every app used to
  download all eleven. Install the ones you render. `loadLanguage` throws an
  error that names the missing package. `frappe-ui/vite` stubs the language
  packages an app did not install, so the build no longer fails on a language
  nobody renders.

**What to do:** see [the code editor docs](/docs/molecules/code-editor) and
[the migration guide](/docs/migration#code-editor).

### Charts

#### A series can carry its own number `format`

`SeriesStyle.format` prints one series' values in the tooltip and in its data
labels. Use it for a series whose unit differs from the others on its axis,
such as a margin in percent next to revenue in currency. Without it, the
tooltip uses the axis' `format` and a label prints a compact number, as before.
The axis ticks keep the axis' `format`.

#### Line and area data labels show without data points

A line or area series with `showDataLabels` and no `showDataPoints` drew no
labels, because echarts attaches a line's labels to its point symbols. The
labels now show, and the points are drawn at zero size. This also applies to a
combo chart's line series when `showDataLabels` is set on the chart.

#### Charts — a new family at `frappe-ui/charts` (breaking for beta users) {#charts-—-a-new-family-at-frappe-ui-charts}

This is the chart family for v1. It replaces the family that used to sit at the
package root, which moved to `frappe-ui/experimental` (see
[the next entry](#charts-v1-family-—-moved-to-frappe-ui-experimental-breaking)).
Import the components from `frappe-ui/charts`, which brings the `--chart-*`
color tokens with it. `spec/charts.md` states the conventions, and
`spec/adr/0015-what-enters-charts.md` records what the family accepts.

It first shipped in `1.0.0-beta.41`. If you used it in a beta, read the
**Breaking** items below.

**What the family includes:**

- The chart frame parts are exported (`ChartCard`, `ChartContainer`,
  `ChartLegend` and `ChartTooltip`), so a plot an app draws itself can look
  like the rest of the family. `ChartCard` owns the card surface, and
  `card: false` turns it off.
- Combo series through `seriesConfig[key].type`. This also merged the three
  axis option builders into one. Area fill per series comes with it.
- Reference lines on the axis charts and on `ScatterChart`. A line outside the
  data range is clipped, instead of stretching the value axis.
- `stacked: 'normalized'` for shares, and `maxSeries` to limit a long grouping
  column. `maxSeries` has no default.
- `ScatterChart` and `SankeyChart`.
- Category labels fit themselves: the library measures, tilts and truncates
  them, instead of taking an angle prop.
- `xAxis.type: 'value'` reads the x column as a quantity: a point sits at its
  own number instead of in its row's slot, and the rows draw in numeric order.
  You have to ask for it: a column of numbers still reads as categories by
  default.
- The three states are slots (`#loading`, `#error` and `#empty`) on
  `ChartContainer` and on every chart component. So an app can put a retry
  button next to a failed query without drawing its own frame. `#loading`
  replaces the whole placeholder, not a caption under a spinner.
- A loading chart draws a skeleton the size of its plot. It used to draw a
  spinner and the words "Loading chart…". A dashboard fills in one card at a
  time, and a placeholder that keeps the grid's shape reads better than eight
  spinners turning out of step. `#loading` lets you replace it.
- `y2` names the value column or columns measured against the second value
  axis. This completes the pairs `x`/`xAxis`, `y`/`yAxis` and `y2`/`y2Axis`. The
  axis is drawn only when `y2` names a column. `y2Axis` is unchanged.
- `ScatterChart` takes `showDataLabels`, which prints each point's `label` next
  to it. Labels that collide with a neighbour are dropped.
- `NumberCard` takes `color`, the ink the reading is printed in, for a card
  that stands for a series drawn in that color elsewhere. It does not change
  the card, the title or the delta tone.
- **`dir` and `lang` are followed, not read once.** If a page changes
  `document.documentElement.dir` or `lang` after a chart mounts, the chart
  redraws in the new direction and reprints its numbers in the new locale. A
  chart that sets its own `dir` is not affected.
- One rule, across the family, for a value that cannot be plotted. A cell that
  does not read as a number has no mark, so `select` no longer fires for it on
  Enter, and the keyboard cursor no longer stops on a series that has nothing at
  that row. A row whose x cannot be read as a date is dropped from a `time`
  axis, the same way a non-numeric x is already dropped from a `value` axis, and
  the rows sort by time. The funnel drops a stage whose count is missing,
  unreadable or negative, instead of drawing it at 0, so its indexes and
  conversion rates count only the stages that remain. **Breaking, silent:** a
  chart that draws any of these now draws something else, with no error.
- **The empty state is what the plot draws.** Bar, line and area now show it
  when no visible series has a number at any row. They used to draw bare axes.
  A `y` key that no row carries reads as empty, and so does turning every
  series off through the legend. Also silent.
- `NumberCard` prints through `format` and `deltaFormat`, the same
  `ChartValueFormatter` every other chart takes. `precision` and `compact` are
  **removed**: write either one in `format` instead. `format` prints the value
  and the target. `deltaFormat` prints the delta and receives it without a sign.
  A card with neither prints what it printed before.

**Changed since `1.0.0-beta.41`, the first beta that shipped the family:**

- **Breaking, silent:** the six mark emits are renamed to `select`:
  `datapointClick` on `AreaChart`, `BarChart` and `LineChart`, `sliceClick` on
  `DonutChart`, `stageClick` on `FunnelChart`, `cellClick` on `HeatmapChart`,
  `linkClick` on `SankeyChart` and `pointClick` on `ScatterChart`. The library
  names an emit after the behavior, and all six now fire from the keyboard too,
  so "click" was wrong. A listener on an old name stops firing with no error.
  See the [migration guide](/docs/migration#charts). The payload types are
  unchanged.
- **Breaking, loud:** `ChartTheme` is now `ChartTokens`, and `useChartTheme` is
  now `useChartTokens`, which returns `{ tokens }` rather than `{ theme }`.
  `theme` means a color tone everywhere else in the library, and these are the
  resolved `--chart-*` values.
- **Breaking, loud:** `formatValue`, `formatDate`, `formatLabel`,
  `formatPercent`, `formatAxisValue`, `currentColorScheme` and
  `resolveChartTheme` are no longer exported. They had no documented use, and
  they are the library's own printing, not utilities to build on. Read the
  plot-area colors with `useChartTokens`, which re-resolves when the theme
  changes. `currentColorScheme` was the internal `getResolvedColorScheme` under
  another name.

**Settled by the RC API review
([#1139](https://github.com/frappe/frappe-ui/issues/1139)) before the
`frappe-ui/charts` entry freezes.** Every item is loud in TypeScript unless it says otherwise. The
[migration guide](/docs/migration#charts) has the rewrites.

- **Breaking:** one shape for every `select` payload.
  `ChartDatapointEvent.dataIndex` and `FunnelStageEvent.index` are gone; read
  the row, which every event carries. `seriesName` on `ChartDatapointEvent` and
  `ScatterPointEvent` is now `name`, the field every other payload, item and
  legend entry already used for an identity. `FunnelStageEvent` gains the
  `name` it never had: the category value, where `label` is what the column
  printed.
- **Breaking, silent:** `DonutSliceEvent.name` is now the slice's identity. It
  was the printed name, and the printed name moves to a new `label`. Both are
  strings, so a handler that reads `name` keeps running, on a different value:
  `OTHERS_KEY` for the collapsed tail, and `"A (2)"` for a label that a second
  row repeats. Search for `@select` handlers on `DonutChart` that read `.name`.
- **Breaking:** one tooltip slot shape. Every `#tooltip` slot, and
  `ChartTooltip` itself, carries `{ label, items, rows }`. `row` is gone. `rows`
  holds one row for a point, cell, band or stage; every grouped row for a
  donut's "Others" slice; and no rows for a sankey node, which stands for every
  row through it. `FunnelChart`'s `stage` slot prop is gone too: the two
  conversion rates are items named `ofFirst` and `ofPrevious`.
  `ChartTooltipItem.kind` is required, and the value `'column'` is now
  `'context'`: a reading the plot does not draw, which is a `tooltipColumns`
  entry or a funnel rate. An item you build by hand needs `kind: 'series'`.
- **Breaking:** `DonutChart`'s `#center` slot passes
  `{ label, value, formattedValue, percent }` instead of preformatted strings,
  the way `ChartTooltipItem` does. `value` and `percent` are numbers, so your own
  readout can do its own arithmetic. `formattedValue` is what the default
  prints.
- **Breaking:** one name for the data label. `showValues` on `HeatmapChart` and
  `showInlineLabels` on `DonutChart` are both now `showDataLabels`. Axis charts
  take it at the chart level too, so one prop replaces one `seriesConfig` entry
  per series.
- **Breaking, silent:** `FunnelChart.showPercentages` is removed. A funnel now
  always prints its conversion rates. It defaulted to `true`, so a chart that
  set `false` gets them back with no error.
- **Breaking, silent:** numbers print in the page's language. Charts read
  `document.documentElement.lang`, the attribute `dir` is already read from. A
  page that declares no language, or a malformed one, prints what it printed
  before. Dates and time-axis labels still print in English; `xAxis.format`
  prints them in another language.
- **Breaking:** `ChartTokens.splitLine` is now `gridline`, after the
  `--chart-gridline` variable it reads. `splitLine` is still echarts' own option
  key.
- **Breaking:** `NumberCardSparklineType` is gone. `NumberCardSparkline.type`
  takes a `ChartMark`.
- **Breaking, silent:** a sparkline's `'line'` draws only the stroke. It used to
  draw a stroke over a fill, which the family calls an area, so that shape is
  now `'area'`, and it is the default. `'line'` is still a `ChartMark`, so a
  card that names it compiles unchanged and draws something else. A card that
  names no type is not affected. Search for `sparkline` objects with
  `type: 'line'`.
- **Breaking:** `OTHERS_LABEL` is no longer exported, and `ResolvedColorScheme`
  is exported from the root only. `OTHERS_KEY` stays.
  `ReferenceLineLabelPlacement` is now exported. `ChartExposed` is the caller's
  view of the template ref: `chart` is typed `ECharts | undefined`, the value
  Vue passes back, where the type said `ComputedRef<ECharts | undefined>`.
  `ChartContainer`'s `plotLabel`, `plotLabelSecondary` and
  `plotLabelPlacement` are now `yAxisTitle`, `y2AxisTitle` and
  `axisTitlePlacement`, after the `yAxis.title` and `y2Axis.title` that every
  chart already uses. `PlotLabelPlacement` is now `AxisTitlePlacement`.
  `paletteColors` takes the `palette` prop's own value (a ramp name, a list of
  colors, or nothing) plus the fallback ramp, so the exported helper is the same
  resolver the charts call:
  `paletteColors(palette, tokens, count, fallback?)`.
- **Breaking:** four props that set a look, rather than state a reading, are
  gone. `SeriesStyle.lineWidth` and `fillOpacity` (at the chart level and per
  series) are removed: the library draws one stroke weight, and it decides the
  fill (a fading gradient for a free area, a solid wash for a banded one). The
  per-series `echartOptions` reaches both: `lineStyle: { width }` and
  `areaStyle: { opacity }`. `SeriesStyle.lineType` is now `dashed?: boolean`,
  the same shape as `ReferenceLine.dashed`, drawn with the same dash.
  `SankeyChart`'s `orient="vertical"` is now `vertical`, like `BarChart`'s
  `horizontal`, and the `SankeyOrient` type is gone.
- `DonutChart` takes `v-model:hiddenSlices`. `AxisChartEmits` and
  `ScatterChartEmits` declare `update:hiddenSeries`, which both already fired.

**Settled after the review, on the same terms:**

- **Breaking:** the column that splits long data into series is `splitBy`, not
  `series`, on the axis charts and on `ScatterChart`. "Series" now means only a
  drawn series, which is what `seriesConfig`, `hiddenSeries` and `maxSeries` are
  keyed by. TypeScript reports the removed prop. But a plain template passes it
  through as an attribute and draws every row as one series, so search for
  `series=` and `:series=` on the charts after upgrading.
- The axis charts take `smooth`, `showDataPoints` and `dashed` at the chart
  level, next to `showDataLabels` and `connectNulls`, and `connectNulls` joins
  the four in `seriesConfig`. One rule covers all five: the chart-level value is
  the default for every series, and a `seriesConfig` entry overrides it for one
  series, on or off. With `splitBy`, the data names the series, so a
  chart-level value is the only way to reach all of them.
- **Breaking:** `SeriesStyle.axis` is **removed**, replaced by the `y2` column
  prop above: one mechanism per concept. Series draw, and take palette slots, in
  `y` order and then `y2` order. `splitBy` splits `y` only. A `y2` column draws
  as the chart's own mark until `seriesConfig[key].type` says otherwise.
- **Breaking:** `DonutChart`'s model is `v-model:hiddenSlices`, and its emit is
  `update:hiddenSlices`. A donut has no series (`maxSlices`, `DonutSlice` and
  `DonutSliceEvent` all say slice), so the one prop that said series was the
  odd one out. `hiddenSeries` is unchanged on the axis charts and on
  `ScatterChart`, and so is `ChartLegend`'s own API.

`useChart`, `registerChartModules` and their three types stay on
`frappe-ui/charts` and freeze there. frappe-ui owns the composable's shape and
lifecycle. echarts owns the option and instance types it carries. The four
`--chart-*` properties that are not ramps are documented on the
[chart colors](/docs/foundations/colors/charts) page, and the echarts template
ref on the [charts overview](/docs/charts/overview).

#### Charts (v1) family — moved to `frappe-ui/experimental` (breaking)

The first chart family is not being brought up to the v1 quality bar at the root for
`1.0.0` (#942). It moves to `frappe-ui/experimental`, which has no stability
promise, with its public API unchanged, while apps migrate to
`frappe-ui/charts`, which draws everything it did.

- **Breaking, loud:** `import { AxisChart, ... } from 'frappe-ui'` fails to
  resolve. Apps that spread `content` from `frappe-ui/tailwind` keep the
  styles automatically.
- For new code, use `frappe-ui/charts`. Its props are flat and name the columns
  of your rows, so a `config` object becomes props. See the
  [migration guide](/docs/migration).

**What to do:** import `AxisChart`, `DonutChart`, `ECharts`, `FunnelChart`,
`NumberChart` and `useAxisChartOptions` from `frappe-ui/experimental`. Changing
the import path is the whole migration.

### Calendar

`Calendar` is now in `frappe-ui/experimental`; see
[the move entry](#calendar-family-—-moved-to-frappe-ui-experimental-breaking).

#### Calendar — the Month view is a continuous strip that shows every event

The Month view no longer draws a fixed 5- or 6-row grid that hid whatever did
not fit behind an "n more" button. Its week rows grow to fit their events, the
view scrolls when they outgrow it, and titles wrap instead of being cut off.
Below the `sm` breakpoint it is the same grid one size smaller, and a cell shows
what fits in it, with a `+n` count for the rest.

- **Behavior change:** `rangeChange` for the `Month` view now reports the
  grid's full extent, including the padding days of its first and last weeks,
  rather than the first to the last day of the month.
- Days outside the month in view are no longer dimmed. Instead, the first day
  of each month is labelled with its month (`Sep 1`).
- Event titles in the Week and Day views are `ink-gray-8`, as in the Month
  view, rather than the text shade of the event's colour. The colour stays on
  the bar and the background.
- `CalendarActions` (the `CALENDAR_ACTIONS_KEY` injection) gains
  `setCalendarDate`.
- An event with `isDraft: true` draws as a dashed outline in the event's
  colour, without the colour bar, rather than as a filled pill, in every view.
- An event with `isDeclined: true` keeps its fill and bar, but its title is
  struck through and muted. In the Week and Day views it no longer takes a
  column of its own, so overlapping events lay out as if it were not there.
- **Behavior change:** `reloadEvents()` on the template ref now re-reads the
  `events` prop and discards edits made in the calendar since then (a drag or
  resize not yet saved). It used to hand the edited objects back.

#### Calendar — `toDate` is honored, so events span the days they cover (breaking, silent)

An event's `toDate` was ignored: everything rendered on `fromDate`. The event
now shows on every day from `fromDate` to `toDate`, inclusive. In the Month view
and the Week view's all-day row, it is one bar across those days. A timed event
shorter than a day that crosses midnight shows as one piece per day in the time
grid. A timed event that ends at `00:00` does not occupy that day.

- **Breaking, silent:** an event passed with an *exclusive* end (`toDate` set
  to the day after its last day, the way iCalendar stores all-day spans) now
  shows one day too many.
- **Behavior change:** dragging keeps an event's length. `update` emits
  `toDate` shifted by the same number of days as `fromDate`. It used to set both
  to the drop day. A drag past midnight moves `toDate` (or `fromDate`) to the
  next day with a `00:00:00` time. It used to stop at `24:00:00`.
- Full-day events (`isFullDay`) cover `fromDate`..`toDate` whole. Their times
  are ignored.

**What to do:** send the inclusive last day as `toDate`.

#### Calendar family — moved to `frappe-ui/experimental` (breaking)

Calendar is not being brought up to the v1 quality bar at the root for `1.0.0` (#1020,
redirect of #989). It moves to `frappe-ui/experimental`, which has no stability
promise, with its public API unchanged, until a redesigned calendar family
replaces it.

- **Breaking, loud:** `import { Calendar, ... } from 'frappe-ui'` fails to
  resolve. Changing the import path is the whole migration. Apps that spread
  `content` from `frappe-ui/tailwind` keep the Calendar styles automatically.
- **Fix:** the default header's month-title button renders again. It broke
  when DatePicker's `#target` slot became `#trigger`. The all-day collapse
  buttons show their chevron icons again.

**What to do:** import these from `frappe-ui/experimental` instead: `Calendar`,
`CalendarColorMap`, `CalendarActiveEvent`, and the types `CalendarActions`,
`CalendarCellClickData`, `CalendarConfig`, `CalendarEvent`, `CalendarMode`,
`CalendarPublicProps`, `CalendarTimeFormat`, `GroupedCalendarEvents`.

## Deprecation log

Each row names an old API, what replaces it, and what happens to code that
still uses it. "Silent" means old code still runs and nothing fails. "Loud"
means the import, build or call fails.

| API | Replacement | Notes |
| --- | --- | --- |
| `Divider.action.handler` | `Divider.action.onClick` | **Removed**, silent: the key is dropped and the click does nothing |
| `Password.value` prop | `v-model` / `modelValue` | **Removed in 1.0.0** (ADR-0008) |
| `Rating.rating_from` prop | `max` | **Removed**, silent: prop ignored |
| `Rating.readonly` prop | `disabled` | **Removed**, silent: prop ignored |
| `Switch.change` emit | `update:modelValue` / `v-model` | **Removed**, silent: listener never fires |
| `Switch.labelClasses` prop | `data-*` styling hooks | **Removed**, silent: prop ignored |
| `Checkbox.padding` prop | `padded` | **Removed**, silent: prop ignored |
| `Dropdown` `{ group, items }` | `{ group, options }` | **Removed**, silent: renders empty, warning in development only |
| `Dropdown.placement` prop | `align` | **Removed**, silent: falls back to `align="start"` |
| `Dropdown`/`ContextMenu` `component:` rows | `slots: { item: fn }` | **Removed**, silent: renders a row with only the label, warning in development only |
| `DropdownExposed` type | `v-model:open` / `close` slot prop | **Removed**, loud: it described an exposed member that never existed |
| Select `#item-*` slot prop `option` | `item` | **Removed**, silent: `{ option }` destructures to `undefined` |
| `Input.vue` | `TextInput` | **Removed in 1.0.0** (ADR-0008) |
| `Autocomplete` | `Combobox` or `MultiSelect` | **Removed**: import fails |
| `GridLayout` | depend on `grid-layout-plus` directly | **Removed**, loud: import fails |
| `FormControl type='autocomplete'` | `type="combobox"`, or `Combobox` on its own | **Removed**, silent: `console.error` in development only |
| DatePicker family `placement` | `side` + `align` + `offset` | **Removed**, silent: unused extra attribute |
| DatePicker family `autoClose` | `keepOpen` (inverse) | **Removed**, silent: unused extra attribute |
| DatePicker family `allowCustom` | `typeable: false` | **Removed**, silent: unused extra attribute |
| DatePicker family `readonly` | `typeable: false` | **Removed**, silent: unused extra attribute |
| DatePicker family `inputClass` | `class` on the component element | **Removed**, silent: unused extra attribute |
| DatePicker family `value` prop | `v-model` / `modelValue` | **Removed**, silent: unused extra attribute |
| DatePicker family `#target` slot | `#trigger` | **Removed**, silent: slot content stops rendering |
| `TimePicker.scrollMode` | none (always centered) | **Removed**, silent: unused extra attribute |
| `DateTimePicker.minDateTime` | `min` | **Removed**, silent: limit no longer enforced |
| `DateTimePicker.maxDateTime` | `max` | **Removed**, silent: limit no longer enforced |
| `TimePicker.minTime` | `min` | **Removed**, silent: limit no longer enforced |
| `TimePicker.maxTime` | `max` | **Removed**, silent: limit no longer enforced |
| `TimePicker.selectAll()` / `.blurInput()` | none: unused, no callers | **Removed**, loud: template-ref member gone |
| `useDatePicker` composable | use the picker components directly | **Removed**, loud: import fails |
| `getDate` / `getDatesAfter` / etc. | use the picker components directly | **Removed**, loud: import fails |
| `MonthPicker` | `Select` | **Removed**, loud: import fails |
| `FeatherIcon` | `lucide-*` strings (or a `Component`) | **Removed**: import fails; props with feather names render nothing and warn once in development |
| `Card` | layout markup | **Removed in 1.0.0** (ADR-0008), import fails |
| `ListItem` | layout markup | **Removed in 1.0.0** (ADR-0008), import fails |
| `Toast` (SFC) | imperative `toast(...)` API | **Removed in 1.0.0** (ADR-0008), import fails |
| Dialog legacy `options` blob | flat top-level props | **Removed**, silent: unused attribute |
| Dialog `disableOutsideClickToClose` | `dismissible` (inverted) | **Removed**, silent: unused attribute |
| Dialog `#body*` slots | `#default` / `#title` / `#actions` | **Removed**, silent: renders nothing |
| Dialog `icon.appearance` | `icon.theme` | **Removed**, silent: icon loses its tone |
| Dialog action `onClick` callable context | `{ close }` object | **Removed**: throws on call |
| Dialog template-ref `close()` | `v-model:open` / `close` slot prop | **Removed**: throws on call |
| `ConfirmDialog` component | `dialog.confirm()` / `dialog.danger()` | **Removed**: import fails |
| `confirmDialog()` | `dialog.confirm()` | **Removed**: import fails |
| `FileUploader.uploadArgs` | flat props (`private`, `folder`, `doctype`, `docname`, `fieldname`, `uploadEndpoint`, `optimize`) | **Removed**, silent: unused attribute |
| `FileUploader` template-ref `inputRef` | `openFileSelector` slot prop | **Removed**: throws on call |
| `FileUploader` slot prop `error` | always `string \| null`, was `unknown` | **Changed**, silent: `.message` access renders nothing |
| `useFileUpload` / `FileUploadHandler` unset privacy | explicit `private` | **Default changed**, silent: now resolves to private |
| `fileToBase64`, `formatBytes`, `getMaxFileSize`, `fileSizeLimitMessage` | none (internal only) | **Removed**: import fails |
| `frappe-ui/charts` `ColorScheme` type | root `ResolvedColorScheme` (import it from `frappe-ui`) | **Removed**, loud: type import fails |
| `Badge theme="orange"` | `theme="amber"` | **Removed in 1.0.0** (ADR-0008). Loud in TS (compile error); silent in JS (renders gray, warning in development only) |
