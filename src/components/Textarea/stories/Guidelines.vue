<script setup lang="ts">
import { Textarea, TextInput, Select, Button } from 'frappe-ui'

const longText =
  'Modern businesses need software that adapts to their processes instead of forcing teams to change the way they work. At Frappe, we believe that business software should be flexible, transparent, and accessible to organizations of all sizes.'
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. Not for short input -->
    <Guideline
      layout="stack"
      caption="Don't use a textarea where the expected input is short."
    >
      <template #do>
        <Textarea
          label="Bio"
          placeholder="Tell us a bit about yourself"
          class="w-80"
        />
      </template>
      <template #dont>
        <Textarea
          label="Email"
          placeholder="johndoe@example.com"
          class="w-80"
        />
      </template>
    </Guideline>

    <!-- 2. Textarea spans the full row (do-only) -->
    <Guideline
      layout="stack"
      caption="In a group of fields, let the textarea span the full row."
    >
      <template #do>
        <div class="flex w-[440px] flex-col gap-3">
          <div class="flex gap-3">
            <TextInput
              label="Name"
              placeholder="Default Policy"
              class="flex-1"
            />
            <Select
              label="Default priority"
              :options="['High', 'Medium', 'Low']"
              class="flex-1"
            />
          </div>
          <Textarea label="Description" placeholder="Describe the policy" />
        </div>
      </template>
    </Guideline>

    <!-- 3. Use an editor for formatted text -->
    <Guideline
      layout="stack"
      caption="When long-form text needs formatting, use a text editor instead."
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
