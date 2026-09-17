# Code Editor Family API Spec

Status: accepted direction for `frappe-ui` v1.

This document defines the v1 API for the code-editor family: the CodeMirror 6
engine, the renderless `<CodeEditor>` component built on it, the content part,
the kit that supplies good defaults, and the extensions. The family ships at a
new subpath, `frappe-ui/code-editor`. It supersedes the field-shaped
`CodeEditor` in `frappe-ui/experimental`.

The decisions come from an audit of every code-editor call site in frappe
(Desk), frappe's `ui/` package (`@framework/ui`), and builder. The architectural
shape is decided in
[ADR-0019](./adr/0019-code-editor-family-composition-model.md), which applies
[ADR-0004](./adr/0004-editor-family-composition-model.md)'s composition model to
a second engine. The sibling document is [`editor.md`](./editor.md). Vocabulary
is in [`../CONTEXT.md`](../CONTEXT.md); design rules cited as `P1` to `P15` live
in [`../PHILOSOPHY.md`](../PHILOSOPHY.md).

## Scope

This spec covers:

- the `frappe-ui/code-editor` subpath surface (engine, component, content part,
  kit, extensions, language loader)
- the public API of `useCodeEditor`, `<CodeEditor>`, and `<CodeEditorContent>`
- the three-layer styling model and its CSS custom-property hooks
- the reactive `extensions` contract and the content commit model
- the overflow signal
- the recommended "build your app's field on `<CodeEditor>`" pattern

Out of scope:

- a labeled field. The Desk/FormLayout field lives in `@framework/ui`
  (`apps/frappe/ui`), not here
- `CodePreview`. It leaves frappe-ui with this change, see §16
- the final CSS custom-property hook list. §11's table is provisional, see Open
  questions

## Decision summary

- one new subpath: `frappe-ui/code-editor`. Nothing at root, nothing on
  `frappe-ui/editor`
- **no labeled field and no assembled editor**. The library ships the engine,
  the parts, the kit, and the extensions. Each app builds its own field
- capability is a **required `extensions` array of raw CodeMirror `Extension`
  values**. No `language` prop, no feature booleans
- CodeMirror is a **static** import in the engine. No `await import()` inside
  the library for the engine
- `<CodeEditor>` is **renderless**. `<CodeEditorContent>` renders the box and
  appends `view.dom`. There are no menu parts, because CodeMirror owns its own
  DOM
- `useCodeEditor` returns `ShallowRef<EditorView | null>` and nothing else
- `extensions` is **reactive**. The engine re-applies it with a top-level
  `StateEffect.reconfigure`. No `Compartment` in the public API
- styling is three independently removable layers: CodeMirror's base styles, the
  `codeChrome` extension, the `codeHighlight` extension. No `variant` prop, no
  `size` prop
- content is the unnamed `v-model`. `update:modelValue` fires on every doc
  change, `change` fires on blur and is the commit point
- `CodeKit` is one configurable bundle in the `.configure()` mold. It has eight
  members, and each is removable with `false`
- the ten `@codemirror/lang-*` packages move from `dependencies` to optional
  `peerDependencies`. `loadLanguage(key)` still dynamic-imports them

**The governing principle: ship a small surface, grow it later.** Every name in
the public surface freezes at the `1.0.0` tag. P15 states it: an export at
`1.0.0` freezes under P13 until `2.0.0`, while adding one later is always
additive. So each name has to earn its place now. `CodeKit`'s member list and
§11's hook list both shrink for that reason.

## Public surface

```ts
import {
  // Engine
  useCodeEditor,

  // Components
  CodeEditor, // renderless: owns the view, provides it, exposes it
  CodeEditorContent, // the box; appends view.dom

  // Kit: one configurable extension bundle
  CodeKit,

  // Individual extensions (each also a CodeKit member)
  codeChrome, // frappe chrome class + the CSS var contract
  codeHighlight, // frappe syntax colours (tags need an extension)
  codeKeymap, // Tab/Shift-Tab indent, Escape blurs

  // Languages
  loadLanguage, // dynamic-imports the matching @codemirror/lang-* package

  // Types
  type CodeEditorOptions,
  type CodeEditorExposed,
  type CodeKitOptions,
  type CodeKitExtension,
  type LanguageKey,
} from 'frappe-ui/code-editor'
```

