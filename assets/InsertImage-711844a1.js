import { f as fileToBase64 } from "./ListView.story-e4402b8b.js";
import { D as Dialog } from "./Dialog-f43b458a.js";
import { B as Button } from "./Button-6950b235.js";
import { aA as resolveComponent, aB as openBlock, aG as createElementBlock, aT as renderSlot, aU as normalizeProps, aV as guardReactiveProps, aE as createVNode, aD as withCtx, aF as createBaseVNode, aN as toDisplayString, aH as createCommentVNode, aM as createTextVNode, aK as Fragment } from "./vendor-f890afa9.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-cc2b3d55.js";
import "./Avatar-82f9ed5f.js";
import "./Badge-6ffe610e.js";
import "./FeatherIcon-7e6369ad.js";
import "./Checkbox-1742e8c0.js";
import "./Autocomplete-b6bfd5e3.js";
import "./Popover-cad49a69.js";
import "./Breadcrumbs-0dd742ab.js";
import "./Dropdown-ea56eb5e.js";
import "./DateRangePicker-92d800c8.js";
import "./TextInput-8d5b0ad5.js";
import "./debounce-d11286cd.js";
import "./ErrorMessage-d86fbe83.js";
import "./FileUploader-8ea75a65.js";
import "./FormControl-c9536e0f.js";
import "./Select-346f227f.js";
import "./Textarea-71d2c824.js";
import "./Progress-5df87033.js";
import "./Rating-c0421f5e.js";
import "./Spinner-20634206.js";
import "./Switch-a077a937.js";
import "./TabButtons-7c6f48e4.js";
import "./Tabs-a9eb72ff.js";
import "./Tooltip-3adabe77.js";
import "./Calendar-44c89cae.js";
import "./CircularProgressBar-0cce5a42.js";
import "./Tree-72e75f8b.js";
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
const _hoisted_1 = { class: "relative cursor-pointer rounded-lg bg-surface-gray-2 py-1 focus-within:bg-surface-gray-3 hover:bg-surface-gray-3" };
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
