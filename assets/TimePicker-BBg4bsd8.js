import { aC as defineComponent, aN as ref, aF as computed, b3 as watch, aY as nextTick, az as openBlock, aH as createBlock, aP as withCtx, aM as createVNode, bk as withKeys, a_ as withModifiers, bl as createSlots, aG as renderSlot, bc as normalizeProps, bd as guardReactiveProps, bf as withDirectives, aB as createBaseVNode, aA as createElementBlock, aT as Fragment, aS as renderList, aI as normalizeClass, aL as toDisplayString, bg as vShow } from "./vendor-B38Td3qf.js";
import { _ as __unplugin_components_1 } from "./Popover-CkiI8O6X.js";
import { T as TextInput } from "./TextInput-BNt4QYGm.js";
import { F as FeatherIcon } from "./FeatherIcon-CHSfV2m6.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "TimePicker",
  props: {
    value: { type: String, required: false, default: "" },
    modelValue: { type: String, required: false, default: "" },
    interval: { type: Number, required: false, default: 15 },
    options: { type: Array, required: false, default: () => [] },
    placement: { type: String, required: false, default: "bottom-start" },
    placeholder: { type: String, required: false, default: "Select time" },
    variant: { type: String, required: false, default: "subtle" },
    allowCustom: { type: Boolean, required: false, default: true },
    autoClose: { type: Boolean, required: false, default: true },
    use12Hour: { type: Boolean, required: false, default: true },
    disabled: { type: Boolean, required: false, default: false },
    scrollMode: { type: String, required: false, default: "center" },
    minTime: { type: String, required: false, default: "" },
    maxTime: { type: String, required: false, default: "" }
  },
  emits: ["update:modelValue", "change", "input-invalid", "invalid-change", "open", "close"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const panelRef = ref(null);
    const isFocused = ref(false);
    const showOptions = ref(false);
    const highlightIndex = ref(-1);
    const hasSelectedOnFirstClick = ref(false);
    const isTyping = ref(false);
    let navUpdating = false;
    let invalidState = false;
    const inputRef = ref(null);
    const initial = props.modelValue || props.value || "";
    const internalValue = ref(initial);
    const displayValue = ref("");
    displayValue.value = formatDisplay(internalValue.value);
    const uid = Math.random().toString(36).slice(2, 9);
    const activeDescendantId = computed(
      () => highlightIndex.value > -1 ? optionId(highlightIndex.value) : void 0
    );
    function optionId(idx) {
      return `tp-${uid}-${idx}`;
    }
    function minutesFromHHMM(str) {
      if (!str) return null;
      if (!/^\d{2}:\d{2}(:\d{2})?$/.test(str)) return null;
      const [h, m] = str.split(":").map((n) => parseInt(n));
      if (h > 23 || m > 59) return null;
      return h * 60 + m;
    }
    const minMinutes = computed(() => minutesFromHHMM(props.minTime));
    const maxMinutes = computed(() => minutesFromHHMM(props.maxTime));
    const displayedOptions = computed(() => {
      var _a;
      if ((_a = props.options) == null ? void 0 : _a.length) {
        return props.options.map((o) => {
          const value = normalize24(o.value);
          return {
            value,
            label: o.label || formatDisplay(value)
          };
        });
      }
      const out = [];
      for (let m = 0; m < 1440; m += props.interval) {
        if (minMinutes.value != null && m < minMinutes.value) continue;
        if (maxMinutes.value != null && m > maxMinutes.value) continue;
        const hh = Math.floor(m / 60).toString().padStart(2, "0");
        const mm = (m % 60).toString().padStart(2, "0");
        const val = `${hh}:${mm}`;
        out.push({
          value: val,
          label: formatDisplay(val)
        });
      }
      return out;
    });
    watch(
      () => [props.modelValue, props.value],
      ([m, v]) => {
        const nv = m || v || "";
        if (nv && nv !== internalValue.value) {
          internalValue.value = normalize24(nv);
          displayValue.value = formatDisplay(internalValue.value);
        } else if (!nv) {
          internalValue.value = "";
          displayValue.value = "";
        }
      }
    );
    function normalize24(raw) {
      if (!raw) return "";
      if (/^\d{2}:\d{2}$/.test(raw)) return raw;
      if (/^\d{2}:\d{2}:\d{2}$/.test(raw)) return raw;
      const parsed = parseFlexibleTime(raw);
      if (!parsed.valid) return "";
      return parsed.ss ? `${parsed.hh24}:${parsed.mm}:${parsed.ss}` : `${parsed.hh24}:${parsed.mm}`;
    }
    function formatDisplay(val24) {
      if (!val24) return "";
      const segs = val24.split(":");
      const h = parseInt(segs[0]);
      const m = parseInt(segs[1]);
      const s = segs[2];
      const base24 = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}${s ? `:${s}` : ""}`;
      if (!props.use12Hour) return base24;
      const am = h < 12;
      const hour12 = h % 12 === 0 ? 12 : h % 12;
      return `${hour12}:${m.toString().padStart(2, "0")}${s ? `:${s}` : ""} ${am ? "am" : "pm"}`;
    }
    function parseFlexibleTime(input) {
      if (!input) return { valid: false };
      let s = input.trim().toLowerCase();
      s = s.replace(/\./g, "");
      s = s.replace(/(\d)(am|pm)$/, "$1 $2");
      const re = /^(\d{1,2})(?::(\d{1,2}))?(?::(\d{1,2}))?\s*([ap]m)?$/;
      const m = s.match(re);
      if (!m) return { valid: false };
      let [, hhStr, mmStr, ssStr, ap] = m;
      let hh = parseInt(hhStr);
      if (isNaN(hh) || hh < 0 || hh > 23) return { valid: false };
      if (ssStr && !mmStr) return { valid: false };
      let mm = mmStr != null && mmStr !== "" ? parseInt(mmStr) : 0;
      if (isNaN(mm) || mm < 0 || mm > 59) return { valid: false };
      let ss;
      if (ssStr) {
        ss = parseInt(ssStr);
        if (isNaN(ss) || ss < 0 || ss > 59) return { valid: false };
      }
      if (ap) {
        if (hh < 1 || hh > 12) return { valid: false };
        if (hh === 12 && ap === "am") hh = 0;
        else if (hh < 12 && ap === "pm") hh += 12;
      }
      return {
        valid: true,
        hh24: hh.toString().padStart(2, "0"),
        mm: mm.toString().padStart(2, "0"),
        ss: ss != null ? ss.toString().padStart(2, "0") : void 0,
        total: hh * 60 + mm
      };
    }
    function findNearestIndex(targetMinutes, list) {
      if (!list.length) return -1;
      const minutesArr = list.map((o) => {
        const [hh, mm] = o.value.split(":").map(Number);
        return hh * 60 + mm;
      });
      let lo = 0, hi = minutesArr.length - 1;
      while (lo <= hi) {
        const mid = lo + hi >> 1;
        const val = minutesArr[mid];
        if (val === targetMinutes) return mid;
        if (val < targetMinutes) lo = mid + 1;
        else hi = mid - 1;
      }
      const candidates = [];
      if (lo < minutesArr.length) candidates.push(lo);
      if (lo - 1 >= 0) candidates.push(lo - 1);
      if (!candidates.length) return -1;
      return candidates.sort(
        (a, b) => Math.abs(minutesArr[a] - targetMinutes) - Math.abs(minutesArr[b] - targetMinutes)
      )[0];
    }
    function isOutOfRange(totalMinutes) {
      if (minMinutes.value != null && totalMinutes < minMinutes.value) return true;
      if (maxMinutes.value != null && totalMinutes > maxMinutes.value) return true;
      return false;
    }
    function applyValue(val24, commit = false) {
      const prev = internalValue.value;
      internalValue.value = val24;
      displayValue.value = formatDisplay(val24);
      if (commit || !isFocused.value) emit("update:modelValue", val24);
      if (commit && val24 !== prev) emit("change", val24);
      setInvalid(false);
    }
    function commitInput() {
      const raw = displayValue.value;
      const parsed = parseFlexibleTime(raw);
      if (!raw) {
        const prev = internalValue.value;
        internalValue.value = "";
        if (!isFocused.value) emit("update:modelValue", "");
        if (prev && prev !== "") emit("change", "");
        setInvalid(false);
        return;
      }
      if (!parsed.valid || isOutOfRange(parsed.total)) {
        emit("input-invalid", raw);
        setInvalid(true);
        return;
      }
      const normalized = parsed.ss ? `${parsed.hh24}:${parsed.mm}:${parsed.ss}` : `${parsed.hh24}:${parsed.mm}`;
      if (!props.allowCustom && !displayedOptions.value.some((o) => {
        const base = normalized.length === 8 ? normalized.slice(0, 5) : normalized;
        return o.value === base;
      })) {
        const nearestIdx = findNearestIndex(parsed.total, displayedOptions.value);
        if (nearestIdx > -1) {
          const nearestVal = displayedOptions.value[nearestIdx].value;
          const committed = normalized.length === 8 && nearestVal.length === 5 ? `${nearestVal}${normalized.slice(5)}` : nearestVal;
          applyValue(committed, true);
          return;
        }
      }
      applyValue(normalized, true);
    }
    function select(val, forceChange = false) {
      const prev = internalValue.value;
      applyValue(val, true);
      if (forceChange && prev === internalValue.value) {
        emit("change", internalValue.value);
      }
      if (props.autoClose) showOptions.value = false;
    }
    const selectedAndNearest = computed(() => {
      const list = displayedOptions.value;
      if (!list.length) return { selected: null, nearest: null };
      const parsedTyped = parseFlexibleTime(displayValue.value);
      const candidate = isTyping.value && parsedTyped.valid ? parsedTyped.ss ? `${parsedTyped.hh24}:${parsedTyped.mm}:${parsedTyped.ss}` : `${parsedTyped.hh24}:${parsedTyped.mm}` : internalValue.value || null;
      if (!candidate) return { selected: null, nearest: null };
      const candidateCompare = candidate && candidate.length === 8 ? candidate.slice(0, 5) : candidate;
      const selected = list.find((o) => o.value === candidateCompare) || null;
      if (selected) return { selected, nearest: null };
      const parsed = parseFlexibleTime(candidate);
      if (!parsed.valid) return { selected: null, nearest: null };
      const idx = findNearestIndex(parsed.total, list);
      return { selected: null, nearest: idx > -1 ? list[idx] : null };
    });
    function buttonClasses(opt, idx) {
      if (idx === highlightIndex.value) return "bg-surface-gray-3 text-ink-gray-8";
      const { selected, nearest } = selectedAndNearest.value;
      if (isTyping.value && !selected) {
        if (nearest && nearest.value === opt.value)
          return "text-ink-gray-7 italic bg-surface-gray-2";
        return "text-ink-gray-6 hover:bg-surface-gray-2 hover:text-ink-gray-8";
      }
      if (selected && selected.value === opt.value)
        return "bg-surface-gray-3 text-ink-gray-8";
      if (nearest && nearest.value === opt.value)
        return "text-ink-gray-7 italic bg-surface-gray-2";
      return "text-ink-gray-6 hover:bg-surface-gray-2 hover:text-ink-gray-8";
    }
    watch(
      () => displayedOptions.value,
      () => scheduleScroll()
    );
    function scheduleScroll() {
      nextTick(() => {
        if (!panelRef.value || !showOptions.value) return;
        let targetEl = null;
        if (highlightIndex.value > -1) {
          targetEl = panelRef.value.querySelector(
            `[data-index="${highlightIndex.value}"]`
          );
        } else {
          const { selected, nearest } = selectedAndNearest.value;
          const target = selected || nearest;
          if (target)
            targetEl = panelRef.value.querySelector(
              `[data-value="${target.value}"]`
            );
        }
        if (!targetEl) return;
        targetEl.scrollIntoView({
          block: props.scrollMode === "center" ? "center" : props.scrollMode === "start" ? "start" : "nearest"
        });
      });
    }
    watch(showOptions, (open) => {
      if (open) {
        emit("open");
        initHighlight();
        scheduleScroll();
      } else {
        emit("close");
      }
    });
    watch(
      () => displayValue.value,
      () => {
        if (navUpdating) return;
        if (showOptions.value) scheduleScroll();
        isTyping.value = true;
        highlightIndex.value = -1;
      }
    );
    function initHighlight() {
      const { selected, nearest } = selectedAndNearest.value;
      const target = selected || nearest;
      if (!target) {
        highlightIndex.value = -1;
        return;
      }
      const idx = displayedOptions.value.findIndex((o) => o.value === target.value);
      highlightIndex.value = idx;
    }
    function moveHighlight(delta) {
      const list = displayedOptions.value;
      if (!list.length) return;
      if (highlightIndex.value === -1) initHighlight();
      else
        highlightIndex.value = (highlightIndex.value + delta + list.length) % list.length;
      const opt = list[highlightIndex.value];
      if (opt) {
        navUpdating = true;
        const val = internalValue.value.length === 8 && opt.value.length === 5 ? `${opt.value}${internalValue.value.slice(5)}` : opt.value;
        applyValue(val, false);
        nextTick(() => {
          navUpdating = false;
        });
      }
      isTyping.value = false;
      scheduleScroll();
    }
    function onArrowDown(togglePopover, isOpen) {
      if (!isOpen) togglePopover();
      else moveHighlight(1);
    }
    function onArrowUp(togglePopover, isOpen) {
      if (!isOpen) togglePopover();
      else moveHighlight(-1);
    }
    function onEnter() {
      if (!showOptions.value) {
        commitInput();
        blurInput();
        return;
      }
      const parsed = parseFlexibleTime(displayValue.value);
      const normalized = parsed.valid ? parsed.ss ? `${parsed.hh24}:${parsed.mm}:${parsed.ss}` : `${parsed.hh24}:${parsed.mm}` : null;
      const exists = normalized ? displayedOptions.value.some((o) => {
        const base = normalized.length === 8 ? normalized.slice(0, 5) : normalized;
        return o.value === base;
      }) : false;
      if (parsed.valid && (!exists || isTyping.value)) {
        commitInput();
        if (props.autoClose) showOptions.value = false;
        blurInput();
        return;
      }
      if (highlightIndex.value > -1) {
        const opt = displayedOptions.value[highlightIndex.value];
        if (opt) select(opt.value, true);
      } else {
        commitInput();
        if (props.autoClose) showOptions.value = false;
      }
      blurInput();
    }
    function onClickInput(isOpen, togglePopover) {
      if (!isOpen) togglePopover();
      if (props.allowCustom) selectAll();
    }
    function onFocus() {
      isFocused.value = true;
      if (props.allowCustom && !hasSelectedOnFirstClick.value) selectAll();
    }
    function onBlur() {
      if (showOptions.value) {
        isFocused.value = false;
        return;
      }
      commitInput();
      isFocused.value = false;
    }
    function selectAll() {
      nextTick(() => {
        var _a, _b;
        const el = ((_a = inputRef.value) == null ? void 0 : _a.el) || inputRef.value;
        if (el && el.querySelector) {
          const input = el.querySelector("input") || el;
          (_b = input == null ? void 0 : input.select) == null ? void 0 : _b.call(input);
        } else if (el == null ? void 0 : el.select) {
          el.select();
        }
        hasSelectedOnFirstClick.value = true;
      });
    }
    function blurInput() {
      nextTick(() => {
        var _a, _b;
        const el = ((_a = inputRef.value) == null ? void 0 : _a.el) || inputRef.value;
        if (el && el.querySelector) {
          const input = el.querySelector("input") || el;
          (_b = input == null ? void 0 : input.blur) == null ? void 0 : _b.call(input);
        } else if (el == null ? void 0 : el.blur) {
          el.blur();
        }
        isFocused.value = false;
      });
    }
    function onEscape() {
      if (showOptions.value) showOptions.value = false;
      blurInput();
    }
    function setInvalid(val) {
      if (invalidState !== val) {
        invalidState = val;
        emit("invalid-change", val);
      }
    }
    const __returned__ = { props, emit, panelRef, isFocused, showOptions, highlightIndex, hasSelectedOnFirstClick, isTyping, get navUpdating() {
      return navUpdating;
    }, set navUpdating(v) {
      navUpdating = v;
    }, get invalidState() {
      return invalidState;
    }, set invalidState(v) {
      invalidState = v;
    }, inputRef, initial, internalValue, displayValue, uid, activeDescendantId, optionId, minutesFromHHMM, minMinutes, maxMinutes, displayedOptions, normalize24, formatDisplay, parseFlexibleTime, findNearestIndex, isOutOfRange, applyValue, commitInput, select, selectedAndNearest, buttonClasses, scheduleScroll, initHighlight, moveHighlight, onArrowDown, onArrowUp, onEnter, onClickInput, onFocus, onBlur, selectAll, blurInput, onEscape, setInvalid, Popover: __unplugin_components_1, TextInput, FeatherIcon };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = ["aria-activedescendant"];
const _hoisted_2 = ["data-value", "data-index", "onClick", "onMouseenter", "id", "aria-selected"];
const _hoisted_3 = { class: "truncate" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock($setup["Popover"], {
    show: $setup.showOptions,
    "onUpdate:show": _cache[1] || (_cache[1] = ($event) => $setup.showOptions = $event),
    transition: "default",
    placement: $props.placement
  }, {
    target: withCtx(({ togglePopover, isOpen }) => [
      createVNode($setup["TextInput"], {
        ref: "inputRef",
        modelValue: $setup.displayValue,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.displayValue = $event),
        variant: $props.variant,
        type: "text",
        class: "text-sm w-full cursor-text",
        placeholder: $props.placeholder,
        disabled: $props.disabled,
        readonly: !$setup.props.allowCustom,
        onFocus: $setup.onFocus,
        onClick: ($event) => $setup.onClickInput(isOpen, togglePopover),
        onKeydown: [
          withKeys(withModifiers($setup.onEnter, ["prevent"]), ["enter"]),
          withKeys(withModifiers(($event) => $setup.onArrowDown(togglePopover, isOpen), ["prevent"]), ["down"]),
          withKeys(withModifiers(($event) => $setup.onArrowUp(togglePopover, isOpen), ["prevent"]), ["up"]),
          withKeys(withModifiers($setup.onEscape, ["prevent"]), ["esc"])
        ],
        onBlur: $setup.onBlur
      }, createSlots({
        suffix: withCtx(() => [
          renderSlot(_ctx.$slots, "suffix", normalizeProps(guardReactiveProps({ togglePopover, isOpen })), () => [
            createVNode($setup["FeatherIcon"], {
              name: "chevron-down",
              class: "h-4 w-4 cursor-pointer",
              onMousedown: withModifiers(togglePopover, ["prevent"])
            }, null, 8, ["onMousedown"])
          ])
        ]),
        _: 2
        /* DYNAMIC */
      }, [
        _ctx.$slots.prefix ? {
          name: "prefix",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "prefix")
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["modelValue", "variant", "placeholder", "disabled", "readonly", "onClick", "onKeydown"])
    ]),
    body: withCtx(({ isOpen }) => [
      withDirectives(createBaseVNode("div", {
        ref: "panelRef",
        class: "mt-2 max-h-48 w-44 overflow-y-auto rounded-lg bg-surface-modal p-1 text-base shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none",
        role: "listbox",
        "aria-activedescendant": $setup.activeDescendantId
      }, [
        (openBlock(true), createElementBlock(
          Fragment,
          null,
          renderList($setup.displayedOptions, (opt, idx) => {
            return openBlock(), createElementBlock("button", {
              key: opt.value,
              "data-value": opt.value,
              "data-index": idx,
              type: "button",
              class: normalizeClass(["group flex h-7 w-full items-center rounded px-2 text-left", $setup.buttonClasses(opt, idx)]),
              onClick: ($event) => $setup.select(opt.value),
              onMouseenter: ($event) => $setup.highlightIndex = idx,
              role: "option",
              id: $setup.optionId(idx),
              "aria-selected": $setup.internalValue === opt.value
            }, [
              createBaseVNode(
                "span",
                _hoisted_3,
                toDisplayString(opt.label),
                1
                /* TEXT */
              )
            ], 42, _hoisted_2);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ], 8, _hoisted_1), [
        [vShow, isOpen]
      ])
    ]),
    _: 3
    /* FORWARDED */
  }, 8, ["show", "placement"]);
}
_sfc_main.__file = "src/components/TimePicker/TimePicker.vue";
const TimePicker = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TimePicker/TimePicker.vue"]]);
export {
  TimePicker as T
};
