import TiptapHeading from '@tiptap/extension-heading'
import { textblockTypeInputRule } from '@tiptap/core'

// This custom Heading extension modifies the default input rule behavior.
// The default Tiptap heading input rule converts text to a heading when '#' is followed by any whitespace (including Enter).
// This customization ensures that headings are only created when '#' is followed by a literal space.
// This change is necessary to prevent conflicts with other extensions, such as a tags extension,
// which uses '#' followed by Enter to add a tag.
export const Heading = TiptapHeading.extend({
  addInputRules() {
    return this.options.levels.map((level) => {
      let regexp = new RegExp(`^(#{${level}}) $`)
      return textblockTypeInputRule({
        find: regexp,
        type: this.type,
        getAttributes: { level },
      })
    })
  },
})
