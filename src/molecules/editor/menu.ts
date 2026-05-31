import type { Component } from 'vue'
import type { Editor } from './useEditor'

export type CommandMenuItem = {
  /**
   * The button glyph. A `lucide-*` string renders as a masked icon span (the
   * frappe-ui house convention, same path as Button); a component renders as-is.
   * Predefined items ship a sensible default — pass your own to override.
   */
  icon?: Component | string
  label: string
  action: (editor: Editor) => void
  isActive?: (editor: Editor) => boolean
  isDisabled?: (editor: Editor) => boolean
  /**
   * Whether the item's capability is loaded in the editor. When this returns
   * `false` the renderer hides the item entirely (its extension isn't present),
   * which is what lets one preset adapt across kits with no re-curation. Absent
   * means always available.
   */
  isAvailable?: (editor: Editor) => boolean
}

export type MenuGroupItem = {
  type: 'group'
  icon?: Component | string
  label: string
  items: CommandMenuItem[]
}

export type MenuItem = CommandMenuItem | MenuGroupItem | { type: 'separator' }

/** Self-pruning predicates — an item hides when its mark/node/extension is absent. */
const hasMark =
  (name: string) =>
  (editor: Editor): boolean =>
    name in editor.schema.marks
const hasNode =
  (name: string) =>
  (editor: Editor): boolean =>
    name in editor.schema.nodes
const hasExtension =
  (name: string) =>
  (editor: Editor): boolean =>
    editor.extensionManager?.extensions?.some(
      (extension) => extension.name === name,
    ) ?? true

function canRun(editor: Editor, command: (editor: Editor) => void) {
  const canEditor = editor.can?.()
  if (!canEditor?.chain) return true

  let can = true
  const canChain = canEditor.chain()
  const proxyEditor = {
    ...editor,
    chain: () => canChain,
  } as Editor

  try {
    command(proxyEditor)
    can = canChain.run?.() !== false
  } catch {
    can = true
  }

  return can
}

function command(
  label: string,
  icon: Component | string | undefined,
  action: (editor: Editor) => void,
  active?: (editor: Editor) => boolean,
  available?: (editor: Editor) => boolean,
): CommandMenuItem {
  return {
    label,
    icon,
    action,
    isActive: active,
    isDisabled: (editor) => !canRun(editor, action),
    isAvailable: available,
  }
}

export const Bold = command(
  'Bold',
  'lucide-bold',
  (editor) => editor.chain().focus().toggleBold().run(),
  (editor) => editor.isActive('bold'),
  hasMark('bold'),
)
export const Italic = command(
  'Italic',
  'lucide-italic',
  (editor) => editor.chain().focus().toggleItalic().run(),
  (editor) => editor.isActive('italic'),
  hasMark('italic'),
)
export const Strike = command(
  'Strike',
  'lucide-strikethrough',
  (editor) => editor.chain().focus().toggleStrike().run(),
  (editor) => editor.isActive('strike'),
  hasMark('strike'),
)
// Inline `code` mark toggle. Exported as `InlineCode` (not `Code`) so it doesn't
// collide with the `Code` extension export; its visible/aria label is still "Code".
export const InlineCode = command(
  'Code',
  'lucide-code',
  (editor) => editor.chain().focus().toggleCode().run(),
  (editor) => editor.isActive('code'),
  hasMark('code'),
)
export const BulletList = command(
  'Bullet List',
  'lucide-list',
  (editor) => editor.chain().focus().toggleBulletList().run(),
  (editor) => editor.isActive('bulletList'),
  hasNode('bulletList'),
)
export const OrderedList = command(
  'Ordered List',
  'lucide-list-ordered',
  (editor) => editor.chain().focus().toggleOrderedList().run(),
  (editor) => editor.isActive('orderedList'),
  hasNode('orderedList'),
)
export const Blockquote = command(
  'Blockquote',
  'lucide-quote',
  (editor) => editor.chain().focus().toggleBlockquote().run(),
  (editor) => editor.isActive('blockquote'),
  hasNode('blockquote'),
)
export const Paragraph = command(
  'Paragraph',
  'lucide-type',
  (editor) => editor.chain().focus().setParagraph().run(),
  (editor) => editor.isActive('paragraph'),
  hasNode('paragraph'),
)

