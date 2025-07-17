import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aR as normalizeProps, aS as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-BP1AGND6.js";
import { I as ImageGroupUploadDialog } from "./ListRow-CXNgwgoh.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-D4r0RsLI.js";
import "./Autocomplete-DyS_Dh_p.js";
import "./Popover-9KC61xfK.js";
import "./Button-zBOSESzj.js";
import "./FeatherIcon-BzgW0hzY.js";
import "./Avatar-DukUQzke.js";
import "./Badge-CFBfesB1.js";
import "./Breadcrumbs-DePh-HLm.js";
import "./Dropdown-Bw330oE4.js";
import "./Combobox-C6MY5Y4F.js";
import "./chevron-down-CC-E8qo0.js";
import "./DateRangePicker-kq_SXwtT.js";
import "./TextInput-CmbGdYYw.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-CFHY1ZhP.js";
import "./Dialog-BuPj01EH.js";
import "./ErrorMessage-OwkvjpmT.js";
import "./FileUploader-B1FONIps.js";
import "./FormControl-CirdNY3a.js";
import "./Select-Bl5pqpM3.js";
import "./Textarea-NlPXJbhn.js";
import "./Progress-Cd58gfGs.js";
import "./Rating-B5fnLX7K.js";
import "./Spinner-DmyDjxvD.js";
import "./Switch-B5uCECxE.js";
import "./TabButtons-BpqGjBNz.js";
import "./Tabs-DigVuA9X.js";
import "./Tooltip-BTOyiEE4.js";
import "./Calendar-BHIi-OIE.js";
import "./CircularProgressBar-Bl7B9mxw.js";
import "./Tree-D1maZ25W.js";
import "./Sidebar-BQXEaD_9.js";
import "./NumberChart-DxVT-3uk.js";
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
