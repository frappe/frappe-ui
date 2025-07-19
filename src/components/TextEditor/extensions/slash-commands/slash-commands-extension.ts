import { Editor, Range } from '@tiptap/core'
import { PluginKey } from '@tiptap/pm/state'
import {
  createSuggestionExtension,
  type BaseSuggestionItem,
} from '../suggestion/createSuggestionExtension'
import SlashCommandsList from './SlashCommandsList.vue'
import { Component as VueComponent } from 'vue'

import Heading2 from '~icons/lucide/heading-2'
import Heading3 from '~icons/lucide/heading-3'
import List from '~icons/lucide/list'
import ListOrdered from '~icons/lucide/list-ordered'
import ListTask from '~icons/lucide/list-checks'
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

export interface CommandItem extends BaseSuggestionItem {
  title: string
  icon: VueComponent
  command: (props: CommandExecutionProps) => void
}

type CommandExecutionProps = {
  editor: Editor
  range: Range
}

const getCommands = (): CommandItem[] => [
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
    title: 'Numbered List',
    icon: ListOrdered,
    command: ({ editor, range }: CommandExecutionProps) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run()
    },
  },
  {
    title: 'Task List',
    icon: ListTask,
    command: ({ editor, range }: CommandExecutionProps) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run()
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

export const SlashCommands = createSuggestionExtension<CommandItem>({
  name: 'slashCommands',
  char: '/',
  pluginKey: SlashCommandSuggestionKey,
  items: ({ query }) => {
    const commands = getCommands()
    return commands.filter((item) =>
      item.title.toLowerCase().startsWith(query.toLowerCase()),
    )
  },
  command: ({ editor, range, props: item }) => {
    if (item && typeof item.command === 'function') {
      item.command({ editor, range })
    } else {
      console.error(
        'Slash command execution error: command function not found on selected item or item is invalid.',
        item,
      )
    }
  },
  component: SlashCommandsList,
})

export default SlashCommands
