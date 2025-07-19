import { Node, mergeAttributes, Range, Editor } from '@tiptap/core'
import { PluginKey } from '@tiptap/pm/state'
import {
  createSuggestionExtension,
  BaseSuggestionItem,
} from '../suggestion/createSuggestionExtension'
import SuggestionList from '../suggestion/SuggestionList.vue'
import { toValue, unref } from 'vue'

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
            return {}
          }
          return { 'data-tag-id': attributes.tagId }
        },
      },
      tagLabel: {
        default: 'tag',
        parseHTML: (element) => element.getAttribute('data-tag-label'),
        renderHTML: (attributes) => ({ 'data-tag-label': attributes.tagLabel }),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span.tag-item',
        getAttrs: (dom) => {
          const element = dom as HTMLElement
          return {
            tagId: element.getAttribute('data-tag-id'),
            tagLabel:
              element.getAttribute('data-tag-label') ||
              element.innerText.replace(/^#/, ''),
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    // HTMLAttributes will include data-tag-id and data-tag-label
    return [
      'span',
      mergeAttributes(HTMLAttributes, { class: 'tag-item' }),
      `#${HTMLAttributes['data-tag-label']}`,
    ]
  },

  addCommands() {
    return {
      setTag:
        (attributes: { tagLabel: string; tagId?: string }) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          })
        },
    }
  },
})

interface TagSuggestionItem extends BaseSuggestionItem {
  name?: string
  label: string
  isNew?: boolean
}

export const TagExtension = createSuggestionExtension<TagSuggestionItem>({
  name: 'tagSuggestion',
  char: '#',
  pluginKey: new PluginKey('tagSuggestion'),
  component: SuggestionList,

  addOptions() {
    return {
      tags: [],
    }
  },

  items: ({ query, editor }) => {
    const { tags: _tags } = editor.extensionManager.extensions.find(
      (ext) => ext.name === 'tagSuggestion',
    )!.options
    let tags = toValue(_tags)

    // Filter existing tags based on the query
    let filteredTags = tags
      .filter((tag: TagSuggestionItem) =>
        tag.label.toLowerCase().startsWith(query.toLowerCase()),
      )
      .map((tag: TagSuggestionItem) => ({ ...tag, display: tag.label }))

    if (
      query.length > 0 &&
      !tags.some(
        (tag: TagSuggestionItem) =>
          tag.label.toLowerCase() === query.toLowerCase(),
      )
    ) {
      filteredTags.push({
        display: `New tag: "${query}"`,
        label: query,
        isNew: true,
      })
    }
    return filteredTags
  },

  command: ({ editor, range, props }) => {
    const attributes = {
      tagLabel: props.label,
      ...(props.id && !props.isNew && { tagId: props.id }),
    }

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
      .run()
  },

  tippyOptions: {
    placement: 'bottom-start',
    offset: [0, 8],
  },
  allowSpaces: false,
  decorationTag: 'span',
  decorationClass: 'tag-suggestion-active',
})
