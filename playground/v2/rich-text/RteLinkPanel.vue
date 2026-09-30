<script setup lang="ts">
// Figma: espresso-2.0 › embed-link (31823:54797, 31823:54816). A 36px card
// on a 12px radius, 4px in, under the xl shadow: the library's subtle
// input at 28px — the link glyph, 8, the address — and a 28px ghost
// button beside it. Over a link the address is read and the button is
// the pencil; editing, the address is live and the button unlinks. A new
// link opens straight into editing with no button: Enter sets it, Escape
// leaves. The same rules as the library's popup: a bare host gets https,
// and an address that is not one shakes the field and stays.
import {
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useTemplateRef,
} from 'vue'
import { Button, TextInput } from '../../../src'
import { isSafeUrl } from '../../../src/molecules/editor/extensions/shared/url-safety'
import RteIcon from './RteIcon.vue'

const props = defineProps<{
  href: string
  /** open straight into editing; otherwise a link is read first */
  startInEdit?: boolean
}>()
const emit = defineEmits<{
  updateHref: [href: string]
  close: []
}>()

const ALLOWED_SCHEMES = ['http', 'https', 'mailto', 'tel']

const value = ref(props.href)
const input = useTemplateRef<InstanceType<typeof TextInput>>('input')
const edit = ref(props.startInEdit ?? !props.href)
const shake = ref(false)

const editIcon = () => h(RteIcon, { name: 'edit' })
const unlinkIcon = () => h(RteIcon, { name: 'link-broken' })

const normalize = (raw: string) => {
  const trimmed = raw.trim()
  if (!trimmed) return ''
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}
const isValid = (href: string) => {
  if (!isSafeUrl(href, { allowedSchemes: ALLOWED_SCHEMES })) return false
  let url: URL
  try {
    url = new URL(href)
  } catch {
    return false
  }
  if (url.protocol === 'http:' || url.protocol === 'https:')
    return url.hostname === 'localhost' || url.hostname.includes('.')
  return true
}

function submit() {
  const href = normalize(value.value)
  if (href === '' || isValid(href)) emit('updateHref', href)
  else {
    shake.value = false
    requestAnimationFrame(() => (shake.value = true))
  }
}

async function focusInput() {
  await nextTick()
  const el = input.value?.inputElement
  if (!el) return
  // the card is placed by floating-ui a frame later; a plain focus would
  // scroll to wherever it sits meanwhile
  el.focus({ preventScroll: true })
  el.select()
}
function startEdit() {
  edit.value = true
  focusInput()
}

// Escape is the card's: editing a link it steps back to reading; otherwise
// it closes
function onKeydown(e: KeyboardEvent) {
  if (e.key !== 'Escape') return
  e.preventDefault()
  e.stopPropagation()
  if (edit.value && props.href) {
    value.value = props.href
    edit.value = false
    return
  }
  emit('close')
}
onMounted(() => {
  document.addEventListener('keydown', onKeydown, true)
  if (edit.value) focusInput()
})
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown, true))
</script>

<template>
  <div
    class="rte-link flex items-center gap-1 rounded-6 bg-surface-elevation-2 p-1 shadow-xl"
    role="dialog"
    aria-label="Link"
  >
    <div
      class="w-[276px]"
      :class="shake && 'rte-link-shake'"
      @animationend="shake = false"
    >
      <TextInput
        ref="input"
        v-model="value"
        type="text"
        size="sm"
        variant="subtle"
        class="w-full"
        placeholder="Paste or type a link"
        :readonly="!edit"
        aria-label="Link address"
        @keydown.enter.prevent="submit"
      >
        <template #prefix>
          <RteIcon name="link" class="size-4 text-ink-gray-7" />
        </template>
      </TextInput>
    </div>
    <Button
      v-if="!edit"
      variant="ghost"
      size="sm"
      :icon="editIcon"
      label="Edit link"
      @click="startEdit"
    />
    <Button
      v-else-if="href"
      variant="ghost"
      size="sm"
      :icon="unlinkIcon"
      label="Remove link"
      @click="emit('updateHref', '')"
    />
  </div>
</template>

<style>
/* the file keeps the field on gray-100 with no rule while it is edited;
   the library's subtle input goes white with a rule on focus */
.rte-link input:focus,
.rte-link input:hover {
  background-color: var(--surface-gray-2);
  border-color: var(--surface-gray-2);
  box-shadow: none;
}
.rte-link-shake {
  animation: rte-link-shake 160ms ease-in-out;
}
@keyframes rte-link-shake {
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
  .rte-link-shake {
    animation: none;
  }
}
</style>
