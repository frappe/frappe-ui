<script setup lang="ts">
import { ref } from 'vue'
import { Badge, Slider } from 'frappe-ui'

const val = ref([10, 50])
</script>

<template>
  <Slider v-model="val" />
  <Badge class="w-fit !rounded-sm"> {{ val.join(' - ') }}</Badge>
</template>
