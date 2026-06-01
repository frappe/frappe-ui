import { Mark, mergeAttributes } from '@tiptap/core'
import { PALETTE_NAMES } from '../shared/color-palette'
import {
  extractHighlightColorFromStyle,
  highlightColorStyle,
} from '../shared/color-style'

export interface HighlightOptions {
  /**
   * HTML attributes merged onto the rendered `<mark>`.
   * @default {}
   */
  HTMLAttributes: Record<string, unknown>

  /**
   * Available highlight color names that can be used.
   * @default the full named-color palette
   */
  colors: string[]

  /**
   * Enable multiple highlight colors. When `false`, color names are ignored
   * (a plain highlight is applied) and a one-time warning is emitted.
   * @default true
   */
  multicolor: boolean
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    namedHighlight: {
      /**
       * Set a highlight by color name
       * @example editor.commands.setHighlightByName('yellow')
       */
      setHighlightByName: (colorName: string) => ReturnType
      /**
       * Toggle a highlight by color name
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

/** Emit the multicolor-disabled warning at most once per extension instance. */
let warnedMonochrome = false
function warnMonochromeOnce() {
  if (warnedMonochrome) return
  warnedMonochrome = true
  console.warn(
    '[namedHighlight] multicolor is disabled; applying a plain highlight and ignoring the color name.',
  )
}

/**
 * Highlight mark using named colors instead of hex/rgb values. Renders as
 * `background-color: var(--prose-highlight-NAME)` so light/dark mode is driven
 * by CSS. Parsing normalizes legacy `data-color` hex + inline styles to a name.
 */
export const NamedHighlightExtension = Mark.create<HighlightOptions>({
  name: 'namedHighlight',

  addOptions() {
    return {
      HTMLAttributes: {},
      multicolor: true,
      colors: [...PALETTE_NAMES],
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
          const style = element.getAttribute('style')
          if (style) {
            // Shared extractor handles CSS-var + legacy hex/rgb forms.
            const fromStyle = extractHighlightColorFromStyle(
              style,
              this.options.colors,
            )
            if (fromStyle) return fromStyle
          }

          // Legacy `data-color` attribute (raw hex value).
          const legacyColorAttr = element.getAttribute('data-color')
          if (legacyColorAttr) {
            const fromLegacy = extractHighlightColorFromStyle(
              `background-color: ${legacyColorAttr}`,
              this.options.colors,
            )
            if (fromLegacy) return fromLegacy
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
          return { style: highlightColorStyle(attributes.color) }
        },
      },
    }
  },

  parseHTML() {
    return [{ tag: 'mark' }]
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
        ({ chain, state }) => {
          if (!this.options.colors.includes(colorName)) {
            console.warn(
              `Highlight color "${colorName}" is not in the allowed colors list`,
            )
            return false
          }

          const { to, empty } = state.selection

          let commandChain = chain()
          if (this.options.multicolor) {
            commandChain = commandChain.setMark(this.name, { color: colorName })
          } else {
            // multicolor:false → apply a plain highlight, warn once.
            warnMonochromeOnce()
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
        ({ chain, editor, state }) => {
          if (!this.options.colors.includes(colorName)) {
            console.warn(
              `Highlight color "${colorName}" is not in the allowed colors list`,
            )
            return false
          }

          const { to, empty } = state.selection
          let highlightAttributes: { color: string } | undefined
          if (this.options.multicolor) {
            highlightAttributes = { color: colorName }
          } else {
            warnMonochromeOnce()
            highlightAttributes = undefined
          }

          // Determine set-vs-unset direction before toggling.
          const isCurrentlyActive = editor.isActive(
            this.name,
            highlightAttributes,
          )

          let commandChain = chain().toggleMark(this.name, highlightAttributes)

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