frappe-ui re-exports nothing from CodeMirror. `Extension`, `EditorView`,
`EditorState` and every language package are imported by the consumer from their
own packages. `@codemirror/state` and `@codemirror/view` are direct dependencies
of this subpath, so they are already installed.

There are three standalone extension exports, and they are frappe's own:
`codeChrome`, `codeHighlight`, `codeKeymap`. frappe-ui ships no placeholder
wrapper. `@codemirror/view` already exports `placeholder()`, so a wrapper would
add a name frappe-ui owns and nothing else (§10).

There are no code-editor exports from top-level `frappe-ui` and none from
`frappe-ui/editor`.

## 1. Why a subpath

[ADR-0010](./adr/0010-subpath-export-rule.md) earns a subpath on three limbs
(P15). This family takes all three:

- **(a) cost isolation.** The engine statically imports `@codemirror/state` and
  `@codemirror/view`. Root must not carry them.
- **(b) extensible registry.** `extensions` accepts any CodeMirror `Extension`,
  including third-party ones the library never defined.
- **(c) name collision.** `Editor`, `EditorContent`, `Extension`, `Compartment`,
  `Code` and `CodeBlock` already mean TipTap things at root and on
  `frappe-ui/editor`.

ADR-0010's table currently records `frappe-ui/code-editor` as removed, on the
basis that CodeMirror was entirely behind `await import()` and that `CodeEditor`
was a form-field sibling of `Textarea`. Both premises change here: the engine
imports CodeMirror statically (§3), and the family is a composition model, not a
field. That row is amended in ADR-0010 itself, not in this document.

## 2. Ownership: frappe-ui ships the family, apps ship the field

frappe-ui ships the engine, the parts, the kit, and the extensions. It ships no
labeled field and no ready-made assembled editor. The Desk/FormLayout code field
moves to `@framework/ui` in frappe/frappe (`apps/frappe/ui`).

This is ADR-0004's "no ready-mades" applied a second time. It also takes P5's
`Editor` carve-out as written: a renderless component has nowhere to draw a
label, description, error, or required marker, so P5's four labeling props do
not apply. Labeling is layout, and layout belongs to the consumer.

The practical reason is the same one ADR-0004 found for comments: no two code
fields match. Desk needs `df.options` to pick a language and a `User`-level
keymap preference. framework-ui needs a variant, a size, an expand pill, a fade
mask, and JSON pretty-print on blur. Builder needs a `7xl` dialog, a dirty dot,
server-fed completions, and a custom search panel. A single library field would
fit none of them.

## 3. CodeMirror is a static import

The engine imports `@codemirror/state` and `@codemirror/view` statically. So
does whatever `CodeKit` needs. There is no `await import()` inside the library
for the engine.

The reason is that the deferral bought nothing. A consumer's `extensions` array
imports `@codemirror/lang-sql` and friends at module scope, which pulls
CodeMirror into that consumer's chunk anyway. The dynamic import only moved the
cost, and it charged for it: today's implementation carries module-scope
`let cmView` / `let cmState` handles, a `langSeq` staleness token for stale
async language builds, and a window on every render where `view` is `null`.

Apps that want the bytes deferred defer the component, not the library:

```ts
const CodeField = defineAsyncComponent(() => import('./CodeField.vue'))
```

Builder already loads its code panel this way.

## 4. `useCodeEditor`: the engine

Owns the `EditorView` lifecycle, binds content, applies the reactivity model,
and destroys the view on unmount.

