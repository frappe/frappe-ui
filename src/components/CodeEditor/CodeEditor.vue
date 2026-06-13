<template>
  <LabelingWrapper
    :enabled="hasLabeling"
    :wrapper-class="['space-y-1', attrs.class]"
    :wrapper-style="attrs.style as any"
  >
    <InputLabel
      v-if="props.label || $slots.label"
      :id="labelId"
      :label="props.label"
      :required="props.required"
      class="text-p-sm-medium text-ink-gray-7"
    >
      <template v-if="$slots.label" #default="slotProps">
        <slot name="label" v-bind="slotProps" />
      </template>
    </InputLabel>
    <div
      ref="el"
      class="code-editor"
      data-slot="control"
      :class="hasLabeling ? null : (attrs.class as any)"
      :style="hasLabeling ? null : (attrs.style as any)"
      v-bind="dataAttrs"
    />
    <InputDescription
      v-if="showDescription || $slots.description"
      :id="descriptionId"
      :description="props.description"
    >
      <slot v-if="$slots.description" name="description" />
    </InputDescription>
    <InputError v-if="hasError" :id="errorMessageId" :lines="errorLines" />
  </LabelingWrapper>
</template>

<script setup lang="ts">
// Writer primitive: a CodeMirror 6 editor, nothing else (no preview logic — that
// lives in the sibling `CodePreview`). CodeMirror is lazy-loaded in `onMounted`
// via dynamic `import()` so the static graph stays editor-free and each language
// tree-shakes into its own async chunk — apps that never render a code field pay
// no runtime cost (importing `frappe-ui/code-editor` pulls in no editor code
// until a field actually mounts).
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  useSlots,
  watch,
} from 'vue'
import type { EditorView } from '@codemirror/view'
import type { Compartment, Extension } from '@codemirror/state'
import { useInputLabeling } from '../../composables/useInputLabeling'
import InputLabel from '../InputLabeling/InputLabel.vue'
import InputDescription from '../InputLabeling/InputDescription.vue'
import InputError from '../InputLabeling/InputError.vue'
import LabelingWrapper from '../InputLabeling/LabelingWrapper.vue'
import { loadLanguage } from './languages'
import { buildBaseTheme, buildSyntaxHighlight } from './theme'
import type { CodeEditorEmits, CodeEditorProps } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<CodeEditorProps>(), {
  language: 'plain',
  readonly: false,
  placeholder: '',
  variant: 'subtle',
  size: 'md',
})
const emit = defineEmits<CodeEditorEmits>()
defineSlots<{
  /** Overrides the rendered label content. Receives `{ required }`. */
  label?: (props: { required: boolean }) => any
  /** Overrides the rendered description content. */
  description?: () => any
}>()

const attrs = useAttrs()
const slots = useSlots()

const {
  labelId,
  descriptionId,
  errorMessageId,
  labelledBy,
  describedBy,
  hasError,
  errorLines,
  showDescription,
  dataAttrs,
} = useInputLabeling(props, {
  size: () => props.size,
  variant: () => props.variant,
  disabled: () => props.readonly,
})

// Render the labeling chrome (and its wrapping div) only when something needs
// it — otherwise the editor mounts bare, preserving the primitive's footprint.
const hasLabeling = computed(() =>
  Boolean(
    props.label ||
      slots.label ||
      showDescription.value ||
      slots.description ||
      hasError.value,
  ),
)

const el = ref<HTMLElement | null>(null)

let view: EditorView | null = null
let languageCompartment: Compartment | null = null
let readonlyCompartment: Compartment | null = null
let variantCompartment: Compartment | null = null
let sizeCompartment: Compartment | null = null
let placeholderCompartment: Compartment | null = null
// Carries the labeling ARIA onto CodeMirror's `contentDOM` (the focusable
// contenteditable). Setting it on the outer wrapper would miss the element a
// screen reader actually lands on, so it goes through `contentAttributes`.
let a11yCompartment: Compartment | null = null
// Imported CodeMirror modules, held so the watchers can reconfigure without a
// second dynamic import.
let cmView: typeof import('@codemirror/view') | null = null
let cmState: typeof import('@codemirror/state') | null = null
// Guards the `modelValue` watcher against the editor's own `updateListener`: when
// we dispatch an external change (e.g. the wrapper's JSON pretty-print) we must
// not echo it straight back out as fresh input.
let syncingFromProp = false
// Tracks whether content overflows the height cap so the `overflow` emit only
// fires on transitions, not on every keystroke. The observer watches the
// scroller box. The cap itself is pure CSS — consumers set `--cm-max-height` on
// the root (e.g. `style="--cm-max-height: 13.5rem"`), which the base theme reads
// as the editor's `max-height` (P10: styling via CSS hooks, not a style prop).
// This emit is the one piece a consumer can't derive from CSS — measuring the
// crossing needs the ResizeObserver below — so it stays on the public surface.
let overflowObserver: ResizeObserver | null = null
let lastOverflow = false
// `onMounted` is async (it awaits CodeMirror's dynamic imports). If the component
// unmounts mid-load, `onBeforeUnmount` runs while `view` is still null and its
// cleanup no-ops — then the resumed `onMounted` would create an orphan view +
// observer that nothing destroys. This flag lets the resume bail instead.
let destroyed = false

