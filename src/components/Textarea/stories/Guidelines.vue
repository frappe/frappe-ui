<script setup lang="ts">
import { Textarea, Button } from 'frappe-ui'

const longText =
  'Modern businesses need software that adapts to their processes instead of forcing teams to change the way they work. At Frappe, we believe that business software should be flexible, transparent, and accessible to organizations of all sizes.'

// Card 1: a bio with a 160-character limit, partly written.
const LIMIT = 160
const bio = 'Product designer at Frappe. I write about forms.'
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. With a limit, show how much room is left as people type, so they
         can trim as they go instead of meeting an error at submit. Same
         pattern as the Bio example: `description` counts down. -->
    <Guideline
      layout="stack"
      caption="Show the character count before people hit a limit, not only once they pass it."
    >
      <template #do>
        <Textarea
          label="Bio"
          :model-value="bio"
          :description="`${LIMIT - bio.length} characters left`"
          class="w-80"
        />
      </template>
      <template #dont>
        <Textarea label="Bio" :model-value="bio" class="w-80" />
      </template>
    </Guideline>

    <!-- 2. Use an editor for formatted text -->
    <Guideline
      layout="stack"
      caption="When long-form text needs formatting, like bold or lists, use the Editor instead."
    >
      <template #do>
        <div
          class="w-[440px] overflow-hidden rounded-2 border border-outline-gray-2"
        >
          <div
            class="flex items-center gap-1 border-b border-outline-gray-2 p-1.5"
          >
            <Button variant="ghost" size="sm" icon="lucide-bold" label="Bold" />
            <Button
              variant="ghost"
              size="sm"
              icon="lucide-italic"
              label="Italic"
            />
            <Button
              variant="ghost"
              size="sm"
              icon="lucide-underline"
              label="Underline"
            />
            <Button variant="ghost" size="sm" icon="lucide-link" label="Link" />
            <Button
              variant="ghost"
              size="sm"
              icon="lucide-list"
              label="Bulleted list"
            />
          </div>
          <p class="p-3 text-base leading-relaxed text-ink-gray-7">
            Modern businesses need software that adapts to their processes. At
            Frappe, we believe software should be
            <strong class="font-medium text-ink-gray-8">
              flexible, transparent, and accessible
            </strong>
            to organizations of all sizes.
          </p>
        </div>
      </template>
      <template #dont>
        <Textarea :model-value="longText" class="w-[440px]" />
      </template>
    </Guideline>
  </div>
</template>
