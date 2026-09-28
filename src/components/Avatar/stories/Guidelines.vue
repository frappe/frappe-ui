<script setup lang="ts">
import { Avatar } from 'frappe-ui'

const avatarFor = (seed: string) => `https://i.pravatar.cc/80?u=${seed}`

const faces = {
  nabin: avatarFor('nabin@example.com'),
  sara: avatarFor('sara@example.com'),
  leo: avatarFor('leo@example.com'),
  mia: avatarFor('mia@example.com'),
}

// A ring in the page color cuts each stacked avatar out of the one under it.
const cutout = { boxShadow: '0 0 0 2px var(--surface-base)' }
// The "don't" side shows the mistake: a visible ring around a standalone avatar.
const standaloneRing = { boxShadow: '0 0 0 2px var(--surface-gray-3)' }
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. Consistent color per person -->
    <Guideline caption="Use the same color for a person across apps.">
      <template #do>
        <div class="flex items-center gap-10">
          <Avatar label="Nabin" theme="gray" size="2xl" />
          <Avatar label="Nabin" theme="gray" size="2xl" />
        </div>
      </template>
      <template #dont>
        <div class="flex items-center gap-10">
          <Avatar label="Nabin" theme="gray" size="2xl" />
          <Avatar label="Nabin" theme="green" size="2xl" />
        </div>
      </template>
    </Guideline>

    <!-- 2. Square for places, round for people -->
    <Guideline
      caption="Use the squared variant to represent an organisation or workspace."
    >
      <template #do>
        <div class="flex items-center gap-5">
          <Avatar :image="faces.nabin" size="2xl" />
          <Avatar label="Acme" theme="blue" shape="square" size="2xl">
            <span class="lucide-layout-grid size-full" aria-hidden="true" />
          </Avatar>
        </div>
      </template>
      <template #dont>
        <div class="flex items-center gap-5">
          <Avatar :image="faces.nabin" size="2xl" />
          <Avatar :image="faces.sara" shape="square" size="2xl" />
        </div>
      </template>
    </Guideline>

    <!-- 3. Rings belong to a stack, not a standalone avatar -->
    <Guideline caption="Don't add a ring border to a standalone avatar.">
      <template #do>
        <div class="flex -space-x-1.5">
          <Avatar :image="faces.nabin" size="2xl" :style="cutout" />
          <Avatar :image="faces.sara" size="2xl" :style="cutout" />
          <Avatar :image="faces.leo" size="2xl" :style="cutout" />
          <span
            class="grid size-10 place-items-center rounded-full bg-surface-gray-2 text-sm font-medium text-ink-gray-6"
            :style="cutout"
          >
            3
          </span>
        </div>
      </template>
      <template #dont>
        <div class="flex items-center gap-5">
          <Avatar :image="faces.nabin" size="2xl" :style="standaloneRing" />
          <Avatar :image="faces.mia" size="2xl" :style="standaloneRing" />
        </div>
      </template>
    </Guideline>
  </div>
</template>
