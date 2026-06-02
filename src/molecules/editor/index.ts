// Editor styles ship with the package: importing from `frappe-ui/editor` pulls
// in the ProseMirror/prose-v3 rules so the editor is self-contained and does not
// rely on any other component's stylesheet being loaded.
import './style.css'

// Engine
export {
  useEditor,
  type Editor,
  type JSONContent,
  type UploadedFile,
} from './useEditor'

// The component. NOTE: this is the `Editor` *value*; the `Editor` *type* above
// (the tiptap instance) lives in a separate namespace, so `import { Editor }`
// gets the component and `import type { Editor }` gets the type.
export { default as Editor } from './Editor.vue'

// Building blocks (compose without <Editor>)
export { default as EditorContent } from './EditorContent.vue'
export { default as EditorDropZone } from './components/EditorDropZone.vue'
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
