import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aR as normalizeProps, aS as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-DRGq_cc5.js";
import { I as ImageGroupUploadDialog } from "./ListRow-DMJZt1_k.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-zdPUkDEm.js";
import "./Autocomplete-D5CwNtqH.js";
import "./Popover-KoWf9lhn.js";
import "./Button-By-Vqzmz.js";
import "./FeatherIcon-CVQr_P0v.js";
import "./Avatar-CUGwt1hg.js";
import "./Badge-BZC9XHGs.js";
import "./Breadcrumbs-C7BPpn2-.js";
import "./Dropdown-COqgraqZ.js";
import "./Combobox-BKN0UtuE.js";
import "./chevron-down-CF6dS6Ac.js";
import "./DateRangePicker-CrMBAEi4.js";
import "./TextInput-BLc9FqlQ.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-DXqyMHja.js";
import "./Dialog-DBZpzm--.js";
import "./ErrorMessage-VJBTOKaN.js";
import "./FileUploader-C6K8ixIf.js";
import "./FormControl-Bp4_u8-E.js";
import "./Select-CgDFeC0-.js";
import "./Textarea-tshnac48.js";
import "./Progress-CjKSde0P.js";
import "./Rating-DDXYAX6-.js";
import "./Spinner-D94GPmfL.js";
import "./Switch-uV_S5FN6.js";
import "./TabButtons-D3wfOZIb.js";
import "./Tabs-CBkD7z7a.js";
import "./Tooltip-CffnDjLQ.js";
import "./Calendar-C6WOqE7p.js";
import "./CircularProgressBar-C-KgWPqL.js";
import "./Tree-Ds89LwjR.js";
import "./Sidebar-DF2b7swA.js";
import "./NumberChart-BN1SLs-_.js";
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
