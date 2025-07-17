import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aR as normalizeProps, aS as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-DTI2cUXC.js";
import { I as ImageGroupUploadDialog } from "./ListRow-zmSOfAks.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-Caz92UK4.js";
import "./Autocomplete-Cwtto5to.js";
import "./Popover-01C0_aXr.js";
import "./Button-Bru1r8mE.js";
import "./FeatherIcon-CRfFlZwP.js";
import "./Avatar-BAfhlHNa.js";
import "./Badge-CptLbO1z.js";
import "./Breadcrumbs-DQyNQAYg.js";
import "./Dropdown-Bx4M1ehn.js";
import "./Combobox-BC6q1iTX.js";
import "./chevron-down-Cp79Uf9F.js";
import "./DateRangePicker-DxcPPDzz.js";
import "./TextInput-BY9Ph4FE.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-DOOPV75V.js";
import "./Dialog-LzFZ5Wi_.js";
import "./ErrorMessage-Cr2CkEnM.js";
import "./FileUploader-yzZsmJmO.js";
import "./FormControl-r8WbsMut.js";
import "./Select-DJrJwYZ6.js";
import "./Textarea-yym91xyf.js";
import "./Progress-Bg8Uauu-.js";
import "./Rating-DbU2J6mP.js";
import "./Spinner-D8U-2QiC.js";
import "./Switch-B3OG408G.js";
import "./TabButtons-DIXoTkAL.js";
import "./Tabs-C7wdsGYa.js";
import "./Tooltip-d_spHgvv.js";
import "./Calendar-Bt4aeymt.js";
import "./CircularProgressBar-BiLIw-sR.js";
import "./Tree-Dz4lUo1u.js";
import "./Sidebar-CgTgOqUj.js";
import "./NumberChart-flQDs-xM.js";
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
