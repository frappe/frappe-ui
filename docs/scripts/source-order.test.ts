import fs from 'fs'
import os from 'os'
import path from 'path'

import ts from 'typescript'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { createSourceOrder, type SourceDeclaration } from './source-order'

/**
 * The fixtures are written to disk and compiled, because that is what the
 * generator does: it reads declaration offsets against the file on disk and
 * resolves the types through a real program.
 */

const PROPS = `
export declare const SIDE_OPTIONS: readonly ['top', 'right', 'bottom', 'left']
export type Side = (typeof SIDE_OPTIONS)[number]

export const SIZES = ['sm', 'md', 'lg'] as const
export type Size = (typeof SIZES)[number]

export type Status = 'success' | 'error' | 'warning'

export interface Label {
  toString(): string
}

export interface Props {
  side?: Side
  size?: Size
  status?: Status
  label?: Label | string | number
  variant?: 'solid' | 'subtle' | 'outline'
  flag?: boolean
}

export interface Reused {
  side?: Props['side']
}
`

const RUNTIME = `
import type { PropType } from './shims'

export type Theme = 'gray' | 'blue' | 'green'

export const buttonProps = {
  theme: { type: String as PropType<Theme>, default: 'gray' },
  type: {
    type: String as PropType<'button' | 'submit' | 'reset'>,
    default: 'button',
  },
}
`

const SHIMS = `export type PropType<T> = { __t: T }`

const INHERITED = `
export interface Labeling {
  label?: string
  description?: string
}
`

let dir: string
let sourceOrder: ReturnType<typeof createSourceOrder>
let program: ts.Program

function entryFor(file: string, declaration: string) {
  const text = fs.readFileSync(path.join(dir, file), 'utf8')
  const start = text.indexOf(declaration)
  if (start === -1) throw new Error(`fixture has no \`${declaration}\``)
  const range: [number, number] = [start, start + declaration.length]
  return { getDeclarations: () => [{ file: path.join(dir, file), range }] }
}

function missingEntry() {
  return { getDeclarations: (): SourceDeclaration[] => [] }
}

beforeAll(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'source-order-'))
  fs.writeFileSync(path.join(dir, 'props.ts'), PROPS)
  fs.writeFileSync(path.join(dir, 'runtime.ts'), RUNTIME)
  fs.writeFileSync(path.join(dir, 'shims.ts'), SHIMS)
  fs.writeFileSync(path.join(dir, 'inherited.ts'), INHERITED)

  program = ts.createProgram(
    ['props.ts', 'runtime.ts', 'shims.ts', 'inherited.ts'].map((file) =>
      path.join(dir, file),
    ),
    { strict: true, target: ts.ScriptTarget.ESNext, noEmit: true },
  )
  sourceOrder = createSourceOrder(program)
})

afterAll(() => {
  fs.rmSync(dir, { recursive: true, force: true })
})

describe('orderUnion', () => {
  it('reorders an inline union to the order it is declared in', () => {
    const entry = entryFor(
      'props.ts',
      `variant?: 'solid' | 'subtle' | 'outline'`,
    )
    expect(
      sourceOrder.orderUnion('"subtle" | "outline" | "solid"', entry),
    ).toBe('"solid" | "subtle" | "outline"')
  })

  it('follows a type alias', () => {
    const entry = entryFor('props.ts', 'status?: Status')
    expect(
      sourceOrder.orderUnion('"error" | "warning" | "success"', entry),
    ).toBe('"success" | "error" | "warning"')
  })

  it('follows an index into a declared tuple', () => {
    const entry = entryFor('props.ts', 'side?: Side')
    expect(
      sourceOrder.orderUnion('"left" | "right" | "bottom" | "top"', entry),
    ).toBe('"top" | "right" | "bottom" | "left"')
  })

  it('follows an index into a `const` array', () => {
    const entry = entryFor('props.ts', 'size?: Size')
    expect(sourceOrder.orderUnion('"md" | "sm" | "lg"', entry)).toBe(
      '"sm" | "md" | "lg"',
    )
  })

  it('follows an indexed access to another interface', () => {
    const entry = entryFor('props.ts', `side?: Props['side']`)
    expect(
      sourceOrder.orderUnion('"left" | "right" | "bottom" | "top"', entry),
    ).toBe('"top" | "right" | "bottom" | "left"')
  })

  it('reads a runtime prop through its `PropType` cast', () => {
    const entry = entryFor(
      'runtime.ts',
      `type: {\n    type: String as PropType<'button' | 'submit' | 'reset'>,\n    default: 'button',\n  }`,
    )
    expect(sourceOrder.orderUnion('"submit" | "reset" | "button"', entry)).toBe(
      '"button" | "submit" | "reset"',
    )
  })

  it('reorders what is printed when the declaration lists more', () => {
    const entry = entryFor('props.ts', 'status?: Status')
    expect(sourceOrder.orderUnion('"warning" | "success"', entry)).toBe(
      '"success" | "warning"',
    )
  })

  it('keeps the printed order when a member is not declared', () => {
    const entry = entryFor('props.ts', 'status?: Status')
    expect(sourceOrder.orderUnion('"error" | "success" | "info"', entry)).toBe(
      '"error" | "success" | "info"',
    )
  })

  it('keeps the printed order when the declaration is not a union', () => {
    const entry = entryFor('props.ts', 'flag?: boolean')
    expect(sourceOrder.orderUnion('true | false', entry)).toBe('true | false')
  })

  it('keeps the printed order when there is no declaration', () => {
    expect(sourceOrder.orderUnion('"b" | "a"', missingEntry())).toBe(
      '"b" | "a"',
    )
  })

  it('leaves a type that is not a union alone', () => {
    const entry = entryFor('props.ts', 'status?: Status')
    expect(sourceOrder.orderUnion('Status', entry)).toBe('Status')
  })
})

describe('sortByDeclaration', () => {
  it('orders entries by where they are declared', () => {
    const entries = [
      {
        name: 'label',
        ...entryFor('props.ts', 'label?: Label | string | number'),
      },
      { name: 'side', ...entryFor('props.ts', 'side?: Side') },
      { name: 'size', ...entryFor('props.ts', 'size?: Size') },
    ]
    expect(sourceOrder.sortByDeclaration(entries).map((e) => e.name)).toEqual([
      'side',
      'size',
      'label',
    ])
  })

  it('keeps a file together, in the order it first appears', () => {
    const entries = [
      { name: 'side', ...entryFor('props.ts', 'side?: Side') },
      {
        name: 'description',
        ...entryFor('inherited.ts', 'description?: string'),
      },
      { name: 'label', ...entryFor('inherited.ts', 'label?: string') },
      { name: 'size', ...entryFor('props.ts', 'size?: Size') },
    ]
    expect(sourceOrder.sortByDeclaration(entries).map((e) => e.name)).toEqual([
      'side',
      'size',
      'label',
      'description',
    ])
  })

  it('leaves the list alone when an entry has no declaration', () => {
    const entries = [
      { name: 'size', ...entryFor('props.ts', 'size?: Size') },
      { name: 'unknown', ...missingEntry() },
      { name: 'side', ...entryFor('props.ts', 'side?: Side') },
    ]
    expect(sourceOrder.sortByDeclaration(entries).map((e) => e.name)).toEqual([
      'size',
      'unknown',
      'side',
    ])
  })
})
