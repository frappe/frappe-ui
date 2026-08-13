<script setup lang="ts">
import { ref } from 'vue'
import { Button } from 'frappe-ui'
import {
  CommandPalette,
  CommandPaletteEmpty,
  CommandPaletteGroup,
  CommandPaletteInput,
  CommandPaletteList,
  CommandPaletteItem,
} from '..'
import type { CommandPaletteSelectEvent, CommandPaletteValue } from '..'

// `as="a"` plus `href` makes the row a real link, so middle-click,
// Cmd-click and "open in a new tab" all work the way the browser does
// them. Nothing here re-implements that.
const docs = [
  { link: '/docs/components/button', text: 'Button' },
  { link: '/docs/components/dialog', text: 'Dialog' },
  { link: '/docs/components/combobox', text: 'Combobox' },
]

const open = ref(false)
const visited = ref('')

function select(value: CommandPaletteValue, event: CommandPaletteSelectEvent) {
  const item = value as { link: string }
  const click = event.detail.originalEvent
  // Let the browser take modifier-clicks through the `href`.
  if (click.metaKey || click.ctrlKey || click.shiftKey || click.button === 1) {
    return
  }
  click.preventDefault()
  visited.value = item.link
}
</script>

<template>
  <div class="flex flex-col items-start gap-3">
    <Button @click="open = true">Search the docs</Button>
    <p v-if="visited" class="text-p-sm text-ink-gray-6">
      Would navigate to {{ visited }}
    </p>

    <CommandPalette v-model:open="open" @select="select">
      <CommandPaletteInput placeholder="Search documentation" />

      <CommandPaletteList>
        <CommandPaletteGroup label="Components">
          <CommandPaletteItem
            v-for="page in docs"
            :key="page.link"
            as="a"
            :href="page.link"
            :value="page"
          >
            {{ page.text }}
          </CommandPaletteItem>
        </CommandPaletteGroup>
      </CommandPaletteList>

      <CommandPaletteEmpty />
    </CommandPalette>
  </div>
</template>
