<script setup lang="ts">
import { Badge, Button } from 'frappe-ui'
import { ref } from 'vue'
import LucideCode from '~icons/lucide/code-xml'

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
  <div class="my-5 flex items-center justify-between gap-3">
    <h2 id="props" class="my-auto">Props</h2>

    <Button size="sm" @click="tsToggled = !tsToggled">
      <template #prefix>
        <LucideCode class="size-4" />
      </template>

      TS
    </Button>
  </div>

  <slot v-if="!tsToggled" name="code" />

  <table class="scrollbar not-prose w-full overflow-auto">
    <colgroup>
      <col class="w-[20%]" />
      <col class="w-[20%]" />
      <col class="w-[60%]" />
    </colgroup>

    <tbody class="[&_td]:p-2 [&_td]:px-3 [&_td]:align-top [&_th]:p-2 [&_th]:px-3">
      <tr class="text-left text-ink-gray-6 *:bg-surface-gray-2 *:font-semibold">
        <th class="rounded-l">Name</th>
        <th>Default</th>
        <th class="rounded-r">Type</th>
      </tr>

      <tr v-for="x in data" :key="x.name" class="border-b last:border-0">
        <td>
          <Badge class="mb-auto flex w-fit !rounded-sm font-mono">
            {{ x.name + (x.required ? '*' : '') }}
          </Badge>
        </td>

        <td class="font-mono text-sm">
          <div
            v-if="x.default?.includes('{')"
            class="h-full w-fit whitespace-pre rounded-sm !bg-surface-gray-1 px-3 py-2 leading-relaxed"
          >
            {{ x.default }}
          </div>

          <template v-else>{{ x.default || '-' }}</template>
        </td>

        <td class="flex h-fit flex-wrap gap-2">
          <span class="font-mono text-sm font-semibold">
            {{ x.type }}
          </span>

          <p class="w-full text-sm leading-relaxed text-ink-gray-5">
            {{ x.description }}
          </p>
        </td>
      </tr>
    </tbody>
  </table>
</template>