```ts
function useCodeEditor(options: {
  content?: Ref<string> // two-way, see §8
  extensions: MaybeRefOrGetter<Extension[]> // REQUIRED, reactive
  editable?: MaybeRefOrGetter<boolean> // default true, reactive
  autofocus?: boolean // construction-time
  onUpdate?: (view: EditorView) => void // every doc change
  onChange?: (view: EditorView) => void // blur, the commit point
  onFocus?: (view: EditorView, event: FocusEvent) => void
  onBlur?: (view: EditorView, event: FocusEvent) => void
}): ShallowRef<EditorView | null>
```

**Content binds as `content?: Ref<string>`.** This is decided, not a proposal.
It mirrors `useEditor` on `frappe-ui/editor`. A getter plus a callback would
diverge from the sibling family a second time for no benefit.

`extensions` is required. There is no implicit default list. Pass at least
`[CodeKit]`, or hand-assemble. This is what keeps the engine free of baked-in
capability.

The view is created without a `parent`, so `view.dom` is detached until a
content part appends it. `<CodeEditorContent>` does the appending. This mirrors
how tiptap's `EditorContent` mounts a `useEditor` instance.

The composable returns the `EditorView` unwrapped, and nothing else. No helper
object, no standalone helper functions. This is the house pattern: `useEditor`
returns the tiptap instance, and
[ADR-0016](./adr/0016-charts-expose-echarts-instance.md) /
[ADR-0018](./adr/0018-charts-engine-composable-is-public.md) hand back the
echarts instance. The recipes a consumer needs are raw CodeMirror one-liners,
listed in §12.

## 5. `<CodeEditor>`: the component

Renderless. It runs `useCodeEditor`, provides the view to its subtree, and hands
it out through the `#default` slot and through `defineExpose`. It renders no
element of its own.

```ts
const model = defineModel<string>()

defineProps<{
  extensions: Extension[] // REQUIRED, reactive
  editable?: boolean // default true, reactive
  autofocus?: boolean // default false
}>()

defineSlots<{
  default?(props: { editor: EditorView | null }): any
}>()

defineEmits<{
  'update:modelValue': [value: string] // every doc change
  change: [value: string] // blur: the commit point
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

// Sanctioned template-ref escape hatch (ADR-0012): a parent's script reaches
// the live view without owning its lifecycle.
//
// Unwrapped, and through a getter: Vue unwraps a handed-back ref at the proxy
// boundary, so a declared `ShallowRef` would describe a shape no caller reads
// and would leave the engine's ref writable from outside
// (`spec/imperative-api.md` sections 2.2 and 2.5). `useCodeEditor` still
// returns the ref: a composable crosses no boundary.
defineExpose<CodeEditorExposed>({
  get editor() {
    return editor.value
  },
})
```

There is no `placeholder` prop. Placeholder text is a `CodeKit` member (§10),
because capability travels in the extension array. Without the kit, pass
CodeMirror's own `placeholder('SELECT 1')` from `@codemirror/view`.

The provide/inject mechanism is the one the editor family already uses
(`src/molecules/editor/editor-context.ts`), per ADR-0004's implementation
amendment.

`defineExpose` earns its place under
[ADR-0012](./adr/0012-template-ref-surface.md)'s test: a parent's script needs
the view (to focus it, to insert at the cursor, to open the search panel) and no
other surface reaches it from script. The exposed member is the view ref itself,
not a set of verbs, so no new verbs join the imperative surface.

## 6. `<CodeEditorContent>`: the box

Renders the bordered box and appends `view.dom` into it. Sets a stable
`data-slot` for styling (P10) and `data-overflowing` for the fade mask (§9).
Class fallthrough is the normal root `class=""` binding, no class-name prop
(P10).

```ts
defineProps<{
  editor?: EditorView | null // optional: falls back to the injected view
}>()

defineEmits<{
  overflow: [overflowing: boolean] // only on transitions
}>()
```

```vue
<CodeEditorContent class="min-h-40" />
```

The `editor` prop is optional and resolves to the injected view when omitted. An
explicit `:editor` always wins, even when it is `null`. That is what keeps the
composable-plus-part path (L4 in `editor.md`) available with no wrapper
component, the same rule `EditorContent` follows.

