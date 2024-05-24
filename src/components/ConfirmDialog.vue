<template>
  <Dialog v-model="showDialog" :options="{ title }">
    <template #body-content>
      <div class="space-y-4">
        <p class="text-p-base text-gray-800" v-if="message" v-html="message" />
      </div>
    </template>
    <template #actions>
      <Button class="w-full" v-bind="primaryActionProps" />
    </template>
  </Dialog>
</template>
<script>
import Dialog from './Dialog.vue'
export default {
  name: 'ConfirmDialog',
  props: ['title', 'message', 'fields', 'onConfirm'],
  expose: ['show', 'hide'],
  components: {
    Dialog,
  },
  data() {
    return {
      showDialog: true,
      isLoading: false,
    }
  },
  methods: {
    handleConfirmation() {
      try {
        this.onConfirm?.({
          hideDialog: this.hide,
        })
      } finally {
        this.isLoading = false
      }
    },
    show() {
      this.showDialog = true
    },
    hide() {
      this.showDialog = false
    },
  },
  computed: {
    primaryActionProps() {
      return {
        label: 'Confirm',
        variant: 'solid',
        loading: this.isLoading,
        onClick: this.handleConfirmation,
      }
    },
  },
}
</script>
