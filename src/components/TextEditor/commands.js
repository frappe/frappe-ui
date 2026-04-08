import { defineAsyncComponent } from 'vue'
import Bold from '~icons/lucide/bold'
import CodeView from '~icons/lucide/code'
import H1 from '~icons/lucide/heading-1'
import H2 from '~icons/lucide/heading-2'
import H3 from '~icons/lucide/heading-3'
import H4 from '~icons/lucide/heading-4'
import H5 from '~icons/lucide/heading-5'
import H6 from '~icons/lucide/heading-6'
import Image from '~icons/lucide/image-plus'
import Italic from '~icons/lucide/italic'
import Link from '~icons/lucide/link-2'
import ListUnordered from '~icons/lucide/list'
import ListTask from '~icons/lucide/list-check'
import DedentList from '~icons/lucide/list-indent-decrease'
import IndentList from '~icons/lucide/list-indent-increase'
import ListOrdered from '~icons/lucide/list-ordered'
import FontColor from '~icons/lucide/paint-bucket'
import DoubleQuotes from '~icons/lucide/quote'
import Redo from '~icons/lucide/redo-2'
import Separator from '~icons/lucide/separator-horizontal'
import TableOfContentsIcon from '~icons/lucide/square-menu'
import Strikethrough from '~icons/lucide/strikethrough'
import Table from '~icons/lucide/table-properties'
import AlignCenter from '~icons/lucide/text-align-center'
import AlignRight from '~icons/lucide/text-align-end'
import AlignLeft from '~icons/lucide/text-align-start'
import Text from '~icons/lucide/type'
import Underline from '~icons/lucide/underline'
import Undo from '~icons/lucide/undo-2'
import Video from '~icons/lucide/video'
import GalleryVertical from '~icons/lucide/youtube'

