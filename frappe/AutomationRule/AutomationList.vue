<template>
  <div>
    <SettingsLayoutBase
      :title="'Automation'"
      :description="'Streamline your helpdesk with automations—auto-close, notify, and more.'"
    >
      <template #header-actions>
        <Button
          :label="'New'"
          theme="gray"
          variant="solid"
          @click="$emit('update:step', 'view')"
          icon-left="plus"
        />
      </template>
      <template #content>
        <template v-if="automations.data?.length > 0">
          <div
            v-for="automation in automations.data"
            @click="$emit('update:step', 'view', automation.name)"
          >
            {{ automation.name }}
          </div>
        </template>
      </template>
    </SettingsLayoutBase>
  </div>
</template>

<script setup lang="ts">
import { createListResource } from 'frappe-ui'
import SettingsLayoutBase from '../../src/components/SettingsLayoutBase.vue'

const automations = createListResource({
  doctype: 'Automation Rule',
  fields: ['name', 'enabled'],
  auto: true,
})
</script>

<style scoped></style>
