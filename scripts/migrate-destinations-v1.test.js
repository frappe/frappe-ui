import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it } from 'vitest'
import { migrateDestinations } from './migrate-destinations-v1.js'

const SCRIPT = fileURLToPath(
  new URL('./migrate-destinations-v1.js', import.meta.url),
)
const tempDirs = []

afterEach(() => {
  for (const dir of tempDirs.splice(0))
    fs.rmSync(dir, { recursive: true, force: true })
})

function tempFile(source) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'destinations-v1-'))
  tempDirs.push(dir)
  const file = path.join(dir, 'Example.vue')
  fs.writeFileSync(file, source)
  return file
}

describe('destination vocabulary migration', () => {
  it('renames only destination props on the affected components', () => {
    const source = `<script setup>
import { Button, PageHeaderBackButton, ListRow, SidebarItem, SidebarRailItem, MobileNavItem } from 'frappe-ui'
</script>
<template>
  <Button link="https://frappe.io" />
  <PageHeaderBackButton :to="home" />
  <ListRow :to="item.route" />
  <SidebarItem to="/inbox" />
  <SidebarRailItem :to="searchRoute" />
  <MobileNavItem to="/home" />
  <RouterLink :to="home" />
  <Teleport to="body" />
</template>`

    expect(migrateDestinations(source)).toBe(`<script setup>
import { Button, PageHeaderBackButton, ListRow, SidebarItem, SidebarRailItem, MobileNavItem } from 'frappe-ui'
</script>
<template>
  <Button href="https://frappe.io" />
  <PageHeaderBackButton :fallback-route="home" />
  <ListRow :route="item.route" />
  <SidebarItem route="/inbox" />
  <SidebarRailItem :route="searchRoute" />
  <MobileNavItem route="/home" />
  <RouterLink :to="home" />
  <Teleport to="body" />
</template>`)
  })

  it('recognises imported aliases without touching locally imported components', () => {
    const source = `<script setup>
import { SidebarItem as FrappeSidebarItem } from 'frappe-ui'
import LocalButton from './LocalButton.vue'
import Button from './Button.vue'
</script>
<template>
  <FrappeSidebarItem :to="item.to" />
  <LocalButton link="/leave-alone" />
  <Button link="/also-leave-alone" />
</template>`

    expect(migrateDestinations(source)).toContain(
      '<FrappeSidebarItem :route="item.to" />',
    )
    expect(migrateDestinations(source)).toContain(
      '<LocalButton link="/leave-alone" />',
    )
    expect(migrateDestinations(source)).toContain(
      '<Button link="/also-leave-alone" />',
    )
  })

  it('supports kebab-case component tags and attribute spellings', () => {
    const source = `<script setup>
import { PageHeaderBackButton, SidebarItem } from 'frappe-ui'
</script>
<template>
<page-header-back-button fallback-to="/old" to="/home" />
<sidebar-item :to="route" />`
    const migrated = migrateDestinations(source)

    expect(migrated).toContain('fallback-to="/old" fallback-route="/home"')
    expect(migrated).toContain('<sidebar-item :route="route" />')
  })

  it('handles shorthand and longhand bindings without crossing quoted > characters', () => {
    const source = `<script setup>
import { Button, ListRow, SidebarItem } from 'frappe-ui'
</script>
<template>
  <SidebarItem label="Go to home" :to title="1 > 0" />
  <ListRow v-bind:to />
  <Button label="Copy link to page" :link.prop="url" />
</template>
<script>const sample = '<Button link="leave-alone" />'</script>`
    const migrated = migrateDestinations(source)

    expect(migrated).toContain(
      '<SidebarItem label="Go to home" :route="to" title="1 > 0" />',
    )
    expect(migrated).toContain('<ListRow v-bind:route="to" />')
    expect(migrated).toContain(
      '<Button label="Copy link to page" :href.prop="url" />',
    )
    expect(migrated).toContain(`const sample = '<Button link="leave-alone" />'`)
  })

  it('leaves same-named components alone without a frappe-ui import', () => {
    const source = `<script setup>
import Button from './Button.vue'
</script>
<template><Button link="/custom" /><SidebarItem :to="target" /></template>`

    expect(migrateDestinations(source)).toBe(source)
  })

  it('reports dry runs without writing the file', () => {
    const file = tempFile(
      `<script setup>import { Button } from 'frappe-ui'</script>
<template><Button link="https://frappe.io" /></template>`,
    )
    const result = spawnSync(process.execPath, [SCRIPT, '--dry-run', file], {
      encoding: 'utf8',
    })

    expect(result.status).toBe(0)
    expect(result.stdout).toContain('Would migrate 1 file')
    expect(fs.readFileSync(file, 'utf8')).toContain(' link=')
  })

  it('runs through an installed-bin symlink and rejects unknown options', () => {
    const file = tempFile(
      `<script setup>import { Button } from 'frappe-ui'</script>
<template><Button link="https://frappe.io" /></template>`,
    )
    const bin = path.join(path.dirname(file), 'destinations-v1')
    fs.symlinkSync(SCRIPT, bin)

    const migrated = spawnSync(process.execPath, [bin, file], {
      encoding: 'utf8',
    })
    expect(migrated.status).toBe(0)
    expect(fs.readFileSync(file, 'utf8')).toContain(' href=')

    const refused = spawnSync(process.execPath, [bin, '--force', file], {
      encoding: 'utf8',
    })
    expect(refused.status).toBe(1)
    expect(refused.stderr).toContain('Unknown option: --force')
  })

  it('does not follow directory symlinks', () => {
    const file = tempFile(
      `<script setup>import { Button } from 'frappe-ui'</script>
<template><Button link="https://frappe.io" /></template>`,
    )
    const dir = path.dirname(file)
    fs.symlinkSync(dir, path.join(dir, 'loop'))

    const result = spawnSync(process.execPath, [SCRIPT, '--dry-run', dir], {
      encoding: 'utf8',
    })
    expect(result.status).toBe(0)
    expect(result.stdout.match(/Would migrate .*Example\.vue/g)).toHaveLength(1)
  })
})
