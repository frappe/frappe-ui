<script setup lang="ts">
// Figma: espresso-2.0 › References › modal (34953:131928) — "popup",
// single-field. Laid out on the shared form card; fields are md outline
// controls, 20px apart.
import { ref, watch } from 'vue'
import { Button, Radio, RadioGroup, TextInput } from '../../../src'
import EspressoModal from './EspressoModal.vue'
import ModalField from './ModalField.vue'

const props = withDefaults(defineProps<{ name?: string }>(), {
  name: 'General',
})

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  save: [value: { name: string; visibleTo: string | null }]
}>()

const name = ref(props.name)
const visibleTo = ref<string | null>(null)

watch(open, (isOpen) => {
  if (isOpen) {
    name.value = props.name
    visibleTo.value = null
  }
})

function save(close: () => void) {
  if (!name.value.trim()) return
  emit('save', { name: name.value.trim(), visibleTo: visibleTo.value })
  close()
}
</script>

<template>
  <EspressoModal v-model:open="open" title="Edit General" variant="form">
    <div class="flex flex-col gap-5">
      <!-- 32px outline icon button · 8px · input -->
      <ModalField label="Category name">
        <div class="flex items-center gap-2">
          <Button
            class="shrink-0"
            variant="outline"
            size="md"
            label="Category icon"
          >
            <template #icon>
              <span class="lucide-settings size-[18px] text-ink-gray-6" />
            </template>
          </Button>
          <TextInput
            v-model="name"
            class="flex-1"
            size="md"
            variant="outline"
          />
        </div>
      </ModalField>

      <ModalField label="Visible to">
        <RadioGroup v-model="visibleTo" class="py-2">
          <Radio value="agents" label="Agents only" />
        </RadioGroup>
      </ModalField>
    </div>

    <template #footer="{ close }">
      <Button
        class="w-full"
        variant="solid"
        size="md"
        :disabled="!name.trim()"
        @click="save(close)"
      >
        Save
      </Button>
    </template>
  </EspressoModal>
</template>
