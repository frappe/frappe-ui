<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'

withDefaults(
  defineProps<{
    /** Space between the runs and the chips that divide them. */
    gap?: number
  }>(),
  { gap: 16 },
)

const feed = ref<HTMLElement>()
const rail = ref<HTMLElement>()
const line = reactive({ top: 0, height: 0 })

/**
 * The hairline runs down to the middle of the last mark — never past it — and
 * everything above is joined: across a month chip, and up to the bottom edge
 * of the chip that opens the feed. Where those ends fall depends on how tall
 * the entries are, which CSS can't know, so it is measured.
 */
function measure() {
  const el = feed.value
  if (!el) return

  // A folded-away section is still in the DOM, so only what is drawn counts —
  // including a mark half-way through a fold, which is clipped by the run it
  // sits in rather than hidden. Measuring the showing part keeps the line in
  // step with the animation instead of snapping at the start of it.
  const nodes = [...el.querySelectorAll('[data-rail-mark], [data-rail-cap]')]
    .map((node) => {
      const box = node.getBoundingClientRect()
      const clip = node.closest('[data-clip]')?.getBoundingClientRect()
      const showing = clip
        ? Math.min(box.bottom, clip.bottom) - Math.max(box.top, clip.top)
        : box.height
      return { cap: node.hasAttribute('data-rail-cap'), box, showing }
    })
    .filter((node) => node.showing > 0)

  if (nodes.length < 2) {
    line.height = 0
    return
  }

  const centre = (box: DOMRect) => box.top + box.height / 2

  // The line starts at the first thing in the feed: the bottom edge of a chip
  // or badge, or the middle of a mark. A month whose entries are folded away
  // still hangs on the line that way, joined to the month under it.
  const head = nodes[0]
  const top = head.cap ? head.box.bottom : centre(head.box)

  // And it ends at the last thing in the feed: the middle of a mark — never
  // past it — or the top edge of a chip, so a folded month still hangs on the
  // line from the entries above it.
  const tail = nodes[nodes.length - 1]
  const bottom = tail.cap ? tail.box.top : centre(tail.box)

  const base = el.getBoundingClientRect()
  line.top = top - base.top
  line.height = Math.max(0, bottom - top)
}

let sizes: ResizeObserver | undefined
let changes: MutationObserver | undefined
let pending = false

// Several things can move the marks at once, so the work is coalesced. A
// timeout rather than an animation frame: a background tab stops handing out
// frames, and the line would then never catch up with a fold.
function remeasure() {
  if (pending) return
  pending = true
  setTimeout(() => {
    pending = false
    measure()
  })
}

onMounted(() => {
  measure()

  sizes = new ResizeObserver(remeasure)
  sizes.observe(feed.value!)

  // A section folding away is `display: none` on a child — a style change,
  // not a size change, so the ResizeObserver alone can miss it. Measuring
  // writes to the line's own style, so its mutations are ignored or this
  // would never settle.
  changes = new MutationObserver((records) => {
    if (records.every((record) => record.target === rail.value)) return
    remeasure()
  })
  changes.observe(feed.value!, {
    attributes: true,
    attributeFilter: ['style', 'class'],
    childList: true,
    subtree: true,
  })

  window.addEventListener('resize', remeasure)
})

onBeforeUnmount(() => {
  sizes?.disconnect()
  changes?.disconnect()
  window.removeEventListener('resize', remeasure)
})
</script>

<template>
  <!--
    The feed stacks runs of entries and the month chips between them, and
    carries the hairline down the rail. A chip sits on the line rather than
    beside it: it is opaque and positioned, so it paints over the line and the
    line reads as ending at its top edge and starting again at its bottom.
  -->
  <div ref="feed" class="relative flex flex-col" :style="{ gap: `${gap}px` }">
    <div
      ref="rail"
      v-show="line.height"
      class="pointer-events-none absolute left-[13.5px] w-0 border-l border-outline-gray-1"
      :style="{ top: `${line.top}px`, height: `${line.height}px` }"
      aria-hidden="true"
    />
    <slot />
  </div>
</template>
