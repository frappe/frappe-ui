import type { Component } from 'vue'
import type { Editor } from './useEditor'
import {
  commandMeta,
  headingMeta,
  type EditorCommandContext,
  type EditorCommandMeta,
} from './commands'
import { openFontColorPicker } from './components/font-color/fontColorController'

export type MenuActionContext = EditorCommandContext

export type CommandMenuItem = {
  // Button glyph: a `lucide-*` string renders as a masked icon span (frappe-ui
  // house convention); a component renders as-is. Predefined items default it.
  icon?: Component | string
  label: string
  action: (
    editor: Editor,
    context?: MenuActionContext,
  ) => boolean | void | Promise<boolean | void>
  isActive?: (editor: Editor) => boolean
  isDisabled?: (editor: Editor) => boolean
  // Escape hatch for custom toolbar controls. Predefined items prefer actions.
  component?: Component
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

function canRun(editor: Editor, command: CommandMenuItem['action']) {
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
  meta: EditorCommandMeta,
  action: CommandMenuItem['action'],
  component?: Component,
  canCheck = true,
): CommandMenuItem {
  return {
    label: meta.label,
    icon: meta.icon,
    action,
    isActive: meta.isActive,
    isDisabled: canCheck ? (editor) => !canRun(editor, action) : undefined,
    isAvailable: meta.isAvailable,
    component,
  }
}

export const Bold = command(commandMeta.bold, (editor) =>
  editor.chain().focus().toggleBold().run(),
)
export const Italic = command(commandMeta.italic, (editor) =>
  editor.chain().focus().toggleItalic().run(),
)
export const Strike = command(commandMeta.strike, (editor) =>
  editor.chain().focus().toggleStrike().run(),
)
// Inline `code` mark toggle. Exported as `InlineCode` (not `Code`) so it doesn't
// collide with the `Code` extension export; its visible/aria label is still "Code".
export const InlineCode = command(commandMeta.inlineCode, (editor) =>
  editor.chain().focus().toggleCode().run(),
)
export const BulletList = command(commandMeta.bulletList, (editor) =>
  editor.chain().focus().toggleBulletList().run(),
)
export const OrderedList = command(commandMeta.orderedList, (editor) =>
  editor.chain().focus().toggleOrderedList().run(),
)
export const Blockquote = command(commandMeta.blockquote, (editor) =>
  editor.chain().focus().toggleBlockquote().run(),
)
export const Paragraph = command(commandMeta.paragraph, (editor) =>
  editor.chain().focus().setParagraph().run(),
)

function heading(level: 1 | 2 | 3 | 4 | 5 | 6): CommandMenuItem {
  return command(headingMeta(level), (editor) =>
    editor.chain().focus().toggleHeading({ level }).run(),
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

export const AlignLeft = command(commandMeta.alignLeft, (editor) =>
  editor.chain().focus().setTextAlign('left').run(),
)
export const AlignCenter = command(commandMeta.alignCenter, (editor) =>
  editor.chain().focus().setTextAlign('center').run(),
)
export const AlignRight = command(commandMeta.alignRight, (editor) =>
  editor.chain().focus().setTextAlign('right').run(),
)
// Named color/highlight (`namedColor`/`namedHighlight`) drive an imperative
// picker so the toolbar button remains owned by MenuItems.
export const FontColor = command(
  commandMeta.fontColor,
  (editor, context) => {
    if (!context?.trigger) return
    openFontColorPicker({ editor, anchor: context.trigger })
  },
  undefined,
  false,
)
export const FontHighlight = command(commandMeta.fontHighlight, (editor) =>
  editor.chain().focus().toggleHighlightByName('yellow').run(),
)
export const InsertImage = command(
  commandMeta.image,
  (editor) => editor.chain().focus().selectAndUploadImage().run(),
  undefined,
  false,
)
export const InsertVideo = command(
  commandMeta.video,
  (editor) => editor.chain().focus().selectAndUploadVideo().run(),
  undefined,
  false,
)
export const InsertLink = command(
  commandMeta.link,
  (editor) => editor.commands.openLinkEditor(),
  undefined,
  false,
)
export const InsertTable = command(commandMeta.table, (editor) =>
  editor
    .chain()
    .focus()
    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
    .run(),
)
export const HorizontalRule = command(commandMeta.horizontalRule, (editor) =>
  editor.chain().focus().setHorizontalRule().run(),
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
