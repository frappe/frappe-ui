<template>
  <div>
    <!-- Legacy `confirmDialog()` stack — back-compat. -->
    <component
      v-for="legacy in legacyDialogs"
      :is="legacy"
      :key="legacy.id ?? legacy"
    />
    <!-- v1 imperative `dialog.*` stack. -->
    <component
      v-for="d in imperativeDialogs"
      :is="d.component"
      :key="d.id"
    />
  </div>
</template>

<script setup>
import { dialogs as legacyDialogs } from '../utils/confirmDialog.js'
import { dialogs as imperativeDialogs } from '../utils/dialog'
</script>
