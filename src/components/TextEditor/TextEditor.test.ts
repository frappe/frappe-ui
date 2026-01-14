import { describe, expect, it, vi } from 'vitest'

vi.mock('./extensions/tag/tag-extension', () => ({
  TagNode: { name: 'tagItem' },
  TagExtension: {
    name: 'tagSuggestion',
    configure: ({ tags }: any) => ({
      name: 'tagSuggestion',
      options: { tags },
    }),
  },
}))

import { getTagExtensions } from './tagExtensions'

describe('getTagExtensions', () => {
  it('returns an empty array when tags are disabled', () => {
    expect(getTagExtensions(() => null)).toEqual([])
  })

  it('returns tag-related extensions when tags are provided', () => {
    const extensions = getTagExtensions(() => [])
    const extensionNames = extensions.map((extension) => extension.name)

    expect(extensionNames).toContain('tagItem')
    expect(extensionNames).toContain('tagSuggestion')
  })
})
