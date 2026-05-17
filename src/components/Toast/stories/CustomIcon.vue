<script setup lang="ts">
import { h } from 'vue'
import { Button, toast } from 'frappe-ui'

function celebrate() {
  toast.success('You unlocked a new badge', {
    icon: () => h('span', { class: 'lucide-sparkles size-4' }),
  })
}

function favorited() {
  toast('Added to favorites', {
    description: 'Find it later in your saved items.',
    icon: () => h('span', { class: 'lucide-heart size-4 text-ink-red-2' }),
  })
}

function reminder() {
  toast.message('Standup in 5 minutes', {
    icon: () => h('span', { class: 'lucide-bell size-4' }),
  })
}
</script>

<template>
  <Button label="Celebrate" @click="celebrate" />
  <Button label="Favorited" @click="favorited" />
  <Button label="Reminder" @click="reminder" />
</template>
