<template>
  <div class="inline-flex bg-white px-1 py-1">
    <div class="inline-flex items-center gap-1">
      <template v-for="button in buttons" :key="button.label">
        <div
          class="h-4 w-[2px] border-l"
          v-if="button.type === 'separator'"
        ></div>
        <div class="shrink-0" v-else-if="button.map">
          <Popover>
            <template #target="{ togglePopover }">
              <button
                class="rounded px-2 py-1 text-base font-medium text-gray-800 transition-colors hover:bg-gray-100"
                @click="togglePopover"
                :set="
                  (activeBtn =
                    button.find((b) => b.isActive(editor)) || button[0])
                "
              >
                <component
                  v-if="activeBtn.icon"
                  :is="activeBtn.icon"
                  class="h-4 w-4"
                />
                <span v-else>
                  {{ activeBtn.label }}
                </span>
              </button>
            </template>
            <template #body="{ close }">
              <ul class="rounded border bg-white p-1 shadow-md">
                <li
                  class="w-full"
                  v-for="option in button"
                  v-show="option.isDisabled ? !option.isDisabled(editor) : true"
                >
                  <button
                    class="w-full rounded px-2 py-1 text-left text-base hover:bg-gray-50"
                    @click="
                      () => {
                        onClick(option)
                        close()
                      }
                    "
                  >
                    {{ option.label }}
                  </button>
                </li>
              </ul>
            </template>
          </Popover>
        </div>
        <button
          v-else
          class="flex rounded p-1 text-gray-800 transition-colors"
          :class="button.isActive(editor) ? 'bg-gray-100' : 'hover:bg-gray-100'"
          @click="onClick(button)"
          :title="button.label"
        >
          <component v-if="button.icon" :is="button.icon" class="h-4 w-4" />
          <span class="inline-block h-4 min-w-[1rem] text-sm leading-4" v-else>
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
    <InsertImage ref="insertImage" :editor="editor" />
  </div>
</template>
<script>
import { Popover, Dialog, Input, Button } from 'frappe-ui'
import InsertImage from './InsertImage.vue'
export default {
  name: 'TipTapMenu',
  props: ['buttons'],
  inject: ['editor'],
  components: {
    Popover,
    Dialog,
    Input,
    Button,
    InsertImage,
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
      } else if (button.label === 'Image') {
        this.$refs.insertImage.openDialog()
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
