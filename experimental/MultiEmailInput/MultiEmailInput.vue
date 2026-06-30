<script setup lang="ts">
import {
  computed,
  nextTick,
  reactive,
  ref,
  useAttrs,
  useSlots,
  watch,
} from 'vue'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxViewport,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputRoot,
} from 'reka-ui'
import Avatar from '../../src/components/Avatar/Avatar.vue'
import ItemListRow from '../../src/components/ItemListRow/ItemListRow.vue'
import LoadingIndicator from '../../src/components/LoadingIndicator.vue'
import {
  InputDescription,
  InputError,
  InputLabel,
  LabelingWrapper,
} from '../../src/components/InputLabeling'
import { useInputLabeling } from '../../src/composables/useInputLabeling'
import {
  inputFontSizeClasses,
  isValidEmail,
  itemClasses,
  itemRootSizeClasses,
  splitEmailTokens,
  extractEmail,
  toItemListSize,
} from './utils'
import type {
  MultiEmailInputProps,
  MultiEmailInputEmits,
  MultiEmailInputExposed,
  MultiEmailInputSlots,
  MultiEmailOption,
} from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<MultiEmailInputProps>(), {
  options: () => [],
  loading: false,
  size: 'sm',
  placeholder: 'Add email…',
  emptyText: 'No results',
  loadingText: 'Loading...',
  disabled: false,
  side: 'bottom',
  align: 'start',
  offset: 4,
  portalTo: 'body',
})

const emit = defineEmits<MultiEmailInputEmits>()
const slots = useSlots()
const attrs = useAttrs()

const model = defineModel<string[]>({ default: () => [] })

const query = ref('')
const open = ref(false)
const rootRef = ref<{ highlightFirstItem?: () => void } | null>(null)

const {
  inputId,
  labelId,
  descriptionId,
  errorMessageId,
  describedBy,
  hasError,
  errorLines,
  showDescription,
} = useInputLabeling(props, {
  size: () => props.size,
  disabled: () => props.disabled,
})

const hasLabeling = computed(() =>
  Boolean(
    props.label ||
    props.description ||
    hasError.value ||
    slots.label ||
    slots.description,
  ),
)

const inputAriaAttrs = computed(() => ({
  'aria-invalid': hasError.value || undefined,
  'aria-errormessage': hasError.value ? errorMessageId.value : undefined,
  'aria-describedby': describedBy.value,
  'aria-required': props.required || undefined,
}))

// Stable default arrow so createLabel doesn't allocate a closure per call.
const defaultCreateLabel = (value: string) => `Add "${value}"`
const validate = (value: string) => (props.validate ?? isValidEmail)(value)
const createLabel = (value: string) =>
  (props.createLabel ?? defaultCreateLabel)(value)

// Remember option metadata (avatar/name) for the addresses currently in the
// model, so a chip keeps its details even after the suggestion list changes
// (the host only returns matches for the current query). reactive() so a chip
// re-renders when its matching option arrives after the chip already exists.
const seenOptions = reactive(new Map<string, MultiEmailOption>())
watch(
  [() => props.options, model],
  ([options, current]) => {
    for (const option of options) {
      seenOptions.set(option.value.toLowerCase(), option)
    }
    // Keep only entries referenced by current chips, so the cache can't grow
    // past the model size across many searches.
    const keep = new Set(current.map((v) => v.toLowerCase()))
    for (const key of seenOptions.keys()) {
      if (!keep.has(key)) seenOptions.delete(key)
    }
  },
  { immediate: true },
)

function optionFor(value: string): MultiEmailOption | null {
  return seenOptions.get(value.toLowerCase()) ?? null
}

const selectedSet = computed(
  () => new Set(model.value.map((v) => v.toLowerCase())),
)

// Resolve each chip's option once per render (optionFor does a lowercased Map
// lookup); the template would otherwise call it ~5x per chip.
const chips = computed(() =>
  model.value.map((value, index) => {
    const option = optionFor(value)
    return { value, index, option, label: option?.label ?? value }
  }),
)

// Suggestions are host-filtered; we only drop anything already selected.
const suggestions = computed<MultiEmailOption[]>(() =>
  props.options.filter((o) => !selectedSet.value.has(o.value.toLowerCase())),
)

// Offer an explicit "create" row when the typed value is a valid, new address.
const showCreateOption = computed(() => {
  const q = query.value.trim()
  if (!q || !validate(q)) return false
  const lc = q.toLowerCase()
  if (selectedSet.value.has(lc)) return false
  return !suggestions.value.some((o) => o.value.toLowerCase() === lc)
})

const showEmpty = computed(
  () => !props.loading && !suggestions.value.length && !showCreateOption.value,
)

