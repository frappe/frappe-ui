import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aR as normalizeProps, aS as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-ChvkOL3F.js";
import { I as ImageGroupUploadDialog } from "./ListRow-D8yNFlbB.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-BxZ6l-9_.js";
import "./Autocomplete-8SpT0qxW.js";
import "./Popover-CH8U4yMV.js";
import "./Button-Cis1-AhN.js";
import "./FeatherIcon-C5cAckIq.js";
import "./Avatar-Bkqwm1Tk.js";
import "./Badge-CAIeqKoi.js";
import "./Breadcrumbs-DI7k1MmO.js";
import "./Dropdown-DY9dmCur.js";
import "./Combobox-qpmRGhTN.js";
import "./chevron-down-CdM_fIPT.js";
import "./DateRangePicker-DD31w-xg.js";
import "./TextInput-niuF_HyW.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-B_b8zi7H.js";
import "./Dialog-BH4suPnq.js";
import "./ErrorMessage-BPLKn9Ix.js";
import "./FileUploader-DEzM4el4.js";
import "./FormControl-CQL_soWP.js";
import "./Select-Bv_ww1dQ.js";
import "./Textarea-Bq0Ea5jc.js";
import "./Progress-C4F8OH8i.js";
import "./Rating-oNxKYD-N.js";
import "./Spinner-CCfbYB7N.js";
import "./Switch-CySV7FXJ.js";
import "./TabButtons-UKxkoug9.js";
import "./Tabs-B10VqCDh.js";
import "./Tooltip-rdgm1W1q.js";
import "./Calendar-BvDfR0KY.js";
import "./CircularProgressBar-ui50ELIq.js";
import "./Tree-CTmUDh3i.js";
import "./Sidebar-CysssX3g.js";
import "./NumberChart-D-agwMM-.js";
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
