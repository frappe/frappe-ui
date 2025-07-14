import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aR as normalizeProps, aS as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-_mVC8ZnE.js";
import { I as ImageGroupUploadDialog } from "./ListRow-iBHyPfUw.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-Bp5RBnYZ.js";
import "./Autocomplete-B0vhEY0u.js";
import "./Popover-K4_bncpf.js";
import "./Button-CH-0mKvu.js";
import "./FeatherIcon-BlozA5Mq.js";
import "./Avatar-Dym0TfrO.js";
import "./Badge-CWJQ9oWM.js";
import "./Breadcrumbs-CWMLqKXp.js";
import "./Dropdown-BBd3kNO3.js";
import "./Combobox-fEhFxeMh.js";
import "./chevron-down-3FGTbVDY.js";
import "./DateRangePicker-Dbp8phEf.js";
import "./TextInput-B4ooh-_n.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-DONMAvFh.js";
import "./Dialog-C63IbZbu.js";
import "./ErrorMessage-CGK7Jtxm.js";
import "./FileUploader-UdlbR_gc.js";
import "./FormControl-CwOaf5Vc.js";
import "./Select-1goPVvxV.js";
import "./Textarea-DQlj6VzN.js";
import "./Progress-DERp-4E9.js";
import "./Rating-B5qS-VIe.js";
import "./Spinner-DRWOXsCA.js";
import "./Switch-BXNsNr36.js";
import "./TabButtons-BQQB_var.js";
import "./Tabs-Go9sjbrb.js";
import "./Tooltip-CWt_yOGG.js";
import "./Calendar-FkeUk4Xh.js";
import "./CircularProgressBar-CfVg-PmT.js";
import "./Tree-3YAH2gLd.js";
import "./Sidebar-3gWpVX3_.js";
import "./NumberChart-DZxUjt9V.js";
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
