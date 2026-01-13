<script setup lang="ts">
import { ref } from 'vue'
import { Badge, Button } from 'frappe-ui'
import LucideCode from '~icons/lucide/code-xml'
// import TSCodeBlock from './TSCodeBlock.vue'

interface itemProp {
  name: string
  description: string
  type: string
  required: string
  default: string
}

interface Props {
  data: itemProp[]
}

const tsToggled = ref(true)

defineProps<Props>()
</script>

<template>
  <div class="flex items-center gap-3 justify-between mt-5" :class='{"-mb-5": !tsToggled}'>
    <h2 id='props'>Props</h2>

    <Button size="sm" @click="tsToggled = !tsToggled">
      <template #prefix>
        <LucideCode class="size-4" />
      </template>

      TS
    </Button>
  </div>

  <slot v-if="!tsToggled" name="code" />

  <table class="overflow-auto scrollbar not-prose w-full">
    <colgroup>
      <col class="w-[20%]" />
      <col class="w-[20%]" />
      <col class="w-[60%]" />
    </colgroup>

    <tbody
      class="[&_td]:px-3 [&_th]:px-3 [&_td]:p-2 [&_th]:p-2 [&_td]:align-top"
    >
      <tr class="text-left *:bg-surface-gray-2 text-ink-gray-6 *:font-semibold">
        <th class="rounded-l">Name</th>
        <th>Default</th>
        <th class="rounded-r">Type</th>
      </tr>

      <tr v-for="x in data" :key="x.name" class="border-b last:border-0">
        <td>
          <Badge
            :theme="x.required ? 'red' : 'gray'"
            class="w-fit !rounded-sm mb-auto flex font-mono"
          >
            {{ x.name }}
          </Badge>
        </td>

        <td>
          <div
            v-if="x.default?.includes('{')"
            class="w-fit rounded-sm whitespace-pre px-3 py-2 leading-relaxed h-full !bg-surface-gray-1"
          >
            {{ x.default }}
          </div>

          <template v-else>{{ x.default || '-' }}</template>
        </td>

        <td class="flex flex-wrap h-fit gap-2">
          <span class="text-sm font-semibold">
            {{ x.type }}
          </span>

          <p class="text-sm text-ink-gray-5 leading-relaxed w-full">
            {{ x.description }}
          </p>
        </td>
      </tr>
    </tbody>
  </table>
</template>
