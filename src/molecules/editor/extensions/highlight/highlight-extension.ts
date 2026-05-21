import { Mark, mergeAttributes } from '@tiptap/core'
import {
  getClosestNamedColor,
  highlightColorHexMap,
  legacyHighlightColorMap,
  extractHighlightColorFromStyle,
} from '../shared/color-utils'

export interface HighlightOptions {
  /**
   * HTML tag to wrap the highlighted text
   * @default 'mark'
   */
  HTMLAttributes: Record<string, any>

  /**
   * Available highlight color names that can be used
   * @default ['yellow', 'blue', 'green', 'red', 'orange', 'purple', 'pink', 'gray']
   */
  colors: string[]

  /**
   * Enable multiple highlight colors
   * @default true
   */
  multicolor: boolean
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    namedHighlight: {
      /**
       * Set a highlight by color name
       * @param colorName The named color to set (e.g., 'yellow', 'blue')
       * @example editor.commands.setHighlightByName('yellow')
       */
      setHighlightByName: (colorName: string) => ReturnType
      /**
       * Toggle a highlight by color name
       * @param colorName The named color to toggle (e.g., 'yellow', 'blue')
       * @example editor.commands.toggleHighlightByName('yellow')
       */
      toggleHighlightByName: (colorName: string) => ReturnType
      /**
       * Unset the highlight
       * @example editor.commands.unsetHighlight()
       */
      unsetHighlight: () => ReturnType
    }
  }
}

/**
 * This extension allows you to highlight your text using named colors instead of hex/rgb values.
 * Highlights are applied as data attributes that can be styled with CSS for light/dark mode support.
 */
export const NamedHighlightExtension = Mark.create<HighlightOptions>({
  name: 'namedHighlight',

  addOptions() {
    return {
      HTMLAttributes: {},
      multicolor: true,
      colors: [
        'yellow',
        'blue',
        'green',
        'red',
        'orange',
        'purple',
        'pink',
        'gray',
        'teal',
        'cyan',
      ],
    }
  },

  addAttributes() {
    if (!this.options.multicolor) {
      return {}
    }

    return {
      color: {
        default: null,
        parseHTML: (element) => {
          // Check for CSS custom property format in style attribute
          const style = element.getAttribute('style')
          if (style) {
            const highlightMatch = style.match(
              /background-color:\s*var\(--prose-highlight-(\w+)\)/,
            )
            if (
              highlightMatch &&
              this.options.colors.includes(highlightMatch[1])
            ) {
              return highlightMatch[1]
            }
          }

          // Check for legacy format with data-color attribute (hex value)
          const legacyColorAttr = element.getAttribute('data-color')
          if (legacyColorAttr) {
            const closestColor = getClosestNamedColor(
              legacyColorAttr,
              this.options.colors,
              highlightColorHexMap,
              legacyHighlightColorMap,
            )
            if (closestColor) {
              return closestColor
            }
          }

          // Try extracting from style attribute as fallback
          if (style) {
            const extractedColor = extractHighlightColorFromStyle(
              style,
              this.options.colors,
            )
            if (extractedColor) {
              return extractedColor
            }
          }

          return null
        },
        renderHTML: (attributes) => {
          if (
            !attributes.color ||
            !this.options.colors.includes(attributes.color)
          ) {
            return {}
          }

          return {
            style: `background-color: var(--prose-highlight-${attributes.color})`,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'mark',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'mark',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ]
  },

  addCommands() {
    return {
      setHighlightByName:
        (colorName) =>
        ({ chain, commands, editor, state }) => {
          // Validate that the color name is allowed
          if (!this.options.colors.includes(colorName)) {
            console.warn(
              `Highlight color "${colorName}" is not in the allowed colors list`,
            )
            return false
          }

          const { from, to, empty } = state.selection // Get original selection details

          let commandChain = chain()
          if (this.options.multicolor) {
            commandChain = commandChain.setMark(this.name, { color: colorName })
          } else {
            commandChain = commandChain.setMark(this.name)
          }

          if (!empty) {
            commandChain = commandChain
              .setTextSelection(to)
              .command(({ tr }) => {
                tr.setStoredMarks([])
                return true
              })
          }

          return commandChain.focus().run()
        },
      toggleHighlightByName:
        (colorName) =>
        ({ chain, commands, editor, state }) => {
          // Validate that the color name is allowed
          if (!this.options.colors.includes(colorName)) {
            console.warn(
              `Highlight color "${colorName}" is not in the allowed colors list`,
            )
            return false
          }

          const { to, empty } = state.selection // Get original selection details
          const highlightAttributes = this.options.multicolor
            ? { color: colorName }
            : undefined

          // Check if the mark is currently active with the given attributes *before* toggling
          // This helps determine if the toggle action will be setting or unsetting the mark.
          const isCurrentlyActive = editor.isActive(
            this.name,
            highlightAttributes,
          )

          let commandChain = chain().toggleMark(this.name, highlightAttributes)

          // If the selection was not empty AND the toggle action is about to *set* the mark
          // (i.e., it wasn't active before)
          if (!empty && !isCurrentlyActive) {
            commandChain = commandChain
              .setTextSelection(to)
              .command(({ tr }) => {
                tr.setStoredMarks([])
                return true
              })
          }

          return commandChain.focus().run()
        },
      unsetHighlight:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name)
        },
    }
  },
})

export { NamedHighlightExtension as default }
