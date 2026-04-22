<script setup lang="ts">
import { computed, useSlots } from 'vue'

interface ItemProp {
  name: string
  description: string
  type: string
  required: boolean
  default: string
}

interface Props {
  name?: string
  data: ItemProp[]
}

const props = defineProps<Props>()
const slots = useSlots()

const hasCustomCodeSlot = computed(() => Boolean(slots.code))

const typeDefinition = computed(() => {
  const typeName = props.name ? `${props.name}Props` : 'ComponentProps'
  const lines = [`interface ${typeName} {`]

  for (const item of props.data) {
    const key = /^[A-Za-z_$][\w$]*$/.test(item.name)
      ? item.name
      : JSON.stringify(item.name)
    const optional = item.required ? '' : '?'
    const type = item.type || 'unknown'

    lines.push(`  ${key}${optional}: ${type}`)
  }

  lines.push('}')
  return lines.join('\n')
})
</script>

<template>
  <div class="not-prose mt-2">
    <details class="group border-outline-gray-2 pb-3">
      <summary
        class="flex rounded cursor-pointer list-none items-center gap-2 py-2 text-sm font-medium text-ink-gray-6 transition-colors hover:text-ink-gray-9"
      >
        <LucideChevronRight
          class="size-4 shrink-0 transition-transform group-open:rotate-90"
        />
        Show types
      </summary>

      <div
        class="mt-1 overflow-hidden rounded-lg border border-outline-gray-2 bg-surface-gray-1"
      >
        <slot v-if="hasCustomCodeSlot" name="code" />
        <pre
          v-else
          class="overflow-x-auto whitespace-pre px-4 py-3 font-mono text-xs leading-6 text-ink-gray-7"
        ><code>{{ typeDefinition }}</code></pre>
      </div>
    </details>

    <div class="overflow-x-auto whitespace-nowrap">
      <table
        class="scrollbar w-full min-w-[720px] border-collapse border-b border-outline-gray-2 text-left"
      >
        <thead>
          <tr class="border-b border-outline-gray-2">
            <th
              class="w-[24%] py-2.5 pr-2 text-sm font-semibold text-ink-gray-9"
            >
              Prop
            </th>
            <th
              class="w-[20%] px-2 py-2.5 text-sm font-semibold text-ink-gray-9"
            >
              Default
            </th>
            <th
              class="w-[56%] px-2 py-2.5 text-sm font-semibold text-ink-gray-9"
            >
              Type
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
                {{ x.name
                }}<span v-if="x.required" class="text-ink-gray-5">*</span>
              </div>
            </td>

            <td class="px-2 py-2 align-top">
              <div
                v-if="x.default?.includes('{')"
                class="whitespace-pre-wrap break-words font-mono text-xs leading-6 text-ink-gray-6"
              >
                {{ x.default }}
              </div>
              <div v-else class="font-mono text-xs leading-6 text-ink-gray-6">
                {{ x.default || '—' }}
              </div>
            </td>

            <td class="px-2 py-2 align-top">
              <div
                class="whitespace-normal break-words font-mono text-xs leading-6 text-ink-gray-8"
              >
                {{ x.type || '—' }}
              </div>
              <p
                v-if="x.description"
                class="mt-1 whitespace-pre-wrap text-p-sm leading-6 text-ink-gray-6"
              >
                {{ x.description }}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
