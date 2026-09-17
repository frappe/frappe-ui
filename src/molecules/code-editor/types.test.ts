/**
 * Compile-time contract for the code editor's option types.
 *
 * Every `@ts-expect-error` below is an assertion: `yarn type-check` fails if
 * the line starts to compile. The runtime body only keeps the fixtures alive.
 *
 * Types come from `./index`, never from an implementation module: what a
 * consumer cannot import is not a contract.
 */
import { describe, expectTypeOf, it } from 'vitest'
import { ref } from 'vue'
import type { Extension } from '@codemirror/state'
import type { EditorView } from '@codemirror/view'
import {
  CodeEditor,
  CodeEditorContent,
  CodeKit,
  useCodeEditor,
  type CodeEditorExposed,
  type CodeEditorOptions,
  type CodeKitExtension,
  type CodeKitOptions,
  type LanguageKey,
} from './index'

type CodeEditorProps = InstanceType<typeof CodeEditor>['$props']
type CodeEditorContentProps = InstanceType<typeof CodeEditorContent>['$props']

// --- `extensions` is required on both surfaces ------------------------------

const engineOptions: CodeEditorOptions = { extensions: [CodeKit] }
const engineReactive: CodeEditorOptions = {
  content: ref(''),
  extensions: () => [CodeKit],
  editable: () => false,
  autofocus: true,
  onUpdate: (view) => view.state.doc.toString(),
  onChange: (view) => view.state.doc.toString(),
  onFocus: (_view, event) => event.type,
  onBlur: (_view, event) => event.type,
}

// @ts-expect-error `extensions` is required: the engine bakes in no capability.
const engineNoExtensions: CodeEditorOptions = { content: ref('') }
// @ts-expect-error There is no `language` prop; a language is an extension.
const engineLanguage: CodeEditorOptions = { extensions: [], language: 'sql' }
// @ts-expect-error `content` is a `Ref<string>`, not a bare string.
const engineStringContent: CodeEditorOptions = { extensions: [], content: 'x' }

const componentProps: CodeEditorProps = { extensions: [CodeKit] }
// @ts-expect-error `extensions` is required on the component too.
const componentNoExtensions: CodeEditorProps = {}
const componentPlaceholder: CodeEditorProps = {
  extensions: [],
  // @ts-expect-error There is no `placeholder` prop; the text is a kit member.
  placeholder: 'SELECT 1',
}

// The content part's `editor` is optional and takes `null` explicitly, which is
// what keeps it usable with no `<CodeEditor>` around it.
const contentProps: CodeEditorContentProps = {}
const contentNull: CodeEditorContentProps = { editor: null }

// --- CodeKit members --------------------------------------------------------

const allOff: CodeKitOptions = {
  lineNumbers: false,
  foldGutter: false,
  autocompletion: false,
  search: false,
  placeholder: false,
  chrome: false,
  highlight: false,
  keymap: false,
}

const configured = CodeKit.configure({
  lineNumbers: {},
  placeholder: 'SELECT 1',
  autocompletion: { override: [] },
  foldGutter: { openText: '▾' },
})

// A kit is a named shape, so a variable, a prop or a factory return can be
// annotated without reaching for `typeof CodeKit`.
const namedKit: CodeKitExtension = CodeKit.configure({ search: false })
const kitFactory = (): CodeKitExtension => CodeKit

// @ts-expect-error A misspelled member must not pass silently.
const kitTypo = CodeKit.configure({ lineNumber: {} })
// @ts-expect-error `lint` is not a member; `@codemirror/lint` stays optional.
const kitLint = CodeKit.configure({ lint: {} })
// @ts-expect-error A misspelled option inside a member is a compile error too.
const kitMemberTypo = CodeKit.configure({ foldGutter: { openTxt: '▾' } })
// @ts-expect-error The placeholder member takes its text, not an extension.
const kitPlaceholderObject: CodeKitOptions['placeholder'] = {}

// The three frappe members are flags: `{}` or `false`, and nothing else.
const chromeOn: CodeKitOptions['chrome'] = {}
const chromeOff: CodeKitOptions['chrome'] = false
// @ts-expect-error `chrome` takes no options: the knobs are CSS variables.
const chromeOptions: CodeKitOptions['chrome'] = { class: 'my-code' }
// @ts-expect-error `highlight` takes no options: the palette is the extension.
const highlightOptions: CodeKitOptions['highlight'] = { style: [] }
// @ts-expect-error `keymap` takes no options.
const keymapOptions: CodeKitOptions['keymap'] = { tab: false }

// --- the exposed surface and the language keys ------------------------------

const exposed: CodeEditorExposed = { editor: useCodeEditor({ extensions: [] }) }
const language: LanguageKey = 'scss'
// @ts-expect-error `typescript` is not a key; `javascript` covers it.
const unknownLanguage: LanguageKey = 'typescript'

void engineNoExtensions
void engineLanguage
void engineStringContent
void componentNoExtensions
void componentPlaceholder
void kitTypo
void kitLint
void kitMemberTypo
void kitPlaceholderObject
void chromeOptions
void highlightOptions
void keymapOptions
void unknownLanguage

describe('code editor option types', () => {
  it('accepts the documented shapes', () => {
    expectTypeOf(engineOptions).toMatchTypeOf<CodeEditorOptions>()
    expectTypeOf(engineReactive).toMatchTypeOf<CodeEditorOptions>()
    expectTypeOf(componentProps).toMatchTypeOf<CodeEditorProps>()
    expectTypeOf(contentProps).toMatchTypeOf<CodeEditorContentProps>()
    expectTypeOf(allOff).toMatchTypeOf<CodeKitOptions>()
    expectTypeOf(chromeOn).toEqualTypeOf<Record<string, never>>()
    expectTypeOf(language).toMatchTypeOf<LanguageKey>()
    // `false` removes a member; the declarations above are the assertion.
    void chromeOff
    void contentNull
    void configured
    expectTypeOf(namedKit).toEqualTypeOf<CodeKitExtension>()
    expectTypeOf(kitFactory()).toEqualTypeOf<CodeKitExtension>()
  })

  it('returns the view ref and nothing else', () => {
    expectTypeOf(useCodeEditor).returns.toEqualTypeOf<
      CodeEditorExposed['editor']
    >()
    expectTypeOf(exposed.editor.value).toEqualTypeOf<EditorView | null>()
  })

  it('takes raw CodeMirror extensions, with no frappe-ui wrapper type', () => {
    expectTypeOf<CodeEditorProps['extensions']>().toEqualTypeOf<Extension[]>()
  })
})
