<script setup lang="ts">
import { Badge } from 'frappe-ui'
import gameplanLogo from './gameplan.svg'
import ravenLogo from './raven.svg'

// A ring in the card color separates the count badge from the app tile.
const ring = { boxShadow: '0 0 0 2px var(--surface-base)' }

// Card 3: a task row, the same width on both sides.
const taskRow = 'flex w-[420px] items-center gap-2 text-base'
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. Notification indicators (do-only) -->
    <Guideline
      caption="Use a solid red badge to show an unread count on an icon."
    >
      <template #do>
        <div class="flex items-center gap-8">
          <div class="relative">
            <img :src="gameplanLogo" alt="Gameplan" class="size-12" />
            <Badge
              theme="red"
              variant="solid"
              size="sm"
              label="99+"
              class="absolute -right-2 -top-1.5"
              :style="ring"
            />
          </div>
          <div class="relative">
            <img :src="ravenLogo" alt="Raven" class="size-12" />
            <Badge
              theme="red"
              variant="solid"
              size="sm"
              label="2"
              class="absolute -right-1.5 -top-1.5"
              :style="ring"
            />
          </div>
        </div>
      </template>
    </Guideline>

    <!-- 2. Badges are static, not controls -->
    <Guideline
      caption="Badges are not interactive. Don't add an arrow that suggests a click; use a Button instead."
    >
      <template #do>
        <Badge theme="gray">
          <template #prefix>
            <span class="lucide-calendar" aria-hidden="true" />
          </template>
          May 16, Friday
        </Badge>
      </template>
      <template #dont>
        <Badge theme="gray">
          <template #prefix>
            <span class="lucide-calendar" aria-hidden="true" />
          </template>
          May 16, Friday
          <template #suffix>
            <span class="lucide-arrow-right" aria-hidden="true" />
          </template>
        </Badge>
      </template>
    </Guideline>

    <!-- 3. Short badge text; detail goes beside it -->
    <Guideline
      layout="stack"
      caption="Keep badge text to a word or two, like a status or a count. Put longer detail next to the badge, not in it."
    >
      <template #do>
        <div :class="taskRow">
          <span class="flex-1 truncate text-ink-gray-8"
            >Renew hosting contract</span
          >
          <Badge theme="red" label="Overdue" />
          <span class="text-sm text-ink-gray-5">3 days</span>
        </div>
      </template>
      <template #dont>
        <div :class="taskRow">
          <span class="flex-1 truncate text-ink-gray-8"
            >Renew hosting contract</span
          >
          <Badge
            theme="red"
            label="Overdue by 3 days, follow up with the customer"
          />
        </div>
      </template>
    </Guideline>
  </div>
</template>