const rowAvatarSize = computed(() => (props.size === 'sm' ? 'sm' : 'md'))

const boxClasses = computed(() => [
  'flex flex-wrap items-center gap-1.5 rounded bg-surface-gray-2 px-1.5 py-1 transition-colors focus-within:ring-2 focus-within:ring-outline-gray-3',
  inputFontSizeClasses(props.size),
  props.disabled && 'cursor-not-allowed bg-surface-gray-1',
])

const chipClasses =
  'inline-flex items-center gap-1 rounded border border-outline-gray-1 bg-surface-base px-1.5 py-0.5 text-sm text-ink-gray-7 transition-colors data-[disabled]:opacity-60 aria-[current=true]:ring-2 aria-[current=true]:ring-outline-gray-3'

const inputClasses = computed(() => [
  'min-w-[6rem] flex-1 border-0 bg-transparent p-0.5 text-ink-gray-8 outline-none ring-0 placeholder:text-ink-gray-4 focus:ring-0 disabled:cursor-not-allowed',
  inputFontSizeClasses(props.size),
])

function highlightFirst() {
  rootRef.value?.highlightFirstItem?.()
}

function removeAt(index: number) {
  const next = model.value.slice()
  next.splice(index, 1)
  model.value = next
}

// Clear the staging input after any committed change — a pick, a typed commit,
// a paste, or a chip delete. The model is the single source of truth; a host
// that wants per-address add/remove diffs `update:modelValue` itself.
watch(
  model,
  () => {
    if (query.value) query.value = ''
  },
  { deep: true },
)

watch(query, (q) => {
  emit('update:query', q)
  if (q && !props.disabled) open.value = true
  nextTick(highlightFirst)
})

function onFocus(event: FocusEvent) {
  emit('focus', event)
  if (props.disabled) return
  open.value = true
  // prime suggestions on first focus when the host hasn't fetched anything yet
  if (!props.options.length && !query.value) emit('update:query', '')
}

function onEnter() {
  const q = query.value.trim()
  if (!q) return
  // Valid addresses and matching suggestions are committed by Combobox selecting
  // the highlighted row (the create row's value IS the typed address). Only when
  // nothing is selectable do we surface invalid feedback.
  if (validate(q) || suggestions.value.length) return
  emit('invalid', q)
}

function onPaste(event: ClipboardEvent) {
  const text = event.clipboardData?.getData('text')
  if (!text || !/[,;\n\r\t]/.test(text)) return // single token → normal typing
  event.preventDefault()
  const seen = new Set(selectedSet.value)
  const additions: string[] = []
  for (const token of splitEmailTokens(text)) {
    const email = extractEmail(token)
    if (!email) continue
    if (!validate(email)) {
      emit('invalid', email)
      continue
    }
    const lc = email.toLowerCase()
    if (seen.has(lc)) continue
    seen.add(lc)
    additions.push(email)
  }
  if (additions.length) model.value = [...model.value, ...additions]
  query.value = ''
}

function focus() {
  ;(document.getElementById(inputId.value) as HTMLInputElement | null)?.focus()
}

function reset() {
  model.value = []
}

defineExpose<MultiEmailInputExposed>({ focus, reset })
defineSlots<MultiEmailInputSlots>()
</script>

