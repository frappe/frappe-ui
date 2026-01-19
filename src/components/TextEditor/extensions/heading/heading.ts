import TiptapHeading from '@tiptap/extension-heading'
import { textblockTypeInputRule, setBlockType } from '@tiptap/core'

export const Heading = TiptapHeading.extend({
  // This ensures that when a toolbar button calls 'toggleHeading', 
  // the styles (marks) are preserved.
  addCommands() {
    return {
      ...this.parent?.(),
      toggleHeading: (attributes) => ({ state, chain }) => {
        // 1. Capture the current styles
        const marks = state.storedMarks || state.selection.$from.marks()
        
        return chain()
          .toggleNode(this.name, 'paragraph', attributes)
          // 2. Re-apply the captured styles to the new heading node
          .command(({ tr }) => {
            if (marks) tr.setStoredMarks(marks)
            return true
          })
          .run()
      },
    }
  },

  addInputRules() {
    return this.options.levels.map((level) => {
      let regexp = new RegExp(`^(#{${level}})( |\\u00A0)$`)
      return textblockTypeInputRule({
        find: regexp,
        type: this.type,
        getAttributes: { level },
      })
    })
  },
})