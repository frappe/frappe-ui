import { toValue } from 'vue';
import { Extension, Node, mergeAttributes } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import { PluginKey } from '@tiptap/pm/state';
import { createSuggestionExtension, } from '../suggestion/createSuggestionExtension';
import SuggestionList from '../suggestion/SuggestionList.vue';
import './style.css';
function createMentionNode(component) {
    const config = {
        name: 'mention',
        group: 'inline',
        inline: true,
        selectable: true,
        atom: true,
        addOptions() {
            return {
                component: undefined,
            };
        },
        addAttributes() {
            return {
                id: {
                    default: null,
                    parseHTML: (element) => element.getAttribute('data-id'),
                    renderHTML: (attributes) => {
                        if (!attributes.id) {
                            return {};
                        }
                        return { 'data-id': attributes.id };
                    },
                },
                label: {
                    default: null,
                    parseHTML: (element) => element.getAttribute('data-label'),
                    renderHTML: (attributes) => {
                        if (!attributes.label) {
                            return {};
                        }
                        return { 'data-label': attributes.label };
                    },
                },
            };
        },
        parseHTML() {
            return [
                {
                    tag: 'span.mention[data-type="mention"]',
                    getAttrs: (dom) => {
                        const element = dom;
                        return {
                            id: element.getAttribute('data-id'),
                            label: element.getAttribute('data-label'),
                        };
                    },
                },
            ];
        },
        renderHTML({ HTMLAttributes }) {
            return [
                'span',
                mergeAttributes(HTMLAttributes, {
                    class: 'mention',
                    'data-type': 'mention',
                }),
                `@${HTMLAttributes['data-label'] || HTMLAttributes.id || ''}`,
            ];
        },
        renderText({ node }) {
            return `@${node.attrs.label || node.attrs.id || ''}`;
        },
    };
    if (component) {
        config.addNodeView = () => {
            return VueNodeViewRenderer(component);
        };
    }
    return Node.create(config);
}
const MentionSuggestionExtension = createSuggestionExtension({
    name: 'mentionSuggestion',
    char: '@',
    pluginKey: new PluginKey('mentionSuggestion'),
    component: SuggestionList,
    addOptions() {
        return {
            mentions: [],
        };
    },
    items: ({ query, editor }) => {
        const { mentions: _mentions } = editor.extensionManager.extensions.find((ext) => ext.name === 'mentionSuggestion').options;
        const mentions = toValue(_mentions);
        const filtered = mentions
            .filter((mention) => mention.label.toLowerCase().startsWith(query.toLowerCase()))
            .slice(0, 10)
            .map((mention) => ({
            ...mention,
            display: mention.label,
        }));
        return filtered;
    },
    command: ({ editor, range, props }) => {
        const attributes = {
            id: props.id || props.value,
            label: props.label,
        };
        editor
            .chain()
            .focus()
            .insertContentAt(range, [
            {
                type: 'mention',
                attrs: attributes,
            },
            {
                type: 'text',
                text: ' ',
            },
        ])
            .run();
    },
    tippyOptions: {
        placement: 'bottom-start',
        offset: [0, 8],
    },
    allowSpaces: false,
    decorationTag: 'span',
    decorationClass: 'mention-suggestion-active',
});
export const MentionExtension = Extension.create({
    name: 'mentionExtension',
    addOptions() {
        return {
            mentions: [],
            component: undefined,
        };
    },
    addExtensions() {
        return [
            createMentionNode(this.options.component),
            MentionSuggestionExtension.configure({
                mentions: this.options.mentions,
            }),
        ];
    },
    addCommands() {
        return {
            getMentions: () => ({ editor }) => {
                const mentions = [];
                editor.state.doc.descendants((node) => {
                    if (node.type.name === 'mention') {
                        mentions.push({
                            id: node.attrs.id,
                            label: node.attrs.label,
                        });
                    }
                });
                return mentions;
            },
        };
    },
});
