---
pageClass: migration-page
---

# Migration from v0

This guide moves an existing app onto `frappe-ui` v1. Work through one
component family at a time. Each section starts with a before/after table. For
the full list of changes, see the [changelog](/docs/changelog). For the reasons
behind each API, see the
[v1 release specs](https://github.com/frappe/frappe-ui/tree/main/v1-release).

After each pass, `grep` for the old prop or slot name to find anything you
missed, then test the flows you changed. Type-checking does not catch focus
changes, slot renames or visual regressions.

## What this guide covers

Every **silent break** has a before/after here. A silent break is old code that
still runs and still type-checks, but behaves differently. Vue drops an unknown
prop or slot without any warning, so these are the changes that reach
production. Each one is marked.

**Loud breaks** are changes your build reports: an import that no longer
resolves, or a type that no longer exists. They are listed in the
[changelog](/docs/changelog), and appear here only when the replacement needs
explaining. If your build already names the file and the line, the changelog is
faster to read.

Each change in this guide starts with one of these labels:

| Label                 | Meaning                                                                 |
| --------------------- | ----------------------------------------------------------------------- |
| **Silent break.**     | Old code still builds and runs, but behaves differently. Nothing warns. |
| **Loud break.**       | The build, the type-check or a runtime error names the problem.         |
| **Behavior change.**  | Existing code keeps working, but the result is different.               |
| **Additive.**         | Something new. Nothing to change.                                       |
| **Codemod:** `name`   | A codemod makes this change for you. Run it, then review the diff.      |

### Codemods {#codemods}

Run the codemod linked from each section. frappe-ui ships ten. The tools report
ambiguous dynamic syntax for manual review instead of guessing.

| Codemod           | What it changes                                                                                                                                                                                                  |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packaging-v1`    | The Tailwind preset path, and the Vite plugin's `lucideIcons` option. See [Packaging and tokens](#packaging-and-tokens).                                                                                        |
| `tokens-v2`       | Tailwind token renames. Flags: `--ink-shift`, `--force`, `--radius-only`. See [Tokens](#tokens).                                                                                                                |
| `destinations-v1` | Destination prop renames. See [Navigation destinations](#navigation-destinations).                                                                                                                              |
| `overlays-v1`     | Overlay and picker controls. See [Popover / HoverCard / Tooltip](#popover-hovercard-tooltip), [Selection family](#selection-family-dropdown-select-combobox-multiselect) and [DatePicker / TimePicker](#datepicker-timepicker-family). |
| `navigation-v1`   | Navigation props and tab state. See [Tabs](#tabs), [TabButtons](#tabbuttons), [SettingsDialog](#settingsdialog) and [Sidebar](#sidebar).                                                                        |
| `shortcuts-v1`    | Shortcut config. See [The shortcuts codemod](#the-shortcuts-codemod).                                                                                                                                           |
| `base-props-v1`   | Base component prop normalization. See [Base component props](#base-component-props).                                                                                                                           |
| `list-v1`         | List row hooks and slot names. See [List family](#list-family).                                                                                                                                                 |
| `editor-v1`       | The EditorFixedMenu prop rename. See [Editor](#editor).                                                                                                                                                         |
| `data-v1`         | The `FrappeUI` plugin's `resources` option. See [the plugin](#http-transport-and-the-frappeui-plugin).                                                                                                          |

Run each one from the app you are migrating. Where a section gives a
`--dry-run` form, run that first and review the output:

```sh
npx -p frappe-ui packaging-v1 --dry-run .
npx -p frappe-ui packaging-v1 .

npx --package frappe-ui@rc tokens-v2 --dry-run .
npx --package frappe-ui@rc tokens-v2 .

npx destinations-v1 .

npx overlays-v1 .

npx navigation-v1 .

npx --package frappe-ui@rc shortcuts-v1 --dry-run .
npx --package frappe-ui@rc shortcuts-v1 .

npx --package frappe-ui@rc base-props-v1 --dry-run src
npx --package frappe-ui@rc base-props-v1 src

npx list-v1 .

npx --package frappe-ui@rc editor-v1 --dry-run .
npx --package frappe-ui@rc editor-v1 .

npx -p frappe-ui data-v1 ./src
```

The commands are written the way each section gives them. The `overlays-v1`
command is not given elsewhere in this guide; it follows the tool's usage line,
`overlays-v1 [--dry-run] <dir-or-file...>`.

### Sections

The sections are grouped in the order most apps meet them: first the install
and build setup, then components, then data fetching, then the families that
only moved.

- **Setup** — [Requirements](#requirements) ·
  [Packaging and tokens](#packaging-and-tokens) ([Preset path](#preset-path) ·
  [`lucideIcons`](#lucide-icons) · [Focus ring](#focus-ring-outline) ·
  [Sizing changes](#sizing-scale-changes) ·
  [Dependencies](#packaging-dependencies)) · [Tokens](#tokens) ·
  [Line height](#line-height) ·
  [Family stylesheets](#family-stylesheets-list-style-css-editor-style-css) ·
  [`hljs-theme.css` and `tailwind/tokens.js`](#hljs-theme-css-and-tailwind-tokens-js-removed)
  ·
  [`frappe-ui/frappe` and `frappe-ui/drive`](#frappe-ui-frappe-and-frappe-ui-drive-removed)
- **Destinations** — [Navigation destinations](#navigation-destinations)
- **Overlays** — [Dialog](#dialog) ·
  [Popover / HoverCard / Tooltip](#popover-hovercard-tooltip) ·
  [CommandPalette](#commandpalette)
- **Pickers and selection** —
  [DatePicker / TimePicker](#datepicker-timepicker-family) ·
  [MonthPicker](#monthpicker) ·
  [Selection family](#selection-family-dropdown-select-combobox-multiselect) ·
  [Autocomplete](#autocomplete-removed) ·
  [FormControl `type="autocomplete"`](#formcontrol-type-autocomplete-removed)
- **Inputs and files** — [Inputs](#inputs) · [FileUploader](#fileuploader)
- **Navigation and layout** — [Sidebar](#sidebar) ·
  [SettingsDialog](#settingsdialog) · [Tabs](#tabs) ·
  [TabButtons](#tabbuttons) · [TabButtons `class`](#tabbuttons-class) ·
  [App shells and ScrollArea](#shells) ·
  [`--mobile-header-height`](#mobile-header-height) ·
  [PageHeaderMobile](#pageheadermobile-family-slot-names) · [Divider](#divider)
- **Keyboard** — [useShortcut](#useshortcut-is-now-usekeyboardshortcut) ·
  [KeyboardShortcutsModal](#keyboardshortcutsmodal-is-now-keyboardshortcutsdialog)
  · [The shortcuts codemod](#the-shortcuts-codemod) ·
  [KeyboardShortcut](#keyboardshortcut)
- **Display** — [Alert](#alert) · [Badge](#badge) · [Icons](#icons) ·
  [Base component props](#base-component-props) · [List family](#list-family) ·
  [Tree](#tree) ·
  [Card, ListItem, Toast](#card-listitem-standalone-toast-removed) ·
  [Toast legacy object](#toast-legacy-object) ·
  [Toast `description`](#toast-description-html)
- **Editor and charts** — [Editor](#editor) · [Code editor](#code-editor) ·
  [Charts](#charts)
- **Data and transport** —
  [useDoctype / useList](#data-fetching-usedoctype-uselist) ·
  [Writes reject](#data-fetching-writes-reject) ·
  [Data-fetching exports](#data-fetching-exports) ·
  [Errors renamed](#errors-renamed) ·
  [HTTP transport and the plugin](#http-transport-and-the-frappeui-plugin) ·
  [`beforeSubmit`](#usecall-a-throwing-beforesubmit-now-cancels-the-submit) ·
  [Composables and directives](#composables-and-directives-renamed) ·
  [Color scheme](#resolved-color-scheme) ·
  [pageMetaPlugin](#pagemetaplugin-removed)
- **Moved, not removed** — these five families changed an import path and
  nothing else: [ListView](#listview-—-moved-to-frappe-ui-experimental) ·
  [Calendar](#calendar-—-moved-to-frappe-ui-experimental) ·
  [Charts (v1)](#charts-v1-—-moved-to-frappe-ui-experimental) ·
  [Sprite icons](#sprite-icons-—-moved-to-frappe-ui-experimental) ·
  [ThemeSwitcher](#themeswitcher), which stays deprecated at its new path. The
  v0 `TextEditor` family moved the same way; see [Editor](#editor).
- [FAQ](#faq)

## Requirements

| Dependency       | v1 requirement                            | Change from v0                                                     |
| ---------------- | ----------------------------------------- | ------------------------------------------------------------------ |
| Node             | **`>=20.19.0`** (`package.json` `engines`) | New. The 0.1.x line declared no `engines` field at all.            |
| Vue              | `vue >=3.5.0` (`peerDependencies`)        | Unchanged. An app already on v0 needs no Vue bump.                 |
| vue-router       | `vue-router ^4.1.6` (`peerDependencies`)  | Unchanged.                                                         |
| Tailwind CSS     | **v3**, peer `tailwindcss >=3.4.2 <4`     | Unchanged. v4 is not supported.                                    |
| `@vueuse/core`   | **`^14.1.0`**                             | Up from `^10.4.1` in the 0.1.x line.                               |

**Node.** This is a new minimum, not a raised one. A Node 18 image that built v0
without problems now fails to install.

**Tailwind.** `frappe-ui/tailwind` is a v3 preset. frappe-ui declares
`tailwindcss` as a peer dependency, `>=3.4.2 <4`, so install it yourself; see
[Dependencies](#packaging-dependencies) below. A v4 project does not work with
the preset. See the [Tailwind page](/docs/getting-started/tailwind).

**VueUse.** VueUse 14 requires Vue `^3.5.0`, which v1 already requires. If your
app depends on `@vueuse/core` directly, move it to `^14` as well. Two major
ranges in one app install two copies of the library. A `resolve.dedupe` entry
for `@vueuse/core` then collapses them onto whichever copy wins, and that breaks
the components that expect the newer one.

## Packaging and tokens {#packaging-and-tokens}

Two loud breaks and three silent ones, in how frappe-ui is installed and set up
in your build.

| Before                                    | After                                           |
| ----------------------------------------- | ----------------------------------------------- |
| `frappe-ui/src/utils/tailwind.config`     | `frappe-ui/tailwind`                            |
| `frappeui()` installs the icon plugins    | `frappeui({ lucideIcons: true })`               |
| `var(--focus-<name>)` (`box-shadow`)      | `var(--focus-outline-<name>)` (`outline`)       |
| `rounded-9` = 999px                       | 100px                                           |
| `w-wizard` = 650px                        | removed                                         |
| `min-w-50` = 18rem                        | 12.5rem                                         |

**Codemod:** run `packaging-v1` first:

```sh
npx -p frappe-ui packaging-v1 --dry-run .
npx -p frappe-ui packaging-v1 .
```

Point it at the project root, not at `src`. It reads the Vite config and the
source that uses icons in the same run. It:

- rewrites the Tailwind preset path
- adds `lucideIcons: true` where the app still needs the resolver
- reports any plugin call it cannot decide

### The preset path {#preset-path}

**Loud break.** The `frappe-ui/src/utils/tailwind.config` shim is deleted, and no
path under `frappe-ui/src/...` resolves. The build stops with
`Package subpath './src/utils/tailwind.config' is not defined by "exports"`. The
`exports` map already refused that path before this release; now the file is
gone as well. **Codemod:** `packaging-v1`.

```js
// Before
import preset from 'frappe-ui/src/utils/tailwind.config'
// After
import preset from 'frappe-ui/tailwind'
```

The same module also exports `content`: the globs for files inside the package
that use classes. Tailwind v3 ignores a preset's own `content`, so spread them
into yours. They are already absolute paths, resolved from the installed
package, so do not add a prefix:

```js
import preset, { content } from 'frappe-ui/tailwind'

export default {
  presets: [preset],
  content: [...content, './index.html', './src/**/*.{vue,js,ts}'],
}
```

### `lucideIcons` is off {#lucide-icons}

`frappeui()` no longer installs the `~icons` resolver, `unplugin-auto-import`
and `unplugin-vue-components`.

- **Loud break** for an `~icons` import:
  `Failed to resolve import "~icons/lucide/check"`.
- **Quiet break** for an auto-imported tag: the build passes, `<LucideCheck />`
  renders as an unknown element, and the only sign is a Vue warning in the
  console.

**Codemod:** `packaging-v1` adds the option where the app still needs it.

```js
// Before
frappeui({ frappeProxy: true })
// After
frappeui({ lucideIcons: true, frappeProxy: true })
```

If you do not want to keep these plugins, there are two other options:

- Pass the icon name as a class: `<span class="lucide-check size-4" />`. The
  preset's own icon plugin draws it.
- Import only the resolver from `frappe-ui/vite/lucideIconsPlugin`.

### The focus ring is an outline {#focus-ring-outline}

The `--focus-<name>` variables are removed. They held a `box-shadow` value.
`--focus-outline-<name>` holds the outline form, which does not change the
element's size.

**Silent break:** `box-shadow: var(--focus-red)` resolves to nothing, and the
ring disappears.

```css
/* Before */
.my-input:focus-visible {
  box-shadow: var(--focus-red);
}
/* After */
.my-input:focus-visible {
  outline: var(--focus-outline-red);
}
```

The names are `default`, `red`, `green`, `amber`, `blue` and `violet`. Each is
2px in light mode and 3px in dark mode. Grep for `--focus-` and check that every
hit has the `outline-` part.

### `rounded-9`, `w-wizard` and `min-w-50` {#sizing-scale-changes}

**Silent break.** Three values change because the sizing scales were merged
into one scale:

| Before              | After   | What to do                                                        |
| ------------------- | ------- | ----------------------------------------------------------------- |
| `rounded-9` = 999px | 100px   | Nothing, unless you used it as a circle. Then use `rounded-full`. |
| `w-wizard` = 650px  | removed | `w-[650px]`, or a width token of your own.                        |
| `min-w-50` = 18rem  | 12.5rem | `min-w-[18rem]` to keep the old size.                             |

Everything else on the scale keeps its value, and the scale is now complete:
integers 1 to 128 and half steps 0.5 to 19.5. Tailwind 3.4 reads
`theme('spacing')` for `width`, `height`, `size`, `minWidth`, `maxWidth`,
`minHeight` and `maxHeight`. So `p-*`, `m-*`, `gap-*`, `w-*`, `h-*`, `size-*`,
`min-w-*`, `max-w-*`, `min-h-*` and `max-h-*` all use the same numbers.

### Dependencies {#packaging-dependencies}

- Install `tailwindcss` yourself: it is a peer dependency now, `>=3.4.2 <4`. An
  install on Tailwind v4 fails.
- `vite` and `vitepress` are optional peer dependencies, together with `shiki`,
  `@shikijs/transformers` and `@vue/compiler-dom`, which `frappe-ui/vitepress`
  imports. Nothing changes unless you import `frappe-ui/vite` or
  `frappe-ui/vitepress` without having them installed.
- If your app imported `ora`, `slugify`, `prosemirror-tables`,
  `@tailwindcss/line-clamp` or a `@tiptap/extension-*` package through
  frappe-ui, declare it yourself. They are no longer frappe-ui dependencies.
- In `tsconfig.json`, keep `types: ["vite/client"]`. frappe-ui ships TypeScript
  source, so your compiler checks it, and that source reads `import.meta.env`.

## Tokens

The Tailwind token names change to the espresso v2 names. Radius aliases, some
unused tokens and the `text-*-black` styles are removed, and the tight text
styles get a taller line height.

| Before                                | After                                    |
| ------------------------------------- | ---------------------------------------- |
| `bg-surface-white`                    | `bg-surface-base`                        |
| `text-base font-medium`               | `text-base-medium`                       |
| `rounded-md` (and the other aliases)  | `rounded-5` (numbered radius tokens)     |
| `text-lg` / `text-xl` / ...           | `text-md` / `text-lg` / ... (beta.11 typography correction) |
| `ink-red-2` (every chromatic family)  | `ink-red-1` (ink scales shift one level) |
| unused tokens (`text-tiny`, ...)      | removed                                  |
| `text-*-black` styles                 | removed                                  |
| tight text styles: line-height 1.15   | 1.35                                     |

### Running `tokens-v2`

**Codemod:** run the v2 token codemod from the app you are migrating. Start with
a dry run:

```sh
npx --package frappe-ui@rc tokens-v2 --dry-run .
```

Review the output, then run it without `--dry-run`:

```sh
npx --package frappe-ui@rc tokens-v2 .
```

The codemod:

- renames espresso color tokens, for example `bg-surface-white` to
  `bg-surface-base`
- merges static text size + weight class pairs, for example
  `text-base font-medium` to `text-base-medium`
- renames the removed radius aliases (`rounded-md` → `rounded-5`, see
  [Radius aliases removed](#radius-aliases-removed))

**Run the token migration once per codebase.** It is not idempotent, because
some v2 names overlap with v0 names. The radius renames are idempotent, and they
also run on codebases that are already migrated.

**Symlinks.** In every mode, the codemod stays inside the directories you give
it. A symlink whose real path leaves the target (a file or a directory) is
skipped and listed at the end of the run. Run the codemod on each real package
root, so that a shared package linked into several apps is migrated once.

**After upgrading to `frappe-ui@1.0.0-beta.11`, run the codemod again.**

- Apps that already ran it get only the typography correction (`text-lg` →
  `text-md`, `text-xl` → `text-lg`, ...) and the radius renames.
- Apps that still have pre-v2 color tokens can pass `--force`. Review the output
  carefully, because color tokens can shift twice.
- Already ran the typography correction too? Pass `--radius-only`. It does only
  the radius renames (safe to repeat) and reports removed tokens. It never
  touches color or text-size names, so nothing can shift twice.

### Unused tokens and utilities removed

An audit before `1.0.0` (#940) removed the token names below. None of them had
any call sites in frappe-ui or in any consumer app.

**Silent break** for each: the class or `--*` variable stops applying, with no
build or type error.

```
text-tiny
text-13xl / text-14xl / text-15xl / text-16xl (and their -medium/-semibold/-bold/-black variants)
shadow-status
--elevation-status
surface-alert-button-default / -info / -success / -warning / -error
ink-alert-button-default / -info / -success / -warning / -error
surface-alpha-gray-2-overlay
surface-alpha-red-1 … surface-alpha-red-7
outline-alpha-red-2 / -3 / -4
```

The codemod reports only some of these: the dead text sizes, the `text-*-black`
styles, and the two alpha-red families. It has no rule for `shadow-status`,
`--elevation-status`, the `alert-button` tokens, or
`surface-alpha-gray-2-overlay`. Grep for those five by hand.

If your build used any of these, replace them with the nearest step on the
regular scale. For example: `text-16xl` → `text-12xl`, `shadow-status` →
`shadow-sm`, `surface-alert-button-error` → `surface-red-2` (or whichever
`variant` + `theme` pair the design calls for).

### Radius aliases removed

The named radius aliases are removed in `1.0.0`. Numbered tokens are now the
only radius names
([ADR-0006](https://github.com/frappe/frappe-ui/blob/main/spec/adr/0006-numbered-radius-tokens.md)).
`rounded-none` and `rounded-full` are kept.

**Silent break.** The preset replaces Tailwind's `borderRadius` scale, so an
unmigrated `rounded-md` emits no CSS at all. There is no build error and no type
error, just square corners. **Codemod:** `tokens-v2` handles these. Run it, then
grep for leftover aliases.

| Before        | After       | px  |
| ------------- | ----------- | --- |
| `rounded`     | `rounded-4` | 8   |
| `rounded-sm`  | `rounded-1` | 4   |
| `rounded-md`  | `rounded-5` | 10  |
| `rounded-lg`  | `rounded-6` | 12  |
| `rounded-xl`  | `rounded-7` | 16  |
| `rounded-2xl` | `rounded-8` | 20  |

The same map applies to:

- every directional and corner form (`rounded-t-lg` → `rounded-t-6`,
  `rounded-tl-sm` → `rounded-tl-1`)
- the logical sides (`rounded-ss-md` → `rounded-ss-5`, and the same for `s`,
  `e`, `se`, `es`, `ee`)
- the bare directional aliases (`rounded-t` → `rounded-t-4`)
- variant prefixes (`hover:rounded-2xl` → `hover:rounded-8`)

The pixel values are identical. Only the names change, not the rendering.

**Caveat:** the bare word `rounded` is also an English word, so the codemod
rewrites it only inside quoted strings and `@apply` rules. It can miss a class
list inside a multi-line template literal. Grep for bare `rounded` after
running it.

**CSS variables.** The alias CSS variables are removed with the aliases.
Hand-written CSS that reads `var(--radius-sm)` / `var(--radius-md)` /
`var(--radius-lg)` / `var(--radius-xl)` / `var(--radius-2xl)` resolves to
nothing: the same silent break. The codemod rewrites only `rounded-*` classes,
so grep for `--radius-(sm|md|lg|xl|2xl)` and switch to the numbered variables
(`var(--radius-5)` for the old `--radius-md`, with the same map as above).

### `text-*-black` styles removed

The `text-<size>-black` / `text-p-<size>-black` style classes are removed. They
had no usage anywhere, and the Figma weights behind them were corrupt export
data.

**Silent break:** the class stops emitting CSS.

The codemod no longer merges `font-extrabold` (or `font-black`) onto a
`text-*-black` class. It flags the pair under "needs manual attention" instead.
If you need weight 800, keep `font-extrabold`. There is no style class for it
with corrected letter spacing.

### Ink chromatic scales shift one level

The updated espresso v2 tokens shift every chromatic ink scale down one level:
the new `ink-red-1` is the old `ink-red-2`, and so on for all 11 chromatic
families. The scales now end at `-9`. `ink-gray` keeps its own 9-step scale and
does not shift.

**Silent break:** every `ink-<family>-N` site renders one shade off after the
token update.

**Codemod:** run `tokens-v2` once with `--ink-shift`:

```sh
npx --package frappe-ui@rc tokens-v2 --ink-shift .
```

**Land the codemod and the upgrade in the same change**: the change that
upgrades to the frappe-ui version with the shifted tokens.

- The upgrade without the codemod renders one shade off.
- The codemod without the upgrade also renders one shade off.

Add `--dry-run` first to review the renames before they apply:

```sh
npx --package frappe-ui@rc tokens-v2 --ink-shift --dry-run .
```

**Flags.** `--ink-shift` cannot be combined with `--force` or `--radius-only`.
The run exits with an error instead of hiding which renames applied. A dry run
is not a safety check either: it only warns when it finds a run-once marker,
while a real run refuses.

**Run it exactly once per codebase.** This mode runs only the ink shift: no
color renames, no typography, no radius renames. Nothing in a file shows whether
it already ran (`ink-red-5` is a valid name before and after), so a second run
shifts twice. To guard against that:

- `--ink-shift` takes directory targets only.
- A real run writes a `.tokens-v2-ink-shift` marker file in each target
  directory.
- It refuses to run again while a marker exists in the target, in an ancestor,
  or anywhere in the target subtree.
- The marker is written before the first file is rewritten, so an interrupted
  run refuses to retry instead of shifting twice. To recover, restore the tree
  with git, delete the marker, and re-run.
- Commit the marker with the migration. On a fresh clone without it, the guard
  is gone, and a teammate's re-run shifts twice. Delete it only when you want to
  re-run the shift on purpose.

**Parallel runs.** Each marker is created exclusively, so two runs on the same
directory cannot both start: the second one stops before it rewrites anything.
For nested targets (a repo root and one of its subdirectories), the run searches
again after it claims its markers, and stops if another run claimed an
overlapping tree. Both runs can stop this way. Neither has rewritten a file at
that point, so re-run whichever tree is still unshifted.

**Linked and vendored packages.** The marker search follows the same symlink
rule as the run: a marker in a linked external package never blocks a target
that the run would not rewrite. Run the codemod on each real package root
directly, so every migrated tree gets its own marker.

If the refusal names a marker inside a vendored dependency (for example
`vendor/frappe-ui/.tokens-v2-ink-shift`), that dependency is already shifted.
Leave its marker alone and target the directories that do not contain it.
Pointing at the app root does not help: the search walks the whole subtree, so
any ancestor of the vendored copy finds the same marker and refuses again.
Target `src/` and your other own trees instead.

**The old `-1` step.** The old `ink-<family>-1` step was white. The new `-1` is
a light tint, so these sites have no automatic replacement. The codemod flags
them under "needs manual attention". The usual fix is `text-white` (or the CSS
color `white` in hand-written CSS).

### Tight text styles are 1.35 {#line-height}

**Silent break.** The `text-*` styles from `text-2xs` to `text-4xl`, with every
weight variant, move from line-height 1.15 to 1.35. Each line of text is 0.2em
taller: 2.4px at 12px, 2.8px at 14px, 4.8px at 24px. The `text-p-*` styles and
`text-5xl` and up do not change.

`leading-tighter` is a new class that sets 1.15, the old default.
`leading-tight` keeps Tailwind's 1.25.

frappe-ui components keep their height. Your own markup can move:

- **A row sized by its content grows.** A menu, a list of search results or a
  stack of cards grows by 2.4 to 5px for each row.
- **A fixed-height box can clip its text or push it off-centre.** For example
  `h-4`, a `min-h-*` that the text used to fill, or an offset such as
  `top-[41px]` that you measured from the old line.
- **Code that reads the value** breaks, for example a chart layout that
  hard-codes 1.15.

Add `leading-tighter` to single-line UI in a fixed-height box:

```vue
<!-- Before: the row is 28px, a 16.1px line and 12px of padding -->
<button class="flex w-full items-center px-2 py-1.5 text-base">
  {{ item.label }}
</button>

<!-- After: leading-tighter keeps the 16.1px line, so the row stays 28px -->
<button class="flex w-full items-center px-2 py-1.5 text-base leading-tighter">
  {{ item.label }}
</button>
```

For long prose, use `text-p-*`. Its line height is 1.4 to 1.6.

## Family stylesheets (list-style.css / editor-style.css)

The manual `frappe-ui/list-style.css` and `frappe-ui/editor-style.css` exports
are removed. The `frappe-ui/list` and `frappe-ui/editor` barrels are now marked
as having side effects. So each family's CSS is included in your production
build automatically when you import anything from its subpath.

| Before                                  | After                                      |
| --------------------------------------- | ------------------------------------------ |
| `@import 'frappe-ui/list-style.css';`   | nothing — the CSS ships with `frappe-ui/list`   |
| `@import 'frappe-ui/editor-style.css';` | nothing — the CSS ships with `frappe-ui/editor` |

**Loud break.** The build fails
(`Missing "./list-style.css" specifier in "frappe-ui" package`) until the lines
are gone. Delete the manual imports. There is nothing to add back:

```css
/* Before */
@import 'frappe-ui/list-style.css';
@import 'frappe-ui/editor-style.css';
/* After: nothing — the CSS ships with the subpath import */
```

## `hljs-theme.css` and `tailwind/tokens.js` (removed)

Both subpaths are removed. **Loud break** for both: the specifier stops
resolving.

| Removed                        | Replacement                                                     |
| ------------------------------ | --------------------------------------------------------------- |
| `frappe-ui/hljs-theme.css`     | none — `frappe-ui/editor` ships its own code-block highlighting |
| `frappe-ui/tailwind/tokens.js` | `frappe-ui/tailwind/tokens` — new specifier **and** new names   |

### `frappe-ui/tailwind/tokens`: new specifier and new names

The subpath is back without the `.js`, but that is not the whole change. Two
things change: the specifier, and every name behind it except `fontSize`. If you
only drop the extension, you import names that the module does not export, and
the import fails to link. Rewrite the specifier and the import list together.

An earlier version of this guide sent you to the preset. That was wrong. The
preset is a Tailwind `Config`, and its colours, radii and sizes are built inside
`plugin.js` when Tailwind calls the plugin, so you cannot read a value out of
it.

```js
// Before
import {
  borderRadius,
  boxShadow,
  fontSize,
  generateCSSVariables,
  generateSemanticColors,
} from 'frappe-ui/tailwind/tokens.js'

// After
import {
  radius,
  shadows,
  fontSize,
  cssVariables,
  semanticColors,
} from 'frappe-ui/tailwind/tokens'
```

The names changed, and so did the shapes:

| Before | After | What changed |
| ------ | ----- | ------------ |
| `borderRadius` | `radius` | Renamed. The numbered scale in px, `0` to `9` plus `none` and `full`. |
| `boxShadow` | `shadows` | Renamed. Still a flat map of composed `box-shadow` strings, with the same six elevation values plus `none`. Two things change: `DEFAULT` now comes right after `base` instead of last, and the `status` key is removed. It came from `elevation.custom`, which the Figma export stopped filling. |
| `generateCSSVariables()[':root']` | `cssVariables.light` | A constant, not a function, and keyed by theme instead of by selector. `generateCSSVariables()['[data-theme="dark"]']` is `cssVariables.dark`, which still holds the same dark layer: the re-valued semantic and focus properties, plus the dark ramps under `--dark-*` names. |
| `generateSemanticColors()` | `semanticColors.light` or `semanticColors.dark` | A constant, not a function, and one level deeper. The old return value was `color-mix(...)` strings that did not depend on the theme, so it had no theme key. Pick a side, and you get resolved `oklch(...)` values. |
| `fontSize` | `fontSize` | The one name that stays. Each entry is now an object `{ fontSize, lineHeight, letterSpacing, fontWeight }`, not a `[size, meta]` tuple, so a call site that destructured `const [size, meta] = fontSize.base` breaks. |

**Colour values.** The old module re-exported `colorPalette.js`, so its colours
carried Tailwind placeholders. A consumer got
`oklch(L C H / <alpha-value>)` from `generateColorPalette()`, and a
`color-mix(...)` wrapper around `calc(<alpha-value> * 100%)` from
`generateSemanticColors()`. A colour picker given either one renders an empty
swatch. The new exports carry no placeholder.

`colors`, `focusRing`, `fontFamily`, `fontWeight`, `screens`, `spacing` and
`tracking` are exported from the same subpath. See
[Tailwind Setup](/docs/getting-started/tailwind#design-tokens).

## `frappe-ui/frappe` and `frappe-ui/drive` (removed)

Both subpaths are removed in v1. frappe-ui is a UI library. The members that
know about doctypes, onboarding flows or billing moved to `@framework/ui` (the
`ui/` package in the [frappe repo](https://github.com/frappe/frappe)).

**Loud break** for every row: the import path stops resolving.

| Before (`frappe-ui/frappe`)                                                                                | After                                                       |
| ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `useTelemetry`, `telemetryPlugin`                                                                          | `@framework/ui`                                             |
| `useOnboarding`, `GettingStartedBanner`, `IntermediateStepModal`, `HelpModal`, `showHelpModal`, `minimize` | `@framework/ui`                                             |
| `TrialBanner`, `SignupBanner`                                                                              | `@framework/ui`                                             |
| `DataImport`                                                                                               | `@framework/ui`                                             |
| `Link`, `LinkProps`, `LinkEmits`, `LinkExposed`, `LinkOption`                                              | `@framework/ui` (superset, see below)                       |
| `Filter`                                                                                                   | `@framework/ui` (superset, see below)                       |
| `OnboardingSteps`, `HelpCenter`, `showHelpCenter`                                                          | removed — they live on inside `@framework/ui`'s `HelpModal` |
| `frappe-ui/drive`, `frappe-ui/drive/*`                                                                     | removed, no replacement                                     |

`@framework/ui` has `frappe-ui` as a peer dependency. Add `@framework/ui` as a
dependency if your app does not have it yet, then change the import path:

```js
// Before
import { useTelemetry, TrialBanner } from 'frappe-ui/frappe'

// After
import { useTelemetry, TrialBanner } from '@framework/ui'
```

Two replacements are supersets of what they replace, so existing call sites work
unchanged:

- `Link` adds `redirectable` / `editable` props and `redirect` / `edit` emits.
- `Filter` adds a `useFilters` composable, `parseFilters` / `serializeFilters`,
  and an operator registry.

The drive components were removed because the drive app already has the live
copy of all six. Nothing imported the subpath.

### Remove the stale Tailwind glob

The `frappe/` directory no longer ships, so this line in `tailwind.config.js`
scans nothing. Delete it:

```js
// Delete this line
'./node_modules/frappe-ui/frappe/**/*.{vue,js,ts,jsx,tsx}',
```

Better: replace the hand-copied list with the
[`content` export](/docs/getting-started/tailwind#content-paths), which follows
the library's source directories for you.

## Navigation destinations

Component props that take a destination are renamed. **Codemod:**
`npx destinations-v1 .` migrates statically named component props imported from
`frappe-ui`. It covers the first three renames below, including bound and
shorthand props:

- Replace component router props named `to` with `route`. Keep `to` only inside
  the route object itself.
- Replace Button `link` with `href` for external URLs.
- Replace PageHeader back `to` with `fallbackRoute`.
- Replace TabButton `tooltip` with app-owned help UI, and convert non-string
  labels to strings. (Not covered by the codemod.)

The codemod leaves these alone on purpose. Review them by hand:

- globally registered components
- JavaScript and TypeScript data objects
- render functions
- `v-bind="object"` spreads

## Dialog

The `options` object is flattened into top-level props, and several slots are
renamed. See the [Dialog](./components/dialog) component page for the full API.

| Before                                | After                                       |
| ------------------------------------- | ------------------------------------------- |
| `v-model="show"`                      | `v-model:open="show"`                       |
| `:options="{ title, size, actions }"` | `title` / `size` / `:actions`               |
| `disableOutsideClickToClose`          | `:dismissible="false"`                      |
| `<template #body-content>`            | default slot                                |
| `<template #body-main>`               | default slot                                |
| `<template #body-title>`              | `<template #title>`                         |
| `<template #body-header>`             | `<template #title>` (no direct replacement) |
| `<template #body>`                    | `bare` prop + default slot                  |
| `onClick: (close) => …`               | `onClick: ({ close }) => …`                 |
| `:icon="{ appearance: 'warning' }"`   | `icon="…"` + `theme="amber"`                |
| `dialogRef.close()`                   | `v-model:open` / `close` slot prop          |
| manual focus hacks / `v-focus`        | `autofocus` attr on a descendant            |

### Props and slots

**Silent break** for most rows of the table. Vue drops an unknown prop or slot
with no error. The dialog then renders with no title, no actions, or an empty
body. A leftover `:disable-outside-click-to-close` quietly makes the dialog
dismissible.

**Loud break** for two rows:

- `onClick: (close) => close()` throws `TypeError: close is not a function`.
- A template-ref `.close()` throws the same way.

`v-model` itself still works, because `modelValue` is kept as a second binding.
But `open` is the main binding, and it wins when both are bound.

```vue
<!-- Before -->
<Dialog :options="{ title: 'Edit Item' }" v-model="show">
  <template #body-content>
    <FormControl label="Name" v-model="item.name" />
  </template>
  <template #actions>
    <Button variant="solid" @click="save">Save</Button>
  </template>
</Dialog>

<!-- After -->
<Dialog title="Edit Item" v-model:open="show">
  <FormControl label="Name" v-model="item.name" />
  <template #actions>
    <Button variant="solid" @click="save">Save</Button>
  </template>
</Dialog>
```

For reactive `:options` objects, spread them: `<Dialog v-bind="opts || {}" />`.

For the imperative API, use `dialog.confirm` / `dialog.danger` / `dialog.prompt`
from `frappe-ui`, and wrap your app root in `<FrappeUIProvider>`. These helpers
are callback-based: when `onConfirm` resolves, the dialog closes; when it throws,
the dialog stays open.

### The `icon` object is replaced by `icon` + `theme` {#dialog-icon-theme}

`icon` takes a `lucide-*` class name or a Vue component. The tone moves to its
own `theme` prop. The two choices are now separate, and an icon component is now
possible.

```vue
<!-- Before -->
<Dialog :icon="{ name: 'lucide-alert-triangle', theme: 'red' }" ... />

<!-- After -->
<Dialog icon="lucide-alert-triangle" theme="red" ... />
<Dialog :icon="AlertTriangleIcon" theme="red" ... />
```

The same two keys move on `dialog.confirm`, `dialog.danger` and `dialog.prompt`.
These already had a top-level `theme`:

```js
// Before
dialog.confirm({
  title: 'Delete',
  icon: { name: 'lucide-trash', theme: 'red' },
})

// After
dialog.confirm({ title: 'Delete', icon: 'lucide-trash', theme: 'red' })
```

**Silent break in production, loud in development.** An object passed to `icon`
now renders an empty icon badge: the circle paints in the neutral tone with no
glyph in it. A development build warns once per component and prop:

```
[frappe-ui] Dialog.icon received a plain object (keys: name, theme). The
{ name, theme } icon object was removed in 1.0.0. Pass a lucide-* string or a
component, and set `theme` at the top level. The icon renders empty.
```

The `theme` inside the old object is ignored, so pass `theme` at the top level.

The `DialogIcon` type is removed (loud in TypeScript).

Coming from v0, the older `appearance` key is removed the same way. Map it to
`theme` like this:

| `appearance` (v0) | `theme` |
| ----------------- | ------- |
| `warning`         | `amber` |
| `info`            | `blue`  |
| `danger`          | `red`   |
| `success`         | `green` |

### `DialogAction` is `ImperativeDialogAction` for `dialog.*`

Two action types had the same name:

- The component's `actions` prop takes `DialogAction`. Its `onClick` receives
  `{ close }`.
- The imperative helpers take a different shape. Its `onClick` receives
  `{ close, setError }` and is awaited. This one is now exported as
  `ImperativeDialogAction`.

```ts
// Before: the name resolved to the component's type, which does not match
import type { DialogAction } from 'frappe-ui'
const actions: DialogAction[] = [{ label: 'Delete', onClick: async () => {} }]
dialog.confirm({ title: 'Delete', actions })

// After
import type { ImperativeDialogAction } from 'frappe-ui'
const actions: ImperativeDialogAction[] = [
  { label: 'Delete', onClick: async () => {} },
]
```

Types only. Nothing changes at runtime.

### `theme: 'yellow'` → `theme: 'amber'`

The warning tone is `amber`, the same as in `Alert`, `SidebarCard`, `Badge` and
`Avatar`. `Dialog` was the last component that spelled it `yellow`. It already
drew that value with the amber tokens, so only the word changes, not the color.

| Before                                | After                                |
| ------------------------------------- | ------------------------------------ |
| `theme="yellow"`                      | `theme="amber"`                      |
| `dialog.confirm({ theme: 'yellow' })` | `dialog.confirm({ theme: 'amber' })` |

**Silent break** in JavaScript: `yellow` is no longer a key in the tone maps, so
the icon renders with no tone and nothing throws. TypeScript reports a union
error.

### A template ref no longer exposes `close()`

**Loud break:** calling `.close()` on the template ref now throws. `Dialog`
exposes nothing on its template ref (ADR-0012). Control `open` through
`v-model:open`, or use the `close` slot prop from inside `#default` /
`#actions`.

```vue
<!-- Before -->
<Dialog ref="dialogRef" v-model="show" />
<script setup>
dialogRef.value.close()
</script>

<!-- After -->
<Dialog v-model:open="show" />
<script setup>
show.value = false
</script>
```

## Popover / HoverCard / Tooltip

The v0 `Popover` API is **removed** in `1.0.0`. Nothing is aliased and nothing
warns.

**Silent break.** Vue drops an unknown prop or slot without an error, so a
missed call site renders a popover with no trigger, or an empty one. Check every
`<Popover>` in your app.

| Before                                            | After                                                                                                                                      |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `#target` slot                                    | `#trigger` — reka wires the click, so drop your own click handler                                                                          |
| `#body` slot                                      | `#default` + `bare` prop (renders without the panel shell)                                                                                 |
| `#body-main` slot                                 | `#default`                                                                                                                                 |
| `togglePopover` / `updatePosition` slot props     | `setOpen` (`updatePosition` is gone — reka repositions on its own)                                                                         |
| `placement="bottom-start"`                        | `side="bottom"` + `align="start"` (a bare side like `placement="bottom"` maps to `align="center"`)                                         |
| `show` / `v-model:show`                           | `open` / `v-model:open`                                                                                                                    |
| `update:show` emit                                | `update:open`                                                                                                                              |
| `hideOnBlur`                                      | `dismissible`                                                                                                                              |
| `matchTargetWidth`                                | `matchTriggerWidth`                                                                                                                        |
| `trigger="hover"` (+ `hoverDelay` / `leaveDelay`) | the [`HoverCard`](./components/hovercard) component                                                                                        |
| `popoverClass`                                    | `data-slot` CSS hooks                                                                                                                      |
| `transition="default"`                            | built-in motion — delete the prop                                                                                                          |
| `PopoverPlacement` type                           | `PopoverSide` + `PopoverAlign`                                                                                                             |
| `PopoverLegacySlotProps` type                     | `PopoverSlotProps`                                                                                                                         |
| `NestedPopover`                                   | `Popover` — **loud**: the import fails, so the build names every call site. It never nested, and it was the last `@popperjs/core` consumer |

### Changes with nothing to grep for

These two changes have no prop name you can search for:

- **Panel width.** v0 always set the panel's `min-width` to the trigger's width.
  v1 does this only when `matchTriggerWidth` is set. A panel that depended on it
  now shrinks to its content.
- **Portal target.** The panel no longer teleports into a
  `#frappeui-popper-root` div. reka portals it to `body`, or to the host's portal
  target. Delete any CSS or `document.querySelector` that targets that id;
  nothing creates it now.

### Trigger and content slots

`#target` did not wire anything; you called `togglePopover` yourself. `#trigger`
renders through reka's `PopoverTrigger` as-child. That adds the click handler,
keyboard support and `aria-expanded`.

**Remove your own click handler.** If you keep it, the popover toggles twice and
stays shut.

```vue
<!-- Before -->
<Popover placement="bottom-end">
  <template #target="{ togglePopover }">
    <Button label="Filter" @click="togglePopover" />
  </template>
  <template #body-main="{ close }">
    <FilterPanel @done="close" />
  </template>
</Popover>

<!-- After -->
<Popover side="bottom" align="end">
  <template #trigger>
    <Button label="Filter" />
  </template>
  <template #default="{ close }">
    <FilterPanel @done="close" />
  </template>
</Popover>
```

`#body` rendered outside the panel shell, so it maps to `#default` **plus**
`bare`. Without `bare`, your content ends up inside a second panel.

```vue
<!-- Before -->
<Popover>
  <template #body><EmojiPicker /></template>
</Popover>

<!-- After -->
<Popover bare>
  <EmojiPicker />
</Popover>
```

### Driving the popover yourself

If your trigger needs custom timing (a delayed open, or a drag that must not
open it), bind `open` and accept only closes. Then the trigger's own toggle
cannot open the popover without your code knowing:

```vue
<Popover :open="isOpen" @update:open="(value) => !value && (isOpen = false)">
  <template #trigger>
    <div @click="onClick">…</div>
  </template>
</Popover>
```

### Slot props

`#trigger` and `#default` receive `{ open, setOpen, close }`.

| Before                    | After                                   |
| ------------------------- | --------------------------------------- |
| `isOpen`                  | `open`                                  |
| `open` (a method to call) | `setOpen(true)`, or nothing — see below |
| `togglePopover`           | `setOpen`                               |
| `updatePosition`          | gone; reka repositions on its own       |

`open` is now the boolean state. That is what it already meant on `Dropdown`,
`Select`, `MultiSelect`, `HoverCard` and `Sidebar`. Only `Popover` used it for a
method.

**Silent break:** a destructured `isOpen` becomes `undefined`, so a class bound
to it stops applying with no error. Grep for it.

```vue
<!-- Before -->
<template #trigger="{ isOpen }">
  <Button :class="isOpen && 'ring-2'" label="Filter" />
</template>

<!-- After -->
<template #trigger="{ open }">
  <Button :class="open && 'ring-2'" label="Filter" />
</template>
```

Most triggers need no slot props at all. `#trigger` wires its own click, so the
`open()` method it used to pass had no callers. `setOpen` is there for code
that opens and closes the popover by hand.

### Attributes are not inherited

**Silent break.** `<Popover class="…">` and `<Popover :style="…">` used to land
on a wrapper that the legacy `#target` rendered. `#trigger` is as-child and
renders no wrapper, so those attributes now go nowhere. Move them onto the
element inside `#trigger`.

### Hover panels

Panels that open on hover move to the [`HoverCard`](./components/hovercard)
component.

`hoverDelay` and `leaveDelay` now use milliseconds. Change `0.5` to `500` and
`0.3` to `300`. Tooltip and TooltipProvider delays use the same unit. HoverCard
keeps its 300ms default.

### Tooltip

| Before              | After                                                      |
| ------------------- | ---------------------------------------------------------- |
| `hoverDelay="0.5"`  | `hoverDelay="500"` (milliseconds)                          |
| `skipDelay="0.3"`   | `skipDelay="300"` on `TooltipProvider` (milliseconds)      |
| `placement="right"` | `side="right"`                                             |
| `arrowClass`        | `[data-slot="arrow"]` CSS, or `offset` to shift the bubble |
| `#body`             | `#content` (add `bare` if the content owns its surface)    |

**Silent break.** The tooltip keeps working, but it points the wrong way, loses
its styling, or comes up empty.

`arrowClass` was documented as the arrow's fill, but it was mostly used to move
the bubble's position. `offset` does that directly.

`#default` is still the **trigger**. This is deliberate and will not change.

```vue
<!-- Before -->
<Tooltip text="Preview" placement="bottom" arrow-class="mb-3">
  <Button label="Preview" />
</Tooltip>

<!-- After -->
<Tooltip text="Preview" side="bottom" :offset="12">
  <Button label="Preview" />
</Tooltip>
```

`#body` replaced the whole bubble, surface included. Call sites copied the
bubble's own classes by hand to get the surface back. `#content` renders inside
the bubble, so you can remove that wrapper:

```vue
<!-- Before -->
<Tooltip>
  <template #body>
    <div
      class="rounded bg-surface-gray-10 px-2 py-1 text-xs text-ink-base shadow-xl"
    >
      <span>Hide password</span>
    </div>
  </template>
  <Button icon="eye" />
</Tooltip>

<!-- After -->
<Tooltip>
  <template #content>
    <span>Hide password</span>
  </template>
  <Button icon="eye" />
</Tooltip>
```

If the content really does bring its own surface (an image preview, for
example), keep it and add `bare`:

```vue
<Tooltip bare>
  <template #content>
    <img :src="url" class="max-h-40 rounded-4 shadow-xl" />
  </template>
  <span class="truncate">{{ filename }}</span>
</Tooltip>
```

## CommandPalette

`CommandPalette` and `CommandPaletteItem` leave the root export. The family is
rebuilt as seven parts that you compose, in `frappe-ui/experimental`. It stays
there, with no stability promise, until gameplan, helpdesk and this site all use
it.

| Before                                         | After                                                        |
| ---------------------------------------------- | ------------------------------------------------------------ |
| `import { CommandPalette } from 'frappe-ui'`   | `import { CommandPalette } from 'frappe-ui/experimental'`    |
| `:groups="groups"`                             | `CommandPaletteList` + `CommandPaletteGroup` + `CommandPaletteItem` markup |
| no filtering                                   | filters by default; `:filterable="false"` to turn off        |
| built-in `Mod+K`                               | register `Mod+K` in your app                                 |
| `v-model:show`, `v-model:search-query` (beta and older) | `v-model:open`, `v-model:query`                      |

**Loud break** at the import: the root import fails to resolve, so your build
names every call site.

```ts
// Before
import { CommandPalette, CommandPaletteItem } from 'frappe-ui'

// After
import {
  CommandPalette,
  CommandPaletteInput,
  CommandPaletteList,
  CommandPaletteGroup,
  CommandPaletteItem,
  CommandPaletteEmpty,
  CommandPaletteFooter,
} from 'frappe-ui/experimental'
```

### The `groups` prop becomes markup

`groups` is removed. Write the rows as parts, so a group renders whatever it
needs without a separate `component` option for each group.

```vue
<!-- Before -->
<CommandPalette
  v-model:open="open"
  v-model:query="q"
  :groups="groups"
  @select="onSelect"
/>

<!-- After -->
<CommandPalette v-model:open="open" v-model:query="q" @select="onSelect">
  <CommandPaletteInput placeholder="Search" />

  <CommandPaletteList>
    <CommandPaletteGroup
      v-for="group in groups"
      :key="group.title"
      :label="group.hideTitle ? undefined : group.title"
    >
      <CommandPaletteItem
        v-for="item in group.items"
        :key="item.name"
        :value="item"
        :disabled="item.disabled"
      >
        <template v-if="item.icon" #prefix>
          <span :class="[item.icon, 'mr-3 size-4']" />
        </template>
        {{ item.title }}
        <template v-if="item.description" #suffix>{{ item.description }}</template>
      </CommandPaletteItem>
    </CommandPaletteGroup>
  </CommandPaletteList>

  <CommandPaletteEmpty />
</CommandPalette>
```

`CommandPaletteList` is the list itself, and the only part that scrolls. It may
contain rows and groups and nothing else, so the input field, the empty state
and the footer stay outside it.

| Before             | After                                                               |
| ------------------ | ------------------------------------------------------------------- |
| `:groups="groups"` | `CommandPaletteList` + `CommandPaletteGroup` + `CommandPaletteItem` |
| `group.title`      | `:label` on `CommandPaletteGroup`                                   |
| `group.hideTitle`  | leave `label` out                                                   |
| `group.component`  | write the row in the item's slots                                   |
| `item.icon`        | `#prefix` on `CommandPaletteItem`                                   |
| `item.description` | `#suffix` on `CommandPaletteItem`                                   |
| `item.disabled`    | `:disabled` on `CommandPaletteItem`                                 |
| `@select="fn"`     | `@select="(value, event) => fn(value)"`                             |

`select` now carries two arguments: the item's `value`, and the click that
picked it. Call `event.preventDefault()` to keep the palette open.

### Filtering is included

**Behavior change.** The old palette filtered nothing; it rendered `groups` as
given. The new one filters against the query by default, so a call site that
never filtered starts narrowing its list. Usually that fixes something instead
of breaking it.

Set `:filterable="false"` when a server search already decided what matches,
then refetch on `update:query` yourself. `Combobox` and `MultiSelect` use the
same prop name.

An item filters on the text of its default slot. `#prefix` and `#suffix` are not
included, so a shortcut hint at the end of a row is never searched.

### `Mod+K` moves to the caller

The palette registered `Mod+K` itself, with
`enabled: () => !document.activeElement?.closest('.ProseMirror')`. That
hardcoded knowledge of the rich-text editor. Both are removed. Register the
shortcut in your app, where you know when it should apply:

```js
useKeyboardShortcut({
  combo: 'Mod+K',
  description: 'Open command palette',
  allowInInput: true,
  handler: () => (open.value = true),
})
```

**Keep `allowInInput: true`.** The old palette set it, and
`useKeyboardShortcut` defaults it to `false`. If you leave it out, `Mod+K` stops
working as soon as a field has focus.

### If you are on `1.0.0-beta` or older

Two earlier renames are part of the same move: `show` became `open`, and
`searchQuery` became `query`.

**Silent break** for both: Vue accepts the unknown prop, so the palette never
opens and your query binding never updates. Suite's `SheetEditor` still binds
`v-model:show` and `v-model:searchQuery`, so its palette does not open today.

| Before                           | After                      |
| -------------------------------- | -------------------------- |
| `v-model:show="show"`            | `v-model:open="open"`      |
| `v-model:search-query="q"`       | `v-model:query="q"`        |
| `@update:searchQuery="onSearch"` | `@update:query="onSearch"` |

## DatePicker / TimePicker family

Covers `DatePicker`, `DateRangePicker`, `DateTimePicker` and `TimePicker`. They
share the same trigger props and slots. Every removed prop and slot below is
deleted, not aliased.

| Before                                                                         | After                               |
| ------------------------------------------------------------------------------ | ----------------------------------- |
| `:value` prop                                                                  | `v-model`                           |
| `placement="bottom-start"`                                                     | `side` + `align` + `offset`         |
| `:autoClose`                                                                   | `:keepOpen` (inverted)              |
| `allowCustom` / picker-level `readonly`                                        | `typeable`                          |
| `inputClass`                                                                   | `class`                             |
| `minTime`/`maxTime` (TimePicker), `minDateTime`/`maxDateTime` (DateTimePicker) | `min` / `max`                       |
| `#target` (DatePicker, DateRangePicker, DateTimePicker)                        | `#trigger` — TimePicker has neither |
| `TimePicker.scrollMode`                                                        | nothing — list is always centered   |
| `TimePicker.use12Hour`                                                         | `format="h:mm A"`                   |

**Silent break** for most of this table. Nothing warns at the tag. An old prop
name that is no longer in the component's types lands as an inert extra
attribute instead of throwing. For the `min`/`max` aliases, the constraint just
stops being enforced. `#target` is the one slot case: content in a leftover
`<template #target>` stops rendering without an error. TypeScript callers get a
compile error instead. `grep` for each old name after upgrading.

`@change` still fires alongside `@update:modelValue`. It is not deprecated and
does not need replacing.

### Trigger slot props

`#trigger`, `#prefix`, `#suffix` and `#actions` receive `open`, `setOpen`,
`close` and `disabled`, alongside their picker-specific fields. `TimePicker`'s
`#suffix` receives the same. `close()` is shorthand for `setOpen(false)`.

| Before          | After     |
| --------------- | --------- |
| `isOpen`        | `open`    |
| `togglePopover` | `setOpen` |

`displayLabel` and `inputValue` are unchanged. Replace `toggle()` with
`setOpen(!open)`, and `toggle(value)` with `setOpen(value)`.

```vue
<!-- Before -->
<template #trigger="{ togglePopover, isOpen }">
  <Button :class="isOpen && 'ring-2'" @click="togglePopover" />
</template>

<!-- After -->
<template #trigger="{ open, setOpen }">
  <Button :class="open && 'ring-2'" @click="setOpen(!open)" />
</template>
```

**Behavior changes.** These apply even if you do not touch your code:

- `DateRangePicker` emits a `[from, to]` tuple. Update handlers that called
  `.split(',')` on the value.
- **Silent break:** `DateRangePicker.modelValue` is `string[]` on the way in
  too. A stored v0 `"from,to"` string is read by position, so the picker opens
  with nothing selected and no error. Convert stored values with `.split(',')`
  before binding.
- `DateTimePicker` no longer closes by itself when a date is clicked. Close it
  from `@update:modelValue`, or add an Apply button in `#actions`.
- The popover footer and the automatic Clear button are removed. If you relied
  on them, render an explicit Clear button inside `#actions`.
- `DateRangePicker.clearable` now defaults to `true`, and nothing on
  `DateRangePicker` reads it. Emptying the input always clears the range.
  `DatePicker` and `DateTimePicker` still honour `:clearable="false"`.
- **Loud break:** `useDatePicker` and its helpers (`getDate`, `getDatesAfter`,
  `getDaysInMonth`, `isLeapYear`) are deleted, so the import fails. Nothing in
  the picker components used them. Drop the import.

### `TimePicker` emits: `open`, `close`, `input-invalid`, `invalid-change` {#timepicker-emits}

`update:open` replaces both `open` and `close`. Its payload is the new open
state. `input-invalid` and `invalid-change` are removed with nothing in their
place: typed text that does not parse reverts to the last valid value, and the
user sees that.

```vue
<!-- Before -->
<TimePicker
  @open="onOpen"
  @close="onClose"
  @input-invalid="showHint"
  @invalid-change="setInvalid"
/>

<!-- After -->
<TimePicker @update:open="(open) => (open ? onOpen() : onClose())" />
```

**Silent break** in JavaScript: a leftover `@open` lands as an inert listener
and never fires. TypeScript reports it, because `TimePickerEmits` is narrowed
(and now exported).

`Variant` on `TimePicker` is an alias of the shared `InputVariant`, not a second
scale.

### `DateRangePicker` `v-model` is `DateRangeValue`

The prop was `string[]`, which allowed a one-element array. Both sides are
`DateRangeValue` now: `[from, to]` or `[]`. TypeScript reports a
`ref<string[]>` bound to the model.

```ts
// Before
const range = ref<string[]>([])

// After
import type { DateRangeValue } from 'frappe-ui'
const range = ref<DateRangeValue>([])
```

### Picker template refs, styling hooks and ARIA

All four pickers expose `{ open, close, focus }` on the template ref. Before,
they exposed only `open()`. `open()` does nothing while the picker is disabled.

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue'
const picker = useTemplateRef('picker')
</script>

<template>
  <DatePicker ref="picker" v-model="date" />
  <Button label="Pick a date" @click="picker?.open()" />
</template>
```

**Additive.** Useful if you style or test the pickers:

- The chevron carries `data-slot="chevron"`.
- The `<input>` carries `role="combobox"`, `aria-haspopup` (`dialog` on the date
  pickers, `listbox` on `TimePicker`) and `aria-expanded`.
- The `<input>` keeps `data-slot="control"`. `data-slot="trigger"` is used only
  for the selection family's box.

## MonthPicker

**Loud break:** `MonthPicker` is deleted, so the import fails.

Its model was one string that held **both** parts, `"<Month> <Year>"` (for
example `"January 2026"`). A popover switched between a month grid and a year
grid to write it. Nothing in v1 does the same, so pick the replacement that
matches what your code reads from the value:

- Month **and** year: use `DatePicker` and format the value yourself, or pair
  two `Select`s.
- Month only: use `Select` with month options.

```vue
<!-- Before -->
<MonthPicker v-model="month" />
<!-- month === 'January 2026' -->

<!-- After -->
<Select
  v-model="month"
  :options="[
    { label: 'January', value: '01' },
    { label: 'February', value: '02' },
    // ...
  ]"
