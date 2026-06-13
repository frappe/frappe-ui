// Base CodeMirror theme + token-keyed syntax highlighting for CodeEditor, split
// out of the SFC so the ~200 lines of style literals don't drown the editor
// logic. Both helpers take the CodeMirror modules as params (rather than
// importing them) so the lazy-load isolation holds: this file pulls no editor
// code into the static graph — `@codemirror/language` / `@lezer/highlight` load
// via dynamic `import()` only when the editor actually mounts.
import type { Extension } from '@codemirror/state'

// lucide `chevron-down`, used as a CSS mask so the fold marker inherits the
// gutter's `currentColor` (and so flips with the theme) instead of baking a
// fill. Single-quoted attrs keep it embeddable in this double-quoted string.
const FOLD_CHEVRON =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")"

// Chrome theme. Every color is a frappe-ui `--surface-*` / `--ink-*` token, and
// those tokens are re-mapped under `[data-theme="dark"]` — so the editor follows
// the app's light/dark scheme for free (no JS observation, no second theme to
// swap). The literal fallbacks are the light values, used only when a consumer
// renders the editor outside the token system.
export function buildBaseTheme(
  cmView: typeof import('@codemirror/view'),
): Extension {
  return cmView.EditorView.theme({
    '&': {
      // Font size is owned by `buildSize` (the `size` compartment) — setting it
      // here too would fight that theme on equal specificity and, depending on
      // StyleModule injection order, silently win and pin every size to 13px.
      color: 'var(--ink-gray-8, #1e293b)',
      borderRadius: 'var(--radius-md, 0.5rem)',
      overflow: 'hidden',
      // Height cap, driven by the `--cm-max-height` CSS var the component sets
      // from the `maxHeight` prop (`none` when unset, so the editor grows to
      // fit). The inner `.cm-scroller` scrolls once content passes the cap.
      maxHeight: 'var(--cm-max-height, none)',
    },
    '&.cm-focused': {
      outline: 'none',
    },
    '.cm-scroller': {
      overflow: 'auto',
    },
    '.cm-content': {
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
      caretColor: 'var(--ink-gray-8, #1e293b)',
      padding: '6px 0',
      // Min-height is owned by `buildSize` (the `size` compartment) — see the
      // note on `&`'s font size above for why it isn't duplicated here.
    },
    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: 'var(--ink-gray-8, #1e293b)',
    },
    '.cm-line': {
      padding: '0 6px',
    },
    // Transparent so the gutter inherits whatever surface the active variant
    // paints (gray-2 for `subtle`, white for `outline`) — otherwise a hardcoded
    // gutter color seams against the filled `subtle`
    // surface. The right border uses the `outline-gray-2` border token (a step
    // darker than the gray-2 `subtle` fill) so the divider reads as a hairline on
    // the filled `subtle` surface too, not only on hover/white `outline`.
    '.cm-gutters': {
      backgroundColor: 'transparent',
      borderRight: '1px solid var(--outline-gray-2, #e2e2e2)',
      color: 'var(--ink-gray-5, #64748b)',
    },
    // Fold marker. `basicSetup` renders a bare text caret pinned to the
    // cell's top-left; center it and swap the glyph for a masked chevron
    // (inherits the gutter `currentColor`). The marker carries no open/closed
    // class, but its `title` differs — so rotate it to point right when folded.
    '.cm-foldGutter .cm-gutterElement': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 2px',
      cursor: 'pointer',
    },
    '.cm-foldGutter .cm-gutterElement:hover': {
      color: 'var(--ink-gray-8, #1e293b)',
    },
    '.cm-foldGutter .cm-gutterElement > span': {
      display: 'block',
      width: '14px',
      height: '14px',
      fontSize: '0',
      backgroundColor: 'currentColor',
      transition: 'transform 0.12s ease',
      WebkitMaskImage: FOLD_CHEVRON,
      maskImage: FOLD_CHEVRON,
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat',
      WebkitMaskPosition: 'center',
      maskPosition: 'center',
      WebkitMaskSize: '14px 14px',
      maskSize: '14px 14px',
    },
    ".cm-foldGutter .cm-gutterElement > span[title='Unfold line']": {
      transform: 'rotate(-90deg)',
    },
    // `basicSetup` highlights the active line/gutter in a default light blue.
    // A fixed gray token can't stay visible across every surface the row sits on
    // — the `subtle` fill (gray-2), its hover fill (gray-3), and the white
    // `outline` surface — and using gray-3 makes the row vanish on hover, where
    // the surface itself becomes gray-3. Instead use a low-alpha `ink-gray-9`
    // overlay: it darkens (light mode) or lightens (dark mode, where the token
    // flips to near-white) whatever surface is beneath by a constant amount, so
    // the active row always reads. Being mostly transparent, it also lets the
    // selection — drawn behind the content — show through on the active row.
    '.cm-activeLine': {
      backgroundColor:
        'color-mix(in srgb, var(--ink-gray-9, #0f0f0f) 7%, transparent)',
    },
    '.cm-activeLineGutter': {
      backgroundColor:
        'color-mix(in srgb, var(--ink-gray-9, #0f0f0f) 7%, transparent)',
      color: 'var(--ink-gray-7, #525252)',
    },
    // Autocomplete / hover tooltips (from `basicSetup`) default to a light
    // popup — theme them off `--surface-elevation-2` (the elevated popover surface)
    // so the dropdown follows dark mode instead of flashing white.
    '.cm-tooltip': {
      backgroundColor: 'var(--surface-elevation-2, white)',
      border: '1px solid var(--surface-gray-3, #cbd5e1)',
      borderRadius: 'var(--radius-md, 0.5rem)',
      color: 'var(--ink-gray-8, #1e293b)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
      overflow: 'hidden',
    },
    '.cm-tooltip-autocomplete > ul': {
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    },
    '.cm-tooltip-autocomplete > ul > li': {
      color: 'var(--ink-gray-7, #475569)',
      padding: '2px 6px',
    },
    '.cm-tooltip-autocomplete > ul > li[aria-selected]': {
      backgroundColor: 'var(--surface-gray-3, #e2e8f0)',
      color: 'var(--ink-gray-9, #0f172a)',
    },
    '.cm-completionIcon': {
      color: 'var(--ink-gray-5, #64748b)',
    },
    '.cm-completionMatchedText': {
      color: 'var(--ink-blue-6)',
      textDecoration: 'none',
      fontWeight: '600',
    },
    '.cm-completionDetail': {
      color: 'var(--ink-gray-5, #64748b)',
      fontStyle: 'italic',
    },
  })
}

