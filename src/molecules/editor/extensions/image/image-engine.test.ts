import { describe, it, expect } from 'vitest'
import { unsupportedImageMessage } from './image-engine'

const file = (name: string, type: string) => new File(['x'], name, { type })

describe('unsupportedImageMessage', () => {
  it('lets a decodable image through', () => {
    expect(unsupportedImageMessage(file('a.png', 'image/png'))).toBeNull()
    expect(unsupportedImageMessage(file('a.svg', 'image/svg+xml'))).toBeNull()
  })

  it('turns a file that is no image away, naming what would do', () => {
    expect(unsupportedImageMessage(file('a.pdf', 'application/pdf'))).toMatch(
      /Unsupported file.*JPG, PNG, GIF, WEBP or SVG/,
    )
    expect(unsupportedImageMessage(file('a', ''))).toMatch(/Unsupported file/)
  })

  it('turns HEIC away by type or by name', () => {
    expect(unsupportedImageMessage(file('a.heic', 'image/heic'))).toMatch(
      /HEIC/,
    )
    expect(unsupportedImageMessage(file('IMG_1.HEIC', ''))).toMatch(/HEIC/)
  })
})
