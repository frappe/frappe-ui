<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button } from 'frappe-ui'

interface ComponentPreviewProps {
  name: string
}

const props = defineProps<ComponentPreviewProps>()

const expanded = ref(false)

// The editor renders its own `prose prose-v3` content, but Tailwind Typography's
// `.not-prose` (used here to shield demos from the docs article's prose) also
// suppresses prose *inside* it — and you can't re-enable it deeper in the tree.
// So editor demos opt their preview out of `.not-prose`; every other demo keeps
// the isolation unchanged.
const isEditorDemo = computed(() => props.name?.startsWith('Editor'))
</script>

<template>
  <div>
    <div
      class="rounded-xl overflow-hidden border border-outline-gray-1 divide-y divide-outline-gray-1"
    >
      <div
        :class="[
          isEditorDemo ? '' : 'not-prose',
          'bg-surface-base p-4 sm:p-8 overflow-x-auto scrollbar flex flex-wrap gap-3 items-center justify-center min-h-[200px]',
        ]"
      >
        <slot />
      </div>

      <div class="component-preview-code not-prose relative">
        <div
          :class="[
            expanded
              ? ''
              : 'max-h-[80px] sm:max-h-[96px] overflow-hidden [&_.shiki]:!max-h-none [&_.shiki]:!overflow-hidden [&_.copy]:hidden',
          ]"
        >
          <slot name="code" />
        </div>

        <div
          v-if="!expanded"
          class="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface-gray-1 via-surface-gray-1/70 dark:from-surface-base dark:via-surface-base/70 to-transparent"
        />

        <div
          v-if="!expanded"
          class="absolute inset-0 flex items-center justify-center"
        >
          <Button variant="outline" @click="expanded = true">View Code</Button>
        </div>
      </div>
    </div>
  </div>
</template>
