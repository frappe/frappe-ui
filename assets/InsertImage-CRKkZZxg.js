import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-CH24GASl.js";
import { I as ImageGroupUploadDialog } from "./ListRow-D9P-ci8n.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-B1n-86Io.js";
import "./Autocomplete-D1dt_VTB.js";
import "./Popover-Bqe7Zdpj.js";
import "./Button-CjQ9n_TD.js";
import "./FeatherIcon-DHL8hmvE.js";
import "./Avatar-DyY13oiQ.js";
import "./Badge-PM3Vx1FM.js";
import "./Breadcrumbs-CmYBvsMp.js";
import "./Dropdown-D81Kv9nS.js";
import "./Combobox-Cx3XPcru.js";
import "./chevron-down-BeAjb5MX.js";
import "./DateRangePicker-B6LhbIYv.js";
import "./TextInput-DEqI1dlg.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-laVPM0Go.js";
import "./Calendar-CdfpVXa1.js";
import "./TabButtons-Bonkfoa2.js";
import "./Dialog-BCg64_8o.js";
import "./FormControl-BIPVPxBc.js";
import "./Select-KanSjH64.js";
import "./Textarea-BtHlZyLM.js";
import "./ErrorMessage-CFDpGpiY.js";
import "./FileUploader-HJUCS-st.js";
import "./Progress-DtDIFHx_.js";
import "./Rating-B4B1tGlP.js";
import "./Password-BZzv1dFV.js";
import "./Tooltip-aCi8D4mN.js";
import "./Spinner-B4wAQX6D.js";
import "./Switch-B9l75xod.js";
import "./Tabs-BLqe7SjO.js";
import "./CircularProgressBar-DxkjyrBN.js";
import "./Tree-BPOvmw3W.js";
import "./Sidebar-DKgD2R0e.js";
import "./NumberChart-9JNyswXL.js";
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
