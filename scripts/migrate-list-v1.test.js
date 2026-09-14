import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it } from 'vitest'
import { componentAliases, migrateList } from './migrate-list-v1.js'

const SCRIPT = fileURLToPath(new URL('./migrate-list-v1.js', import.meta.url))
const PACKAGE = fileURLToPath(new URL('../package.json', import.meta.url))
const tempDirs = []

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true })
  }
})

function tempDir(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'list-v1-'))
  tempDirs.push(dir)
  for (const [name, content] of Object.entries(files)) {
    const file = path.join(dir, name)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, content)
  }
  return dir
}

function run(args, script = SCRIPT) {
  return spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' })
}

describe('row selector migration', () => {
  it('rewrites selected and active hooks only when anchored to list-row', () => {
    const source = `.a[data-slot='list-row'][data-state='selected'] {}
[data-active][data-slot=list-row] {}
[data-state='selected'] .child {}
[data-active] {}`
    const { migrated } = migrateList(source)

    expect(migrated).toContain("[data-slot='list-row'][data-selected]")
    expect(migrated).toContain("[data-state='active'][data-slot=list-row]")
    expect(migrated).toContain("[data-state='selected'] .child")
    expect(migrated).toContain('\n[data-active] {}')
  })

  it('rewrites Tailwind state utilities on ListRow tags', () => {
    const source = `<script setup>
import { ListRow } from 'frappe-ui/list'
</script>
<ListRow
  :class="active ? 'data-[active]:bg-surface-gray-3' : 'data-[state=selected]:font-bold'"
/>`
    const { migrated } = migrateList(source)

    expect(migrated).toContain('data-[state=active]:bg-surface-gray-3')
    expect(migrated).toContain('data-[selected]:font-bold')
  })

  it('leaves app-authored div hooks and reka state selectors alone', () => {
    const source = `<div :data-active="active" />
<Menu class="data-[state=selected]:font-bold" />
const row = document.querySelector('[data-active=true]')`
    expect(migrateList(source).migrated).toBe(source)
  })
})

describe('slot migration', () => {
  it('renames every static ListGroup header spelling', () => {
    const source = `<script setup>
import { ListGroup } from 'frappe-ui/list'
</script>
<ListGroup>
  <template #header>One</template>
</ListGroup>
<list-group><template v-slot:header>Two</template></list-group>
<ListGroup><template slot="header">Three</template></ListGroup>`
    const { migrated, refusals } = migrateList(source)

    expect(refusals).toEqual([])
    expect(migrated).toContain('<template #label>')
    expect(migrated).toContain('<template v-slot:label>')
    expect(migrated).toContain('<template slot="label">')
  })

  it('renames the sort slot through an import alias and ignores > in expressions', () => {
    const source = `<template>
  <SortCell :direction="count > 1 ? 'asc' : null">
    <template #suffix="{ direction }">{{ direction }}</template>
  </SortCell>
</template>
<script setup>
import { ListHeaderCellSort as SortCell } from 'frappe-ui/list'
</script>`
    const { migrated } = migrateList(source)

    expect(migrated).toContain('#sort-indicator="{ direction }"')
  })

  it('does not rename a nested component slot or a same-name local import', () => {
    const source = `<ListGroup><Other><template #header>Other</template></Other></ListGroup>
<LocalSort><template #suffix>Other</template></LocalSort>
<script setup>
import ListHeaderCellSort from './ListHeaderCellSort.vue'
const LocalSort = ListHeaderCellSort
</script>`
    const result = migrateList(source)

    expect(result.migrated).toBe(source)
    expect(componentAliases(source).has('ListHeaderCellSort')).toBe(false)
  })

  it('refuses dynamic slots and leaves the whole file unchanged in the CLI', () => {
    const source = `<script setup>
import { ListHeaderCellSort } from 'frappe-ui/list'
</script>
<ListHeaderCellSort>
  <template #[slotName]>Maybe suffix</template>
  <template #suffix>Static</template>
</ListHeaderCellSort>`
    const dir = tempDir({ 'Example.vue': source })
    const result = run([dir])

    expect(result.status).toBe(1)
    expect(result.stderr).toMatch(/Example\.vue:\d+: dynamic slot/)
    expect(result.stderr).toContain('no refused file was changed')
    expect(fs.readFileSync(path.join(dir, 'Example.vue'), 'utf8')).toBe(source)
  })

  it('ignores component names inside comments and strings', () => {
    const source = `<script setup>
import { ListGroup } from 'frappe-ui/list'
const example = "<ListGroup><template #header>x</template></ListGroup>"
</script>
<!-- <ListGroup><template #header>x</template></ListGroup> -->`
    expect(migrateList(source).migrated).toBe(source)
  })

  it('reports same-named components without a frappe-ui/list import', () => {
    const source = `<script setup>
import ListGroup from './ListGroup.vue'
</script>
<ListGroup><template #header>Local</template></ListGroup>
<ListHeaderCellSort><template #suffix>Local</template></ListHeaderCellSort>`

    const result = migrateList(source)

    expect(result.migrated).toBe(source)
    expect(result.refusals.map(({ message }) => message)).toEqual([
      '<ListGroup> #header found but no frappe-ui/list import; check by hand',
      '<ListHeaderCellSort> #suffix found but no frappe-ui/list import; check by hand',
    ])
  })

  it('renames a conditional static slot', () => {
    const source = `<script setup>
import { ListGroup } from 'frappe-ui/list'
</script>
<ListGroup><template v-if="visible" #header>Title</template></ListGroup>`

    expect(migrateList(source).migrated).toContain(
      '<template v-if="visible" #label>',
    )
  })

  it('keeps component ancestry across prose comparisons and HTML void tags', () => {
    const source = `<script setup>
import { ListGroup } from 'frappe-ui/list'
</script>
a < b and c > d
<ListGroup><img src="group.svg"><template #header>Title</template></ListGroup>`

    expect(migrateList(source).migrated).toContain('<template #label>')
  })
})

