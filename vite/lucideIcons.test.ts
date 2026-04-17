import { describe, expect, it } from 'vitest'
import { lucideIcons } from './lucideIcons.js'

function getButtonIconTransform() {
  return lucideIcons().find(
    (plugin) => plugin.name === 'frappe-ui-button-lucide-icon-props',
  )
}

describe('frappe-ui button icon transform', () => {
  it('rewrites static Button icon props to direct lucide imports', async () => {
    const plugin = getButtonIconTransform()
    const input = `<template>
  <Button icon="menu" icon-left="search" iconRight="chevron-down" />
</template>
<script setup lang="ts">
const label = 'Menu'
</script>
`

    const result = await plugin.transform(input, '/tmp/ButtonIcons.vue')

    expect(result).toBeTruthy()
    expect(result.code).toContain(
      '<Button :icon="__FrappeUiLucideIcon0" :icon-left="__FrappeUiLucideIcon1" :iconRight="__FrappeUiLucideIcon2" />',
    )
    expect(result.code).toContain(
      "import __FrappeUiLucideIcon0 from '~icons/lucide/menu'",
    )
    expect(result.code).toContain(
      "import __FrappeUiLucideIcon1 from '~icons/lucide/search'",
    )
    expect(result.code).toContain(
      "import __FrappeUiLucideIcon2 from '~icons/lucide/chevron-down'",
    )
  })

  it('creates a script setup block when needed and preserves the existing script lang', async () => {
    const plugin = getButtonIconTransform()
    const input = `<template>
  <Button iconRight="chevron-down" />
</template>
<script lang="ts">
export default {}
</script>
`

    const result = await plugin.transform(input, '/tmp/ButtonIcons.vue')

    expect(result).toBeTruthy()
    expect(result.code).toContain('<script setup lang="ts">')
    expect(result.code).toContain(
      "import __FrappeUiLucideIcon0 from '~icons/lucide/chevron-down'",
    )
    expect(result.code).toContain(
      '<Button :iconRight="__FrappeUiLucideIcon0" />',
    )
  })

  it('skips dynamic bindings and unknown icon names', () => {
    const plugin = getButtonIconTransform()

    expect(
      plugin.transform(
        `<template><Button :icon="menu" /></template>`,
        '/tmp/ButtonIcons.vue',
      ),
    ).toBeNull()

    expect(
      plugin.transform(
        `<template><Button icon="not-a-real-icon" /></template>`,
        '/tmp/ButtonIcons.vue',
      ),
    ).toBeNull()
  })
})
