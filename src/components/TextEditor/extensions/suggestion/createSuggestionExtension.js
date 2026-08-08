import { Extension } from '@tiptap/core';
import { VueRenderer } from '@tiptap/vue-3';
import Suggestion from '@tiptap/suggestion';
import tippy from 'tippy.js';
export function createSuggestionExtension(options) {
    return Extension.create({
        name: options.name,
        addOptions() {
            const customOptions = options.addOptions
                ? options.addOptions.call(this)
                : {};
            return {
                ...customOptions,
                suggestion: {
                    char: options.char,
                    pluginKey: options.pluginKey,
                    items: options.items,
                    command: options.command,
                    allowSpaces: options.allowSpaces,
                    startOfLine: options.startOfLine,
                    decorationTag: options.decorationTag || 'span',
                    decorationClass: options.decorationClass || 'suggestion',
                    render: () => {
                        let component;
                        let popup;
                        return {
                            onStart: (props) => {
                                component = new VueRenderer(options.component, {
                                    editor: props.editor,
                                    props: props,
                                });
                                if (!props.clientRect || !component.element) {
                                    return;
                                }
                                const defaultTippyOptions = {
                                    getReferenceClientRect: props.clientRect,
                                    appendTo: () => document.body,
                                    content: component.element,
                                    showOnCreate: true,
                                    interactive: true,
                                    trigger: 'manual',
                                    placement: 'bottom-start',
                                };
                                popup = tippy('body', {
                                    ...defaultTippyOptions,
                                    ...options.tippyOptions,
                                });
                            },
                            onUpdate(props) {
                                component?.updateProps(props);
                                if (!props.clientRect) {
                                    return;
                                }
                                if (popup && popup[0]) {
                                    popup[0].setProps({
                                        getReferenceClientRect: props.clientRect,
                                    });
                                }
                            },
                            onKeyDown(props) {
                                if (props.event.key === 'Escape') {
                                    if (popup && popup[0]) {
                                        popup[0].hide();
                                    }
                                    return true;
                                }
                                if (component &&
                                    component.ref &&
                                    typeof component.ref.onKeyDown === 'function') {
                                    return component.ref.onKeyDown(props);
                                }
                                return false;
                            },
                            onExit() {
                                if (popup && popup[0]) {
                                    popup[0].destroy();
                                }
                                if (component) {
                                    component.destroy();
                                }
                                popup = null;
                                component = null;
                            },
                        };
                    },
                },
            };
        },
        addProseMirrorPlugins() {
            return [
                Suggestion({
                    editor: this.editor,
                    ...this.options.suggestion,
                }),
            ];
        },
    });
}
