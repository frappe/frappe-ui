import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DocTypeInterfaceGenerator } from './doctypeInterfaceGenerator.js'

let root: string

beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {})
  root = realpathSync(mkdtempSync(join(tmpdir(), 'frappeui-doctype-types-')))
})

afterEach(() => {
  vi.restoreAllMocks()
  rmSync(root, { recursive: true, force: true })
})

function writeDoctype(relativePath: string, schema: object) {
  const file = join(root, 'apps', relativePath)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, JSON.stringify(schema))
}

describe('DocTypeInterfaceGenerator', () => {
  it('generates interfaces from app doctypes and ignores node_modules', async () => {
    writeDoctype('gameplan/gameplan/gameplan/doctype/gp_task/gp_task.json', {
      name: 'GP Task',
      modified: '2026-01-01 00:00:00',
      fields: [
        { fieldname: 'title', fieldtype: 'Data', label: 'Title', reqd: 1 },
        {
          fieldname: 'checklist',
          fieldtype: 'Table',
          label: 'Checklist',
          options: 'GP Checklist Item',
        },
      ],
    })
    writeDoctype(
      'gameplan/gameplan/gameplan/doctype/gp_checklist_item/gp_checklist_item.json',
      {
        name: 'GP Checklist Item',
        modified: '2026-01-01 00:00:00',
        istable: 1,
        fields: [{ fieldname: 'done', fieldtype: 'Check', label: 'Done' }],
      },
    )
    // Doctypes inside node_modules are not the app's own and are skipped.
    writeDoctype(
      'gameplan/frontend/node_modules/pkg/doctype/gp_vendored/gp_vendored.json',
      { name: 'GP Vendored', modified: 'x', fields: [] },
    )

    const output = join(root, 'apps', 'gameplan', 'frontend', 'doctypes.ts')
    const generator = new DocTypeInterfaceGenerator(
      join(root, 'apps'),
      { gameplan: ['gp_task', 'gp_vendored'] },
      output,
    )
    await generator.generate()

    const types = readFileSync(output, 'utf8')
    expect(types).toContain('export interface GPTask extends DocType {')
    expect(types).toContain('title: string;')
    expect(types).toContain('checklist: GPChecklistItem[];')
    expect(types).toContain(
      'export interface GPChecklistItem extends ChildDocType {',
    )
    expect(types).not.toContain('GPVendored')
    expect(generator.summary.notFound).toBe(1)
  })
})