export default {
  'Paragraph': {
    label: 'Paragraph',
    icon: Text,
    action: (editor) => editor.chain().focus().setParagraph().run(),
    shortcut: 'Meta-Alt-0',
    isActive: (editor) => editor.isActive('paragraph'),
  },
  'Heading 1': {
    label: 'Heading 1',
    text: 'H1',
    icon: H1,
    action: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    shortcut: 'Meta-Alt-1',
    isActive: (editor) => editor.isActive('heading', { level: 1 }),
  },
  'Heading 2': {
    label: 'Heading 2',
    text: 'H2',
    icon: H2,
    action: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    shortcut: 'Meta-Alt-2',
    isActive: (editor) => editor.isActive('heading', { level: 2 }),
  },
  'Heading 3': {
    label: 'Heading 3',
    text: 'H3',
    icon: H3,
    action: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    shortcut: 'Meta-Alt-3',
    isActive: (editor) => editor.isActive('heading', { level: 3 }),
  },
  'Heading 4': {
    label: 'Heading 4',
    text: 'H4',
    icon: H4,
    action: (editor) => editor.chain().focus().toggleHeading({ level: 4 }).run(),
    shortcut: 'Meta-Alt-4',
    isActive: (editor) => editor.isActive('heading', { level: 4 }),
  },
  'Heading 5': {
    label: 'Heading 5',
    text: 'H5',
    icon: H5,
    action: (editor) => editor.chain().focus().toggleHeading({ level: 5 }).run(),
    shortcut: 'Meta-Alt-5',
    isActive: (editor) => editor.isActive('heading', { level: 5 }),
  },
  'Heading 6': {
    label: 'Heading 6',
    text: 'H6',
    icon: H6,
    action: (editor) => editor.chain().focus().toggleHeading({ level: 6 }).run(),
    shortcut: 'Meta-Alt-6',
    isActive: (editor) => editor.isActive('heading', { level: 6 }),
  },
  'Bold': {
    label: 'Bold',
    icon: Bold,
    action: (editor) => editor.chain().focus().toggleBold().run(),
    shortcut: 'Meta-B',
    isActive: (editor) => editor.isActive('bold'),
  },
  'Italic': {
    label: 'Italic',
    icon: Italic,
    action: (editor) => editor.chain().focus().toggleItalic().run(),
    shortcut: 'Meta-I',
    isActive: (editor) => editor.isActive('italic'),
  },
  'Underline': {
    label: 'Underline',
    icon: Underline,
    action: (editor) => editor.chain().focus().toggleUnderline().run(),
    shortcut: 'Meta-U',
    isActive: (editor) => editor.isActive('underline'),
  },
  'Strikethrough': {
    label: 'Strikethrough',
    icon: Strikethrough,
    action: (editor) => editor.chain().focus().toggleStrike().run(),
    shortcut: 'Meta-Shift-S',
    isActive: (editor) => editor.isActive('strike'),
  },
  'Bullet List': {
    label: 'Bullet List',
    icon: ListUnordered,
    action: (editor) => editor.chain().focus().toggleBulletList().run(),
    shortcut: 'Meta-Shift-8',
    isActive: (editor) => editor.isActive('bulletList'),
  },
  'Numbered List': {
    label: 'Numbered List',
    icon: ListOrdered,
    action: (editor) => editor.chain().focus().toggleOrderedList().run(),
    shortcut: 'Meta-Shift-7',
    isActive: (editor) => editor.isActive('orderedList'),
  },
  'Task List': {
    label: 'Task List',
    icon: ListTask,
    action: (editor) => editor.chain().focus().toggleTaskList().run(),
    shortcut: 'Meta-Shift-9',
    isActive: (editor) => editor.isActive('taskList'),
  },
  'IndentList': {
    label: 'Indent List',
    action: (editor) => editor.chain().focus().sinkListItem('listItem').run(),
    icon: IndentList,
    condition: (editor) => editor.can().sinkListItem('listItem'),
  },
  'DedentList': {
    label: 'Dedent List',
    action: (editor) => editor.chain().focus().liftListItem('listItem').run(),
    icon: DedentList,
    condition: (editor) => editor.can().liftListItem('listItem'),
  },
  'Align Center': {
    label: 'Align Center',
    icon: AlignCenter,
    action: (editor) => editor.chain().focus().setTextAlign('center').run(),
    shortcut: 'Meta-Shift-E',
    isActive: (editor) => editor.isActive({ textAlign: 'center' }),
  },
  'Align Left': {
    label: 'Align Left',
    icon: AlignLeft,
    action: (editor) => editor.chain().focus().setTextAlign('left').run(),
    shortcut: 'Meta-Shift-L',
    isActive: (editor) => editor.isActive({ textAlign: 'left' }),
  },
  'Align Right': {
    label: 'Align Right',
    icon: AlignRight,
    action: (editor) => editor.chain().focus().setTextAlign('right').run(),
    shortcut: 'Meta-Shift-R',
    isActive: (editor) => editor.isActive({ textAlign: 'right' }),
  },
  'FontColor': {
    label: 'Font Color',
    icon: FontColor,
    isActive: (editor) => editor.getAttributes('textStyle')?.color || editor.isActive('highlight'),
    component: defineAsyncComponent(() => import('./components/FontColor.vue')),
  },
  'Blockquote': {
    label: 'Blockquote',
    icon: DoubleQuotes,
    action: (editor) => editor.chain().focus().toggleBlockquote().run(),
    shortcut: 'Meta-Shift-B',
    isActive: (editor) => editor.isActive('blockquote'),
  },
  'Code': {
    label: 'Code',
    icon: CodeView,
    action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
    shortcut: 'Meta-Alt-C',
    isActive: (editor) => editor.isActive('codeBlock'),
  },
  'Horizontal Rule': {
    label: 'Horizontal Rule',
    icon: Separator,
    action: (editor) => editor.chain().focus().setHorizontalRule().run(),
    isActive: (editor) => false,
  },
  'Link': {
    label: 'Link',
    icon: Link,
    isActive: (editor) => editor.isActive('link'),
    component: defineAsyncComponent(() => import('./components/InsertLink.vue')),
  },
  'Image': {
    label: 'Image',
    icon: Image,
    isActive: (editor) => false,
    component: defineAsyncComponent(() => import('./components/InsertImage.vue')),
  },
  'Video': {
    label: 'Video',
    icon: Video,
    isActive: (editor) => false,
    component: defineAsyncComponent(() => import('./components/InsertVideo.vue')),
  },
  'Iframe': {
    label: 'Embed',
    icon: GalleryVertical,
    isActive: (editor) => editor.isActive('iframe'),
    component: defineAsyncComponent(() => import('./extensions/iframe/InsertIframe.vue')),
  },
  'Undo': {
    label: 'Undo',
    icon: Undo,
    action: (editor) => editor.chain().focus().undo().run(),
    shortcut: 'Meta-Z',
    isDisabled: (editor) => !editor.can().chain().focus().undo().run(),
  },
  'Redo': {
    label: 'Redo',
    icon: Redo,
    action: (editor) => editor.chain().focus().redo().run(),
    shortcut: 'Meta-Shift-Z',
    isDisabled: (editor) => !editor.can().chain().focus().redo().run(),
  },
  'InsertTable': {
    label: 'Insert Table',
    icon: Table,
    action: (editor) =>
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
    isActive: (editor) => editor.can().deleteTable(),
  },
  'AddColumnBefore': {
    label: 'Add Column Before',
    action: (editor) => editor.chain().focus().addColumnBefore().run(),
    isActive: (editor) => false,
    condition: (editor) => editor.can().addColumnBefore(),
  },
  'AddColumnAfter': {
    label: 'Add Column After',
    action: (editor) => editor.chain().focus().addColumnAfter().run(),
    isActive: (editor) => false,
    condition: (editor) => editor.can().addColumnAfter(),
  },
  'DeleteColumn': {
    label: 'Delete Column',
    action: (editor) => editor.chain().focus().deleteColumn().run(),
    isActive: (editor) => false,
    condition: (editor) => editor.can().deleteColumn(),
  },
  'AddRowBefore': {
    label: 'Add Row Before',
    action: (editor) => editor.chain().focus().addRowBefore().run(),
    isActive: (editor) => false,
    condition: (editor) => editor.can().addRowBefore(),
  },
  'AddRowAfter': {
    label: 'Add Row After',
    action: (editor) => editor.chain().focus().addRowAfter().run(),
    isActive: (editor) => false,
    condition: (editor) => editor.can().addRowAfter(),
  },
  'DeleteRow': {
    label: 'Delete Row',
    action: (editor) => editor.chain().focus().deleteRow().run(),
    isActive: (editor) => false,
    condition: (editor) => editor.can().deleteRow(),
  },
  'DeleteTable': {
    label: 'Delete Table',
    action: (editor) => editor.chain().focus().deleteTable().run(),
    isActive: (editor) => false,
    condition: (editor) => editor.can().deleteTable(),
  },
  'MergeCells': {
    label: 'Merge Cells',
    action: (editor) => editor.chain().focus().mergeCells().run(),
    isActive: (editor) => false,
    condition: (editor) => editor.can().mergeCells(),
  },
  'SplitCell': {
    label: 'Split Cell',
    action: (editor) => editor.chain().focus().splitCell().run(),
    isActive: (editor) => false,
    condition: (editor) => editor.can().splitCell(),
  },
  'ToggleHeaderColumn': {
    label: 'Toggle Header Column',
    action: (editor) => editor.chain().focus().toggleHeaderColumn().run(),
    isActive: (editor) => false,
    condition: (editor) => editor.can().toggleHeaderColumn(),
  },
  'ToggleHeaderRow': {
    label: 'Toggle Header Row',
    action: (editor) => editor.chain().focus().toggleHeaderRow().run(),
    isActive: (editor) => false,
    condition: (editor) => editor.can().toggleHeaderRow(),
  },
  'ToggleHeaderCell': {
    label: 'Toggle Header Cell',
    action: (editor) => editor.chain().focus().toggleHeaderCell().run(),
    isActive: (editor) => false,
    condition: (editor) => editor.can().toggleHeaderCell(),
  },
  'TableOfContents': {
    label: 'Table of Contents',
    icon: TableOfContentsIcon,
    action: (editor) => editor.chain().focus().insertTableOfContentsNode().run(),
    isActive: (editor) => editor.isActive('tocNode'),
  },
  'Separator': {
    type: 'separator',
  },
}
