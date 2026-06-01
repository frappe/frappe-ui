import { type MaybeRefOrGetter, toValue, type Component } from 'vue'
import {
  Extension,
  Node,
  mergeAttributes,
  type CommandProps,
  type RawCommands,
} from '@tiptap/core'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { PluginKey } from '@tiptap/pm/state'
import {
  createSuggestionExtension,
  type BaseSuggestionItem,
} from '../suggestion/createSuggestionExtension'
import SuggestionList from '../suggestion/SuggestionList.vue'
import {
  insertSuggestionNode,
  filterByQuery,
  getSuggestionOptions,
} from '@molecules/editor/extensions/shared/suggestion-helpers'
import './style.css'

export interface MentionSuggestionItem extends BaseSuggestionItem {
  id: string
  label: string
  value?: string
  email?: string
  full_name?: string
}

interface MentionSuggestionOptions {
  mentions: MaybeRefOrGetter<MentionSuggestionItem[]>
}

function createMentionNode(component?: Component) {
  const nodeView = component
    ? { addNodeView: () => VueNodeViewRenderer(component) }
    : {}

  return Node.create({
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
          parseHTML: (element) => element.getAttribute('data-id'),
          renderHTML: (attributes) => {
            if (!attributes.id) {
              return {}
            }
            return { 'data-id': attributes.id }
          },
        },
        label: {
          default: null,
          parseHTML: (element) => element.getAttribute('data-label'),
          renderHTML: (attributes) => {
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
          getAttrs: (dom) => {
            const element = dom as HTMLElement
            return {
              id: element.getAttribute('data-id'),
              label: element.getAttribute('data-label'),
            }
          },
        },
      ]
    },

    renderHTML({ HTMLAttributes }) {
      return [
        'span',
        mergeAttributes(HTMLAttributes, {
          class: 'mention',
          'data-type': 'mention',
        }),
        `@${HTMLAttributes['data-label'] || HTMLAttributes.id || ''}`,
      ]
    },
    renderText({ node }) {
      return `@${node.attrs.label || node.attrs.id || ''}`
    },

    ...nodeView,
  })
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
      const options = getSuggestionOptions<MentionSuggestionOptions>(
        editor,
        'mentionSuggestion',
      )
      const mentions = toValue(options?.mentions ?? [])

      return filterByQuery(mentions, query, 'label')
        .slice(0, 10)
        .map((mention) => ({ ...mention, display: mention.label }))
    },

    command: ({ editor, range, props }) => {
      insertSuggestionNode(editor, range, 'mention', {
        id: props.id || props.value,
        label: props.label,
      })
    },

    floatingOptions: {
      placement: 'bottom-start',
      offset: [0, 8],
    },
    allowSpaces: false,
    decorationTag: 'span',
    decorationClass: 'mention-suggestion-active',
  })

export const MentionExtension = Extension.create<{
  items: MaybeRefOrGetter<MentionSuggestionItem[]> | null
  component?: Component
}>({
  name: 'mentionExtension',

  addOptions() {
    return {
      items: null,
      component: undefined,
    }
  },

  addExtensions() {
    const node = createMentionNode(this.options.component)
    // Inert until configured: only wire the `@` suggestion when an item source
    // is provided. Existing mentions in content still render through the node.
    if (this.options.items == null) return [node]
    return [
      node,
      MentionSuggestionExtension.configure({ mentions: this.options.items }),
    ]
  },

  addCommands() {
    return {
      getMentions:
        () =>
        ({ editor }: CommandProps) => {
          const mentions: MentionSuggestionItem[] = []

          editor.state.doc.descendants((node: ProseMirrorNode) => {
            if (node.type.name === 'mention') {
              mentions.push({
                id: node.attrs.id,
                label: node.attrs.label,
              })
            }
          })

          return mentions
        },
      // getMentions is a data-query command (returns the mention list), not a
      // chainable boolean command — cast to satisfy the RawCommands shape.
    } as unknown as Partial<RawCommands>
  },
})