**There are no menu parts.** CodeMirror renders its own gutters, panels,
tooltips, completion popups, and search UI inside `view.dom`. A frappe-ui
`CodeEditorToolbar` would have nothing to draw that CodeMirror does not already
draw, or would have to reach into DOM it does not own. That is why the part list
is two components long and the editor family's is seven.

## 7. Reactivity

| Option              | Reactive?    | Notes                                                     |
| ------------------- | ------------ | --------------------------------------------------------- |
| Content (`v-model`) | yes, two-way | the defining reactive surface, §8                         |
| `extensions`        | yes          | top-level `StateEffect.reconfigure` on change             |
| `editable`          | yes          | sugar over `EditorState.readOnly` + `EditorView.editable` |
| `autofocus`         | no           | one-shot at mount                                         |

`extensions` is `MaybeRefOrGetter<Extension[]>`. The engine watches it and
dispatches a single top-level reconfigure:

```ts
view.dispatch({ effects: StateEffect.reconfigure.of(toValue(extensions)) })
```

Doc, selection, history, and fold state survive the swap, because CodeMirror
keys state fields by extension identity: a field whose source extension is still
present is carried over. No `Compartment` appears in the public API. A consumer
that wants finer-grained control still may use one, because it is a plain
`Extension` and travels in the array like any other.

**The honest cost.** `extensions` is construction-time on `frappe-ui/editor` and
reactive here. The divergence reflects the engines. TipTap cannot swap
extensions on a live editor, CodeMirror is built to. The runtime cases are real:
Desk picks the language at runtime from `df.options`, and Builder's
`activeScript.script_type` changes while the panel is mounted.

## 8. Content and the commit point

Content is the primary value: the unnamed `v-model` on the component, a
`Ref<string>` option on the composable (P2). The composable's binding is
decided: `content?: Ref<string>`, mirroring `useEditor`. No benefit in diverging
twice from the sibling family.

Two channels:

- `update:modelValue` fires on every doc change. This is what `v-model` binds.
- `change` fires on a blur that follows an edit. This is the commit point. A
  blur with no edit behind it emits nothing: `change` means the document
  changed, the same as it does on `frappe-ui/editor`, and a save or a dirty
  marker must not run on a document nobody touched. The engine tracks it with a
  flag set by the update listener and cleared on focus and on commit, so an
  external `v-model` write never counts as an edit.

The evidence for two channels is in the consumers. framework-ui pretty-prints
JSON on blur, and would reformat under the user's caret on every keystroke if it
used the live channel. Builder commits the script and clears its dirty dot on
blur. The composable takes the same pair as `onUpdate` and `onChange`.

Note the divergence from `frappe-ui/editor`, where `change` fires on every
content update. The timing is the whole divergence: on both families a `change`
means the document changed. CodeMirror's contenteditable fires no native
`change` event, so nothing falls through to the consumer from the DOM. The
blur-commit semantic has to be emitted, and this is the name for it.

**External-write contract.** When `v-model` is written from outside, the engine
does not replace the document. It computes the longest common prefix and the
longest common suffix (clamped so the two cannot overlap) and dispatches one
change covering only the differing middle span. CodeMirror maps the live
selection through that change, so:

- the caret and the selection survive an external write that does not touch them
- the scroll position survives
- an in-flight IME composition is not aborted

The engine also suppresses the echo: the update listener must not write an
external change back out as `update:modelValue`. This is a contract, not an
implementation note. Tests pin it.

## 9. Overflow

`<CodeEditorContent>` emits `overflow: [boolean]` when the content crosses its
height cap, and only on transitions. It also sets `data-overflowing="true"` on
its root, so a fade mask needs no JavaScript:

```css
[data-slot='code-editor-content'][data-overflowing='true']::after {
  /* the mask */
}
```

The signal exists because CSS cannot measure the crossing. A height cap clips
silently, and no selector matches "this element is scrolling". Three consumers
draw an expand affordance off exactly this fact: Desk toggles 300px to 600px,
framework-ui shows an expand pill plus the mask fade, Builder opens a `7xl`
dialog.