// Emit when the scroller becomes (un)scrollable — i.e. content crosses the cap.
function measureOverflow() {
  if (!view) return
  const s = view.scrollDOM
  const overflowing = s.scrollHeight > s.clientHeight + 1
  if (overflowing === lastOverflow) return
  lastOverflow = overflowing
  emit('overflow', overflowing)
}

// Build the language `Compartment` contents for a key. For `json` we also wire
// the lint gutter + parse linter so invalid JSON is marked inline at its
// position — the field contract has no error channel, so validation surfaces
// here rather than in the field chrome.
async function buildLanguageExtension(key?: string): Promise<Extension> {
  const exts: Extension[] = []
  const lang = await loadLanguage(key)
  if (lang) exts.push(lang)
  if (key === 'json') {
    const { jsonParseLinter } = await import('@codemirror/lang-json')
    const { linter, lintGutter } = await import('@codemirror/lint')
    exts.push(lintGutter(), linter(jsonParseLinter()))
  }
  return exts
}

// ARIA for the `contentDOM`, derived from the labeling props. Reconfigured by a
// watcher when the label/description/error wiring changes.
function buildA11y(): Extension {
  if (!cmView) return []
  const a: Record<string, string> = {}
  if (labelledBy.value) a['aria-labelledby'] = labelledBy.value
  if (describedBy.value) a['aria-describedby'] = describedBy.value
  if (hasError.value) {
    a['aria-invalid'] = 'true'
    a['aria-errormessage'] = errorMessageId.value
  }
  if (props.required) a['aria-required'] = 'true'
  return cmView.EditorView.contentAttributes.of(a)
}

// Placeholder shown when the doc is empty. Empty string → no extension (a bare
// `placeholder('')` would render an empty hint box). Held in a compartment so a
// consumer can change the text at runtime without recreating the view.
function buildPlaceholder(text?: string): Extension {
  if (!cmView || !text) return []
  return cmView.placeholder(text)
}

function buildReadonly(ro: boolean): Extension {
  if (!cmState || !cmView) return []
  return [
    cmState.EditorState.readOnly.of(ro),
    cmView.EditorView.editable.of(!ro),
  ]
}

// Per-variant surface (background + border + focus treatment), mirroring
// frappe-ui's `subtle | outline` input variants so a code field sits
// flush with the TextInput/Textarea fields around it (`ghost` is intentionally
// not offered — a borderless code surface loses its editable affordance). The
// base `theme` owns
// everything else (typography, radius, gutters, tooltips) and deliberately does
// NOT set bg/border, so these fragments are the sole source of surface chrome —
// no precedence fight. Added after `theme` in the extensions array, so they win
// over `basicSetup`'s defaults the same way `theme` already does.
function buildVariant(v?: string): Extension {
  if (!cmView) return []
  const ring = '0 0 0 2px var(--outline-gray-3, #cbd5e1)'
  const fragments: Record<string, Record<string, Record<string, string>>> = {
    subtle: {
      '&': {
        backgroundColor: 'var(--surface-gray-2, #f1f5f9)',
        border: '1px solid var(--surface-gray-2, #e2e8f0)',
      },
      // Hover mirrors frappe-ui's TextInput/Textarea `subtle` variant
      // (`hover:border-outline-elevation-2 hover:bg-surface-gray-3`) so a code
      // field reacts to hover the same way the inputs around it do. Declared
      // before `&.cm-focused` so the focused surface wins when both apply.
      '&:hover': {
        backgroundColor: 'var(--surface-gray-3, #e2e8f0)',
        borderColor: 'var(--outline-elevation-2, #94a3b8)',
      },
      '&.cm-focused': {
        backgroundColor: 'var(--surface-base, white)',
        borderColor: 'var(--outline-gray-4, #94a3b8)',
        boxShadow: ring,
      },
    },
    outline: {
      '&': {
        backgroundColor: 'var(--surface-base, white)',
        border: '1px solid var(--outline-gray-2, #e2e8f0)',
      },
      '&.cm-focused': {
        borderColor: 'var(--outline-gray-4, #94a3b8)',
        boxShadow: ring,
      },
    },
  }
  return cmView.EditorView.theme(fragments[v ?? 'subtle'] ?? fragments.subtle)
}

