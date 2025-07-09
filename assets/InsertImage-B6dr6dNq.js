import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aR as normalizeProps, aS as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-BvyPapf4.js";
import { I as ImageGroupUploadDialog } from "./ListRow-CEnsHTeP.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-CDwy69Gs.js";
import "./Autocomplete-Ctc3AhKO.js";
import "./Popover-B4u7jK85.js";
import "./Button-DuHrgKMY.js";
import "./FeatherIcon-C9moqs4Q.js";
import "./Avatar-XaWl0qsK.js";
import "./Badge-BlHkj8T8.js";
import "./Breadcrumbs-CQVsdY2J.js";
import "./Dropdown-s-KajWBK.js";
import "./Combobox-_Lr3Aa0h.js";
import "./chevron-down-D9Qwa_ul.js";
import "./DateRangePicker-BXd_j5Gb.js";
import "./TextInput-Dgm4SOK-.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-BsGYEVDs.js";
import "./Dialog-Bo6wLI4V.js";
import "./ErrorMessage-CKYPAI6c.js";
import "./FileUploader-Divb2-w2.js";
import "./FormControl-CBkVlMX2.js";
import "./Select-DLv2ggBj.js";
import "./Textarea-Cz32RSZw.js";
import "./Progress-DXaFAcu4.js";
import "./Rating-DuRYpBKI.js";
import "./Spinner-fZBzDMws.js";
import "./Switch-x_XSvstd.js";
import "./TabButtons-26Ov2WrU.js";
import "./Tabs-D6qSbXRV.js";
import "./Tooltip-DCKAyh2a.js";
import "./Calendar-CSHYFQhN.js";
import "./CircularProgressBar-CoXDuM70.js";
import "./Tree-DOrt5cBf.js";
import "./Sidebar-C5TkBGW-.js";
import "./NumberChart-CqiNxyHw.js";
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
