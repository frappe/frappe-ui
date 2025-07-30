import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-DJfK-8-n.js";
import { I as ImageGroupUploadDialog } from "./ListRow-BF-YT9By.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-CoEuEWhv.js";
import "./Autocomplete-D8qb5tEd.js";
import "./Popover-BWYlhtYc.js";
import "./Button-C7Z5NtZB.js";
import "./FeatherIcon-njTlGqML.js";
import "./Avatar-CwjlsOfU.js";
import "./Badge-CNFVclsW.js";
import "./Breadcrumbs-DG-7KuKr.js";
import "./Dropdown-Chwn8lb1.js";
import "./Combobox-k2xkN643.js";
import "./chevron-down-jOv5UsAg.js";
import "./DateRangePicker-Duxl6QsQ.js";
import "./TextInput-C2e82ZEX.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-CkDJoFc6.js";
import "./Calendar-D35ceUkj.js";
import "./TabButtons-DCRIDh1Q.js";
import "./Dialog-C1jNkGgU.js";
import "./FormControl-D1BIU5aK.js";
import "./Select-BDpENZF3.js";
import "./Textarea-D-pIHq9s.js";
import "./ErrorMessage-CN0k12wx.js";
import "./FileUploader-Dat_c34b.js";
import "./Progress-De5lEpF4.js";
import "./Rating-2OtyHaC7.js";
import "./Password-QdEbIyEG.js";
import "./Tooltip-BzifAxYb.js";
import "./Spinner-Bv1GQrU2.js";
import "./Switch-DVnRhtOI.js";
import "./Tabs-D_FOaM7n.js";
import "./CircularProgressBar-CioghEiI.js";
import "./Tree-B96tQLBm.js";
import "./Sidebar-3nIUWKah.js";
import "./NumberChart-Bsf6XB-z.js";
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
