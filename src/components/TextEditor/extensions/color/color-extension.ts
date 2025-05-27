import '@tiptap/extension-text-style'

import { Extension } from '@tiptap/core'
import { extractTextColorFromStyle } from '../shared/color-utils'

export type ColorOptions = {
  /**
   * The types where the color can be applied
   * @default ['textStyle']
   */
  types: string[]

  /**
   * Available color names that can be used
   * @default ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'gray']
   */
  colors: string[]
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    namedColor: {
      /**
       * Set the text color by name
       * @param colorName The named color to set (e.g., 'blue', 'red')
       * @example editor.commands.setColorByName('blue')
       */
      setColorByName: (colorName: string) => ReturnType

      /**
       * Unset the text color
       * @example editor.commands.unsetColor()
       */
      unsetColor: () => ReturnType
    }
  }
}

/**
 * This extension allows you to color your text using named colors instead of hex/rgb values.
 * Colors are applied as data attributes that can be styled with CSS for light/dark mode support.
 */
export const NamedColorExtension = Extension.create<ColorOptions>({
  name: 'namedColor',

  addOptions() {
    return {
      types: ['textStyle'],
      colors: [
        'red',
        'blue',
        'green',
        'yellow',
        'orange',
        'purple',
        'pink',
        'gray',
        'teal',
        'cyan',
      ],
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          color: {
            default: null,
            parseHTML: (element) => {
              // Check for CSS custom property format in style attribute
              const style = element.getAttribute('style')
              if (style) {
                const colorMatch = style.match(
                  /color:\s*var\(--prose-color-(\w+)\)/,
                )
                if (colorMatch && this.options.colors.includes(colorMatch[1])) {
                  return colorMatch[1]
                }

                // Fallback: try extracting from legacy formats
                const extractedColor = extractTextColorFromStyle(
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
                style: `color: var(--prose-color-${attributes.color})`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setColorByName:
        (colorName: string) =>
        ({ chain, state, editor }) => {
          // Validate that the color name is allowed
          if (!this.options.colors.includes(colorName)) {
            console.warn(
              `Color "${colorName}" is not in the allowed colors list`,
            )
            return false
          }

          const { to, empty } = state.selection

          let commandChain = chain().setMark('textStyle', { color: colorName })

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
      unsetColor:
        () =>
        ({ chain }) => {
          return chain()
            .setMark('textStyle', { color: null })
            .removeEmptyTextStyle()
            .run()
        },
    }
  },
})

export { NamedColorExtension as default }
