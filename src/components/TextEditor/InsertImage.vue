<template>
  <slot v-bind="{ onClick: openDialog }"></slot>
  <Dialog
    :options="{ title: 'Add Image' }"
    v-model="addImageDialog.show"
    @after-leave="reset"
  >
    <template #body-content>
      <label
        class="relative cursor-pointer rounded-lg bg-gray-100 py-1 focus-within:bg-gray-200 hover:bg-gray-200"
      >
        <input
          type="file"
          class="w-full opacity-0"
          @change="onImageSelect"
          accept="image/*"
        />
        <span class="absolute inset-0 select-none px-2 py-1 text-base">
          {{ addImageDialog.file ? 'Select another image' : 'Select an image' }}
        </span>
      </label>
      <img
        v-if="addImageDialog.url"
        :src="addImageDialog.url"
        class="mt-2 w-full rounded-lg"
      />
    </template>
    <template #actions>
      <Button variant="solid" @click="addImage(addImageDialog.url)">
        Insert Image
      </Button>
      <Button @click="reset"> Cancel </Button>
    </template>
  </Dialog>
</template>
<script>
import fileToBase64 from '../../utils/file-to-base64'
import Dialog from '../Dialog.vue'
import Button from '../Button.vue'

export default {
  name: 'InsertImage',
  props: ['editor'],
  expose: ['openDialog'],
  data() {
    return {
      addImageDialog: { url: '', file: null, show: false },
    }
  },
  components: { Button, Dialog },
  methods: {
    openDialog() {
      this.addImageDialog.show = true
    },
    onImageSelect(e) {
      let file = e.target.files[0]
      if (!file) {
        return
      }
      this.addImageDialog.file = file
      fileToBase64(file).then((base64) => {
        this.addImageDialog.url = base64
      })
    },
    addImage(src) {
      this.editor.chain().focus().setImage({ src }).run()
      this.reset()
    },
    reset() {
      this.addImageDialog = this.$options.data().addImageDialog
    },
  },
}
</script>