frappe-ui draws none of them. It emits the boolean and sets the attribute.

## 10. `CodeKit`

One configurable bundle, in the `StarterKit` mold. Every member is configured or
removed through `.configure()`:

```ts
CodeKit.configure({
  lineNumbers: {}, // turn a default-off member on
  placeholder: 'SELECT 1', // member takes its text
  autocompletion: false, // remove a member
  foldGutter: false,
})
```

**The kit has eight members.** Five wrap CodeMirror extensions: `lineNumbers`,
`foldGutter`, `autocompletion`, `search`, `placeholder`. Three are frappe's:
`chrome` (`codeChrome`), `highlight` (`codeHighlight`), `keymap` (`codeKeymap`).

- Members are removable with `false`.
- Every member is typed with the real options type of the extension it wraps, so
  a misspelled key is a compile error. This is ADR-0004's 2026-09-15 amendment
  applied here.
- `highlight` is the syntax-highlighting slot. It carries the frappe tag colours
  instead of CodeMirror's `defaultHighlightStyle`, so there is one member there,
  not two.
- `keymap` is `codeKeymap`: Tab and Shift-Tab indent and dedent, Escape blurs
  the editor. Escape is a WCAG 2.1.2 obligation: without it a keyboard user who
  tabs into the editor cannot tab out.
- Two defaults differ from `basicSetup`: `lineNumbers` is `false` (Builder's
  default, and what the Desk field shows), and `placeholder` carries no text.
- The three frappe members are also exported standalone: `codeChrome`,
  `codeHighlight`, `codeKeymap`. Placeholder text gets no standalone export,
  because `@codemirror/view` already exports `placeholder()`. The kit still
  keeps a `placeholder` member, and that is not an oversight: the member takes
  text, while the standalone exports are extensions.
- **Export names are camelCase values.** `codeChrome`, `codeHighlight` and
  `codeKeymap` match CodeMirror's own `lineNumbers()` and `history()`, not the
  editor family's PascalCase tiptap objects. `CodeKit` stays PascalCase, as a
  kit.
- **`lint` is not a member.** That is what keeps `@codemirror/lint` an optional
  peer (§13), and it matches the JSON-lint non-goal in §14.

**Everything else `basicSetup` carries stays in the kit as a fixed base.** A
fixed-base extension is not a member and is not configurable: `history`,
`bracketMatching`, `closeBrackets`, `drawSelection`, `dropCursor`,
`indentOnInput`, `highlightActiveLine`, `highlightSelectionMatches`,
`rectangularSelection`, `crosshairCursor`, `highlightSpecialChars`,
`allowMultipleSelections`, and the default keymaps.

**Why these five and not all of `basicSetup`.** The audit names the five that
real consumers toggle:

- Builder defaults `lineNumbers` off, and Desk shows them.
- Builder turns `foldGutter` on.
- Desk disables `autocompletion` unless the field supplies completions.
- Builder swaps the `search` panel through `createPanel`.
- Placeholder text varies per field.

Nobody in the audit has ever toggled `crosshairCursor`. A member is a name
frappe-ui owns until `2.0.0` (P13, P15), so a member that renames a CodeMirror
export and is never toggled is cost with no benefit. A member can be added later
without a break. Removing one cannot.

If a consumer needs a fixed-base extension configured differently, it
hand-assembles instead of using the kit. That path is first-class, and it is
documented right below.

**The kit is a value you may pass or ignore.** Nothing in the engine knows
whether you used it. All three of these are first-class:

```ts
extensions: [CodeKit, sql()] // the kit
extensions: [basicSetup, sql()] // CodeMirror's own bundle
extensions: [history(), keymap.of(defaultKeymap), sql(), myExtension] // hand-assembled
```

A configurable kit exists, rather than documentation pointing at `basicSetup`,
because `basicSetup` is a flat array. No member can be removed from it. That is
exactly why Builder hand-assembled 20 extensions in
`frontend/src/utils/createCodeMirrorState.ts` instead of using it.

## 11. Styling: three removable layers