// Per-size font scale + content min-height, mirroring frappe-ui's `sm|md|lg|xl`
// input sizes. This compartment is the SOLE source of `&` font size and
// `.cm-content` min-height — the base `theme` deliberately omits both so there's
// no equal-specificity fight whose winner depends on StyleModule order.
function buildSize(s?: string): Extension {
  if (!cmView) return []
  const sizes: Record<string, { fontSize: string; minHeight: string }> = {
    sm: { fontSize: '12px', minHeight: '3.5rem' },
    md: { fontSize: '13px', minHeight: '4.5rem' },
    lg: { fontSize: '14px', minHeight: '6rem' },
    xl: { fontSize: '16px', minHeight: '7.5rem' },
  }
  const cfg = sizes[s ?? 'md'] ?? sizes.md
  return cmView.EditorView.theme({
    '&': { fontSize: cfg.fontSize },
    '.cm-content': { minHeight: cfg.minHeight },
  })
}

onMounted(async () => {
  // SSR guard — no editor without a DOM.
  if (typeof document === 'undefined' || !el.value) return

  cmView = await import('@codemirror/view')
  cmState = await import('@codemirror/state')
  const { basicSetup } = await import('codemirror')
  // `basicSetup` leaves Tab as a focus-move (CodeMirror's a11y default); bind it
  // to indent/dedent so Tab behaves like an editor, not a form field. Escape
  // still releases focus, so keyboard users can tab out via Esc-then-Tab.
  const { indentWithTab } = await import('@codemirror/commands')
  const { EditorView } = cmView
  const { Compartment } = cmState

  languageCompartment = new Compartment()
  readonlyCompartment = new Compartment()
  variantCompartment = new Compartment()
  sizeCompartment = new Compartment()
  placeholderCompartment = new Compartment()
  a11yCompartment = new Compartment()

  // Base chrome theme + token-keyed syntax highlighting live in `./theme` (the
  // ~200 lines of style literals would otherwise drown the editor logic). Both
  // take the already-imported CodeMirror modules so no editor code leaks into the
  // static graph.
  const theme = buildBaseTheme(cmView)
  const highlight = await buildSyntaxHighlight(cmState)

  const updateListener = EditorView.updateListener.of((update) => {
    if (update.docChanged) {
      if (!syncingFromProp)
        emit('update:modelValue', update.state.doc.toString())
      // Content height may have changed (capped scroller won't trigger the
      // ResizeObserver, so re-check here on every doc edit).
      measureOverflow()
    }
  })

  // Blur is the commit point (mirrors the typed-field contract).
  const blurHandler = EditorView.domEventHandlers({
    blur: () => {
      if (view) emit('change', view.state.doc.toString())
    },
  })

  // Escape releases focus. `indentWithTab` rebinds Tab to indent, which would
  // otherwise trap keyboard users inside the editor with no way out (WCAG
  // 2.1.2). Escape blurs the content DOM so they can Tab on to the next field —
  // Esc-then-Tab, the standard CodeMirror keyboard-trap escape hatch.
  const escapeHandler = EditorView.domEventHandlers({
    keydown: (e, v) => {
      if (e.key === 'Escape') {
        v.contentDOM.blur()
        return true
      }
      return false
    },
  })

  const extensions: Extension[] = [
    basicSetup,
    cmView.keymap.of([indentWithTab]),
    escapeHandler,
    languageCompartment.of(await buildLanguageExtension(props.language)),
    readonlyCompartment.of(buildReadonly(!!props.readonly)),
    a11yCompartment.of(buildA11y()),
    updateListener,
    blurHandler,
    theme,
    variantCompartment.of(buildVariant(props.variant)),
    sizeCompartment.of(buildSize(props.size)),
    placeholderCompartment.of(buildPlaceholder(props.placeholder)),
    highlight,
  ]

  // Bail if the component unmounted while the dynamic imports above were in
  // flight — otherwise we'd create a view + observer that `onBeforeUnmount`
  // already ran past and nothing would ever destroy.
  if (destroyed || !el.value) return

  view = new EditorView({
    doc: props.modelValue ?? '',
    extensions,
    parent: el.value,
  })

  measureOverflow()
  // Catches overflow changes the doc-edit path misses: wrapping reflow on width
  // change, and the cap being applied/removed (a consumer toggling
  // `--cm-max-height` resizes the scroller, which fires this). Fires once on
  // observe for the initial measurement.
  if (typeof ResizeObserver !== 'undefined') {
    overflowObserver = new ResizeObserver(() => measureOverflow())
    overflowObserver.observe(view.scrollDOM)
  }
})

