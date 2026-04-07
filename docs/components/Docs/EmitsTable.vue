<script setup lang="ts">
import { Badge } from 'frappe-ui'

interface itemProp {
  name: string
  description: string
  type: string
}

interface Props {
  data: itemProp[]
}

defineProps<Props>()
</script>

<template>
  <table class="scrollbar not-prose w-full overflow-auto">
    <colgroup>
      <col class="w-[50%]" />
      <col class="w-[50%]" />
    </colgroup>

    <tbody class="[&_td]:p-2 [&_td]:px-3 [&_td]:align-top [&_th]:p-2 [&_th]:px-3">
      <tr class="text-left text-ink-gray-6 *:bg-surface-gray-2 *:font-semibold">
        <th class="rounded-l">Event</th>
        <th class="rounded-r">Payload</th>
      </tr>

      <tr v-for="x in data" :key="x.name" class="border-b last:border-0">
        <td>
          <Badge class="w-fit !rounded-sm font-mono">
            {{ x.name }}
          </Badge>
        </td>

        <td class="flex h-fit flex-wrap gap-2">
          <span class="text-sm font-semibold">
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
