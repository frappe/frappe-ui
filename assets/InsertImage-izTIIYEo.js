import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aR as normalizeProps, aS as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-DoyARfCS.js";
import { I as ImageGroupUploadDialog } from "./ListRow-AjsYafAo.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-BeGSCHdI.js";
import "./Autocomplete-DRM1gt4i.js";
import "./Popover-Bh8K07wL.js";
import "./Button-Dkp9BGHU.js";
import "./FeatherIcon-CGvdFbLY.js";
import "./Avatar-ZsC6Bo9U.js";
import "./Badge-DV6UxmkP.js";
import "./Breadcrumbs-DVybRCfU.js";
import "./Dropdown-Dec_ekJS.js";
import "./Combobox-CHPIhGMf.js";
import "./chevron-down-CzvWdg0p.js";
import "./DateRangePicker-CtUQ8fdF.js";
import "./TextInput-DSFXLE4d.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-dSBWzZJZ.js";
import "./Dialog-CFpj0e1B.js";
import "./ErrorMessage-De2LfGDk.js";
import "./FileUploader-CThxdazr.js";
import "./FormControl-zfWTQWvW.js";
import "./Select-D5Kr0J3U.js";
import "./Textarea-CyF8Z526.js";
import "./Progress-CcVAuBrM.js";
import "./Rating-BTa5KIrw.js";
import "./Spinner-BA8QdyD7.js";
import "./Switch-BoYhleqk.js";
import "./TabButtons-BYysg5rx.js";
import "./Tabs-DR8FvP-g.js";
import "./Tooltip-CMM4WwQe.js";
import "./Calendar-BXvfHSNH.js";
import "./CircularProgressBar-BQaSa1F1.js";
import "./Tree-RvDfqiHM.js";
import "./Sidebar-BLRT2JYd.js";
import "./NumberChart-G4-VkwnF.js";
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
