# CodeEditor

A CodeMirror 6 code editor that lives under the `frappe-ui/code-editor` subpath.

It's the same composition model as [Editor](/docs/molecules/editor), on a
different engine:

- **`useCodeEditor`**: the engine. It owns the `EditorView` lifecycle, binds the
  content, re-applies the extensions, and destroys the view on unmount. It
  returns a `ShallowRef<EditorView | null>` and nothing else.
- **`<CodeEditor>`**: a renderless component that owns the engine and the
  `v-model`. It renders no element of its own and hands the view to its default
  slot.
- **`<CodeEditorContent>`**: the one part, the box CodeMirror's DOM is appended
  into. There are no menu parts, because CodeMirror draws its own gutters,
  panels, tooltips and completion popups inside that DOM.
- **`CodeKit`**: one configurable bundle of good defaults that you pass to
  `:extensions`.

**frappe-ui ships no labeled field.** Nothing here takes `label`, `description`,
`error` or `required`, and there is no ready-made assembled editor. A renderless
component has nowhere to draw a label, and no two code fields in Frappe match:
Desk picks the language off `df.options`, framework-ui wants an expand pill and
JSON pretty-print, Builder wants a dialog and a dirty dot. So each app writes
one thin field component on `<CodeEditor>` and reuses it at every call site. See
[Build your own field](#build-your-own-field).

## Basic usage

Pass `[CodeKit]` to `:extensions` and render the content part inside the default
slot. The class on `<CodeEditorContent>` sizes the box.

<ComponentPreview name="CodeEditor-Basic" csr="true" />

`extensions` is required and there is no implicit default list. That is what
keeps the engine free of baked-in capability. With an empty array you get a bare
CodeMirror: no history, no keymap, no frappe chrome.

## CodeKit

One bundle in the `StarterKit` mold. It has eight members, each configured or
removed through `.configure()`.

| Member           | Default | What it adds                                                                              |
| ---------------- | ------- | ----------------------------------------------------------------------------------------- |
| `lineNumbers`    | `false` | The line-number gutter. Off by default: Builder's default, and what the Desk field shows. |
| `foldGutter`     | `{}`    | Fold arrows in the gutter.                                                                |
| `autocompletion` | `{}`    | The completion popup and its keymap.                                                      |
| `search`         | `{}`    | The search panel and its keymap.                                                          |
| `placeholder`    | `false` | Hint text while the document is empty. The member takes the string.                       |
| `chrome`         | `{}`    | `codeChrome`: the frappe box and the `--code-*` contract.                                 |
| `highlight`      | `{}`    | `codeHighlight`: the frappe syntax colours.                                               |
| `keymap`         | `{}`    | `codeKeymap`: Tab/Shift-Tab indent and dedent, Escape blurs.                              |

```ts
CodeKit.configure({
  lineNumbers: {}, // turn a default-off member on
  placeholder: 'SELECT 1', // the member takes its text
  autocompletion: false, // remove a member
  foldGutter: false,
})
```

Every member is typed against the real options type of the extension it wraps,
so a misspelled key is a compile error. Option type: `CodeKitOptions`.

`.configure()` returns a new kit and leaves the receiver alone, so the shared
`CodeKit` every app imports is never mutated. Chained calls accumulate:
`CodeKit.configure({ lineNumbers: {} }).configure({ search: false })` keeps the
line numbers.

Everything else `basicSetup` carries stays in the kit as a **fixed base**:
`history`, `bracketMatching`, `closeBrackets`, `drawSelection`, `dropCursor`,
`indentOnInput`, `highlightActiveLine`, `highlightSelectionMatches`,
`rectangularSelection`, `crosshairCursor`, `highlightSpecialChars`, multiple
selections, and the default keymaps. A fixed-base extension is not a member and
is not configurable. If you need one of them configured differently,
hand-assemble instead. That path is first class:

```ts
extensions: [CodeKit, sql()] // the kit
extensions: [basicSetup, sql()] // CodeMirror's own bundle
extensions: [history(), keymap.of(defaultKeymap), sql()] // hand-assembled
```

The kit exists rather than a pointer at `basicSetup` because `basicSetup` is a
flat array: no member can be removed from it.

## Capability is the extensions array

There is no `language` prop and no feature booleans. Languages, keymaps,
completion sources, linters and third-party extensions all travel in the same
array:

```vue
<script setup>
import { CodeEditor, CodeEditorContent, CodeKit } from 'frappe-ui/code-editor'
import { sql } from '@codemirror/lang-sql'

const extensions = [CodeKit, sql()]
</script>

<template>
  <CodeEditor v-model="query" :extensions="extensions">
    <CodeEditorContent class="min-h-40" />
  </CodeEditor>
</template>
```

The language packages are yours, not frappe-ui's. The ten `@codemirror/lang-*`
packages (and `@codemirror/lint`) are **optional peer dependencies**: install
the ones you render, and import them from your own package.

```sh
yarn add @codemirror/lang-sql
```

frappe-ui re-exports nothing from CodeMirror. `Extension`, `EditorView` and
`EditorState` come from `@codemirror/state` and `@codemirror/view`, which this
subpath already installs.

## Swapping extensions

`extensions` is reactive. A new array is re-applied with a single top-level
reconfigure, so the document, the selection, the undo history and the fold state
all survive the swap. Pick the language at runtime, or let it arrive after
mount, with no remount.

<ComponentPreview name="CodeEditor-Languages" csr="true" />

Build the array once. A new array holding the same extension values is ignored,
so a parent re-render costs nothing, but the members are compared by identity:
`:extensions="[CodeKit, json()]"` written inline in a template builds a fresh
`json()` on every render, and each one reconfigures the editor. Hoist the array
to a module constant, or wrap it in a `computed()` that only recomputes when the
language actually changes.

This diverges from `frappe-ui/editor`, where `extensions` is construction-time.
TipTap cannot swap extensions on a live editor; CodeMirror is built to.

## Content and the commit point

Content is the unnamed `v-model`, and there are two channels:

- **`update:modelValue`** fires on every document change. This is what `v-model`
  binds.
- **`change`** fires on a blur that follows an edit. This is the commit point.
  Focusing the editor and clicking away without typing emits nothing, so a
  handler that saves or clears a dirty marker does not run on a document nobody
  touched.

```vue
<CodeEditor v-model="value" :extensions="extensions" @change="save">
```

Note the divergence from `frappe-ui/editor`, where `change` fires on every
content update. Only the timing differs: on both families a `change` means the
document changed. CodeMirror's contenteditable fires no native `change` event,
so the commit has to be emitted, and blur is when it happens. Use `change` for
work that must not run under the user's caret: pretty-printing JSON, saving,
clearing a dirty marker.

Writing `v-model` from outside does not replace the document. The engine diffs
the two strings and dispatches one change covering the differing middle span, so
the caret, the selection and the scroll position survive an external write that
does not touch them, and an in-flight IME composition is not aborted.

## Styling

Three layers, and two of them are removable by leaving an extension out:

| Layer                  | Ships as                      | Removable by                |
| ---------------------- | ----------------------------- | --------------------------- |
| CodeMirror base styles | CodeMirror itself             | not removable, and not ours |
| frappe chrome          | the `codeChrome` extension    | omitting the extension      |
| frappe syntax colours  | the `codeHighlight` extension | omitting the extension      |

Nothing is ambient. `codeChrome` adds one class to the editor's root and the
package stylesheet scopes every frappe rule under it, so without the extension
no frappe CSS reaches your editor.

Knobs are CSS custom properties. Public hooks are unprefixed `--code-*`, with
the default in the `var()` fallback at the use site, so you can set them on the
editor or on any ancestor. Internal variables take the `--_code-` prefix and may
change in any release.

| Hook                | Controls                                         | Default                 |
| ------------------- | ------------------------------------------------ | ----------------------- |
| `--code-bg`         | the surface behind the code                      | `var(--surface-gray-2)` |
| `--code-border`     | the box border colour                            | `transparent`           |
| `--code-radius`     | the box corner radius                            | `var(--radius-md)`      |
| `--code-focus-ring` | the focus ring colour                            | `var(--outline-gray-3)` |
| `--code-font-size`  | the code font size                               | `13px`                  |
| `--code-padding`    | the content inset                                | `6px 8px`               |
| `--code-min-height` | the content min-height                           | `auto`                  |
| `--code-max-height` | the height cap that drives [overflow](#overflow) | `none`                  |

**This table is provisional.** The list is settled by the `@framework/ui` field
spike, which is what proves which knobs `subtle` versus `outline`, and
`xs|sm|md|lg`, actually need. Adding a hook later is additive; renaming one is
not.

There is no `variant` prop and no `size` prop. They are var sets your wrapper
applies:

```css
.my-code-field[data-variant='outline'] {
  --code-border: var(--outline-gray-3);
}
.my-code-field[data-size='sm'] {
  --code-font-size: 12px;
  --code-padding: 6px 8px;
}
```

Dark mode needs no reconfiguration. Both the hooks and the highlight style
resolve `--ink-*` and `--surface-*` tokens, and those remap under the app's
colour scheme on their own. No second theme, no `Compartment`, no JS
observation.

## Overflow

`<CodeEditorContent>` emits `overflow: [boolean]` when the content crosses its
height cap, and only on transitions. It also sets `data-overflowing` on its
root, so a fade mask needs no JavaScript:

```css
[data-slot='code-editor-content'][data-overflowing]::after {
  /* the mask */
}
```

The signal exists because CSS cannot measure the crossing: a cap clips silently,
and no selector matches "this element is scrolling". frappe-ui draws no expand
affordance itself. It emits the boolean and sets the attribute. The button, the
pill and the dialog belong to your app.

The part also sets `data-scrolled-x` while the code is scrolled sideways. The
frappe chrome uses it to fade a shadow in beside the gutter. It is an internal
flag, not part of the frozen surface: read it if it helps, but it can change in
a minor release.

## Build your own field

This is the pattern to copy: a label, an expand button driven by `@overflow`,
and JSON pretty-print on `@change`. All three live in the story, not in
frappe-ui.

<ComponentPreview name="CodeEditor-Field" csr="true" />

## Composing without `<CodeEditor>`

When the wrapper is in the way, run `useCodeEditor` yourself and pass the view
to the part with `:editor`. An explicit `:editor` always wins over the injected
one, so the parts work with no wrapper component at all.

<ComponentPreview name="CodeEditor-Primitives" csr="true" />

Inside `<CodeEditor>`, the `:editor` prop is optional: the part reads the view
from context.

## Recipes

The composable hands back the `EditorView`, so every recipe is raw CodeMirror:

```ts
// insert at the cursor
view.dispatch(view.state.replaceSelection(text))

// focus
view.focus()

// read the document
view.state.doc.toString()

// replace the document, keeping history
view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: next } })

// open the search panel
openSearchPanel(view) // from @codemirror/search
```

**Never call `view.setState()`.** It replaces the whole state configuration, and
the engine's own extensions are not in the array you passed: the update listener
behind `v-model`, the focus and blur handlers behind `change`, and the
`readOnly` and `editable` facets behind the `editable` prop. The view keeps
rendering and the colours survive, so the failure is quiet: typing stops writing
the model, `change` stops firing, and `editable: false` reverts to editable,
until the next `extensions` or `editable` change rebuilds the configuration.
Replace the document with the `dispatch` above.

From a parent's script, reach the view through a template ref. `<CodeEditor>`
exposes it as `editor` (type `CodeEditorExposed`). It is the view, not a ref:
Vue unwraps a handed-back ref at the expose boundary, so write
`el.value?.editor?.focus()`. The composable is the other way round —
`useCodeEditor` returns a `ShallowRef`, because a composable crosses no
boundary.

**JSON linting** is two lines in the extension array. The `json` language welds
no linter on, because the library no longer inspects the language:

```ts
import { json, jsonParseLinter } from '@codemirror/lang-json'
import { linter, lintGutter } from '@codemirror/lint'

const extensions = [CodeKit, json(), lintGutter(), linter(jsonParseLinter())]
```

`@codemirror/lint` is an optional peer as well, so only an app that follows this
recipe installs it.

## Languages

`loadLanguage(key)` dynamically imports the matching `@codemirror/lang-*`
package and returns the extension.

```ts
import { loadLanguage } from 'frappe-ui/code-editor'

const language = shallowRef(null)
loadLanguage(df.options)
  .then((extension) => (language.value = extension))
  // The throw names the package to install. Swallow it and nobody reads it.
  .catch((error) => console.error(error))

const extensions = computed(() => [CodeKit, language.value].filter(Boolean))
```

Ten keys: `json`, `html`, `javascript`, `python`, `sql`, `markdown`, `css`,
`scss`, `yaml`, `xml`. Anything else resolves to `null`, which is plain text.
`scss` maps to `@codemirror/lang-sass` with `{ indented: false }`; there is no
`@codemirror/lang-scss`.

A missing package throws an error that names the one to install:

```
[frappe-ui] loadLanguage('sql') could not load @codemirror/lang-sql: Cannot find module '@codemirror/lang-sql'. If it is not installed: yarn add @codemirror/lang-sql
```

### Building with only the packages you installed

The ten imports are literal, so Vite resolves every one of them ahead of time. A
package you did not install ends the production build before `loadLanguage` can
say anything:

```
[vite]: Rollup failed to resolve import "@codemirror/lang-sql"
```

and it ends `vite dev`, which exits during dependency pre-bundling:

```
Error during dependency optimization:
✘ [ERROR] Could not resolve "@codemirror/lang-sql"
```

frappe-ui's Vite plugin answers both. It replaces an absent package with a stub
that throws when `loadLanguage` reaches it, so the build and the dev server
succeed and the error is the install hint above.

```js
// vite.config.js
import frappeui from 'frappe-ui/vite'

export default { plugins: [frappeui()] }
```

It is on by default. Pass `frappeui({ codeLanguages: false })` to turn it off,
or import `codeLanguages` on its own if you compose your own plugin list. An app
that builds without it must install all ten packages.

## Exports

Everything below is importable from `frappe-ui/code-editor`. There are no
code-editor exports from top-level `frappe-ui` and none from `frappe-ui/editor`.

```ts
import { CodeEditor, CodeEditorContent, CodeKit } from 'frappe-ui/code-editor'
```

### Engine

| Export          | What it is                                                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useCodeEditor` | Creates and owns an `EditorView` from an options object. Returns a `ShallowRef<EditorView \| null>` and nothing else: no facade, no helper verbs. |

Options: `content` (`Ref<string>`, two-way), `extensions` (required, reactive),
`editable` (default `true`, reactive), `autofocus` (one-shot at mount), and the
`onUpdate`, `onChange`, `onFocus`, `onBlur` callbacks.

### Components

| Export              | What it is                                                                                                                                           |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CodeEditor`        | Renderless. Props: `extensions` (required), `editable`, `autofocus`. `v-model` is the content. Emits `update:modelValue`, `change`, `focus`, `blur`. |
| `CodeEditorContent` | The box. Appends `view.dom`, takes an optional `:editor`, emits `overflow`, sets `data-slot` and `data-overflowing`.                                 |

### Kit

| Export    | What it bundles                                                                                                                                                                            |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `CodeKit` | Eight configurable members plus a fixed base of everything else `basicSetup` carries. Configure or remove any member with `CodeKit.configure({ member: options })` or `{ member: false }`. |

### Extensions

frappe's own, each also a `CodeKit` member. Pass them standalone when you
hand-assemble.

| Export          | What it is                                                                                                            |
| --------------- | --------------------------------------------------------------------------------------------------------------------- |
| `codeChrome`    | Adds the frappe chrome class the package stylesheet and the `--code-*` hooks hang off.                                |
| `codeHighlight` | The frappe syntax colours, as a `HighlightStyle`. Resolves `--ink-*` tokens, so it follows the colour scheme.         |
| `codeKeymap`    | Tab and Shift-Tab indent and dedent; Escape blurs the editor (WCAG 2.1.2: without it a keyboard user cannot tab out). |

There is no placeholder wrapper: `@codemirror/view` already exports
`placeholder()`.

### Languages

| Export         | What it is                                                                                                        |
| -------------- | ----------------------------------------------------------------------------------------------------------------- |
| `loadLanguage` | `(key?: string) => Promise<Extension \| null>`. Dynamically imports one of the ten `@codemirror/lang-*` packages. |

### Types

`CodeEditorOptions`, `CodeEditorExposed`, `CodeKitOptions`, `CodeKitExtension`,
`LanguageKey`.

`CodeKitExtension` is what `CodeKit` and `CodeKit.configure()` are: an
`Extension` with a `.configure()` on it. Annotate a variable, a prop or a
factory return with it.

## Migration from `frappe-ui/experimental`

`frappe-ui/experimental`'s `CodeEditor` and `CodePreview` are deleted.
`CodeEditor` is replaced by this family, and the field shape it had moves to
`@framework/ui` in frappe/frappe. `CodePreview` is a markdown renderer, not a
code editor, and leaves frappe-ui with it.

| v0                                             | v1                                                |
| ---------------------------------------------- | ------------------------------------------------- |
| `language="json"`                              | `:extensions="[CodeKit, json()]"`                 |
| `variant` / `size` props                       | CSS var sets on the wrapper ([Styling](#styling)) |
| `placeholder="SELECT 1"`                       | `CodeKit.configure({ placeholder: 'SELECT 1' })`  |
| `label` / `description` / `error` / `required` | drawn by the app's field                          |
| `--cm-max-height`                              | `--code-max-height`                               |
| automatic JSON lint                            | the two-line [recipe](#recipes)                   |
| `@overflow` on the field                       | `@overflow` on `<CodeEditorContent>`              |
