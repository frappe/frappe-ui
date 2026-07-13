<script setup lang="ts">
// One recipe in the single-page gallery: a title, a Desktop / Mobile platform
// switcher, a Preview / Code tab switcher, and — in Preview — the live
// chrome-less demo in an iframe. Each platform's source arrives as a named
// slot (`#desktop` / `#mobile`) from a `<<<` include so VitePress highlights it.
//
// The iframe src is only set once the block scrolls near the viewport, so the
// page doesn't boot every app shell at once. The exception is the first recipe
// (`eager`), which sits in the first fold: it renders its iframe straight into
// the server HTML so the browser fetches the demo before Vue even hydrates.
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { withBase } from 'vitepress'
import { TabButtons, Select } from 'frappe-ui'
import { getRecipeGroup, type Platform } from './index'

const props = defineProps<{
  /** Recipe group key, e.g. "discussions". */
  base: string
  title?: string
  /** Preview height for the desktop variant. */
  height?: string
  /** Preview height for the mobile variant. */
  mobileHeight?: string
  /**
   * Boot this recipe's iframe immediately instead of waiting for it to scroll
   * near the viewport. Set on the first recipe so the above-the-fold preview
   * starts loading with the page rather than after hydration + observer.
   */
  eager?: boolean
}>()

const group = computed(() => getRecipeGroup(props.base))
const heading = computed(() => props.title || group.value?.title || props.base)

// A desktop shell squeezed into a phone-width iframe is unreadable, so small
// screens default to the mobile variant when the group ships one. `selected`
// holds an explicit user choice and wins once set; the `mounted` gate keeps the
// first client render matching SSR (which has no viewport) so hydration is clean.
const isSmallScreen = useMediaQuery('(max-width: 640px)')
const mounted = ref(false)
const selected = ref<Platform | null>(null)
const platform = computed<Platform>({
  get() {
    if (selected.value) return selected.value
    if (mounted.value && isSmallScreen.value && group.value?.mobile) {
      return 'mobile'
    }
    return group.value?.desktop ? 'desktop' : 'mobile'
  },
  set(value) {
    selected.value = value
  },
})
const variant = computed(() => group.value?.[platform.value])
const isMobile = computed(() => platform.value === 'mobile')

const platformOptions = computed(() => [
  {
    label: 'Desktop',
    value: 'desktop',
    icon: 'lucide-monitor',
    disabled: !group.value?.desktop,
  },
  {
    label: 'Mobile',
    value: 'mobile',
    icon: 'lucide-smartphone',
    disabled: !group.value?.mobile,
  },
])
// Only worth showing the switcher when there's a real choice.
const hasBothPlatforms = computed(
  () => Boolean(group.value?.desktop) && Boolean(group.value?.mobile),
)

const frameHeight = computed(() =>
  isMobile.value ? props.mobileHeight || '780px' : props.height || '720px',
)

const src = computed(() =>
  variant.value ? withBase(`/recipes/demo/${variant.value.slug}`) : '',
)

const tab = ref<'preview' | 'code'>('preview')
const tabOptions = [
  { label: 'Preview', value: 'preview' },
  { label: 'Code', value: 'code' },
]

// Boot the iframe only when the block nears the viewport — except the first
// recipe, which starts visible so its iframe is in the SSR HTML and begins
// loading before hydration.
const root = useTemplateRef<HTMLElement>('root')
const visible = ref(props.eager ?? false)
// Above-the-fold recipe: fetch its iframe with the highest priority; the rest
// stay lazy so they don't compete for the network during first paint.
const iframeLoading = computed(() => (props.eager ? 'eager' : 'lazy'))
let observer: IntersectionObserver | undefined
onMounted(() => {
  mounted.value = true
  // Eager recipe already booted its iframe in SSR — no observer needed.
  if (visible.value) return
  // Older browsers without IntersectionObserver can't lazy-boot; load eagerly
  // so the previews still appear instead of the callback throwing on mount.
  if (typeof IntersectionObserver === 'undefined') {
    visible.value = true
    return
  }
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        visible.value = true
        observer?.disconnect()
      }
    },
    // Preload one screen ahead so the iframe is warm by the time it's in view.
    { rootMargin: '600px 0px' },
  )
  if (root.value) observer.observe(root.value)
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <section ref="root" class="not-prose my-40 first-of-type:mt-10">
    <!-- Toolbar: the title doubles as the "open full screen" link on the left;
         platform + Preview/Code switchers sit at the end on the right. -->
    <div class="mb-2 flex flex-wrap items-center justify-between gap-3">
      <a
        v-if="src"
        :href="src"
        target="_blank"
        rel="noopener"
        class="group flex items-center gap-1 text-md-medium text-ink-gray-8 hover:text-ink-gray-9"
      >
        {{ heading }}
        <span
          class="lucide-arrow-up-right size-3.5 text-ink-gray-4 group-hover:text-ink-gray-6"
          aria-hidden="true"
        />
      </a>
      <span v-else class="text-sm font-medium text-ink-gray-8">{{
        heading
      }}</span>

      <div class="flex items-center gap-3">
        <Select
          v-if="hasBothPlatforms"
          v-model="platform"
          :options="platformOptions"
          size="sm"
        />
        <TabButtons v-model="tab" :options="tabOptions" />
      </div>
    </div>

    <!-- Preview. Until the block nears the viewport the iframe is withheld and a
         same-size placeholder reserves its height so scroll offsets stay stable. -->
    <div v-show="tab === 'preview'">
      <div
        v-if="isMobile"
        class="flex justify-center rounded border bg-surface-gray-1 py-8"
        :style="{ minHeight: frameHeight }"
      >
        <iframe
          v-if="visible"
          :src="src"
          :title="heading"
          :loading="iframeLoading"
          class="w-[390px] rounded border bg-surface-base shadow-lg"
          :style="{ height: frameHeight }"
        />
      </div>
      <template v-else>
        <iframe
          v-if="visible"
          :src="src"
          :title="heading"
          :loading="iframeLoading"
          class="w-full rounded border bg-surface-base"
          :style="{ height: frameHeight }"
        />
        <div
          v-else
          class="w-full rounded border bg-surface-gray-1"
          :style="{ height: frameHeight }"
        />
      </template>
    </div>

    <!-- Code: the highlighted source for each platform arrives as a named slot
         from a `<<<` include; show the one matching the active platform. Cap
         the height and let it scroll. -->
    <div
      v-show="tab === 'code'"
      class="recipe-code overflow-hidden rounded border [&_div[class*=language-]]:my-0 [&_div[class*=language-]]:rounded-none [&_div[class*=language-]]:border-0"
      :style="{ maxHeight: frameHeight }"
    >
      <div class="h-full overflow-auto" :style="{ maxHeight: frameHeight }">
        <div v-show="platform === 'desktop'"><slot name="desktop" /></div>
        <div v-show="platform === 'mobile'"><slot name="mobile" /></div>
      </div>
    </div>
  </section>
</template>
