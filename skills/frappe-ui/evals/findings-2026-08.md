# Ground-truth defects in the frappe-ui skill

*2026-08 audit of the pre-merge five-file layout. COMPONENTS.md, DESIGN.md and TOKENS.md have since merged into CORE.md, so the line anchors below no longer resolve.*

Every item verified against library source. Apply every correction.


## COMPONENTS.md

### COMPONENTS.md:27 — CRITICAL / WRONG
- **Claim:** `size`: `sm | md | lg | xl | 2xl` (default `sm`).
- **Evidence:** src/components/Button/types.ts:5 — `export type Size = 'xs' | 'sm' | 'md' | 'lg'`; default at src/components/Button/types.ts:22 is `'sm'`. `xl` and `2xl` do not exist.
- **Correction:** - `size`: `xs | sm | md | lg` (default `sm`).

### COMPONENTS.md:35 — CRITICAL / STALE
- **Claim:** Pass actions as `options`; nested groups via `options: [{ group: 'Label', items: [...] }]`.
- **Evidence:** src/components/Menu/types.ts:99-111 — `MenuGroupOption` is `{ group, options }` and declares `items?: never` with the comment "Removed `{ group, items }` shape". src/components/Menu/utils.ts:44-46 warns "`{ group, items }` is not supported; this group will not render."
- **Correction:** Pass actions as `options`; groups via `options: [{ group: 'Label', options: [...] }]`. Nested submenus via `{ label, submenu: [...] }`.

### COMPONENTS.md:50 — CRITICAL / WRONG
- **Claim:** dialog.alert({ title: 'Saved' })
- **Evidence:** src/utils/dialog.ts:725-729 — `export const dialog = { confirm, prompt, danger }`. spec/adr/0003-imperative-dialog-onconfirm.md:52: "`dialog.alert` was never implemented".
- **Correction:** dialog.danger({ title: 'Delete file?', onConfirm: async () => await api.delete() })

### COMPONENTS.md:51 — CRITICAL / WRONG
- **Claim:** const { values } = await dialog.prompt({ title: 'Rename', fields: [{ name: 'title', label: 'Title', required: true }] })
- **Evidence:** src/utils/dialog.ts:498 `export function prompt(args: PromptArgs): DialogHandle` returns `{ close }` synchronously, not a Promise. Values arrive via `onConfirm(ctx)` — src/utils/dialog.ts:175 `onConfirm: (ctx: PromptControl) => void | Promise<void>` where `PromptControl.values` is set at src/utils/dialog.ts:39-41.
- **Correction:** dialog.prompt({ title: 'Rename', fields: [{ name: 'title', label: 'Title', required: true }], onConfirm: ({ values }) => rename(values.title) })

### COMPONENTS.md:57 — CRITICAL / STALE
- **Claim:** `Popover` for arbitrary anchored content. `v-model:open`, slots: `#target` (trigger), `#body` (content).
- **Evidence:** src/components/Popover/Popover.vue:9 renders `<slot name="trigger">` and lines 28-30 render the default slot. src/components/Popover/Popover.md:105-106: "The v0 API is gone in `1.0.0`. `#target` becomes `#trigger`, `#body` and `#body-main` become `#default`".
- **Correction:** - `Popover` for arbitrary anchored content. `v-model:open`, slots: `#trigger` (trigger), `#default` (content).

### COMPONENTS.md:120 — CRITICAL / WRONG
- **Claim:** - `Tabs` for full content tabs (top-level page sections). `v-model:tab`.
- **Evidence:** src/components/Tabs/types.ts:15-23 — `TabsProps.modelValue?: TabValue` and `TabsEmits` has `'update:modelValue'`; spec/tabs.md:55 shows `<Tabs v-model="tab">`. `v-model:tab` is SettingsDialog's model (docs/components/recipes/DiscussionsDesktop.vue:747).
- **Correction:** - `Tabs` for full content tabs (top-level page sections). `v-model` (the selected `TabValue`).

