import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-saQKRWEP.js";
import { I as ImageGroupUploadDialog } from "./ListRow--AIc0VRL.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-Bm7IiJGr.js";
import "./Autocomplete-CeAMf0RW.js";
import "./Popover-D4_eD7jx.js";
import "./Button-Bh4Sv-nP.js";
import "./FeatherIcon-CnLjlZ5a.js";
import "./Avatar-BHGkAeCV.js";
import "./Badge-C14tsOVW.js";
import "./Breadcrumbs-xQp5Qf5s.js";
import "./Dropdown-1VFBeOGw.js";
import "./Combobox-CfKI9eRL.js";
import "./chevron-down-CcZiBSaP.js";
import "./DateRangePicker-B-ndwqMz.js";
import "./TextInput-Dfj2JDk1.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-DRpav_3D.js";
import "./Calendar-CE5I_hVH.js";
import "./TabButtons-DmiUdABi.js";
import "./Dialog-DQfgI1fv.js";
import "./FormControl-CjMqN6rk.js";
import "./Select-DhoecCXt.js";
import "./Textarea-CHiF1tfN.js";
import "./ErrorMessage-BUfUsM8M.js";
import "./FileUploader-DOViPvZV.js";
import "./Progress-CNAvlI29.js";
import "./Rating-bpm0trXY.js";
import "./Password-DH5J5kGN.js";
import "./Spinner-CIqLL7lF.js";
import "./Switch-9Arn03p7.js";
import "./Tabs-xT9vpsd5.js";
import "./CircularProgressBar-BCqa4_RK.js";
import "./Tree-CvicCHZ7.js";
import "./Sidebar-D13W0QWf.js";
import "./NumberChart-BFkk0QXa.js";
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
