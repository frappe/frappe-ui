import { Extension, Editor, Range } from '@tiptap/core'
import { VueRenderer } from '@tiptap/vue-3'
import Suggestion, {
  SuggestionOptions,
  SuggestionProps,
} from '@tiptap/suggestion'
import { PluginKey } from '@tiptap/pm/state'
import tippy, { Instance as TippyInstance, Props as TippyProps } from 'tippy.js'
import { Component as VueComponent } from 'vue'

export interface BaseSuggestionItem {
  title?: string
  name?: string
  [key: string]: any
}

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
  tippyOptions?: Partial<TippyProps>
  allowSpaces?: boolean
  startOfLine?: boolean
  decorationTag?: string
  decorationClass?: string
  addOptions?: () => Record<string, any>
}

export function createSuggestionExtension<TItem extends BaseSuggestionItem>(
  options: CreateSuggestionExtensionOptions<TItem>,
) {
  type ExtensionFullOptions = Record<string, any> & {
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
          render: () => {
            let component: VueRenderer | null
            let popup: TippyInstance[] | null

            return {
              onStart: (props: SuggestionProps<TItem>) => {
                component = new VueRenderer(options.component, {
                  editor: props.editor,
                  props: props,
                })

                if (!props.clientRect || !component.element) {
                  return
                }

                const defaultTippyOptions: Partial<TippyProps> = {
                  getReferenceClientRect: props.clientRect as () => DOMRect,
                  appendTo: () => document.body,
                  content: component.element,
                  showOnCreate: true,
                  interactive: true,
                  trigger: 'manual',
                  placement: 'bottom-start',
                }

                popup = tippy('body', {
                  ...defaultTippyOptions,
                  ...options.tippyOptions,
                })
              },

              onUpdate(props: SuggestionProps<TItem>) {
                component?.updateProps(props)

                if (!props.clientRect) {
                  return
                }

                if (popup && popup[0]) {
                  popup[0].setProps({
                    getReferenceClientRect: props.clientRect as () => DOMRect,
                  })
                }
              },

              onKeyDown(props: { event: KeyboardEvent }): boolean {
                if (props.event.key === 'Escape') {
                  if (popup && popup[0]) {
                    popup[0].hide()
                  }
                  return true
                }

                if (
                  component &&
                  component.ref &&
                  typeof (component.ref as any).onKeyDown === 'function'
                ) {
                  return (component.ref as any).onKeyDown(props)
                }
                return false
              },

              onExit() {
                if (popup && popup[0]) {
                  popup[0].destroy()
                }
                if (component) {
                  component.destroy()
                }
                popup = null
                component = null
              },
            }
          },
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
