import H1 from './icons/h-1.vue'
import H2 from './icons/h-2.vue'
import H3 from './icons/h-3.vue'
import H4 from './icons/h-4.vue'
import H5 from './icons/h-5.vue'
import H6 from './icons/h-6.vue'
import Text from './icons/text.vue'
import Bold from './icons/bold.vue'
import Italic from './icons/italic.vue'
import Underline from './icons/underline.vue'
import AlignCenter from './icons/align-center.vue'
import AlignLeft from './icons/align-left.vue'
import AlignRight from './icons/align-right.vue'
import ListOrdered from './icons/list-ordered.vue'
import ListUnordered from './icons/list-unordered.vue'
import DoubleQuotes from './icons/double-quotes-r.vue'
import CodeView from './icons/code-view.vue'
import Link from './icons/link.vue'
import Image from './icons/image-add-line.vue'
import ArrowGoBack from './icons/arrow-go-back-line.vue'
import ArrowGoForward from './icons/arrow-go-forward-line.vue'
import Separator from './icons/separator.vue'

export default {
  Paragraph: {
    label: 'Paragraph',
    icon: Text,
    action: (editor) => editor.chain().focus().setParagraph().run(),
    isActive: (editor) => editor.isActive('paragraph'),
  },
  'Heading 1': {
    label: 'Heading 1',
    text: 'H1',
    icon: H1,
    action: (editor) =>
      editor.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 1 }),
  },
  'Heading 2': {
    label: 'Heading 2',
    text: 'H2',
    icon: H2,
    action: (editor) =>
      editor.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 2 }),
  },
  'Heading 3': {
    label: 'Heading 3',
    text: 'H3',
    icon: H3,
    action: (editor) =>
      editor.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 3 }),
  },
  'Heading 4': {
    label: 'Heading 4',
    text: 'H4',
    icon: H4,
    action: (editor) =>
      editor.chain().focus().toggleHeading({ level: 4 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 4 }),
  },
  'Heading 5': {
    label: 'Heading 5',
    text: 'H5',
    icon: H5,
    action: (editor) =>
      editor.chain().focus().toggleHeading({ level: 5 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 5 }),
  },
  'Heading 6': {
    label: 'Heading 6',
    text: 'H6',
    icon: H6,
    action: (editor) =>
      editor.chain().focus().toggleHeading({ level: 6 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 6 }),
  },
  Bold: {
    label: 'Bold',
    icon: Bold,
    action: (editor) => editor.chain().focus().toggleBold().run(),
    isActive: (editor) => editor.isActive('bold'),
  },
  Italic: {
    label: 'Italic',
    icon: Italic,
    action: (editor) => editor.chain().focus().toggleItalic().run(),
    isActive: (editor) => editor.isActive('italic'),
  },
  Underline: {
    label: 'Underline',
    icon: Underline,
    action: (editor) => editor.chain().focus().toggleUnderline().run(),
    isActive: (editor) => editor.isActive('underline'),
  },
  'Bullet List': {
    label: 'Bullet List',
    icon: ListOrdered,
    action: (editor) => editor.chain().focus().toggleBulletList().run(),
    isActive: (editor) => editor.isActive('bulletList'),
  },
  'Numbered List': {
    label: 'Numbered List',
    icon: ListUnordered,
    action: (editor) => editor.chain().focus().toggleOrderedList().run(),
    isActive: (editor) => editor.isActive('orderedList'),
  },
  'Align Center': {
    label: 'Align Center',
    icon: AlignCenter,
    action: (editor) => editor.chain().focus().setTextAlign('center').run(),
    isActive: (editor) => editor.isActive({ textAlign: 'center' }),
  },
  'Align Left': {
    label: 'Align Left',
    icon: AlignLeft,
    action: (editor) => editor.chain().focus().setTextAlign('left').run(),
    isActive: (editor) => editor.isActive({ textAlign: 'left' }),
  },
  'Align Right': {
    label: 'Align Right',
    icon: AlignRight,
    action: (editor) => editor.chain().focus().setTextAlign('right').run(),
    isActive: (editor) => editor.isActive({ textAlign: 'right' }),
  },
  Blockquote: {
    label: 'Blockquote',
    icon: DoubleQuotes,
    action: (editor) => editor.chain().focus().toggleBlockquote().run(),
    isActive: (editor) => editor.isActive('blockquote'),
  },
  Code: {
    label: 'Code',
    icon: CodeView,
    action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
    isActive: (editor) => editor.isActive('codeBlock'),
  },
  'Horizontal Rule': {
    label: 'Horizontal Rule',
    icon: Separator,
    action: (editor) => editor.chain().focus().setHorizontalRule().run(),
    isActive: (editor) => false,
  },
  Link: {
    label: 'Link',
    icon: Link,
    isActive: (editor) => editor.isActive('link'),
  },
  Image: {
    label: 'Image',
    icon: Image,
    isActive: (editor) => false,
  },
  Undo: {
    label: 'Undo',
    icon: ArrowGoBack,
    action: (editor) => editor.chain().focus().undo().run(),
    isActive: (editor) => false,
  },
  Redo: {
    label: 'Redo',
    icon: ArrowGoForward,
    action: (editor) => editor.chain().focus().redo().run(),
    isActive: (editor) => false,
  },
  Separator: {
    type: 'separator',
  },
}
