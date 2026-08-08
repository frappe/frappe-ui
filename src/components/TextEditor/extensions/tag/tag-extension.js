import { Node, mergeAttributes } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import { createSuggestionExtension, } from '../suggestion/createSuggestionExtension';
import SuggestionList from '../suggestion/SuggestionList.vue';
import { toValue } from 'vue';
export const TagNode = Node.create({
    name: 'tagItem',
    group: 'inline',
    inline: true,
    selectable: true,
    atom: true,
    addAttributes() {
        return {
            tagId: {
                default: null,
                parseHTML: (element) => element.getAttribute('data-tag-id'),
                renderHTML: (attributes) => {
                    if (!attributes.tagId) {
                        return {};
                    }
                    return { 'data-tag-id': attributes.tagId };
                },
            },
            tagLabel: {
                default: 'tag',
                parseHTML: (element) => element.getAttribute('data-tag-label'),
                renderHTML: (attributes) => ({ 'data-tag-label': attributes.tagLabel }),
            },
        };
    },
    parseHTML() {
        return [
            {
                tag: 'span.tag-item',
                getAttrs: (dom) => {
                    const element = dom;
                    return {
                        tagId: element.getAttribute('data-tag-id'),
                        tagLabel: element.getAttribute('data-tag-label') ||
                            element.innerText.replace(/^#/, ''),
                    };
                },
            },
        ];
    },
    renderHTML({ HTMLAttributes }) {
        // HTMLAttributes will include data-tag-id and data-tag-label
        return [
            'span',
            mergeAttributes(HTMLAttributes, { class: 'tag-item' }),
            `#${HTMLAttributes['data-tag-label']}`,
        ];
    },
    renderText({ node }) {
        return `#${node.attrs.tagLabel || ''}`;
    },
    addCommands() {
        return {
            setTag: (attributes) => ({ commands }) => {
                return commands.insertContent({
                    type: this.name,
                    attrs: attributes,
                });
            },
        };
    },
});
export const TagExtension = createSuggestionExtension({
    name: 'tagSuggestion',
    char: '#',
    pluginKey: new PluginKey('tagSuggestion'),
    component: SuggestionList,
    addOptions() {
        return {
            tags: [],
        };
    },
    items: ({ query, editor }) => {
        const { tags: _tags } = editor.extensionManager.extensions.find((ext) => ext.name === 'tagSuggestion').options;
        let tags = toValue(_tags);
        // Filter existing tags based on the query
        let filteredTags = tags
            .filter((tag) => tag.label.toLowerCase().startsWith(query.toLowerCase()))
            .map((tag) => ({ ...tag, display: tag.label }));
        if (query.length > 0 &&
            !tags.some((tag) => tag.label.toLowerCase() === query.toLowerCase())) {
            filteredTags.push({
                display: `New tag: "${query}"`,
                label: query,
                isNew: true,
            });
        }
        return filteredTags;
    },
    command: ({ editor, range, props }) => {
        const attributes = {
            tagLabel: props.label,
            ...(props.id && !props.isNew && { tagId: props.id }),
        };
        editor
            .chain()
            .focus()
            .insertContentAt(range, [
            {
                type: TagNode.name,
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
    decorationClass: 'tag-suggestion-active',
});
export function getTagExtensions(getTags) {
    if (getTags() === null) {
        return [];
    }
    return [
        TagNode,
        TagExtension.configure({
            tags: getTags,
        }),
    ];
}
