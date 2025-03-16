import { B as Button } from "./Button-BIboGoWd.js";
import { D as Dialog } from "./Dialog-DNSaEwoj.js";
import { F as FileUploader } from "./FileUploader-YI_eSr5I.js";
import { aA as resolveComponent, aB as openBlock, aG as createElementBlock, bu as renderSlot, aR as normalizeProps, aS as guardReactiveProps, aE as createVNode, aD as withCtx, aF as createBaseVNode, aM as createTextVNode, aN as toDisplayString, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-hLddBkcs.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./FeatherIcon-xeCFVtpR.js";
const _sfc_main = {
  name: "InsertImage",
  props: ["editor"],
  expose: ["openDialog"],
  data() {
    return {
      addVideoDialog: { url: "", file: null, show: false }
    };
  },
  components: { Button, Dialog, FileUploader },
  methods: {
    openDialog() {
      this.addVideoDialog.show = true;
    },
    onVideoSelect(e) {
      let file = e.target.files[0];
      if (!file) {
        return;
      }
      this.addVideoDialog.file = file;
    },
    addVideo(src) {
      if (!src) return;
      this.editor.chain().focus().insertContent(`<video src="${src}"></video>`).run();
      this.reset();
    },
    reset() {
      this.addVideoDialog = this.$options.data().addVideoDialog;
    }
  }
};
const _hoisted_1 = { class: "flex items-center space-x-2" };
const _hoisted_2 = ["src"];
const _hoisted_3 = { class: "flex gap-2" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Button = resolveComponent("Button");
  const _component_FileUploader = resolveComponent("FileUploader");
  const _component_Dialog = resolveComponent("Dialog");
  return openBlock(), createElementBlock(
    Fragment,
    null,
    [
      renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps({ onClick: $options.openDialog }))),
      createVNode(_component_Dialog, {
        options: { title: "Add Video" },
        modelValue: $data.addVideoDialog.show,
        "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.addVideoDialog.show = $event),
        onAfterLeave: $options.reset
      }, {
        "body-content": withCtx(() => [
          createVNode(_component_FileUploader, {
            "file-types": "video/*",
            onSuccess: _cache[0] || (_cache[0] = (file) => $data.addVideoDialog.url = file.file_url)
          }, {
            default: withCtx(({ file, progress, uploading, openFileSelector }) => [
              createBaseVNode("div", _hoisted_1, [
                createVNode(_component_Button, { onClick: openFileSelector }, {
                  default: withCtx(() => [
                    createTextVNode(
                      toDisplayString(uploading ? `Uploading ${progress}%` : $data.addVideoDialog.url ? "Change Video" : "Upload Video"),
                      1
                      /* TEXT */
                    )
                  ]),
                  _: 2
                  /* DYNAMIC */
                }, 1032, ["onClick"]),
                $data.addVideoDialog.url ? (openBlock(), createBlock(_component_Button, {
                  key: 0,
                  onClick: () => {
                    $data.addVideoDialog.url = null;
                    $data.addVideoDialog.file = null;
                  }
                }, {
                  default: withCtx(() => _cache[3] || (_cache[3] = [
                    createTextVNode(" Remove ")
                  ])),
                  _: 2
                  /* DYNAMIC */
                }, 1032, ["onClick"])) : createCommentVNode("v-if", true)
              ])
            ]),
            _: 1
            /* STABLE */
          }),
          $data.addVideoDialog.url ? (openBlock(), createElementBlock("video", {
            key: 0,
            src: $data.addVideoDialog.url,
            class: "mt-2 w-full rounded-lg",
            type: "video/mp4",
            controls: ""
          }, null, 8, _hoisted_2)) : createCommentVNode("v-if", true)
        ]),
        actions: withCtx(() => [
          createBaseVNode("div", _hoisted_3, [
            createVNode(_component_Button, {
              variant: "solid",
              onClick: _cache[1] || (_cache[1] = ($event) => $options.addVideo($data.addVideoDialog.url))
            }, {
              default: withCtx(() => _cache[4] || (_cache[4] = [
                createTextVNode(" Insert Video ")
              ])),
              _: 1
              /* STABLE */
            }),
            createVNode(_component_Button, { onClick: $options.reset }, {
              default: withCtx(() => _cache[5] || (_cache[5] = [
                createTextVNode("Cancel")
              ])),
              _: 1
              /* STABLE */
            }, 8, ["onClick"])
          ])
        ]),
        _: 1
        /* STABLE */
      }, 8, ["modelValue", "onAfterLeave"])
    ],
    64
    /* STABLE_FRAGMENT */
  );
}
_sfc_main.__file = "src/components/TextEditor/InsertVideo.vue";
const InsertVideo = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/InsertVideo.vue"]]);
export {
  InsertVideo as default
};
