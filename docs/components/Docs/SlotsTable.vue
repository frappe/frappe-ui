<script setup lang="ts">
interface ItemProp {
  name: string
  description: string
  type: string
  deprecated?: string | boolean
}

interface Props {
  data: ItemProp[]
}

defineProps<Props>()
</script>

<template>
  <div class="not-prose mt-8 overflow-x-auto whitespace-nowrap">
    <table
      class="scrollbar w-full min-w-[640px] border-collapse border-b border-outline-gray-2 text-left"
    >
      <thead>
        <tr class="border-b border-outline-gray-2">
          <th class="w-[24%] py-2.5 pr-2 text-sm font-semibold text-ink-gray-9">
            Slot
          </th>
          <th class="w-[76%] px-2 py-2.5 text-sm font-semibold text-ink-gray-9">
            Payload
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="x in data"
          :key="x.name"
          class="border-b border-outline-gray-2 last:border-b-0"
        >
          <td class="py-2 pr-2 align-top">
            <div
              class="font-mono text-xs font-medium leading-6 text-ink-gray-9"
            >
              <span :class="{ 'line-through opacity-70': x.deprecated }">
                {{ x.name }}
              </span>
              <span
                v-if="x.deprecated"
                class="ml-1 rounded bg-surface-amber-1 px-1 py-0.5 font-sans text-[10px] font-medium text-ink-amber-3"
                >deprecated</span
              >
            </div>
          </td>

          <td class="px-2 py-2 align-top">
            <div
              class="whitespace-normal break-words font-mono text-xs leading-6 text-ink-gray-8"
            >
              {{ x.type === 'any' ? '—' : x.type || '—' }}
            </div>
            <p
              v-if="x.description"
              class="mt-1 whitespace-pre-wrap font-mono text-xs leading-6 text-ink-gray-6"
            >
              {{ x.description }}
            </p>
            <p
              v-if="typeof x.deprecated === 'string'"
              class="mt-1 whitespace-pre-wrap font-mono text-xs leading-6 text-ink-amber-3"
            >
              Deprecated — {{ x.deprecated }}
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
