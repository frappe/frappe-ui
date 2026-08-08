import '@tiptap/extension-text-style';
import { Extension } from '@tiptap/core';
import { extractTextColorFromStyle } from '../shared/color-utils';
/**
 * This extension allows you to color your text using named colors instead of hex/rgb values.
 * Colors are applied as data attributes that can be styled with CSS for light/dark mode support.
 */
export const NamedColorExtension = Extension.create({
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
                            // Check for CSS custom property format in style attribute
                            const style = element.getAttribute('style');
                            if (style) {
                                const colorMatch = style.match(/color:\s*var\(--prose-color-(\w+)\)/);
                                if (colorMatch && this.options.colors.includes(colorMatch[1])) {
                                    return colorMatch[1];
                                }
                                // Fallback: try extracting from legacy formats
                                const extractedColor = extractTextColorFromStyle(style, this.options.colors);
                                if (extractedColor) {
                                    return extractedColor;
                                }
                            }
                            return null;
                        },
                        renderHTML: (attributes) => {
                            if (!attributes.color ||
                                !this.options.colors.includes(attributes.color)) {
                                return {};
                            }
                            return {
                                style: `color: var(--prose-color-${attributes.color})`,
                            };
                        },
                    },
                },
            },
        ];
    },
    addCommands() {
        return {
            setColorByName: (colorName) => ({ chain }) => {
                // Validate that the color name is allowed
                if (!this.options.colors.includes(colorName)) {
                    console.warn(`Color "${colorName}" is not in the allowed colors list`);
                    return false;
                }
                let commandChain = chain().setMark('textStyle', { color: colorName });
                return commandChain.focus().run();
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
