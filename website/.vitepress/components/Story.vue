<script setup lang="ts">
import { useSlots, computed } from 'vue'

const slots = useSlots()

  const defaultSlot = slots.default?.()

console.log(defaultSlot[0].props)

</script>

<template>
  <div class='mt-5 grid gap-5 border p-4'>
    <slot></slot>
    <section>
      <input type='text' placeholder='fill' />
      
      <div class="mt-4">
        <h4>Passed Props:</h4>
				{{ defaultSlot[0]?.type?.props }}
      </div>
    </section>
  </div>
</template>
