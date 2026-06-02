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
      rel="noopener noreferrer"
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
import Button from '#components/Button/Button.vue'
import TextInput from '#components/TextInput/TextInput.vue'
import { isSafeUrl } from '#molecules/editor/extensions/shared/url-safety'

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
  // Empty submits through as the "remove link" action; otherwise require a
  // well-formed http(s) URL (shared url-safety, not the legacy isValidUrl).
  if (_href.value === '' || isSafeUrl(_href.value, { allowedSchemes: ['http', 'https', 'mailto', 'tel'] })) {
    emit('updateHref', _href.value)
  }
}

const copyLink = async () => {
  if (!_href.value) return
  try {
    await navigator.clipboard.writeText(_href.value)
  } catch {
    // Clipboard may be unavailable (no permission / insecure context).
  }
}

onMounted(async () => {
  await nextTick()
  if (input.value?.el) {
    // preventScroll: the popup is teleported to <body> and positioned async by
    // floating-ui, so at focus time the input may still be at the top of the
    // document — a plain focus() would scroll the page up to it.
    input.value.el.focus({ preventScroll: true })
    input.value.el.select()
  }
})
</script>
