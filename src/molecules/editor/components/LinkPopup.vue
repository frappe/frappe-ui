<template>
  <div
    class="p-2 w-72 flex items-center gap-2 bg-surface-white shadow-xl rounded"
  >
    <TextInput
      v-if="edit"
      ref="input"
      type="text"
      class="w-full"
      placeholder="https://example.com"
      v-model="_href"
      @keydown.enter="submitLink"
      @keydown.esc="$emit('close')"
    />
    <a
      v-else
      class="text-ink-gray-700 underline text-sm flex-1 truncate pl-1"
      :title="_href"
      :href="_href"
      target="_blank"
    >
      {{ _href }}
    </a>
    <div class="shrink-0 flex items-center gap-1.5 ml-auto">
      <template v-if="edit">
        <Button
          @click="submitLink"
          tooltip="Submit"
          :icon="'lucide-check'"
          variant="subtle"
        />
        <Button
          @click="props.href ? (edit = false) : $emit('updateHref', '')"
          tooltip="Exit"
          :icon="'lucide-x'"
          variant="subtle"
        />
      </template>
      <template v-else>
        <Button
          @click="copyLink"
          tooltip="Copy"
          :icon="'lucide-copy'"
          variant="subtle"
        />
        <Button
          @click="edit = true"
          tooltip="Edit"
          :icon="'lucide-pencil'"
          variant="subtle"
        />
        <Button
          tooltip="Remove"
          variant="subtle"
          @click="$emit('updateHref', '')"
          :icon="'lucide-link-2-off'"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, useTemplateRef, nextTick } from 'vue'
import Button from '@components/Button/Button.vue'
import TextInput from '@components/TextInput/TextInput.vue'
import { isValidUrl } from '@utils/url-validation'

const props = defineProps<{
  href: string
}>()

const emit = defineEmits<{
  (e: 'updateHref', href: string): void
  (e: 'close'): void
}>()

const _href = ref(props.href)
const input = useTemplateRef('input')
const edit = ref(!props.href)

const submitLink = () => {
  if (_href.value === '' || isValidUrl(_href.value)) {
    emit('updateHref', _href.value)
  }
}

const copyLink = async () => {
  if (_href.value) await navigator.clipboard.writeText(_href.value)
}

onMounted(async () => {
  await nextTick()
  if (input.value?.el) {
    input.value.el.focus()
    input.value.el.select()
  }
})
</script>
