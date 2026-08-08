import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { PluginKey } from '@tiptap/pm/state';
import { createSuggestionRenderer, } from './extensions/shared/suggestion-renderer';
function buildSuggestionExtension(options) {
    return Extension.create({
        name: options.name,
        addOptions() {
            return {
                suggestion: {
                    char: options.trigger,
                    allowSpaces: options.allowSpaces,
                    pluginKey: new PluginKey(options.name),
                    items: ({ query }) => typeof options.items === 'function' ? options.items(query) : options.items,
                    command: ({ editor, range, props }) => {
                        options.command({ editor, item: props, range });
                    },
                    render: options.component
                        ? () => createSuggestionRenderer(options.component, options.floatingOptions)
                        : undefined,
                },
            };
        },
        addProseMirrorPlugins() {
            return [Suggestion({ editor: this.editor, ...this.options.suggestion })];
        },
    });
}
export const SuggestionExtension = {
    configure: buildSuggestionExtension,
};
