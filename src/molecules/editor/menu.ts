import type { Component } from 'vue'
import type { Editor } from './useEditor'

export type CommandMenuItem = {
  icon?: Component
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
  icon?: Component
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
  action: (editor: Editor) => void,
  active?: (editor: Editor) => boolean,
  available?: (editor: Editor) => boolean,
): CommandMenuItem {
  return {
    label,
    action,
    isActive: active,
    isDisabled: (editor) => !canRun(editor, action),
    isAvailable: available,
  }
}

export const Bold = command(
  'Bold',
  (editor) => editor.chain().focus().toggleBold().run(),
  (editor) => editor.isActive('bold'),
  hasMark('bold'),
)
export const Italic = command(
  'Italic',
  (editor) => editor.chain().focus().toggleItalic().run(),
  (editor) => editor.isActive('italic'),
  hasMark('italic'),
)
export const Strike = command(
  'Strike',
  (editor) => editor.chain().focus().toggleStrike().run(),
  (editor) => editor.isActive('strike'),
  hasMark('strike'),
)
export const BulletList = command(
  'Bullet List',
  (editor) => editor.chain().focus().toggleBulletList().run(),
  (editor) => editor.isActive('bulletList'),
  hasNode('bulletList'),
)
export const OrderedList = command(
  'Ordered List',
  (editor) => editor.chain().focus().toggleOrderedList().run(),
  (editor) => editor.isActive('orderedList'),
  hasNode('orderedList'),
)
export const Blockquote = command(
  'Blockquote',
  (editor) => editor.chain().focus().toggleBlockquote().run(),
  (editor) => editor.isActive('blockquote'),
  hasNode('blockquote'),
)
export const Paragraph = command(
  'Paragraph',
  (editor) => editor.chain().focus().setParagraph().run(),
  (editor) => editor.isActive('paragraph'),
  hasNode('paragraph'),
)

function heading(level: 1 | 2 | 3 | 4 | 5 | 6): CommandMenuItem {
  return command(
    `Heading ${level}`,
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
  (editor) => editor.chain().focus().setTextAlign('left').run(),
  (editor) => editor.isActive({ textAlign: 'left' }),
  hasExtension('textAlign'),
)
export const AlignCenter = command(
  'Align Center',
  (editor) => editor.chain().focus().setTextAlign('center').run(),
  (editor) => editor.isActive({ textAlign: 'center' }),
  hasExtension('textAlign'),
)
export const AlignRight = command(
  'Align Right',
  (editor) => editor.chain().focus().setTextAlign('right').run(),
  (editor) => editor.isActive({ textAlign: 'right' }),
  hasExtension('textAlign'),
)
export const FontColor = command(
  'Font Color',
  (editor) => editor.chain().focus().setColor('#000000').run(),
  undefined,
  hasExtension('color'),
)
export const FontHighlight = command(
  'Highlight',
  (editor) => editor.chain().focus().toggleHighlight().run(),
  (editor) => editor.isActive('highlight'),
  hasMark('highlight'),
)
export const InsertImage = command(
  'Image',
  (editor) => editor.chain().focus().setImage?.({ src: '' }).run(),
  undefined,
  hasNode('image'),
)
export const InsertVideo = command(
  'Video',
  (editor) => editor.chain().focus().setVideo?.({ src: '' }).run(),
  undefined,
  hasNode('video'),
)
export const InsertLink = command(
  'Link',
  (editor) => editor.chain().focus().toggleLink({ href: '' }).run(),
  (editor) => editor.isActive('link'),
  hasMark('link'),
)
export const InsertTable = command(
  'Table',
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
  (editor) => editor.chain().focus().setHorizontalRule().run(),
  undefined,
  hasNode('horizontalRule'),
)
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
