// The "/" menu and the toolbar's Text select offer the same blocks. The
// select's list is the source of truth (rteBlocks.ts): an item here carries
// that list's label and runs `applyBlock`, the one command the select runs,
// so picking "Quote" in either place does the same thing to the document.
//
// Only the block and list commands are ours. Everything else the library's
// registry carries — media, embeds, the insert group — is kept as it stands,
// which is why this starts from `getDefaultSlashCommands()` rather than
// declaring a list of its own.
//
// The glyphs stay the menu's own: it draws an item's icon as a class, so each
// block takes the library's lucide glyph and availability test for that
// command. The two menus keep their own look, as they always have.
import {
  getDefaultSlashCommands,
  type CommandItem,
} from '../../../src/molecules/editor'
import {
  commandMeta,
  headingMeta,
  type EditorCommandMeta,
} from '../../../src/molecules/editor/commands'
import { BLOCKS, applyBlock, type BlockValue } from './rteBlocks'

/** what the library knows about each of the select's blocks */
const META: Record<BlockValue, EditorCommandMeta> = {
  paragraph: commandMeta.paragraph,
  h1: headingMeta(1),
  h2: headingMeta(2),
  h3: headingMeta(3),
  h4: headingMeta(4),
  h5: headingMeta(5),
  h6: headingMeta(6),
  bulletList: commandMeta.bulletList,
  orderedList: commandMeta.orderedList,
  taskList: commandMeta.taskList,
  codeBlock: commandMeta.codeBlock,
  blockquote: commandMeta.blockquote,
  // the toggle list is the playground's own block too; the + menu's glyph
  details: {
    label: 'Toggle list',
    icon: 'lucide-chevron-right',
    isAvailable: (editor) => !!editor.schema.nodes.details,
  },
  // the column layouts are the playground's own block, so they have no entry
  // in the library's table; the glyphs are lucide's own for each count,
  // spelled out in full because the class is drawn only where Tailwind's
  // scan finds it written
  columns2: columnsMeta(2, 'lucide-columns-2'),
  columns3: columnsMeta(3, 'lucide-columns-3'),
  columns4: columnsMeta(4, 'lucide-columns-4'),
}

function columnsMeta(count: 2 | 3 | 4, icon: string): EditorCommandMeta {
  return {
    label: `${count} columns`,
    icon,
    isAvailable: (editor) => !!editor.schema.nodes.columns,
  }
}

/** the section of the menu each block belongs under */
const GROUP: Record<BlockValue, string> = {
  paragraph: 'Text',
  h1: 'Text',
  h2: 'Text',
  h3: 'Text',
  h4: 'Text',
  h5: 'Text',
  h6: 'Text',
  codeBlock: 'Text',
  blockquote: 'Text',
  bulletList: 'Lists',
  orderedList: 'Lists',
  taskList: 'Lists',
  details: 'Lists',
  columns2: 'Layout',
  columns3: 'Layout',
  columns4: 'Layout',
}

const ORDER = ['Text', 'Lists', 'Layout']

const blockItems = (): CommandItem[] =>
  [...BLOCKS]
    .sort(
      (a, b) => ORDER.indexOf(GROUP[a.value]) - ORDER.indexOf(GROUP[b.value]),
    )
    .map((block) => ({
      title: block.label,
      icon:
        typeof META[block.value].icon === 'string'
          ? (META[block.value].icon as string)
          : '',
      group: GROUP[block.value],
      isAvailable: META[block.value].isAvailable,
      command: ({ editor, range }) =>
        applyBlock(editor.chain().focus().deleteRange(range), block.value),
    }))

/**
 * The menu's items: the select's blocks in place of the registry's own block
 * and list commands, with everything else the registry offers kept.
 */
export function rteSlashCommands(): CommandItem[] {
  const rest = getDefaultSlashCommands().filter(
    (item) =>
      item.group !== 'Text' &&
      item.group !== 'Lists' &&
      item.group !== 'Embeds',
  )
  // the file's embed: a slot across the document that asks for its link
  // (32354:128378), in place of the library's dialog and its per-platform
  // shortcuts
  const embed: CommandItem = {
    title: 'Embed',
    icon: 'lucide-code-xml',
    group: 'Embeds',
    isAvailable: (editor) => !!editor.schema.nodes.embedSlot,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).insertEmbedSlot().run(),
  }
  return [...blockItems(), ...rest, embed]
}
