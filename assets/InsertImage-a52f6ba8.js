import { f as fileToBase64 } from "./ListView.story-c9673ea5.js";
import { D as Dialog } from "./Dialog-c7e20514.js";
import { B as Button } from "./Button-d0fdb012.js";
import { aA as resolveComponent, aB as openBlock, aG as createElementBlock, aT as renderSlot, aU as normalizeProps, aV as guardReactiveProps, aE as createVNode, aD as withCtx, aF as createBaseVNode, aN as toDisplayString, aH as createCommentVNode, aM as createTextVNode, aK as Fragment } from "./vendor-f3e53e4e.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-cc2b3d55.js";
import "./Avatar-89195955.js";
import "./Badge-4b2bc3ba.js";
import "./FeatherIcon-f9587a25.js";
import "./Checkbox-d7b21628.js";
import "./Autocomplete-a9f16802.js";
import "./Popover-db9b30d1.js";
import "./Breadcrumbs-66152922.js";
import "./Dropdown-acf4921d.js";
import "./DateRangePicker-f48624f8.js";
import "./TextInput-37021456.js";
import "./debounce-d11286cd.js";
import "./ErrorMessage-10a5a4be.js";
import "./FileUploader-95114e4b.js";
import "./FormControl-036f7829.js";
import "./Select-4013c5c8.js";
import "./Textarea-566ef7e5.js";
import "./Progress-a15d9909.js";
import "./Rating-9d171913.js";
import "./Spinner-4388cfba.js";
import "./Switch-a4d75cf1.js";
import "./Calendar-a2fa9644.js";
import "./Tabs-6260d82d.js";
import "./Tooltip-aa7d457d.js";
import "./CircularProgressBar-52dc9bca.js";
import "./Tree-fe23dbdc.js";
const _sfc_main = {
  name: "InsertImage",
  props: ["editor"],
  expose: ["openDialog"],
  data() {
    return {
      addImageDialog: { url: "", file: null, show: false }
    };
  },
  components: { Button, Dialog },
  methods: {
    openDialog() {
      this.addImageDialog.show = true;
    },
    onImageSelect(e) {
      let file = e.target.files[0];
      if (!file) {
        return;
      }
      this.addImageDialog.file = file;
      fileToBase64(file).then((base64) => {
        this.addImageDialog.url = base64;
      });
    },
    addImage(src) {
      this.editor.chain().focus().setImage({ src }).run();
      this.reset();
    },
    reset() {
      this.addImageDialog = this.$options.data().addImageDialog;
    }
  }
};
const _hoisted_1 = { class: "relative cursor-pointer rounded-lg bg-gray-100 py-1 focus-within:bg-gray-200 hover:bg-gray-200" };
const _hoisted_2 = { class: "absolute inset-0 select-none px-2 py-1 text-base" };
const _hoisted_3 = ["src"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Button = resolveComponent("Button");
  const _component_Dialog = resolveComponent("Dialog");
  return openBlock(), createElementBlock(
    Fragment,
    null,
    [
      renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps({ onClick: $options.openDialog }))),
      createVNode(_component_Dialog, {
        options: { title: "Add Image" },
        modelValue: $data.addImageDialog.show,
        "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.addImageDialog.show = $event),
        onAfterLeave: $options.reset
      }, {
        "body-content": withCtx(() => [
          createBaseVNode("label", _hoisted_1, [
            createBaseVNode(
              "input",
              {
                type: "file",
                class: "w-full opacity-0",
                onChange: _cache[0] || (_cache[0] = (...args) => $options.onImageSelect && $options.onImageSelect(...args)),
                accept: "image/*"
              },
              null,
              32
              /* NEED_HYDRATION */
            ),
            createBaseVNode(
              "span",
              _hoisted_2,
              toDisplayString($data.addImageDialog.file ? "Select another image" : "Select an image"),
              1
              /* TEXT */
            )
          ]),
          $data.addImageDialog.url ? (openBlock(), createElementBlock("img", {
            key: 0,
            src: $data.addImageDialog.url,
            class: "mt-2 w-full rounded-lg"
          }, null, 8, _hoisted_3)) : createCommentVNode("v-if", true)
        ]),
        actions: withCtx(() => [
          createVNode(_component_Button, {
            variant: "solid",
            onClick: _cache[1] || (_cache[1] = ($event) => $options.addImage($data.addImageDialog.url))
          }, {
            default: withCtx(() => _cache[3] || (_cache[3] = [
              createTextVNode(" Insert Image ")
            ])),
            _: 1
            /* STABLE */
          }),
          createVNode(_component_Button, { onClick: $options.reset }, {
            default: withCtx(() => _cache[4] || (_cache[4] = [
              createTextVNode(" Cancel ")
            ])),
            _: 1
            /* STABLE */
          }, 8, ["onClick"])
        ]),
        _: 1
        /* STABLE */
      }, 8, ["modelValue", "onAfterLeave"])
    ],
    64
    /* STABLE_FRAGMENT */
  );
}
_sfc_main.__file = "src/components/TextEditor/InsertImage.vue";
const InsertImage = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/InsertImage.vue"]]);
export {
  InsertImage as default
};