// Syntax highlighting keyed to `--ink-*` tokens so the palette flips with the
// app theme. `basicSetup` already installs CodeMirror's default (light-tuned)
// highlight style; layering this at the highest precedence makes it win for
// every tag we define, and the default only fills the rare gaps we don't.
export async function buildSyntaxHighlight(
  cmState: typeof import('@codemirror/state'),
): Promise<Extension> {
  const { HighlightStyle, syntaxHighlighting } =
    await import('@codemirror/language')
  const { tags } = await import('@lezer/highlight')
  const highlightStyle = HighlightStyle.define([
    {
      tag: [tags.keyword, tags.moduleKeyword, tags.controlKeyword],
      color: 'var(--ink-blue-6)',
    },
    {
      tag: [tags.string, tags.special(tags.string), tags.regexp],
      color: 'var(--ink-green-6)',
    },
    {
      tag: [tags.comment, tags.lineComment, tags.blockComment],
      color: 'var(--ink-gray-5)',
      fontStyle: 'italic',
    },
    {
      tag: [tags.number, tags.bool, tags.null, tags.atom],
      color: 'var(--ink-amber-6)',
    },
    {
      tag: [tags.typeName, tags.className, tags.namespace],
      color: 'var(--ink-amber-6)',
    },
    {
      tag: [
        tags.function(tags.variableName),
        tags.function(tags.propertyName),
        tags.labelName,
      ],
      color: 'var(--ink-blue-6)',
    },
    { tag: [tags.propertyName, tags.attributeName], color: 'var(--ink-red-6)' },
    { tag: [tags.tagName, tags.angleBracket], color: 'var(--ink-red-6)' },
    {
      tag: [tags.operator, tags.punctuation, tags.separator, tags.bracket],
      color: 'var(--ink-gray-6)',
    },
    {
      tag: [tags.variableName, tags.definition(tags.variableName)],
      color: 'var(--ink-gray-8)',
    },
    { tag: tags.meta, color: 'var(--ink-gray-5)' },
    {
      tag: [tags.link, tags.url],
      color: 'var(--ink-blue-6)',
      textDecoration: 'underline',
    },
    { tag: tags.heading, color: 'var(--ink-blue-6)', fontWeight: 'bold' },
    { tag: tags.strong, fontWeight: 'bold' },
    { tag: tags.emphasis, fontStyle: 'italic' },
    { tag: tags.strikethrough, textDecoration: 'line-through' },
    { tag: tags.invalid, color: 'var(--ink-red-8)' },
  ])
  return cmState.Prec.highest(syntaxHighlighting(highlightStyle))
}
