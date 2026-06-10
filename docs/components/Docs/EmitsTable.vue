<script setup lang="ts">
import { reactive } from 'vue'
import { formatTypeStr, isLongType } from './typeFormatter'

interface ItemProp {
  name: string
  description?: string
  type?: string
  deprecated?: string | boolean
}

interface Props {
  data: ItemProp[]
}

defineProps<Props>()

const expanded = reactive<Record<string, boolean>>({})

const typeClass =
  'whitespace-pre-wrap break-words font-mono text-xs leading-6 text-ink-gray-8'
const expandBtnClass =
  'flex items-center gap-1 text-xs text-ink-gray-5 hover:text-ink-gray-7 transition-colors'

function displayType(type: string | undefined): string {
  return type ? formatTypeStr(type) : ''
}

function isLongRow(x: ItemProp): boolean {
  const typeLong = !x.deprecated && isLongType(x.type)
  const descLong =
    typeof x.deprecated !== 'string' && (x.description?.length ?? 0) > 150
  return typeLong || descLong
}

function toggle(key: string) {
  expanded[key] = !expanded[key]
}

function clampClass(x: ItemProp, key: string) {
  return isLongRow(x) && !expanded[key] ? 'line-clamp-5' : ''
}

function chevronClass(key: string) {
  return ['size-3 transition-transform', { 'rotate-180': expanded[key] }]
}
</script>

<template>
  <div class="not-prose mt-8">
    <table class="hidden sm:table w-full border-collapse border-b text-left">
      <thead>
        <tr class="border-b">
          <th class="w-[24%] py-2.5 pr-2 text-sm font-semibold text-ink-gray-9">
            Event
          </th>
          <th class="w-[76%] px-2 py-2.5 text-sm font-semibold text-ink-gray-9">
            Payload
          </th>
        </tr>
      </thead>

      <tbody>
        <template v-for="(x, idx) in data" :key="x.name">
          <tr
            :class="{ 'border-b': !isLongRow(x) && idx < data.length - 1 }"
            @click="isLongRow(x) && toggle(x.name)"
          >
            <td class="py-2 pr-2 align-top">
              <div
                class="font-mono text-xs font-medium leading-6 text-ink-gray-9 break-words"
              >
                <span :class="{ 'line-through': x.deprecated }">{{
                  x.name
                }}</span>
              </div>
              <p
                v-if="typeof x.deprecated === 'string'"
                class="mt-0.5 text-xs leading-5 text-ink-gray-5"
              >
                Deprecated — {{ x.deprecated }}
              </p>
              <p
                v-else-if="x.description"
                :class="[
                  'mt-0.5 text-xs leading-5 text-ink-gray-5',
                  clampClass(x, x.name),
                ]"
              >
                {{ x.description }}
              </p>
            </td>

            <td class="px-2 py-2 align-top">
              <pre
                v-if="!x.deprecated"
                :class="[typeClass, clampClass(x, x.name)]"
                >{{ displayType(x.type) || '—' }}</pre
              >
            </td>
          </tr>

          <tr
            v-if="isLongRow(x)"
            :class="{ 'border-b': idx < data.length - 1 }"
          >
            <td colspan="2" class="py-2">
              <button
                :class="expandBtnClass"
                :aria-expanded="expanded[x.name]"
                @click="toggle(x.name)"
              >
                <LucideChevronDown :class="chevronClass(x.name)" />
                {{ expanded[x.name] ? 'Show less' : 'Show more' }}
              </button>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <div class="sm:hidden">
      <div
        v-for="x in data"
        :key="x.name"
        class="border-b last:border-b-0 py-3 grid gap-1.5"
        @click="isLongRow(x) && toggle(x.name + '-m')"
      >
        <div
          class="font-mono text-xs font-medium leading-6 text-ink-gray-9 break-all"
        >
          <span :class="{ 'line-through': x.deprecated }">{{ x.name }}</span>
        </div>
        <p
          v-if="typeof x.deprecated === 'string'"
          class="text-xs leading-5 text-ink-gray-5"
        >
          Deprecated — {{ x.deprecated }}
        </p>
        <p
          v-else-if="x.description"
          :class="[
            'text-xs leading-5 text-ink-gray-5',
            clampClass(x, x.name + '-m'),
          ]"
        >
          {{ x.description }}
        </p>

        <pre
          v-if="!x.deprecated"
          :class="[typeClass, clampClass(x, x.name + '-m')]"
          >{{ displayType(x.type) || '—' }}</pre
        >

        <button
          v-if="isLongRow(x)"
          :class="expandBtnClass"
          :aria-expanded="expanded[x.name + '-m']"
          @click="toggle(x.name + '-m')"
        >
          <LucideChevronDown :class="chevronClass(x.name + '-m')" />
          {{ expanded[x.name + '-m'] ? 'Show less' : 'Show more' }}
        </button>
      </div>
    </div>
  </div>
</template>
