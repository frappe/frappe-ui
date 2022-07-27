<template>
  <div class="inline-flex px-1 py-1 bg-white">
    <div class="inline-flex items-center gap-1">
      <template v-for="button in buttons" :key="button.label">
        <div
          class="border-l w-[2px] h-4"
          v-if="button.type === 'separator'"
        ></div>
        <div v-else-if="button.map">
          <Popover>
            <template #target="{ togglePopover }">
              <button
                class="px-2 py-1 text-base font-medium text-gray-800 transition-colors rounded hover:bg-gray-100"
                @click="togglePopover"
              >
                {{
                  (button.find((b) => b.isActive(editor)) || button[0]).label
                }}
              </button>
            </template>
            <template #body="{ close }">
              <ul class="p-1 bg-white border rounded shadow-md">
                <li class="w-full" v-for="option in button">
                  <button
                    class="w-full px-2 py-1 text-base rounded hover:bg-gray-50"
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
          class="flex p-1 text-gray-800 transition-colors rounded"
          :class="button.isActive(editor) ? 'bg-gray-100' : 'hover:bg-gray-100'"
          @click="onClick(button)"
          :title="button.label"
        >
          <component v-if="button.icon" :is="button.icon" class="w-4 h-4" />
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
            {{
              addImageDialog.file ? 'Select another image' : 'Select an image'
            }}
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
  </div>
</template>
<script>
import { Popover, Dialog, Input, Button } from 'frappe-ui'
export default {
  name: 'TipTapMenu',
  props: ['editor', 'buttons'],
  components: {
    Popover,
    Dialog,
    Input,
    Button,
  },
  data() {
    return {
      setLinkDialog: { url: '', show: false },
      addImageDialog: { url: '', file: null, show: false },
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
        this.addImageDialog.show = true
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
    onImageSelect(e) {
      let file = e.target.files[0]
      if (!file) {
        return
      }
      this.addImageDialog.file = file
      let reader = new FileReader()
      reader.onloadend = () => {
        let base64string = reader.result
        this.addImageDialog.url = base64string
      }
      reader.readAsDataURL(file)
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
