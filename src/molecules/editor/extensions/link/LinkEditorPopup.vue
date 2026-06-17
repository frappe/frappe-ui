<template>
  <EditorPopover
    dialog-label="Edit link"
    content-class="flex min-w-60 max-w-80 items-center gap-1 rounded-md p-1"
    :autofocus="false"
  >
    <template v-if="edit">
      <div
        class="flex-1"
        :class="{ 'editor-link-shake': shake }"
        @animationend="shake = false"
      >
        <TextInput
          ref="input"
          type="text"
          class="w-full"
          placeholder="https://example.com"
          v-model="_href"
          @keydown.enter="submitLink"
        />
      </div>
      <Button
        v-if="href"
        size="xs"
        variant="ghost"
        tooltip="Remove link"
        :icon="'lucide-link-2-off'"
        @click="$emit('updateHref', '')"
      />
      <Button
        size="xs"
        variant="ghost"
        tooltip="Apply"
        :icon="'lucide-check'"
        @click="submitLink"
      />
    </template>

    <template v-else>
      <span
        class="lucide-globe ml-1.5 size-4 shrink-0 text-ink-gray-5"
        aria-hidden="true"
      />
      <div class="pl-1.5 flex-1 min-w-0 flex">
        <a
          class="truncate text-sm text-ink-gray-9 border-b border-outline-gray-2 hover:border-outline-gray-3"
          :title="_href"
          :href="_href"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ _href }}
        </a>
      </div>
      <Button
        size="xs"
        variant="ghost"
        tooltip="Copy link"
        :icon="'lucide-copy'"
        @click="copyLink"
      />
      <Button size="xs" variant="ghost" @click="enterEditMode">Edit</Button>
    </template>
  </EditorPopover>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useTemplateRef, nextTick } from 'vue'
import Button from '#components/Button/Button.vue'
import TextInput from '#components/TextInput/TextInput.vue'
import EditorPopover from '#molecules/editor/components/EditorPopover.vue'
import { isSafeUrl } from '#molecules/editor/extensions/shared/url-safety'

const props = defineProps<{
  href: string
  /** Open directly in edit mode. Defaults to "edit when there is no href". */
  startInEdit?: boolean
}>()

const emit = defineEmits<{
  (e: 'updateHref', href: string): void
  (e: 'close'): void
}>()

const ALLOWED_SCHEMES = ['http', 'https', 'mailto', 'tel']

const _href = ref(props.href)
const input = useTemplateRef('input')
// New links open straight into edit mode; existing links open in the view —
// unless the caller forces it (e.g. ⌘K on a selected link → edit mode).
const edit = ref(props.startInEdit ?? !props.href)
const shake = ref(false)

/**
 * Make a bare entry usable as a link: `github.com` → `https://github.com`.
 * Anything that already carries a scheme (`http:`, `mailto:`, `tel:`, …) or is
 * empty is left untouched, matching the extension's `defaultProtocol: 'https'`.
 */
const normalizeHref = (value: string): string => {
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

/**
 * Stricter than {@link isSafeUrl} alone: the URL parser accepts bare tokens
 * (`asdf` → `https://asdf`) as valid hostnames, so for http(s) links we also
 * require a dotted host (or localhost). Keeps "not a link" text from being
 * accepted once auto-prefixed.
 */
const isValidLinkHref = (href: string): boolean => {
  if (!isSafeUrl(href, { allowedSchemes: ALLOWED_SCHEMES })) return false
  let url: URL
  try {
    url = new URL(href)
  } catch {
    return false
  }
  if (url.protocol === 'http:' || url.protocol === 'https:') {
    return url.hostname === 'localhost' || url.hostname.includes('.')
  }
  return true
}

const triggerShake = () => {
  // Restart the animation even if it is mid-flight.
  shake.value = false
  requestAnimationFrame(() => {
    shake.value = true
  })
}

const submitLink = () => {
  const normalized = normalizeHref(_href.value)
  // Empty submits through as the "remove link" action; otherwise the URL must
  // be well-formed and look like a real link (see isValidLinkHref).
  if (normalized === '') {
    emit('updateHref', '')
  } else if (isValidLinkHref(normalized)) {
    emit('updateHref', normalized)
  } else {
    triggerShake()
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

const focusInput = async () => {
  await nextTick()
  const el = input.value?.el
  if (!el) return
  // preventScroll: the popup is teleported to <body> and positioned async by
  // floating-ui, so at focus time the input may still be at the top of the
  // document — a plain focus() would scroll the page up to it.
  el.focus({ preventScroll: true })
  el.select()
}

const enterEditMode = () => {
  edit.value = true
  focusInput()
}

/**
 * When creating a brand-new link, offer a URL already on the clipboard as the
 * default — the common "copy a URL, select some text, ⌘K" flow. The value is
 * left selected so a keystroke replaces it.
 */
const maybePrefillFromClipboard = async () => {
  if (props.href || _href.value) return
  // Clipboard read needs a secure context (https/localhost); it is unavailable
  // over plain http (e.g. *.frappe.test dev), where this simply no-ops.
  if (!navigator.clipboard?.readText) return
  let text = ''
  try {
    text = (await navigator.clipboard.readText()).trim()
  } catch {
    return // No permission / not focused.
  }
  const normalized = normalizeHref(text)
  if (!isValidLinkHref(normalized)) return
  _href.value = normalized
  await nextTick()
  input.value?.el?.select()
}

/**
 * Escape is owned here (the floating popup is created with `closeOnEscape:
 * false`). When editing an existing link the first Escape discards the edit
 * and steps back to the view; in every other case it closes the popup.
 */
const handleEscape = () => {
  if (edit.value && props.href) {
    _href.value = props.href
    edit.value = false
    return
  }
  emit('close')
}

const onDocumentKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape') return
  // Consume it so a single Escape doesn't also close a surrounding dialog.
  event.preventDefault()
  event.stopPropagation()
  handleEscape()
}

onMounted(async () => {
  document.addEventListener('keydown', onDocumentKeydown, true)
  if (edit.value) {
    focusInput()
    await maybePrefillFromClipboard()
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onDocumentKeydown, true)
})
</script>

<style scoped>
.editor-link-shake {
  animation: editor-link-shake 160ms ease-in-out;
}

@keyframes editor-link-shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-3px);
  }
  75% {
    transform: translateX(3px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .editor-link-shake {
    animation: none;
  }
}
</style>
