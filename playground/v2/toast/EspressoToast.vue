<script setup lang="ts">
// Figma: espresso-2.0 › toast (29790:191548) — four variants around
// description / action, every value read from the file:
//   shell      10px radius on surface-gray-9 (the inverted surface, so it
//              flips with the theme), the md elevation, pl 12 · pr 8, and a
//              row 8px apart; py 6 and 334 wide on its own, py 12 and 440
//              wide once it carries a description
//   line       the file's own 16px status icon · 8px · the 14/420 ink-base
//              title, with the 13/19.5 gray-3 description 2px under it
//   buttons    4px apart at the right: the action, 28px tall and px 8, its
//              label 14/500 in the on-dark link blue, then the 28px close
//              with the file's 16px close icon
import closeIcon from '../assets/toast/close.svg?raw'
import errorIcon from '../assets/toast/error.svg?raw'
import infoIcon from '../assets/toast/info.svg?raw'
import successIcon from '../assets/toast/success.svg?raw'
import warningIcon from '../assets/toast/warning.svg?raw'

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'plain'

const props = defineProps<{
  type: ToastType
  title: string
  description?: string
  action?: string
}>()

const emit = defineEmits<{ action: []; dismiss: [] }>()

const ICONS: Record<Exclude<ToastType, 'plain'>, string> = {
  success: successIcon,
  error: errorIcon,
  warning: warningIcon,
  info: infoIcon,
}
</script>

<template>
  <div
    class="espresso-toast flex items-center rounded-5 bg-surface-gray-9 py-1.5 pl-3 pr-2 shadow-md"
    :class="description ? 'w-[440px] py-3' : 'w-[334px]'"
    role="status"
    aria-live="polite"
  >
    <!-- the buttons centre against the text block, while the icon rides the
         title's line; a comment above this root would make the component a
         fragment, and the page's toast transition would stop running -->
    <div class="flex min-w-0 flex-1 items-start gap-2">
      <!-- the icon frame is 18 tall beside a description, so the glyph sits
           on the title's line -->
      <span
        v-if="type !== 'plain'"
        class="flex size-4 shrink-0 text-ink-base"
        :class="description ? 'mt-px' : ''"
        v-html="ICONS[type]"
      />
      <div class="flex min-w-0 flex-col gap-0.5">
        <p class="truncate text-base text-ink-base">{{ title }}</p>
        <!-- the file keeps this to one line, so the card stays 62 tall -->
        <p v-if="description" class="truncate text-p-sm text-ink-gray-3">
          {{ description }}
        </p>
      </div>
    </div>

    <div class="flex shrink-0 items-center gap-1">
      <button
        v-if="action"
        type="button"
        class="toast-btn h-7 rounded-4 px-2 text-base-medium"
        :style="{ color: 'var(--toast-link)' }"
        @click="emit('action')"
      >
        {{ action }}
      </button>
      <button
        type="button"
        class="toast-btn flex size-7 items-center justify-center rounded-4 text-ink-base"
        aria-label="Dismiss"
        @click="emit('dismiss')"
      >
        <span class="size-4" v-html="closeIcon" />
      </button>
    </div>
  </div>
</template>

<style>
.espresso-toast {
  /* the file's link blue, which is picked for the inverted surface rather
     than taken from the page's link token */
  --toast-link: #61afef;
}
[data-theme='dark'] .espresso-toast {
  --toast-link: #1c6ec4;
}
.espresso-toast .toast-btn {
  @apply transition-colors hover:bg-surface-gray-8;
}
.espresso-toast svg {
  width: 100%;
  height: 100%;
}
</style>
