<script setup lang="ts">
import { Badge } from 'frappe-ui'
import gameplanLogo from './gameplan.svg'
import ravenLogo from './raven.svg'

// A ring in the card color separates the count badge from the app tile.
const ring = { boxShadow: '0 0 0 2px var(--surface-base)' }
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. Notification indicators (do-only) -->
    <Guideline caption="Use badges as notification indicators.">
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
    <Guideline caption="Badges are not interactive.">
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
  </div>
</template>