const headingIcon: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
  1: 'lucide-heading-1',
  2: 'lucide-heading-2',
  3: 'lucide-heading-3',
  4: 'lucide-heading-4',
  5: 'lucide-heading-5',
  6: 'lucide-heading-6',
}

function heading(level: 1 | 2 | 3 | 4 | 5 | 6): CommandMenuItem {
  return command(
    `Heading ${level}`,
    headingIcon[level],
    (editor) => editor.chain().focus().toggleHeading({ level }).run(),
    (editor) => editor.isActive('heading', { level }),
    hasNode('heading'),
  )
}

export const H1 = heading(1)
export const H2 = heading(2)
export const H3 = heading(3)
export const H4 = heading(4)
export const H5 = heading(5)
export const H6 = heading(6)
export const HeadingGroup: MenuGroupItem = {
  type: 'group',
  label: 'Heading',
  items: [H2, H3, H4],
}

export const AlignLeft = command(
  'Align Left',
  'lucide-align-left',
  (editor) => editor.chain().focus().setTextAlign('left').run(),
  (editor) => editor.isActive({ textAlign: 'left' }),
  hasExtension('textAlign'),
)
export const AlignCenter = command(
  'Align Center',
  'lucide-align-center',
  (editor) => editor.chain().focus().setTextAlign('center').run(),
  (editor) => editor.isActive({ textAlign: 'center' }),
  hasExtension('textAlign'),
)
export const AlignRight = command(
  'Align Right',
  'lucide-align-right',
  (editor) => editor.chain().focus().setTextAlign('right').run(),
  (editor) => editor.isActive({ textAlign: 'right' }),
  hasExtension('textAlign'),
)
export const FontColor = command(
  'Font Color',
  'lucide-baseline',
  (editor) => editor.chain().focus().setColor('#000000').run(),
  undefined,
  hasExtension('color'),
)
export const FontHighlight = command(
  'Highlight',
  'lucide-highlighter',
  (editor) => editor.chain().focus().toggleHighlight().run(),
  (editor) => editor.isActive('highlight'),
  hasMark('highlight'),
)
export const InsertImage = command(
  'Image',
  'lucide-image',
  (editor) => editor.chain().focus().setImage?.({ src: '' }).run(),
  undefined,
  hasNode('image'),
)
export const InsertVideo = command(
  'Video',
  'lucide-video',
  (editor) => editor.chain().focus().setVideo?.({ src: '' }).run(),
  undefined,
  hasNode('video'),
)
export const InsertLink = command(
  'Link',
  'lucide-link',
  (editor) => editor.chain().focus().toggleLink({ href: '' }).run(),
  (editor) => editor.isActive('link'),
  hasMark('link'),
)
export const InsertTable = command(
  'Table',
  'lucide-table',
  (editor) =>
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run(),
  undefined,
  hasNode('table'),
)
export const HorizontalRule = command(
  'Horizontal Rule',
  'lucide-minus',
  (editor) => editor.chain().focus().setHorizontalRule().run(),
  undefined,
  hasNode('horizontalRule'),
)

// History controls. `isActive` doesn't apply; availability is left open (history
// ships in StarterKit) and the button disables itself when there's nothing to do.
export const Undo: CommandMenuItem = {
  label: 'Undo',
  icon: 'lucide-undo-2',
  action: (editor) => editor.chain().focus().undo().run(),
  isDisabled: (editor) => !editor.can().undo(),
}
export const Redo: CommandMenuItem = {
  label: 'Redo',
  icon: 'lucide-redo-2',
  action: (editor) => editor.chain().focus().redo().run(),
  isDisabled: (editor) => !editor.can().redo(),
}

export const Separator: MenuItem = { type: 'separator' }

export const minimalToolbar: MenuItem[] = [Bold, Italic, InsertLink]
export const commentToolbar: MenuItem[] = [
  Bold,
  Italic,
  Strike,
  Separator,
  BulletList,
  OrderedList,
  InsertLink,
]
export const articleToolbar: MenuItem[] = [
  HeadingGroup,
  Separator,
  Bold,
  Italic,
  Strike,
  Separator,
  BulletList,
  OrderedList,
  Blockquote,
  InsertLink,
  InsertImage,
  InsertTable,
]
