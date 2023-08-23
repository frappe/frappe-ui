<template>
  <slot v-bind="{ onClick: openDialog }"></slot>
  <Dialog
    :options="{ title: 'Add Video' }"
    v-model="addVideoDialog.show"
    @after-leave="reset"
  >
    <template #body-content>
      <FileUploader
        file-types="video/*"
        @success="(file) => (addVideoDialog.url = file.file_url)"
      >
        <template v-slot="{ file, progress, uploading, openFileSelector }">
          <div class="flex items-center space-x-2">
            <Button @click="openFileSelector">
              {{
                uploading
                  ? `Uploading ${progress}%`
                  : addVideoDialog.url
                  ? 'Change Video'
                  : 'Upload Video'
              }}
            </Button>
            <Button
              v-if="addVideoDialog.url"
              @click="
                () => {
                  addVideoDialog.url = null
                  addVideoDialog.file = null
                }
              "
            >
              Remove
            </Button>
          </div>
        </template>
      </FileUploader>
      <video
        v-if="addVideoDialog.url"
        :src="addVideoDialog.url"
        class="mt-2 w-full rounded-lg"
        type="video/mp4"
        controls
      />
    </template>
    <template #actions>
      <Button variant="solid" @click="addVideo(addVideoDialog.url)">
        Insert Video
      </Button>
      <Button @click="reset">Cancel</Button>
    </template>
  </Dialog>
</template>
<script>
import Button from '../Button.vue'
import Dialog from '../Dialog.vue'
import FileUploader from '../FileUploader.vue'

export default {
  name: 'InsertImage',
  props: ['editor'],
  expose: ['openDialog'],
  data() {
    return {
      addVideoDialog: { url: '', file: null, show: false },
    }
  },
  components: { Button, Dialog, FileUploader },
  methods: {
    openDialog() {
      this.addVideoDialog.show = true
    },
    onVideoSelect(e) {
      let file = e.target.files[0]
      if (!file) {
        return
      }
      this.addVideoDialog.file = file
    },

    addVideo(src) {
      this.editor
        .chain()
        .focus()
        .insertContent(`<video src="${src}"></video>`)
        .run()
      this.reset()
    },
    reset() {
      this.addVideoDialog = this.$options.data().addVideoDialog
    },
  },
}
</script>
