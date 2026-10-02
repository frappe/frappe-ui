<script setup lang="ts">
// The espresso "modal new" card, shared by every v2 modal: a fixed 440px
// (or `width="600"` / `"720"`) card on frappe-ui's Dialog in `bare` mode (its default chrome has different
// padding, header spacing and icon badge), with the xs ghost close button
// pinned 8px from the top-right corner.
//
//   card     pt 18 · px 20 · pb 20
//   default  18px title · 16px to the body · 16px to the footer
//   dialog   18px title · 12px to the body · 16px to the footer
//   form     20px title · 20px to the body · 32px to the footer
//   list     17px title · 16px to the body · 24px to the footer
//
// closePlacement="inline" is the espresso "popup" header instead: 20px padding all
// round, and a 16px close glyph centred on the title row, 20px from the
// right edge.
import { computed } from 'vue'
import { Button, Dialog } from '../../../src'
import './modal.css'

const props = withDefaults(
  defineProps<{
    title?: string
    variant?: 'default' | 'dialog' | 'form' | 'list'
    shadow?: 'xl' | '2xl'
    closePlacement?: 'corner' | 'inline'
    width?: '440' | '600' | '720'
  }>(),
  {
    variant: 'default',
    shadow: 'xl',
    closePlacement: 'corner',
    width: '440',
  },
)

const spacing = computed(
  () =>
    ({
      default: { card: 'gap-4', content: 'gap-4', title: 'text-2xl-semibold' },
      dialog: { card: 'gap-4', content: 'gap-3', title: 'text-2xl-semibold' },
      form: { card: 'gap-8', content: 'gap-5', title: 'text-3xl-semibold' },
      list: { card: 'gap-6', content: 'gap-4', title: 'text-xl-semibold' },
    })[props.variant],
)

const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <Dialog v-model:open="open" :size="width === '440' ? 'md' : '3xl'" bare>
    <template #default="{ close }">
      <div
        class="espresso-modal relative flex flex-col px-5 pb-5"
        :class="[
          spacing.card,
          closePlacement === 'inline' ? 'pt-5' : 'pt-[18px]',
          {
            'espresso-modal--2xl': shadow === '2xl',
            'espresso-modal--600': width === '600',
            'espresso-modal--720': width === '720',
          },
        ]"
      >
        <div class="flex flex-col" :class="spacing.content">
          <!-- header cell: optional prefix, 8px gap, semibold title -->
          <div
            class="flex min-h-[21px] items-center gap-2"
            :class="{ 'pr-6': closePlacement === 'corner' }"
          >
            <slot name="prefix" />
            <slot name="title">
              <h3 class="flex-1 text-ink-gray-9" :class="spacing.title">
                {{ title }}
              </h3>
            </slot>
            <!-- 24px hit area; the glyph lands 20px from the card edge -->
            <Button
              v-if="closePlacement === 'inline'"
              class="-my-1 -mr-1 shrink-0"
              variant="ghost"
              size="xs"
              label="Close"
              @click="close"
            >
              <template #icon>
                <span class="lucide-x size-4 text-ink-gray-9" />
              </template>
            </Button>
          </div>

          <slot :close="close" />
        </div>

        <!-- right-aligned; give a left-side item `mr-auto` -->
        <div v-if="$slots.footer" class="flex items-center justify-end gap-1.5">
          <slot name="footer" :close="close" />
        </div>

        <Button
          v-if="closePlacement === 'corner'"
          class="absolute right-2 top-2"
          variant="ghost"
          size="xs"
          label="Close"
          @click="close"
        >
          <template #icon>
            <span class="lucide-x size-3.5 text-ink-gray-7" />
          </template>
        </Button>
      </div>
    </template>
  </Dialog>
</template>