| Layer                  | Ships as                      | Removable by                |
| ---------------------- | ----------------------------- | --------------------------- |
| CodeMirror base styles | CodeMirror itself             | not removable, and not ours |
| frappe chrome          | the `codeChrome` extension    | omitting the extension      |
| frappe syntax colours  | the `codeHighlight` extension | omitting the extension      |

**Nothing is ambient.** `codeChrome` adds one class to the editor's root and the
package stylesheet scopes every frappe rule under it. If you do not pass the
extension, no frappe CSS reaches your editor. Syntax colours need an extension
in any case: CodeMirror maps Lezer tags to classes through
`syntaxHighlighting(HighlightStyle.define(...))`, which plain CSS cannot do.

**Knobs are CSS custom properties**, per
[ADR-0017](./adr/0017-css-variable-styling-hooks.md). Public hooks are
unprefixed `--code-<knob>`, with defaults in `var()` fallbacks at the use site
so they are settable on the editor or on any ancestor:

**This table is provisional.** This spec does not freeze it. The list is settled
by the `@framework/ui` field spike, see Open questions.

| Hook (provisional)  | Controls                      |
| ------------------- | ----------------------------- |
| `--code-bg`         | the surface behind the code   |
| `--code-border`     | the box border colour         |
| `--code-radius`     | the box corner radius         |
| `--code-focus-ring` | the focus ring colour         |
| `--code-font-size`  | the code font size            |
| `--code-padding`    | the content inset             |
| `--code-min-height` | the content min-height        |
| `--code-max-height` | the height cap that drives §9 |

`--code-max-height` replaces today's `--cm-max-height`. The vendor-style `--cm-`
prefix names no family and breaks ADR-0017's naming rule. Internal variables
take the `--_code-` prefix and may change in any release. Today's
`--cm-text-height`, written by the component to size the gutter shadow, becomes
`--_code-text-height`.

**There is no `variant` prop and no `size` prop.** They become var sets the
consumer's wrapper applies:

```css
.my-code-field[data-variant='outline'] {
  --code-border: var(--outline-gray-3);
}
.my-code-field[data-size='sm'] {
  --code-font-size: 12px;
  --code-padding: 6px 8px;
}
```

**Dark mode needs no reconfiguration at all.** Both the hooks and the highlight
style resolve `var(--ink-*)` and `var(--surface-*)` tokens, and those tokens
already remap under the app's colour scheme. No JS observation, no second theme
to swap, no `Compartment` holding a dark variant. This deletes the
`Compartment`-plus-`useDark` dance Builder maintains today.

It also deletes the 272 lines of style literals in the current `theme.ts`, and
the `variant` and `size` compartments in `CodeEditor.vue` that feed them. Those
files carry comments describing what they cost, in their own words: font size is
kept out of the base theme because setting it in both places "would fight that
theme on equal specificity and, depending on StyleModule injection order,
silently win and pin every size to 13px". A CSS variable read at one use site
has no such ordering problem.

## 12. Recipes

The composable hands back the `EditorView`, so every recipe is raw CodeMirror.

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

**JSON linting.** The `json` language no longer welds a linter on. It is two
lines in the extension array:

```ts
import { json, jsonParseLinter } from '@codemirror/lang-json'
import { linter, lintGutter } from '@codemirror/lint'

const extensions = [CodeKit, json(), lintGutter(), linter(jsonParseLinter())]
```

This recipe is prominent in the docs because `Code` with `options: JSON` (34
fields) plus the `JSON` fieldtype (8 fields) is the most common code field in
Frappe.

## 13. Languages

`loadLanguage(key)` survives, with the same shape:

```ts
function loadLanguage(key?: string): Promise<Extension | null>
```

Keys, unchanged: `json`, `html`, `javascript`, `python`, `sql`, `markdown`,
`css`, `scss`, `yaml`, `xml`. Anything else resolves to `null`. `scss` maps to
`@codemirror/lang-sass` with `{ indented: false }`; there is no
`@codemirror/lang-scss`.

