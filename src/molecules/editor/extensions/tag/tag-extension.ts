import {
  Node,
  Extension,
  mergeAttributes,
  type Extensions,
  type CommandProps,
  type RawCommands,
} from '@tiptap/core'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'
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
import { toValue, type MaybeRefOrGetter } from 'vue'

type TagOption = TagSuggestionItem & { id?: string }
type TagsOption = MaybeRefOrGetter<TagOption[]> | null

interface TagSuggestionOptions {
  tags: MaybeRefOrGetter<TagSuggestionItem[]>
}

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
        // Guard: a falsy label must not emit `data-tag-label="undefined"`.
        renderHTML: (attributes) => {
          if (!attributes.tagLabel) {
            return {}
          }
          return { 'data-tag-label': attributes.tagLabel }
        },
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
      `#${HTMLAttributes['data-tag-label'] || ''}`,
    ]
  },
  renderText({ node }: { node: ProseMirrorNode }) {
    return `#${node.attrs.tagLabel || ''}`
  },
  addCommands() {
    return {
      setTag:
        (attributes: { tagLabel: string; tagId?: string }) =>
        ({ commands }: CommandProps) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          })
        },
    } as unknown as Partial<RawCommands>
  },
})

export interface TagSuggestionItem extends BaseSuggestionItem {
  id?: string
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
    const options = getSuggestionOptions<TagSuggestionOptions>(
      editor,
      'tagSuggestion',
    )
    const tags = toValue(options?.tags ?? [])

    const filteredTags: TagSuggestionItem[] = filterByQuery(
      tags,
      query,
      'label',
    ).map((tag) => ({ ...tag, display: tag.label }))

    if (
      query.length > 0 &&
      !tags.some((tag) => tag.label.toLowerCase() === query.toLowerCase())
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
    insertSuggestionNode(editor, range, TagNode.name, {
      tagLabel: props.label,
      ...(props.id && !props.isNew && { tagId: props.id }),
    })
  },

  floatingOptions: {
    placement: 'bottom-start',
    offset: [0, 8],
  },
  allowSpaces: false,
  decorationTag: 'span',
  decorationClass: 'tag-suggestion-active',
})

/**
 * The ONE canonical tag-composite implementation. Always loads the inline
 * `tagItem` node (so existing tags in content render); wires the live `#`
 * suggestion only when an item source is supplied. Both `getTagExtensions`
 * (legacy functional API) and the `Tag` composite in `extensions.ts` delegate
 * here so there is a single source of truth for the inert-until-items rule.
 */
function buildTagExtensions(items: TagsOption): Extensions {
  if (items == null) return [TagNode]
  return [TagNode, TagExtension.configure({ tags: items })]
}

/**
 * Canonical `Extension.create` form of the tag composite (inert until `items`).
 * `extensions.ts` re-points its `Tag` export at this in the Rewire step.
 */
export const TagComposite = Extension.create<{
  items: TagsOption
}>({
  name: 'tag',
  addOptions() {
    return { items: null }
  },
  addExtensions() {
    return buildTagExtensions(this.options.items)
  },
})

/**
 * Legacy functional API. Kept for back-compat; delegates to the same builder as
 * `TagComposite` so there is exactly one implementation of the inert rule.
 */
export function getTagExtensions(getTags: () => TagsOption): Extensions {
  return buildTagExtensions(getTags())
}
