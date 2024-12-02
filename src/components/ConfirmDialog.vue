<template>
  <Dialog v-model="showDialog" :options="{ title: __(title) }">
    <template #body-content>
      <div class="space-y-4">
        <p class="text-p-base text-gray-800" v-if="message" v-html="__(message)" />
      </div>
    </template>
    <template #actions>
      <Button class="w-full" v-bind="primaryActionProps" />
    </template>
  </Dialog>
</template>
<script>
import { __ } from '../utils/translation';
import { Button } from './Button'
import Dialog from './Dialog.vue'

export default {
  name: 'ConfirmDialog',
  props: {
    title: {
      type: String,
    },
    message: {
      type: String,
    },
    onConfirm: {
      type: Function,
      default: null,
    },
  },
  expose: ['show', 'hide'],
  components: {
    Dialog,
    Button,
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
