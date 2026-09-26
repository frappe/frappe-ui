<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button, Rating, Textarea } from 'frappe-ui'

const rating = ref(0)
const review = ref('')
const submitted = ref(false)

const error = computed(() =>
  submitted.value && rating.value === 0
    ? 'Pick a rating to post your review.'
    : '',
)
</script>

<template>
  <form
    class="flex w-full max-w-sm flex-col gap-4"
    @submit.prevent="submitted = true"
  >
    <Rating
      v-model="rating"
      label="Overall rating"
      description="Click a selected star again to clear it."
      size="md"
      required
      :error="error"
    />
    <Textarea
      v-model="review"
      label="Your review"
      placeholder="What did you like or dislike?"
    />
    <Button variant="solid" type="submit" class="self-start">
      Post review
    </Button>
  </form>
</template>
