<template>
  <Combobox v-slot="{ open }" v-model="selectedOptions" multiple>
    <div class="rounded-md bg-surface-gray-2 py-0.5 px-2 w-full">
      <div class="w-[75%] flex flex-wrap text-base">
        <Button
          v-for="(option, idx) in selectedOptions"
          :key="option.value"
          variant="outline"
          class="shadow-sm m-0.5 py-1"
        >
          <template #prefix>
            <slot name="prefix" v-bind="{ option, idx }" />
          </template>
          <slot name="label" v-bind="{ option, idx }">
            {{ option.label }}
          </slot>
          <template #suffix>
            <slot :suffix="{ option, idx }">
              <LucideX
                class="size-4"
                @click.stop="
                  () =>
                    (selectedOptions = selectedOptions.filter(
                      (_, i) => i !== idx
                    ))
                "
              />
            </slot>
          </template>
        </Button>
        <ComboboxInput
          ref="queryInput"
          v-focus
          :placeholder
          class="text-base p-1 min-w-24 grow basis-0 border-none bg-transparent text-ink-gray-8 placeholder-ink-gray-4 focus:ring-0"
          autocomplete="off"
          @change="query = $event.target.value"
        />
      </div>
    </div>
    <div
      class="absolute z-[1000] rounded-lg bg-surface-modal text-base shadow-2xl"
    >
      <ComboboxOptions
        v-if="open && query.length"
        class="max-h-[15rem] overflow-y-auto p-1.5"
      >
        <ComboboxOption
          v-if="!filteredOptions.length"
          v-slot="{ selected, active }"
          as="template"
          :value="baseOption"
          :disabled="baseOption.disabled"
        >
          <li
            class="flex items-center justify-between rounded px-2.5 py-1.5 text-base text-ink-gray-7"
            :class="{
              'bg-surface-gray-3': active,
              'cursor-pointer': !baseOption.disabled,
              'opacity-50 cursor-not-allowed': baseOption.disabled,
            }"
          >
            <slot name="base-option" v-bind="{ query }">
              <span
                class="block truncate"
                :class="{
                  'font-medium': selected,
                  'font-normal': !selected,
                }"
              >
                {{ query }}
              </span>
            </slot>
          </li>
        </ComboboxOption>
        <template v-for="option in filteredOptions" :key="option.value">
          <ComboboxOption
            v-slot="{ selected, active }"
            as="template"
            :value="option"
            :disabled="option.disabled"
          >
            <li
              class="flex gap-2 overflow-hidden items-center rounded px-2.5 py-1.5 text-base text-ink-gray-7"
              :class="{
                'bg-surface-gray-3': active,
                'cursor-pointer': !option.disabled,
                'opacity-50 cursor-not-allowed': option.disabled,
              }"
            >
              <slot name="option-prefix" v-bind="{ selected, option }">
                <LucideCheck v-if="selected" class="size-4 text-ink-gray-7" />
                <div v-else class="size-4" />
              </slot>
              <slot name="option-label" v-bind="{ selected, option }">
                <span
                  class="block truncate"
                  :class="{
                    'font-medium': selected,
                    'font-normal': !selected,
                  }"
                >
                  {{ option.value }}
                  <span v-if="option.label">({{ option.label }})</span>
                </span>
              </slot>
            </li>
          </ComboboxOption>
        </template>
      </ComboboxOptions>
    </div>
  </Combobox>
</template>
<script setup>
import { computed, ref, useTemplateRef, watch } from 'vue'
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from '@headlessui/vue'

const selectedOptions = defineModel('selectedOptions')
const props = defineProps({
  options: Array,
  placeholder: { type: String, default: 'Type something here...' },
  verify: { type: Function, default: null },
  filter: {
    type: Function,
    default: null,
  },
})
const emit = defineEmits(['selected', 'deselected'])

const baseOption = computed(() => ({
  value: query.value,
  label: query.value,
  disabled: !props.verify(query.value),
}))
const query = ref('')
const queryInput = useTemplateRef('queryInput')
const defaultFilter = (options, query) => {
  const regex = new RegExp(query, 'i')
  return options.filter((k) => regex.test(k.value) || regex.test(k.label))
}
const filter = computed(() => props.filter || defaultFilter)

const filteredOptions = computed(() => {
  return filter.value(props.options, query.value)
})

watch(selectedOptions, (now, prev) => {
  queryInput.value.el.value = ''
  query.value = ''
  if (now.length > prev?.length) emit('selected', now[now.length - 1])
  else if (prev) emit('deselected', prev[prev.length - 1])
})
</script>
