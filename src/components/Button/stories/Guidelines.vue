<script setup lang="ts">
import { Button } from 'frappe-ui'

// Card 5: a small confirmation, the same width on both sides.
const confirm =
  'flex w-80 flex-col gap-3 rounded-6 border border-outline-gray-2 p-4'
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. Sentence case labels -->
    <Guideline caption="Use sentence case for button labels, not title case.">
      <template #do>
        <div class="flex flex-col items-start gap-2">
          <Button variant="solid">Buy now</Button>
          <Button variant="ghost" icon-left="lucide-pencil">Edit email</Button>
          <Button variant="ghost" icon-left="lucide-plus">
            Add billing address
          </Button>
        </div>
      </template>
      <template #dont>
        <div class="flex flex-col items-start gap-2">
          <Button variant="solid">Buy Now</Button>
          <Button variant="ghost" icon-left="lucide-pencil">Edit Email</Button>
          <Button variant="ghost" icon-left="lucide-plus">
            Add Billing Address
          </Button>
        </div>
      </template>
    </Guideline>

    <!-- 2. At most two variants in a group -->
    <Guideline
      layout="stack"
      caption="Don't mix more than two button variants in one group."
    >
      <template #do>
        <div class="flex items-center gap-1">
          <Button variant="ghost" icon-left="lucide-columns-2">Column</Button>
          <Button variant="ghost" icon-left="lucide-list-filter">Filter</Button>
          <Button variant="ghost" icon-left="lucide-arrow-up-down">Sort</Button>
          <Button variant="solid">Save</Button>
        </div>
      </template>
      <template #dont>
        <div class="flex items-center gap-1">
          <Button variant="outline" icon-left="lucide-columns-2">Column</Button>
          <Button variant="subtle" icon-left="lucide-list-filter">
            Filter
          </Button>
          <Button variant="ghost" icon-left="lucide-arrow-up-down">Sort</Button>
          <Button variant="solid">Save</Button>
        </div>
      </template>
    </Guideline>

    <!-- 3. Consistent sizes in a group -->
    <Guideline
      layout="stack"
      caption="Keep button sizes consistent within a group."
    >
      <template #do>
        <div class="flex items-center gap-1">
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
        </div>
      </template>
      <template #dont>
        <div class="flex items-center gap-1">
          <Button variant="ghost" size="sm" icon="lucide-bold" label="Bold" />
          <Button
            variant="ghost"
            size="lg"
            icon="lucide-italic"
            label="Italic"
          />
          <Button
            variant="ghost"
            size="sm"
            icon="lucide-underline"
            label="Underline"
          />
          <Button variant="ghost" size="md" icon="lucide-link" label="Link" />
        </div>
      </template>
    </Guideline>

    <!-- 4. One solid button marks the main action -->
    <Guideline
      layout="stack"
      caption="Use one solid button per group, for the main action."
    >
      <template #do>
        <div class="flex items-center gap-2">
          <Button>Cancel</Button>
          <Button>Save draft</Button>
          <Button variant="solid">Publish</Button>
        </div>
      </template>
      <template #dont>
        <div class="flex items-center gap-2">
          <Button>Cancel</Button>
          <Button variant="solid">Save draft</Button>
          <Button variant="solid">Publish</Button>
        </div>
      </template>
    </Guideline>

    <!-- 5. Say what the button does. Shown in a confirmation, where a vague
         "OK" makes people reread the question. -->
    <Guideline
      layout="stack"
      caption="Label a button with what it does, like “Delete project”, not “OK”."
    >
      <template #do>
        <div :class="confirm">
          <p class="text-p-base text-ink-gray-7">
            Delete “Website redesign”? This can't be undone.
          </p>
          <div class="flex justify-end gap-2">
            <Button>Cancel</Button>
            <Button variant="solid" theme="red">Delete project</Button>
          </div>
        </div>
      </template>
      <template #dont>
        <div :class="confirm">
          <p class="text-p-base text-ink-gray-7">
            Delete “Website redesign”? This can't be undone.
          </p>
          <div class="flex justify-end gap-2">
            <Button>Cancel</Button>
            <Button variant="solid" theme="red">OK</Button>
          </div>
        </div>
      </template>
    </Guideline>
  </div>
</template>