/>
<!-- month === '01' — the year is no longer part of the value -->
```

## Selection family (Dropdown / Select / Combobox / MultiSelect)

Upgrade these components together. They share an option shape and slot names,
and most apps use more than one of them. The removed props, option keys and slot
props are deleted, not aliased. Most of them fail without an error; each
subsection says which.

### Changes shared by all of them {#shared}

| Before                      | After                                        |
| --------------------------- | -------------------------------------------- |
| Dropdown `{ group, items }` | `{ group, options }`                         |
| `#option` slot              | `#item-label`, plus `#item-prefix` for icons |
| `option` item slot prop     | `item`                                       |
| `clearAll` slot prop        | `clear`                                      |
| chevron / trailing content  | `#suffix` slot (replaces the chevron)        |

Option values are `string | number` everywhere. `Select` no longer accepts
`bigint` or object values.

### Select

| Before                           | After                                                    |
| -------------------------------- | -------------------------------------------------------- |
| `displayValue` trigger slot prop | `selectedOption.label`                                   |
| `data-slot="trigger-value"`      | nothing — it marked an invisible element used to measure |
| empty value `undefined`          | `null`, the same as `Combobox`                           |

**Silent break:** the empty value. `Select` emitted `undefined` and `Combobox`
emitted `null`, so two single-value components gave two different answers for
"nothing selected". Both emit `null` now.