describe('CLI', () => {
  it('is idempotent after a successful migration', () => {
    const source = `<script setup>import { ListGroup } from 'frappe-ui/list'</script>
<ListGroup><template #header>Title</template></ListGroup>`
    const once = migrateList(source).migrated
    expect(migrateList(once).migrated).toBe(once)
  })

  it('supports dry-run without writing', () => {
    const source = `<script setup>import { ListGroup } from 'frappe-ui/list'</script>
<ListGroup><template #header>Title</template></ListGroup>`
    const dir = tempDir({ 'Example.vue': source })
    const result = run(['--dry-run', dir])

    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Would migrate 1 file.')
    expect(fs.readFileSync(path.join(dir, 'Example.vue'), 'utf8')).toBe(source)
  })

  it('walks supported files, skips dependencies and symlinks', () => {
    const dir = tempDir({
      'src/Example.vue': `<ListGroup><template #header>Title</template></ListGroup>`,
      'node_modules/Skipped.vue': `<ListGroup><template #header>Old</template></ListGroup>`,
      'docs/migration.md': `<script setup>import { ListGroup } from 'frappe-ui/list'</script>\n<ListGroup><template #header>Before</template></ListGroup>`,
      'notes.txt': `<ListGroup><template #header>Old</template></ListGroup>`,
    })
    fs.symlinkSync(path.join(dir, 'src'), path.join(dir, 'linked'))
    fs.writeFileSync(
      path.join(dir, 'src/Example.vue'),
      `<script setup>import { ListGroup } from 'frappe-ui/list'</script>\n<ListGroup><template #header>Title</template></ListGroup>`,
    )
    const result = run([dir])

    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Migrated 1 file.')
    expect(
      fs.readFileSync(path.join(dir, 'src/Example.vue'), 'utf8'),
    ).toContain('#label')
    expect(
      fs.readFileSync(path.join(dir, 'node_modules/Skipped.vue'), 'utf8'),
    ).toContain('#header')
    expect(
      fs.readFileSync(path.join(dir, 'docs/migration.md'), 'utf8'),
    ).toContain('#header')
    expect(fs.readFileSync(path.join(dir, 'notes.txt'), 'utf8')).toContain(
      '#header',
    )
  })

  it('runs through an installed-bin symlink and reports bad targets', () => {
    const dir = tempDir({
      'Example.vue': `<script setup>import { ListGroup } from 'frappe-ui/list'</script>\n<ListGroup><template #header>Title</template></ListGroup>`,
    })
    const bin = path.join(dir, 'list-v1')
    fs.symlinkSync(SCRIPT, bin)

    expect(run([dir], bin).status).toBe(0)
    const missing = run([path.join(dir, 'missing')])
    expect(missing.status).toBe(1)
    expect(missing.stderr).toContain('missing: not found')

    const unknown = run(['--force', dir])
    expect(unknown.status).toBe(1)
    expect(unknown.stderr).toContain('Unknown option: --force')
  })

  it('ships the executable in the package bin and files lists', () => {
    const pkg = JSON.parse(fs.readFileSync(PACKAGE, 'utf8'))

    expect(pkg.bin['list-v1']).toBe('./scripts/migrate-list-v1.js')
    expect(pkg.files).toContain('scripts/migrate-list-v1.js')
    expect(fs.statSync(SCRIPT).mode & 0o111).not.toBe(0)
  })
})
