import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-CorAUDrP.js";
import { I as ImageGroupUploadDialog } from "./ListRow-D17nHIyU.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-DG4_nG70.js";
import "./useId-DJabvbK8.js";
import "./Autocomplete-CXtz43Ma.js";
import "./Popover-D-2CrUOG.js";
import "./Button-CeeGxGPN.js";
import "./FeatherIcon-CFKbKclB.js";
import "./Avatar-DbtZIjpN.js";
import "./Badge-Dp-JN7wJ.js";
import "./Breadcrumbs-BK3goGS3.js";
import "./Dropdown-2KoN2kZH.js";
import "./Switch-CMeCITA8.js";
import "./Combobox-CcPmCZjg.js";
import "./chevron-down-DMseebuM.js";
import "./DateRangePicker-CfnZa7Lh.js";
import "./TextInput-yCTl5ty5.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-BkkkPOdp.js";
import "./Calendar-BucwrAq9.js";
import "./TabButtons-yco4Djem.js";
import "./Dialog-CTaC28p3.js";
import "./FormControl-BzW4mJjx.js";
import "./Select-BPl8JWFr.js";
import "./Textarea-vY7e9_wm.js";
import "./ErrorMessage-D0kHydwI.js";
import "./FileUploader-CMhBrPrz.js";
import "./Progress-BNE78nou.js";
import "./Rating-BlIotGTD.js";
import "./Password-lPcK3OQT.js";
import "./Spinner-jwru-ZdX.js";
import "./Tabs-DRcnSYB1.js";
import "./CircularProgressBar-Bzfzsxm4.js";
import "./Tree-CCcfQg50.js";
import "./Sidebar-B7qWDCAk.js";
import "./NumberChart-D-DGKnty.js";
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
