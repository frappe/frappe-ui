<script setup lang="ts">
import { Avatar, Button } from '../../../src'
import { faceFor } from '../../components/patterns/designAssets'

defineProps<{
  /** Whose activity this is — the name is set in medium, the rest is grey. */
  name: string
  /** What they did: "has reached out to you", "added a comment". */
  action: string
  /** Right-hand timestamp: "18 May", "In 2 days". */
  time: string
  /** A marker before the timestamp — the comment rows carry eye-off. */
  metaIcon?: string
}>()
</script>

<template>
  <!--
    24px of content in a 32px row, as Espresso draws it — fixed rather than
    hugged, so the 28px marker button can't push the row (and with it the
    avatar) 4px taller than the one beside it.
  -->
  <div class="flex h-8 items-center gap-4">
    <div class="flex min-w-0 flex-1 items-center gap-2">
      <Avatar size="md" :image="faceFor(name)" :label="name" />
      <p class="truncate text-base text-ink-gray-5">
        <span class="text-base-medium text-ink-gray-7">{{ name }}</span>
        {{ action }}
      </p>
    </div>

    <!-- 8px between the marker and the timestamp, as in a message header. -->
    <div class="flex shrink-0 items-center gap-2">
      <!-- Whatever the marker does, it is pressed, so it is a button. -->
      <Button
        v-if="metaIcon"
        size="sm"
        variant="ghost"
        :icon="metaIcon"
        class="!text-ink-gray-5"
      />
      <span class="text-sm text-ink-gray-5">{{ time }}</span>
    </div>
  </div>
</template>
