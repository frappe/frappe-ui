import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-oWf7dPXM.js";
import { I as ImageGroupUploadDialog } from "./ListRow-iOE_u7tg.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-nRuqAiA2.js";
import "./Autocomplete-CI8tka24.js";
import "./Popover-C58l563T.js";
import "./Button-B4BO0GqW.js";
import "./FeatherIcon-DtHGFT18.js";
import "./Avatar-C3WaRDah.js";
import "./Badge-BOtmnlcE.js";
import "./Breadcrumbs-CYtEJ4Pa.js";
import "./Dropdown-DKTR8joo.js";
import "./Combobox-CIS_KZdS.js";
import "./chevron-down-CP3SXCLJ.js";
import "./DateRangePicker-CBdMpqFj.js";
import "./TextInput-Cm_v7-63.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-B03AuBfo.js";
import "./Calendar-Ca4RDOlg.js";
import "./TabButtons-CfpnnCXe.js";
import "./Dialog-DX7KBevn.js";
import "./FormControl-DEX__2FV.js";
import "./Select-DEUERO6F.js";
import "./Textarea-seW9jzRQ.js";
import "./ErrorMessage-CDsbBotB.js";
import "./FileUploader-DGrdQ9j-.js";
import "./Progress-_thsz-OE.js";
import "./Rating-d3v_ofXV.js";
import "./Password-BqiVk3IQ.js";
import "./Spinner-BZH5vx4V.js";
import "./Switch-DG3zk5Eo.js";
import "./Tabs-C0auVBHy.js";
import "./CircularProgressBar-CTon-ckQ.js";
import "./Tree-BeP1B44b.js";
import "./Sidebar-BpACXTPL.js";
import "./NumberChart-CiaN0nvG.js";
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
