import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-BvKrC49l.js";
import { I as ImageGroupUploadDialog } from "./ListRow-Bg-CxCgt.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-B3LpHMdo.js";
import "./Autocomplete-DHWzHId0.js";
import "./Popover-BbMma4wV.js";
import "./Button-B466g69z.js";
import "./FeatherIcon-DpmKgnuK.js";
import "./Avatar-AOsPzAY-.js";
import "./Badge-IxN5jfUA.js";
import "./Breadcrumbs-DDneM6cR.js";
import "./Dropdown-DGNnb6uN.js";
import "./Combobox-ZrQGdbIA.js";
import "./chevron-down-Cb8wG9A5.js";
import "./DateRangePicker-Bf4-Su1s.js";
import "./TextInput-CxN2qkoA.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-DMZOCtGw.js";
import "./Calendar-ph6I1EOQ.js";
import "./TabButtons-7tkJrJf0.js";
import "./Dialog-C5jsXFAq.js";
import "./FormControl-BumXwKNo.js";
import "./Select-C_jKFZwc.js";
import "./Textarea-D_UH6Z_I.js";
import "./ErrorMessage-DIefgYei.js";
import "./FileUploader-BqSXhiyC.js";
import "./Progress-Dgmgms8V.js";
import "./Rating-CxzzCiT-.js";
import "./Password-DNnYATm3.js";
import "./Spinner-7Jl8mF_h.js";
import "./Switch-Bgn5UW-T.js";
import "./Tabs-BQifqjBP.js";
import "./CircularProgressBar-Bc9XNJPV.js";
import "./Tree-D8ISMQJg.js";
import "./Sidebar-ClBnq7eL.js";
import "./NumberChart-BtLpBKwe.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "InsertImage",
  props: {
    editor: { type: Object, required: true }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const fileInput = useTemplateRef("fileInput");
    const showModal = ref(false);
    const selectedFiles = ref([]);
    function openFileSelector() {
      var _a;
      (_a = fileInput.value) == null ? void 0 : _a.click();
    }
    function onImageSelect(e) {
      const target = e.target;
      const files = target.files;
      if (files && files.length > 0) {
        if (files.length === 1) {
          props.editor.chain().focus().uploadImage(files[0]).run();
        } else {
          selectedFiles.value = Array.from(files);
          showModal.value = true;
        }
      }
    }
    function handleCancel() {
      showModal.value = false;
      selectedFiles.value = [];
    }
    const __returned__ = { props, fileInput, showModal, selectedFiles, openFileSelector, onImageSelect, handleCancel, ImageGroupUploadDialog };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock(
    Fragment,
    null,
    [
      renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps({ onClick: $setup.openFileSelector }))),
      createBaseVNode(
        "input",
        {
          ref: "fileInput",
          type: "file",
          class: "hidden",
          onChange: $setup.onImageSelect,
          accept: "image/*",
          multiple: ""
        },
        null,
        544
        /* NEED_HYDRATION, NEED_PATCH */
      ),
      $setup.showModal ? (openBlock(), createBlock($setup["ImageGroupUploadDialog"], {
        key: 0,
        mode: "new",
        modelValue: $setup.showModal,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.showModal = $event),
        files: $setup.selectedFiles,
        "onUpdate:files": _cache[1] || (_cache[1] = ($event) => $setup.selectedFiles = $event),
        editor: $props.editor,
        onClose: $setup.handleCancel
      }, null, 8, ["modelValue", "files", "editor"])) : createCommentVNode("v-if", true)
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
