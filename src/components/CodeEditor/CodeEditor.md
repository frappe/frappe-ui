# CodeEditor

A CodeMirror 6 code field with syntax highlighting, theming that follows the
app's light/dark scheme, and an optional sanitized preview. CodeMirror is
lazy-loaded, so apps that never render a code field pay no runtime cost.

CodeEditor ships from its own subpath so the CodeMirror dependency only loads
for apps that opt in:

```js
import { CodeEditor, CodePreview } from 'frappe-ui/code-editor'
```

## Playground

<ComponentPlayground name="CodeEditor" />

<ComponentPreview name="CodeEditor-Default" layout="stacked" class="mt-4" />

## Languages

Pass a `language` key to enable highlighting. Each language tree-shakes into
its own async chunk, loaded on demand. Supported keys: `json`, `html`,
`javascript`, `python`, `sql`, `markdown`, `css`, `scss`, `yaml`, `xml`, and
`plain` (the default — no highlighting). Unknown keys fall through to plain
text. `json` additionally wires an inline lint gutter so invalid JSON is
flagged at its position.

## Variants

The surface mirrors frappe-ui's input convention so a code field sits flush
with the TextInput/Textarea fields around it. `subtle` is the filled default and
`outline` is a bordered box on white. The borderless `ghost` variant is
intentionally not offered — a code surface without a border reads as plain text
and loses the affordance that it's an editable field.

<ComponentPreview name="CodeEditor-Variants" />

## Sizes

`size` mirrors the frappe-ui input sizes (`sm | md | lg | xl`, default `md`),
scaling the editor's font size and minimum height.

<ComponentPreview name="CodeEditor-Sizes" />

## Max height

The height cap is a CSS hook, not a prop — set the `--cm-max-height` custom
property on the root to any CSS length and content past the cap scrolls
internally:

```vue
<CodeEditor v-model="code" style="--cm-max-height: 12rem" />
```

Pair it with the `overflow` emit (fired only when the content crosses the cap)
to drive an expand/collapse affordance — that's the one piece you can't measure
from CSS yourself.

<ComponentPreview name="CodeEditor-MaxHeight" />

## Preview

`CodePreview` is a separate, display-only primitive that renders sanitized
output for the two languages with a meaningful preview — `markdown` (rendered
via `marked`) and `html`. Both are passed through DOMPurify before rendering;
any other language renders nothing. The writer and preview are independent, so
how you compose them — editor-only, a Write/Preview toggle, or a side-by-side
split — is up to the consumer.

<ComponentPreview name="CodeEditor-Preview" />

## Labeling

CodeEditor implements the shared input labeling contract (`label`,
`description`, `error`, `required`). When something needs the chrome it renders
a wrapping field; otherwise the editor mounts bare, so the primitive's
footprint is unchanged. Setting `error` flips the field to its invalid state
(`data-state="invalid"`, `aria-invalid`) and renders the message below; the
ARIA wiring is applied to the editor's internal content element so it reaches
the focusable control.

<ComponentPreview name="CodeEditor-Labeling" />

## Keyboard

| Keys | Action |
| --- | --- |
| `Tab` / `Shift`+`Tab` | Indent / dedent the current line or selection |
| `Escape` | Release focus so `Tab` moves to the next field |

`Tab` is rebound to indent (the editor default is a focus-move). `Escape`
blurs the editor so keyboard users can still tab on — the standard CodeMirror
keyboard-trap escape hatch (WCAG 2.1.2).

## Commit contract

`update:modelValue` fires live on every change (mirrors the textarea field
contract); `change` fires on blur, the commit point where a wrapper would
normalize the value (e.g. JSON pretty-print). External `modelValue` changes
are diffed into the view so the caret, selection, and scroll position survive
a live transform.

<!-- @include: ./CodeEditor.api.md -->
