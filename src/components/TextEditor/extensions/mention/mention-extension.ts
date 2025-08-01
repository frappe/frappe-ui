import { MaybeRefOrGetter, toValue, type Component } from 'vue'
import { Extension, Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { PluginKey } from '@tiptap/pm/state'
import {
  createSuggestionExtension,
  BaseSuggestionItem,
} from '../suggestion/createSuggestionExtension'
import SuggestionList from '../suggestion/SuggestionList.vue'
import './style.css'

export interface MentionSuggestionItem extends BaseSuggestionItem {
  id: string
  label: string
  value?: string
  email?: string
  full_name?: string
}

function createMentionNode(component?: Component) {
  const config: any = {
    name: 'mention',
    group: 'inline',
    inline: true,
    selectable: true,
    atom: true,

    addOptions() {
      return {
        component: undefined,
      }
    },

    addAttributes() {
      return {
        id: {
          default: null,
          parseHTML: (element: HTMLElement) => element.getAttribute('data-id'),
          renderHTML: (attributes: any) => {
            if (!attributes.id) {
              return {}
            }
            return { 'data-id': attributes.id }
          },
        },
        label: {
          default: null,
          parseHTML: (element: HTMLElement) =>
            element.getAttribute('data-label'),
          renderHTML: (attributes: any) => {
            if (!attributes.label) {
              return {}
            }
            return { 'data-label': attributes.label }
          },
        },
      }
    },

    parseHTML() {
      return [
        {
          tag: 'span.mention[data-type="mention"]',
          getAttrs: (dom: any) => {
            const element = dom as HTMLElement
            return {
              id: element.getAttribute('data-id'),
              label: element.getAttribute('data-label'),
            }
          },
        },
      ]
    },

    renderHTML({ HTMLAttributes }: any) {
      return [
        'span',
        mergeAttributes(HTMLAttributes, {
          class: 'mention',
          'data-type': 'mention',
        }),
        `@${HTMLAttributes['data-label'] || HTMLAttributes.id || ''}`,
      ]
    },
  }

  if (component) {
    config.addNodeView = () => {
      return VueNodeViewRenderer(component)
    }
  }

  return Node.create(config)
}

const MentionSuggestionExtension =
  createSuggestionExtension<MentionSuggestionItem>({
    name: 'mentionSuggestion',
    char: '@',
    pluginKey: new PluginKey('mentionSuggestion'),
    component: SuggestionList,

    addOptions() {
      return {
        mentions: [],
      }
    },

    items: ({ query, editor }) => {
      const { mentions: _mentions } = editor.extensionManager.extensions.find(
        (ext) => ext.name === 'mentionSuggestion',
      )!.options
      const mentions = toValue(_mentions)

      const filtered = mentions
        .filter((mention: MentionSuggestionItem) =>
          mention.label.toLowerCase().startsWith(query.toLowerCase()),
        )
        .slice(0, 10)
        .map((mention: MentionSuggestionItem) => ({
          ...mention,
          display: mention.label,
        }))

      return filtered
    },

    command: ({ editor, range, props }) => {
      const attributes = {
        id: props.id || props.value,
        label: props.label,
      }

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
        .run()
    },

    tippyOptions: {
      placement: 'bottom-start',
      offset: [0, 8],
    },
    allowSpaces: false,
    decorationTag: 'span',
    decorationClass: 'mention-suggestion-active',
  })

export const MentionExtension = Extension.create<{
  mentions: MaybeRefOrGetter<MentionSuggestionItem[]>
  component?: Component
}>({
  name: 'mentionExtension',

  addOptions() {
    return {
      mentions: [],
      component: undefined,
    }
  },

  addExtensions() {
    return [
      createMentionNode(this.options.component),
      MentionSuggestionExtension.configure({
        mentions: this.options.mentions,
      }),
    ]
  },
})