```js
// Before
watch(value, (v) => {
  if (v === undefined) reset()
})

// After
watch(value, (v) => {
  if (v === null) reset()
})
```

- `clear()` and the `clear` slot prop both write `null`.
- `MultiSelect` keeps `[]`, because consumers iterate over an empty array.
- An empty string is still a real value, so a "None" row with `value: ''` is
  returned unchanged.

Neither component emits anything on mount. A model that starts as `undefined`
stays `undefined` until the user picks or clears an option. Both components read
`undefined` as "nothing selected", so the placeholder renders either way.
Initialize the ref with `null` if you compare the value, send it to the server,
or watch it for the empty case.

**Additive:** `SelectionOption` and `SelectionGroup` are exported from the root,
so a wrapper around any of the three can name its option shape once. The
component-specific types stay.

### Combobox

| Before                                                              | After                                      |
| ------------------------------------------------------------------- | ------------------------------------------ |
| `slotName` on custom options                                        | `slot`, which dispatches to `#item-<slot>` |
| `searchTerm` in the custom-option context                           | `query`                                    |
| `input` emit                                                        | `@update:query`                            |
| `render` on options                                                 | `slots`                                    |
| `placement`, `ComboboxPlacement`                                    | `side` + `align`                           |
| `allowCustomValue`                                                  | `type: 'custom'` option + `condition`      |
| `reset()` on a template ref                                         | `clear()`                                  |
| `SimpleOption`, `GroupedOption`, `SelectableOption`, `CustomOption` | the `Combobox`-prefixed names              |

