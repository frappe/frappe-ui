import type { Component } from 'vue'
import type { Editor } from './useEditor'

export type EditorCommandContext = {
  event?: MouseEvent
  trigger?: HTMLElement
}

export type EditorCommandMeta = {
  icon?: Component | string
  label: string
  isActive?: (editor: Editor) => boolean
  isAvailable?: (editor: Editor) => boolean
}

/** Self-pruning predicates shared by menu items and slash commands. */
export const hasMark =
  (name: string) =>
  (editor: Editor): boolean =>
    name in editor.schema.marks

export const hasNode =
  (name: string) =>
  (editor: Editor): boolean =>
    name in editor.schema.nodes

export const hasExtension =
  (name: string) =>
  (editor: Editor): boolean =>
    editor.extensionManager?.extensions?.some(
      (extension) => extension.name === name,
    ) ?? true

export const hasCommand =
  (name: string) =>
  (editor: Editor): boolean =>
    typeof (editor.commands as Record<string, unknown>)[name] === 'function'

export const hasIframeDialog = (editor: Editor): boolean => {
  const storage = editor.storage as Record<string, unknown>
  const iframe = storage.iframe as { openDialog?: unknown } | undefined
  return hasNode('iframe')(editor) && typeof iframe?.openDialog === 'function'
}

const headingIcon: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
  1: 'lucide-heading-1',
  2: 'lucide-heading-2',
  3: 'lucide-heading-3',
  4: 'lucide-heading-4',
  5: 'lucide-heading-5',
  6: 'lucide-heading-6',
}

export function headingMeta(level: 1 | 2 | 3 | 4 | 5 | 6): EditorCommandMeta {
  return {
    label: `Heading ${level}`,
    icon: headingIcon[level],
    isActive: (editor) => editor.isActive('heading', { level }),
    isAvailable: hasNode('heading'),
  }
}

export const commandMeta = {
  bold: {
    label: 'Bold',
    icon: 'lucide-bold',
    isActive: (editor) => editor.isActive('bold'),
    isAvailable: hasMark('bold'),
  },
  italic: {
    label: 'Italic',
    icon: 'lucide-italic',
    isActive: (editor) => editor.isActive('italic'),
    isAvailable: hasMark('italic'),
  },
  strike: {
    label: 'Strike',
    icon: 'lucide-strikethrough',
    isActive: (editor) => editor.isActive('strike'),
    isAvailable: hasMark('strike'),
  },
  inlineCode: {
    label: 'Code',
    icon: 'lucide-code',
    isActive: (editor) => editor.isActive('code'),
    isAvailable: hasMark('code'),
  },
  bulletList: {
    label: 'Bullet List',
    icon: 'lucide-list',
    isActive: (editor) => editor.isActive('bulletList'),
    isAvailable: hasNode('bulletList'),
  },
  orderedList: {
    label: 'Ordered List',
    icon: 'lucide-list-ordered',
    isActive: (editor) => editor.isActive('orderedList'),
    isAvailable: hasNode('orderedList'),
  },
  blockquote: {
    label: 'Blockquote',
    icon: 'lucide-quote',
    isActive: (editor) => editor.isActive('blockquote'),
    isAvailable: hasNode('blockquote'),
  },
  paragraph: {
    label: 'Paragraph',
    icon: 'lucide-type',
    isActive: (editor) => editor.isActive('paragraph'),
    isAvailable: hasNode('paragraph'),
  },
  alignLeft: {
    label: 'Align Left',
    icon: 'lucide-align-left',
    isActive: (editor) => editor.isActive({ textAlign: 'left' }),
    isAvailable: hasExtension('textAlign'),
  },
  alignCenter: {
    label: 'Align Center',
    icon: 'lucide-align-center',
    isActive: (editor) => editor.isActive({ textAlign: 'center' }),
    isAvailable: hasExtension('textAlign'),
  },
  alignRight: {
    label: 'Align Right',
    icon: 'lucide-align-right',
    isActive: (editor) => editor.isActive({ textAlign: 'right' }),
    isAvailable: hasExtension('textAlign'),
  },
  fontColor: {
    label: 'Font Color',
    icon: 'lucide-baseline',
    isActive: (editor) => editor.isActive('textStyle'),
    isAvailable: hasExtension('namedColor'),
  },
  fontHighlight: {
    label: 'Highlight',
    icon: 'lucide-highlighter',
    isActive: (editor) => editor.isActive('namedHighlight'),
    isAvailable: hasMark('namedHighlight'),
  },
  image: {
    label: 'Image',
    icon: 'lucide-image',
    isAvailable: (editor) =>
      hasNode('image')(editor) && hasCommand('selectAndUploadImage')(editor),
  },
  video: {
    label: 'Video',
    icon: 'lucide-video',
    isAvailable: (editor) =>
      hasNode('video')(editor) && hasCommand('selectAndUploadVideo')(editor),
  },
  link: {
    label: 'Link',
    icon: 'lucide-link',
    isActive: (editor) => editor.isActive('link'),
    isAvailable: hasMark('link'),
  },
  table: {
    label: 'Table',
    icon: 'lucide-table',
    isAvailable: hasNode('table'),
  },
  horizontalRule: {
    label: 'Horizontal Rule',
    icon: 'lucide-minus',
    isAvailable: hasNode('horizontalRule'),
  },
  taskList: {
    label: 'Task List',
    icon: 'lucide-list-checks',
    isAvailable: hasNode('taskList'),
  },
  codeBlock: {
    label: 'Code Block',
    icon: 'lucide-code',
    isAvailable: hasNode('codeBlock'),
  },
  embed: {
    label: 'Embed',
    icon: 'lucide-gallery-vertical',
    isAvailable: hasIframeDialog,
  },
  toc: {
    label: 'Table of Contents',
    icon: 'lucide-table-of-contents',
    isAvailable: hasNode('tocNode'),
  },
} satisfies Record<string, EditorCommandMeta>
