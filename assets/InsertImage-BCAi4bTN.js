import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aR as normalizeProps, aS as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-Z2iXF7DR.js";
import { I as ImageGroupUploadDialog } from "./ListRow-By6aCTtc.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-pUVGmVYM.js";
import "./Autocomplete-CiPqB498.js";
import "./Popover-DEWMjhet.js";
import "./Button-CJoryOSy.js";
import "./FeatherIcon-D-5Q7s-3.js";
import "./Avatar-R0r2lhLa.js";
import "./Badge-DgWGjQ2O.js";
import "./Breadcrumbs-D3VETkS9.js";
import "./Dropdown-Dlwq7myj.js";
import "./Combobox-CqxQ56Sp.js";
import "./chevron-down-DgM5c9bV.js";
import "./DateRangePicker-DNXc2cLY.js";
import "./TextInput-4as43bbQ.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-BNDHCue3.js";
import "./Dialog-DMelcTa-.js";
import "./ErrorMessage-CAef9FI3.js";
import "./FileUploader-DxufZOYY.js";
import "./FormControl-D0v2Ar3f.js";
import "./Select-BsshHBXr.js";
import "./Textarea-BXdqQ0m2.js";
import "./Progress-CwbChUTM.js";
import "./Rating-DEXUIPfA.js";
import "./Spinner-BWOo8GwW.js";
import "./Switch-4wpY8VO7.js";
import "./TabButtons-CHkdbZUc.js";
import "./Tabs-CtHnbhL3.js";
import "./Tooltip-BytU988m.js";
import "./Calendar-BEclLuiV.js";
import "./CircularProgressBar-PI8Gn4B0.js";
import "./Tree-DUPB3F6t.js";
import "./Sidebar-vgHURB_X.js";
import "./NumberChart-CTj8dYIe.js";
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
