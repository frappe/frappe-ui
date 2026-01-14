<template>
  <Dialog
    v-model="open"
    :options="{
      title: 'Rename',
      size: 'xs',
      actions: [
        {
          label: 'Confirm',
          variant: 'solid',
          disabled: !newTitle || newTitle === entity.title,
          onClick: submit,
        },
      ],
    }"
    @close="dialogType = ''"
  >
    <template #body-content>
      <div class="flex gap-3">
        <FormControl
          v-model="newTitle"
          v-focus
          class="grow"
          type="text"
          @keyup.enter="submit"
        />
        <div
          v-if="file_ext"
          disabled
          class="w-12 text-ink-gray-7 bg-surface-gray-2 rounded text-center self-center py-1.5 text-sm"
        >
          {{ file_ext }}
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref } from 'vue'
import { Dialog } from '../../../src'
import { rename } from '../js/resources'

const props = defineProps({ entity: Object, modelValue: String })
const emit = defineEmits(['update:modelValue', 'success'])
const dialogType = defineModel()
const open = ref(true)

const newTitle = ref('')
const file_ext = ref('')

if (props.entity.is_group || props.entity.document) {
  newTitle.value = props.entity.title
} else {
  const parts = props.entity.title.split('.')
  if (parts.length > 1) {
    newTitle.value = parts.slice(0, -1).join('.')
    file_ext.value = parts[parts.length - 1]
  } else {
    newTitle.value = parts[0]
  }
}

const submit = () => {
  const formattedTitle =
    newTitle.value + (file_ext.value ? '.' + file_ext.value : '')
  rename.submit({
    entity_name: props.entity.name,
    new_title: formattedTitle,
  })
  emit('success', {
    name: props.entity.name,
    title: formattedTitle,
  })
}
</script>
