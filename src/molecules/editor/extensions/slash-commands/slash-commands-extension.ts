import { Editor, Range } from '@tiptap/core'
import { PluginKey } from '@tiptap/pm/state'
import {
  createSuggestionExtension,
  type BaseSuggestionItem,
} from '../suggestion/createSuggestionExtension'
import SlashCommandsList from './SlashCommandsList.vue'

export const SlashCommandSuggestionKey = new PluginKey<any>(
  'slashCommandSuggestion',
)

export interface CommandItem extends BaseSuggestionItem {
  title: string
  icon: string
  command: (props: CommandExecutionProps) => void
}

type CommandExecutionProps = {
  editor: Editor
  range: Range
}

const getCommands = (): CommandItem[] => [
  {
    title: 'Heading 2',
    icon: 'lucide-heading-2',
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
    icon: 'lucide-heading-3',
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
    icon: 'lucide-list',
    command: ({ editor, range }: CommandExecutionProps) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run()
    },
  },
  {
    title: 'Numbered List',
    icon: 'lucide-list-ordered',
    command: ({ editor, range }: CommandExecutionProps) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run()
    },
  },
  {
    title: 'Task List',
    icon: 'lucide-list-checks',
    command: ({ editor, range }: CommandExecutionProps) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run()
    },
  },
  {
    title: 'Code Block',
    icon: 'lucide-code',
    command: ({ editor, range }: CommandExecutionProps) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
    },
  },
  {
    title: 'Blockquote',
    icon: 'lucide-quote',
    command: ({ editor, range }: CommandExecutionProps) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run()
    },
  },
  {
    title: 'Image',
    icon: 'lucide-image',
    command: ({ editor, range }: CommandExecutionProps) => {
      editor.chain().focus().deleteRange(range).selectAndUploadImage().run()
    },
  },
  {
    title: 'Video',
    icon: 'lucide-video',
    command: ({ editor, range }: CommandExecutionProps) => {
      editor.chain().focus().deleteRange(range).selectAndUploadVideo().run()
    },
  },
  {
    title: 'Embed',
    icon: 'lucide-gallery-vertical',
    command: ({ editor, range }: CommandExecutionProps) => {
      editor.chain().focus().deleteRange(range).openIframeDialog().run()
    },
  },
  {
    title: 'Link',
    icon: 'lucide-link',
    command: ({ editor, range }: CommandExecutionProps) => {
      editor.chain().focus().deleteRange(range).setLink({ href: '' }).run()
    },
  },
  {
    title: 'Horizontal Rule',
    icon: 'lucide-minus',
    command: ({ editor, range }: CommandExecutionProps) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run()
    },
  },
  {
    title: 'Table',
    icon: 'lucide-table-2',
    command: ({ editor, range }: CommandExecutionProps) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run()
    },
  },
  {
    title: 'Table of Contents',
    icon: 'lucide-table-of-contents',
    command: ({ editor, range }: CommandExecutionProps) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertTableOfContentsNode()
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