### COMPONENTS.md:134 — CRITICAL / STALE
- **Claim:** ### `Calendar`
Month/week calendar view.
- **Evidence:** src/index.ts:86-87 — "Calendar family moved to `frappe-ui/experimental` (#1020, P14)"; experimental.ts:27 `export * from './experimental/Calendar'`; experimental/Calendar/types.ts:3 `export type CalendarMode = 'Day' | 'Week' | 'Month'`
- **Correction:** ### `Calendar` (`frappe-ui/experimental`)
Day/week/month calendar view. Parked in experimental (#1020) — the API is unchanged but unstable; import from `frappe-ui/experimental`, not `frappe-ui`.

### COMPONENTS.md:19 — MAJOR / WRONG
- **Claim:** For frappe-ui components that take an `icon` prop (Button, Dropdown options, Dialog, Alert, Badge), pass the namespaced **string** `"lucide-edit"`
- **Evidence:** src/components/Badge/types.ts:5-17 — `BadgeProps` has only `theme`, `size`, `variant`, `label`. Badge takes icons through the `#prefix` / `#suffix` slots instead (src/components/Badge/Badge.vue:7-20).
- **Correction:** For frappe-ui components that take an `icon` prop (Button, Dropdown options, Dialog, Alert), pass the namespaced **string** `"lucide-edit"` — the component renders the span for you. `Badge` has no `icon` prop; put the span in its `#prefix` / `#suffix` slot.

### COMPONENTS.md:40 — MAJOR / WRONG
- **Claim:** Modal. Always `v-model:open`. Props: `title`, `message`, `icon`, `theme`, `size`, `actions`, `dismissible`.
- **Evidence:** src/components/Dialog/types.ts:36-77 — `DialogProps` has no `theme`. The theme lives on the icon object only (`DialogIcon.theme`, src/components/Dialog/types.ts:21-25). spec/dialog.md:64-86 confirms the prop list.
- **Correction:** Modal. Always `v-model:open`. Props: `title`, `message`, `icon` (string or `{ name, theme }`), `size`, `position`, `actions`, `dismissible`, `showCloseButton`, `bare`.

### COMPONENTS.md:43 — MAJOR / WRONG
- **Claim:** For confirm/alert/prompt, prefer the **imperative API** below.
- **Evidence:** src/utils/dialog.ts:725-729 — the namespace exports `confirm`, `prompt`, `danger`. There is no `alert`; `danger` is missing from the skill (src/utils/dialog.ts:715).
- **Correction:** For confirm/danger/prompt, prefer the **imperative API** below.

### COMPONENTS.md:87 — MAJOR / WRONG
- **Claim:** `Slider` / `Rating` — `v-model` numeric.
- **Evidence:** src/components/Slider/types.ts:14 `export type SliderValue = number[]` and src/components/Slider/Slider.vue:22 `const model = defineModel<SliderValue>()`. src/components/Slider/Slider.md:19: "Use a two-element `modelValue` to render two thumbs." Only `Rating` is a plain number (src/components/Rating/types.ts:7).
- **Correction:** `Slider` `v-model` is `number[]` — `[25]` for one thumb, `[20, 80]` for a range. `Rating` `v-model` is a `number`. Standard labeling props apply.

### COMPONENTS.md:95 — MAJOR / WRONG
- **Claim:** Status pill. `<Badge :label theme variant size />`. Same color axes as Button.
- **Evidence:** src/components/Badge/types.ts:7 — `theme?: 'gray' | 'blue' | 'green' | 'amber' | 'red' | 'violet'` and line 10 `size?: 'sm' | 'md' | 'lg'`, versus src/components/Button/types.ts:4-5 `Theme = 'gray' | 'blue' | 'green' | 'red'`, `Size = 'xs' | 'sm' | 'md' | 'lg'`.
- **Correction:** Status pill. `<Badge :label theme variant size />`. `variant` matches Button (`solid | subtle | outline | ghost`), but `theme` adds `amber` and `violet` (`gray | blue | green | amber | red | violet`) and `size` is `sm | md | lg`.

### COMPONENTS.md:100 — MAJOR / WRONG
- **Claim:** non-gray themes auto-show one (`:icon="false"` hides, a `lucide-*` string / Component customizes)
- **Evidence:** src/components/Alert/types.ts:34 — "unset shows the theme's auto icon (gray shows the info glyph in black ink)"; src/components/shared/statusIcon.ts:26-32 maps `gray: AlertCircleSolidIcon`, and line 58 returns `options.icons[theme]` whenever `icon` is `undefined`.
- **Correction:** every theme auto-shows one, gray included as a black-ink info glyph (`:icon="false"` hides, a `lucide-*` string / Component customizes)

### COMPONENTS.md:110 — MAJOR / WRONG
- **Claim:** - `LoadingText` for skeleton-style text placeholder.
- **Evidence:** src/components/LoadingText/LoadingText.vue:1-5 — it renders `<LoadingIndicator />` plus the `text` prop (default `'Loading...'`, line 11). The skeleton placeholder is `Skeleton` (src/index.ts:35).
- **Correction:** - `LoadingText` for a spinner plus a loading label (`text`, default `"Loading..."`). Use `Skeleton` for skeleton placeholders.

### COMPONENTS.md:163 — MAJOR / WRONG
- **Claim:** - Theme (light/dark via `[data-theme="dark"]`).
- **Evidence:** src/components/FrappeUIProvider/FrappeUIProvider.vue:18-20 — the template is only `<ToastProvider /> <slot /> <Dialogs />`; no theme provide/inject. Dark mode is owned by src/composables/useColorScheme.ts:23 (`const DOM_ATTRIBUTE = 'data-theme'`), which works without the provider.
- **Correction:** Delete this bullet. Dark mode is set by the `useColorScheme` composable, which writes `data-theme` on `<html>` independently of `FrappeUIProvider`.

### COMPONENTS.md:164 — MAJOR / WRONG
- **Claim:** - Resource provider for `createResource` / v3 data APIs.
- **Evidence:** src/components/FrappeUIProvider/FrappeUIProvider.vue:22-31 — the script sets up only slots; `grep -rn 'provide(' src/components/FrappeUIProvider/` returns nothing. src/components/FrappeUIProvider/FrappeUIProvider.md:3-5 says it "Mounts the imperative `dialog.*` and `toast.*` portals ... and renders the default slot unchanged."
- **Correction:** Delete this bullet. `useCall` / `createResource` need no provider; configure them with `setConfig` from `frappe-ui` instead.

### COMPONENTS.md:168 — MAJOR / WRONG
- **Claim:** `useCall` is the v3 path.
- **Evidence:** package.json:3 — `"version": "1.0.0-beta.55"`. spec/adr/0013-v1-resources-implementation-freeze.md:12-13 names the two tiers: the resource API is "v1" and the `useCall` family is "v2" ("roughly 2.6x v2's call-site count"). No file in the repo calls anything "v3"; `grep -rn '\bv3\b' docs/content/docs spec` only returns Tailwind v3 and TipTap v3.
- **Correction:** `useCall` is the recommended data-fetching layer for new code.

### COMPONENTS.md:196 — MAJOR / WRONG
- **Claim:** cacheKey: ['user', userId],
- **Evidence:** src/data-fetching/useCall/useCall.ts:219 and 244-245 — the read key is built once at setup (`let normalizedCacheKey = normalizeCacheKey(cacheKey, 'useCall')`, then a single `idbStore.get(normalizedCacheKey)`), and src/data-fetching/utils.ts:62-76 `normalizeCacheKey` does `JSON.stringify` with no `toValue`. A `Ref` serializes to its RefImpl fields, so the key never re-reads. Combined with `refetch: true` on line 184/195, `userId` changing refetches but `cachedResponse` still holds the first user's body, and useCall.ts:222-238 returns it from `.data` while loading. docs/content/docs/data-fetching/use-call.md:70 also specifies "a string, or array of primitives".
- **Correction:** Drop `cacheKey` from the reactive-URL example, or key the component itself per id. `cacheKey` is read once at setup and is not reactive — a `Ref` inside it is stringified, not unwrapped, so a `cacheKey` that should vary with a reactive `url` will serve the previous id's cached response.

### COMPONENTS.md:236 — MAJOR / WRONG
- **Claim:** Higher-level wrappers around `useCall` for common Frappe shapes (paginated lists, single docs, doctype metadata, new-doc scaffolds).
- **Evidence:** src/data-fetching/useDoctype/useDoctype.ts:10-27 — `useDoctype(doctype, options)` returns `{ insert, delete, setValue, runDocMethod, runMethod }` only; it fetches nothing. docs/content/public/llms.txt:82 — "useDoctype: write-only helpers for a doctype — `insert`, `delete`, `setValue`, `runDocMethod`, `runMethod` — with no read/fetch of its own." docs/content/docs/data-fetching/use-doctype.md:3-4 — "groups the write operations for a DocType ... without fetching or holding any document itself".
- **Correction:** Higher-level composables for common Frappe shapes: `useList` (paginated lists), `useDoc` (one document), `useDoctype` (the write operations for a doctype — `insert`, `delete`, `setValue`, `runDocMethod`, `runMethod`, with no read of its own), `useNewDoc` (a reactive draft plus insert). Use them when they fit; drop to `useCall` when you need a custom endpoint.

### COMPONENTS.md:63 — MINOR / WRONG
- **Claim:** All input controls accept the **shared labeling contract**: `label`, `description`, `error`, `required`.
- **Evidence:** src/components/FileUploader/types.ts:10 — `FileUploaderProps` does not extend `InputLabelingProps` (contrast src/components/TextInput/types.ts:5, src/components/Slider/types.ts:16). FileUploader is listed in this section at COMPONENTS.md:89 but has none of the four props.
- **Correction:** Every input control except `FileUploader` accepts the **shared labeling contract**: `label`, `description`, `error`, `required` (plus `id`).

### COMPONENTS.md:75 — MINOR / WRONG
- **Claim:** Fixed list, multiple values. `v-model` is `string[]`.
- **Evidence:** src/components/MultiSelect/types.ts:55 — `modelValue?: Array<string | number>`; option values are `string | number` (src/components/MultiSelect/types.ts:28).
- **Correction:** Fixed list, multiple values. `v-model` is `Array<string | number>`.

### COMPONENTS.md:84 — MINOR / WRONG
- **Claim:** `DateRangePicker` v-model is `string[]` of length 2.
- **Evidence:** src/components/DatePicker/types.ts:85-86 — "Controlled range value as `[from, to]` in `YYYY-MM-DD` format, or `[]` for no selection"; src/components/DatePicker/types.ts:104 `type DateRangeValue = [string, string] | []`.
- **Correction:** `DateRangePicker` v-model is `[from, to]` in `YYYY-MM-DD`, or `[]` when nothing is selected.

### COMPONENTS.md:156 — MINOR / CONTRADICTS_OTHER_SKILL_FILE
- **Claim:** > Don't use `Card` — compose surfaces directly with `bg-surface-base rounded-4 border border-outline-gray-1 p-4`.
- **Evidence:** skills/frappe-ui/TOKENS.md:79 assigns `rounded-5` (10px) to "Cards" and `rounded-4` (8px) to "Inputs, buttons, list items"; the upstream Card replacement uses `rounded-6` (docs/content/docs/migration.md:1651).
- **Correction:** > Don't use `Card` — compose surfaces directly with `bg-surface-base rounded-5 border border-outline-gray-1 p-4` (see TOKENS.md radius scale).

### COMPONENTS.md:168 — MINOR / WRONG
- **Claim:** don't reach for the legacy `createResource` family in new code
- **Evidence:** spec/adr/0013-v1-resources-implementation-freeze.md:8 and :12 — v1 resources ship "supported, un-deprecated, and with no changes to their internal implementation code", and "v1 is not a legacy tier by any measure available at the tag". docs/content/docs/data-fetching/use-call.md:5 — the resource API "stays fully supported through 1.x". spec/adr/0008-no-deprecated-members-in-1-0-0.md:20-22 — nothing marked `@deprecated` ships in 1.0.0.
- **Correction:** prefer `useCall` over the older `createResource` family in new code (resources stay supported and un-deprecated through 1.x).

### COMPONENTS.md:232 — MINOR / WRONG
- **Claim:** against a generic REST API `.data` will be `undefined`
- **Evidence:** src/data-fetching/useCall/useCall.ts:241 — `return data.value?.data ?? null`, so a response with no `data` member reads as `null`. Confirmed by docs/content/docs/data-fetching/use-call.md:88 — "`data` — the response data, or `null` before the first successful response."
- **Correction:** `useCall` expects Frappe's response envelope (`{ data: T }`) — against a generic REST API `.data` stays `null`.

### COMPONENTS.md:236 — MINOR / WRONG
- **Claim:** Higher-level wrappers around `useCall`
- **Evidence:** src/data-fetching/useList/useList.ts:15-16 imports `useFrappeFetch` and `useAction`, never `useCall` — `useList` is a sibling of `useCall`, not a wrapper. docs/content/docs/migration.md:1489-1490 states it directly: `useFrappeFetch` "is the raw `createFetch` instance `useCall`, `useDoc` and `useList` are built on". `useNewDoc` uses `useIsolatedCall` (src/data-fetching/useNewDoc/useNewDoc.ts:28) and `useDoctype` uses `useAction` (src/data-fetching/useDoctype/useDoctype.ts:2).
- **Correction:** Higher-level composables that sit alongside `useCall` on the same Frappe fetch layer.


## DESIGN.md

### DESIGN.md:126 — MAJOR / CONTRADICTS_OTHER_SKILL_FILE
- **Claim:** Unread count pill: `grid h-4 min-w-4 place-content-center rounded-full bg-amber-600 px-1 text-xs text-white dark:bg-dark-amber-500`.
- **Evidence:** TOKENS.md:3 says "Use these instead of the raw palette (`gray-500`, `blue-700`, …)" and SKILL.md:37 rule 3 forbids raw colors; `bg-amber-600` / `dark:bg-dark-amber-500` / `text-white` are raw palette entries (tailwind/colorPalette.js:47-49 generates the `dark-*` prefix). No recipe or src file uses this string — `grep -rn 'bg-amber-600' src docs` returns nothing.
- **Correction:** - Unread count pill: `grid h-4 min-w-4 place-content-center rounded-full bg-surface-amber-7 px-1 text-xs text-ink-white`.

### DESIGN.md:244 — MAJOR / WRONG
- **Claim:** skeleton text `<LoadingText :lines="3" />`
- **Evidence:** src/components/LoadingText/types.ts:1-4 — `LoadingTextProps` declares only `text?: string`. src/components/LoadingText/LoadingText.vue:2-4 renders a `LoadingIndicator` plus that text, not a skeleton. The skeleton primitive is `Skeleton` (src/components/Skeleton/Skeleton.vue:1-6, `animate-pulse bg-surface-gray-3`).
- **Correction:** - Inline: `<LoadingIndicator />` / `<Spinner />`; spinner-with-caption `<LoadingText text="Loading…" />`; skeleton blocks `<Skeleton class="h-4 w-40" />`.

### DESIGN.md:245 — MINOR / WRONG
- **Claim:** First page load: render the shell with `LoadingText` placeholders in content slots
- **Evidence:** src/components/LoadingText/LoadingText.vue:2-4 renders a spinner and one line of text, so it cannot act as a block placeholder. `Skeleton` (src/components/Skeleton/Skeleton.vue:1-6) is the placeholder primitive.
- **Correction:** - First page load: render the shell with `Skeleton` placeholders in content slots — don't blank the screen.


## SETUP.md

### SETUP.md:13 — CRITICAL / STALE
- **Claim:** vite@^5 @vitejs/plugin-vue@^5
- **Evidence:** package.json:212 `"vite": "^7.3.2"`; package.json:198 `"@vitejs/plugin-vue": "^6.0.7"`.
- **Correction:** vite@^7 @vitejs/plugin-vue@^6 \

### SETUP.md:21 — CRITICAL / WRONG
- **Claim:** **Vite 5 (not 6/7/8).** frappe-ui's vite plugin is built against Vite 5's plugin API.
- **Evidence:** package.json:212 — `"vite": "^7.3.2"` in devDependencies, and package.json:252 pins the same in `resolutions`. The repo itself builds and tests on Vite 7.
- **Correction:** - **Vite 7.** frappe-ui builds and tests against Vite 7 (`vite@^7.3.2`). Node `>=20.19.0` is required (package.json `engines`).

### SETUP.md:7 — MAJOR / STALE
- **Claim:** **Both are incompatible with frappe-ui 0.1.x.**
- **Evidence:** package.json:3 — `"version": "1.0.0-beta.55"`. The 0.1.x line no longer describes the published package.
- **Correction:** `npm create vite@latest` currently scaffolds Tailwind v4, which frappe-ui 1.0.x does not support. After scaffolding, uninstall the Tailwind defaults and pin to the versions frappe-ui expects:

### SETUP.md:16 — MAJOR / UNVERIFIABLE
- **Claim:** lucide-static @iconify/json  (…) - **`unplugin-icons` + iconify data + lucide-static.** Required for resolving the `~icons/lucide/*` virtual imports
- **Evidence:** `grep -rn '@iconify' package.json vite/ tailwind/` returns nothing — @iconify/json is not used anywhere in the library. vite/lucideIconsPlugin.js:1 resolves `~icons/lucide/*` from `lucide-static` alone, and lucide-static (package.json:176), unplugin-icons (188), unplugin-auto-import (187) and unplugin-vue-components (189) are already frappe-ui runtime `dependencies`.
- **Correction:** Drop `unplugin-auto-import unplugin-vue-components unplugin-icons lucide-static @iconify/json` from the install list — they ship as frappe-ui dependencies, and `~icons/lucide/*` is resolved by frappe-ui's own `lucideIcons` vite sub-plugin from `lucide-static`. `@iconify/json` is not used by frappe-ui at all.

### SETUP.md:22 — MAJOR / WRONG
- **Claim:** `<Button>` from frappe-ui injects `Symbol(router)`. Without a router instance, every Button logs `[Vue warn]: injection "Symbol(router)" not found.`
- **Evidence:** src/components/Button/Button.vue:240-243 — the root is `RouterLink` only when `props.route` is set; otherwise it renders `'a'` or `'button'`. A plain `<Button>` performs no router injection and logs nothing. vue-router is required because it is a peer dependency (package.json:194).
- **Correction:** - **`vue-router` is required.** It is a frappe-ui peer dependency (`vue-router@^4.1.6`), and `<Button :route="...">`, `Breadcrumbs`, `Menu` and `PageHeaderBackButton` render `RouterLink` / call `useRouter()`. Only those paths warn without a router instance.

### SETUP.md:57 — MAJOR / STALE
- **Claim:** exclude: ['frappe-ui'],  // …esbuild's prebundler cannot resolve. Skip prebundling for it
- **Evidence:** vite/index.d.ts:53-57 and docs/content/docs/other/vite.md:91 both state an installed frappe-ui is expected to be pre-bundled: "rewriting an installed package is a net loss, since Vite already pre-bundles it as one optimized chunk". vite/index.js:52-84 also injects its own `optimizeDeps.include` list, and only 7 files in src/ still use `~icons/lucide/*`.
- **Correction:** Drop the `optimizeDeps` block. The `frappeui()` plugin supplies its own `optimizeDeps.include` (`highlight.js/lib/core`, `reka-ui`, `vue-sonner`, `dompurify`) and its `barrelImports` sub-plugin assumes an installed frappe-ui is pre-bundled by Vite as one chunk.

### SETUP.md:85 — MAJOR / STALE
- **Claim:** './node_modules/frappe-ui/src/**/*.{vue,js,ts,jsx,tsx}'
- **Evidence:** tailwind/content.js:50-58 exports a `content` glob list covering `src/**`, `icons/**` and five parked `experimental/*` families; docs/content/docs/foundations/tailwind.md:5-11 documents `import preset, { content } from 'frappe-ui/tailwind'` as the supported form. A hand-copied `src/**`-only glob drops `icons/**` and the parked families (that exact drift is called out at tailwind.md:29-35).
- **Correction:** ```js
import preset, { content } from 'frappe-ui/tailwind'

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset],
  content: [...content, './index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
}
```

### SETUP.md:104 — MAJOR / WRONG
- **Claim:** @import 'frappe-ui/style.css';\n@tailwind base;\n@tailwind components;\n@tailwind utilities;
- **Evidence:** src/style.css:3-5 — `frappe-ui/style.css` already emits `@tailwind base; @tailwind components; @tailwind utilities;`. Repeating them emits every Tailwind layer twice.
- **Correction:** ```css
@import 'frappe-ui/style.css';
```
That file already emits `@tailwind base/components/utilities` plus the Inter font import — do not repeat the directives.

### SETUP.md:121 — MAJOR / WRONG
- **Claim:** app.use(FrappeUI) // installs the plugin (resource provider, etc.) … The plugin provides app-level injections
- **Evidence:** src/utils/plugin.ts:78-120 — `install()` provides nothing by default. It only warns about removed options, installs throwing guards for `$socket` / `$call` / `$resources`, and installs the v1 resources Options API when called as `app.use(FrappeUI, { resources: true })`.
- **Correction:** `app.use(FrappeUI)` is optional for new apps: the plugin provides no injections. It only installs the v1 resources Options API (`this.$resources`) when you pass `{ resources: true }`, plus dev-mode guards for the removed `$socket` / `$call` globals. `FrappeUIProvider` is the one you actually need — it mounts the `dialog.*` / `toast.*` portals.

### SETUP.md:61 — MINOR / UNVERIFIABLE
- **Claim:** include: ['tippy.js', 'engine.io-client', 'socket.io-client', 'debug']
- **Evidence:** vite/index.js:56-59 warns that "Every entry here must be a frappe-ui dependency. A name that no installed package resolves makes Vite log 'Failed to resolve dependency …'". `engine.io-client` and `debug` are not in package.json dependencies (only `socket.io-client` at ^4.5.1 and `tippy.js` at ^6.3.7 are).
- **Correction:** Remove the hand-written `include` list; `frappeui()` already declares the entries it needs (vite/index.js:52-84).

### SETUP.md:71 — MINOR / WRONG
- **Claim:** The `frappeui()` plugin's defaults (`frappeProxy`, `jinjaBootData`, `buildConfig`, `siteBanner`) all assume you're running inside a Frappe site. Disable them
- **Evidence:** vite/index.d.ts:125-166 — `FrappeuiPluginOptions` has `lucideIcons`, `barrelImports`, `frappeProxy`, `jinjaBootData`, `buildConfig`, `frappeTypes`, `frontendRoute`. There is no `siteBanner` option; vite/siteBanner.js:3-4 returns `null` unless `frontendRoute` is set, so it is already inert for a non-Frappe prototype.
- **Correction:** The `frappeui()` plugin's `frappeProxy`, `jinjaBootData` and `buildConfig` defaults assume you're running inside a Frappe site. Disable those three for any prototype that isn't. The site banner needs no opt-out: it only activates when `frontendRoute` is set.


## SKILL.md

### SKILL.md:38 — CRITICAL / WRONG
- **Claim:** `variant` (`solid | outline | subtle | ghost`) + `theme` (`gray | blue | green | red | orange`)
- **Evidence:** src/components/Button/types.ts:4 — `export type Theme = 'gray' | 'blue' | 'green' | 'red'`. No component in src/components/*/types.ts declares an `orange` theme; Badge's warm theme is `amber` (src/components/Badge/types.ts:7), Dialog's is `amber` (src/components/Dialog/types.ts:17).
- **Correction:** **Color = `variant` + `theme`.** `variant` (`solid | outline | subtle | ghost`) + `theme` (`gray | blue | green | red`; `Badge` adds `amber` and `violet`). Never invent `intent` / `kind` / `severity` / `appearance`.

### SKILL.md:43 — CRITICAL / WRONG
- **Claim:** `dialog.confirm` / `alert` / `prompt`
- **Evidence:** src/utils/dialog.ts:725-729 — `export const dialog = { confirm, prompt, danger }`. There is no `alert` member; `dialog.alert(...)` throws TypeError.
- **Correction:** **Imperative for one-shot UI.** `dialog.confirm` / `dialog.prompt` / `dialog.danger`, `toast.success` / `error` / `info` / `warning` — don't hand-mount `<Dialog>` to ask "are you sure?".

### SKILL.md:36 — MAJOR / WRONG
- **Claim:** `ListView`, `ItemListRow`, and `TextEditor` are legacy — never in new code.
- **Evidence:** src/index.ts:86 still exports `./components/ItemListRow` from the root barrel, and src/components/ItemListRow/ItemListRow.md:3-8 describes it as the current shared row primitive behind Dropdown/Select/Combobox/MultiSelect, to be used directly for custom listbox surfaces. It is absent from docs/content/docs/components/legacy.md, which lists what is removed or parked.
- **Correction:** `ListView` and the v0 `TextEditor` family are parked in `frappe-ui/experimental` — never in new code. `ItemListRow` is current: it is the shared row primitive for custom listbox and menu surfaces.

### SKILL.md:46 — MAJOR / WRONG
- **Claim:** version pins (Tailwind v3, Vite 5), `exports` subpaths, `optimizeDeps.exclude: ['frappe-ui']`, `app.use(FrappeUI)`, and `vue-router` are all required
- **Evidence:** package.json:212 pins `vite ^7.3.2`; vite/index.d.ts:53-57 states an installed frappe-ui is pre-bundled by Vite (no exclude expected); src/utils/plugin.ts:78-120 shows `app.use(FrappeUI)` provides nothing by default.
- **Correction:** **Bootstrapping from scratch?** Follow `SETUP.md` exactly — the Tailwind v3 pin, the `content` export from `frappe-ui/tailwind`, the `exports` subpaths, `FrappeUIProvider` at the app root, and `vue-router` are all required and easy to miss.

### SKILL.md:39 — MINOR / WRONG
- **Claim:** never bare `v-model` on `<Dialog>`
- **Evidence:** src/components/Dialog/types.ts:37-42 — "Visibility — both supported, `open` is canonical"; `modelValue?: boolean` is documented as "Controls whether the dialog is open (v-model). Also supported."
- **Correction:** **Two-way state via `v-model`.** Inputs `v-model`; overlays `v-model:open` (canonical on `Dialog`, though bare `v-model` also works); comboboxes `v-model` + `v-model:query`. Never `:value` + `@change`.

### SKILL.md:44 — MINOR / STALE
- **Claim:** don't reach for the legacy `createResource` family in new code
- **Evidence:** src/index.ts:13-15 — "v1 resource API. Supported and frozen through 1.x, un-deprecated — see #886 and ADR-0013".
- **Correction:** **API calls go through `useCall`** (or `useList` / `useDoc`). Never `fetch` / `axios`. The v1 `createResource` family is still supported and frozen through 1.x, but prefer the `use*` composables in new code.


## TOKENS.md

### TOKENS.md:30 — MAJOR / WRONG
- **Claim:** - `bg-surface-elevation-2` — dialog body background.
- **Evidence:** src/components/Dialog/Dialog.vue:50 — the dialog body is `bg-surface-elevation-1`; the panel at Dialog.vue:32 is also `bg-surface-elevation-1`. `surface-elevation-2` is the popover/menu surface (src/components/shared/popover/PopoverPanel.vue:60, src/components/Menu/utils.ts:19).
- **Correction:** - `bg-surface-elevation-1` — dialog surface and body. `bg-surface-elevation-2` — popover, dropdown and menu surface.

### TOKENS.md:79 — MAJOR / CONTRADICTS_OTHER_SKILL_FILE
- **Claim:** | `rounded-5`      | 10    | Cards                          |
- **Evidence:** skills/frappe-ui/COMPONENTS.md:156 — "Don't use `Card` — compose surfaces directly with `bg-surface-base rounded-4 border border-outline-gray-1 p-4`." docs/components/recipes/*.vue use `rounded-4` (6 hits) and `rounded-6` (14 hits) against a single `rounded-5`. In src/, `rounded-5` is the `lg` Button radius (src/components/Button/Button.vue:211,217).
- **Correction:** | `rounded-5`      | 10    | `lg` buttons and controls (cards use `rounded-4`) |

### TOKENS.md:80 — MAJOR / WRONG
- **Claim:** | `rounded-6`      | 12    | Dialogs, larger surfaces       |
- **Evidence:** src/components/Dialog/Dialog.vue:32 — the dialog panel is `rounded-7` (16px). `rounded-6` is the popover/menu/select shell: src/components/shared/popover/PopoverPanel.vue:60, src/components/Menu/utils.ts:19, src/components/MultiSelect/MultiSelect.vue:492, src/components/TimePicker/TimePicker.vue:68.
- **Correction:** | `rounded-6`      | 12    | Popovers, dropdowns, menus     |

### TOKENS.md:81 — MAJOR / WRONG
- **Claim:** | `rounded-7`      | 16    | Hero panels                    |
- **Evidence:** src/components/Dialog/Dialog.vue:32 — `rounded-7` is the dialog panel radius. No "hero panel" usage exists in src/.
- **Correction:** | `rounded-7`      | 16    | Dialogs                        |

### TOKENS.md:93 — MAJOR / WRONG
- **Claim:** | `shadow`      | Default (inputs on focus)            |
- **Evidence:** tailwind/plugin.js:188 — `.form-input, .form-textarea, .form-select` apply `focus:shadow-sm`. src/components/TextInput/TextInput.vue:203 and src/components/Textarea/Textarea.vue:133 also use `focus:shadow-sm`. No component uses the bare `shadow` utility on focus.
- **Correction:** | `shadow-sm`   | Inputs on focus, resting cards, active nav items |

### TOKENS.md:94 — MAJOR / WRONG
- **Claim:** | `shadow-md`   | Popovers, dropdowns                  |
- **Evidence:** src/components/shared/popover/PopoverPanel.vue:60 — the popover shell is `overflow-hidden rounded-6 bg-surface-elevation-2 shadow-2xl ring-1 ring-black ring-opacity-5`; src/components/Menu/utils.ts:19 uses `shadow-2xl`; docs/content/docs/foundations/elevation.md:32 maps `Dropdown, Select, floating menu` to `shadow-2xl`. `shadow-md` has exactly one use in the whole library: the Slider thumb (src/components/Slider/Slider.vue:255).
- **Correction:** | `shadow-md`   | Slider thumb (rare)                  |

### TOKENS.md:95 — MAJOR / WRONG
- **Claim:** | `shadow-lg`   | Dialogs                              |
- **Evidence:** src/components/Dialog/Dialog.vue:32 — the dialog panel uses `shadow-xl`, not `shadow-lg`. docs/content/docs/foundations/elevation.md:31 also maps `Dialog, Popover` to `shadow-xl`. `shadow-lg` appears only on Tree drag label (src/components/Tree/Tree.vue:43) and BottomSheet (src/components/BottomSheet/BottomSheet.vue:17).
- **Correction:** | `shadow-lg`   | Bottom sheets, drag labels           |

### TOKENS.md:96 — MAJOR / WRONG
- **Claim:** | `shadow-xl`   | Floating panels                      |
- **Evidence:** src/components/Dialog/Dialog.vue:32 (`shadow-xl`), src/components/Toast/ToastProvider.vue:12 (`shadow-xl`), src/components/Tooltip/TooltipBubble.vue:54 (`shadow-xl`). `shadow-xl` is the dialog/toast/tooltip level, not a generic "floating panel" level.
- **Correction:** | `shadow-xl`   | Dialogs, toasts, tooltips            |

### TOKENS.md:97 — MAJOR / WRONG
- **Claim:** | `shadow-2xl`  | Hero overlays                        |
- **Evidence:** src/components/shared/popover/PopoverPanel.vue:60 and src/components/Menu/utils.ts:19 both use `shadow-2xl`; docs/content/docs/foundations/elevation.md:32 assigns `shadow-2xl` to `Dropdown, Select, floating menu`. There is no "hero overlay" use of `shadow-2xl` in src/.
- **Correction:** | `shadow-2xl`  | Popovers, dropdowns, menus           |

### TOKENS.md:7 — MINOR / WRONG
- **Claim:** Three semantic categories — each takes a color + numeric step.
- **Evidence:** tailwind/colors.json `themedVariables.light` defines five categories: `surface`, `surface-alpha`, `ink`, `outline`, `outline-alpha`. tailwind/plugin.js:257 registers `surface-alpha` as a backgroundColor namespace and plugin.js:279 registers `outline-alpha` as a borderColor namespace, so `bg-surface-alpha-*` and `border-outline-alpha-*` are real utilities.
- **Correction:** Five semantic categories: `ink`, `surface`, `outline`, plus the translucent `surface-alpha` and `outline-alpha` (gray steps only). The three below cover almost every case.

### TOKENS.md:31 — MINOR / UNVERIFIABLE
- **Claim:** - `bg-surface-elevation-3` — selected row.
- **Evidence:** All four uses are active nav/tab items, not rows: src/components/Sidebar/SidebarItem.vue:8, src/components/Rail/RailItem.vue:126, src/components/SettingsDialog/SettingsNavItem.vue:9, src/components/shared/tabs/styles.ts:74. docs/content/docs/foundations/elevation.md:30 calls it "Resting card, active nav item". Grepping `selected` + `bg-surface` in src/molecules/list and src/components/ItemListRow returns nothing.
- **Correction:** - `bg-surface-elevation-3` — active nav item, active tab, resting card (pair with `shadow-sm`).

### TOKENS.md:46 — MINOR / WRONG
- **Claim:** The preset ships **two parallel scales** with the same pixel sizes but different line-heights
- **Evidence:** tailwind/plugin.js:76-86 (`buildFontSize`) emits `text-p-<size>` only for keys present in `typographyTokens.paragraph`. tailwind/generated/typography.json paragraph block covers `2xs`…`4xl` only, so `text-p-5xl` … `text-p-12xl` do not exist while `text-5xl`…`text-12xl` do.
- **Correction:** The preset ships two parallel scales with the same pixel sizes but different line-heights. The paragraph scale stops at `text-p-4xl`; larger display sizes exist only as `text-*`.

### TOKENS.md:48 — MINOR / WRONG
- **Claim:** - `text-*` — tight (`line-height: 1.15`).
- **Evidence:** tailwind/generated/typography.json:93 — `5xl` is `["26px", { lineHeight: "1.6" }]`; `6xl` and `7xl` are also 1.6 and `8xl`–`12xl` (typography.json:117) are 1.4. Line-height 1.15 holds only for `2xs` through `4xl`.
- **Correction:** - `text-*` — tight (`line-height: 1.15` up to `text-4xl`; larger display sizes loosen to 1.4–1.6).

