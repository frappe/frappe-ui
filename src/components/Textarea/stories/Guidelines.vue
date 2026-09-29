<script setup lang="ts">
import { computed, ref } from 'vue'
import { Textarea, Button } from 'frappe-ui'

const longText =
  'Modern businesses need software that adapts to their processes instead of forcing teams to change the way they work. At Frappe, we believe that business software should be flexible, transparent, and accessible to organizations of all sizes.'

// Card 1 is live: a bio with a 160-character limit, partly written. Type past
// the limit on both sides. "Do" counts down as you go; "don't" says nothing
// until you're already over.
const LIMIT = 160
const start = 'Product designer at Frappe. I write about forms.'
const tooLong = (n: number) =>
  n > LIMIT ? `Keep it under ${LIMIT} characters.` : ''

const counted = ref(start)
const countedLeft = computed(() => LIMIT - counted.value.length)

const silent = ref(start)
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. With a limit, show how much room is left as people type, so they
         can trim as they go instead of meeting an error at submit. Same
         pattern as the Bio example: `description` counts down, and `error`
         takes its place past the limit. -->
    <Guideline
      layout="stack"
      caption="Show the character count before people hit a limit, not only once they pass it."
    >
      <template #do>
        <Textarea
          v-model="counted"
          label="Bio"
          :description="`${countedLeft} characters left`"
          :error="tooLong(counted.length)"
          class="w-80"
        />
      </template>
      <template #dont>
        <Textarea
          v-model="silent"
          label="Bio"
          :error="tooLong(silent.length)"
          class="w-80"
        />
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