// Sync external `modelValue` changes into the view. This is also what makes the
// wrapper's JSON pretty-print visible: when it rewrites the value on commit, this
// dispatches the reformatted string back into the editor.
//
// Rather than replacing the whole doc (which would reset the caret to the end,
// collapse the selection, jump the scroll, and abort IME composition), we diff
// off the common prefix/suffix and change only the differing middle. CodeMirror
// then maps the existing selection through that change, so an unchanged caret
// stays put — important when a consumer transforms the value live, not just on
// the unfocused blur/pretty-print path.
watch(
  () => props.modelValue,
  (val) => {
    if (!view) return
    const current = view.state.doc.toString()
    const next = val ?? ''
    if (next === current) return

    // Longest common prefix.
    let from = 0
    const max = Math.min(current.length, next.length)
    while (from < max && current[from] === next[from]) from++
    // Longest common suffix (not overlapping the prefix on either side).
    let curEnd = current.length
    let nextEnd = next.length
    while (
      curEnd > from &&
      nextEnd > from &&
      current[curEnd - 1] === next[nextEnd - 1]
    ) {
      curEnd--
      nextEnd--
    }

    syncingFromProp = true
    view.dispatch({
      changes: { from, to: curEnd, insert: next.slice(from, nextEnd) },
    })
    syncingFromProp = false
  },
)

// Swap the language (and JSON linter) without recreating the view. The extension
// build is async (it dynamic-imports the `@codemirror/lang-*` package), so a fast
// A→B switch races two builds; the monotonic `langSeq` token drops a stale build
// whose import resolves after a newer one, so the latest `props.language` always
// wins regardless of import-resolution order.
let langSeq = 0
watch(
  () => props.language,
  async (key) => {
    const seq = ++langSeq
    const ext = await buildLanguageExtension(key)
    if (!view || !languageCompartment || seq !== langSeq) return
    view.dispatch({
      effects: languageCompartment.reconfigure(ext),
    })
  },
)

watch(
  () => props.readonly,
  (ro) => {
    if (!view || !readonlyCompartment) return
    view.dispatch({
      effects: readonlyCompartment.reconfigure(buildReadonly(!!ro)),
    })
  },
)

// Swap the surface variant without recreating the view.
watch(
  () => props.variant,
  (v) => {
    if (!view || !variantCompartment) return
    view.dispatch({ effects: variantCompartment.reconfigure(buildVariant(v)) })
  },
)

// Swap the size scale without recreating the view, then re-measure overflow
// (the new min-height/font size can change whether content overflows).
watch(
  () => props.size,
  (s) => {
    if (!view || !sizeCompartment) return
    view.dispatch({ effects: sizeCompartment.reconfigure(buildSize(s)) })
    measureOverflow()
  },
)

// Swap the placeholder text without recreating the view.
watch(
  () => props.placeholder,
  (text) => {
    if (!view || !placeholderCompartment) return
    view.dispatch({
      effects: placeholderCompartment.reconfigure(buildPlaceholder(text)),
    })
  },
)

// Re-apply ARIA when the label/description/error wiring changes.
watch(
  () => [labelledBy.value, describedBy.value, hasError.value, props.required],
  () => {
    if (!view || !a11yCompartment) return
    view.dispatch({ effects: a11yCompartment.reconfigure(buildA11y()) })
  },
)

onBeforeUnmount(() => {
  destroyed = true
  overflowObserver?.disconnect()
  overflowObserver = null
  if (view) {
    view.destroy()
    view = null
  }
})
</script>
