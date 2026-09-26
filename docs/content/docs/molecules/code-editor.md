# CodeEditor

A code editor built on CodeMirror 6, for fields that hold code, queries or
JSON. Import it from `frappe-ui/code-editor`.

<ComponentPreview name="CodeEditor-Basic" csr="true" />

## Anatomy

It is built the same way as [Editor](/docs/molecules/editor):

- **`<CodeEditor>`** creates the CodeMirror view and handles `v-model`. It
  draws nothing itself, and gives the view to its default slot as `{ editor }`.
- **`<CodeEditorContent>`** is the box the editor appears in. A class on it
  sets its size. It is the only visible part: CodeMirror draws its own gutters,
  panels, tooltips and completion popups inside it.
- **`CodeKit`** is a bundle of editing features that you pass to
  `:extensions`, next to a language.
- **Extensions** are everything else in the `extensions` array: a language,
  keymaps, completion sources, linters, and the frappe styling extensions.

frappe-ui has no ready-made code field with a `label`, `description`, `error`
or `required`. Apps need different things around the editor (a language picker,
an expand button, a dialog), so each app writes one small field component on
`<CodeEditor>` and reuses it. See [Build your own field](#build-your-own-field).

## Examples

### Build your own field

A field with a label, an expand button that shows when the code is taller than
the box (from `@overflow`), and JSON formatting when the editor loses focus
(from `@change`). Copy this pattern into your app.

<ComponentPreview name="CodeEditor-Field" csr="true" />

### Pick the language at runtime

The language changes without remounting the editor. See
[Swapping extensions](#swapping-extensions).

<ComponentPreview name="CodeEditor-Languages" csr="true" />

### Languages

`loadLanguage(key)` imports the matching `@codemirror/lang-*` package when it
is needed and returns its extension.

```ts
import { loadLanguage } from 'frappe-ui/code-editor'

const language = shallowRef(null)
loadLanguage(df.options)
  .then((extension) => (language.value = extension))
  // The error names the package to install. Log it so someone reads it.
  .catch((error) => console.error(error))

const extensions = computed(() => [CodeKit, language.value].filter(Boolean))
```

It takes ten keys: `json`, `html`, `javascript`, `python`, `sql`, `markdown`,
`css`, `scss`, `yaml`, `xml`. Any other key resolves to `null`, which is plain
text. `scss` loads `@codemirror/lang-sass` with `{ indented: false }`.

The language packages (and `@codemirror/lint`) are optional peer dependencies.
Install the ones you use:

```sh
yarn add @codemirror/lang-sql
```

A missing package throws an error that names it:

```
[frappe-ui] loadLanguage('sql') could not load @codemirror/lang-sql: Cannot find module '@codemirror/lang-sql'. If it is not installed: yarn add @codemirror/lang-sql
```

Vite resolves all ten imports at build time, so a missing package would stop
the build and the dev server before this error can show. The frappe-ui Vite
plugin prevents that: it replaces each missing package with a stub that throws
the error above. It is on by default. An app that builds without the plugin
must install all ten packages. See [Code languages](/docs/other/vite#code-languages).

### JSON linting

Add a linter to the array. The `json` language does not add one.

```ts
import { json, jsonParseLinter } from '@codemirror/lang-json'
import { linter, lintGutter } from '@codemirror/lint'

const extensions = [CodeKit, json(), lintGutter(), linter(jsonParseLinter())]
```

### Control the editor from code

`useCodeEditor` and the template ref both give you the CodeMirror
`EditorView`, so you use CodeMirror's own API:

```ts
view.dispatch(view.state.replaceSelection(text)) // insert at the cursor
view.focus()
view.state.doc.toString() // read the document
view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: next } }) // replace it, keeping undo history
openSearchPanel(view) // from @codemirror/search
```

From a parent, use a template ref. `<CodeEditor>` exposes `editor`, which is
the view itself, not a ref: write `codeEditor.value?.editor?.focus()`.
`useCodeEditor` returns a `ShallowRef`, so there you read `.value`.

Do not call `view.setState()`. See [Never replace the state](#never-replace-the-state).

### Composing without `<CodeEditor>`

Call `useCodeEditor` yourself and pass the view to `<CodeEditorContent>` with
`:editor`. An explicit `:editor` takes priority over the one from
`<CodeEditor>`, so the part works with no wrapper. Inside `<CodeEditor>`,
`:editor` is optional.

<ComponentPreview name="CodeEditor-Primitives" csr="true" />

## Behavior

### Extensions decide what the editor can do

There is no `language` prop and no feature props. Languages, keymaps,
completion sources, linters and other CodeMirror extensions all go in
`extensions`. The prop is required and has no default. An empty array gives a
bare CodeMirror with no undo history, no keymap and no frappe styling.

frappe-ui re-exports nothing from CodeMirror. Import `Extension`, `EditorView`
and `EditorState` from `@codemirror/state` and `@codemirror/view`, which this
subpath already installs.

### Configuring CodeKit

`CodeKit` has eight members. Turn one on, configure it, or remove it with
`.configure()`:

```ts
CodeKit.configure({
  lineNumbers: {}, // turn on a member that is off by default
  placeholder: 'SELECT 1', // this member takes the text
  autocompletion: false, // remove a member
})
```

`.configure()` returns a new kit and does not change the shared `CodeKit`.
Calls add up: `CodeKit.configure({ lineNumbers: {} }).configure({ search: false })`
keeps the line numbers. See [CodeKit](#codekit) for the members.

The rest of what CodeMirror's `basicSetup` includes is always in the kit and
cannot be configured. To change one of those, build the array yourself:

```ts
extensions: [CodeKit, sql()] // the kit
extensions: [basicSetup, sql()] // CodeMirror's own bundle (no member can be removed)
extensions: [history(), keymap.of(defaultKeymap), sql()] // your own list
```

### Swapping extensions

`extensions` is reactive. A new array is applied to the running editor, and the
document, selection, undo history and folds stay. You can change the language,
or add it after mount, without a remount.

Create the array once. A new array with the same members is ignored, but
members are compared by identity. `:extensions="[CodeKit, json()]"` in a
template creates a new `json()` on every render, and each one reconfigures the
editor. Put the array in a constant, or in a `computed()` that changes only when
the language changes.

This is different from [Editor](/docs/molecules/editor#extensions-are-set-once), where extensions are
set once.

### Content and the commit point

`v-model` holds the content as a string. There are two events:

- **`update:modelValue`** fires on every change. `v-model` uses it.
- **`change`** fires when the editor loses focus after an edit. Focusing and
  leaving without typing emits nothing.

```vue
<CodeEditor v-model="value" :extensions="extensions" @change="save">
```

Use `change` for work that should not happen while someone types: formatting
JSON, saving, clearing an unsaved marker. In [Editor](/docs/molecules/editor),
`change` fires on every edit instead.

Setting `v-model` from outside changes only the part of the text that differs.
The cursor, selection and scroll position stay, and text being typed with an
input method is not interrupted.

### Styling

The look comes in three layers:

| Layer | Comes from | Remove it by |
| --- | --- | --- |
| CodeMirror base styles | CodeMirror | cannot be removed |
| frappe box | the `codeChrome` extension | leaving the extension out |
| frappe syntax colors | the `codeHighlight` extension | leaving the extension out |

`codeChrome` adds one class to the editor, and every frappe style is scoped
under it. Without the extension, no frappe CSS applies.

Change the look with CSS variables, set on the editor or on any parent:

| Variable | Controls | Default |
| --- | --- | --- |
| `--code-bg` | background | `var(--surface-gray-2)` |
| `--code-border` | border color | `transparent` |
| `--code-radius` | corner radius | `var(--radius-md)` |
| `--code-focus-ring` | focus ring color | `var(--outline-gray-3)` |
| `--code-font-size` | font size | `13px` |
| `--code-padding-x` | left and right padding | `8px` |
| `--code-padding-y` | top and bottom padding | `6px` |
| `--code-min-height` | minimum height | `auto` |
| `--code-max-height` | height limit, which sets off [overflow](#overflow) | `none` |

This list may still change: more variables may be added once the field in
`@framework/ui` is built. Variables that start with `--_code-` are internal and
can change in any release.

There are no `variant` or `size` props. Set the variables from your field:

```css
.my-code-field[data-variant='outline'] {
  --code-border: var(--outline-gray-3);
}
.my-code-field[data-size='sm'] {
  --code-font-size: 12px;
}
```

Dark mode needs no setup. The variables and the syntax colors use `--ink-*` and
`--surface-*` tokens, which change with the app's color scheme.

### Overflow

When the content grows past `--code-max-height`, or shrinks back under it,
`<CodeEditorContent>` emits `overflow` with `true` or `false`. It also sets
`data-overflowing` on its root while the content is too tall, so you can add a
fade with CSS only:

```css
[data-slot='code-editor-content'][data-overflowing]::after {
  /* the fade */
}
```

CSS alone cannot detect that content is cut off, which is why the event
exists. frappe-ui does not draw an expand button. Your field does.

While the code is scrolled sideways, the part also sets `data-scrolled-x`,
which the frappe styles use for a shadow beside the gutter. It is internal and
can change in a minor release.

### Never replace the state

Do not call `view.setState()`. It removes the extensions the editor adds for
itself: the one that updates `v-model`, the focus handlers behind `change`, and
the read-only setting behind `editable`. Nothing looks broken, but typing stops
updating `v-model`, `change` stops firing, and a read-only editor becomes
editable, until `extensions` or `editable` changes again. Replace the document
with `view.dispatch()` as shown in [Control the editor from code](#control-the-editor-from-code).

## Accessibility

### Keyboard

These keys come from `CodeKit`.

| Keys | Action |
| --- | --- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd> <kbd>Tab</kbd> | Indent and dedent. They do not move focus. |
| <kbd>Escape</kbd> | Closes an open completion popup or search panel. Otherwise it leaves the editor, so the next <kbd>Tab</kbd> moves focus on. |
| <kbd>Mod</kbd> <kbd>F</kbd> | Opens the search panel. |
| <kbd>Ctrl</kbd> <kbd>Space</kbd> | Opens completions. <kbd>↑</kbd> <kbd>↓</kbd> move through them and <kbd>Enter</kbd> picks one. |
| <kbd>Mod</kbd> <kbd>Z</kbd> | Undo. |
| <kbd>Mod</kbd> <kbd>Shift</kbd> <kbd>Z</kbd> on Mac, <kbd>Ctrl</kbd> <kbd>Y</kbd> elsewhere | Redo. |

The <kbd>Escape</kbd> key comes from `codeKeymap`. If you build your own
array, keep it: without it, a keyboard user who tabs into the editor cannot tab
out (WCAG 2.1.2).

### Screen readers

The editable area has `role="textbox"` and `aria-multiline="true"`, and
`aria-readonly="true"` when `editable` is `false`. `CodeEditor` has no label, so
name it from your field, for example with
`EditorView.contentAttributes.of({ 'aria-label': 'Query' })`.

## API Reference

Everything below is imported from `frappe-ui/code-editor`. Nothing about the
code editor is exported from `frappe-ui` or `frappe-ui/editor`.

### CodeEditor

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `v-model` | `string` | `''` | The document. |
| `extensions` | `Extension[]` | required | Everything the editor does. Reactive. |
| `editable` | `boolean` | `true` | Set to `false` for read-only. Reactive. |
| `autofocus` | `boolean` | `false` | Focuses the editor when it mounts. |

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `string` | Fires on every change. |
| `change` | `string` | Fires on blur after an edit. |
| `focus` | `FocusEvent` | The editor gained focus. |
| `blur` | `FocusEvent` | The editor lost focus. |

| Slot | Props | Description |
| --- | --- | --- |
| `default` | `{ editor }` | The layout. `editor` is the `EditorView`, or `null`. |

A template ref exposes `editor`, the `EditorView` (type `CodeEditorExposed`).

### CodeEditorContent

| Prop | Type | Description |
| --- | --- | --- |
| `editor` | `EditorView \| null` | Optional inside `<CodeEditor>`. |

| Event | Payload | Description |
| --- | --- | --- |
| `overflow` | `boolean` | The content crossed `--code-max-height` in either direction. |

The root has `data-slot="code-editor-content"` and, while the content is too
tall, `data-overflowing`.

### useCodeEditor

`useCodeEditor(options)` creates an `EditorView` and returns a
`ShallowRef<EditorView | null>`. It destroys the view on unmount.

| Option | Description |
| --- | --- |
| `content` | A `Ref<string>`, updated both ways. |
| `extensions` | Required. Reactive. |
| `editable` | Default `true`. Reactive. |
| `autofocus` | Focuses the view once, on mount. |
| `onUpdate`, `onChange`, `onFocus`, `onBlur` | Callbacks. `onChange` runs on blur after an edit. |

### CodeKit

| Member | Default | What it adds |
| --- | --- | --- |
| `lineNumbers` | `false` | Line numbers in the gutter. |
| `foldGutter` | `{}` | Fold arrows in the gutter. |
| `autocompletion` | `{}` | The completion popup and its keys. |
| `search` | `{}` | The search panel and its keys. |
| `placeholder` | `false` | Text shown while the document is empty. Takes a string. |
| `chrome` | `{}` | `codeChrome`, the frappe box and the `--code-*` variables. |
| `highlight` | `{}` | `codeHighlight`, the frappe syntax colors. |
| `keymap` | `{}` | `codeKeymap`: Tab and Shift-Tab indent, Escape leaves. |

Each member is typed against the options of the CodeMirror extension it wraps,
so a misspelled key is a compile error.

Always included: `history`, `bracketMatching`, `closeBrackets`,
`drawSelection`, `dropCursor`, `indentOnInput`, `highlightActiveLine`,
`highlightActiveLineGutter`, `highlightSelectionMatches`,
`rectangularSelection`, `crosshairCursor`, `highlightSpecialChars`, multiple
selections, and the default, history, fold and bracket keymaps.

### Extensions

Each is also a `CodeKit` member. Add them yourself when you build your own
array.

| Export | What it is |
| --- | --- |
| `codeChrome` | Adds the class that the frappe styles and `--code-*` variables use. |
| `codeHighlight` | The frappe syntax colors. Uses `--ink-*` tokens, so it follows the color scheme. |
| `codeKeymap` | Tab and Shift-Tab indent and dedent. Escape leaves the editor. |

For placeholder text without the kit, use `placeholder()` from
`@codemirror/view`.

### Other exports

| Export | Description |
| --- | --- |
| `loadLanguage` | `(key?: string) => Promise<Extension \| null>`. Loads one of the ten language packages. |

Types: `CodeEditorOptions`, `CodeEditorExposed`, `CodeKitOptions`,
`CodeKitExtension` (the type of `CodeKit` and of what `.configure()` returns),
`LanguageKey`.

Moving from the v0 `CodeEditor` in `frappe-ui/experimental`? See
[Migration: Code editor](/docs/migration#code-editor).

<style scoped>
/* One width for every table's first column, so the columns line up down the page. */
th:first-child,
td:first-child {
  width: 11rem;
}
</style>