**The ten `@codemirror/lang-*` packages move from `dependencies` to optional
`peerDependencies`** (`peerDependenciesMeta.*.optional`). Today every app that
installs frappe-ui downloads all ten, whether or not it ever renders a code
editor. `@codemirror/lint` moves with them, and it stays optional: `CodeKit` has
no `lint` member and carries no `lintKeymap`, so the kit never imports
`@codemirror/lint` (§10). Only an app that follows §12's lint recipe installs
it.

`loadLanguage` fails with an error that names the package to install:

```
loadLanguage('sql') could not load @codemirror/lang-sql: Cannot find module '@codemirror/lang-sql'. If it is not installed: yarn add @codemirror/lang-sql
```

The precedent is commit `33bd680`, which declared the vitepress entry's
transitive imports as optional peers for the same reason.

`loadLanguage` stays because two consumers already wrote the same
key-to-language switch by hand: framework-ui's `Fields/fieldtypeToLanguage.ts`
and Builder's `createCodeMirrorState.ts`.

## 14. Non-goals

Each of these is absorbed by the `extensions` array, which is why none of them
is a library feature. The consumer named after each is the one that has it
today.

| Non-goal                        | Who has it                                                                              | What they pass                                                           |
| ------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| vim / emacs keymaps             | Desk (`User.code_editor_type`)                                                          | `@replit/codemirror-vim`                                                 |
| server-fed completions          | frappe (`get_autocompletion_items`), Builder (`builder.api.get_codemirror_completions`) | `autocompletion({ override })`                                           |
| a custom search panel           | Builder (mounts a Vue component)                                                        | `search({ createPanel })`                                                |
| Ctrl-S save, Ctrl-Enter execute | Desk, Builder                                                                           | `keymap.of([...])`                                                       |
| indentation markers             | Builder                                                                                 | a third-party extension                                                  |
| JSON linting                    | framework-ui                                                                            | §12's two-line recipe                                                    |
| diff view                       | nobody                                                                                  | Desk's "Compare Versions" is server-computed HTML, not an editor feature |
| multi-file tabs                 | nobody                                                                                  | Builder fakes it with `TabButtons` outside the editor                    |

JSON linting is the one deliberate regression. Today `buildLanguageExtension`
welds `lintGutter()` and `linter(jsonParseLinter())` on whenever the language is
`json`. The new family does not, because the language is no longer a prop the
library inspects. It becomes the documented recipe in §12.

## 15. The recommended pattern: build your app's field on `<CodeEditor>`

frappe-ui ships no field. Each app writes one thin component encoding its
conventions and reuses it at every call site. This is the "use this and move on"
answer. It lives in the app, where the app-specific shape belongs.

