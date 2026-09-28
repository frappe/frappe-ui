<script setup lang="ts">
import { Button } from 'frappe-ui'
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
          <Button variant="ghost" size="sm" icon="lucide-bold" />
          <Button variant="ghost" size="sm" icon="lucide-italic" />
          <Button variant="ghost" size="sm" icon="lucide-underline" />
          <Button variant="ghost" size="sm" icon="lucide-link" />
        </div>
      </template>
      <template #dont>
        <div class="flex items-center gap-1">
          <Button variant="ghost" size="sm" icon="lucide-bold" />
          <Button variant="ghost" size="lg" icon="lucide-italic" />
          <Button variant="ghost" size="sm" icon="lucide-underline" />
          <Button variant="ghost" size="md" icon="lucide-link" />
        </div>
      </template>
    </Guideline>
  </div>
</template>
