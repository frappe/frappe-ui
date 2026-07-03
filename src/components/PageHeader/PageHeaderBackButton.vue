<template>
  <Button
    variant="ghost"
    size="md"
    icon="lucide-chevron-left"
    :label="label"
    @click="onClick"
  />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from '../Button/Button.vue'
import type { PageHeaderBackButtonProps } from './types'

const props = withDefaults(defineProps<PageHeaderBackButtonProps>(), {
  label: 'Back',
})

const router = useRouter()

function onClick() {
  if (props.to) {
    router.push(props.to)
  } else {
    router.back()
  }
}
</script>
