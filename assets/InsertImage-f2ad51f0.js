import { f as fileToBase64 } from "./ListView.story-088916f1.js";
import { D as Dialog } from "./Dialog-51bfd2b8.js";
import { B as Button } from "./Button-124b7fe6.js";
import { aA as resolveComponent, aB as openBlock, aG as createElementBlock, aT as renderSlot, aU as normalizeProps, aV as guardReactiveProps, aE as createVNode, aD as withCtx, aF as createBaseVNode, aN as toDisplayString, aH as createCommentVNode, aM as createTextVNode, aK as Fragment } from "./vendor-257495bd.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-cc2b3d55.js";
import "./Avatar-a33e475b.js";
import "./Badge-f4b2e198.js";
import "./FeatherIcon-a704fda0.js";
import "./Checkbox-e26d9195.js";
import "./Autocomplete-deeee0b8.js";
import "./Popover-9c8f0d6a.js";
import "./Breadcrumbs-422140e6.js";
import "./Dropdown-a126b243.js";
import "./DateRangePicker-528e55ea.js";
import "./TextInput-bd1dffce.js";
import "./debounce-d11286cd.js";
import "./ErrorMessage-bffc3637.js";
import "./FileUploader-c715d18f.js";
import "./FormControl-786b191e.js";
import "./Select-37e28496.js";
import "./Textarea-71cfbbb0.js";
import "./Progress-dcd9e271.js";
import "./Rating-46abbb91.js";
import "./Spinner-f4e9252e.js";
import "./Switch-4b9aa1f8.js";
import "./Calendar-5a0b9d1b.js";
import "./Tabs-a4b37e21.js";
import "./Tooltip-c8eb812a.js";
import "./CircularProgressBar-e1c8c261.js";
import "./Tree-06e9c235.js";
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