See [Custom rows](#custom-rows), [Custom options on
Combobox](#custom-options-on-combobox) and [If you used
`allowCustomValue`](#if-you-used-allowcustomvalue) for the rows that need code
changes.

### MultiSelect

| Before                   | After                                                               |
| ------------------------ | ------------------------------------------------------------------- |
| `compareFn` prop         | nothing — an option is selected when its `value` is in `modelValue` |
| `displayValue` slot prop | `summary` on `#summary`, or `selectedOptions`                       |
| `toggleOpen` slot prop   | `setOpen(boolean)`                                                  |

### Dropdown and ContextMenu

| Before                                     | After                                                                                                         |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `placement` prop, `DropdownPlacement` type | `align`                                                                                                       |
| `{ group, items }`                         | `{ group, options }`                                                                                          |
| `component:` option rows                   | `slots: { item: fn }`                                                                                         |
| `DropdownExposed` type                     | nothing — it described a template ref surface that never existed; use `v-model:open` or the `close` slot prop |

**Silent break** in plain JavaScript apps, for all three behavior removals below.
The old code still runs and renders wrong instead of failing, so check each one.

- TypeScript callers get errors instead: `items` and `component` stay in the
  option types as `never`, and `placement` is removed from `DropdownProps`.
- A development-mode console warning also fires when `placement`, `items` or
  `component` reaches the menu at runtime.

These changes apply the same way to `ContextMenu`, which shares the option
shape. `ContextMenuComponentOption` is removed together with
`DropdownComponentOption`.

**1. `placement` is ignored now.** The menu falls back to `align="start"`, so a
right-aligned menu moves left without an error:

```vue
<!-- Before -->
<Dropdown :options="options" placement="right" />
<Dropdown :options="options" placement="center" />

<!-- After -->
<Dropdown :options="options" align="end" />
<Dropdown :options="options" align="center" />
```

**2. A `{ group, items }` entry disappears.** The group resolves to zero options
and is dropped. The rest of the menu stays intact:

```ts
// Before
const actions = [
  { group: 'Edit', items: [{ label: 'Rename', onClick: rename }] },
]

// After
const actions = [
  { group: 'Edit', options: [{ label: 'Rename', onClick: rename }] },
]
```

**3. A `component:` row renders as a plain action row** using its `label`. For
most of these rows, the label is empty:

```ts
// Before
{ component: h(Button, { theme: 'red' }, () => 'Delete') }

// After
{
  label: 'Delete',
  slots: {
    item: () => h(Button, { theme: 'red' }, () => 'Delete'),
  },
}
```

### Custom rows

Three ways to hand the whole row to your own code are removed:

- `Select` and `MultiSelect` lost the `#option` slot.
- `Combobox` and `MultiSelect` lost `render` and `slotName`.

All three are replaced by region slots on a row that the component renders.

```vue
<!-- Before: one slot for the whole label area -->
<Select v-model="chartType" :options="options">
  <template #option="{ option }">
    <div class="flex items-center gap-2">
      <component :is="option.icon" class="size-4" />
      <span>{{ option.label }}</span>
    </div>
  </template>
</Select>

<!-- After: one slot per region -->
<Select v-model="chartType" :options="options">
  <template #item-prefix="{ item }">
    <component :is="item.icon" class="size-4" />
  </template>
  <template #item-label="{ item }">{{ item.label }}</template>
</Select>
```

An icon is now rendered from `option.icon` automatically. In the common case you
need no slot: set `icon` and drop both templates.

`Combobox`'s `render` moves the same way. The function form becomes
`slots.item`. The object form maps to `slots` key for key. Use these for lists
built in JavaScript, where no template is available:

```ts
const users = fetchedUsers.map((user) => ({
  label: user.name,
  value: user.id,
  slots: {
    prefix: ({ item }) => h(Avatar, { image: item.image, class: 'size-4' }),
  },
}))
```

To replace the whole row, you can still use `slots.item` or the `#item` template
slot.

### Custom options on Combobox

Two keys on the custom option object are renamed: `slotName` → `slot`, and
`searchTerm` → `query`.

```ts
// Before
{
  type: 'custom',
  key: 'create-new',
  slotName: 'create-new',
  onClick: ({ searchTerm }) => createItem(searchTerm),
  condition: ({ searchTerm }) => Boolean(searchTerm),
}

// After
{
  type: 'custom',
  key: 'create-new',
  slot: 'create-new',
  onClick: ({ query }) => createItem(query),
  condition: ({ query }) => Boolean(query),
}
```

The slot that the row renders into is renamed too. `#create-new` becomes
`#item-create-new`. It receives `{ item, query, selected }` instead of
`{ option, searchTerm }`. `onClick` and `condition` keep their names.

### If you used `allowCustomValue`

`Combobox` had a prop that accepted the typed text as the value and drew a
built-in `Create "…"` row. It is removed. It could not do anything a custom row
cannot do, and its row was fixed: you could not change the label, add an icon,
or control when it appears.

Build the row yourself. It commits on click and on Enter, because Enter picks
the highlighted row:

```vue
<script setup>
const value = ref('')
const people = ref(['John Doe', 'Jane Doe'])

const options = computed(() => [
  ...people.value.map((p) => ({ label: p, value: p })),
  {
    type: 'custom',
    key: 'create',
    label: 'Create',
    slot: 'create',
    condition: ({ query }) =>
      Boolean(query.trim()) && !people.value.includes(query.trim()),
    onClick: ({ query }) => {
      value.value = query.trim()
    },
  },
])
</script>

<template>
  <Combobox v-model="value" :options="options">
    <template #item-create="{ query }">Create "{{ query }}"</template>
  </Combobox>
</template>
```

A `modelValue` that matches no option is kept anyway (the trigger shows the raw
string), so nothing else changes.

`dialog.prompt`'s `allowCreate` field option is unaffected. It now builds this
row internally.

### If you filter on the server

`Combobox` and `MultiSelect` filter their options in the browser by default.
When the options already come from a search endpoint, this filters them a second
time and drops fuzzy, ranked or id-based matches. Pass `:filterable="false"` to
turn it off. Apps that forked the component for this reason can go back to the
library component.

For the removed `Autocomplete`, see
[Autocomplete (removed)](#autocomplete-removed).

## Autocomplete (removed)

`Autocomplete` is removed in v1. It handled single and multiple selection in one
component, through the `multiple` boolean. v1 splits them:
[`Combobox`](./components/combobox) for single selection,
[`MultiSelect`](./components/multiselect) for multiple.

**Loud break** at the import, so your build lists every call site. **Silent
break** for three things inside those call sites; each has a before/after below:

- the **v-model payload**
- the **group key**
- the **`open` slot prop**, which was a function and is now a boolean

Search your codebase:

```bash
grep -rln '<Autocomplete\b' src --include='*.vue'   # find usages
grep -rln ':multiple' src --include='*.vue'         # these become MultiSelect
grep -rn 'items:' src --include='*.vue'             # grouped options — see below
```

| Before (`Autocomplete`)                                                   | After                                                                                                                         |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `:multiple="false"` (default)                                             | use `Combobox`                                                                                                                |
| `:multiple="true"`                                                        | use `MultiSelect`                                                                                                             |
| `v-model` (option or value)                                               | `v-model` (value / value array)                                                                                               |
| `@change`                                                                 | `@update:modelValue` (`@update:selectedOption` for the option)                                                                |
| grouped `{ group, items }`                                                | grouped `{ group, options }`                                                                                                  |
| `placement` (string)                                                      | `side` + `align`                                                                                                              |
| `:showFooter`                                                             | `#footer` slot (MultiSelect has built-in)                                                                                     |
| `:bodyClasses`                                                            | `data-slot` CSS                                                                                                               |
| `:maxOptions`                                                             | no equivalent                                                                                                                 |
| `#target="{ togglePopover }"`                                             | `#trigger`, with no click handler (`open` is now a boolean)                                                                   |
| `#prefix` / `#suffix`                                                     | same (`#suffix` now replaces chevron)                                                                                         |
| `#item-prefix` / `#item-suffix` slot props `{ active, selected, option }` | `{ item, query, selected }` — `option` is renamed and `active` is gone, so a carried-over `option.label` throws during render |

### The v-model payload inverts

**Silent break.** `Autocomplete` took and emitted the **whole option object**.
Both replacements use the **value only** as the model: `Combobox` is
`string | number | null`, and `MultiSelect` is `(string | number)[]`. Code that
reads `country.value` from the model gets `undefined` instead of a type error,
because the model was loosely typed.

```vue
<!-- Before -->
<Autocomplete v-model="country" :options="countries" @change="onChange" />
<!-- country === { label: 'India', value: 'in' } -->

<!-- After -->
<Combobox
  v-model="country"
  :options="countries"
  @update:model-value="onChange"
/>
<!-- country === 'in' -->
```

Do you still need the whole option, for its `description`, an id field, or
anything else beyond the value? Listen to `@update:selectedOption`, which
carries it:

```vue
<Combobox
  v-model="country"
  :options="countries"
  @update:selected-option="(option) => (label = option?.label ?? '')"
/>
```

### Grouped options: `items` → `options`

The key that holds a group's children is now `options`, the same as the
top-level prop.

- `Combobox` and `MultiSelect` throw and name the group if they find the old
  key. So you find this the first time the picker opens, but only then, not at
  build time.
- `Dropdown` and `ContextMenu` share the rename, but fail differently: the group
  is dropped without an error (see
  [Dropdown and ContextMenu](#dropdown-and-contextmenu)).

```vue
<!-- Before -->
<Autocomplete :options="[{ group: 'Asia', items: [india, japan] }]" />

<!-- After -->
<Combobox :options="[{ group: 'Asia', options: [india, japan] }]" />
```

### `#target` → `#trigger`, and drop the click handler

The slot is renamed, and the wiring inside it changes. `Autocomplete` gave
`#target` a `togglePopover` function that you had to call yourself. `Combobox`
and `MultiSelect` attach the open toggle to the `#trigger` element for you.

So the handler is not just unnecessary. A `togglePopover()` kept through the
rename throws `togglePopover is not a function` on every click. The popover
still opens, because the component's own handler already ran. So it looks like
it works, with extra errors, until someone looks at the console.

```vue
<!-- Before -->
<Autocomplete :options="fields">
  <template #target="{ togglePopover }">
    <Button label="Add filter" @click="togglePopover()" />
  </template>
</Autocomplete>

<!-- After -->
<Combobox :options="fields">
  <template #trigger>
    <Button label="Add filter" />
  </template>
</Combobox>
```

**Silent break: `open` changed from a function to a boolean.** On `#target` it
was the function that opened the popover. So anything that read it as a value
(`v-if="open"`, `:class="{ 'rotate-180': open }"`) was reading a function
object, which is **always truthy**. On `#trigger` it is the real open state, so
those expressions now do what they always appeared to do.

- `Combobox`'s `#trigger` receives
  `{ open, disabled, query, selectedOption, displayValue, clear, setOpen, close }`.
- `MultiSelect`'s `#trigger` receives
  `{ open, disabled, query, selectedOptions, clear, setOpen, close }`: plural,
  and with no `displayValue`.

Use `setOpen` for a trigger that has to open the popover from somewhere other
than its own click.

### The trigger shape changed — pass `trigger="button"` to keep v0's

`Autocomplete` rendered a button that showed the selection, with the search box
inside the popover. `Combobox` defaults to `trigger="input"`: the trigger _is_
the search field. Pass `trigger="button"` to keep the old shape.

## FormControl `type="autocomplete"` (removed)

| Before                        | After                     |
| ----------------------------- | ------------------------- |
| `type="autocomplete"`         | `type="combobox"`         |
| v-model holds the option      | v-model holds the value   |

**Silent break.** `FormControl` picks a component based on `type`. With the
`autocomplete` case removed, the type falls through to `TextInput` and is still
passed on as an HTML input type. The result is `<input type="autocomplete">`,
which every browser renders as a plain text box: the picker becomes a text
field.

- No runtime error, and no build error in plain JavaScript.
- TypeScript callers get a build error, because `'autocomplete'` is no longer in
  the `type` union.
- A development-only `console.error` names it.

```vue
<!-- Before -->
<FormControl type="autocomplete" :options="countries" v-model="country" />
<!-- country === { label: 'India', value: 'in' } -->

<!-- After -->
<FormControl type="combobox" :options="countries" v-model="country" />
<!-- country === 'in' -->
```

The v-model payload inverts here too, for the same reason as in
[Autocomplete](#the-v-model-payload-inverts). Or use the standalone
[`Combobox`](./components/combobox), which exposes the full set of props and
slots without the wrapper.

## Inputs

Covers `TextInput`, `Textarea`, `Password`, `Checkbox`, `Switch`, `Rating` and
`Slider`. They all share the same labeling props (`label` / `description` /
`error` / `required`).

| Before                             | After                                                              |
| ---------------------------------- | ------------------------------------------------------------------ |
| `<Input>` (removed)                | `TextInput` / `Textarea` / `Select` / `Checkbox`, or `FormControl` |
| `Rating` `:rating_from`            | `:max`                                                             |
| `Rating` `:readonly`               | `:disabled`                                                        |
| `Switch` `@change`                 | `@update:modelValue`                                               |
| `Switch.labelClasses`              | `data-*` styling hooks                                             |
| `Checkbox.padding`                 | `padded`                                                           |
| `Password` `:value` prop (removed) | `v-model`                                                          |
| `TextInput` / `Textarea` ref `.el` | ref `.inputElement`                                                |
| `size="xl"` on any input           | `size="lg"`                                                        |
| `FormLabel` `size` (removed)       | fixed 13px label                                                   |

### Removed props and events

**Silent break.** `Rating` `:rating_from`, `Rating` `:readonly`, `Switch`
`@change`, `Switch.labelClasses` and `Checkbox.padding` are **removed**, not
aliased. The old names are ignored without an error:

- a `Rating` with `:rating_from="10"` renders 5 stars
- a `:readonly` `Rating` becomes interactive
- a `Switch` `@change` handler never fires
- `labelClasses` and `Checkbox.padding` stop styling anything

Nothing breaks at build time, so grep for these names when you upgrade.

### `<Input>` is removed

**Loud break** when you import it: the import fails, so importing call sites
break at build time.

**Silent break** when you register components globally: there is no import
error. The tag fails to resolve and renders nothing. Only development builds
show a "Failed to resolve component" warning. Grep for the tag, not the import:
`grep -rn '<Input\b' src`.

### `Slider` has no default `aria-label`

`Slider` no longer hardcodes `aria-label="Volume"`. Pass `label` explicitly so
screen readers announce the control correctly.

### `CircularProgressBar` is removed

**Loud break:** `CircularProgressBar` is deleted, so the import fails. Use
`Progress` for a linear bar, or draw the arc yourself. v1 has no circular
variant.

### Input sizes

The input size scale is now `xs | sm | md | lg`. `xs` is new, and `xl` is
removed.

| Size | Single-line height |
| ---- | ------------------ |
| `xs` | 24px               |
| `sm` | 28px (default)     |
| `md` | 32px               |
| `lg` | 40px               |

`sm`, `md` and `lg` render exactly as before. `xl` was never a bigger box: it
drew `lg`'s 40px height with an 18px font. It was a font override with a size
name.

```vue
<!-- Before -->
<TextInput size="xl" />

<!-- After: pick the height you wanted -->
<TextInput size="lg" />
```

This applies to every component on the shared input scale: `TextInput`,
`Textarea`, `Password`, `Rating`, `Select`, `Combobox`, `MultiSelect`,
`ItemListRow`, `FormControl`, the `DatePicker` family, `TimePicker`, `Duration`,
and the experimental `CodeEditor` and `MultiEmailInput`.

`Progress`, `Slider`, `Switch`, `Checkbox`, `Avatar`, `Badge`, `Button` and
`Dialog` keep their own scales and are not affected. `<Dialog size="xl">` and
`<Avatar size="xl">` still work.

**Silent break in JavaScript, warned in development.** A leftover `size="xl"` no
longer loses the size styles. Every input size lookup now falls back to that
component's default (`sm` for the input family) and warns once in development:

```
[frappe-ui] TextInput.size="xl" is not a supported value — falling back to
"sm". Supported: xs, sm, md, lg.
```

TypeScript reports the value at the call site. JavaScript call sites and bound
values (`:size="config.size"`) show up only through that warning, so check the
development console after upgrading.

`FormControl.size` changes the other way: it accepted only `sm | md`, and now
takes the whole scale. `type="checkbox"` renders on the smaller toggle scale, so
`size="lg"` there is clamped to `md` instead of falling off the end.

### Form typography — 13px labels, descriptions and Textarea text

**Rendering change. Nothing to change in your source.** Labels, descriptions
and `Textarea` text are a fixed 13px. Labels and descriptions are `ink-gray-6`.

| Member                      | Before                | After              |
| --------------------------- | --------------------- | ------------------ |
| Label (`InputLabel`)        | 14px, `ink-gray-5`    | 13px, `ink-gray-6` |
| Label (`FormLabel`)         | 12px `sm` / 14px `md` | 13px, `ink-gray-6` |
| Description                 | 13px, `ink-gray-5`    | 13px, `ink-gray-6` |
| Description (disabled)      | `ink-gray-3`          | `ink-gray-4`       |
| `Textarea` text, every size | 14 / 16 / 18 / 20px   | 13px               |

The two label components used to render different sizes. `InputLabel`, which
`FormControl` renders through, was a fixed 14px. `FormLabel` was 12px or 14px
depending on `size`. Both are 13px now, so a `FormLabel` and a `TextInput`
label match.

`Textarea` `size` still exists and still has an effect: it changes padding,
corner radius and the minimum height. It no longer changes the text size. The
single-line input heights do not set a `Textarea` height, so a `lg` `Textarea`
is a larger box with the same 13px text.

The `Textarea` _value_ colour is unchanged.

### `FormLabel` — `size` prop removed

With the label size fixed at 13px, `FormLabel`'s `size` prop had no effect, so
it is removed instead of kept as a no-op.

```vue
<!-- Before -->
<FormLabel label="Email" size="md" />

<!-- After -->
<FormLabel label="Email" />
```

**Silent break in JavaScript, loud in TypeScript.** `size` now falls through as
a plain HTML attribute, so nothing throws; the label just renders at 13px.
TypeScript call sites get a build error.

- If you passed `size="md"`, you got 14px. You now get 13px.
- If you relied on the `sm` default, you got 12px. You now get 13px.

Either way the label ends up at the standard size. Usually you should delete the
attribute and accept the new size. To keep a different size, style the label
yourself.

### Password — `value` prop removed

`value` was a deprecated second way to set the password. It set `v-model` once
on mount. It is removed.

**Silent break.** `:value` now falls through as a plain HTML attribute on the
native `<input>` instead of setting the model. The field still renders, so
nothing throws or warns.

```vue
<!-- Before -->
<Password v-model="password" :value="initialValue" />

<!-- After -->
<Password v-model="password" />
<script setup>
password.value = initialValue
</script>
```

### `TextInput`, `Textarea`, `Password` — ref surface

`TextInput` and `Textarea` returned `{ el }` on the template ref: a raw ref to
the native element. They now return `{ focus, inputElement }`:

- Call `focus(options?)` to move keyboard focus.
- Read `inputElement` for the native element itself. It is a computed, so it
  cannot be reassigned.

`Password` gains the same pair. It exposed nothing before.

**Fails at runtime, not at build time.** `ref.value.el` is `undefined`, so the
next access (`ref.value.el.focus()`) throws at runtime, far from the upgrade. A
typed ref catches it as a build error instead.

```vue
<!-- Before -->
<TextInput ref="input" />
<script setup>
function focusIt() {
  input.value.el.focus({ preventScroll: true })
}
</script>

<!-- After -->
<TextInput ref="input" />
<script setup>
function focusIt() {
  input.value.focus({ preventScroll: true })
}
</script>
```

`Duration` already exposed `focus()`. It now takes the same `options?`
parameter as the other inputs.

### `focus()` is on every input {#inputs-focus}

**Additive.** `Checkbox`, `Switch`, `Slider`, `RadioGroup`, `Rating` and
`FormControl` expose `focus()` too. They exposed nothing before. The shape is
declared once as the exported `InputExposed` type, so a generic form can type a
ref to a control it did not choose:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { InputExposed } from 'frappe-ui'

const fields = ref<InputExposed[]>([])
function focusField(index: number) {
  fields.value[index]?.focus()
}
</script>
```

`FormControl` forwards `focus()` to the control that its `type` resolved to.

Focus lands on the element that `Tab` reaches, not on the container:

- `Slider` focuses the thumb.
- `RadioGroup` focuses the selected option, or the first enabled one when
  nothing is selected.
- `Rating` focuses the selected star, or the first star when the value is empty.
  In half-star mode the whole control is one slider.

### Attributes go to the control, `class` and `style` to the wrapper {#inputs-attrs}

An input has a layout wrapper and an interactive element. `class` and `style` go
to the wrapper. `name`, `aria-*`, `data-*` and listeners go **once** to the
interactive element.

**Silent break** in four components:

| Component    | Before                                                     |
| ------------ | ---------------------------------------------------------- |
| `Checkbox`   | every attribute applied twice — wrapper **and** `<input>`  |
| `Switch`     | everything went to the wrapper, nothing to the control     |
| `RadioGroup` | everything went to the wrapper, nothing to the radio group |
| `Rating`     | everything went to the wrapper, nothing to the control     |

Check two things.

1. A listener now fires once, from the control:

   ```vue
   <!-- fired twice before; fires once now, and not from the padded row -->
   <Checkbox padded label="Agree" @click="onClick" />
   ```

2. A CSS rule written against the wrapper no longer matches a `data-*` attribute
   you passed in. Move the selector to the control, or keep using `class`.

`TextInput`, `Textarea`, `Password`, `Select`, `Combobox`, `MultiSelect`,
`Slider`, `FormControl`, `Duration` and the date pickers already worked this way
and are unchanged.

### `Rating` defaults to `size="sm"` {#rating-size}

Every other input defaults to `sm`. A `<Rating>` with no `size` now renders
smaller. Pass `size="md"` to keep the old size.

```vue
<!-- Before: rendered md -->
<Rating v-model="score" />

<!-- After: same pixels -->
<Rating v-model="score" size="md" />
```

**Silent break. No codemod.** A codemod cannot find a prop that is not there.
Adding `size="md"` to every `<Rating>` in an app to keep the old default would
be worse than the change. Three v1 app sites were already passing a smaller size
by hand.

### `Duration` forwards `#label` and `#description`

These slots used to be dropped. If you passed either slot to `Duration`, it now
renders. Check that it does not repeat a `label` or `description` prop that you
also set.

### `FormControl` no longer forwards `variant` to a checkbox

A checkbox draws no container surface, so it has no `variant`. The forwarded
value used to land on the `<input>` as a stray `variant="subtle"` attribute.

The `type` routes are unchanged: `date` renders `DatePicker`, `time` renders
`TimePicker`, and a native date field is `<TextInput type="date" />`.

### `data-slot="label"` on `FormLabel`

**Additive.** `FormLabel` carries the same hook that `InputLabel` already
rendered, so one selector reaches every label in the library.

### Input types the root publishes {#input-types}

**Additive** exports:

- `InputExposed` — the template-ref shape every input implements.
- `PickerExposed` — `InputExposed` plus `open` and `close`, for the four
  pickers.
- `SelectionOption`, `SelectionGroup` — the shared option shapes.
- `Dayjs` — the date pickers pass one to `formatter`, `disabledDate` and the
  setter slot props, so the type has to be importable.
- `DateRangeValue` — both sides of `DateRangePicker`'s `v-model`.
- `InputLabelingProps` — for a wrapper that forwards `label` / `description` /
  `error` / `required`.

**Loud break, two removals.** `DatePicker`'s barrel lists its public types
instead of re-exporting the whole module. `DatePickerViewMode` and
`DatePickerDateObj` were calendar internals that the wildcard export published.
They leave the root, and the import fails. Nothing replaces them; they described
the calendar's internal state.

**Emit types.** `SelectEmits`, `ComboboxEmits` and `MultiSelectEmits` no longer
redeclare the model events that `defineModel` already declares.
`RadioGroupEmits` says `RadioValue | undefined`, which is the value an unbound
group starts with. A handler typed against the old shapes still compiles. Type a
model handler from the model instead:
`(value: SelectOptionValue | null | undefined) => void`. The extra `undefined`
is there because the model prop is optional; neither `Select` nor `Combobox`
ever emits it.

## FileUploader

`FileUploader` was reworked in `1.0.0`: it is written in TypeScript, takes flat
props, and gets a security fix to the upload default it shares with
`useFileUpload` / `FileUploadHandler`.

| Before                                          | After                                                 |
| ----------------------------------------------- | ----------------------------------------------------- |
| upload with no `private` / `is_private`: public | private                                               |
| rejects a plain `Error`                         | rejects an `UploadError`                              |
| aborted upload rejects a `DOMException`         | rejects an `UploadError` with `kind: 'abort'`         |
| `is_private` upload option                      | `private` (boolean)                                   |
| `uploadArgs` object prop                        | flat props                                            |
| `inputRef()` on the template ref                | `openFileSelector` slot prop                          |
| default slot `error`: `unknown`                 | `string \| null`                                      |
| `fileToBase64` exported (size-limit helpers: betas only) | not exported                                 |

### Uploads default to private

**Silent break.** `useFileUpload()` and `FileUploadHandler` now treat an upload
with no stated `private` / `is_private` as **private**, not public.

Coming from v0, `FileUploader` changes with them. It had no `private` prop at
all and used the public default. It has uploaded private by default since
`v1.0.0-beta.21`, so only upgrades from before beta.21 see the component change.

```ts
// Same call, before and after — the result changes:
await useFileUpload().upload(file, {})
await new FileUploadHandler().upload(file, {})
// Before: is_private=0 (public).  After: is_private=1 (private).

// State the intent explicitly instead of relying on the default:
await useFileUpload().upload(file, { private: false }) // public
await useFileUpload().upload(file, { private: true }) // private
```

If your app serves an uploaded file to requests with no session (an avatar in an
email digest, an image on a public page), check every call that omits
`private` / `is_private` before upgrading. A file that becomes private returns
`403` to a request with no session, instead of the image.

### Uploads reject an `UploadError` {#uploads-reject-an-uploaderror}

`upload`, `useFileUpload` and `FileUploadHandler` reject with an exported
`UploadError` instead of a plain `Error`. `state.error` has that type too.

Check `error.kind` (`'file-size' | 'network' | 'server' | 'abort'`) instead of
matching the message text. A server failure also carries `status`, `messages`
(the parsed server messages) and the raw `response`.

```js
import { UploadError, upload } from 'frappe-ui'

try {
  await upload(file, { doctype: 'ToDo', docname: 'TODO-0001' })
} catch (error) {
  if (error instanceof UploadError && error.kind === 'file-size') {
    showError('That file is too large.')
  } else {
    throw error
  }
}
```

Existing `catch` blocks keep working: `UploadError` is an `Error` and its
`message` is unchanged.

`FileUploadHandler` no longer leaves the promise pending when the request
aborts. It rejects, like the other two.

#### An aborted upload rejects an `UploadError`, not a `DOMException` {#upload-abort-error}

**Silent break.** `upload()` and `useFileUpload()` take an `options.signal`.

- Before: when that signal fired, they rejected with
  `new DOMException('Upload cancelled', 'AbortError')`.
- After: they reject an `UploadError` with `kind: 'abort'`.

The message text is the same. But `error.name` is `'UploadError'` instead of
`'AbortError'`, and `error instanceof DOMException` is false. A `catch` block
that uses either of those to tell a cancel from a failure stops matching, so a
cancelled upload is shown to the user as an error.

```js
// Before
try {
  await upload(file, { signal: controller.signal })
} catch (error) {
  if (error.name === 'AbortError') return // user cancelled
  showError(error.message)
}

// After
import { UploadError } from 'frappe-ui'

try {
  await upload(file, { signal: controller.signal })
} catch (error) {
  if (error instanceof UploadError && error.kind === 'abort') return
  showError(error.message)
}
```

### The `is_private` upload option is removed

`useFileUpload` and `FileUploadHandler` took both `private` and `is_private` for
the same setting, and `private` won. Only `private` is left, and it is a
boolean.

**Silent break in JavaScript, loud in TypeScript.** In JavaScript, an
`is_private` you still pass is ignored and the upload falls back to the private
default. A public upload written as `{ is_private: 0 }` becomes private.

```js
// Before
await upload(file, { is_private: 0 })

// After
await upload(file, { private: false })
```

The `is_private` field on the uploaded file record that the server returns is
unchanged.

### `uploadArgs` → flat props

The single `uploadArgs` object prop is removed. Its commonly used fields are now
flat props on the component:

| Before (`uploadArgs`)    | After            |
| ------------------------ | ---------------- |
| `private` / `is_private` | `private`        |
| `folder`                 | `folder`         |
| `doctype`                | `doctype`        |
| `docname`                | `docname`        |
| `fieldname`              | `fieldname`      |
| `upload_endpoint`        | `uploadEndpoint` |
| `optimize`               | `optimize`       |

```vue
<!-- Before -->
<FileUploader :uploadArgs="{ private: false, folder: 'Attachments' }" />

<!-- After -->
<FileUploader :private="false" folder="Attachments" />
```

**Silent break.** `uploadArgs` is no longer a known prop, so Vue passes it
through as an inert HTML attribute on the root element. Nothing throws; the
options it carried just stop applying. Together with the new private default
above, a `uploadArgs="{ private: false }"` override that used to make an upload
public now uploads it as private. `grep` every `<FileUploader>` for
`uploadArgs=` / `:upload-args=` and move each field to its flat prop.

`file_url`, `method`, `type`, `params`, `max_width` / `max_height`, and upload
cancellation (`signal`) have no flat prop, because no measured use of them on
the component was found. Use
[`useFileUpload()`](./other/utilities#usefileupload-fileuploadhandler) directly
for those.

### Template ref — `inputRef` removed

`FileUploader` returns nothing through a template ref, per
[ADR-0012](https://github.com/frappe/frappe-ui/blob/main/spec/adr/0012-template-ref-surface.md).
`inputRef()` (a function, despite the name) is removed with nothing in its
place. The `openFileSelector` slot prop already does what it opened.

```vue
<!-- Before -->
<FileUploader ref="uploader" />
<script setup>
uploader.value.inputRef().click()
</script>

<!-- After -->
<FileUploader v-slot="{ openFileSelector }">
  <Button @click="openFileSelector">Upload</Button>
</FileUploader>
```

### Default slot's `error` prop — always a string

The default slot's `error` prop is `string | null`, no longer `unknown`. Upload
failures were always turned into a message string. Validation failures (a
`validateFile` prop that returns an `Error`) were not, so `error` could also be
an `Error` object. Both paths now give a message string.

```vue
<!-- Before: had to guard against error being a string or an Error -->
<template #default="{ error }">
  {{ typeof error === 'string' ? error : error?.message }}
</template>

<!-- After: error is always a string -->
<template #default="{ error }">
  {{ error }}
</template>
```

**Silent break:** a slot that only ever used `error.message` (expecting the
`Error` shape) now renders `undefined` instead of the validation message.

**Behavior change:** `failure` also fires for validation now. A `validateFile`
that returns a message or throws emits `failure` with that value. v0 only wrote
it to the slot's `error`. An existing `@failure` handler now also receives
validation rejections, alongside upload errors.

### `fileToBase64` and the size-limit helpers — no longer exported

**Loud break:** `fileToBase64` is no longer exported from `frappe-ui`, so the
import fails at build time. No external call sites were found during the v1
sweep. To get a file's base64 representation yourself, use a few lines of
`FileReader.readAsDataURL`.

The size-limit helpers (`formatBytes`, `getMaxFileSize`,
`fileSizeLimitMessage`) were exported only during the `1.0.0` betas, and are
internal now.

## Sidebar

`Sidebar` is a bare frame. Compose `SidebarHeader` / `SidebarSection` /
`SidebarLabel` / `SidebarItem` in its default slot, instead of passing
config-object props. See the [Sidebar](./components/sidebar) component page for
the full API.

| Before                                     | After                                                                  |
| ------------------------------------------ | ---------------------------------------------------------------------- |
| `:header="{ title, subtitle, menuItems }"` | `<SidebarHeader :title :subtitle :menu-items />` as a child            |
| `:sections="[{ label, items }]"`           | `<SidebarLabel>` + `<SidebarItem>` (or `<SidebarSection>`) as children |
| `<template #header-logo>`                  | `<SidebarHeader>`'s `#prefix` slot                                     |
| `<template #footer-items>`                 | plain markup in the default slot                                       |
| `<SidebarSection :items="rows">`           | `<SidebarSection>` with `<SidebarItem>` children                       |
| `<template #sidebar-item="{ item }">`      | write the `<SidebarItem>` directly, no slot needed                     |
| `item.condition`                           | `v-if` on the composed `<SidebarItem>`                                 |
| `SidebarItem.isActive`                     | `SidebarItem.active`                                                   |
| `SidebarItem.to`                           | `SidebarItem.route`                                                    |
| `SidebarHeader`'s `#logo` slot             | `#prefix` slot                                                         |
| `Sidebar.disableCollapse`                  | `Sidebar.collapsible` with the boolean inverted                        |
| `SidebarRailItem variant="tile"`           | `variant="subtle"`                                                     |
| `SidebarItem icon="AB"` (plain text)       | `<template #prefix>AB</template>`                                      |
| `target` / `data-*` on a `SidebarItem`     | now on the inner `<a>` / `<button>`                                    |

**Silent break** for every removal here. A removed prop (`header`, `sections`,
`items`, `isActive`) becomes a fall-through attribute on the component's root
element. Content passed to the removed `#sidebar-item` slot is discarded. There
is no build error, no type error and no warning; the sidebar renders as an empty
frame. After upgrading, grep for `:header=`, `:sections=`, `:items=`,
`#sidebar-item` and `isActive` on these five components.

**Codemod:** `destinations-v1` renames `SidebarItem.to` to `route`; see
[Navigation destinations](#navigation-destinations). `navigation-v1` renames
`SidebarRailItem variant="tile"` to `variant="subtle"`.

```vue
<!-- Before -->
<Sidebar
  :header="{ title: 'Frappe CRM', subtitle: 'crm.frappe.io', menuItems }"
  :sections="[
    {
      label: '',
      items: [{ label: 'Leads', to: '/leads', icon: 'lucide-user-plus' }],
    },
    { label: 'Views', collapsible: true, items: viewItems },
  ]"
/>

<!-- After -->
<Sidebar>
  <SidebarHeader title="Frappe CRM" subtitle="crm.frappe.io" :menu-items="menuItems" />
  <div class="flex-1 overflow-y-auto px-2">
    <SidebarItem label="Leads" route="/leads" icon="lucide-user-plus" />
    <SidebarSection label="Views" collapsible>
      <SidebarItem v-for="item in viewItems" :key="item.label" v-bind="item" />
    </SidebarSection>
  </div>
</Sidebar>
```

`Sidebar` no longer wraps the middle list in a scroll container or adds any
padding. Your app does that now. See the Collapse section of the component page
for how the parts fit together.

## SettingsDialog

The open state moves from the unnamed `v-model` to `v-model:open`, the name
every other overlay in the library uses.

| Before                          | After                         |
| ------------------------------- | ----------------------------- |
| `v-model="showSettings"`        | `v-model:open="showSettings"` |
| `@update:modelValue="onToggle"` | `@update:open="onToggle"`     |
| `shortcut`                      | `keyboardShortcut`            |

**Silent break:** Vue accepts the unknown `modelValue` prop with no error, so
the dialog never opens.

```vue
<!-- Before -->
<SettingsDialog v-model="showSettings" v-model:tab="tab">…</SettingsDialog>

<!-- After -->
<SettingsDialog v-model:open="showSettings" v-model:tab="tab">…</SettingsDialog>
```

`v-model:tab` is unchanged. Unlike `Dialog`, `SettingsDialog` does not keep the
old unnamed `v-model` binding. `open` is the only way to control visibility.

### `shortcut` → `keyboardShortcut`

Replace `shortcut` with `keyboardShortcut`. It defaults to `"Mod+Shift+,"`, and
`false` turns the registration off.

**Codemod:** `navigation-v1` removes bare and statically true `shortcut` props,
because the new default keeps their behavior. It converts static `false` values.
It reports dynamic boolean expressions, so you can decide by hand between a
combo and `false`.

## Tabs

The single `Tabs` component is replaced by a family of components: `Tabs`,
`TabList`, `TabTrigger`, `TabPanel`. The model is the trigger `value`, never an
index. See the [Tabs](./components/tabs) component page for the full API.

**Codemod:** run `npx navigation-v1 .` for the current active slot-prop and
state names on `TabButtons` and `Tabs`. The larger rewrite from v0 `Tabs` to the
composed family is still a hand edit. `tokens-v2` rewrites Tailwind token names
only. It never touches a component, prop or slot name, so grep for the remaining
old names instead of waiting for the build to tell you.

| Before                                                        | After                                                                                                                                                                                                                       |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model="tabIndex"` (index)                                  | `v-model="tab"` (trigger `value`)                                                                                                                                                                                           |
| `:tabs="[{ label, icon }]"` (required)                        | `<TabTrigger>` children; the `tabs` shorthand stays for generated sets                                                                                                                                                      |
| `label` implied the value                                     | `value` is required on every trigger                                                                                                                                                                                        |
| `as="div"`                                                    | removed — compose and style the container directly                                                                                                                                                                          |
| `<template #tab-item="{ tab, selected }">`                    | `TabTrigger` props (`icon`, `iconLeft`, `route`) and slots (`#prefix`, default, `#suffix`), or `#tab-label` in shorthand mode                                                                                               |
| `#prefix` / `#label` / `#suffix` / `#panel` alongside `:tabs` | `#tab-prefix` / `#tab-label` / `#tab-suffix` / `#tab-panel` — every shorthand slot carries the `tab-` prefix; composed `TabTrigger` keeps plain `#prefix` / `#suffix`. An unknown slot name renders nothing, nothing throws |
| extra fields on a `tabs` item (`{ value, content }`)          | `data: { content }`, read as `tab.data.content` — extra keys are now a type error                                                                                                                                           |
| `<template #tab-panel="{ tab }">`                             | `<TabPanel :value>` children; the shorthand slot is `#tab-panel`, back on its v0 name (it was briefly `#panel` in the betas)                                                                                                |
| `Tab.route` string + hand-rolled route sync                   | `route: RouteDestination` on the trigger; selection derives from the route                                                                                                                                                  |
| stale-index clamps for conditional tabs                       | built in: a stale model falls back to the first visible trigger and emits                                                                                                                                                   |
| `[&_[role='tablist']]:px-4` class blobs                       | `<TabList class="px-4">` — the app owns the element                                                                                                                                                                         |
| built-in flex and overflow defaults                           | none — see [Scrolling](#scrolling) below; the tabs stop scrolling and overflow instead                                                                                                                                      |
| `iconRight` on a trigger or a `tabs` item                     | `<template #suffix>` on a composed `TabTrigger`, `<template #tab-suffix>` in shorthand mode — the icon silently stops rendering, nothing throws                                                                              |
| slot prop `selected` / `checked`                              | `active`                                                                                                                                                                                                                    |
| `data-state="checked\|unchecked"`                             | `data-state="active\|inactive"`                                                                                                                                                                                             |

**Silent break** for the slot rows: an unknown slot name renders nothing and
nothing throws. `iconRight` is silent too: the icon stops rendering and nothing
throws.

```vue
<!-- Before -->
<Tabs v-model="tabIndex" :tabs="[{ label: 'Emails' }, { label: 'Calls' }]">
  <template #tab-item="{ tab, selected }">
    <span :class="selected ? 'text-ink-gray-9' : ''">{{ tab.label }}</span>
  </template>
  <template #tab-panel="{ tab }">
    <div>{{ tab.label }} content</div>
  </template>
</Tabs>

<!-- After -->
<Tabs v-model="tab">
  <TabList>
    <TabTrigger value="emails" label="Emails" />
    <TabTrigger value="calls" label="Calls" />
  </TabList>
  <TabPanel value="emails">Emails content</TabPanel>
  <TabPanel value="calls">Calls content</TabPanel>
</Tabs>
```

`Tabs` exposes nothing on the template ref. `TabList` now has all the variants
that `TabButtons` has: `underline`, `subtle`, `ghost`, `browser-tab`.

### Scrolling

v0 set layout classes by default:

- the root was `flex flex-1 overflow-hidden flex-col`
- the tablist was `overflow-x-auto`
- every panel was `flex flex-col overflow-auto`

v1 sets none of them, because they broke layouts as often as they helped. A
`Tabs` that always grows to fill its parent is wrong everywhere the tabs are not
the whole screen.

**Silent break.** Nothing throws. Inside a container with a fixed height, the
panel stops scrolling and overflows instead. Check any call site that relied on
these defaults.

In composed mode your app renders the elements, so put the classes back where
you want them:

```vue
<Tabs v-model="tab" class="flex min-h-0 flex-1 flex-col">
  <TabList class="overflow-x-auto">…</TabList>
  <TabPanel value="emails" class="min-h-0 flex-1 overflow-auto">…</TabPanel>
</Tabs>
```

In shorthand mode you cannot add classes to the generated elements, so target
them through their `data-slot` hooks:

```vue
<Tabs
  v-model="tab"
  :tabs="items"
  class="min-h-0 flex-1 [&_[data-slot=tab-list]]:overflow-x-auto [&_[data-slot=tab-panel]]:min-h-0 [&_[data-slot=tab-panel]]:flex-1 [&_[data-slot=tab-panel]]:overflow-auto"
/>
```

## TabButtons

`TabButtons` keeps its radiogroup role: it is a value input, not a panel
switcher. Its prop and type names now match the Tabs family. See the
[TabButtons](./components/tabbuttons) component page for the full API.

| Before                                                | After                                                                                                      |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `type="ghost"`                                        | `variant="ghost"`                                                                                          |
| `direction="right"`                                   | `side="right"` — the same prop name on `TabList`                                                           |
| `TabButtonsType` / `TabButtonsDirection` types        | `TabsVariant` / `TabsSide`, shared with the Tabs family                                                    |
| `:buttons="items"` (deprecated)                       | `:options="items"`                                                                                         |
| `{ label: 'Day' }` (label as value)                   | `value` is required on every option                                                                        |
| `{ active: true }` fallback                           | the `v-model` is the single source of truth                                                                |
| boolean `value` / `modelValue`                        | `string \| number` only                                                                                    |
| wrapper divs / raw CSS for equal-width tabs           | `fluid` prop                                                                                               |
| `iconRight` on an option                              | `<template #suffix>` — silent, nothing throws                                                              |
| `hideLabel: true` on an option                        | `icon` alone — the option is icon-only and `label` becomes its accessible name                             |
| `theme` / `variant` / `size` / `loading` on an option | removed — options no longer forward `Button` props. Use `Button` directly for per-tab theming or a spinner |
| `tooltip` on an option                                | app-owned help UI                                                                                          |
| numeric or missing `label`                            | required string `label`                                                                                    |

**Silent break** for every prop rename here. An unknown prop lands in `$attrs`
and is spread onto the radiogroup root. A `TabButtons` still on `:buttons`
renders an empty track with no build error, type error or warning.

No codemod renames these props. `destinations-v1` does not touch `TabButtons`,
and `navigation-v1` only renames the `checked` slot prop to `active`. Grep for
`:buttons`, `type=`, `direction=`, `hideLabel`, `tooltip`, and non-string labels
in option data.

For the `class` on an option, see
[TabButtons: `class` on an option → `data-value`](#tabbuttons-class).

## TabButtons: `class` on an option → `data-value` {#tabbuttons-class}

| Before                                   | After                                        |
| ---------------------------------------- | -------------------------------------------- |
| `class` on a `TabButton` option object   | CSS on `[data-slot='tab-button'][data-value='…']` |
| `NativeButtonClass` export               | removed                                      |
| `customClass` in `#prefix` / `#suffix`   | removed                                      |

**Silent break** in JavaScript: `class` on a `TabButton` option object no longer
applies. Nothing warns and nothing fails; the tab just loses its styling. Style
the tab from CSS through the new `data-value` hook instead.

```vue
<!-- Before -->
<script setup>
const tabs = [
  { label: 'Open', value: 'open', class: 'text-red-600 font-bold' },
  { label: 'Closed', value: 'closed' },
]
</script>

<template>
  <TabButtons :buttons="tabs" v-model="tab" />
</template>
```

```vue
<!-- After -->
<script setup>
const tabs = [
  { label: 'Open', value: 'open' },
  { label: 'Closed', value: 'closed' },
]
</script>

<template>
  <TabButtons class="my-tabs" :options="tabs" v-model="tab" />
</template>

<style scoped>
.my-tabs :deep([data-slot='tab-button'][data-value='open']) {
  color: var(--ink-red-3);
  font-weight: 600;
}
</style>
```

Two related names are removed with it:

- **Loud break:** `NativeButtonClass` is no longer exported. The import fails.
- `customClass` is removed from the `#prefix` and `#suffix` slot props.
  Destructuring it fails. **Silent break** if you spread it: it gives nothing.

The composed `Tabs` family needs no change. There you write the `<TabTrigger>`
yourself, so a class goes on the element directly.

## App shells and ScrollArea {#shells}

Two exports are removed, `useShellScrolled` needs a `threshold`, and pages now
read the shell they are inside.

| Before                                          | After                                          |
| ----------------------------------------------- | ---------------------------------------------- |
| `import { ScrollBar } from 'frappe-ui'`         | `<ScrollArea orientation="…">`                 |
| `import { useSheetDrag } from 'frappe-ui'`      | removed, no replacement                        |
| `useShellScrolled()` (200px default)            | `useShellScrolled({ threshold })` (required)   |
| page reads the most recently mounted shell      | page reads the nearest enclosing shell         |
| —                                               | `<DesktopShell :scroll="false">` (new prop)    |

### `ScrollBar` is no longer exported {#scrollbar-removed}

**Loud break:** `import { ScrollBar } from 'frappe-ui'` fails at build time.
There is no replacement. `ScrollArea` draws its own scrollbars, and `ScrollBar`
only ever worked inside reka-ui's `ScrollAreaRoot`, which frappe-ui does not
export. Use `ScrollArea` with `orientation`:

```vue
<!-- After -->
<ScrollArea orientation="both">
  <WideTable />
</ScrollArea>
```

`orientation="both"` renders one scrollbar per axis. `ScrollBarProps` is
removed with the component.

### `useSheetDrag` is no longer exported {#usesheetdrag-removed}

**Loud break:** `useSheetDrag`, `UseSheetDrag` and `UseSheetDragOptions` leave
the root. Both imports fail.

`BottomSheet` still uses the composable internally and is unchanged, so an app
that renders `BottomSheet` has nothing to do. There is no standalone
replacement in `1.0.0`: the drag thresholds are fixed values tuned for that one
component. It can come back when a second component needs it.

### `useShellScrolled` needs a `threshold` {#useshellscrolled-threshold}

`threshold` is now required, in pixels.

```js
// Before — 200px by default
const scrolled = useShellScrolled()

// After
const scrolled = useShellScrolled({ threshold: 12 })
```

**Loud in TypeScript, silent in JavaScript.** A call with no argument is a
**type error**, so the build catches it. At runtime it warns in development and
stays `false`.

The old 200px default suited a long document and nothing else. A header border
that appears 200px late looks like a bug, not like a missing argument.

### A page reads the shell it is inside {#shell-ownership}

**No code change.** `useShellScrolled()`, and a `PageHeader` teleporting to its
target, now use the **nearest enclosing shell** first. They fall back to the
`shellScrollContainer` registry only when there is no shell above them.

This changes what you see only while two shells are mounted at once: during a
desktop-to-mobile switch, or in a test that mounts both. Before, both answers
came from the registry, which returns the shell that mounted most recently, so a
header could teleport into the wrong frame.

`shellScrollContainer` itself is unchanged. It is still the way to reach the
scroll element from a router `scrollBehavior` or any other code outside a
component.

### `DesktopShell` takes `:scroll="false"` {#desktopshell-scroll}

**Additive.** New prop, default `true`, nothing to migrate. Pass `false` for a
layout whose panes handle their own overflow, instead of working against the
shell's page scroll:

```vue
<!-- Before -->
<DesktopShell>
  <div class="absolute inset-0 flex h-[calc(100vh-3rem)]">…</div>
</DesktopShell>

<!-- After -->
<DesktopShell :scroll="false">
  <div class="flex min-h-0 flex-1">…</div>
</DesktopShell>
```

With `:scroll="false"` the shell has no scroll element, so
`shellScrollContainer` is `null` and `useShellScrolled()` stays `false`. Read
the pane's own `ScrollArea` instead.

### Shell slot names stay split {#shell-slots}

**No code change.** `DesktopShell` keeps `#rail` and `#sidebar`. `MobileShell`
keeps `#nav`. The names describe regions, not components. The two frames have
different regions, so there is no shared name to move to.

## `--mobile-header-height` is removed {#mobile-header-height}

| Before                                      | After                              |
| ------------------------------------------- | ---------------------------------- |
| `--mobile-header-height` sets the header height | `PageHeaderMobile` is a fixed 52px |
| a header of another height                  | `PageHeaderBase` with your own class |

**Silent break.** `PageHeaderMobile` is 52px tall, fixed. It no longer reads
`--mobile-header-height`, so setting that variable does nothing to the library
header. Delete the declaration, or keep it if your own CSS reads it; the name
belongs to your app now.

There is no replacement hook. For a header of another height, use
`PageHeaderBase` with your own class:

```vue
<PageHeaderBase class="flex h-16 items-center border-b px-3">
  <MyToolbar />
</PageHeaderBase>
```

## PageHeaderMobile family: slot names

`PageHeaderMobile`'s `#left`/`#right` and `PageHeaderMobileTitle`'s `#icon` are
renamed to the shared `#prefix`/`#suffix` slot names (see the slot naming rule,
P6, in
[PHILOSOPHY.md](https://github.com/frappe/frappe-ui/blob/main/PHILOSOPHY.md)).

| Before                          | After     |
| ------------------------------- | --------- |
| `PageHeaderMobile` `#left`      | `#prefix` |
| `PageHeaderMobile` `#right`     | `#suffix` |
| `PageHeaderMobileTitle` `#icon` | `#prefix` |

**Silent break:** Vue drops content passed to an unknown slot name with no error
or warning. The back button, the title icon or the trailing action just stops
rendering.

```vue
<!-- Before -->
<PageHeaderMobile title="Space">
  <template #left><BackButton /></template>
  <template #right><Button icon="lucide-more-horizontal" /></template>
</PageHeaderMobile>
<PageHeaderMobileTitle title="Space">
  <template #icon><SpaceIcon /></template>
</PageHeaderMobileTitle>

<!-- After -->
<PageHeaderMobile title="Space">
  <template #prefix><BackButton /></template>
  <template #suffix><Button icon="lucide-more-horizontal" /></template>
</PageHeaderMobile>
<PageHeaderMobileTitle title="Space">
  <template #prefix><SpaceIcon /></template>
</PageHeaderMobileTitle>
```

Grep for `#left`, `#right` and `#icon` on these two components only. Other
components (for example `ListView`'s footer) have their own, unrelated
`#left`/`#right` slots, which are not affected.

### `FrappeUIProviderProps` is deleted

The type was exported but never connected to the component, so it described
props that `FrappeUIProvider` did not accept. It is removed in `1.0.0` with no
replacement.

**Loud break:** `import type { FrappeUIProviderProps } from 'frappe-ui'` fails
the type-check. `FrappeUIProvider` itself is unchanged and still exported.

## Divider

| Before           | After            |
| ---------------- | ---------------- |
| `action.handler` | `action.onClick` |
| `position`       | `align`          |

**Silent break:** `handler` is dropped as an unknown key, so the action button
still renders and does nothing on click.

**Codemod:** `base-props-v1` renames `position` to `align`; see
[Base component props](#base-component-props).

## `useShortcut` is now `useKeyboardShortcut`

**Loud break** at the import: it fails to resolve, so your build names every
call site. **Silent break** for the config inside it: 14 fields become 10, and
the removed ones are dropped without an error.

**Codemod:** `shortcuts-v1` does this rewrite. See
[The shortcuts codemod](#the-shortcuts-codemod).

| Before                                         | After                                 |
| ---------------------------------------------- | ------------------------------------- |
| `useShortcut(...)`                             | `useKeyboardShortcut(...)`            |
| `key: 's', ctrl: true`                         | `combo: 'Mod+S'`                      |
| `key: 'z', ctrl: true, shift: true`            | `combo: 'Mod+Shift+Z'`                |
| `key: 'ArrowUp'`                               | `combo: 'ArrowUp'`                    |
| `key: '/'`                                     | `combo: 'Slash'`                      |
| `key: '?'`                                     | `combo: 'Shift+Slash'`                |
| `key: ' '`                                     | `combo: 'Space'`                      |
| `condition: () => canEdit.value`               | `enabled: () => canEdit.value`        |
| `triggeredOn: 'hold'`                          | delete it; `onHold` selects hold mode |
| `const { activeShortcuts } = useShortcut(...)` | returns `void`                        |
| `ShortcutConfig`                               | `KeyboardShortcutConfig`              |
| `RegisteredShortcut`, `ActiveShortcut`         | gone; see below                       |

```js
// Before
useShortcut([
  { key: 's', ctrl: true, description: 'Save', group: 'View', handler: onSave },
  {
    key: 'z',
    ctrl: true,
    description: 'Undo',
    condition: notReadOnly,
    handler: undo,
  },
  {
    key: 'y',
    ctrl: true,
    description: 'Redo',
    condition: notReadOnly,
    handler: redo,
  },
])

// After
useKeyboardShortcut([
  { combo: 'Mod+S', description: 'Save', group: 'View', handler: onSave },
  { combo: 'Mod+Z', description: 'Undo', enabled: notReadOnly, handler: undo },
  { combo: 'Mod+Y', description: 'Redo', enabled: notReadOnly, handler: redo },
])
```

### `ctrl` → `Mod` matches fewer keys

**Behavior change.** `ctrl` never meant only Control. It matched
`ctrlKey || metaKey`, so `{ key: 's', ctrl: true }` fired on ⌘S, on ⌃S and on
Win+S. `Mod+S` compares every modifier exactly: ⌘S on macOS, Ctrl+S elsewhere.
The other two ways to trigger it stop working.

- Register `Ctrl+S` as well if you need Control+S on a Mac.
- The combo syntax has no name for the Windows key, so Win+S cannot be
  restored.
- Write `Ctrl` only where you mean Control on a Mac too.

A combo spells its modifiers in one order, `Mod+Ctrl+Alt+Shift+<Key>`, and a
letter in uppercase. The type accepts no other spelling.

### Punctuation and digits take a key name

`+` separates the parts of a combo, so it cannot also be a key. Use the key's
name instead:

| Before           | After                                                   |
| ---------------- | ------------------------------------------------------- |
| `key: '+'`       | `combo: 'Shift+Equal'` (or `'Plus'` for the keypad key) |
| `key: '='`       | `combo: 'Equal'`                                        |
| `key: '-'`       | `combo: 'Minus'`                                        |
| `key: '/'`       | `combo: 'Slash'`                                        |
| `key: '\\'`      | `combo: 'Backslash'`                                    |
| the backtick key | `combo: 'Backtick'`                                     |
| `key: '1'`       | `combo: 'Digit1'`                                       |
| `key: '!'`       | `combo: 'Shift+Digit1'`                                 |

How keys match now:

- Digits and punctuation match `event.code`. So `Mod+Shift+Digit1` fires on ⌘⇧1
  and on ⌘⇧! alike.
- A punctuation name means the physical key position, as labelled on a US
  layout. So `Mod+Slash` fires on the same key on every layout.
- `Plus` is only the keypad `+`: the key whose `event.code` is `NumpadAdd`.
- Letters and named keys still match `event.key`.
- The old US-layout rule that let `?` match without declaring Shift is removed.
  Declare the Shift.

**Silent break in JavaScript, loud in TypeScript.** TypeScript rejects an
unknown combo. A JavaScript call site that still passes the v0 shape logs one
development warning and never fires.

### Hold shortcuts

```ts
// Before
{ key: 'l', ctrl: true, shift: true, triggeredOn: 'hold',
  description: 'Highlight blocks', onHold: on, onRelease: off }

// After
{ combo: 'Mod+Shift+L', description: 'Highlight blocks', onHold: on, onRelease: off }
```

A hold registration takes no `handler`. `triggeredOn: 'hold'` used to fire
`handler` **and** `onHold`. If you relied on that, move the work into `onHold`.

A v0 shortcut that paired a plain `handler` with your own `keyup` listener also
becomes `onHold` / `onRelease`. Delete the listener.

### `enabled` also hides the shortcut

While `enabled` is `false`, the shortcut does nothing **and** is not listed in
`KeyboardShortcutsDialog`. `condition` already behaved this way, but it was not
documented. It is now specified and tested, so read-only modes keep working.

### Precedence changed

**Behavior change.** When two shortcuts used the same combo, the one the
registry reached first ran. Now the last registration that is enabled **at the
time of the keypress** wins. `enabled` is checked first, so a pair with guards
that never both pass still works unchanged. A real collision warns once per
combo in development.

### `formatShortcutLabel` and `getActiveShortcuts` are gone

**Loud break:** both imports fail at build time. Neither had a consumer.

- To render a combo, use `<KeyboardShortcut :combo="combo" />`.
- To read the registry, use `KeyboardShortcutsDialog`'s default slot.

The types they used, `RegisteredShortcut` and `ActiveShortcut`, are removed with
them. The dialog's slot gives `KeyboardShortcutGroup` and
`KeyboardShortcutEntry` instead. An entry carries `combo`, `altCombos`,
`description` and `group`.

## `KeyboardShortcutsModal` is now `KeyboardShortcutsDialog`

**Loud break:** the import fails to resolve. For a globally registered
`<KeyboardShortcutsModal>`, Vue logs an unknown-component warning. Props are
unchanged. **Codemod:** `shortcuts-v1` renames it.

| Before                                               | After                                                 |
| ---------------------------------------------------- | ----------------------------------------------------- |
| `import { KeyboardShortcutsModal } from 'frappe-ui'` | `import { KeyboardShortcutsDialog } from 'frappe-ui'` |
| `<KeyboardShortcutsModal v-model:open="open" />`     | `<KeyboardShortcutsDialog v-model:open="open" />`     |
| `KeyboardShortcutsModalProps`                        | `KeyboardShortcutsDialogProps`                        |

Two dialog behaviors to know before you compare its output:

- Shortcuts that share a group and a description merge into **one row**, with
  the other combos after a `/`. `Mod+Shift+Z` and `Mod+Y`, both "Redo", are one
  row. v0 merged them only when the modifiers matched too, so rows that used to
  be separate are now joined.
- A disabled shortcut has no row at all.

## The shortcuts codemod

`shortcuts-v1` applies both changes above for you. Run it from the app you are
migrating. Start with a dry run:

```sh
npx --package frappe-ui@rc shortcuts-v1 --dry-run .
```

Review the output, then run it without `--dry-run`:

```sh
npx --package frappe-ui@rc shortcuts-v1 .
```

It:

- renames `useShortcut`, `KeyboardShortcutsModal` and `ShortcutConfig`
- combines `key` and the modifier flags into one `combo`
- renames `condition` to `enabled`

`description`, `group`, `handler`, `onHold`, `onRelease`, `preventDefault`,
`allowInInput` and `allowInDialog` keep their names and their defaults. The
codemod passes them through unchanged.

**Exit code.** The codemod exits non-zero when it refused a site, on a dry run
too. A clean exit means a clean run. Re-running it is safe: a converted object
has no `key` field left to convert, and a refusal repeats until you fix it.

**Refused files stay unchanged.** A file with a refused site stays exactly as it
was, even when its other shortcuts converted. Half a migration puts a renamed
call next to a config with no `combo`, and v1 throws on the first keypress. Fix
the sites the run names, then run again and convert the whole file at once.

The same rule applies to an object that the codemod cannot prove is a config:

- In a file it would otherwise write, that object is a refusal, and the file
  stays as it was.
- In a file with nothing else to change, it is only advice, and the run exits
  zero.
- A file that the run names is never written, in either case.

**Formatting.** The codemod does not reformat the code it edits. Run your
formatter after it.

### What it rewrites

The codemod rewrites an object in two places only:

- Inside a `useShortcut(...)` or `useKeyboardShortcut(...)` call, where the name
  is imported from `frappe-ui` in the same file.
- Inside an array or object literal typed `ShortcutConfig` or
  `KeyboardShortcutConfig`, where that type is imported from `frappe-ui`. An
  annotation, a `satisfies` clause and an `as` cast all count.

Both places name frappe-ui. Nothing else counts.

```ts
import { useShortcut, type ShortcutConfig } from 'frappe-ui'

// Rewritten: the call is frappe-ui's.
useShortcut({ key: 's', ctrl: true, description: 'Save', handler: save })

// Rewritten: the annotation is frappe-ui's.
const bindings: ShortcutConfig[] = [
  { key: 'k', ctrl: true, description: 'Palette', handler: open },
]

// Rewritten: a clause after the literal names the same type.
const save = {
  key: 's',
  ctrl: true,
  description: 'Save',
  handler: onSave,
} satisfies ShortcutConfig

// Left alone: nothing here says frappe-ui.
const menu = [
  { key: 'delete', label: 'Delete', condition: canDelete, handler: remove },
]
```

Field names alone never count as proof. `key`, `description`, `condition`,
`group` and `handler` are also frappe-ui's own option names: a
`ComboboxCustomOption` is `{ type, key, label, description, condition, onClick }`
and a `ComboboxGroupedOption` is `{ key, group, hideLabel, options }`. An app
that passes a config array to its own composable, or builds one with `.map()`,
uses the same names for something else.

The cost: a registration written away from its call, with no annotation, is not
rewritten. The codemod names it instead, with the `combo` to write.

```ts
import { useShortcut } from 'frappe-ui'

// Refused: the call renames, so writing this file would leave the array on v0.
const bindings = [{ key: 's', ctrl: true, description: 'Save', handler: save }]
useShortcut(bindings)
```

Clear that line in one of three ways:

- write the `combo` by hand
- annotate the array with frappe-ui's config type, so the next run can prove it
- migrate the whole file by hand, and leave the run nothing to write

Both type names count as proof. Write `ShortcutConfig[]` while the app is still
on v0, which is where the codemod runs, and `KeyboardShortcutConfig[]` after you
upgrade. A single object uses the same name without the `[]`. Each refused line
names the type for its own shape.

### Punctuation keys are never converted

This is the reason to run a codemod instead of a grep. `+` is both the combo
separator and a key. So `{ key: '+', ctrl: true }` converted by hand becomes
`'Mod++'`, which splits into `['Mod', '', '']` and never fires.

**Silent break if done by hand.** Nothing fails: the build passes, the types
pass, and you get one development-console warning, which a production build
drops.

So the codemod stops on the site and prints the whole `combo` to write, with the
modifier flags to delete next to the `key`:

```
✗ Not converted — 3 sites need a decision:
  src/sheets/useShortcuts.js:L95  key '=' is punctuation ... Write `combo: 'Mod+Equal'` by hand. Delete `ctrl` with the `key`.
  src/sheets/useShortcuts.js:L96  key '+' is a shifted character ... Write `combo: 'Mod+Shift+Equal'` by hand. Delete `ctrl` with the `key`.
  src/Commands/index.ts:L196      key '?' is a shifted character ... Write `combo: 'Mod+Shift+Slash'` by hand. Delete `ctrl` with the `key`.
```

The combo carries the modifiers. A `ctrl: true` left next to a hand-written
`combo` reaches v1 as an excess property, and no later run mentions it: with no
`key`, there is nothing left to refuse.

The name each key takes is in
[Punctuation and digits take a key name](#punctuation-and-digits-take-a-key-name).
Be careful with `Plus`: it is only the keypad key, so `{ key: '+', ctrl: true }`
becomes `'Mod+Shift+Equal'`. The codemod writes that whole combo on the line,
because `Mod+Plus` would bind a key the user never presses and still report a
clean run.

Write the `combo` that the line gives you.

### Combo reference

Every key name a `combo` can hold is listed under
[`combo` takes the key names the composable fires on](#combo-takes-the-key-names-the-composable-fires-on).
A refused line points here when it cannot build the name for you.

Put the name in `combo`, never back in `key`. `key` is the v0 field, and v0
compared it to `KeyboardEvent.key`, which reports none of those spellings. A v1
name left in `key` is still a v0 config, and the next run refuses it again.

### Digits convert, and get listed

`{ key: '1', ctrl: true, shift: true }` becomes `{ combo: 'Mod+Shift+Digit1' }`.
A shifted digit (`!`, `@`, ...) now resolves to the same combo. That is a
behaviour change, so the codemod lists every digit it touched under "Digit keys
converted". Read each one.

### What it reports but never rewrites

Each of these makes the run exit non-zero. Fix them by hand.

- **Punctuation and shifted characters.** See above.
- **An uppercase key with no `shift: true`.** v0 matched the letter either way
  and ignored Shift, so `{ key: 'S' }` fired on `s` and on Shift+S. v1 is exact.
  Write `S`, or `Shift+S`, or register both.
- **A `key` that is not a plain string**, and a modifier flag that is not a
  literal `true` / `false`. v1 has no conditional modifier. A shorthand property
  counts too: `{ key, ctrl }` holds its values somewhere else, so the combo
  cannot be built from the object.
- **A spread, or a computed name the run cannot read, on a config it proved.**
  `{ ...base, handler: save }` and `{ [Keys.SAVE]: 's' }` can carry a `key` or a
  modifier that the run never sees. Write the properties out, or convert the
  object by hand.
- **`formatShortcutLabel` and `getActiveShortcuts`.** Both are deleted, and
  their `ActiveShortcut` and `RegisteredShortcut` types go with them. See
  [`formatShortcutLabel` and `getActiveShortcuts` are gone](#formatshortcutlabel-and-getactiveshortcuts-are-gone)
  for what replaces each one. The codemod names all four wherever they appear,
  comments included.
- **A destructured `useShortcut(...)` return.** v1 returns void; cleanup already
  runs on unmount.
- **`triggeredOn: 'hold'` next to a `handler`.** v0 fired both and v1 will not,
  so the run cannot choose. To keep the hold, delete the `handler`. To keep the
  press, delete `triggeredOn: 'hold'` and the hold callbacks with it. See
  [Hold shortcuts](#hold-shortcuts).
- **`onHold` or `onRelease` without `triggeredOn: 'hold'`.** v0 ran both only
  with `'hold'`, so the callback never fired. In v1 the callback itself selects
  hold mode, so it starts firing. Delete it, or add `triggeredOn: 'hold'` to
  keep it on purpose; the next run converts that pair.
- **A `vi.mock('frappe-ui', ...)` keyed on `useShortcut`.** The file is left
  alone: the captured configs carry `key` / `ctrl`, and the assertions read
  them. Rename the mock key, write the combos and move the assertions by hand.
- **An object that looks like a config, where the run cannot prove it, in a file
  it would otherwise write.** A `key` string next to a `handler` or a
  `condition` is enough for it to be named, with or without a modifier. See
  [What it rewrites](#what-it-rewrites).

### What it lists without failing the run

None of these fails the run. Read them and decide whether the code needs a
rewrite.

- **Every digit it converted.** See above.
- **A v0 key spelling that never matched**, such as `'esc'`, `'up'`,
  `'spacebar'` or `'space'`. v0 compared `event.key`, which never reports those,
  so the shortcut never fired. The combo does fire, so the shortcut is active
  now. `'space'` is on the list because `event.key` gives `' '` for the space
  bar; `Space` is that key's `event.code`.
- **An object that looks like a config, in a place the run cannot prove, in a
  file with nothing else to change.** The line gives the `combo` to write. Use
  it if the object is a registration: v1 throws on a config with no `combo`. An
  object that has an option-only name, such as `label`, `options`, `onClick` or
  `type`, is never listed, and neither is one that your own composable
  receives.
- **Your own `useShortcut` or `ShortcutConfig`**, imported from your module or
  declared in the file. That name is left as it is, and the rest of the file
  still migrates.
- **A possible hand-written hold**: a shortcut registration and a manual `keyup`
  listener in the same file. The pair may become one registration, as
  [Hold shortcuts](#hold-shortcuts) describes. Only you can say which half is
  which. This is a guess: an unrelated `keyup` listener matches too, and no edit
  would clear it, so it never fails the run.

### It never renames your own composable

`useShortcut` is renamed only where the file imports it from the `frappe-ui`
barrel. A fork imported from your own module, or declared in the same file,
keeps its name; the run says so and moves on.

- helpdesk ships its own `useShortcut` in `composables/shortcuts.ts`. Every page
  that uses that one is left as it is.
- crm, lms and suite each ship a local `useKeyboardShortcuts`, one character
  different from the new name. Those are not changed either.

A fork affects only its own calls, not the whole file. A `useKeyboardShortcut(...)`
imported from `frappe-ui` a few lines below your own `useShortcut` is still
converted, and the objects your composable receives are still left alone.

A rename also stays inside code. A name in a string, a module specifier or a
comment keeps its spelling. In a `.vue` template only three places are renamed:
the tag, a bound attribute value such as `:is="..."`, and a mustache. A bound
value and a mustache hold an expression, so a reference in one is migrated and a
quoted string in one is not. `class="useShortcut"`, `{{ 'useShortcut' }}` and
template prose all stay as they are.

## KeyboardShortcut

The deprecated `shortcut` prop, and the unused `meta` / `ctrl` / `shift` / `alt`
boolean props, are removed. Use `combo`: a string like `"Mod+Shift+K"`.

| Before                                              | After                                      |
| --------------------------------------------------- | ------------------------------------------ |
| `<KeyboardShortcut shortcut="Mod+K" />`             | `<KeyboardShortcut combo="Mod+K" />`       |
| `<KeyboardShortcut ctrl shift>K</KeyboardShortcut>` | `<KeyboardShortcut combo="Mod+Shift+K" />` |

**Silent break** for both at runtime. The removed props fall through onto the
rendered `<span>` as plain HTML attributes. `shortcut="Mod+K"` renders an empty
chip, and `ctrl shift` renders the key with no modifier symbols. Only a
type-check names the call sites.

### `combo` takes the key names the composable fires on

The display used to accept a second, looser set of key names. That set is
removed: a chip for a combo that can never fire is exactly the problem this
family is meant to prevent. An unknown name renders as written, so
`<KeyboardShortcut combo="Cmd+K" />` draws the word "Cmd" next to the K.

**Silent break.** `combo` stays typed `string`, because callers compute it, so
no type-check names the call sites. The chip warns once per unknown name in
development and says nothing in production.

| Before                        | After                                             |
| ----------------------------- | ------------------------------------------------- |
| `Cmd`, `Command`, `⌘`, `Meta` | `Mod`                                             |
| `Control`                     | `Ctrl`                                            |
| `Option`, `Opt`, `⌥`          | `Alt`                                             |
| `⇧`                           | `Shift`                                           |
| `Win`, `Windows`              | nothing; the grammar has no Windows key           |
| `Esc`                         | `Escape`                                          |
| `Return`                      | `Enter`                                           |
| `Del`                         | `Delete`                                          |
| `Up`, `Down`, `Left`, `Right` | `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight` |
| `=`                           | `Equal`                                           |
| `F13` and above               | nothing; the grammar stops at `F12`               |

```vue
<!-- Before -->
<KeyboardShortcut combo="Cmd+K" />
<KeyboardShortcut combo="Ctrl+Esc" />
<KeyboardShortcut combo="Option+Up" />

<!-- After -->
<KeyboardShortcut combo="Mod+K" />
<KeyboardShortcut combo="Ctrl+Escape" />
<KeyboardShortcut combo="Alt+ArrowUp" />
```

Grep every `combo` on the component, including bound values. The complete list
of allowed names:

- modifiers: `Mod`, `Ctrl`, `Alt` and `Shift`
- a letter
- `F1` to `F12`
- these key names: `Escape`, `Enter`, `Space`, `Tab`, `Insert`, `Backspace`,
  `Delete`, `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`, `Home`, `End`,
  `PageUp`, `PageDown`, `Digit0` to `Digit9`, `Plus`, `Minus`, `Equal`,
  `Slash`, `Backslash`, `Backtick`, `Comma`, `Period`, `Semicolon`, `Quote`,
  `BracketLeft`, `BracketRight`

`useKeyboardShortcut` reads the same grammar, so any combo you register is a
combo you can draw.

### `useIcons` now reaches `bg` mode

`bg` chips ignored the prop and always drew an icon for the arrow, Enter,
Backspace and Delete keys. `:use-icons="false"` now removes those icons in both
modes and draws the text symbol instead. The default is `true`, so a chip that
never set the prop is unchanged.

### The root's `role` is `img`

`role="note"` on the root becomes `role="img"` when `combo` is set, and no role
at all without `combo`. A labelled `img` replaces its subtree, so a screen
reader reads "Shortcut Control + Backspace" once, instead of reading every chip.

**Silent break** for a test or stylesheet that selects `[role='note']`: it stops
matching, with no error. Update it.

### `matchesShortcut` is no longer exported

**Loud break:** `import { matchesShortcut } from 'frappe-ui'` fails at build
time. Its own doc comment said it was exported for unit tests only. Register a
shortcut with `useKeyboardShortcut` instead of matching a `KeyboardEvent` by
hand.

## Alert

`Alert` is stateless now. It has no `v-model` and never hides itself. The parent
renders it with `v-if` and reacts to `@dismiss`. The layout depends on the
content: a description or a second action switches it to the banner layout.
There is no `variant` prop. See the [Alert](./components/alert) component page
for the full API.

| Before                         | After                                                              |
| ------------------------------ | ------------------------------------------------------------------ |
| unnamed `v-model` (visibility) | `v-if` + `@dismiss` — the parent owns hiding                       |
| `theme="yellow"`               | `theme="amber"`                                                    |
| `theme` default `'blue'`       | default `'gray'`                                                   |
| `variant="subtle" / "outline"` | nothing — one container look, layout is content-driven             |
| `type="warning"`               | nothing — `theme` colors the status icon and the row action        |
| default slot (body text)       | `description` prop, or the `#description` slot                     |
| `dismissible` default `true`   | default `false` — pass `dismissible` to keep the ×                 |
| `#icon` slot                   | `#prefix` slot                                                     |
| `#footer` slot                 | `primaryAction` / `secondaryAction` props, or `#actions` slot      |
| hand-rolled icon               | the theme shows a status icon on its own; `:icon="false"` opts out |

**Silent break** for every row: Vue drops the unknown prop or slot with no
error. Check the old `v-model` first. A dismissed alert now stays on screen
until the parent hides it:

```vue
<!-- Before -->
<Alert v-model="showAlert" title="Payment failed" theme="yellow">
  <template #footer>
    <Button label="Retry" @click="retry" />
  </template>
</Alert>

<!-- After -->
<Alert
  v-if="showAlert"
  title="Payment failed"
  theme="amber"
  dismissible
  :primary-action="{ label: 'Retry', onClick: retry }"
  @dismiss="showAlert = false"
/>
```

An action is `ButtonProps` plus an `onClick` that receives `{ dismiss }`. Call
`context.dismiss()` to emit the alert's `dismiss` event:

```ts
const primaryAction = {
  label: 'Retry',
  onClick: ({ dismiss }) => {
    retry()
    dismiss()
  },
}
```

If the alert was really a promotional card in a sidebar, use the new
[`SidebarCard`](./components/sidebar) component instead.

## Badge

`theme="orange"` is removed. It was a deprecated alias that resolved to `amber`,
so the replacement renders the same badge as before.

| Before           | After           |
| ---------------- | --------------- |
| `theme="orange"` | `theme="amber"` |

```vue
<!-- Before -->
<Badge theme="orange" label="In Progress" />

<!-- After -->
<Badge theme="amber" label="In Progress" />
```

How the break shows up depends on whether the call site is typed:

- **Loud break in TypeScript.** `vue-tsc` rejects the value, because the
  `theme` prop union no longer accepts the string. You get a compile error, not
  a surprise in production.
- **Silent break in JavaScript and bound values.** The badge renders in the
  default `gray` theme and logs a one-time development-mode warning that names
  the component, the prop and the value. Production logs nothing.

```
[frappe-ui] Badge.theme="orange" is not a supported value — falling back to
"gray". Supported: gray, blue, green, amber, red, violet.
```

So a missed site shows a grey badge, not a broken page. `Badge` used to look up
a class map by theme and then look up the result by variant. An unknown theme
threw `TypeError: Cannot read properties of undefined` during render and broke
the parent's render too. Now `theme`, `variant` and `size` all fall back to
their defaults instead.

Do not rely on the fallback. It is a safety net for the upgrade, not a supported
way to pass a colour. A grey badge where a coloured one belongs is still a bug,
and the development warning is the only thing that tells you.

### Check bound themes

Check bound themes too, not only literal attributes. A status-to-theme map or a
computed that returns `'orange'` falls back to grey in the same way, and neither
`vue-tsc` nor a grep for `theme="orange"` finds it:

```ts
// Before
const themeByStatus = { open: 'orange', closed: 'green' }

// After
const themeByStatus = { open: 'amber', closed: 'green' }
```

Look for `orange` used as a **fallback**. It affects more sites than it seems,
because every caller that omits a theme gets it:

```vue
<!-- Before — every caller without `badge.theme` renders grey -->
<Badge :theme="badge.theme ?? 'orange'" />

<!-- After -->
<Badge :theme="badge.theme ?? 'amber'" />
```

If your app has its own colour names and cannot rename `orange` where it is
defined, convert it where you pass it to `Badge`:

```ts
const badgeTheme = tone === 'orange' ? 'amber' : tone
```

## Icons

Pass an icon anywhere in the library as a `lucide-*` string (drawn by the
Tailwind mask plugin), or as a `Component` when you need one. This is the one
recommended way. `FeatherIcon` is removed per ADR-0008: it was marked
`@deprecated` in code, and nothing marked deprecated ships in `1.0.0`.

| Before                                     | After                                               |
| ------------------------------------------ | --------------------------------------------------- |
| `<FeatherIcon name="plus" class="size-4" />` | `<span class="lucide-plus size-4" aria-hidden="true" />` |
| `<Button icon="plus" />` (bare feather name) | `<Button icon="lucide-plus" />`                     |

### `FeatherIcon` is removed

**Loud break:** `import { FeatherIcon } from 'frappe-ui'` and `<FeatherIcon>`
fail at the import. Replace a direct usage with the `lucide-*` class form:

```vue
<!-- Before -->
<FeatherIcon name="plus" class="size-4" />
<!-- After -->
<span class="lucide-plus size-4" aria-hidden="true" />
```

Feather and lucide share most icon names, so `<FeatherIcon name="x">` →
`<span class="lucide-x">` is usually a direct rename. Check each name against
[lucide.dev](https://lucide.dev/icons), because a few are different or were
renamed.

### Bare icon names no longer render

**Silent break.** Every icon-name prop in the library used to render a bare
feather-style name (for example `"edit"`, `"chevron-down"`) through
`FeatherIcon`. These props are:

- `Button.icon` / `iconLeft` / `iconRight`
- `Dialog.icon`, `Alert.icon`, `SidebarCard.icon`
- `Dropdown` / `ContextMenu` item `icon`
- `TabButtons` options `icon` / `iconLeft`
- `TabTrigger.icon` / `iconLeft`
- the `Icon` component's `icon` prop

That fallback is removed. Only a `lucide-*` string, an emoji or symbol
character, or a `Component` renders. Any other string renders nothing. There is
no build or type error; the icon just disappears. A development-mode console
warning names the component, the prop and the wrong value, once per component
and prop. Add the `lucide-` prefix to the name:

```vue
<!-- Before -->
<Button icon="plus" />
<!-- After -->
<Button icon="lucide-plus" />
```

The same applies to icon-name strings in `Dropdown` options:

```js
// Before
const options = [{ label: 'Edit', icon: 'edit' }]

// After
const options = [{ label: 'Edit', icon: 'lucide-pen' }]
```

## Base component props

Props on `Icon`, `Progress`, `Badge` and `Divider` are made consistent.

| Before                                     | After                                                  |
| ------------------------------------------ | ------------------------------------------------------ |
| Icon `name`                                | `icon` (`name` still supported; `icon` wins)           |
| Progress `intervals :interval-count="n"`   | `:intervals="n"`                                       |
| Badge `label` with rich content            | `label` string or number; default slot for rich content |
| `DividerAction` (own fields)               | shared Button fields: `theme`, `variant`, `size`, icons |
| Divider `position`                         | `align`                                                |

**Codemod:** run `base-props-v1` over Vue files to migrate statically named
component tags. Start with a dry run, so that globally registered app components
that reuse these names are easy to spot:

```sh
npx --package frappe-ui@rc base-props-v1 --dry-run src
npx --package frappe-ui@rc base-props-v1 src
```

- Icon `name` is still supported. `icon` is the standard spelling, and wins
  when both are present. The codemod can normalize single `name` props if you
  want.
- Replace Progress `intervals` and `intervalCount` with one numeric `intervals`
  prop. For example, `intervals :interval-count="steps.length"` becomes
  `:intervals="steps.length"`.
- Pass only a string or number to Badge `label`. Use its default slot for rich
  content.
- `DividerAction` now accepts the shared Button fields, including `theme`,
  `variant`, `size` and icons.
- Replace Divider `position` with `align`.

**Behavior change:** Progress labels and hints now render independently. A
`#hint` slot no longer needs a `label` or `hint` prop to make its row appear.

## List family

Row state attributes and two slot names change in `frappe-ui/list`.
**Codemod:** run `npx list-v1 .` from each app that imports components from
`frappe-ui/list`. It updates selectors anchored to `[data-slot="list-row"]`,
Tailwind state variants on imported `ListRow` components, and the two statically
named slots below.

| Before                                          | After                                         |
| ----------------------------------------------- | --------------------------------------------- |
| `[data-slot='list-row'][data-active]`           | `[data-slot='list-row'][data-state='active']` |
| `[data-slot="list-row"][data-state="selected"]` | `[data-slot="list-row"][data-selected]`       |
| `ListGroup` `#header`                           | `#label`                                      |
| `ListHeaderCellSort` `#suffix`                  | `#sort-indicator`                             |
| `ListRows.virtual` object                       | `virtual` boolean + `overscan` prop           |

### Slot renames

**Silent break:** Vue drops content passed under an unknown slot name.

```diff
-<ListGroup><template #header>Open</template></ListGroup>
+<ListGroup><template #label>Open</template></ListGroup>
 <ListHeaderCellSort align="end">
-  <template #suffix="{ direction }">…</template>
+  <template #sort-indicator="{ direction }">…</template>
 </ListHeaderCellSort>
```

The sort-indicator slot keeps its placement based on the edge, including the
leading edge for `align="end"`.

### Row state attributes

Every `ListRowBase` now has `data-state="active"` or `"inactive"`. Selection and
interactivity are separate boolean attributes: `data-selected` and
`data-interactive`. `ItemListRow` keeps its existing runtime behavior.

### What the codemod does not change

- It leaves local or globally registered components with the same name alone.
  If one of them still contains an old slot name, it reports the case for a
  manual check.
- When it finds a dynamic slot under either renamed component, it exits
  non-zero and leaves the file unchanged.

After the codemod, grep for these forms. They need a manual check because the
tool cannot prove which component owns them:

- `group-data-[active]`
- unanchored `data-state="selected"` / `data-active` selectors
- render-function slot keys named `header` or `suffix`
- dynamic slots

### `ListRows.virtual` is a boolean

`ListRows.virtual` is now a boolean.

- Move the object's `overscan` field to the new top-level `overscan` prop.
- Set the row height on the parent `List` with `rowHeight`.
- Stop importing `ListVirtualOptions` or `useVirtualRows`. The component handles
  virtualization itself.

The ListRows slot also receives separate `selected` and `active` booleans.

## Tree

The Tree was rebuilt. It used to render a single recursive `node`; it now
renders a list of root nodes (a forest) and keeps its own state.

- It takes a `nodes` array, and its per-row slots are named `#item-*`.
- Expansion moved off the nodes and into a keyed `v-model:expanded`, so the tree
  never writes to the objects you pass in.
- The `options` object is removed. Sizing moves to CSS variables.
- Keyboard navigation, `role="tree"` ARIA, and opt-in drag-and-drop are new.

| Before                                           | After                                              |
| ------------------------------------------------ | -------------------------------------------------- |
| `:node="root"` (single root object)              | `:nodes="[root]"` (array of roots)                 |
| `node.collapsed` / internal collapse             | `v-model:expanded="keys"` (keys of the open nodes) |
| `:options="{ rowHeight, indentWidth }"`          | `--tree-row-height` / `--tree-indent` CSS vars     |
| `:options="{ showIndentationGuides }"`           | `guides="connectors" \| "lines" \| "none"`         |
| `:options="{ defaultCollapsed: true }"`          | nothing — collapsed is the default                 |
| `:options="{ defaultCollapsed: false }"`         | `treeRef.expandAll()`                              |
| `#node="{ node, isCollapsed, toggleCollapsed }"` | `#item="{ node, expanded, toggle, … }"`            |
| `#label`                                         | `#item-label`                                      |
| `#icon`                                          | built-in chevron; override via `#item`             |

**Silent break.** Nothing here fails with an error. `:node` and `:options`
become fall-through attributes. Content passed to the old `#node` / `#label` /
`#icon` slots is discarded, and the default row renders in its place. A
production build renders an empty tree.

Only three things warn, and only in development:

- the now-required `nodes` prop
- the removed per-node `expanded` field
- the removed boolean form of `v-model:expanded` (see below)

Grep for `:node=`, `:options=`, `#node`, `#label` and `#icon` on `Tree`
specifically.

```vue
<!-- Before -->
<Tree :node="root" node-key="name" :options="{ defaultCollapsed: false }">
  <template #label="{ node }">{{ node.title }}</template>
</Tree>

<!-- After -->
<Tree :nodes="[root]" node-key="name" v-model:expanded="expanded">
  <template #item-label="{ node }">{{ node.title }}</template>
</Tree>
```

### Expansion is keyed, and the tree stops writing to your nodes

`v-model:expanded` is an array of the **keys** of the open nodes. A key that is
not in the array means collapsed. So a tree with no bound model renders its
roots and nothing else.

Remove any `expanded` field you set on node data; it is no longer read. A
development build warns once when it finds one, and once more if you still pass
the old boolean to `v-model:expanded`. Production shows nothing in either case.

```vue
<!-- Before — the tree wrote `expanded` back onto your objects -->
<Tree :nodes="nodes" node-key="name" />

<!-- After — expansion lives in your state, as keys -->
<script setup>
const expanded = ref(['src', 'src/components'])
</script>
<Tree :nodes="nodes" node-key="name" v-model:expanded="expanded" />
```

Every toggle assigns a new array instead of changing the array in place. So
shallow watchers, immutable stores and undo logs see the change.

The old boolean expand-all / collapse-all switch is removed. Call
`expandAll()` / `collapseAll()` on the component ref instead:

```vue
<script setup>
const tree = ref(null)
const expanded = ref([])
</script>

<template>
  <Button @click="tree.expandAll()">Expand all</Button>
  <Tree ref="tree" :nodes="nodes" node-key="name" v-model:expanded="expanded" />
</template>
```

`expand(key)`, `collapse(key)` and `toggle(key)` are exposed too. All five are
called from code, so `disabled` does not block them.

**Additive:** drag-and-drop is opt-in.

- Set `draggable`.
- Control which drops are allowed with
  `:move="({ node, target, position }) => …"`.
- Save the result from `@drag-end="(info) => …"`. `info` is
  `{ node, from, to, position, oldIndex, newIndex }`, or `null` when the drag
  is cancelled.

## Card, ListItem, standalone `<Toast>` (removed)

Three unmaintained wrappers are removed in v1, per ADR-0008. Each was marked
`@deprecated` in code, and none had any call sites left in the downstream apps
we checked.

**Loud break** for all three: the import fails.

| Before                         | After                                                      |
| ------------------------------ | ---------------------------------------------------------- |
| `<Card>`                       | plain markup + `LoadingText` / `Skeleton`                  |
| `<ListItem>`                   | plain markup                                               |
| `<Toast>` (standalone)         | `toast()` / `toast.success()` and the other toast functions |

### `Card`

`Card` wrapped a title / subtitle / actions layout with a manual loading state.
There is no drop-in replacement. Rebuild the layout with plain markup, and use
[`LoadingText`](./components/loadingtext) or [`Skeleton`](./components/skeleton)
for the loading state:

```vue
<!-- Before -->
<Card title="Title" subtitle="Subtitle" :loading="loading">
  <template #actions><Button label="Edit" /></template>
  Content
</Card>

<!-- After -->
<div class="flex flex-col rounded-6 border px-6 py-5">
  <div class="flex items-baseline justify-between">
    <h2 class="text-lg font-semibold">Title</h2>
    <Button label="Edit" />
  </div>
  <p class="mt-1.5 text-ink-gray-6">Subtitle</p>
  <LoadingText v-if="loading" class="mt-4" />
  <div v-else class="mt-4">Content</div>
</div>
```

### `ListItem`

`ListItem` rendered a title / subtitle / actions row. There is no drop-in
replacement either. Rebuild it with plain markup:

```vue
<!-- Before -->
<ListItem title="Title" subtitle="Subtitle">
  <template #actions><Button label="Edit" /></template>
</ListItem>

<!-- After -->
<div class="flex items-center justify-between py-3">
  <div>
    <h3 class="font-medium">Title</h3>
    <p class="text-ink-gray-6">Subtitle</p>
  </div>
  <Button label="Edit" />
</div>
```

### Standalone `<Toast>`

`import { Toast } from 'frappe-ui'` and `<Toast>` fail at the import. This
removes only the raw component built on `ToastRoot`. The imperative API is not
affected, and is almost certainly what you want:

```vue
<!-- Before -->
<Toast v-model:open="open" message="Saved" type="success" />

<!-- After -->
<script setup>
import { toast } from 'frappe-ui'
toast.success('Saved')
</script>
```

`<ToastProvider>` (mount it once near your app root) is unchanged. The current
API is plain `toast()` plus `toast.success()` / `toast.error()` /
`toast.warning()` / `toast.info()`.

**Loud break:** v0's `toast.create()`, `toast.remove()` and `toast.removeAll()`
are removed. TypeScript reports each call, and at runtime each one throws a
`TypeError` (`toast.create is not a function`). Move them to
`toast.message(...)`, `toast.dismiss(id)` and `toast.dismiss()`; see
[The three named shims are removed](#the-three-named-shims-are-removed).

## Toast: the legacy object form is removed {#toast-legacy-object}

| Before                                        | After                                          |
| --------------------------------------------- | ---------------------------------------------- |
| `toast({ title, text, type })`                | `toast.success(title, { description: text })`  |
| `toast({ position })` per toast               | `position` on `<ToastProvider>`                |
| `toast.create({ message })`                   | `toast.message(message)`                       |
| `toast.remove(id)`                            | `toast.dismiss(id)`                            |
| `toast.removeAll()`                           | `toast.dismiss()`                              |
| `toast.create({ closable: false })`           | `duration: Infinity, closeButton: false, dismissible: false` |
| `toast.create({ duration })` in seconds       | `duration` in milliseconds                     |

**Silent break:** `toast({ title, text })` no longer works, and **nothing tells
you**. The object is passed to sonner as the message. Sonner expects a string, a
component or a VNode, so the toast renders empty or wrong instead of throwing.

```js
// Before
toast({ title: 'Saved', text: 'Your changes are live.', type: 'success' })

// After
toast.success('Saved', { description: 'Your changes are live.' })
```

`position` was already ignored per toast. Set it once on `<ToastProvider>`.

```js
// Before
toast({ title: 'Copied', position: 'bottom-right' })

// After — position is global
toast('Copied')
```

A grep for `toast(` does not find these reliably. Grep for the keys instead:
`title:`, `text:` and `message:` inside a `toast(` call.

### The three named shims are removed

**Loud break:** the three named shims are removed at the same time. They no
longer work at all: TypeScript reports each call, and at runtime each
one throws a `TypeError` (`toast.create is not a function`).

```js
toast.create({ message: 'Loading…' }) // → toast.message('Loading…')
toast.remove(id) // → toast.dismiss(id)
toast.removeAll() // → toast.dismiss()
```

`toast.create({ closable: false })` mapped to three sonner options. Write them
out:

```js
// Before
toast.create({ message: 'Uploading…', closable: false })

// After
toast.message('Uploading…', {
  duration: Infinity,
  closeButton: false,
  dismissible: false,
})
```

`toast.create` also took `duration` in **seconds**, while sonner takes
milliseconds, and it treated `duration: 0` as "never dismiss". Multiply by 1000,
and write `Infinity` where you meant a toast that stays.

## Toast: `description` now renders limited inline HTML {#toast-description-html}

| Before                         | After                                                          |
| ------------------------------ | -------------------------------------------------------------- |
| `description` is plain text    | sanitized HTML, safelist `a`, `em`, `strong`, `i`, `b`, `u`    |

`description` is sanitized and rendered like the message, with the same
safelist (`a`, `em`, `strong`, `i`, `b`, `u`). It used to render as plain text.

**Silent break.** A description that holds a `<` that is not one of those six
tags loses those characters, with no warning:

```js
// Before — rendered literally: Set <Button> variant
toast('Heads up', { description: 'Set <Button> variant' })

// After — DOMPurify strips <Button>: Set  variant
// Escape it, or drop the angle brackets:
toast('Heads up', { description: 'Set &lt;Button&gt; variant' })
```

Descriptions that are components, VNodes or render functions are not changed.

## Editor

The v0 all-in-one `<TextEditor>` (imported from `frappe-ui`) is replaced by the
`frappe-ui/editor` family: a headless `<Editor>` that you compose with **kits**
(bundled, configurable extension sets) and **building-block** menus. See the
[Editor](./molecules/editor) page for the full API and recipes.

**Loud break.** Everything moves to the `frappe-ui/editor` subpath. Nothing
editor-related is exported from the root. These are removed from top-level
`frappe-ui` in `1.0.0`:

- `TextEditor` and its siblings: `TextEditorBubbleMenu`,
  `TextEditorFixedMenu`, `TextEditorFloatingMenu`, `TextEditorContent`,
  `createEditorButton`
- the v0 extension helpers `ImageExtension` and `createSuggestionExtension`
- their types `SetImageOptions`, `BaseSuggestionItem` and
  `CreateSuggestionExtensionOptions`

```ts
// Before
import { TextEditor, TextEditorFixedMenu } from 'frappe-ui'
// After
import {
  Editor,
  EditorFixedMenu,
  RichTextKit,
  articleToolbar,
} from 'frappe-ui/editor'
```

| Before                                          | After                                                                    |
| ----------------------------------------------- | ------------------------------------------------------------------------ |
| `import … from 'frappe-ui'`                     | `import … from 'frappe-ui/editor'`                                       |
| `<TextEditor>`                                  | `<Editor>`                                                               |
| `:content="x" @change="x = $event"`             | `v-model="x"` (`@change` still emitted)                                  |
| HTML string only                                | `v-model` + `format="json"` for a JSON value                             |
| `:starterkit-options="{ heading: { levels } }"` | `RichTextKit.configure({ heading: { levels } })` in `:extensions`        |
| auto-loaded extension set (no opt-out)          | explicit `:extensions` — pick `CommentKit` / `RichTextKit` / `InlineKit` |
| `:mentions` / `:tags` props                     | `kit.configure({ mention: { items, nodeView }, tag: { items } })`        |
| `:bubble-menu="true"`                           | `<EditorBubbleMenu :items="articleToolbar">` in the default slot         |
| `:floating-menu="true"`                         | `<EditorFloatingMenu :items>`                                            |
| `<TextEditorFixedMenu :buttons>`                | `<EditorFixedMenu :items>`                                               |
| `<TextEditorContent>`                           | `<EditorContent>`                                                        |
| menu `:buttons`                                 | menu `:items`                                                            |
| hand-rolled `textEditorMenuButtons` array       | `commentToolbar` / `articleToolbar` / `minimalToolbar` presets           |
| `#top` / `#bottom` / `#editor` slots            | one default slot — you render `EditorContent` + menus yourself           |
| `:uploadFunction` (optional, frappe default)    | `:upload-function` (required to enable uploads)                          |
| `UploadedFile` from `frappe-ui/editor` (beta)   | `UploadedMedia`                                                          |

### Not migrated yet: the temporary import path

All eleven v0 names are kept, unchanged, in `frappe-ui/experimental` as a
temporary import path. It is unstable (no deprecation period) and will be
removed once consumers migrate:

```ts
import {
  TextEditor,
  TextEditorBubbleMenu,
  TextEditorFixedMenu,
  TextEditorFloatingMenu,
  TextEditorContent,
  createEditorButton,
  ImageExtension,
  createSuggestionExtension,
} from 'frappe-ui/experimental'
import type {
  SetImageOptions,
  BaseSuggestionItem,
  CreateSuggestionExtensionOptions,
} from 'frappe-ui/experimental'
```

### Compose, don't configure

v0 took every option as a prop on `<TextEditor>` and loaded every extension
automatically. v1 renders no UI of its own. You place the building blocks inside
its default slot, and they get the editor from context. (The `:editor` prop is
needed only when you compose primitives without `<Editor>`.)

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  Editor,
  EditorContent,
  EditorBubbleMenu,
  RichTextKit,
  articleToolbar,
} from 'frappe-ui/editor'

const content = ref('')
const extensions = [
  RichTextKit.configure({ heading: { levels: [2, 3, 4, 5, 6] } }),
]
</script>

<template>
  <Editor v-model="content" :extensions="extensions" placeholder="Write…">
    <EditorBubbleMenu :items="articleToolbar" />
    <EditorContent class="prose max-w-none" />
  </Editor>
</template>
```

Pick the kit for each surface:

- `CommentKit`: light, with no table, toc or slash commands
- `RichTextKit`: a full document
- `InlineKit`: a single line

Configure kit members on the kit, not through props. For example, configure
mentions and tags with `kit.configure({ mention: {...}, tag: {...} })`. To keep
the mention and tag nodes rendering but turn off the live popups, pass
`mention: { items: null }`.

For a fully custom layout (for example, a title `<textarea>` next to the body),
skip `<Editor>` and call `useEditor` yourself. Render `<EditorContent>` and the
menus next to your own markup. See
[Composing primitives](./molecules/editor#composing-primitives).

### Editor suggestion and fixed-menu names

Suggestion components now name the role they fill:

- In `Mention.configure(...)` or a kit's `mention` options, replace `component`
  with `nodeView`.
- In `SuggestionExtension.configure(...)`, replace `component` with
  `listComponent`.

**Silent break** in JavaScript for the mention and kit paths. TypeScript reports
the removed keys. Development builds warn when they see either one.

```ts
// Before
Mention.configure({ items: users, component: MentionNode })
SuggestionExtension.configure({ ...options, component: SuggestionList })

// After
Mention.configure({ items: users, nodeView: MentionNode })
SuggestionExtension.configure({ ...options, listComponent: SuggestionList })
```

`EditorFixedMenu` also renames `buttonSize` to `size`. **Codemod:** run the
idempotent `editor-v1` codemod, then check the two suggestion shapes by hand:

```sh
npx --package frappe-ui@rc editor-v1 --dry-run .
npx --package frappe-ui@rc editor-v1 .
```

```vue
<!-- Before -->
<EditorFixedMenu button-size="sm" :items="items" />
<!-- After -->
<EditorFixedMenu size="sm" :items="items" />
```

### Editor option types

Kit members, the upload handler and the two floating menus are typed. Run
`yarn type-check` (or `vue-tsc`) after upgrading: every edit below is reported
at the call site.

#### Every constructed `UploadedMedia` must include `file_url`

The type is exported, and so is the handler type:

```ts
// Before
const uploadFunction = async (file: File) => {
  const doc = await upload(file)
  return doc // any shape
}
// After
import type { UploadFunction } from 'frappe-ui/editor'
const uploadFunction: UploadFunction = async (file, options) => {
  const doc = await upload(file, {
    doctype: 'Blog Post', // attach it, see below
    docname: post.name,
    onProgress: options?.onProgress,
  })
  return doc // must carry file_url; extra fields pass through
}
```

The second argument is optional. A handler with one argument still compiles.

#### Rename the editor's `UploadedFile` import to `UploadedMedia`

The root `frappe-ui` export `UploadedFile` is the File document that `upload()`
resolves with. It keeps its name. TypeScript reports the old editor import:

```ts
// Before
import type { UploadedFile } from 'frappe-ui/editor'
// After
import type { UploadedMedia } from 'frappe-ui/editor'
```

#### Do not pass `upload` bare

`upload` from `frappe-ui` now fits `uploadFunction` with no cast. Do not pass it
bare. Bare `upload` stores a private file attached to nothing, and only the
user who uploaded it can load it. Either:

- attach the file to the document that holds the content. The file stays
  private, and anyone who can read that document can read it.
- or pass `private: false` when the content is public anyway.

```ts
import { upload } from 'frappe-ui'
import type { UploadFunction } from 'frappe-ui/editor'

const uploadFunction: UploadFunction = (file, options) =>
  upload(file, {
    doctype: 'Blog Post', // or `private: false` for public content
    docname: post.name,
    signal: options?.signal,
    onProgress: options?.onProgress,
  })
```

#### Remove dead `code`, `codeBlock` and `link` keys from StarterKit options

The frappe extensions with those names are separate members, so the keys did
nothing:

```ts
// Before
StarterKit.configure({ link: false, codeBlock: false })
// After
StarterKit
```

Inside a kit, move `heading` out of `starterKit`:

```ts
// Before
RichTextKit.configure({ starterKit: { heading: { levels: [2, 3] } } })
// After
RichTextKit.configure({ heading: { levels: [2, 3] } })
```

`InlineKit.starterKit` takes only `false` for each member:

```ts
// Before
InlineKit.configure({ starterKit: { code: { HTMLAttributes: {} } } })
// After
InlineKit.configure({ starterKit: { code: false } })
```

#### Add StyleClipboard and Toc explicitly when an editor needs them

`RichTextKit` no longer registers them by default:

```ts
// Before
RichTextKit
// After (only if you call insertTableOfContentsNode or read
// editor.storage.styleClipboard)
RichTextKit.configure({ toc: {}, styleClipboard: {} })
```

`imageViewer` is unchanged and stays on.

#### A custom slash-command list now replaces the built-in menu

**Behavior change.** `items` was accepted and ignored before, so check what you
pass:

```ts
RichTextKit.configure({
  slashCommands: {}, // built-in menu
  // slashCommands: { items: myCommands },  // replaces the built-in list
  // slashCommands: false,                  // no slash menu
})
```

#### Check Bubble and Floating menu option objects against `EditorMenuOptions`

The supported keys are `side`, `align`, `strategy`, `offset`, `flip`, `shift`,
`hide`, `inline`, `scrollTarget` and `shouldShow`.

**`placement` becomes `side` plus `align`.** The menus now position the same way
as `Popover`, `Select`, `Dropdown`, `HoverCard` and the pickers, with the same
`PopoverSide` and `PopoverAlign` values. Split the value at the hyphen:

```vue
<!-- Before -->
<EditorBubbleMenu :options="{ placement: 'top-start' }" />
<!-- After -->
<EditorBubbleMenu :options="{ side: 'top', align: 'start' }" />

<!-- Before -->
<EditorFloatingMenu :options="{ placement: 'bottom' }" />
<!-- After -->
<EditorFloatingMenu :options="{ side: 'bottom' }" />
```

`align` defaults to `center`, which is the variant with no alignment suffix. If
you set neither axis, TipTap's own default still applies: `top` for the bubble
menu and `right` for the floating menu. The exported `EditorMenuPlacement` type
is removed. Import `PopoverSide` and `PopoverAlign` from `frappe-ui` if you need
to name the values.

**Settings that worked before are removed.** The `options` prop used to be
TipTap's own Floating UI options object, so the keys below type-checked and
reached Floating UI. They are now a compile error:

| Removed                                          | What to do                                                             |
| ------------------------------------------------ | ---------------------------------------------------------------------- |
| `placement`                                      | `side` plus `align`, as above.                                         |
| `arrow`                                          | Drop it. The menus render no arrow element.                            |
| `size`                                           | Size the menu with CSS on your own toolbar markup.                     |
| `autoPlacement`                                  | Set `side`, and leave `flip` on for the fallback.                      |
| `onShow`, `onHide`, `onUpdate`, `onDestroy`      | Watch your own state, or use `shouldShow` for the show or hide branch. |
| `offset: { mainAxis, crossAxis }`                | `offset: <number>`, the main-axis gap.                                 |
| `flip`, `shift`, `hide`, `inline` in object form | `true` to keep the middleware on its defaults, or drop the key.        |

```vue
<!-- Before -->
<EditorBubbleMenu
  :options="{
    placement: 'top',
    offset: { mainAxis: 8 },
    flip: { fallbackPlacements: ['bottom'] },
    onShow: () => (menuOpen = true),
  }"
/>
<!-- After -->
<EditorBubbleMenu :options="{ side: 'top', offset: 8, flip: true }" />
```

`flip: true` keeps Floating UI's default fallback placements, which is the
opposite side. If a menu really needs middleware configuration, mount TipTap's
`BubbleMenu` directly and render `EditorFixedMenu` inside it.

#### Mention and tag data need `label` and `value`

Update mention and tag data to include `label` and `value`. Use the original
slot item for extra fields. `label` is the text, and `value` is the stored id:

```ts
// Before
const mentions = users.map((u) => ({
  id: u.name,
  label: u.full_name,
  email: u.email,
}))
// After
const mentions = users.map((u) => ({
  value: u.name,
  label: u.full_name,
  email: u.email,
}))
```

The list no longer rewrites your objects, so the item slot receives the object
you supplied, including `email`. `getMentions()` returns `{ label, value }`.
Read `value` where you used to read `id`.

Tags work the same way, but `value` is optional, so a newly typed tag has none
yet.

### Gotchas

- **Tailwind must scan frappe-ui's editor source.** Menu icons are literal
  `lucide-*` class strings in `frappe-ui/src/molecules/**`. Add that glob to
  your `tailwind.config.js` `content`. **Silent break** if you do not: the
  toolbar, bubble and floating menu icons are not generated, with no error.
- **Uploads need an explicit handler.** v0 called the Frappe upload
  automatically, without telling you. v1 requires `:upload-function`. In a
  Frappe app: `(file) => useFileUpload().upload(file, {})`.
- **TipTap must be v3.** The v1 editor is built on TipTap 3. Pin
  `@tiptap/core`, `@tiptap/pm` and `@tiptap/vue-3` to `^3`.

## Code editor {#code-editor}

<a id="frappe-ui-code-editor-removed"></a>

**Silent break.** `frappe-ui/code-editor` still resolves in v1, with the same
subpath but a different API. The v0 `CodeEditor` and `CodePreview` are removed.
A new family replaces them, built the same way as the editor family: an engine,
a renderless component, one part, and a kit.

- `CodePreview` breaks loudly, because the name no longer exists.
- `CodeEditor` does not.
  `<CodeEditor v-model="script" label="Script" language="json" />` still imports
  and still mounts, and then draws nothing. The new one is renderless, and every
  feature comes from `extensions`. Port every call site instead of waiting for a
  build error.

```ts
// Before
import { CodeEditor, CodePreview, loadLanguage } from 'frappe-ui/code-editor'

// After
import {
  CodeEditor,
  CodeEditorContent,
  CodeKit,
  loadLanguage,
} from 'frappe-ui/code-editor'
```

| v0                                             | v1                                                              |
| ---------------------------------------------- | --------------------------------------------------------------- |
| `language="json"`                              | `:extensions="[CodeKit, json()]"`                               |
| `variant` / `size` props                       | CSS var sets on your wrapper                                    |
| `placeholder="SELECT 1"`                       | `CodeKit.configure({ placeholder: 'SELECT 1' })`                |
| `disabled`                                     | `:editable="false"`                                             |
| `label` / `description` / `error` / `required` | drawn by your field                                             |
| `--cm-max-height`                              | `--code-max-height`                                             |
| automatic JSON lint                            | `[lintGutter(), linter(jsonParseLinter())]` in `extensions`     |
| `@overflow` on the field                       | `@overflow` on `<CodeEditorContent>`                            |
| `CodePreview`                                  | copy it into your app; it is a markdown renderer, not an editor |

### frappe-ui ships no labeled field

The old component drew a label, a description, an error and a required marker.
The new `CodeEditor` renders nothing at all: it owns the view and the `v-model`,
and your app draws the UI around it. Write one thin field component and reuse it
at every call site. The Desk/FormLayout field is in `@framework/ui`.

### Types

The types `CodeLanguage`, `CodeEditorProps`, `CodeEditorEmits` and
`CodePreviewProps` are removed. `LanguageKey`, `CodeEditorOptions`,
`CodeEditorExposed` and `CodeKitOptions` are the new ones.

### A minimal port

```vue
<script setup>
import { CodeEditor, CodeEditorContent, CodeKit } from 'frappe-ui/code-editor'
import { json } from '@codemirror/lang-json'

const value = ref('{}')
</script>

<template>
  <CodeEditor v-model="value" :extensions="[CodeKit, json()]">
    <CodeEditorContent class="min-h-40" />
  </CodeEditor>
</template>
```

### Install the language packages you use

The ten `@codemirror/lang-*` packages and `@codemirror/lint` are optional peer
dependencies now, so an app downloads only what it renders.
`loadLanguage('sql')` throws an error that names the package when it is
missing.

Full API: [the code editor docs](/docs/molecules/code-editor).

## Charts

**Only for apps already on `frappe-ui/charts` from `1.0.0-beta.42` or later.**
The subpath did not exist before that. The family is new in v1, so an app coming
from v0 has nothing to migrate here. The older `config`-object family is covered
in [Charts (v1) — moved to
`frappe-ui/experimental`](#charts-v1-—-moved-to-frappe-ui-experimental).

### Mark click emits are renamed to `select`

Eight charts renamed their mark emit to `select`, replacing six old names with
one.

| Before                         | After     |
| ------------------------------ | --------- |
| `AreaChart` `@datapoint-click` | `@select` |
| `BarChart` `@datapoint-click`  | `@select` |
| `LineChart` `@datapoint-click` | `@select` |
| `DonutChart` `@slice-click`    | `@select` |
| `FunnelChart` `@stage-click`   | `@select` |
| `HeatmapChart` `@cell-click`   | `@select` |
| `SankeyChart` `@link-click`    | `@select` |
| `ScatterChart` `@point-click`  | `@select` |

**Silent break.** Vue attaches a listener for an emit that the component no
longer declares as a plain attribute. So the handler stops firing, with no error
and no warning. The payload is unchanged; only the name changes.

```vue
<!-- Before -->
<BarChart :data="rows" x="warehouse" :y="['picked']" @datapoint-click="open" />
<DonutChart
  :data="rows"
  category="channel"
  value="sessions"
  @slice-click="open"
/>
<SankeyChart
  :data="rows"
  source="from"
  target="to"
  value="amount"
  @link-click="open"
/>

<!-- After -->
<BarChart :data="rows" x="warehouse" :y="['picked']" @select="open" />
<DonutChart :data="rows" category="channel" value="sessions" @select="open" />
<SankeyChart
  :data="rows"
  source="from"
  target="to"
  value="amount"
  @select="open"
/>
```

`select` also fires on Enter and Space over the plot's keyboard cursor. That is
why the old names had to go: they described the mouse, not the behavior.

Grep for `datapoint-click`, `slice-click`, `stage-click`, `cell-click`,
`link-click` and `point-click`, and for the camelCase spellings in render
functions and `h()` props.

### Numbers follow the page's language

Charts used to print every number in `en-US`, whatever language the page was
in. They now read `<html lang>`, the same attribute `dir` already reads.

**Silent break:** nothing errors; the grouping and decimal marks just change.

- A page with no `lang`, or a malformed one, prints exactly what it printed
  before.
- A page that declares `de-DE` gets `1.234,5` where it used to get `1,234.5`.
- A page that changes `lang` after a chart mounts reprints the chart.

If a chart must stay in one locale whatever the page says, pass your own
`format`. The axis, the tooltip and the labels all use it.

Numbers only. Dates and time-axis labels still print in English, whatever the
page declares. Pass `xAxis.format` to print them in another language.

### `FunnelChart` always prints its percentages

`showPercentages` is removed. A funnel always printed its counts, so turning the
prop off removed the conversion rate and showed nothing in its place.

**Silent break**, because the prop defaulted to `true`: Vue passes the unknown
prop through as an attribute, and the percentages come back.

```vue
<!-- Before: counts only -->
<FunnelChart
  :data="rows"
  category="stage"
  value="count"
  :show-percentages="false"
/>

<!-- After: counts and conversion rates, always -->
<FunnelChart :data="rows" category="stage" value="count" />
```

Grep for `show-percentages` and `showPercentages`.

### `DonutSliceEvent.name` is the slice's identity

`@select` on `DonutChart` used to pass the printed slice name as `name`. It now
passes the slice's identity, and the printed text moves to `label`.

**Silent break.** Both are strings, so a handler that used `name` type-checks
and keeps running, but on a different value:

- the collapsed tail is `__others__` (the exported `OTHERS_KEY`)
- a label that a second row repeats is made unique as `"A (2)"`

A slice whose label is unique and not collapsed passes the same value as
before.

```ts
// Before: name carried what the slice printed
function open(slice: DonutSliceEvent) {
  showTitle(slice.name)
}

// After: label prints, name identifies
function open(slice: DonutSliceEvent) {
  showTitle(slice.label)
}
```

Grep for `@select` handlers on `DonutChart` and check what they do with
`.name`.

### A sparkline `type: 'line'` draws the stroke alone

**Silent break.** `NumberCardSparkline.type` still accepts `'line'`, so a card
that uses it compiles unchanged, but draws something else. The old `'line'` was
a stroke over a fill, which the family calls an area. `'line'` is now the
stroke alone. For the old drawing, use `'area'`, or drop the key: `'area'` is
the default.

Grep for `sparkline` objects with `type: 'line'`.

### A value that does not plot is dropped

One rule for the whole family. **Silent break** for every part of it:

- A funnel stage whose count is missing, unreadable or negative is dropped
  instead of drawn at 0. So `FunnelStage.index` and the conversion rates count
  only the stages that remain.
- A row whose x cannot be read as a date is dropped from a `time` axis, and the
  rows are sorted by time.
- Bar, line and area charts draw the empty state where they used to draw bare
  axes, when no visible series has a number at any row.
- `select` no longer fires on Enter for a cell where the plot drew no mark.

Grep for `FunnelChart` data that can have a blank or negative value, and for
`#empty` slots on bar, line and area charts. Those slots now render for a `y`
key that no row has.

### The grouping column is `splitBy`

`series` named the column that splits long data into one series per value. It
is now `splitBy`, the name Insights already stores it under. "series" now only
means a drawn series: what `seriesConfig`, `hiddenSeries` and `maxSeries` are
keyed by.

**Silent break** in a plain template: Vue passes the unknown prop through as an
attribute, and the chart draws one series over every row.

```vue
<!-- Before -->
<BarChart :data="rows" x="week" y="tickets" series="priority" stacked />

<!-- After -->
<BarChart :data="rows" x="week" y="tickets" split-by="priority" stacked />
```

`ScatterChart` renames the same prop. Grep for `series=` and `:series=`, and for
`series:` in a saved chart object.

### Chart-level looks default every series

**Additive.** `showDataLabels` was already a chart prop that a `seriesConfig`
entry could override. `smooth`, `showDataPoints` and `dashed` now work the same
way. `connectNulls`, already a chart prop, is now also accepted in
`seriesConfig`, like the other four. Nothing that ran before draws differently;
the chart-level keys are additive.

```vue
<!-- Before: one entry per series, and no way to reach a splitBy series -->
<LineChart
  :data="rows"
  x="month"
  :y="['plan', 'actual']"
  :series-config="{ plan: { smooth: true }, actual: { smooth: true } }"
/>

<!-- After -->
<LineChart :data="rows" x="month" :y="['plan', 'actual']" smooth />
```

### The second value axis is a column prop

`seriesConfig[key].axis: 'y2'` is removed. `y2` names the columns measured
against the second axis, so the three column props pair with the three axis
options: `x`/`xAxis`, `y`/`yAxis`, `y2`/`y2Axis`.

Move each column out of `y` and into `y2`. The series still draw, and take
their palette colors in `y` order and then `y2` order. So a chart that listed
its y2 columns last keeps every color.

```vue
<!-- Before -->
<BarChart
  :data="rows"
  x="quarter"
  :y="['revenue', 'expenses', 'margin']"
  :series-config="{ margin: { type: 'line', axis: 'y2' } }"
/>

<!-- After -->
<BarChart
  :data="rows"
  x="quarter"
  :y="['revenue', 'expenses']"
  y2="margin"
  :series-config="{ margin: { type: 'line' } }"
/>
```

- `splitBy` splits `y` only. So a `y2` column draws as one unsplit series next
  to the series that `splitBy` produced, and `maxSeries` limits only those.
- A long-data series can no longer be moved to the second axis, because it has
  no column to name.
- A horizontal bar chart ignores `y2`, as it ignored `axis: 'y2'`.

`ReferenceLine.axis` is unchanged: it still takes `'y'`, `'y2'` and `'x'`.

### `DonutChart` hides slices, not series

`v-model:hiddenSeries` on a donut is now `v-model:hiddenSlices`, and the emit
is renamed with it.

**Silent break** in a plain template: Vue passes the unknown prop through as an
attribute, and the handler for the old emit never fires. So the app's list
stops following the legend.

```vue
<!-- Before -->
<DonutChart
  :data="rows"
  category="channel"
  value="sessions"
  v-model:hidden-series="hidden"
/>

<!-- After -->
<DonutChart
  :data="rows"
  category="channel"
  value="sessions"
  v-model:hidden-slices="hidden"
/>
```

`DonutChart` only. The axis charts and `ScatterChart` keep `hiddenSeries`, and
`ChartLegend` is unchanged. Grep for `hidden-series` and `hiddenSeries` on
`DonutChart`.

### The loud ones

**Loud break** for everything in this list: the build or the type-check reports
it.

- `ChartTheme` is `ChartTokens`, and `useChartTheme` is `useChartTokens`, which
  returns `{ tokens }` instead of `{ theme }`. `ChartTokens.splitLine` is
  `gridline`, after the `--chart-gridline` variable it reads.
- The `ColorScheme` type that this subpath exported is removed, and so is its
  replacement here. Import `ResolvedColorScheme` from the package root.
- `formatValue`, `formatDate`, `formatLabel`, `formatPercent`,
  `formatAxisValue`, `currentColorScheme`, `resolveChartTheme` and
  `OTHERS_LABEL` are no longer exported. `OTHERS_KEY` stays.
- `showValues` on `HeatmapChart` and `showInlineLabels` on `DonutChart` are both
  `showDataLabels`. Axis charts take it at the chart level too, so one prop
  replaces one `seriesConfig` entry per series.
- `ChartTooltipItem.kind` is required, and `'column'` is now `'context'`. An
  item built by hand needs `kind: 'series'`.
- The `#tooltip` slot passes `rows`, a list, instead of `row`, on every chart.
  Read `rows[0]` where you read `row`. `FunnelChart`'s `stage` slot prop is
  removed: its `percentOfFirst` and `percentOfPrevious` are items named
  `ofFirst` and `ofPrevious`. `ChartTooltip` takes `rows` as a prop too.
- `DonutChart`'s `#center` slot passes
  `{ label, value, formattedValue, percent }`. `value` and `percent` are numbers
  now. Print `formattedValue` where you printed `value`.
- `NumberCardSparklineType` is removed. `NumberCardSparkline.type` takes a
  `ChartMark`.
- `ChartDatapointEvent.dataIndex` and `FunnelStageEvent.index` are removed. Read
  the row, which every event carries.
- `seriesName` is `name` on `ChartDatapointEvent` and `ScatterPointEvent`, the
  same as every other payload. `FunnelStageEvent` carries a `name` as well: the
  category value behind the printed `label`.
- `ChartExposed.chart` is `ECharts | undefined`, not
  `ComputedRef<ECharts | undefined>`. The runtime is unchanged (Vue always
  unwrapped the computed), so only code that named the old type needs a change.
  `plot.value?.chart?.getDataURL(...)` reads the same as before.
- `ChartContainer`'s `plotLabel` is `yAxisTitle`, `plotLabelSecondary` is
  `y2AxisTitle`, and `plotLabelPlacement` is `axisTitlePlacement`. The
  `PlotLabelPlacement` type is now `AxisTitlePlacement`. These props set the
  titles of the value axes, which every chart names `yAxis.title` and
  `y2Axis.title`. Only a hand-composed `ChartContainer` passes them; the
  built-in charts set them from those props.
- `SeriesStyle.lineWidth` is removed. Every line draws at the library's own
  width. `seriesConfig[key].echartOptions = { lineStyle: { width: 3 } }` sets a
  different one.
- `fillOpacity` is removed, both chart-level and per-series. The library's fill
  rules stay: a free area fades out towards the axis, and a banded one is solid.
  `seriesConfig[key].echartOptions = { areaStyle: { opacity: 0.25 } }` sets an
  opacity on one series.
- `seriesConfig[key].lineType` is `dashed?: boolean`. `lineType: 'dashed'` is
  `dashed: true`, and `'dotted'` has no replacement: a dotted line would draw
  the gridlines' own pattern on a mark. A dashed series now uses the same dash
  as the reference lines.
- `SankeyChart`'s `orient` is `vertical`, a boolean, and the `SankeyOrient` type
  is no longer exported. `orient="vertical"` is `vertical`, and
  `orient="horizontal"` is the default. `nodeAlign` is unchanged.
- `paletteColors(name, tokens, count)` is
  `paletteColors(palette, tokens, count, fallback?)`. The first argument now
  takes what the `palette` prop takes: a ramp name, an explicit list of colors,
  or nothing. `fallback` names the ramp to use when it is nothing, and defaults
  to `'sequential'`. A call that passes a ramp name is unchanged.
- `NumberCard`'s `precision` and `compact` are removed. Pass `format`, and
  `deltaFormat` for the delta: `:compact="true"` becomes
  `:format="(v) => Intl.NumberFormat(undefined, { notation: 'compact' }).format(v)"`
  and `:precision="1"` becomes `:format="(v) => v.toFixed(1)"`.

## Data fetching (useDoctype / useList)

The write methods on `useDoctype` (`insert`, `delete`, `setValue`,
`runDocMethod`, `runMethod`) and on `useList` (`insert`, `setValue`, `delete`)
used to share one request between all their submits. Each submit now sends its
own request, so the members of the shared request are removed.

| Before                                              | After                        |
| --------------------------------------------------- | ---------------------------- |
| `delete.loading && delete.params.name === row.name` | `delete.isLoading(row.name)` |
| `setValue.params.name`                              | `setValue.isLoading(name)`   |
| `delete.execute()` / `.fetch()` / `.reload()`       | `delete.submit({ name })`    |
| `insert.reset()` / `.abort()`                       | removed, no replacement      |
| `runMethod.isFetching` / `.isFinished`              | `runMethod.loading`          |
| `setValue.promise`                                  | `await setValue.submit(...)` |
| `delete.url`                                        | removed, no replacement      |

Nothing fails to build, so grep for these by hand. There are two ways this
fails:

- **Runtime error.** Calling a removed method throws (`delete.execute()`,
  `insert.reset()`), and so does reading a property of one
  (`delete.params.name`).
- **Silent break.** A removed _data_ member reads as `undefined`.
  `runMethod.isFetching` is always falsy, so a spinner never shows and nothing
  says why.

### The five members every write method has

All eight write methods now have the same five members: `submit()`, `data`,
`error`, `loading` and `isLoading()`.

`isLoading()` takes whatever identifies one submit:

```js
todos.delete.isLoading(row.name)
todos.setValue.isLoading(row.name)
todos.runDocMethod.isLoading(row.name, 'archive')
todos.runMethod.isLoading('sync_all')
todos.insert.isLoading() // no argument: a new row has no name yet
```

`insert.isLoading()` gives the same answer as `insert.loading`. It exists so
that every write method reads the same way.

### Behavior changes you will not see at build time

- **`submit()` resolves with its own response.** Code that sent two submits and
  read the result of the first was getting the second one's data, or `null`. If
  you queued submits to work around that, you can remove the queue.
- **`data` and `error` belong to the submit that started last**, not the one
  that answered last. A slow submit that comes back after a newer one writes
  nothing and clears nothing. It still answers its own caller with its own
  result: it resolves with its response, or rejects with its error.
- **Silent break: `data` is no longer reset to `null` when a submit fails.** It
  used to be, because the shared request cleared it on any not-ok response. It
  now keeps the last successful response.

  ```js
  await todos.setValue.submit({ name: 'TODO-1', status: 'Done' })
  await todos.setValue.submit({ name: 'TODO-2', status: 'Done' }) // fails

  todos.setValue.data // still the TODO-1 response
  todos.setValue.error // the failure
  ```

  Test `error`, not `data`, to tell a failed submit from a successful one.
  `if (!todos.setValue.data)` used to mean "the last save failed". It no longer
  does.

- **`error` is no longer cleared when a submit starts.** It used to be, which
  erased the error of another submit that was still running. It now stays until
  the newest submit finishes. To hide an error banner while a retry runs, hide
  it on `loading` yourself.
- **Silent break: `submit()` rejects on any failure.** It resolves with the
  response, or rejects with the error. A failed `validate` already rejected; a
  failed request used to resolve with `null`. Both reject now.

  ```js
  // Before
  const doc = await todos.insert.submit({ title: 'Buy milk' })
  if (!doc) return showError(todos.insert.error)

  // After
  try {
    const doc = await todos.insert.submit({ title: 'Buy milk' })
  } catch (e) {
    showError(e)
  }
  ```

  `null` no longer means "it failed". A server that answers with `null` resolves
  with `null`, like any other response. Every `if (!result)` check after a
  `submit()` must become a `try` / `catch` or a `.catch()`. An unawaited
  `submit()` now needs a `.catch()`, or it becomes an unhandled rejection.

- **`useList`'s `insert` and `delete` now send to the `baseUrl`** you passed to
  `useList`. They used to ignore it and call the current origin. `setValue`
  already used it, so all three write methods now agree. `useDoctype` was never
  affected.
- **A stale `setValue` or `delete` on the same row no longer writes** the shared
  document and list stores, and no longer triggers `useList`'s automatic
  refetch. Every request carries a dispatch number, and a store rejects a write
  when a request dispatched later has already written. Submits with different
  keys, and submits with no key such as inserts, stay independent, and all of
  their hooks still fire. Nothing to change; this is listed so you can remove
  your workarounds.

### `useDoc` writes and `useNewDoc`

`useDoc`'s `setValue`, `delete` and every `methods:` entry, and all of
`useNewDoc`, also shared one request. Each submit now sends its own request.
They keep the full `useCall` members and types, so there is nothing to rename.

**Silent break: a second submit no longer cancels the first.** Both requests
reach the server. If you relied on the cancel to drop an older save, debounce
or guard the call site yourself.

`data` and `error` follow the same "newest submit wins" rule as `useDoctype`
above. `loading` stays `true` until every submit finishes.

## Data fetching: writes reject, reads resolve {#data-fetching-writes-reject}

One rule now covers every composable: **a write rejects when it fails, a read
resolves.** A failed write must not let its caller run the success path. A
failed read keeps the last value on screen and reports the failure through
`error`.

| Call                                                     | Before               | After                |
| -------------------------------------------------------- | -------------------- | -------------------- |
| `useCall` `submit()`                                     | resolved with `null` | rejects              |
| `useDoc` `setValue.submit()`, `delete.submit()`          | resolved with `null` | rejects              |
| a `useDoc` `methods:` member's `submit()`                | resolved with `null` | rejects              |
| `execute()` / `fetch()` / `reload()` in every composable | resolved             | resolves (no change) |

`useDoctype` and `useList` write methods follow the same rule. In v0 they also
resolved with `null` when the request failed; see
[the section above](#data-fetching-usedoctype-uselist).

**Silent break.** Nothing fails to build. The success path just stops running,
and an unawaited `submit()` becomes an unhandled rejection.

```js
// Before: the failure fell through to the success path
const doc = await todo.setValue.submit({ status: 'Closed' })
if (!doc) return showError(todo.setValue.error)
toast.success('Saved')

// After
try {
  await todo.setValue.submit({ status: 'Closed' })
  toast.success('Saved')
} catch (error) {
  showError(error)
}
```

Grep for `.submit(` and check each site. Three patterns need work:

- `if (!result)` after a `submit()`: `null` is now a valid response, not a
  failure. Move the handling into a `catch`.
- a `submit()` that is not awaited: add `.catch(...)`, or it reaches
  `window.onunhandledrejection`.
- a `submit()` inside a `Promise.all`: one rejection now fails the whole batch.
  Use `Promise.allSettled` if that is not what you want.

`error` and `onError` are unchanged: both still fire, whether the call rejects
or not. Reads need no change.

### `useDoc` method names cannot shadow the object's own members

A `methods:` key that is already a member of what `useDoc` returns (`doc`,
`error`, `loading`, `reload`, `setValue`, `delete`, and the rest) used to
overwrite that member without an error. **Loud break:** it now throws at setup
and names the collision. Rename the key and keep the server method name:

```js
// Before: `reload` silently replaced the document's own reload()
useDoc({ doctype: 'ToDo', name, methods: { reload: 'reload_items' } })

// After
useDoc({
  doctype: 'ToDo',
  name,
  methods: { reloadItems: { name: 'reload_items' } },
})
```

### `useNewDoc` and `useDoc` methods take fewer options

An insert and a document method are writes that run when you call `submit()`.
`immediate` and `refetch` are fixed to `false` for both. `useNewDoc` no longer
accepts `refetch`, `cacheKey` or `staleOnError` at all.

**Silent break in JavaScript, loud in TypeScript.** In JavaScript the values are
now ignored. `refetch: true` was the dangerous one: it sent the insert again on
every keystroke in the form bound to `doc`.

```js
// Before: an insert per edit to the draft
const draft = useNewDoc('ToDo', { description: '' }, { refetch: true })

// After
const draft = useNewDoc('ToDo', { description: '' })
await draft.submit()
```

## Data fetching (exports)

Some data-fetching exports are removed or renamed, and a few error types are
now exported.

| Before                                   | After                       |
| ---------------------------------------- | --------------------------- |
| `useFrappeFetch('/api/v2/method/…')`     | `useCall({ url })`          |
| `useFrappeFetch('/api/v2/document/…')`   | `useDoc({ doctype, name })` |
| `useFrappeFetch('/api/v2/document/…?…')` | `useList({ doctype, … })`   |
| `FrappeRequestError` (v1 betas)          | `FrappeResourceError`       |
| `FrappeUIError`                          | `InputLabelingProps['error']` |
| `isPrivateUpload`, `UploadPrivacy`       | removed; pass `private`     |

### `useFrappeFetch` is no longer exported

**Loud break:** the import fails at build time, so nothing changes without an
error.

`useFrappeFetch` is the raw `createFetch` instance that `useCall`, `useDoc` and
`useList` are built on. It sets the Frappe headers and parses the response, and
leaves the URL, the params and the caching to you. Pick the composable that
matches what you are fetching (see the table above).

```js
// Before
import { useFrappeFetch } from 'frappe-ui'
const { data } = useFrappeFetch('/api/v2/method/ping').get()

// After
import { useCall } from 'frappe-ui'
const ping = useCall({ url: '/api/v2/method/ping' })
```

### `FrappeResponseError` is exported

**Additive.** A Frappe error response raises `FrappeResponseError`. It is set
on `.error`, and the write methods above reject with it. The class was never
exported before, so you could not tell it apart from a network or parse failure.
Narrow it with `instanceof` to get `title`, `type`, `indicator` and
`exception`:

```ts
import { FrappeResponseError } from 'frappe-ui'

try {
  await todos.insert.submit({ title: 'Buy milk' })
} catch (e) {
  if (e instanceof FrappeResponseError) {
    showError(e.title, e.type)
  } else {
    throw e
  }
}
```

### `FrappeRequestError` is `FrappeResourceError` {#errors-renamed}

The error type that the resource layer raises is renamed. Both errors in the
library are server responses, so "request" versus "response" did not tell them
apart. The name now says which layer raises it. Only apps on a v1 beta are
affected: v0 never exported either name.

| Before                | After                 | Raised by                                                            |
| --------------------- | --------------------- | -------------------------------------------------------------------- |
| `FrappeRequestError`  | `FrappeResourceError` | `call`, `frappeRequest`, `createResource` and the other v1 resources |
| `FrappeResponseError` | `FrappeResponseError` | `useCall`, `useDoc`, `useList`, `useDoctype`, `useNewDoc`            |

`FrappeResponseError` does not change. The fields on both are the same as
before. **Loud break:** there is no alias, so importing the old name fails the
build.

```ts
// Before
import type { FrappeRequestError } from 'frappe-ui'

// After
import type { FrappeResourceError } from 'frappe-ui'
```

The two are narrowed differently, and that does not change either.
`FrappeResponseError` is a class, so `instanceof` works. `FrappeResourceError`
is a type over a plain `new Error(...)` with fields assigned, so there is no
value to test against. Read the field you need:

```ts
try {
  await call('frappe.client.get_list', { doctype: 'ToDo' })
} catch (error) {
  const e = error as FrappeResourceError
  if (e.exc_type === 'PermissionError') showPermissionMessage()
  else throw error
}
```

### `FrappeUIError` is removed

**Loud break.** The exported error type for an input's `error` prop is removed.
The prop is typed where it is declared. A wrapper that forwards it reads the
type from `InputLabelingProps`, which the root now exports.

```ts
// Before
import type { FrappeUIError } from 'frappe-ui'
defineProps<{ error?: string | FrappeUIError }>()

// After
import type { InputLabelingProps } from 'frappe-ui'
defineProps<{ error?: InputLabelingProps['error'] }>()
```

**Additive:** the prop also accepts a `string[]` now, which is what
`ErrorMessage.message` takes. An array renders one line per entry, and an empty
array means no error. Everything that worked before still works: a string, or
an `Error` that may carry `messages`.

### Upload exports

**Additive:** `UploadError` is exported. Every upload failure rejects with it,
and `useFileUpload`'s `state.error` holds it. See
[FileUploader](#uploads-reject-an-uploaderror).

**Loud break:** `isPrivateUpload` and the `UploadPrivacy` type are removed.
They existed for the `is_private` upload option, which is removed; pass
`private` instead. The import fails at build time. No app used either name.

### A destination prop is typed `RouteDestination`

Every prop that takes a router destination (`Button.route`, the Sidebar, Tabs,
Breadcrumbs and Menu item types, and the rest) is typed `RouteDestination`
instead of vue-router's `RouteLocationRaw`. The root exports `RouteDestination`
and `RouteLocationObject`.

The accepted values do not change: a path string, or an object with `name` /
`params` / `path` / `query` / `hash`. frappe-ui has its own type so that the
generated API docs show a readable name instead of vue-router's minified
internal names.

### Resource and editor barrels name their exports

`frappe-ui/resources` and `frappe-ui/editor` used `export *` from their
implementation files, which published every name those files exported. Both now
list what they publish. The names that apps import are all still there.

**Loud break:** an import of an internal helper that was never meant to be
public fails at build time.

## HTTP transport and the `FrappeUI` plugin

v1 has one HTTP path: `frappeRequest`. `call` is a thin wrapper over it for the
common case, "POST to a whitelisted method". `request`, `createCall` and
`initSocket` are removed, and `app.use(FrappeUI)` now has a single option.

| Before                          | After                                        |
| ------------------------------- | -------------------------------------------- |
| `import { request }`            | `import { frappeRequest }`                   |
| `createCall(options)`           | wrap `call` yourself, or use `frappeRequest` |
| `import { initSocket }`         | your own `io(...)` connection                |
| `app.use(FrappeUI, { config })` | `setConfig(key, value)` per entry            |
| `app.use(FrappeUI, { call })`   | `import { call }` where you need it          |
| `this.$resources` (implicit)    | `app.use(FrappeUI, { resources: true })`     |

**Loud break** for the first three rows: they are build failures, and your
bundler or type-check names them.

**Loud break at runtime** for the last three rows, not at build time: a
dropped `config` is applied nowhere (the plugin warns in development), and
reading `this.$call` or `this.$resources` throws with the fix in the message.

### `request` → `frappeRequest`

**Silent break.** `frappeRequest` is not a drop-in replacement for `request`.
The shape you get back changes with no error. Check three things at each call
site you change:

- The method defaults to `POST`, not `GET`.
- A URL that is not a path is prefixed with `/api/method/`.
- It resolves with the response body's `message`, not the whole body.

### `call` now honours `setConfig`

**Behavior change.** `call` built its own `fetch` and never read the config. So
`requestBaseUrl` and `requestHeaders` were ignored on every `call()`, while
`frappeRequest` respected them. This is fixed. A `call` in an app that sets
either one now behaves differently, usually the way you assumed it already did.
Check two side effects:

- If you set `requestBaseUrl` for local development against a remote site,
  `call` now goes to the remote site too, with `credentials: 'include'`.
- If you set `serverMessagesHandler`, `_server_messages` returned by a `call`
  now reach it. Before, only `frappeRequest` and the resources sent messages to
  it, so expect toasts from paths that used to show nothing.

`call`'s signature, the value it resolves to, and the
`{ response, status, error }` object passed to `onError` are all unchanged.

### The plugin's `config` option is gone

```js
// Before
app.use(FrappeUI, {
  config: {
    resourceFetcher: frappeRequest,
    defaultListUrl: 'gameplan.extends.client.get_list',
    systemTimezone: window.system_timezone || null,
  },
})

// After
setConfig('resourceFetcher', frappeRequest)
setConfig('defaultListUrl', 'gameplan.extends.client.get_list')
setConfig('systemTimezone', window.system_timezone || null)
app.use(FrappeUI)
```

If your `main.js` is plain JavaScript, passing a removed option is not a type
error. So the plugin logs a development-mode warning that names the option it
ignored.

`setConfig` accepts only keys of `FrappeUIConfig`. If you were passing a key
that is not one, it was never read, and you can delete it.

### `$resources` is opt-in

The plugin used to install the v1 resources Options API mixin by default. So
`this.$resources`, `$getResource`, `$getDocumentResource`, `$getDoc`,
`$getListResource` and `$refetchResource` existed in any app that called
`app.use(FrappeUI)`. It now installs only when you ask for it:

```js
app.use(FrappeUI, { resources: true })
```

`resources` is a boolean. It used to be typed as an object of resource
definitions, but the plugin never read what was in it, only whether it was set.
Passing an object is now a type error. It still installs the mixin at runtime,
so nothing breaks while you fix it:

```js
// Before
app.use(FrappeUI, { resources: { todos: { url: '…' } } })

// After
app.use(FrappeUI, { resources: true })
```

**Codemod:** `npx -p frappe-ui data-v1 ./src` makes that edit. It rewrites only
an object literal written inline at the `app.use(FrappeUI, …)` call. It reports
any site it will not touch (a spread, a computed key, a variable) instead of
guessing.

Nothing changes for Composition API code: `createResource`,
`createListResource` and `createDocumentResource` never went through the plugin.
You need the option only if you declare a `resources: { … }` block in a
component's options.

**The error tells you the fix.** A component that declares `resources` without
the option throws on creation, and the error names the component and the fix.
Vue sends that throw through its own error handling, which rethrows in
development and only logs in production. So the read is guarded too: reading
`this.$resources` throws at the access in every build, directly in your own
code.

`resourcesPlugin` is still exported if you prefer to install it directly.

### `initSocket` is gone

It was a nine-line `io()` wrapper, and the plugin created one by default. So
apps that also built their own socket held two live connections per page load.
If you relied on the `$socket` global that the plugin set, create the connection
yourself:

```js
import { io } from 'socket.io-client'

const host = window.location.hostname
const port = window.location.port ? ':9000' : ''
const protocol = port ? 'http' : 'https'
const siteName = import.meta.env.DEV ? host : window.site_name

app.config.globalProperties.$socket = io(
  `${protocol}://${host}${port}/${siteName}`,
  { withCredentials: true },
)
```

Until you do, reading `this.$socket` throws with that instruction, instead of
returning `undefined` and crashing in the next realtime handler that reads it.
Assigning your own `$socket` replaces the guard.

The same applies to `$call`, the other global that the plugin used to install.
Import `call` from `frappe-ui` instead.

## useCall: a throwing `beforeSubmit` now cancels the submit

| Before                                           | After                                                  |
| ------------------------------------------------ | ------------------------------------------------------ |
| a throwing `beforeSubmit` is logged; request sent | the throw propagates; request not sent; `submit()` rejects |
| `beforeSubmit: () => void`                       | `beforeSubmit: () => void \| Promise<void>`            |

Before, a `beforeSubmit` hook that threw was caught and logged, and the request
was **sent anyway**. Now the throw propagates: the request is not sent, and
`submit()` rejects with the hook's error.

**Silent break.** If one of your `beforeSubmit` hooks can throw, the submit that
it used to let through now stops. To keep the old behavior, either handle the
rejection at the call site, or make the hook not throw. A hook that returns
normally is not affected; it still cannot stop the request.

`beforeSubmit` may now be async (`() => void | Promise<void>`). It was always
awaited; only the type said otherwise.

`error` is not changed by a cancelled submit. The throw reaches you only through
the rejected `submit()`, so `error` still holds the last _request's_ error. An
app that shows failures from `error` alone shows nothing when a hook cancels.

This covers every place that accepts `beforeSubmit`: `useCall`, `useNewDoc`,
and each entry in `useDoc`'s `methods:`.

## Composables and directives renamed

Three groups of root exports are renamed. **Loud break** for all of them: the
import fails, so the build lists every call site. But `useTheme` also has a
silent part; read that one first.

| Before                                  | After                                      |
| --------------------------------------- | ------------------------------------------ |
| `useTheme()`                            | `useColorScheme()`                         |
| `useScrollContainer()` (nine members)   | `shellScrollContainer`, `useShellScrolled` |
| `focusDirective`                        | `vFocus`                                   |
| `onOutsideClickDirective`               | `vOnOutsideClick`                          |
| `visibilityDirective`                   | removed, no replacement                    |

### `useTheme` → `useColorScheme`

`theme` means color tone everywhere else in the library (`theme="blue"` on a
Button). So the light/dark composable no longer uses that word.

| Before              | After                                           |
| ------------------- | ----------------------------------------------- |
| `useTheme()`        | `useColorScheme()`                              |
| `Theme` type        | `ColorScheme` type                              |
| `currentTheme`      | `colorScheme` — read-only                       |
| `setTheme(t)`       | `setColorScheme(t)`                             |
| `toggleTheme()`     | `toggleColorScheme()`                           |
| `getSystemTheme()`  | `useColorScheme().resolvedColorScheme` — a ref  |
| `initializeTheme()` | removed — `useColorScheme()` initializes itself |

**Silent break: `colorScheme` is read-only.** The ref held only one of three
places where the state lives. The `data-theme` attribute and the `theme` key in
`localStorage` are the other two. Assigning to the old writable ref changed the
ref but not the document or the stored value, so the app got out of sync with
no error.

```js
// Before — moved the ref, desynced the page
const { currentTheme } = useTheme()
currentTheme.value = 'dark'

// After
const { setColorScheme } = useColorScheme()
setColorScheme('dark')
```

The `data-theme` attribute and the `theme` localStorage key keep their names,
so app CSS that targets `[data-theme='dark']` and saved user preferences still
work.

See also [Color scheme: `resolvedColorScheme` is a
ref](#resolved-color-scheme).

### Scroll container: nine members become two

`useScrollContainer` published nine members for the two things apps do: read
the shell's scroll element, and know whether it has been scrolled.

| Before                                                  | After                                     |
| ------------------------------------------------------- | ----------------------------------------- |
| `activeScrollContainer`                                 | `shellScrollContainer`                    |
| `getScrollContainer()`                                  | `shellScrollContainer.value`              |
| `useScrollContainer().isScrolled`                       | `useShellScrolled({ threshold })`         |
| `scrollTo(options)` / `scrollToTop()`                   | call them on `shellScrollContainer.value` |
| `registerScrollContainer` / `unregisterScrollContainer` | removed — internal to the two shells      |
| `UseScrollContainer` / `UseScrollContainerOptions`      | removed                                   |

`useShellScrolled()` returns the boolean ref directly, not an object:

```js
// Before
const { isScrolled } = useScrollContainer({ threshold: 12 })

// After
const isScrolled = useShellScrolled({ threshold: 12 })
```

The `shell` prefix matters: both work only while a `DesktopShell` or a
`MobileShell` is mounted. Without one, `useShellScrolled` stays `false` and
warns once in development.

See also [`useShellScrolled` needs a
`threshold`](#useshellscrolled-threshold).

### Directives: `vFocus` and `vOnOutsideClick`

`<script setup>` registers a directive automatically only when the imported
name is spelled `vFoo`. So the old names had to be renamed on import at every
call site.

| Before                    | After                   |
| ------------------------- | ----------------------- |
| `focusDirective`          | `vFocus`                |
| `onOutsideClickDirective` | `vOnOutsideClick`       |
| `visibilityDirective`     | removed, no replacement |

```vue
<!-- Before -->
<script setup>
import { onOutsideClickDirective as vOnOutsideClick } from 'frappe-ui'
</script>

<!-- After -->
<script setup>
import { vOnOutsideClick } from 'frappe-ui'
</script>
```

## Color scheme: `resolvedColorScheme` is a ref {#resolved-color-scheme}

| Before                                          | After                                                 |
| ----------------------------------------------- | ----------------------------------------------------- |
| `import { resolvedColorScheme } from 'frappe-ui'` (a function) | `useColorScheme().resolvedColorScheme` (a read-only ref) |
| `MutationObserver` on `data-theme`              | not needed; the ref updates itself                    |
| —                                               | `useResolvedColorScheme()` (read only, writes nothing) |
| `toggleColorScheme()` reads the stored preference | reads the resolved value                            |

**Loud break:** `import { resolvedColorScheme } from 'frappe-ui'` fails. The same
name is now a read-only ref on `useColorScheme()`, so there is no call to make.
**No codemod** can do this one, because a call has to become a `.value` read.

```js
// Before
import { resolvedColorScheme } from 'frappe-ui'
const scheme = ref(resolvedColorScheme())
const observer = new MutationObserver(() => {
  scheme.value = resolvedColorScheme()
})
observer.observe(document.documentElement, { attributeFilter: ['data-theme'] })

// After
import { useColorScheme } from 'frappe-ui'
const { resolvedColorScheme } = useColorScheme()
// resolvedColorScheme.value is 'light' or 'dark'
```

Remove the observer too. The ref follows `setColorScheme`, and follows the OS
setting while the preference is `system`. That is what the observer was
watching for. `ColorScheme` and `ResolvedColorScheme` stay exported.

The function was renamed from `resolvedColorScheme` to
`getResolvedColorScheme` internally. It is no longer part of the package's
public exports at all.

### When the page does not own `data-theme`

Call `useResolvedColorScheme()` instead when the page you are migrating does not
own `data-theme`: an app that applies its own theme before paint, or a page
inside a host shell. It gives the same value and writes nothing.
`useColorScheme()`, in contrast, applies the saved preference on its first call,
and would become a second writer of the attribute.

```js
import { useResolvedColorScheme } from 'frappe-ui'
const scheme = useResolvedColorScheme()
// scheme.value is 'light' or 'dark'
```

### `toggleColorScheme()` moves off what is on screen {#toggle-color-scheme}

**Behavior change.** `toggleColorScheme()` used to read the stored preference.
Under `system` on a dark OS it wrote `dark`, which the page was already showing,
so the first press did nothing visible. It now reads the resolved value, so one
press always changes the scheme: `system` on a dark OS goes to `light`.

Apps that wrote their own toggle for this reason can remove it.

## pageMetaPlugin (removed)

`pageMetaPlugin` and the global mixin it installed are removed.

| Before                                   | After                                                |
| ---------------------------------------- | ---------------------------------------------------- |
| `app.use(pageMetaPlugin)`                | delete — nothing to install                          |
| `pageMeta() { return { title, emoji } }` | `usePageMeta(() => ({ title, emoji }))` in `setup()` |

**Silent break.** A `pageMeta()` component option still compiles, because it is
a plain object key that nothing reads. But nothing calls it anymore, so
`document.title` and the favicon stop updating. There is no error and no
warning; the page just stops updating its title.

```vue
<!-- Before -->
<script>
export default {
  pageMeta() {
    return { title: this.pageTitle, emoji: '🌈' }
  },
}
</script>

<!-- After -->
<script setup>
import { usePageMeta } from 'frappe-ui'

usePageMeta(() => ({ title: pageTitle.value, emoji: '🌈' }))
</script>
```

`usePageMeta` works the same way everywhere. See the
[composables page](./other/composables#usepagemeta).

## ListView — moved to `frappe-ui/experimental`

**Loud break:** the import fails at the root. Change the import path. Nothing
about the component itself changed.

`ListView` is not part of the core v1 API. It moves out of the root export to
`frappe-ui/experimental`, which has no stability promise. It stays there until
`frappe-ui/list` does everything `ListView` does.

```ts
// Before
import { ListView, ListRow, ListHeader } from 'frappe-ui'

// After
import { ListView, ListRow, ListHeader } from 'frappe-ui/experimental'
```

Every other name in the family moves the same way: `List`, `ListEmptyState`,
`ListFooter`, `ListGroupHeader`, `ListGroupRows`, `ListGroups`,
`ListHeaderItem`, `ListRowItem`, `ListRows`, `ListSelectBanner`.

## Calendar — moved to `frappe-ui/experimental`

**Loud break:** the import fails at the root. Change the import path. Nothing
about the component itself changed.

`Calendar` is not part of the core v1 API. It moves out of the root export to
`frappe-ui/experimental`, which has no stability promise. It stays there, with
the same API, until a redesigned calendar family replaces it.

```ts
// Before
import { Calendar, CalendarColorMap } from 'frappe-ui'

// After
import { Calendar, CalendarColorMap } from 'frappe-ui/experimental'
```

Every other name in the family moves the same way: `CalendarActiveEvent` and the
types `CalendarActions`, `CalendarCellClickData`, `CalendarConfig`,
`CalendarEvent`, `CalendarMode`, `CalendarPublicProps`, `CalendarTimeFormat`,
`GroupedCalendarEvents`.

## Charts (v1) — moved to `frappe-ui/experimental`

**Loud break:** the import fails at the root. Change the import path. Nothing
about the components changed.

The first chart family is not part of the core v1 API. `AxisChart`,
`DonutChart`, `ECharts`, `FunnelChart`, `NumberChart` and `useAxisChartOptions`
move out of the root export to `frappe-ui/experimental`, which has no stability
promise. They stay there, with the same API, while apps migrate.

```ts
// Before
import { AxisChart, DonutChart, NumberChart } from 'frappe-ui'

// After
import { AxisChart, DonutChart, NumberChart } from 'frappe-ui/experimental'
```

Apps that spread `content` from `frappe-ui/tailwind` keep their styles
automatically.

### Moving to `frappe-ui/charts`

For new code, use [`frappe-ui/charts`](/docs/charts/overview) instead. It is the
replacement family and draws everything the old one did. Its props are flat and
name the columns of your rows, so a `config` object becomes props:

```vue
<!-- Before -->
<AxisChart
  :config="{
    data: rows,
    xAxis: { key: 'week' },
    series: [{ name: 'balance', type: 'area' }],
  }"
/>

<!-- After -->
<AreaChart :data="rows" x="week" y="balance" />
```

**Silent break if you only rename.** Four `config` keys have no prop with the
same name. A port that only renames drops them with no build error and no type
error; the chart just scales or draws differently:

| v0 `config` key               | `frappe-ui/charts` prop                                            |
| ----------------------------- | ------------------------------------------------------------------ |
| `yAxis.yMin` / `yAxis.yMax`   | `yAxis.min` / `yAxis.max`                                          |
| `y2Axis.yMin` / `y2Axis.yMax` | `y2Axis.min` / `y2Axis.max`                                        |
| `swapXY`                      | `horizontal` (`BarChart` only — a horizontal bar has no `y2` axis) |
| `colors`                      | `palette`, or `seriesConfig[key].color`                            |

Combo charts still work after the port. `seriesConfig[key].type` takes
`'bar' | 'line' | 'area'`. The `y2` prop names the columns measured against the
second value axis, which you configure with the chart-level `y2Axis` prop.

For the changes inside `frappe-ui/charts` itself, see [Charts](#charts).

## Sprite icons — moved to `frappe-ui/experimental`

**Loud break:** the old import fails. Change the import path. Nothing about the
components changed.

The sprite-based `Icon`, `IconPicker` and `spritePlugin` are not part of the
core v1 API. They move from `frappe-ui/icons` to `frappe-ui/experimental`, which
has no stability promise.

```ts
// Before
import { Icon, IconPicker, spritePlugin } from 'frappe-ui/icons'

// After
import { Icon, IconPicker, spritePlugin } from 'frappe-ui/experimental'
```

- Apps that spread `content` from `frappe-ui/tailwind` keep `IconPicker` styles
  automatically. No Tailwind change is needed.
- The root `frappe-ui` exports a different `Icon`. If you import both, rename
  one, for example
  `import { Icon as SpriteIcon } from 'frappe-ui/experimental'`.
- The named SFC icons (`CircleCheckIcon`, `HelpIcon`, ...) stay on
  `frappe-ui/icons`.
- For new code, use `lucide-*` classes. They are the standard way to render
  icons.

## ThemeSwitcher — moved to `frappe-ui/experimental` {#themeswitcher}

**Loud break:** the import fails at the root. Change the import path. Nothing
about the component changed.

`ThemeSwitcher` is not part of the core v1 API. It moves out of the root export
to `frappe-ui/experimental`, which has no stability promise. It stays there,
still deprecated, while apps migrate.

```ts
// Before
import { ThemeSwitcher } from 'frappe-ui'

// After
import { ThemeSwitcher } from 'frappe-ui/experimental'
```

`ThemeSwitcherProps` moves the same way.

### If you want off the deprecated component

The replacement has the same behavior, not the same look. `ThemeSwitcher`
renders a group of theme preview cards. A `Select` bound to `useColorScheme`
gives you the same control in a dropdown. An app that wants the cards keeps its
own markup.

```vue
<!-- Before -->
<script setup>
import { ThemeSwitcher } from 'frappe-ui'
</script>

<template>
  <ThemeSwitcher />
</template>
```

```vue
<!-- After -->
<script setup>
import { Select, useColorScheme } from 'frappe-ui'

const { colorScheme, setColorScheme } = useColorScheme()
const options = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'System', value: 'system' },
]
</script>

<template>
  <Select
    :model-value="colorScheme"
    :options="options"
    @update:model-value="setColorScheme"
  />
</template>
```

Changing the import is the smaller change, and keeps the current UI. Do this
rewrite only when you want to stop using the deprecated component.

## FAQ

**Will my CSS break?** In two ways.

- Where component structure changed, components expose `data-*` hooks
  (`data-slot`, `data-state`, `data-size`, `data-variant`). Check selectors that
  targeted tags or classes.
- Separately, the token names changed, with no build or type error. A removed
  radius alias emits no CSS at all. A chromatic ink token renders one shade off
  after the ink shift, and an old `-10` step emits no CSS, because the scales
  now end at `-9`. Run the [token codemod](#tokens), including its
  [`--ink-shift` mode](#ink-chromatic-scales-shift-one-level), before you check
  anything by hand.

**Do I have to run the codemods?**

- Run `packaging-v1` for the Tailwind preset path and the Vite plugin's
  `lucideIcons` option.
- Run `tokens-v2` if you use Tailwind utilities from the frappe-ui preset.
- Run `shortcuts-v1` if you register keyboard shortcuts. It also catches the
  punctuation keys that a hand migration breaks without any error.
- Run `editor-v1` if you use `EditorFixedMenu`.
- `base-props-v1` handles the Icon, Progress and Divider changes above.
- Run `destinations-v1` and `navigation-v1` for navigation changes,
  `overlays-v1` for overlays and pickers, and `list-v1` for the List family.
- Run `data-v1` if you pass an object to the `FrappeUI` plugin's `resources`
  option.

Review any sites the codemods report before you finish the hand edits named in
other sections. See [Codemods](#codemods) for the full list.

**Report bugs:** [file an issue](https://github.com/frappe/frappe-ui/issues/new)
with the `v1-beta` label. Include the component name, before/after code,
version, and a repro.
