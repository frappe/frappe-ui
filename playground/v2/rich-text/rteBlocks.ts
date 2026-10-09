// The block styles the toolbar's and the floating bar's "Text" selects
// offer (31815:50348, 35728:87337): what the cursor's block is, and how
// to make it another. One list, so the two selects never drift apart.
import type { ChainedCommands } from '@tiptap/core'
import type { TiptapEditor } from '../../../src/molecules/editor'

export const BLOCKS = [
  { value: 'paragraph', label: 'Text', icon: 'paragraph' },
  { value: 'h1', label: 'Heading 1', icon: 'heading1' },
  { value: 'h2', label: 'Heading 2', icon: 'heading2' },
  { value: 'h3', label: 'Heading 3', icon: 'heading3' },
  { value: 'h4', label: 'Heading 4', icon: 'heading4' },
  { value: 'h5', label: 'Heading 5', icon: 'heading5' },
  { value: 'h6', label: 'Heading 6', icon: 'heading6' },
  { value: 'bulletList', label: 'Bulleted list', icon: 'multiple-list' },
  { value: 'orderedList', label: 'Numbered list', icon: 'numbered-list' },
  { value: 'taskList', label: 'To-do list', icon: 'todo' },
  { value: 'details', label: 'Toggle list', icon: 'small-right' },
  { value: 'codeBlock', label: 'Code', icon: 'code' },
  { value: 'blockquote', label: 'Quote', icon: 'quote' },
  { value: 'columns2', label: '2 columns', icon: 'grid-2' },
  { value: 'columns3', label: '3 columns', icon: 'grid-3' },
  { value: 'columns4', label: '4 columns', icon: 'grid-4' },
] as const
export type BlockValue = (typeof BLOCKS)[number]['value']

/** the column layouts, by how many they lay side by side */
const COLUMNS: Partial<Record<BlockValue, number>> = {
  columns2: 2,
  columns3: 3,
  columns4: 4,
}

/** how many columns the row around the selection has — none, if no row */
function columnsAround(ed: TiptapEditor): number {
  const { $from } = ed.state.selection
  for (let d = $from.depth; d > 0; d--)
    if ($from.node(d).type.name === 'columns') return $from.node(d).childCount
  return 0
}

/** the block the selection sits in */
export function activeBlockOf(ed: TiptapEditor): BlockValue {
  for (const l of [1, 2, 3, 4, 5, 6] as const)
    if (ed.isActive('heading', { level: l })) return `h${l}` as BlockValue
  if (ed.isActive('codeBlock')) return 'codeBlock'
  if (ed.isActive('taskList')) return 'taskList'
  if (ed.isActive('bulletList')) return 'bulletList'
  if (ed.isActive('orderedList')) return 'orderedList'
  if (ed.isActive('blockquote')) return 'blockquote'
  // a toggle is its summary line; what it holds below are blocks of their own
  if (ed.isActive('detailsSummary')) return 'details'
  const columns = columnsAround(ed)
  if (columns) return `columns${columns}` as BlockValue
  return 'paragraph'
}
export const blockLabel = (value: BlockValue) =>
  BLOCKS.find((b) => b.value === value)?.label ?? 'Text'

/** the selection's block made `value` */
export function applyBlock(c: ChainedCommands, value: BlockValue) {
  if (value === 'paragraph') c.setParagraph().run()
  else if (value.startsWith('h'))
    c.toggleHeading({
      level: Number(value[1]) as 1 | 2 | 3 | 4 | 5 | 6,
    }).run()
  else if (value === 'bulletList') c.toggleBulletList().run()
  else if (value === 'orderedList') c.toggleOrderedList().run()
  else if (value === 'taskList') c.toggleTaskList().run()
  else if (value === 'codeBlock') c.toggleCodeBlock().run()
  else if (value === 'blockquote') c.toggleBlockquote().run()
  else if (value === 'details') c.setToggleList().run()
  // a row the selection is already in is re-counted; elsewhere a row is laid
  else if (COLUMNS[value]) c.setColumns(COLUMNS[value]).run()
}
