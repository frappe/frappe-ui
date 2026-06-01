import { describe, it, expect } from 'vitest'
import {
  ALLOWED_COLUMNS,
  DEFAULT_COLUMNS,
  clampColumns,
  getDefaultColumns,
  fileItemId,
  existingItemId,
  isImageSupported,
  filterImageFiles,
  columnSelectOptions,
} from './image-group-utils'

function fakeFile(name: string, type = 'image/png', size = 10): File {
  return { name, type, size } as unknown as File
}

describe('clampColumns', () => {
  it('passes allowed values through', () => {
    for (const n of ALLOWED_COLUMNS) expect(clampColumns(n)).toBe(n)
  })

  it('snaps out-of-range numbers to the nearest allowed value', () => {
    expect(clampColumns(1)).toBe(2)
    expect(clampColumns(5)).toBe(4)
    expect(clampColumns(99)).toBe(4)
  })

  it('parses numeric strings (e.g. from data-columns)', () => {
    expect(clampColumns('3')).toBe(3)
    expect(clampColumns('7')).toBe(4)
  })

  it('falls back to the default for invalid / falsy input', () => {
    expect(clampColumns(null)).toBe(DEFAULT_COLUMNS)
    expect(clampColumns(undefined)).toBe(DEFAULT_COLUMNS)
    expect(clampColumns('abc')).toBe(DEFAULT_COLUMNS)
    expect(clampColumns(0)).toBe(DEFAULT_COLUMNS)
    expect(clampColumns(-2)).toBe(DEFAULT_COLUMNS)
  })
})

describe('getDefaultColumns', () => {
  it('clamps small counts into the allowed set', () => {
    expect(getDefaultColumns(2)).toBe(2)
    expect(getDefaultColumns(3)).toBe(3)
    expect(getDefaultColumns(4)).toBe(4)
    expect(getDefaultColumns(1)).toBe(2)
  })

  it('chooses a tidy column count for larger groups', () => {
    expect(getDefaultColumns(8)).toBe(4)
    expect(getDefaultColumns(9)).toBe(3)
    expect(getDefaultColumns(11)).toBe(4)
  })

  it('defaults when count is non-positive', () => {
    expect(getDefaultColumns(0)).toBe(DEFAULT_COLUMNS)
  })
})

describe('deterministic ids', () => {
  it('fileItemId is stable for the same name+size and not Date.now-based', () => {
    const a = fileItemId(fakeFile('a.png', 'image/png', 42))
    const b = fileItemId(fakeFile('a.png', 'image/png', 42))
    expect(a).toBe(b)
    expect(a).toBe('file-a.png-42')
  })

  it('existingItemId is stable for the same src', () => {
    expect(existingItemId({ src: '/x.png', alt: '' })).toBe('existing-/x.png')
  })
})

describe('image support + filtering', () => {
  it('rejects HEIC/HEIF previews', () => {
    expect(isImageSupported(fakeFile('p.heic', 'image/heic'))).toBe(false)
    expect(isImageSupported(fakeFile('p.HEIF', 'application/octet-stream'))).toBe(
      false,
    )
    expect(isImageSupported(fakeFile('p.png', 'image/png'))).toBe(true)
  })

  it('keeps only image-typed files', () => {
    const files = [
      fakeFile('a.png', 'image/png'),
      fakeFile('b.txt', 'text/plain'),
    ]
    expect(filterImageFiles(files)).toHaveLength(1)
  })
})

describe('columnSelectOptions', () => {
  it('mirrors the allowed column set', () => {
    expect(columnSelectOptions()).toEqual(
      ALLOWED_COLUMNS.map((n) => ({ label: `${n} columns`, value: String(n) })),
    )
  })
})
