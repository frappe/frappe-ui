<template>
  <template>
    <Dialog
      v-model="show"
      :options="{ size: 'xl', position: 'top' }"
      @after-leave="searchQuery = ''"
    >
      <template #body>
        <div>
          <Combobox nullable @update:model-value="select">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-4.5">
                <FeatherIcon name="search" class="h-4 w-4" />
              </div>
              <ComboboxInput
                placeholder="Search"
                class="w-full border-none bg-transparent py-3 pl-11.5 pr-4.5 text-base text-gray-800 placeholder-gray-500 focus:ring-0"
                v-model="searchQuery"
                autocomplete="off"
              />
            </div>
            <ComboboxOptions
              class="max-h-96 overflow-auto border-t border-gray-100"
              static
              :hold="true"
            >
              <div
                class="mb-2 mt-4.5 first:mt-3"
                v-for="(group, index) in groups"
                :key="group.title"
              >
                <div
                  class="mb-2.5 px-4.5 text-base text-gray-600"
                  v-if="!group.hideTitle"
                >
                  {{ group.title }}
                </div>
                <ComboboxOption
                  v-for="item in group.items"
                  :key="item.name"
                  v-slot="{ active }"
                  :value="item"
                  class="px-2.5"
                  :disabled="item.disabled"
                >
                  <component
                    :is="group.component"
                    :item="item"
                    :active="active"
                  />
                </ComboboxOption>
              </div>
            </ComboboxOptions>
          </Combobox>
        </div>
      </template>
    </Dialog>
  </template>
</template>

<script setup>
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/vue'
import { computed, onBeforeUnmount, onMounted } from 'vue'

const emit = defineEmits(['update:show', 'update:searchQuery', 'select'])
const props = defineProps({
  show: { type: Boolean, default: false },
  searchQuery: { type: String, default: '' },
  groups: { type: Array, default: () => [] },
})

const show = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value),
})

const searchQuery = computed({
  get: () => props.searchQuery,
  set: (value) => emit('update:searchQuery', value),
})

function select(item) {
  emit('select', item)
  show.value = false
}

function keydownWatcher(e) {
  if (e.key === 'Escape' && show.value) {
    show.value = false
    e.preventDefault()
  }

  if (
    e.key === 'k' &&
    (e.ctrlKey || e.metaKey) &&
    !e.target.classList.contains('ProseMirror')
  ) {
    show.value = true
    e.preventDefault()
  }
}

onMounted(() => window.addEventListener('keydown', keydownWatcher))
onBeforeUnmount(() => window.removeEventListener('keydown', keydownWatcher))
</script>
