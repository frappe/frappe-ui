<script setup lang="ts">
import { ref } from 'vue'
import Dialog from './Dialog.vue'
import Button from './Button.vue'

const dialog1 = ref(false)
const dialog2 = ref(false)
</script>
<template>
  <Story :layout="{ width: 500, type: 'grid' }">
    <Variant title="With options" autoPropsDisabled>
      <Button @click="dialog1 = true">Show Dialog</Button>
      <Dialog
        :options="{
          title: 'Confirm',
          message: 'Are you sure you want to confirm this action?',
          size: 'xl',
          actions: [{ label: 'Confirm', variant: 'solid', onClick: () => {} }],
        }"
        v-model="dialog1"
      />
    </Variant>
    <Variant title="With slots" autoPropsDisabled>
      <Button @click="dialog2 = true">Show Dialog</Button>
      <Dialog v-model="dialog2">
        <template #body-title>
          <h3>Custom Title</h3>
        </template>
        <template #body-content>
          <p>Custom Body</p>
        </template>
        <template #actions>
          <Button variant="solid">Confirm</Button>
          <Button class="ml-2" @click="dialog2 = false">Close</Button>
        </template>
      </Dialog>
    </Variant>
  </Story>
</template>
