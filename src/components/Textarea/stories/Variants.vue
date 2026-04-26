<script setup lang="ts">
import { Textarea } from 'frappe-ui'
import type { InputVariant } from '../../../composables/inputTypes'

const variants: InputVariant[] = ['subtle', 'outline', 'ghost']
</script>

<template>
  <Textarea
    v-for="variant in variants"
    :key="variant"
    :variant="variant"
    :label="variant"
    placeholder="Write something..."
  />
</template>
