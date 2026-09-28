<script setup lang="ts">
// The Notification page: every notification type, one to a screen. The
// stage scrolls and snaps between them, and the outline on the right
// names them.
import DefaultNotifications from './DefaultNotifications.vue'
import AvatarNotifications from './AvatarNotifications.vue'
import BannerNotifications from './BannerNotifications.vue'
import CompactNotifications from './CompactNotifications.vue'
</script>

<template>
  <div class="relative h-full">
    <div class="v2-sections" data-sections>
      <section
        id="default"
        class="v2-section"
        data-section
        data-label="Default"
      >
        <DefaultNotifications />
      </section>
      <section id="avatar" class="v2-section" data-section data-label="Avatar">
        <AvatarNotifications />
      </section>
      <section id="banner" class="v2-section" data-section data-label="Banner">
        <BannerNotifications />
      </section>
      <section
        id="compact"
        class="v2-section"
        data-section
        data-label="Compact"
      >
        <CompactNotifications />
      </section>
    </div>
  </div>
</template>
