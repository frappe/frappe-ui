import { ay as defineComponent, bd as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aX as renderSlot, aR as normalizeProps, aS as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-D3VtcnCR.js";
import { I as ImageGroupUploadDialog } from "./ListRow-C8ho2smz.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-DiqFtxKp.js";
import "./Autocomplete-Bzt33cNj.js";
import "./Popover-0hZ6dSim.js";
import "./Button-CI_c3bGo.js";
import "./FeatherIcon-Jm44Bkzo.js";
import "./Avatar-BMgFf-or.js";
import "./Badge-Ce486HZZ.js";
import "./Breadcrumbs-fRu_GPdv.js";
import "./Dropdown-BVTQ3h17.js";
import "./Combobox-Crhh6fmu.js";
import "./DateRangePicker-RFyvV2Ys.js";
import "./TextInput-CtMyPRLx.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-D2uaGXjC.js";
import "./Dialog-BADhm_IQ.js";
import "./ErrorMessage-Dj9-MYOW.js";
import "./FileUploader-CCD-Brz1.js";
import "./FormControl-BEuM71dE.js";
import "./Select-nep5ZXAv.js";
import "./Textarea-CijCpoA9.js";
import "./Progress-DSE8kLWI.js";
import "./Rating-CPf5rHeE.js";
import "./Spinner-BXv7XsPi.js";
import "./Switch-D-zV_cMr.js";
import "./TabButtons-C4PJVrKw.js";
import "./Tabs-DrM5qsl3.js";
import "./Tooltip-S5MAmzzK.js";
import "./Calendar-Bcn94kk1.js";
import "./CircularProgressBar-B53dRkm5.js";
import "./Tree-UwMme4Gz.js";
import "./NumberChart-Ckck30bW.js";
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
