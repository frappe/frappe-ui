import { Extension, type Editor, type Range } from '@tiptap/core'
import Suggestion, { type SuggestionOptions } from '@tiptap/suggestion'
import type { PluginKey } from '@tiptap/pm/state'
import type { Component as VueComponent } from 'vue'
import type { BaseSuggestionItem } from '@molecules/editor/extensions/shared/suggestion-types'
import {
  createSuggestionRenderer,
  type SuggestionFloatingOptions,
} from '@molecules/editor/extensions/shared/suggestion-renderer'

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

    addProseMirrorPlugins() {
      return [
        Suggestion<TItem>({
          editor: this.editor,
          ...this.options.suggestion,
        }),
      ]
    },
  })
}
