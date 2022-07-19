<template>
  <div class="inline-flex px-1 py-1 bg-white">
    <div class="inline-flex items-center gap-1">
      <template v-for="button in buttons" :key="button.label">
        <div
          class="border-l w-[2px] h-4"
          v-if="button.type === 'separator'"
        ></div>
        <button
          v-else
          class="flex p-1 text-gray-800 transition-colors rounded"
          :class="button.isActive(editor) ? 'bg-gray-100' : 'hover:bg-gray-100'"
          @click="onClick(button)"
          :title="button.label"
        >
          <FeatherIcon v-if="button.icon" :name="button.icon" class="w-4" />
          <span class="inline-block h-4 text-sm leading-4 min-w-[1rem]" v-else>
            {{ button.text }}
          </span>
        </button>
      </template>
    </div>

    <Dialog :options="{ title: 'Set Link' }" v-model="setLinkDialog.show">
      <template #body-content>
        <Input
          type="text"
          label="URL"
          v-model="setLinkDialog.url"
          @keydown.enter="(e) => setLink(e.target.value)"
        />
      </template>
      <template #actions>
        <Button appearance="primary" @click="setLink(setLinkDialog.url)">
          Save
        </Button>
      </template>
    </Dialog>
  </div>
</template>
<script>
import { FeatherIcon, Dialog, Input, Button } from 'frappe-ui'
export default {
  name: 'TipTapMenu',
  props: ['editor', 'buttons'],
  components: {
    FeatherIcon,
    Dialog,
    Input,
    Button
  },
  data() {
    return {
      setLinkDialog: { url: '', show: false },
    }
  },
  methods: {
    onClick(button) {
      if (button.label === 'Link') {
        this.setLinkDialog.show = true
        let existingURL = this.editor.getAttributes('link').href
        if (existingURL) {
          this.setLinkDialog.url = existingURL
        }
      } else {
        button.action(this.editor)
      }
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
  },
}
</script>
