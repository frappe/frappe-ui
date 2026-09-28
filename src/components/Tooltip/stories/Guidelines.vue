<script setup lang="ts">
import { Button, Tooltip } from 'frappe-ui'

// Cards 1, 2 and 4 need two bubbles visible at once to contrast do vs don't,
// which a live tooltip can't do (hover-only, one at a time, portals to
// <body>). Their triggers are real fields; the bubbles reuse TooltipBubble's
// exact styling shown inline. Card 3 has no contrast, so it uses real,
// interactive Tooltips on real icon-only Buttons.
const bubble =
  'w-fit rounded-4 bg-surface-gray-10 px-2 py-1 text-xs text-ink-base shadow-xl'
const arrowDown = 'absolute -bottom-1 size-2 rotate-45 bg-surface-gray-10'
const arrowLeft =
  'absolute -left-1 size-2 rotate-45 bg-surface-gray-10'
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

    <!-- 2. Don't cover the thing you're describing -->
    <Guideline
      layout="stack"
      caption="Place the tooltip so it doesn't cover the information it describes."
      mark-below
    >
      <template #do>
        <div class="relative w-64 pt-14">
          <div :class="[bubble, 'absolute left-[86px] top-2 max-w-[14rem]']">
            Remaining time to resolve the ticket.
            <div :class="[arrowDown, 'left-4']" />
          </div>
          <div class="rounded-3 bg-surface-gray-2 px-3 py-2">
            <div class="flex items-center gap-1 text-xs text-ink-gray-6">
              Resolution due <span class="lucide-info size-3" />
            </div>
            <div class="text-sm font-medium text-ink-gray-8">4d 4h</div>
          </div>
        </div>
      </template>
      <template #dont>
        <div class="relative w-64">
          <div class="rounded-3 bg-surface-gray-2 px-3 py-2">
            <div class="flex items-center gap-1 text-xs text-ink-gray-6">
              Resolution due <span class="lucide-info size-3" />
            </div>
            <div class="text-sm font-medium text-ink-gray-8">4d 4h</div>
          </div>
          <div :class="[bubble, 'absolute left-[86px] top-[26px] max-w-[14rem]']">
            Remaining time to resolve the ticket.
            <div :class="[arrowDown, 'left-4']" />
          </div>
        </div>
      </template>
    </Guideline>

    <!-- 3. Icon-only buttons need a tooltip (do-only, real interactive tips) -->
    <Guideline
      :mark="false"
      caption="Use a tooltip for icon-only buttons where nothing else labels them."
    >
      <template #do>
        <div class="flex items-start gap-16">
          <!-- text toolbar -->
          <div class="flex items-center gap-1 rounded-3 bg-surface-gray-2 p-1">
            <Tooltip text="Bold">
              <Button variant="subtle" icon="lucide-bold" />
            </Tooltip>
            <Tooltip text="Italic">
              <Button variant="ghost" icon="lucide-italic" />
            </Tooltip>
            <Tooltip text="Underline">
              <Button variant="ghost" icon="lucide-underline" />
            </Tooltip>
            <Tooltip text="Strikethrough">
              <Button variant="ghost" icon="lucide-strikethrough" />
            </Tooltip>
          </div>

          <!-- icon sidebar -->
          <div class="flex flex-col items-center gap-1 rounded-3 bg-surface-gray-2 p-1">
            <Tooltip text="Search" side="right">
              <Button variant="ghost" icon="lucide-search" />
            </Tooltip>
            <Tooltip text="Notifications" side="right">
              <Button variant="ghost" icon="lucide-bell" />
            </Tooltip>
            <Tooltip text="Tickets" side="right">
              <Button variant="subtle" icon="lucide-ticket" />
            </Tooltip>
            <Tooltip text="Apps" side="right">
              <Button variant="ghost" icon="lucide-layout-grid" />
            </Tooltip>
            <Tooltip text="Knowledge base" side="right">
              <Button variant="ghost" icon="lucide-book-open" />
            </Tooltip>
            <Tooltip text="Reports" side="right">
              <Button variant="ghost" icon="lucide-bar-chart-3" />
            </Tooltip>
            <Tooltip text="Profile" side="right">
              <Button variant="ghost" icon="lucide-user" />
            </Tooltip>
          </div>
        </div>
      </template>
    </Guideline>

    <!-- 4. Keep tooltip content scannable -->
    <Guideline
      layout="stack"
      caption="Keep tooltip content short and scannable, not a wall of text."
      mark-below
    >
      <template #do>
        <div class="flex items-center">
          <span class="flex items-center gap-1 text-sm text-ink-gray-7">
            Naming series <span class="lucide-info size-3.5 text-ink-gray-5" />
          </span>
          <div :class="[bubble, 'relative ml-2']">
            Controls how document IDs are generated
            <div :class="[arrowLeft, 'top-1/2 -translate-y-1/2']" />
          </div>
        </div>
      </template>
      <template #dont>
        <div class="flex items-start">
          <span class="flex items-center gap-1 text-sm text-ink-gray-7">
            Naming series <span class="lucide-info size-3.5 text-ink-gray-5" />
          </span>
          <div :class="[bubble, 'relative ml-2 max-w-[16rem] leading-relaxed']">
            Naming series controls how document IDs are auto-generated. You can
            set a prefix, choose whether to reset the counter yearly, and
            configure padding digits. This affects Sales Invoice, Payment Entry,
            and more.
            <div :class="[arrowLeft, 'top-2.5']" />
          </div>
        </div>
      </template>
    </Guideline>
  </div>
</template>
