<script setup lang="ts">
import { Badge, Slider } from 'frappe-ui'
import { ref } from 'vue'

const val = ref([10, 50])
</script>

<template>
  <Slider v-model="val" />
  <Badge class="w-fit !rounded-sm"> {{ val.join(' - ') }}</Badge>
</template>
