import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-VBjD7OBI.js";
import { I as ImageGroupUploadDialog } from "./ListRow-CiYz49Ik.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-DYbvQznx.js";
import "./Autocomplete-CnTDijLi.js";
import "./Popover-CXvsPvrs.js";
import "./Button-jmzwZM6o.js";
import "./FeatherIcon-DiTbYzJd.js";
import "./Avatar-DtkybTYh.js";
import "./Badge-yo6g8mot.js";
import "./Breadcrumbs-CvKyjQAX.js";
import "./Dropdown-IqeVW8cG.js";
import "./Combobox-DEMlt4Wr.js";
import "./chevron-down-CDViE1CM.js";
import "./DateRangePicker-D_Volnda.js";
import "./TextInput-sszvFR4B.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-DSqVA5qm.js";
import "./Calendar-BYZ4AzgJ.js";
import "./TabButtons-DPkuOAVL.js";
import "./Dialog-Bn3cTYQ2.js";
import "./FormControl-BEKHj4sN.js";
import "./Select-jb7lJRO4.js";
import "./Textarea-OoqVRHIP.js";
import "./ErrorMessage-Cn5cN64B.js";
import "./FileUploader-B15tUlhi.js";
import "./Progress-B8o4y2FR.js";
import "./Rating-Du0Vou9B.js";
import "./Password-CNzSJeE0.js";
import "./Spinner-7mmCmAeA.js";
import "./Switch-DHpdW_WL.js";
import "./Tabs-BV6p83WO.js";
import "./CircularProgressBar-BwH2z-gw.js";
import "./Tree-CUH_b1ED.js";
import "./Sidebar-CXMcC9zs.js";
import "./NumberChart-DOfwNc08.js";
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
