import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-DJrb6RP8.js";
import { I as ImageGroupUploadDialog } from "./ListRow-BTgFIki3.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-DorpaLA4.js";
import "./Autocomplete-BezxUkxC.js";
import "./Popover-4I8kSGaC.js";
import "./Button-B2eeczoc.js";
import "./FeatherIcon-BRHvLUxs.js";
import "./Avatar-DbFP_deI.js";
import "./Badge-DlOulkc3.js";
import "./Breadcrumbs-IsZmn5Ie.js";
import "./Dropdown-B3CqZ10t.js";
import "./Combobox-DVQlnH8i.js";
import "./chevron-down-B4pu6lcR.js";
import "./DateRangePicker-BOLJLV1v.js";
import "./TextInput-Cms1hfJU.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-Dj7J7ovn.js";
import "./Calendar-C2ggShzt.js";
import "./TabButtons-CW8K8opb.js";
import "./Dialog-CuX82-E1.js";
import "./FormControl-D_ejq3Wv.js";
import "./Select-Bg8Xlhan.js";
import "./Textarea-CNoLbViD.js";
import "./ErrorMessage-B4whuhng.js";
import "./FileUploader-DufzxVe9.js";
import "./Progress-DIy6WcMJ.js";
import "./Rating-DeITOC3p.js";
import "./Password-C67bZro4.js";
import "./Tooltip-CtkUVlur.js";
import "./Spinner-DKvNiewM.js";
import "./Switch-zuxP0vLw.js";
import "./Tabs-BLd22iw-.js";
import "./CircularProgressBar-DLZDmlkP.js";
import "./Tree-BOevZt1q.js";
import "./Sidebar-BaTyvdxy.js";
import "./NumberChart-CLqAUion.js";
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
