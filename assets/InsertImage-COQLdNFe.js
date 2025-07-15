import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aR as normalizeProps, aS as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-CFsBokBB.js";
import { I as ImageGroupUploadDialog } from "./ListRow-ClK9_kHe.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-B5qjXEDc.js";
import "./Autocomplete-DeswKONS.js";
import "./Popover-CIKoyxf3.js";
import "./Button-Di69IKzO.js";
import "./FeatherIcon-BXcQgWIT.js";
import "./Avatar-Dq7kFI-B.js";
import "./Badge-Bh-E3HiY.js";
import "./Breadcrumbs-DQBoS4aH.js";
import "./Dropdown-20PepRPS.js";
import "./Combobox-DfcU9R7W.js";
import "./chevron-down-A_5rVIt4.js";
import "./DateRangePicker-DKHvWMvR.js";
import "./TextInput-CyjqT273.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-C0VsiO0k.js";
import "./Dialog-CkdLdzgA.js";
import "./ErrorMessage-DvqBUEMx.js";
import "./FileUploader-DS25U9Ab.js";
import "./FormControl-CyVW4Heh.js";
import "./Select-D0cf8N8x.js";
import "./Textarea-BOE8AW-m.js";
import "./Progress-DKh1sj9a.js";
import "./Rating-DIwDlmwD.js";
import "./Spinner-BtJMiB50.js";
import "./Switch-C_7w3VFK.js";
import "./TabButtons-BO1kxqnh.js";
import "./Tabs-D2j1OX2Q.js";
import "./Tooltip-Dorio_cv.js";
import "./Calendar-CD_BAggb.js";
import "./CircularProgressBar-CNjNPdT_.js";
import "./Tree-D7gb-Ozr.js";
import "./Sidebar-D1JAnkNm.js";
import "./NumberChart-BMILd9Fm.js";
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
