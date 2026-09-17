import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { indentWithTab } from '@codemirror/commands'
import { searchPanelOpen } from '@codemirror/search'
import { Prec, type Extension } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { tags } from '@lezer/highlight'

/**
 * The class every frappe rule in `style.css` is scoped under. Nothing about the
 * frappe look is ambient: without `codeChrome` in the extension array the class
 * is absent and none of those rules match.
 */
export const CODE_CHROME_CLASS = 'frappe-code'

/**
 * Layer 2 of the styling model: the frappe box. Adds one class to the editor's
 * root, and the package stylesheet does the rest.
 *
 * The styling lives in plain CSS rather than in an `EditorView.theme`, because
 * a theme is a StyleModule whose injection order decides equal-specificity
 * fights. The old field lost that fight often enough to leave a comment about
 * it. A CSS custom property read at one use site has no ordering problem, so
 * every knob here is a `--code-*` variable a consumer sets on the editor or on
 * any ancestor.
 */
export const codeChrome: Extension = EditorView.editorAttributes.of({
  class: CODE_CHROME_CLASS,
})

/**
 * Layer 3: frappe syntax colours.
 *
 * Syntax highlighting needs an extension in any case. CodeMirror maps Lezer
 * tags to classes through `syntaxHighlighting(HighlightStyle.define(...))`, and
 * plain CSS cannot do that mapping.
 *
 * Every colour is an `--ink-*` token, and those tokens re-map under the app's
 * colour scheme — so the palette follows dark mode with no second theme and no
 * `Compartment`. `Prec.highest` makes these win over a default highlight style
 * a consumer also loaded, which then only fills the tags this one omits.
 */
export const codeHighlight: Extension = Prec.highest(
  syntaxHighlighting(
    HighlightStyle.define([
      {
        tag: [tags.keyword, tags.moduleKeyword, tags.controlKeyword],
        color: 'var(--ink-blue-5)',
      },
      {
        tag: [tags.string, tags.special(tags.string), tags.regexp],
        color: 'var(--ink-green-5)',
      },
      {
        tag: [tags.comment, tags.lineComment, tags.blockComment],
        color: 'var(--ink-gray-5)',
        fontStyle: 'italic',
      },
      {
        tag: [tags.number, tags.bool, tags.null, tags.atom],
        color: 'var(--ink-amber-5)',
      },
      {
        tag: [tags.typeName, tags.className, tags.namespace],
        color: 'var(--ink-amber-5)',
      },
      {
        tag: [
          tags.function(tags.variableName),
          tags.function(tags.propertyName),
          tags.labelName,
        ],
        color: 'var(--ink-blue-5)',
      },
      {
        tag: [tags.propertyName, tags.attributeName],
        color: 'var(--ink-red-5)',
      },
      { tag: [tags.tagName, tags.angleBracket], color: 'var(--ink-red-5)' },
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
        color: 'var(--ink-blue-5)',
        textDecoration: 'underline',
      },
      { tag: tags.heading, color: 'var(--ink-blue-5)', fontWeight: 'bold' },
      { tag: tags.strong, fontWeight: 'bold' },
      { tag: tags.emphasis, fontStyle: 'italic' },
      { tag: tags.strikethrough, textDecoration: 'line-through' },
      { tag: tags.invalid, color: 'var(--ink-red-7)' },
    ]),
  ),
)

/**
 * The frappe keymap: Tab and Shift-Tab indent and dedent, Escape blurs.
 *
 * Escape is a WCAG 2.1.2 obligation, not a nicety. `indentWithTab` takes Tab
 * away from the browser's focus-move, so without an escape hatch a keyboard
 * user who tabs into the editor cannot tab out. Esc-then-Tab is CodeMirror's
 * standard way out of that trap.
 *
 * `Prec.high` puts both bindings above the default keymaps, so a kit member can
 * never shadow them by landing earlier in the array.
 *
 * That precedence is why the blur is conditional. `searchKeymap` declares
 * `{key: 'Escape', run: closeSearchPanel, scope: 'editor search-panel'}` —
 * two scopes, and CodeMirror registers the binding under both. In the `editor`
 * scope this one runs first, so returning `true` with a panel open would blur
 * the editor, leave the panel up, and fire the blur commit as a side effect.
 * Falling through hands Escape back to `closeSearchPanel`, and the next Escape
 * blurs.
 */
export const codeKeymap: Extension = Prec.high(
  keymap.of([
    indentWithTab,
    {
      key: 'Escape',
      run: (view) => {
        if (searchPanelOpen(view.state)) return false
        view.contentDOM.blur()
        return true
      },
    },
  ]),
)
