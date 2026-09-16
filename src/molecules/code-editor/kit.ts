import {
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
  completionKeymap,
} from '@codemirror/autocomplete'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import {
  bracketMatching,
  foldGutter,
  foldKeymap,
  indentOnInput,
} from '@codemirror/language'
import {
  highlightSelectionMatches,
  search,
  searchKeymap,
} from '@codemirror/search'
import { EditorState, type Extension } from '@codemirror/state'
import {
  crosshairCursor,
  drawSelection,
  dropCursor,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  placeholder,
  rectangularSelection,
} from '@codemirror/view'
import { codeChrome, codeHighlight, codeKeymap } from './extensions'

/** The real options type of the extension a member wraps. */
type ConfigOf<F extends (config?: any) => unknown> = NonNullable<
  Parameters<F>[0]
>

/**
 * A member whose extension takes no options: `{}` keeps it, `false` removes it.
 * Any other key is a compile error, so a misspelled option cannot pass
 * silently.
 */
type FlagMember = Record<string, never> | false

/** A configurable member: a config to apply, or `false` to remove it. */
type Member<O> = O | false

/**
 * What `CodeKit.configure()` accepts. Eight members, each removable with
 * `false`, each typed with the real options type of the extension it wraps.
 *
 * Every other extension the kit carries is a fixed base: not a member, not
 * configurable, and not a name frappe-ui owns. A member is a name that freezes
 * at the `1.0.0` tag, so a member nobody in the audit ever toggles is cost with
 * no benefit. Adding one later is additive; removing one is not.
 */
export interface CodeKitOptions {
  /** Off by default — Builder's default, and what the Desk field shows. */
  lineNumbers: Member<ConfigOf<typeof lineNumbers>>
  foldGutter: Member<ConfigOf<typeof foldGutter>>
  /** Desk turns this off unless the field supplies completion sources. */
  autocompletion: Member<ConfigOf<typeof autocompletion>>
  /** Builder swaps the panel through `search({ createPanel })`. */
  search: Member<ConfigOf<typeof search>>
  /** The hint text shown while the document is empty. No text by default. */
  placeholder: string | false
  /** `codeChrome`: the frappe box and its `--code-*` contract. */
  chrome: FlagMember
  /** `codeHighlight`: the frappe syntax colours. */
  highlight: FlagMember
  /** `codeKeymap`: Tab/Shift-Tab indent, Escape blurs. */
  keymap: FlagMember
}

/** A fresh defaults object per call, so no two kits share a member object. */
function defaults(): CodeKitOptions {
  return {
    lineNumbers: false,
    foldGutter: {},
    autocompletion: {},
    search: {},
    placeholder: false,
    chrome: {},
    highlight: {},
    keymap: {},
  }
}

/**
 * Everything `basicSetup` carries that is not a member. Fixed: a consumer that
 * needs one of these configured differently hand-assembles instead of using the
 * kit, and that path is first-class.
 *
 * `lintKeymap` is deliberately absent. It is the only reason the kit would have
 * to import `@codemirror/lint`, and leaving it out keeps that package an
 * optional peer nobody installs unless they follow the JSON-lint recipe.
 */
function fixedBase(): Extension[] {
  return [
    history(),
    highlightSpecialChars(),
    drawSelection(),
    dropCursor(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    bracketMatching(),
    closeBrackets(),
    rectangularSelection(),
    crosshairCursor(),
    highlightActiveLine(),
    highlightActiveLineGutter(),
    highlightSelectionMatches(),
    keymap.of([
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...historyKeymap,
      ...foldKeymap,
    ]),
  ]
}

function build(options: CodeKitOptions): Extension[] {
  const list: Extension[] = []

  // `codeKeymap` first, and at `Prec.high` inside itself, so Tab and Escape
  // outrank the default keymaps no matter what a consumer appends. Ordering
  // knowledge like this is why the kit is a bundle and not a documentation
  // sentence pointing at `basicSetup`.
  if (options.keymap !== false) list.push(codeKeymap)
  if (options.chrome !== false) list.push(codeChrome)
  if (options.highlight !== false) list.push(codeHighlight)

  if (options.lineNumbers !== false) list.push(lineNumbers(options.lineNumbers))
  if (options.foldGutter !== false) list.push(foldGutter(options.foldGutter))

  // Each of these keymaps drives state the matching extension installs, so it
  // travels with its member rather than sitting in the fixed base.
  if (options.autocompletion !== false) {
    list.push(
      autocompletion(options.autocompletion),
      keymap.of(completionKeymap),
    )
  }
  if (options.search !== false) {
    list.push(search(options.search), keymap.of(searchKeymap))
  }
  if (options.placeholder !== false) list.push(placeholder(options.placeholder))

  list.push(...fixedBase())
  return list
}

/**
 * A kit is a plain CodeMirror `Extension` with a `.configure()` on it, so it
 * travels in the `extensions` array like any other value and the engine never
 * learns whether you used it.
 */
export interface CodeKitExtension {
  readonly extension: Extension
  /**
   * A new kit with these members changed, merged over the receiver's own. The
   * receiver is left alone, so chaining accumulates rather than resets:
   * `CodeKit.configure({ lineNumbers: {} }).configure({ search: false })` keeps
   * the line numbers. This is the `.configure()` mold `StarterKit` set.
   */
  configure(options?: Partial<CodeKitOptions>): CodeKitExtension
}

function createKit(options: CodeKitOptions): CodeKitExtension {
  // Built once and cached: CodeMirror keys state fields by extension identity,
  // so a getter that rebuilt the array on every read would drop the history and
  // the fold state on every reconfigure.
  let built: Extension | null = null
  return {
    get extension() {
      return (built ??= build(options))
    },
    configure(next = {}) {
      return createKit({ ...options, ...next })
    },
  }
}

/**
 * The kit: one configurable bundle of good defaults.
 *
 * ```ts
 * extensions: [CodeKit, sql()]
 * extensions: [CodeKit.configure({ lineNumbers: {}, autocompletion: false })]
 * ```
 *
 * It exists rather than a docs pointer at `basicSetup` because `basicSetup` is
 * a flat array from which no member can be removed. That is exactly why Builder
 * hand-assembled twenty extensions instead of using it.
 */
export const CodeKit: CodeKitExtension = createKit(defaults())