The real one is framework-ui's. It carries the label, description, error and
required markers (P5's contract, drawn by the app), maps `variant` and `size` to
CSS var sets, drives an expand pill off `@overflow`, and pretty-prints JSON on
`@change`:

```vue
<!-- apps/frappe/ui/src/components/CodeEditor.vue (abridged) -->
<script setup lang="ts">
import { CodeEditor, CodeEditorContent, CodeKit } from 'frappe-ui/code-editor'

const model = defineModel<string>()
const props = defineProps<{
  label?: string
  description?: string
  error?: string
  required?: boolean
  language?: Extension
  variant?: 'subtle' | 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg'
}>()

const expanded = ref(false)
const overflowing = ref(false)
const extensions = computed(() => [CodeKit, props.language].filter(Boolean))

function onChange(value: string) {
  if (!isJson.value) return
  try {
    model.value = JSON.stringify(JSON.parse(value), null, 2)
  } catch {}
}
</script>

<template>
  <div class="field" :data-variant="variant" :data-size="size">
    <label v-if="label">{{ label }}<span v-if="required">*</span></label>

    <CodeEditor v-model="model" :extensions="extensions" @change="onChange">
      <CodeEditorContent
        :class="expanded ? 'max-h-[600px]' : 'max-h-[300px]'"
        @overflow="overflowing = $event"
      />
    </CodeEditor>

    <Button
      v-if="overflowing"
      :label="expanded ? 'Collapse' : 'Expand'"
      @click="expanded = !expanded"
    />
    <p v-if="error">{{ error }}</p>
    <p v-else-if="description">{{ description }}</p>
  </div>
</template>
```

A second adapter maps the doctype field to a language:
`Fields/CodeEditorField.vue` runs `df.options` through `fieldtypeToLanguage`,
calls `loadLanguage`, and passes the result down. Because `extensions` is
reactive (§7), the language can arrive after mount with no remount and no lost
undo history.

The full component lives in frappe/frappe, not here.

## 16. Migration from `frappe-ui/experimental`

`frappe-ui/experimental`'s `CodeEditor` and `CodePreview` are **deleted** when
the family lands. P14 allows this with no deprecation window: `experimental`
carries no stability promise.

- `CodeEditor` is replaced by this family. The field shape it had moves to
  `@framework/ui`.
- `CodePreview` leaves frappe-ui entirely and becomes framework-ui's. It is a
  markdown renderer, not a code editor, and it never belonged to this family.
- `marked` stays a frappe-ui dependency regardless, because `frappe-ui/editor`'s
  `ContentPaste` extension imports `markdownToHTML` from
  `src/utils/markdown.ts`.

**No codemod ships.** The only importer anywhere is framework-ui's
`Fields/CodeEditorField.vue`, and it is rewritten by hand. That file currently
imports from `frappe-ui/code-editor`, a subpath that does not exist today, so it
is pinned to an old beta or already broken. ADR-0010's standing rule 5 (the
census must include frappe's `ui/` package) is what found it.

What changes for that one call site:

| v0                                             | v1                                               |
| ---------------------------------------------- | ------------------------------------------------ |
| `language="json"`                              | `:extensions="[CodeKit, json()]"`                |
| `variant` / `size` props                       | CSS var sets on the wrapper (§11)                |
| `placeholder="SELECT 1"`                       | `CodeKit.configure({ placeholder: 'SELECT 1' })` |
| `label` / `description` / `error` / `required` | drawn by the app's field                         |
| `--cm-max-height`                              | `--code-max-height`                              |
| automatic JSON lint                            | §12's two-line recipe                            |
| `@overflow` on the field                       | `@overflow` on `<CodeEditorContent>`             |

## Open questions

One question is left, and it is blocked, not merely open.

1. **The CSS custom-property hook list in §11 is provisional.** This spec does
   not freeze it.

It is settled by writing `@framework/ui`'s field against the family, and seeing
which knobs `subtle` versus `outline`, and `xs|sm|md|lg`, actually need.

Adding a hook later is additive and safe. Renaming or removing one after the
`1.0.0` tag is not. So the list ships as the minimum the spike proves, not as a
guess. The implementation PR ships only those hooks, and §11's table carries the
provisional marker in place until then.

**Sequencing.** The framework-ui field spike happens before the hook list
freezes.

Settled during review of this spec's PR: `CodeKit`'s member list and the export
names (§10), and the composable's content binding (§4, §8).

## Related documents

- [`editor.md`](./editor.md): the sibling family, same composition model,
  different engine
- [`../PHILOSOPHY.md`](../PHILOSOPHY.md): design rules (P1 to P15)
- [`../CONTEXT.md`](../CONTEXT.md): vocabulary
- [`adr/0019-code-editor-family-composition-model.md`](./adr/0019-code-editor-family-composition-model.md):
  this family's architectural shape
- [`adr/0004-editor-family-composition-model.md`](./adr/0004-editor-family-composition-model.md):
  one engine, one component, kits, no ready-mades
- [`adr/0010-subpath-export-rule.md`](./adr/0010-subpath-export-rule.md): what
  earns a subpath
- [`adr/0012-template-ref-surface.md`](./adr/0012-template-ref-surface.md): what
  earns a `defineExpose` member
- [`adr/0017-css-variable-styling-hooks.md`](./adr/0017-css-variable-styling-hooks.md):
  CSS hook naming
