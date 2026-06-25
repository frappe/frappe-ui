---
pageClass: migration-page
---

# Migration from v0

A guide for moving an existing app onto `frappe-ui` v1. Work through one
component family at a time. Each section opens with a before/after table.
For the full change list see the
[changelog](https://github.com/frappe/frappe-ui/blob/main/v1-release/changelog.md);
for the rationale behind each API see the
[v1 release specs](https://github.com/frappe/frappe-ui/tree/main/v1-release).

After each pass, `grep` for the old prop or slot name to catch anything
missed, then test the flows you touched. Type-checking won't catch focus,
slot renames, or visual regressions.

## Dialog

The `options` blob is flattened into top-level props. See the
[Dialog](./components/dialog) component page for the full API.

| Before                                 | After                            |
| -------------------------------------- | -------------------------------- |
| `v-model="show"`                       | `v-model:open="show"`            |
| `:options="{ title, size, actions }"`  | `title` / `size` / `:actions`    |
| `disableOutsideClickToClose`           | `:dismissible="false"`           |
| `<template #body-content>`             | default slot                     |
| `<template #body-title>`               | `<template #title>`              |
| `<template #body>`                     | `bare` prop + default slot       |
| `onClick: (close) => …`                | `onClick: ({ close }) => …`      |
| manual focus hacks / `v-focus`         | `autofocus` attr on a descendant |

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
For the imperative API, use `dialog.confirm` / `dialog.danger` /
`dialog.prompt` from `frappe-ui` (callback-based: `onConfirm` resolves to
close, throws to stay open) and wrap your app root in `<FrappeUIProvider>`.

## DatePicker / TimePicker family

Covers `DatePicker`, `DateRangePicker`, `DateTimePicker`, and `TimePicker`.
They share the popover-trigger vocabulary.

| Before                          | After                            |
| ------------------------------- | -------------------------------- |
| `:value` prop                   | `v-model`                        |
| `@change`                       | `@update:modelValue`             |
| `placement="bottom-start"`      | `side` + `align` + `offset`      |
| `:autoClose`                    | `:keepOpen` (inverted)           |
| `allowCustom` / `readonly`      | `typeable`                       |
| `minDate`/`maxDate`/`minTime`/`maxTime` | `min` / `max`            |
| `#target`                       | `#trigger`                       |

Behavior changes that apply even if you don't touch your code:

- `DateRangePicker` emits a `[from, to]` tuple. Update handlers that called
  `.split(',')` on the value.
- `DateTimePicker` no longer auto-closes on date click. Close from
  `@update:modelValue` or add an `#actions` Apply button.
- The popover footer and auto Clear button were removed. Render an explicit
  Clear inside `#actions` if you relied on it.
- `DateRangePicker.clearable` now defaults to `true`. Pass `:clearable="false"`
  to opt out.

## Selection family (Dropdown / Select / Combobox / MultiSelect)

| Before                          | After                            |
| ------------------------------- | -------------------------------- |
| Dropdown `{ group, items }`     | `{ group, options }`             |
| Select `#item-*` slot prop `option` | slot prop `item`             |
| chevron / trailing content      | `#suffix` slot (replaces chevron)|
| Combobox `createOption`         | `type: 'custom'` option + `condition` |

For the deprecated `Autocomplete`, see
[Autocomplete (deprecated)](#autocomplete-deprecated).

## Popover / HoverCard

The v0 `Popover` API still works through v1.x — when only an old prop is bound
it is mapped silently; binding both the old and new prop logs a one-time dev
warning and the new prop wins.

| Before                                            | After                                                                                              |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `show` / `v-model:show`                           | `open` / `v-model:open`                                                                            |
| `placement="bottom-start"`                        | `side="bottom"` + `align="start"` (a bare side like `placement="bottom"` maps to `align="center"`) |
| `hideOnBlur`                                       | `dismissible`                                                                                       |
| `matchTargetWidth`                                 | `matchTriggerWidth`                                                                                 |
| `trigger="hover"` (+ `hoverDelay` / `leaveDelay`) | the [`HoverCard`](./components/hovercard) component                                                 |
| `popoverClass`                                     | `data-slot` CSS hooks (no-op + warns)                                                               |
| `transition="default"`                            | built-in motion (no-op)                                                                            |
| `#target` slot                                     | `#trigger` (old `#target` contract preserved with manual wiring; `updatePosition` is now a no-op)  |
| `#body` slot                                       | `#default` + `bare` prop (renders without the panel shell)                                          |
| `#body-main` slot                                  | `#default`                                                                                          |

Hover-driven panels move to the new [`HoverCard`](./components/hovercard)
component, which keeps `hoverDelay` / `leaveDelay` in seconds.

## Inputs

Covers `TextInput`, `Textarea`, `Password`, `Checkbox`, `Switch`, `Rating`,
`Slider`. All share the labeling contract (`label` / `description` / `error`
/ `required`).

| Before                          | After                            |
| ------------------------------- | -------------------------------- |
| `Rating` `:rating_from`         | `:max`                           |
| `Rating` `:readonly`            | `:disabled`                      |
| `Switch` `@change`              | `@update:modelValue`             |
| `Switch.labelClasses` / `Checkbox.padding` | `data-*` styling hooks|
| `Password` `:value` + `@input` workaround | `v-model` (now works)  |

`Slider` no longer hardcodes `aria-label="Volume"`. Pass `label` explicitly
so the control is announced correctly.

The legacy `Input` component is deprecated. Use
[`TextInput`](./components/textinput) for text-like modes, or `Textarea` /
`Select` / `Checkbox` for the other type modes it accepted.

## Divider

| Before                  | After                   |
| ----------------------- | ----------------------- |
| `action.handler`        | `action.onClick`        |

## Icons

Replace `FeatherIcon` and Feather-name strings with `lucide-*` strings or a
`Component`:

```vue
<!-- Before -->        <Button icon="plus" />
<!-- After -->         <Button icon="lucide-plus" />
```

Same for icon-name strings in `Dropdown` options:

```js
// Before
const options = [{ label: 'Edit', icon: 'edit' }]

// After
const options = [{ label: 'Edit', icon: 'lucide-pen' }]
```

## Tokens

Run the v2 token codemod from the app you are migrating:

```sh
npx --package frappe-ui@beta tokens-v2 --dry-run .
```

Review the output, then run it without `--dry-run`:

```sh
npx --package frappe-ui@beta tokens-v2 .
```

The codemod renames espresso color tokens like `bg-surface-white` to `bg-surface-base`
and merges static text size + weight class pairs, for example `text-base font-medium`
to `text-base-medium`. Run it once per codebase; the token migration is not idempotent
because some v2 names overlap with v0 names.

After upgrading to `frappe-ui@1.0.0-beta.11`, run the codemod again. Apps that
already ran it will only get the typography correction (`text-lg` → `text-md`,
`text-xl` → `text-lg`, ...). Apps that still have pre-v2 color tokens can pass
`--force`, but review the output carefully because color tokens may double-shift.

## Editor

The v0 monolith `<TextEditor>` (imported from `frappe-ui`) is replaced by the
`frappe-ui/editor` family: a headless `<Editor>` you compose with **kits**
(bundled, configurable extension sets) and **building-block** menus. Everything
moves to the `frappe-ui/editor` subpath; nothing editor-related is exported from
top-level `frappe-ui` except the deprecated v0 alias, so the two coexist during
the migration window. See the [Editor](./molecules/editor) page for the full API
and recipes.

```ts
// Before
import { TextEditor, TextEditorFixedMenu } from 'frappe-ui'
// After
import { Editor, EditorFixedMenu, RichTextKit, articleToolbar } from 'frappe-ui/editor'
```

| Before                                          | After                                                            |
| ----------------------------------------------- | ---------------------------------------------------------------- |
| `import … from 'frappe-ui'`                     | `import … from 'frappe-ui/editor'`                               |
| `<TextEditor>`                                  | `<Editor>`                                                       |
| `:content="x" @change="x = $event"`             | `v-model="x"` (`@change` still emitted)                          |
| HTML string only                                | `v-model` + `format="json"` for a JSON value                     |
| `:starterkit-options="{ heading: { levels } }"` | `RichTextKit.configure({ heading: { levels } })` in `:extensions`|
| auto-loaded extension set (no opt-out)          | explicit `:extensions` — pick `CommentKit` / `RichTextKit` / `InlineKit` |
| `:mentions` / `:tags` props                     | `kit.configure({ mention: { items, component }, tag: { items } })` |
| `:bubble-menu="true"`                           | `<EditorBubbleMenu :items="articleToolbar">` in the default slot |
| `:floating-menu="true"`                         | `<EditorFloatingMenu :items>`                                    |
| `<TextEditorFixedMenu :buttons>`                | `<EditorFixedMenu :items>`                                       |
| `<TextEditorContent>`                           | `<EditorContent>`                                                |
| menu `:buttons`                                 | menu `:items`                                                    |
| hand-rolled `textEditorMenuButtons` array       | `commentToolbar` / `articleToolbar` / `minimalToolbar` presets   |
| `#top` / `#bottom` / `#editor` slots            | one default slot — you render `EditorContent` + menus yourself   |
| `:uploadFunction` (optional, frappe default)    | `:upload-function` (required to enable uploads)                  |

### Compose, don't configure

v0 took every option as a prop on `<TextEditor>` and auto-loaded every
extension. v1 renders no chrome of its own — you place the building blocks inside
its default slot and they pick up the editor from context (the `:editor` prop is
only needed when composing primitives without `<Editor>`):

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Editor, EditorContent, EditorBubbleMenu, RichTextKit, articleToolbar } from 'frappe-ui/editor'

const content = ref('')
const extensions = [RichTextKit.configure({ heading: { levels: [2, 3, 4, 5, 6] } })]
</script>

<template>
  <Editor v-model="content" :extensions="extensions" placeholder="Write…">
    <EditorBubbleMenu :items="articleToolbar" />
    <EditorContent class="prose max-w-none" />
  </Editor>
</template>
```

Pick the kit per surface: `CommentKit` (light — no table/toc/slash), `RichTextKit`
(full document), `InlineKit` (single-line). Configure kit members in place rather
than via props — e.g. mentions/tags through `kit.configure({ mention: {...}, tag: {...} })`.
To keep the mention/tag nodes rendering but disable the live popups, pass
`mention: { items: null }`.

For a fully custom layout (e.g. a title `<textarea>` as a sibling of the body),
skip `<Editor>` and drive `useEditor` yourself — see
[Composing primitives](./molecules/editor#composing-primitives) — rendering
`<EditorContent>` and the menus as siblings of your own markup.

### Gotchas

- **Tailwind must scan frappe-ui's editor source.** Menu icons are literal
  `lucide-*` class strings living in `frappe-ui/src/molecules/**`. Add that glob
  to your `tailwind.config.js` `content`, or the toolbar / bubble / floating
  icons silently won't be generated.
- **Uploads need an explicit handler.** v0 silently invoked the Frappe upload;
  v1 requires `:upload-function`. In a Frappe app:
  `(file) => useFileUpload().upload(file, {})`.
- **TipTap must be v3.** The v1 editor is built on TipTap 3 — pin `@tiptap/core`,
  `@tiptap/pm`, and `@tiptap/vue-3` to `^3`.

## Autocomplete (deprecated)

`Autocomplete` still ships (with a one-time dev `console.warn`) but will be
removed in a future major release. It merged single- and multi-select via the
`multiple` boolean; v1 splits them: [`Combobox`](./components/combobox) for
single, [`MultiSelect`](./components/multiselect) for multiple.

The model value changes shape. `Autocomplete` took and emitted the full
option object; the new components model the value only. `Combobox` is
`string | null` and `MultiSelect` is `string[]`. To read the full option,
listen to `Combobox`'s `@update:selected-option`.

| Before (`Autocomplete`)         | After                                   |
| ------------------------------- | --------------------------------------- |
| `:multiple="false"` (default)   | use `Combobox`                          |
| `:multiple="true"`              | use `MultiSelect`                        |
| `v-model` (option or value)     | `v-model` (value / value array)         |
| `@change`                       | `@update:modelValue`                    |
| grouped `{ group, items }`      | grouped `{ group, options }`            |
| `placement` (string)            | `side` + `align`                        |
| `:showFooter`                   | `#footer` slot (MultiSelect has built-in)|
| `:bodyClasses`                  | `data-slot` CSS                         |
| `:maxOptions`                   | no equivalent                           |
| `#target`                       | `#trigger`                              |
| `#prefix` / `#suffix` / `#item-*`| same (`#suffix` now replaces chevron)  |

```vue
<!-- Before -->
<Autocomplete v-model="country" :options="countries" @change="onChange" />
<!-- country === { label: 'India', value: 'in' } -->

<!-- After -->
<Combobox v-model="country" :options="countries" @update:model-value="onChange" />
<!-- country === 'in' -->
```

Sweep your codebase:

```bash
grep -rln '<Autocomplete\b' src --include='*.vue'   # find usages
grep -rln ':multiple' src --include='*.vue'         # these become MultiSelect
```

`FormControl` itself is not deprecated, but its `type="autocomplete"` value
is. Switch to `type="combobox"`, or use the standalone
[`Combobox`](./components/combobox).

## FAQ

**Will my CSS break?** Where structure changed, components expose `data-*`
hooks (`data-slot`, `data-state`, `data-size`, `data-variant`). Audit
selectors that targeted tags or classes.

**Report bugs:** [file an issue](https://github.com/frappe/frappe-ui/issues/new)
with the `v1-beta` label. Include the component name, before/after code,
version, and a repro.
