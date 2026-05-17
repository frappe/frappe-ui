<script setup lang="ts">
import { h } from 'vue'
import { Button, toast } from 'frappe-ui'
import LucideSparkles from '~icons/lucide/sparkles'
import LucideHeart from '~icons/lucide/heart'
import LucideBell from '~icons/lucide/bell'

function celebrate() {
  toast.success('You unlocked a new badge', {
    icon: h(LucideSparkles),
  })
}

function favorited() {
  toast('Added to favorites', {
    description: 'Find it later in your saved items.',
    icon: h(LucideHeart, { class: 'text-ink-red-2' }),
  })
}

function reminder() {
  toast.message('Standup in 5 minutes', {
    icon: h(LucideBell),
  })
}
</script>

<template>
  <Button label="Celebrate" @click="celebrate" />
  <Button label="Favorited" @click="favorited" />
  <Button label="Reminder" @click="reminder" />
</template>
