import { Extension, Editor, Range } from '@tiptap/core'
import { VueRenderer } from '@tiptap/vue-3'
import Suggestion, { SuggestionProps } from '@tiptap/suggestion'
import { PluginKey } from 'prosemirror-state'
import tippy, { Instance as TippyInstance, Props as TippyProps } from 'tippy.js'
import SlashCommandsList from './SlashCommandsList.vue'
import { Component } from 'vue'

import Heading2 from '~icons/lucide/heading-2'
import Heading3 from '~icons/lucide/heading-3'
import List from '~icons/lucide/list'
import ListOrdered from '~icons/lucide/list-ordered'
import Code from '~icons/lucide/code'
import Quote from '~icons/lucide/quote'
import Image from '~icons/lucide/image'
import Video from '~icons/lucide/video'
import Link from '~icons/lucide/link'
import Minus from '~icons/lucide/minus'
import Table from '~icons/lucide/table-2'

export const SlashCommandSuggestionKey = new PluginKey<any>(
  'slashCommandSuggestion',
)

interface Command {
  title: string
  icon: Component
  command: (props: CommandExecutionProps) => void
}

type CommandExecutionProps = {
  editor: Editor
  range: Range
}

const getCommands = (): Command[] => [
  {
    title: 'Heading 2',
    icon: Heading2,
    command: ({ editor, range }: CommandExecutionProps) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 2 })
        .run()
    },
  },
  {
    title: 'Heading 3',
    icon: Heading3,
    command: ({ editor, range }: CommandExecutionProps) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 3 })
        .run()
    },
  },
  {
    title: 'Bullet List',
    icon: List,
    command: ({ editor, range }: CommandExecutionProps) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run()
    },
  },
  {
    title: 'Ordered List',
    icon: ListOrdered,
    command: ({ editor, range }: CommandExecutionProps) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run()
    },
  },
  {
    title: 'Code Block',
    icon: Code,
    command: ({ editor, range }: CommandExecutionProps) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
    },
  },
  {
    title: 'Blockquote',
    icon: Quote,
    command: ({ editor, range }: CommandExecutionProps) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run()
    },
  },
  {
    title: 'Image',
    icon: Image,
    command: ({ editor, range }: CommandExecutionProps) => {
      editor.chain().focus().deleteRange(range).selectAndUploadImage().run()
    },
  },
  {
    title: 'Video',
    icon: Video,
    command: ({ editor, range }: CommandExecutionProps) => {
      editor.chain().focus().deleteRange(range).selectAndUploadVideo().run()
    },
  },
  {
    title: 'Link',
    icon: Link,
    command: ({ editor, range }: CommandExecutionProps) => {
      editor.chain().focus().deleteRange(range).setLink({ href: '' }).run()
    },
  },
  {
    title: 'Horizontal Rule',
    icon: Minus,
    command: ({ editor, range }: CommandExecutionProps) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run()
    },
  },
  {
    title: 'Table',
    icon: Table,
    command: ({ editor, range }: CommandExecutionProps) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run()
    },
  },
]

type CommandProps = SuggestionProps<Command>

export const SlashCommands = Extension.create({
  name: 'slashCommands',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        pluginKey: SlashCommandSuggestionKey,
        items: ({ query }: { query: string }): Command[] => {
          const commands = getCommands()
          return commands.filter((item) =>
            item.title.toLowerCase().startsWith(query.toLowerCase()),
          )
        },
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor
          range: Range
          props: Command
        }) => {
          props.command({ editor, range })
        },
        render: () => {
          let component: VueRenderer | null
          let popup: TippyInstance[] | null

          return {
            onStart: (props: CommandProps) => {
              component = new VueRenderer(SlashCommandsList, {
                props,
                editor: props.editor,
              })

              if (!props.clientRect || !component.element) {
                return
              }

              const tippyOptions: Partial<TippyProps> = {
                getReferenceClientRect: props.clientRect as () => DOMRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
              }

              popup = tippy('body', tippyOptions)
            },

            onUpdate(props: CommandProps) {
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
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion<Command>({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
})

export default SlashCommands
