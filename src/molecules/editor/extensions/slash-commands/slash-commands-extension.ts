import type { Editor, Range } from '@tiptap/core'
import { PluginKey } from '@tiptap/pm/state'
import {
  createSuggestionExtension,
  type BaseSuggestionItem,
} from '../suggestion/createSuggestionExtension'
import {
  commandMeta,
  headingMeta,
  type EditorCommandMeta,
} from '#molecules/editor/commands'
import { filterByQuery } from '#molecules/editor/extensions/shared/suggestion-helpers'
import { PLATFORM_CONFIGS } from '#molecules/editor/extensions/iframe/iframe-embed-utils'
import { allowlistPermitsHosts } from '#molecules/editor/extensions/iframe/iframe-allowlist'
import SlashCommandsList from './SlashCommandsList.vue'

export const SlashCommandSuggestionKey = new PluginKey('slashCommandSuggestion')

export interface CommandItem extends BaseSuggestionItem {
  title: string
  icon: string
  /** Section header this command renders under (dropdown-group style). */
  group?: string
  isAvailable?: EditorCommandMeta['isAvailable']
  command: (props: CommandExecutionProps) => void
}

type CommandExecutionProps = {
  editor: Editor
  range: Range
}

function slashCommand(
  meta: EditorCommandMeta,
  command: CommandItem['command'],
): CommandItem {
  return {
    title: meta.label,
    icon: typeof meta.icon === 'string' ? meta.icon : '',
    isAvailable: meta.isAvailable,
    command,
  }
}

/** Stamp a section header onto a run of commands (dropdown-group style). */
function inGroup(group: string, items: CommandItem[]): CommandItem[] {
  return items.map((item) => ({ ...item, group }))
}

const getCommands = (): CommandItem[] => [
  ...inGroup('Text', [
    slashCommand(headingMeta(2), ({ editor, range }: CommandExecutionProps) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 2 })
        .run()
    }),
    slashCommand(headingMeta(3), ({ editor, range }: CommandExecutionProps) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 3 })
        .run()
    }),
    slashCommand(commandMeta.blockquote, ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run()
    }),
    slashCommand(commandMeta.codeBlock, ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
    }),
  ]),
  ...inGroup('Lists', [
    slashCommand(commandMeta.bulletList, ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run()
    }),
    slashCommand(commandMeta.orderedList, ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run()
    }),
    slashCommand(commandMeta.taskList, ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run()
    }),
  ]),
  ...inGroup('Media', [
    slashCommand(commandMeta.image, ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).selectAndUploadImage().run()
    }),
    slashCommand(commandMeta.video, ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).selectAndUploadVideo().run()
    }),
  ]),
  ...inGroup('Embeds', [
    slashCommand(commandMeta.embed, ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).openIframeDialog().run()
    }),
    // One shortcut per first-party embed integration. Each opens the same embed
    // dialog, pre-titled for the platform; a custom iframe allowlist that
    // excludes a platform's hosts prunes its shortcut.
    ...PLATFORM_CONFIGS.map((platform) =>
      slashCommand(
        {
          label: platform.name,
          icon: platform.icon,
          isAvailable: (editor) =>
            commandMeta.embed.isAvailable(editor) &&
            allowlistPermitsHosts(editor, platform.hosts),
        },
        ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .openIframeDialog(platform.name)
            .run()
        },
      ),
    ),
  ]),
  ...inGroup('Insert', [
    slashCommand(commandMeta.link, ({ editor, range }) => {
      const from = range.from
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent('Link')
        .setTextSelection({ from, to: from + 4 })
        .run()
      editor.commands.openLinkEditor({ startInEdit: true })
    }),
    slashCommand(
      { ...commandMeta.table, icon: 'lucide-table-2' },
      ({ editor, range }: CommandExecutionProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run()
      },
    ),
    slashCommand(commandMeta.horizontalRule, ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run()
    }),
    slashCommand(commandMeta.toc, ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertTableOfContentsNode()
        .run()
    }),
  ]),
]

export const SlashCommands = createSuggestionExtension<CommandItem>({
  name: 'slashCommands',
  char: '/',
  pluginKey: SlashCommandSuggestionKey,
  items: ({ query, editor }) => {
    return filterByQuery(
      getCommands().filter((item) => item.isAvailable?.(editor) !== false),
      query,
      'title',
    )
  },
  command: ({ editor, range, props: item }) => {
    if (
      item &&
      typeof item.command === 'function' &&
      item.isAvailable?.(editor) !== false
    ) {
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
