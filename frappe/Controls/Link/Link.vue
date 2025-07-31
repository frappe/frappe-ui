<template>
  <div class="space-y-1.5 p-[2px] -m-[2px]">
    <Autocomplete
      ref="autocomplete"
      :label="props.label"
      :placeholder="props.placeholder"
      :options="linkOptions"
      :loading="searchCall.loading"
      @update:query="searchInput = $event"
      :modelValue="modelValue"
      @update:modelValue="
        modelValue =
          $event && typeof $event === 'object' ? $event.value : $event
      "
    >
      <template v-if="$slots['target']" #target="{ open, togglePopover }">
        <slot name="target" v-bind="{ open, togglePopover }" />
      </template>

      <template v-if="$slots['prefix']" #prefix>
        <slot name="prefix" />
      </template>

      <template
        v-if="$slots['item-prefix']"
        #item-prefix="{ active, selected, option }"
      >
        <slot name="item-prefix" v-bind="{ active, selected, option }" />
      </template>

      <template #item-label="{ active, selected, option }">
        <slot name="item-label" v-bind="{ active, selected, option }">
          <div v-if="option.description" class="flex flex-col gap-1">
            <div class="flex-1 font-semibold truncate text-ink-gray-7">
              {{ option.label || option.value }}
            </div>
            <div class="flex-1 text-sm truncate text-ink-gray-5">
              {{ option.description }}
            </div>
          </div>
          <div v-else class="flex-1 truncate text-ink-gray-7">
            {{ option.label || option.value }}
          </div>
        </slot>
      </template>

      <template #footer="{ searchInput, close }">
        <div v-if="props.onCreate">
          <Button
            variant="ghost"
            class="w-full !justify-start"
            :label="'Create New'"
            @click="() => props.onCreate?.(searchInput, close)"
          >
            <template #prefix>
              <LucidePlus class="size-4" />
            </template>
          </Button>
        </div>
      </template>
    </Autocomplete>
  </div>
</template>

<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import { Autocomplete, useCall } from 'frappe-ui'
import { computed, ref } from 'vue'
import { LinkOption, LinkProps } from './types'

const modelValue = defineModel<string>()
const props = defineProps<LinkProps>()

const linkOptions = ref<LinkOption[]>([])
const searchInput = ref('')

const searchParams = computed(() => ({
  txt: searchInput.value,
  doctype: props.doctype,
  filters: props.filters,
}))

const searchCall = useCall({
  url: '/api/method/frappe.desk.search.search_link',
  method: 'POST',
  params: () => searchParams.value,
  immediate: false,
  onSuccess: (data: LinkOption[]) => {
    linkOptions.value = data
    if (!props.hideMe && props.doctype === 'User') {
      linkOptions.value.unshift({
        label: '@me',
        value: '@me',
      })
    }
  },
})

watchDebounced(searchParams, () => searchCall.fetch(), {
  debounce: 500,
  immediate: true,
  deep: true,
})
</script>
