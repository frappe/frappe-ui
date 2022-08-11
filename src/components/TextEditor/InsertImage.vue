<template>
  <slot v-bind="{ openDialog, resetAddImage }"></slot>
  <Dialog
    :options="{ title: 'Add Image' }"
    v-model="addImageDialog.show"
    @after-leave="resetAddImage"
  >
    <template #body-content>
      <label
        class="relative py-1 bg-gray-100 rounded-lg cursor-pointer focus-within:bg-gray-200 hover:bg-gray-200"
      >
        <input
          type="file"
          class="w-full opacity-0"
          @change="onImageSelect"
          accept="image/*"
        />
        <span class="absolute inset-0 px-2 py-1 text-base select-none">
          {{ addImageDialog.file ? 'Select another image' : 'Select an image' }}
        </span>
      </label>
      <img
        v-if="addImageDialog.url"
        :src="addImageDialog.url"
        class="w-full mt-2 rounded-lg"
      />
    </template>
    <template #actions>
      <Button appearance="primary" @click="addImage(addImageDialog.url)">
        Insert Image
      </Button>
    </template>
  </Dialog>
</template>
<script>
import fileToBase64 from '../../utils/file-to-base64'
import Dialog from '../Dialog.vue'

export default {
  name: 'InsertImage',
  props: ['editor'],
  expose: ['openDialog'],
  data() {
    return {
      addImageDialog: { url: '', file: null, show: false },
    }
  },
  components: { Dialog },
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
      this.resetAddImage()
    },
    resetAddImage() {
      this.addImageDialog = { show: false, url: null, file: null }
    },
  },
}
</script>
