<script setup lang="ts">
import { Tooltip } from 'frappe-ui'

// A live tooltip shows on hover, one at a time, and portals to <body>, so it
// can't hold a do/don't pair open side by side. The open bubbles here reuse
// TooltipBubble's exact classes inline. Every other trigger on the cards has
// a real Tooltip, so hovering them works as in an app.
const bubble =
  'w-max rounded-4 bg-surface-gray-10 px-2 py-1 text-xs text-ink-base shadow-xl'
const arrowDown = 'absolute -bottom-1 size-2 rotate-45 bg-surface-gray-10'
// Points left, for a bubble to the right of its trigger.
const arrowLeft =
  'absolute -left-1 top-1/2 size-2 -translate-y-1/2 rotate-45 bg-surface-gray-10'

// Card 1: an SLA figure. The value is what people come for, so it's on the
// card; the tooltip explains it. Both cards are the same height, so they
// line up side by side.
const slaCard =
  'flex h-18 flex-col justify-center rounded-5 bg-surface-gray-2 px-3 py-2'
// A bubble centered above the info icon, with the arrow in the middle, as
// Tooltip places it: it takes a side but no alignment, so it always centers
// on its trigger.
const tipAboveIcon = 'absolute bottom-full left-1/2 mb-3 block -translate-x-1/2'
const arrowCentered = 'left-1/2 -translate-x-1/2'
const slaLabel = 'flex items-center gap-1 text-sm text-ink-gray-6'
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. The figure stays on the card; the tooltip explains it. Each
         bubble is anchored to the info icon, so its arrow points at it. Both
         cards keep the same space above them, so they line up. -->
    <Guideline
      caption="Use a tooltip for extra context. Don't hide essential information inside it."
    >
      <template #do>
        <div class="pt-16">
          <div :class="[slaCard, 'w-36']">
            <div :class="slaLabel">
              First due
              <span class="relative inline-flex">
                <span class="lucide-info size-3" aria-hidden="true" />
                <span
                  :class="[bubble, tipAboveIcon, 'max-w-52 whitespace-normal']"
                >
                  Time left to send the first response to the customer.
                  <span :class="[arrowDown, arrowCentered]" />
                </span>
              </span>
            </div>
            <div class="text-base font-medium text-ink-green-7">2d 4h</div>
          </div>
        </div>
      </template>
      <template #dont>
        <div class="pt-16">
          <div :class="[slaCard, 'w-60']">
            <div :class="slaLabel">
              First due
              <span class="relative inline-flex">
                <span class="lucide-info size-3" aria-hidden="true" />
                <span :class="[bubble, tipAboveIcon]">
                  2d 4h
                  <span :class="[arrowDown, arrowCentered]" />
                </span>
              </span>
            </div>
            <div class="text-sm text-ink-gray-5">
              Time left to send the first response to the customer.
            </div>
          </div>
        </div>
      </template>
    </Guideline>

    <!-- 2. A tooltip is read in passing. One line people take in at a glance;
         a paragraph they have to stop and read. -->
    <Guideline
      layout="stack"
      caption="Keep tooltip text short, so it's easy to scan."
    >
      <template #do>
        <div class="flex items-center gap-2">
          <span class="text-base text-ink-gray-7">Naming series</span>
          <Tooltip text="Controls how document IDs are generated">
            <button
              type="button"
              class="lucide-info size-4 text-ink-gray-6"
              aria-label="About naming series"
            />
          </Tooltip>
          <div :class="[bubble, 'relative ml-2']">
            Controls how document IDs are generated
            <div :class="arrowLeft" />
          </div>
        </div>
      </template>
      <template #dont>
        <div class="flex items-center gap-2">
          <span class="text-base text-ink-gray-7">Naming series</span>
          <span class="lucide-info size-4 text-ink-gray-6" aria-hidden="true" />
          <div :class="[bubble, 'relative ml-2 max-w-64']">
            Naming series controls how document IDs are auto-generated. You can
            set a prefix, choose whether to reset the counter yearly, and
            configure padding digits. This affects Sales Invoice, Purchase Order
            and every other document that uses it.
            <div :class="arrowLeft" />
          </div>
        </div>
      </template>
    </Guideline>
  </div>
</template>
