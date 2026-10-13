<script setup lang="ts">
// One notification from the file's set (espresso-2.0 › notification new,
// 23884:1570), by type — all on elevation-1 under the md shadow:
//   default  the 400 × 40 bar, 10px radius, pl 12: a 16px alert glyph ·
//            6px · the 14 medium gray-800 line; on the right a 24px ghost
//            close (14px ×, pr 8), a ghost sm "Update" (pr 6), or both 4px
//            apart with a 28px close (16px ×)
//   avatar   344 wide, 12px radius, p 12. Unread: a 16px avatar · 6px · the
//            14 medium name with a blue dot on the far right, then the
//            13/19.5 gray-600 line and the 12/19 gray-500 time, 4px apart.
//            With a close or actions: a 32px avatar · 8px · name, line and
//            time 2px apart, 8px to a subtle "Join" and an outline "Decline"
//   banner   344 wide, 12px radius, p 12: glyph · 8px · title, 4px over the
//            14/21 gray-600 paragraph, 12px to "Update now" / "Later"
//   compact  272 wide, pt 14 · px 12 · pb 12: title, paragraph, 18px to two
//            md buttons — side by side, half each, or stacked 4px apart
// A close is a 24px ghost × 4px in from the top-right corner. Outline
// buttons carry no fill, as the file draws them.
import { Button } from '../../../src'
import janet from '../assets/popover/av-janet.png'

export type NotificationType = 'default' | 'avatar' | 'banner' | 'compact'

export interface NotificationSpec {
  type: NotificationType
  /** The alert glyph before the title (default, banner). */
  icon: boolean
  /** The × in the corner (default, banner, avatar). */
  close: boolean
  /** The buttons (default, banner, avatar). */
  actions: boolean
  /** Compact's two buttons one above the other. */
  stacked: boolean
}

defineProps<{ spec: NotificationSpec }>()
const emit = defineEmits<{ dismiss: [] }>()

const COPY = {
  title: 'Update available. Get new features!',
  body: 'A new update is available for the app. Update now to enjoy new features and improvements.',
  compactTitle: 'System Update Available',
  name: 'Jane Johnson',
  line: 'Your task is due tomorrow',
  time: '28 min ago',
}
</script>

