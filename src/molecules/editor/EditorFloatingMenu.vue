<script setup lang="ts">
import { computed } from 'vue'
import { FloatingMenu } from '@tiptap/vue-3/menus'
import MenuItems from './MenuItems.vue'
import type { MenuItem } from './menu'
import type { Editor } from './useEditor'

type FloatingOptions = NonNullable<InstanceType<typeof FloatingMenu>['$props']['options']>

const props = defineProps<{
  editor: Editor | null
  items: MenuItem[]
  options?: FloatingOptions & {
    shouldShow?: (props: any) => boolean
  }
}>()

const shouldShow = computed(() => props.options?.shouldShow)
const floatingOptions = computed(() => {
  const options = { ...(props.options ?? {}) } as FloatingOptions & {
    shouldShow?: unknown
  }
  delete options.shouldShow
  return options
})
</script>

<template>
  <FloatingMenu
    v-if="editor"
    :editor="editor"
    :should-show="shouldShow"
    :options="floatingOptions"
  >
    <div
      data-slot="floating-menu"
      class="flex items-center gap-1 rounded border bg-white p-1 shadow-sm"
    >
      <MenuItems :editor="editor" :items="items" />
    </div>
  </FloatingMenu>
</template>
