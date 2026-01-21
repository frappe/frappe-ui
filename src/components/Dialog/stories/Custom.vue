<script setup lang="ts">
import { ref } from "vue";
import { Button, Dialog } from "frappe-ui";

const open = ref(false);
</script>

<template>
  <Button @click="open = true">Show Custom Dialog</Button>

  <Dialog v-model="open">
    <template #body-title>
      <h3 class="text-2xl font-semibold text-blue-600">
        Custom Title with Styling
      </h3>
    </template>

    <template #body-content>
      <div class="space-y-4">
        <p class="text-gray-700">
          This dialog uses custom slots for flexible content layout.
        </p>
        <div class="bg-blue-50 p-4 rounded-lg">
          <p class="text-blue-800">
            You can put any content here including forms or other components.
          </p>
        </div>
      </div>
    </template>

    <template #actions="{ close }">
      <div class="flex flex-row-reverse gap-2">
        <Button variant="solid" @click="close">Save Changes</Button>
        <Button variant="outline" @click="close">Cancel</Button>
      </div>
    </template>
  </Dialog>
</template>
