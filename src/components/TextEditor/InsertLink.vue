<template>
  <slot v-bind="{ onClick: openDialog }"></slot>
  <Dialog
    :options="{ title: 'Set Link' }"
    v-model="setLinkDialog.show"
    @after-leave="reset"
  >
    <template #body-content>
      <FormControl
        type="text"
        label="URL"
        v-model="setLinkDialog.url"
        @keydown.enter="(e) => setLink(e.target.value)"
      />
    </template>
    <template #actions>
      <Button variant="solid" @click="setLink(setLinkDialog.url)">
        Save
      </Button>
    </template>
  </Dialog>
</template>
<script>
import Dialog from '../Dialog.vue'
import Button from '../Button.vue'
import Input from '../Input.vue'

export default {
  name: 'InsertLink',
  props: ['editor'],
  components: { Button, Input, Dialog },
  data() {
    return {
      setLinkDialog: { url: '', show: false },
    }
  },
  methods: {
    openDialog() {
      let existingURL = this.editor.getAttributes('link').href
      if (existingURL) {
        this.setLinkDialog.url = existingURL
      }
      this.setLinkDialog.show = true
    },
    setLink(url) {
      // empty
      if (url === '') {
        this.editor.chain().focus().extendMarkRange('link').unsetLink().run()
      } else {
        // update link
        this.editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .setLink({ href: url })
          .run()
      }

      this.setLinkDialog.show = false
      this.setLinkDialog.url = ''
    },
    reset() {
      this.setLinkDialog = this.$options.data().setLinkDialog
    },
  },
}
</script>
