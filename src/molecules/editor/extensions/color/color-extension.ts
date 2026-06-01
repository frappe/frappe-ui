import '@tiptap/extension-text-style'

import { Extension } from '@tiptap/core'
import { PALETTE_NAMES } from '../shared/color-palette'
import {
  extractTextColorFromStyle,
  textColorStyle,
} from '../shared/color-style'

export type ColorOptions = {
  /**
   * The types where the color can be applied
   * @default ['textStyle']
   */
  types: string[]

  /**
   * Available color names that can be used.
   * @default the full named-color palette
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
 * Color extension using named colors instead of hex/rgb values. Colors render
 * as `color: var(--prose-color-NAME)` so light/dark mode is driven by CSS.
 * Parsing normalizes legacy hex/rgb and CSS-var inline styles back to a name.
 */
export const NamedColorExtension = Extension.create<ColorOptions>({
  name: 'namedColor',

  addOptions() {
    return {
      types: ['textStyle'],
      colors: [...PALETTE_NAMES],
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
              const style = element.getAttribute('style')
              if (!style) return null
              // Shared extractor handles CSS-var, legacy hex, and rgb forms,
              // constrained to this extension's allowed colors.
              return extractTextColorFromStyle(style, this.options.colors)
            },
            renderHTML: (attributes) => {
              if (
                !attributes.color ||
                !this.options.colors.includes(attributes.color)
              ) {
                return {}
              }
              return { style: textColorStyle(attributes.color) }
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
        ({ chain }) => {
          if (!this.options.colors.includes(colorName)) {
            console.warn(
              `Color "${colorName}" is not in the allowed colors list`,
            )
            return false
          }
          return chain().setMark('textStyle', { color: colorName }).focus().run()
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
