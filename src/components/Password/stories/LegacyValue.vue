<script setup lang="ts">
import { Password } from 'frappe-ui'
</script>

<!--
  The `value` prop is deprecated. Open the browser console to confirm the
  `[frappe-ui] Password.value is deprecated` warning fires once.
-->

<template>
  <Password
    label="Legacy field"
    value="hunter2"
    placeholder="Enter password"
  />
</template>
