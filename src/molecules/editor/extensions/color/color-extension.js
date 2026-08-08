import '@tiptap/extension-text-style';
import { Extension } from '@tiptap/core';
import { PALETTE_NAMES } from '../shared/color-palette';
import { extractTextColorFromStyle, textColorStyle, } from '../shared/color-style';
/**
 * Color extension using named colors instead of hex/rgb values. Colors render
 * as `color: var(--prose-color-NAME)` so light/dark mode is driven by CSS.
 * Parsing normalizes legacy hex/rgb and CSS-var inline styles back to a name.
 */
export const NamedColorExtension = Extension.create({
    name: 'namedColor',
    addOptions() {
        return {
            types: ['textStyle'],
            colors: [...PALETTE_NAMES],
        };
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    color: {
                        default: null,
                        parseHTML: (element) => {
                            const style = element.getAttribute('style');
                            if (!style)
                                return null;
                            // Shared extractor handles CSS-var, legacy hex, and rgb forms,
                            // constrained to this extension's allowed colors.
                            return extractTextColorFromStyle(style, this.options.colors);
                        },
                        renderHTML: (attributes) => {
                            if (!attributes.color ||
                                !this.options.colors.includes(attributes.color)) {
                                return {};
                            }
                            return { style: textColorStyle(attributes.color) };
                        },
                    },
                },
            },
        ];
    },
    addCommands() {
        return {
            setColorByName: (colorName) => ({ chain }) => {
                if (!this.options.colors.includes(colorName)) {
                    console.warn(`Color "${colorName}" is not in the allowed colors list`);
                    return false;
                }
                return chain().setMark('textStyle', { color: colorName }).focus().run();
            },
            unsetColor: () => ({ chain }) => {
                return chain()
                    .setMark('textStyle', { color: null })
                    .removeEmptyTextStyle()
                    .run();
            },
        };
    },
});
export { NamedColorExtension as default };
