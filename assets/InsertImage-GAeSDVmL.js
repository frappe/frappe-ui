import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-BkoGa0PW.js";
import { I as ImageGroupUploadDialog } from "./ListRow-BcfzNCmQ.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-Do3dpS1R.js";
import "./Autocomplete-DD9klZxi.js";
import "./Popover-BBD9Ppkj.js";
import "./Button-BRQsvy8b.js";
import "./FeatherIcon-uTFnp7QX.js";
import "./Avatar-BD5bA-eM.js";
import "./Badge-DaoBM0pO.js";
import "./Breadcrumbs-BPQvuE1k.js";
import "./Dropdown-iLdaDs3A.js";
import "./Combobox-CfPYTOSP.js";
import "./chevron-down-CoUWYXFD.js";
import "./DateRangePicker-CpMt4W-O.js";
import "./TextInput-D07GvHR2.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-2jpp2v4E.js";
import "./Calendar-BswR34Ji.js";
import "./TabButtons-Ds1jVpkk.js";
import "./Dialog-DyJOHqpA.js";
import "./FormControl-CRzNxND7.js";
import "./Select-C0NVN7aY.js";
import "./Textarea-CjZdqUHa.js";
import "./ErrorMessage-k58T7I1J.js";
import "./FileUploader-kQWvv6Gi.js";
import "./Progress-tNXZS7xs.js";
import "./Rating-DRX5trTX.js";
import "./Password-LAEgPcSY.js";
import "./Spinner-BPA7Pjaj.js";
import "./Switch-B9eaNGyk.js";
import "./Tabs-DEeNm5s2.js";
import "./CircularProgressBar-BZ0AuPcn.js";
import "./Tree-27Ymr4k-.js";
import "./Sidebar-BflLlVpd.js";
import "./NumberChart-DwjG4M_T.js";
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
