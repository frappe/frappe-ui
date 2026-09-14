// Editor styles ship with the package: importing from `frappe-ui/editor` pulls
// in the ProseMirror/prose-v3 rules so the editor is self-contained and does not
// rely on any other component's stylesheet being loaded.
import './style.css'

// Engine
export {
  useEditor,
  type Editor as TiptapEditor,
  type JSONContent,
  type UploadedFile,
} from './useEditor'

// The component. Use `TiptapEditor` for the underlying editor instance type.
export { default as Editor } from './Editor.vue'

// Building blocks (compose without <Editor>)
export { default as EditorContent } from './EditorContent.vue'
export { default as EditorDropZone } from './components/EditorDropZone.vue'
export { default as EditorFixedMenu } from './EditorFixedMenu.vue'
export { default as EditorBubbleMenu } from './EditorBubbleMenu.vue'
export { default as EditorTableMenu } from './EditorTableMenu.vue'
export { default as EditorFloatingMenu } from './EditorFloatingMenu.vue'

// Kits — configurable extension bundles (StarterKit is re-exported from extensions)
export {
  CommentKit,
  RichTextKit,
  InlineKit,
  type CommentKitOptions,
  type RichTextKitOptions,
  type InlineKitOptions,
} from './kits'

// Individual extensions + StarterKit (frappe-ui default config applied)
// The list is written out rather than re-exported with `export *`: a wildcard
// from an implementation module publishes whatever that file exports next
// (PHILOSOPHY.md, P15).
export {
  // Suggestion engine
  SuggestionExtension,
  // Document basics
  StarterKit,
  EditorDropcursor,
  Placeholder,
  setPlaceholder,
  Heading,
  HeadingIds,
  Toc,
  Link,
  Code,
  CodeBlock,
  ListJoin,
  TaskList,
  TaskItem,
  Typography,
  Markdown,
  // Tables
  Table,
  TableRow,
  TableCell,
  TableHeader,
  TableNavigation,
  TableCellColor,
  TableSelectionOverlay,
  // Text styling
  TextAlign,
  TextStyle,
  Color,
  Highlight,
  // Media and embeds
  Image,
  ImageGroup,
  ImageViewer,
  Video,
  Attachment,
  MediaDrop,
  Iframe,
  // Inline widgets
  Mention,
  Tag,
  Emoji,
  SlashCommands,
  // Clipboard
  ContentPaste,
  StyleClipboard,
} from './extensions'
export type {
  SuggestionExtensionOptions,
  SuggestionRange,
  MentionSuggestionItem,
  TagSuggestionItem,
  StarterKitOptions,
  MediaUploadRequestOptions,
  MarkdownExtensionOptions,
} from './extensions'

// Menu items, groups, separators, and toolbar presets
export {
  // Marks
  Bold,
  Italic,
  Strike,
  InlineCode,
  // Blocks
  Paragraph,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  HeadingGroup,
  BulletList,
  OrderedList,
  Blockquote,
  HorizontalRule,
  // Alignment and color
  AlignLeft,
  AlignCenter,
  AlignRight,
  FontColor,
  FontHighlight,
  // Insertions
  InsertImage,
  InsertVideo,
  InsertAttachment,
  InsertLink,
  InsertIframe,
  InsertTable,
  // History
  Undo,
  Redo,
  // Layout
  Separator,
  // Table commands
  TableAddColumnBefore,
  TableAddColumnAfter,
  TableDeleteColumn,
  TableAddRowBefore,
  TableAddRowAfter,
  TableDeleteRow,
  TableToggleHeaderRow,
  TableMergeOrSplit,
  TableDelete,
  CellColor,
  // Toolbar presets
  tableToolbar,
  minimalToolbar,
  commentToolbar,
  articleToolbar,
} from './menu'
export type {
  MenuActionContext,
  CommandMenuItem,
  MenuGroupItem,
  MenuItem,
} from './menu'
