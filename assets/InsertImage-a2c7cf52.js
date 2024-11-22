import { f as fileToBase64 } from "./ListView.story-dbd20ab6.js";
import { D as Dialog } from "./Dialog-1b1922e8.js";
import { B as Button } from "./Button-a3c2682f.js";
import { aA as resolveComponent, aB as openBlock, aG as createElementBlock, aT as renderSlot, aU as normalizeProps, aV as guardReactiveProps, aE as createVNode, aD as withCtx, aF as createBaseVNode, aN as toDisplayString, aH as createCommentVNode, aM as createTextVNode, aK as Fragment } from "./vendor-1978956c.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-cc2b3d55.js";
import "./Avatar-53f480e4.js";
import "./Badge-c953c5f0.js";
import "./FeatherIcon-759a7293.js";
import "./Checkbox-8b95ea77.js";
import "./Autocomplete-ccec1476.js";
import "./Popover-8d25ff0c.js";
import "./Breadcrumbs-53a82d21.js";
import "./Dropdown-129e6a04.js";
import "./DateRangePicker-bef3b356.js";
import "./TextInput-4d82a6ad.js";
import "./debounce-d11286cd.js";
import "./ErrorMessage-8acfd32d.js";
import "./FileUploader-a5931dfa.js";
import "./FormControl-7c682022.js";
import "./Select-ebb23dd2.js";
import "./Textarea-92fed771.js";
import "./Progress-830b4e4c.js";
import "./Rating-fd1beb8f.js";
import "./Spinner-fca1f2a9.js";
import "./Switch-9501a530.js";
import "./Calendar-3a956ca7.js";
import "./Tabs-915a8dff.js";
import "./Tooltip-ebd19e9b.js";
import "./CircularProgressBar-a26c3e49.js";
import "./Tree-8597e64d.js";
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
