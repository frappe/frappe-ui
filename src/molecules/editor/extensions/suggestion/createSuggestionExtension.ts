import { Extension, type Editor, type Range } from '@tiptap/core'
import Suggestion, { type SuggestionOptions } from '@tiptap/suggestion'
import type { PluginKey } from '@tiptap/pm/state'
import type { Component as VueComponent } from 'vue'
import type { BaseSuggestionItem } from '#molecules/editor/extensions/shared/suggestion-types'
import {
  createSuggestionRenderer,
  type SuggestionFloatingOptions,
} from '#molecules/editor/extensions/shared/suggestion-renderer'
import {
  isInCode,
  getSuggestionOptions,
} from '#molecules/editor/extensions/shared/suggestion-helpers'
import {
  autoOpenCleanupPlugin,
  insertSuggestionTrigger,
} from '#molecules/editor/extensions/shared/suggestion-open'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    suggestion: {
      /**
       * Open a suggester's menu at the caret, as if its trigger char had been
       * typed — for a toolbar button, since `@tiptap/suggestion` has no
       * imperative open. Names the suggester to open, e.g. `'slashCommands'`.
       *
       * Focuses the editor first, so a click on the button does not swallow
       * the keystrokes meant for the menu.
       *
       * `false` means nothing was inserted: no such extension, it has no
       * suggestion configured, or the caret is inside code. `true` means the
       * trigger was inserted — not that a menu is showing. A suggester can
       * still decline for its own reasons (a custom `allow`, `startOfLine`),
       * and `autoOpenCleanupPlugin` takes the char back out when it does.
       *
       * Registered by `createSuggestionExtension`, so it exists only when at
       * least one suggester built by that factory is loaded — the same
       * conditional availability as every other extension command here.
       */
      openSuggestionMenu: (extensionName: string) => ReturnType
    }
  }
}

// Re-export for back-compat: several extensions still import the base item type
// from this module path. The canonical home is `suggestion-types`.
export type { BaseSuggestionItem }

export interface CreateSuggestionExtensionOptions<
  TItem extends BaseSuggestionItem,
> {
  name: string
  char: string
  pluginKey: PluginKey
  items: (props: {
    query: string
    editor: Editor
  }) => TItem[] | Promise<TItem[]>
  command: (props: { editor: Editor; range: Range; props: TItem }) => void
  component: VueComponent
  floatingOptions?: SuggestionFloatingOptions
  allowSpaces?: boolean
  startOfLine?: boolean
  decorationTag?: string
  decorationClass?: string
  addOptions?: () => Record<string, unknown>
}

/**
 * Factory that wraps `@tiptap/suggestion` in a TipTap `Extension`. The
 * imperative Floating UI/VueRenderer lifecycle lives in `createSuggestionRenderer`
 * (shared); this file is now just the extension shell + plugin registration.
 */
export function createSuggestionExtension<TItem extends BaseSuggestionItem>(
  options: CreateSuggestionExtensionOptions<TItem>,
) {
  type ExtensionFullOptions = Record<string, unknown> & {
    suggestion: Omit<SuggestionOptions<TItem>, 'editor'>
  }

  return Extension.create<ExtensionFullOptions>({
    name: options.name,

    addOptions() {
      const customOptions = options.addOptions
        ? options.addOptions.call(this)
        : {}

      return {
        ...customOptions,
        suggestion: {
          char: options.char,
          pluginKey: options.pluginKey,
          items: options.items,
          command: options.command,
          // Stay inert inside code blocks / inline code, where a trigger char
          // (`:`/`#`/`@`) is literal source the author is typing — not a cue.
          allow: ({ state, range }) => !isInCode(state.doc, range.from),
          allowSpaces: options.allowSpaces,
          startOfLine: options.startOfLine,
          decorationTag: options.decorationTag || 'span',
          decorationClass: options.decorationClass || 'suggestion',
          render: () =>
            createSuggestionRenderer(
              options.component,
              options.floatingOptions,
            ),
        } as Omit<SuggestionOptions<TItem>, 'editor'>,
      }
    },

    // Every suggester registers the same generic command. Tiptap keeps the last
    // registration of a name, and these are identical — the command takes the
    // suggester to open as an argument rather than belonging to any one of
    // them, so whichever instance wins behaves the same.
    addCommands() {
      return {
        openSuggestionMenu:
          (extensionName: string) =>
          ({ editor, tr, commands, dispatch }) => {
            const target = getSuggestionOptions<{
              suggestion?: { char?: string }
            }>(editor, extensionName)
            const char = target?.suggestion?.char
            if (!char) return false
            // Same test as the `allow` above, against `tr.doc` rather than
            // `editor.state.doc`: an earlier command in the chain may already
            // have edited the doc, and resolving a fresh position against the
            // stale one can run past its end. Checking before inserting rather
            // than cleaning up after leaves the document untouched when no
            // menu can open.
            if (isInCode(tr.doc, tr.selection.from)) return false
            if (!dispatch) return true

            // A toolbar button takes focus on click, so the menu would open
            // with the next keystroke going to the button. `commands.focus()`
            // shares this transaction — only `editor.chain()` would start a
            // rival one and throw.
            commands.focus()
            insertSuggestionTrigger(tr, char)
            return true
          },
      }
    },

    addProseMirrorPlugins() {
      const char = this.options.suggestion.char ?? options.char
      const pluginKey = this.options.suggestion.pluginKey ?? options.pluginKey
      return [
        Suggestion<TItem>({
          editor: this.editor,
          ...this.options.suggestion,
        }),
        // Order matters: this reads the suggester's own state, so it has to be
        // applied after it. Cleans up after `openSuggestionMenu`.
        autoOpenCleanupPlugin({ char, pluginKey }),
      ]
    },
  })
}