<template>
  <LabelingWrapper
    :enabled="hasLabeling"
    :wrapper-class="['space-y-1.5', attrs.class as any]"
    :wrapper-style="attrs.style as any"
  >
    <InputLabel
      v-if="label || $slots.label"
      :id="labelId"
      :for-id="inputId"
      :label="label"
      :required="required"
      class="text-p-sm-medium text-ink-gray-7"
    >
      <template v-if="$slots.label" #default="slotProps">
        <slot name="label" v-bind="slotProps" />
      </template>
    </InputLabel>

    <ComboboxRoot
      ref="rootRef"
      v-model="model"
      multiple
      ignore-filter
      :open="open"
      :disabled="disabled"
      class="relative"
      @update:open="open = $event"
    >
      <ComboboxAnchor as-child>
        <TagsInputRoot
          v-model="model"
          :disabled="disabled"
          delimiter=""
          :add-on-paste="false"
          :add-on-tab="false"
          :add-on-blur="false"
          data-slot="control"
          :data-size="size"
          :data-disabled="disabled ? '' : undefined"
          :data-invalid="hasError ? 'true' : undefined"
          :class="[boxClasses, hasLabeling ? null : (attrs.class as any)]"
          :style="hasLabeling ? null : (attrs.style as any)"
        >
          <TagsInputItem
            v-for="chip in chips"
            :key="chip.value"
            :value="chip.value"
            data-slot="tag"
            :class="chipClasses"
          >
            <slot
              name="tag"
              :value="chip.value"
              :option="chip.option"
              :index="chip.index"
              :remove-tag="() => removeAt(chip.index)"
            >
              <Avatar
                :image="chip.option?.avatar"
                :label="chip.label"
                size="xs"
              />
              <span class="truncate">{{ chip.label }}</span>
              <TagsInputItemDelete
                :aria-label="`Remove ${chip.value}`"
                class="-mr-0.5 inline-flex items-center justify-center rounded-sm p-0.5 text-ink-gray-5 opacity-70 transition hover:text-ink-gray-7 hover:opacity-100"
              >
                <span class="lucide-x size-3" />
              </TagsInputItemDelete>
            </slot>
          </TagsInputItem>

          <ComboboxInput v-model="query" as-child>
            <TagsInputInput
              :id="inputId"
              data-slot="input"
              autocomplete="off"
              :placeholder="model.length ? '' : placeholder"
              :disabled="disabled"
              :class="inputClasses"
              v-bind="inputAriaAttrs"
              @keydown.enter.prevent="onEnter"
              @paste="onPaste"
              @focus="onFocus"
              @blur="emit('blur', $event)"
            />
          </ComboboxInput>
        </TagsInputRoot>
      </ComboboxAnchor>

      <ComboboxPortal :to="portalTo">
        <ComboboxContent
          data-slot="content"
          :data-size="size"
          position="popper"
          :side="side"
          :align="align"
          :side-offset="offset"
          class="z-[100] min-w-[--reka-combobox-trigger-width] overflow-hidden rounded-lg bg-surface-elevation-2 shadow-2xl"
          @open-auto-focus.prevent
        >
          <ComboboxViewport class="max-h-60 overflow-auto p-1">
            <div
              v-if="loading"
              data-slot="loading"
              class="flex items-center gap-2 px-2 py-1.5 text-base text-ink-gray-5"
            >
              <LoadingIndicator class="size-4" />
              <span>{{ loadingText }}</span>
            </div>

            <template v-else>
              <!-- Rendered before suggestions so a valid typed address is the
                   highlighted row, and Enter commits what the user typed. -->
              <ComboboxItem
                v-if="showCreateOption"
                :value="query.trim()"
                data-slot="item"
                data-create="true"
                :data-size="size"
                :text-value="query.trim()"
                :class="[itemClasses, itemRootSizeClasses(size)]"
              >
                <ItemListRow :size="toItemListSize(size)">
                  <template #prefix>
                    <span
                      class="grid size-7 place-items-center text-ink-gray-5"
                      aria-hidden="true"
                    >
                      <span class="lucide-mail size-4" />
                    </span>
                  </template>
                  <template #label>
                    <div class="min-w-0 truncate text-ink-gray-8">
                      {{ createLabel(query.trim()) }}
                    </div>
                  </template>
                </ItemListRow>
              </ComboboxItem>

              <ComboboxItem
                v-for="option in suggestions"
                :key="option.value"
                :value="option.value"
                :disabled="option.disabled"
                :text-value="`${option.label} ${option.value}`"
                data-slot="item"
                :data-size="size"
                :class="[itemClasses, itemRootSizeClasses(size)]"
              >
                <ItemListRow
                  :size="toItemListSize(size)"
                  :disabled="option.disabled"
                >
                  <template #prefix>
                    <slot name="item-prefix" :item="option" :query="query">
                      <Avatar
                        :image="option.avatar"
                        :label="option.label"
                        :size="rowAvatarSize"
                      />
                    </slot>
                  </template>
                  <template #label>
                    <slot name="item-label" :item="option" :query="query">
                      <div class="min-w-0">
                        <div class="truncate text-ink-gray-8">
                          {{ option.label }}
                        </div>
                        <div
                          v-if="option.label !== option.value"
                          class="truncate text-p-sm text-ink-gray-5"
                        >
                          {{ option.value }}
                        </div>
                      </div>
                    </slot>
                  </template>
                  <template v-if="$slots['item-suffix']" #suffix>
                    <slot name="item-suffix" :item="option" :query="query" />
                  </template>
                </ItemListRow>
              </ComboboxItem>

              <div
                v-if="showEmpty"
                data-slot="empty"
                class="px-2 py-1.5 text-base text-ink-gray-5"
              >
                <slot name="empty" :query="query">{{ emptyText }}</slot>
              </div>
            </template>
          </ComboboxViewport>
        </ComboboxContent>
      </ComboboxPortal>
    </ComboboxRoot>

    <InputDescription
      v-if="showDescription || $slots.description"
      :id="descriptionId"
      :description="description"
    >
      <slot v-if="$slots.description" name="description" />
    </InputDescription>
    <InputError v-if="hasError" :id="errorMessageId" :lines="errorLines" />
  </LabelingWrapper>
</template>
