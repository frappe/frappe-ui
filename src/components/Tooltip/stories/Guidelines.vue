<script setup lang="ts">
import { Button } from 'frappe-ui'

// A live tooltip is hover-only, portals to <body>, and only ever shows one
// bubble at a time, so a static do/don't can't freeze two real tooltips open
// side by side. The triggers here are real (real fields, real icon-only
// Buttons); the bubbles reuse TooltipBubble's exact styling
// (`rounded-4 bg-surface-gray-10 px-2 py-1 text-xs text-ink-base shadow-xl`)
// shown inline so the guidance is visible.
const bubble =
  'relative w-fit rounded-4 bg-surface-gray-10 px-2 py-1 text-xs text-ink-base shadow-xl'
const arrow = 'absolute size-2 rotate-45 bg-surface-gray-10'
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. Additional context, not essential info -->
    <Guideline
      caption="Use a tooltip for extra context. Don't hide essential information inside it."
    >
      <template #do>
        <div class="flex w-56 flex-col items-start gap-2">
          <div :class="[bubble, 'ml-4 max-w-[13rem]']">
            Time left to send the first response to the customer.
            <div :class="[arrow, '-bottom-1 left-4']" />
          </div>
          <div class="w-full rounded-3 bg-surface-gray-2 px-3 py-2">
            <div class="flex items-center gap-1 text-xs text-ink-gray-6">
              First due <span class="lucide-info size-3" />
            </div>
            <div class="text-sm font-medium text-ink-gray-8">2d 4h</div>
          </div>
        </div>
      </template>
      <template #dont>
        <div class="flex w-56 flex-col items-start gap-2">
          <div :class="[bubble, 'ml-4']">
            2d 4h
            <div :class="[arrow, '-bottom-1 left-4']" />
          </div>
          <div class="w-full rounded-3 bg-surface-gray-2 px-3 py-2">
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
      caption="Place the tooltip so it doesn't cover the information it describes."
    >
      <template #do>
        <div class="flex w-56 flex-col items-start gap-2">
          <div :class="[bubble, 'ml-4']">
            Remaining time to resolve the ticket.
            <div :class="[arrow, '-bottom-1 left-4']" />
          </div>
          <div class="w-full rounded-3 bg-surface-gray-2 px-3 py-2">
            <div class="flex items-center gap-1 text-xs text-ink-gray-6">
              Resolution due <span class="lucide-info size-3" />
            </div>
            <div class="text-sm font-medium text-ink-gray-8">4d 4h</div>
          </div>
        </div>
      </template>
      <template #dont>
        <div class="relative w-56">
          <div class="w-full rounded-3 bg-surface-gray-2 px-3 py-2">
            <div class="flex items-center gap-1 text-xs text-ink-gray-6">
              Resolution due <span class="lucide-info size-3" />
            </div>
            <div class="text-sm font-medium text-ink-gray-8">4d 4h</div>
          </div>
          <div :class="[bubble, 'absolute left-4 top-5']">
            Remaining time to resolve the ticket.
            <div :class="[arrow, '-bottom-1 left-4']" />
          </div>
        </div>
      </template>
    </Guideline>

    <!-- 3. Icon-only buttons need a tooltip (do-only) -->
    <Guideline
      :mark="false"
      caption="Use a tooltip for icon-only buttons where nothing else labels them."
    >
      <template #do>
        <div class="flex items-start gap-16">
          <!-- text toolbar -->
          <div class="flex flex-col items-start gap-2">
            <div :class="[bubble, 'ml-1']">
              Bold
              <div :class="[arrow, '-bottom-1 left-3']" />
            </div>
            <div class="flex items-center gap-1 rounded-3 bg-surface-gray-2 p-1">
              <Button variant="subtle" icon="lucide-bold" />
              <Button variant="ghost" icon="lucide-italic" />
              <Button variant="ghost" icon="lucide-underline" />
              <Button variant="ghost" icon="lucide-strikethrough" />
            </div>
          </div>

          <!-- icon sidebar -->
          <div class="flex items-center gap-2">
            <div class="flex flex-col items-center gap-1 rounded-3 bg-surface-gray-2 p-1">
              <Button variant="ghost" icon="lucide-search" />
              <Button variant="ghost" icon="lucide-bell" />
              <Button variant="subtle" icon="lucide-ticket" />
              <Button variant="ghost" icon="lucide-layout-grid" />
              <Button variant="ghost" icon="lucide-book-open" />
              <Button variant="ghost" icon="lucide-bar-chart-3" />
              <Button variant="ghost" icon="lucide-user" />
            </div>
            <div :class="[bubble, 'self-start mt-[140px]']">
              Knowledge base
              <div
                class="absolute -left-1 top-1/2 size-2 -translate-y-1/2 rotate-45 bg-surface-gray-10"
              />
            </div>
          </div>
        </div>
      </template>
    </Guideline>

    <!-- 4. Keep tooltip content scannable -->
    <Guideline
      layout="stack"
      caption="Keep tooltip content short and scannable, not a wall of text."
    >
      <template #do>
        <div class="flex items-center gap-2">
          <span class="flex items-center gap-1 text-sm text-ink-gray-7">
            Naming series <span class="lucide-info size-3.5 text-ink-gray-5" />
          </span>
          <div :class="bubble">
            Controls how document IDs are generated
            <div :class="[arrow, '-left-1 top-1/2 -translate-y-1/2']" />
          </div>
        </div>
      </template>
      <template #dont>
        <div class="flex items-start gap-2">
          <span class="flex items-center gap-1 pt-1 text-sm text-ink-gray-7">
            Naming series <span class="lucide-info size-3.5 text-ink-gray-5" />
          </span>
          <div :class="[bubble, 'max-w-[15rem] leading-relaxed']">
            Naming series controls how document IDs are auto-generated. You can
            set a prefix, choose whether to reset the counter yearly, and
            configure padding digits. This affects Sales Invoice, Payment Entry,
            and more.
            <div :class="[arrow, '-left-1 top-3']" />
          </div>
        </div>
      </template>
    </Guideline>
  </div>
</template>
