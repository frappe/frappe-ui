// Engine
export {
  useEditor,
  type Editor,
  type JSONContent,
  type UploadedFile,
} from './useEditor'

// The component
export { default as TextEditor } from './TextEditor.vue'

// Building blocks (compose without TextEditor)
export { default as EditorContent } from './EditorContent.vue'
export { default as EditorFixedMenu } from './EditorFixedMenu.vue'
export { default as EditorBubbleMenu } from './EditorBubbleMenu.vue'
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
export * from './extensions'

// Menu items, groups, separators, and toolbar presets
export * from './menu'
