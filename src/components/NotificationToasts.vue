<template>
  <div
    class="pointer-events-none fixed inset-0 flex flex-col items-end justify-end px-4 py-6 sm:p-6"
  >
    <Notification
      class="mb-4 h-fit w-fit"
      :key="i"
      v-for="(props, i) in notifications"
      v-bind="props"
      @dismiss="hideNotification"
    />
  </div>
</template>
<script>
import { getCurrentInstance } from 'vue'
import Notification from './Notification.vue'

export default {
  name: 'NotificationToasts',
  data() {
    return {
      notifications: [],
    }
  },
  components: {
    Notification,
  },
  created() {
    const app = getCurrentInstance()
    app.appContext.config.globalProperties.$notify = this.notify
  },
  methods: {
    notify(props) {
      props.id = Math.floor(Math.random() * 1000 + Date.now())
      this.notifications.push(props)
      setTimeout(() => this.hideNotification(props.id), props.timeout || 5000)
    },
    hideNotification(id) {
      this.notifications = this.notifications.filter((props) => props.id !== id)
    },
  },
}
</script>
