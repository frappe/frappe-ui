<template>
  <!--
    ToastProvider comes first, before the slot. vue-sonner's <Toaster> is a pure
    subscriber: it calls ToastState.subscribe() and only ever sees toasts
    published *after* that call — it never seeds from ToastState.toasts. With
    the slot rendered first, anything the app tree toasts from setup() or
    onMounted() is published to zero subscribers and silently dropped.

    Rendering the Toaster ahead of the slot establishes the subscription while
    the app subtree is still being set up, so those toasts land. DOM order costs
    nothing here: the toaster is position:fixed at z-index 999999999, so it
    still paints above app content.

    <Dialogs /> needs no such treatment — it reads the `dialogs` ref at render
    time, so a dialog opened before it mounts still shows on the first render.
  -->
  <ToastProvider />
  <slot />
  <Dialogs />
</template>

<script setup lang="ts">
import Dialogs from '../Dialogs.vue'
import ToastProvider from '../Toast/ToastProvider.vue'

defineSlots<{
  /** The app. Rendered as-is; the provider adds no wrapper element of its own. */
  default?: () => any
}>()
</script>