<template>
  <!-- default -->
  <div
    v-if="spec.type === 'default'"
    role="status"
    data-notif="default"
    class="flex h-10 w-[400px] items-center rounded-5 bg-surface-elevation-1 pl-3 shadow-md"
    :class="spec.actions ? 'pr-1.5' : spec.close ? 'pr-2' : 'pr-3'"
  >
    <span
      v-if="spec.icon"
      class="lucide-circle-alert mr-1.5 size-4 shrink-0 text-ink-gray-8"
    />
    <span
      class="min-w-0 flex-1 truncate text-base-medium leading-4 text-ink-gray-8"
    >
      {{ COPY.title }}
    </span>
    <span v-if="spec.actions || spec.close" class="ml-2 flex shrink-0 gap-1">
      <Button
        v-if="spec.actions"
        variant="ghost"
        size="sm"
        class="!text-ink-gray-7"
        @click="emit('dismiss')"
      >
        Update
      </Button>
      <Button
        v-if="spec.close"
        variant="ghost"
        :size="spec.actions ? 'sm' : 'xs'"
        label="Dismiss"
        @click="emit('dismiss')"
      >
        <template #icon>
          <span
            class="lucide-x text-ink-gray-7"
            :class="spec.actions ? 'size-4' : 'size-3.5'"
          />
        </template>
      </Button>
    </span>
  </div>

  <!-- banner -->
  <div
    v-else-if="spec.type === 'banner'"
    role="status"
    data-notif="banner"
    class="relative flex w-[344px] flex-col gap-1 rounded-6 bg-surface-elevation-1 p-3 shadow-md"
  >
    <p class="flex items-center gap-2">
      <span
        v-if="spec.icon"
        class="lucide-circle-alert size-4 shrink-0 text-ink-gray-8"
      />
      <span
        class="min-w-0 flex-1 truncate text-base-medium leading-4 text-ink-gray-8"
      >
        {{ COPY.title }}
      </span>
    </p>
    <p class="text-p-base text-ink-gray-6">{{ COPY.body }}</p>
    <div v-if="spec.actions" class="mt-2 flex gap-1.5">
      <Button
        variant="subtle"
        size="sm"
        class="!text-ink-gray-7"
        @click="emit('dismiss')"
      >
        Update now
      </Button>
      <Button
        variant="outline"
        size="sm"
        class="!bg-transparent !text-ink-gray-7"
        @click="emit('dismiss')"
      >
        Later
      </Button>
    </div>
    <Button
      v-if="spec.close"
      variant="ghost"
      size="xs"
      label="Dismiss"
      class="absolute right-1 top-1"
      @click="emit('dismiss')"
    >
      <template #icon>
        <span class="lucide-x size-3.5 text-ink-gray-8" />
      </template>
    </Button>
  </div>

  <!-- avatar -->
  <div
    v-else-if="spec.type === 'avatar'"
    role="status"
    data-notif="avatar"
    class="relative w-[344px] rounded-6 bg-surface-elevation-1 p-3 shadow-md"
  >
    <!-- unread: the small avatar sits on the name's line -->
    <div v-if="!spec.actions && !spec.close" class="flex flex-col gap-1">
      <p class="flex items-center gap-1.5">
        <img
          :src="janet"
          alt=""
          class="size-4 shrink-0 rounded-full object-cover"
        />
        <span
          class="min-w-0 flex-1 truncate text-base-medium leading-4 text-ink-gray-8"
        >
          {{ COPY.name }}
        </span>
        <!-- icon/solid/dot-lg: a 5px dot in a 12px box -->
        <span
          class="flex size-3 shrink-0 items-center justify-center"
          aria-label="Unread"
        >
          <span class="size-[5px] rounded-full bg-[--ink-blue-7]" />
        </span>
      </p>
      <div class="flex flex-col gap-1">
        <p class="text-p-sm text-ink-gray-6">{{ COPY.line }}</p>
        <p class="text-p-xs text-ink-gray-5">{{ COPY.time }}</p>
      </div>
    </div>

    <!-- the rest: the 32px avatar beside the body -->
    <div v-else class="flex gap-2">
      <img
        :src="janet"
        alt=""
        class="size-8 shrink-0 rounded-full object-cover"
      />
      <div class="flex min-w-0 flex-1 flex-col gap-0.5">
        <p class="truncate text-base-medium leading-4 text-ink-gray-8">
          {{ COPY.name }}
        </p>
        <div class="flex flex-col gap-2">
          <div class="flex flex-col gap-0.5">
            <p class="text-p-sm text-ink-gray-6">{{ COPY.line }}</p>
            <p class="text-p-xs text-ink-gray-5">{{ COPY.time }}</p>
          </div>
          <div v-if="spec.actions" class="flex gap-1.5">
            <Button
              variant="subtle"
              size="sm"
              class="!text-ink-gray-7"
              @click="emit('dismiss')"
            >
              Join
            </Button>
            <Button
              variant="outline"
              size="sm"
              class="!bg-transparent !text-ink-gray-7"
              @click="emit('dismiss')"
            >
              Decline
            </Button>
          </div>
        </div>
      </div>
    </div>

    <Button
      v-if="spec.close"
      variant="ghost"
      size="xs"
      label="Dismiss"
      class="absolute right-1 top-1"
      @click="emit('dismiss')"
    >
      <template #icon>
        <span class="lucide-x size-3.5 text-ink-gray-8" />
      </template>
    </Button>
  </div>

  <!-- compact -->
  <div
    v-else
    role="status"
    data-notif="compact"
    class="flex w-[272px] flex-col rounded-6 bg-surface-elevation-1 px-3 pb-3 pt-3.5 shadow-md"
  >
    <p class="text-base-medium leading-4 text-ink-gray-8">
      {{ COPY.compactTitle }}
    </p>
    <p class="mt-1 text-p-base text-ink-gray-6">{{ COPY.body }}</p>
    <div
      class="mt-[18px] flex gap-1"
      :class="spec.stacked ? 'flex-col' : 'flex-row'"
    >
      <Button
        variant="subtle"
        size="md"
        class="!text-ink-gray-7"
        :class="spec.stacked ? 'w-full' : 'flex-1'"
        @click="emit('dismiss')"
      >
        Update now
      </Button>
      <Button
        variant="outline"
        size="md"
        class="!bg-transparent !text-ink-gray-7"
        :class="spec.stacked ? 'w-full' : 'flex-1'"
        @click="emit('dismiss')"
      >
        Later
      </Button>
    </div>
  </div>
</template>
