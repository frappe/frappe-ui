<script setup lang="ts">
// Figma: espresso-2.0 › References › modal 600 (34961:139265) — "modal new".
// A read-only details list: 8 rows, 14px apart; a 160px label column
// (16px icon · 8px · label), 16px gutter, then the value.
import { Avatar, Badge, Button } from '../../../src'
import farisAnsari from '../assets/600/avatar-faris-ansari.png'
import gumroad from '../assets/600/logo-gumroad.png'
import samanthaLee from '../assets/600/avatar-samantha-lee.png'
import EspressoModal from './EspressoModal.vue'

withDefaults(defineProps<{ width?: '600' | '720' }>(), { width: '600' })

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{ listen: []; openDeal: [] }>()
</script>

<template>
  <EspressoModal v-model:open="open" :width="width" shadow="2xl">
    <template #title>
      <h3 class="text-3xl-semibold text-ink-gray-9">Call details</h3>
    </template>

    <dl class="flex flex-col gap-3.5 text-base text-ink-gray-7">
      <div class="call-row">
        <dt><span class="lucide-phone" />Call</dt>
        <dd>Incoming</dd>
      </div>

      <div class="call-row">
        <dt><span class="lucide-users" />From - to</dt>
        <dd class="gap-2">
          <Avatar size="sm" shape="circle" :image="farisAnsari" label="Faris Ansari" />
          Faris Ansari
          <span class="lucide-chevron-right size-4 text-ink-gray-7" />
          <Avatar size="sm" shape="circle" :image="samanthaLee" label="Samantha Lee" />
          Samantha Lee
        </dd>
      </div>

      <div class="call-row">
        <dt><span class="lucide-zap" />Deal</dt>
        <dd class="gap-2">
          <img :src="gumroad" alt="" class="size-5 rounded-1" />
          <button
            type="button"
            class="underline decoration-outline-gray-3 underline-offset-4 hover:decoration-ink-gray-7"
            @click="emit('openDeal')"
          >
            Gumroad
          </button>
        </dd>
      </div>

      <div class="call-row">
        <dt><span class="lucide-calendar" />Date</dt>
        <dd>Monday, 31 May</dd>
      </div>

      <div class="call-row">
        <dt><span class="lucide-clock" />Duration</dt>
        <dd>32 min</dd>
      </div>

      <div class="call-row">
        <dt><span class="lucide-shapes" />Status</dt>
        <dd>
          <Badge theme="green" variant="subtle" size="md">Completed</Badge>
        </dd>
      </div>

      <div class="call-row">
        <dt><span class="lucide-disc" />Recording</dt>
        <dd>
          <Button variant="subtle" size="xs" @click="emit('listen')">
            <template #prefix>
              <span class="lucide-play size-3.5" />
            </template>
            Listen
          </Button>
        </dd>
      </div>

      <div class="call-row call-row--top">
        <dt><span class="lucide-notebook-pen" />Note</dt>
        <dd class="text-p-base">
          Customer is interested, but has requested a call back next week.
        </dd>
      </div>
    </dl>
  </EspressoModal>
</template>

<style>
.call-row {
  @apply flex items-center gap-4;
}
.call-row--top {
  @apply items-start;
}
/* level the label with the first 21px line of a wrapped value */
.call-row--top > dt {
  @apply h-[21px];
}
.call-row > dt {
  @apply flex w-40 shrink-0 items-center gap-2;
}
.call-row > dt > span {
  @apply size-4 shrink-0 text-ink-gray-7;
}
.call-row > dd {
  @apply flex min-w-0 flex-1 items-center;
}
</style>
