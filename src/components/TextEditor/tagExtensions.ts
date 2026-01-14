import { TagExtension, TagNode } from './extensions/tag/tag-extension'
import { TextEditorProps } from './types'

export function getTagExtensions(getTags: () => TextEditorProps['tags']) {
  if (getTags() === null) {
    return []
  }

  return [
    TagNode,
    TagExtension.configure({
      tags: getTags,
    }),
  ]
}
