<script setup lang="ts">
import { Button, Tooltip } from 'frappe-ui'

// The do/don't cards need two bubbles visible at once, which a live tooltip
// can't do (hover-only, one at a time, portals to <body>). Their bubbles reuse
// TooltipBubble's exact styling shown inline. The icon-only card has no
// contrast, so it uses real, interactive Tooltips on real Buttons.
const bubble =
  'w-fit rounded-4 bg-surface-gray-10 px-2 py-1 text-xs text-ink-base shadow-xl'
const arrowDown = 'absolute -bottom-1 size-2 rotate-45 bg-surface-gray-10'

// HoverCard's panel shell (PopoverPanel), a person name that opens it, and a
// link inside it.
const card =
  'overflow-hidden rounded-6 bg-surface-elevation-2 shadow-2xl ring-1 ring-black ring-opacity-5'
const person =
  'text-base text-ink-gray-8 underline decoration-dotted underline-offset-4'
const link = 'text-sm font-medium text-ink-gray-8 underline'
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. Additional context, not essential info -->
    <Guideline
      layout="stack"
      caption="Use a tooltip for extra context. Don't hide essential information inside it."
      mark-below
    >
      <template #do>
        <div class="relative w-64 pt-16">
          <div :class="[bubble, 'absolute left-[52px] top-2 max-w-[14rem]']">
            Time left to send the first response to the customer.
            <div :class="[arrowDown, 'left-4']" />
          </div>
          <div class="rounded-3 bg-surface-gray-2 px-3 py-2">
            <div class="flex items-center gap-1 text-xs text-ink-gray-6">
              First due <span class="lucide-info size-3" />
            </div>
            <div class="text-sm font-medium text-ink-gray-8">2d 4h</div>
          </div>
        </div>
      </template>
      <template #dont>
        <div class="relative w-64 pt-11">
          <div :class="[bubble, 'absolute left-[52px] top-2']">
            2d 4h
            <div :class="[arrowDown, 'left-4']" />
          </div>
          <div class="rounded-3 bg-surface-gray-2 px-3 py-2">
            <div class="flex items-center gap-1 text-xs text-ink-gray-6">
              First due <span class="lucide-info size-3" />
            </div>
            <div class="text-sm text-ink-gray-5">
              Time left to send the first response to the customer.
            </div>
          </div>
        </div>
      </template>
    </Guideline>

    <!-- 2. Icon-only buttons need a tooltip (do-only, real interactive tips) -->
    <Guideline
      :mark="false"
      caption="Use a tooltip for icon-only buttons where nothing else labels them."
    >
      <template #do>
        <div class="flex items-start gap-16">
          <!-- text toolbar -->
          <div class="flex items-center gap-1 rounded-3 bg-surface-gray-2 p-1">
            <Tooltip text="Bold">
              <Button variant="subtle" icon="lucide-bold" label="Bold" />
            </Tooltip>
            <Tooltip text="Italic">
              <Button variant="ghost" icon="lucide-italic" label="Italic" />
            </Tooltip>
            <Tooltip text="Underline">
              <Button
                variant="ghost"
                icon="lucide-underline"
                label="Underline"
              />
            </Tooltip>
            <Tooltip text="Strikethrough">
              <Button
                variant="ghost"
                icon="lucide-strikethrough"
                label="Strikethrough"
              />
            </Tooltip>
          </div>

          <!-- icon sidebar -->
          <div
            class="flex flex-col items-center gap-1 rounded-3 bg-surface-gray-2 p-1"
          >
            <Tooltip text="Search" side="right">
              <Button variant="ghost" icon="lucide-search" label="Search" />
            </Tooltip>
            <Tooltip text="Notifications" side="right">
              <Button
                variant="ghost"
                icon="lucide-bell"
                label="Notifications"
              />
            </Tooltip>
            <Tooltip text="Tickets" side="right">
              <Button variant="subtle" icon="lucide-ticket" label="Tickets" />
            </Tooltip>
            <Tooltip text="Apps" side="right">
              <Button variant="ghost" icon="lucide-layout-grid" label="Apps" />
            </Tooltip>
            <Tooltip text="Knowledge base" side="right">
              <Button
                variant="ghost"
                icon="lucide-book-open"
                label="Knowledge base"
              />
            </Tooltip>
            <Tooltip text="Reports" side="right">
              <Button
                variant="ghost"
                icon="lucide-bar-chart-3"
                label="Reports"
              />
            </Tooltip>
            <Tooltip text="Profile" side="right">
              <Button variant="ghost" icon="lucide-user" label="Profile" />
            </Tooltip>
          </div>
        </div>
      </template>
    </Guideline>

    <!-- A tooltip closes as soon as the pointer leaves its trigger, so a link
         inside it disappears on the way there. HoverCard stays open while the
         pointer moves into it. The "do" panel uses PopoverPanel's shell. -->
    <Guideline
      caption="Don't put links or buttons in a tooltip. It closes as the pointer moves toward them; use a HoverCard."
    >
      <template #do>
        <div class="flex w-56 flex-col items-start gap-2">
          <span :class="person">Priya Shah</span>
          <div :class="[card, 'w-56 p-3']">
            <p class="text-base font-medium text-ink-gray-8">Priya Shah</p>
            <p class="text-sm text-ink-gray-5">Design lead · Mumbai</p>
            <p :class="[link, 'mt-2']">View profile</p>
          </div>
        </div>
      </template>
      <template #dont>
        <div class="flex w-56 flex-col items-start gap-2">
          <span :class="person">Priya Shah</span>
          <div :class="[bubble, 'relative']">
            Design lead ·
            <span class="underline">View profile</span>
            <div :class="[arrowDown, '-top-1 bottom-auto left-4']" />
          </div>
        </div>
      </template>
    </Guideline>
  </div>
</template>
