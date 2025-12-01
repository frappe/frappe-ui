const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/search-docs-data-CrI_gL82.js","assets/vendor-DHfc0FDQ.js"])))=>i.map(i=>d[i]);
import { r as ref, k as watch, c as computed, d as defineComponent, o as openBlock, b as createElementBlock, a6 as renderSlot, n as normalizeClass, m as withKeys, q as createBlock, g as unref, I as Icon, e as createVNode, f as createBaseVNode, D as createTextVNode, t as toDisplayString, F as Fragment, p as renderList, h as createCommentVNode, u as useCssVars, aj as toRefs, ak as useRouter, w as withCtx, a2 as markRaw, dl as useFocus, dm as refDebounced, B as withDirectives, ad as vModelText, ac as withModifiers, _ as __vitePreload, dn as flexsearch_bundleExports } from "./vendor-DHfc0FDQ.js";
import { u as useStoryStore } from "./story-DQSqYcf_.js";
import { B as BaseEmpty } from "./BaseEmpty.vue-D7M2JjvI.js";
import "./GenericMountStory.vue2-DS_CxE6D.js";
import { o as onKeyboardShortcut, u as useCommandStore } from "./bundle-main-_MW54ui6.js";
import { _ as _export_sfc, u as useScrollOnActive, B as BaseListItemLink } from "./MobileOverlay.vue2-FjI8YaSV.js";
function pipeline(a, b, c, d) {
  if (a && (b && (a = replace(a, b)), this.matcher && (a = replace(a, this.matcher)), this.stemmer && 1 < a.length && (a = replace(a, this.stemmer)), d && 1 < a.length && (a = collapse(a)), c || "" === c)) {
    const b2 = a.split(c);
    return this.filter ? filter$1(b2, this.filter) : b2;
  }
  return a;
}
const regex_whitespace = /[\p{Z}\p{S}\p{P}\p{C}]+/u;
const regex_normalize = /[\u0300-\u036f]/g;
function normalize(a) {
  return a.normalize && (a = a.normalize("NFD").replace(regex_normalize, "")), a;
}
function replace(a, b) {
  for (let c = 0, d = b.length; c < d && (a = a.replace(b[c], b[c + 1]), !!a); c += 2)
    ;
  return a;
}
function regex(a) {
  return new RegExp(a, "g");
}
function collapse(a) {
  let b = "", c = "";
  for (let d, e = 0, f = a.length; e < f; e++)
    (d = a[e]) !== c && (b += c = d);
  return b;
}
function filter$1(a, b) {
  const c = a.length, d = [];
  for (let e = 0, f = 0; e < c; e++) {
    const c2 = a[e];
    c2 && !b[c2] && (d[f++] = c2);
  }
  return d;
}
const regex_a = regex("[àáâãäå]"), regex_e = regex("[èéêë]"), regex_i = regex("[ìíîï]"), regex_o = regex("[òóôõöő]"), regex_u = regex("[ùúûüű]"), regex_y = regex("[ýŷÿ]"), regex_n = regex("ñ"), regex_c = regex("[çc]"), regex_s = regex("ß"), regex_and = regex(" & "), pairs$1 = [regex_a, "a", regex_e, "e", regex_i, "i", regex_o, "o", regex_u, "u", regex_y, "y", regex_n, "n", regex_c, "k", regex_s, "s", regex_and, " and "];
function encode$2(a) {
  return a = "" + a, pipeline.call(this, normalize(a).toLowerCase(), !a.normalize && pairs$1, regex_whitespace, false);
}
const regex_strip = /[^a-z0-9]+/, soundex = { b: "p", v: "f", w: "f", z: "s", x: "s", ß: "s", d: "t", n: "m", c: "k", g: "k", j: "k", q: "k", i: "e", y: "e", u: "o" };
function encode$1(a) {
  a = encode$2.call(this, a).join(" ");
  const b = [];
  if (a) {
    const c = a.split(regex_strip), d = c.length;
    for (let e, f = 0, g = 0; f < d; f++)
      if ((a = c[f]) && (!this.filter || !this.filter[a])) {
        e = a[0];
        let c2 = soundex[e] || e, d2 = c2;
        for (let b2 = 1; b2 < a.length; b2++) {
          e = a[b2];
          const f2 = soundex[e] || e;
          f2 && f2 !== d2 && (c2 += f2, d2 = f2);
        }
        b[g++] = c2;
      }
  }
  return b;
}
const charset = { encode, rtl: false, tokenize: "" };
const regex_ae = regex("ae"), regex_oe = regex("oe"), regex_sh = regex("sh"), regex_th = regex("th"), regex_ph = regex("ph"), regex_pf = regex("pf"), pairs = [regex_ae, "a", regex_oe, "o", regex_sh, "s", regex_th, "t", regex_ph, "f", regex_pf, "f", regex("(?![aeo])h(?![aeo])"), "", regex("(?!^[aeo])h(?!^[aeo])"), ""];
function encode(a, b) {
  return a && (a = encode$1.call(this, a).join(" "), 2 < a.length && (a = replace(a, pairs)), !b && (1 < a.length && (a = collapse(a)), a && (a = a.split(" ")))), a;
}
const filter = ["a", "about", "above", "after", "again", "against", "all", "also", "am", "an", "and", "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "both", "but", "by", "can", "cannot", "can't", "come", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "dont", "down", "during", "each", "even", "few", "first", "for", "from", "further", "get", "go", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "hed", "her", "here", "here's", "hers", "herself", "hes", "him", "himself", "his", "how", "how's", "i", "id", "if", "ill", "im", "in", "into", "is", "isn't", "it", "it's", "itself", "i've", "just", "know", "let's", "like", "make", "me", "more", "most", "mustn't", "my", "myself", "new", "no", "nor", "not", "now", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "our's", "ourselves", "out", "over", "own", "same", "say", "see", "shan't", "she", "she'd", "shell", "shes", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "time", "to", "too", "until", "up", "us", "very", "want", "was", "wasn't", "way", "we", "wed", "well", "were", "weren't", "we've", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "whom", "who's", "why", "why's", "will", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "your", "you're", "your's", "yourself", "yourselves", "you've"];
const stemmer = { ational: "ate", iveness: "ive", fulness: "ful", ousness: "ous", ization: "ize", tional: "tion", biliti: "ble", icate: "ic", ative: "", alize: "al", iciti: "ic", entli: "ent", ousli: "ous", alism: "al", ation: "ate", aliti: "al", iviti: "ive", ement: "", enci: "ence", anci: "ance", izer: "ize", alli: "al", ator: "ate", logi: "log", ical: "ic", ance: "", ence: "", ness: "", able: "", ible: "", ment: "", eli: "e", bli: "ble", ful: "", ant: "", ent: "", ism: "", ate: "", iti: "", ous: "", ive: "", ize: "", al: "", ou: "", er: "", ic: "" };
const matcher = {};
const language = { filter, stemmer, matcher };
function useSelection(list) {
  const selectedIndex = ref(0);
  watch(list, () => {
    selectedIndex.value = 0;
  });
  function selectNext() {
    selectedIndex.value++;
    if (selectedIndex.value > list.value.length - 1) {
      selectedIndex.value = 0;
    }
  }
  function selectPrevious() {
    selectedIndex.value--;
    if (selectedIndex.value < 0) {
      selectedIndex.value = list.value.length - 1;
    }
  }
  return {
    selectedIndex: computed(() => selectedIndex.value),
    selectNext,
    selectPrevious
  };
}
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "BaseListItem",
  props: {
    isActive: { type: Boolean }
  },
  emits: ["navigate"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    function handleNavigate() {
      emit("navigate");
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("a", {
        class: normalizeClass(["istoire-base-list-ite htw-flex htw-items-center htw-gap-2 htw-text-gray-900 dark:htw-text-gray-100", [
          _ctx.$attrs.class,
          _ctx.isActive ? "active htw-bg-primary-500 hover:htw-bg-primary-600 htw-text-white dark:htw-text-black" : "hover:htw-bg-primary-100 dark:hover:htw-bg-primary-900"
        ]]),
        onClick: _cache[0] || (_cache[0] = ($event) => handleNavigate()),
        onKeyup: [
          _cache[1] || (_cache[1] = withKeys(($event) => handleNavigate(), ["enter"])),
          _cache[2] || (_cache[2] = withKeys(($event) => handleNavigate(), ["space"]))
        ]
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 34);
    };
  }
});
const _hoisted_1$3 = ["src", "alt"];
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "BaseIcon",
  props: {
    icon: {}
  },
  setup(__props) {
    const props = __props;
    const isUrl = computed(() => props.icon.startsWith("http") || props.icon.startsWith("data:image") || props.icon.startsWith(".") || props.icon.startsWith("/"));
    return (_ctx, _cache) => {
      return isUrl.value ? (openBlock(), createElementBlock("img", {
        key: 0,
        src: _ctx.icon,
        alt: _ctx.icon,
        class: "histoire-base-icon"
      }, null, 8, _hoisted_1$3)) : (openBlock(), createBlock(unref(Icon), {
        key: 1,
        icon: _ctx.icon,
        class: "histoire-base-icon"
      }, null, 8, ["icon"]));
    };
  }
});
const BaseIcon = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-2114f510"]]);
const _hoisted_1$2 = { class: "htw-flex-1" };
const _hoisted_2 = { class: "htw-flex" };
const _hoisted_3 = { class: "htw-ml-auto htw-opacity-40" };
const _hoisted_4 = {
  key: 0,
  class: "htw-flex htw-items-center htw-gap-0.5 htw-opacity-60"
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "SearchItemContent",
  props: {
    result: {},
    selected: { type: Boolean }
  },
  setup(__props) {
    const defaultIcons = {
      story: "carbon:cube",
      variant: "carbon:cube"
    };
    const kindLabels = {
      story: "Story",
      variant: "Variant",
      command: "Command"
    };
    return (_ctx, _cache) => {
      var _a;
      return openBlock(), createElementBlock(Fragment, null, [
        createVNode(BaseIcon, {
          icon: _ctx.result.icon ?? defaultIcons[_ctx.result.kind],
          class: normalizeClass(["htw-w-4 htw-h-4", [
            !_ctx.selected ? [
              _ctx.result.iconColor ? "bind-icon-color" : {
                "htw-text-primary-500": _ctx.result.kind === "story",
                "htw-text-gray-500": _ctx.result.kind === "variant"
              }
            ] : [],
            {
              "colorize-black": _ctx.selected
            }
          ]])
        }, null, 8, ["icon", "class"]),
        createBaseVNode("div", _hoisted_1$2, [
          createBaseVNode("div", _hoisted_2, [
            createTextVNode(toDisplayString(_ctx.result.title) + " ", 1),
            createBaseVNode("span", _hoisted_3, toDisplayString(kindLabels[_ctx.result.kind]), 1)
          ]),
          ((_a = _ctx.result.path) == null ? void 0 : _a.length) ? (openBlock(), createElementBlock("div", _hoisted_4, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.result.path, (p, index) => {
              return openBlock(), createElementBlock("div", {
                key: index,
                class: "htw-flex htw-items-center htw-gap-0.5"
              }, [
                index > 0 ? (openBlock(), createBlock(unref(Icon), {
                  key: 0,
                  icon: "carbon:chevron-right",
                  class: "htw-w-4 htw-h-4 htw-mt-0.5 htw-opacity-50"
                })) : createCommentVNode("", true),
                createBaseVNode("span", null, toDisplayString(p), 1)
              ]);
            }), 128))
          ])) : createCommentVNode("", true)
        ])
      ], 64);
    };
  }
});
const _hoisted_1$1 = ["data-selected"];
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "SearchItem",
  props: {
    result: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    close: () => true
  },
  setup(__props, { emit: __emit }) {
    useCssVars((_ctx) => ({
      "ddaae392": __props.result.iconColor
    }));
    const props = __props;
    const emit = __emit;
    const el = ref();
    const { selected } = toRefs(props);
    useScrollOnActive(selected, el);
    const router = useRouter();
    onKeyboardShortcut(["enter"], () => {
      if (!props.selected)
        return;
      action();
    });
    function action(fromClick = false) {
      if ("route" in props.result && !fromClick) {
        router.push(props.result.route);
      }
      if ("onActivate" in props.result) {
        props.result.onActivate();
      }
      emit("close");
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "el",
        ref: el,
        class: "histoire-search-item",
        "data-test-id": "search-item",
        "data-selected": unref(selected) ? "" : void 0
      }, [
        "route" in __props.result ? (openBlock(), createBlock(BaseListItemLink, {
          key: 0,
          to: __props.result.route,
          "is-active": unref(selected),
          class: "htw-px-6 htw-py-4 htw-gap-4",
          onNavigate: _cache[0] || (_cache[0] = ($event) => action(true))
        }, {
          default: withCtx(() => [
            createVNode(_sfc_main$2, {
              result: __props.result,
              selected: unref(selected)
            }, null, 8, ["result", "selected"])
          ]),
          _: 1
        }, 8, ["to", "is-active"])) : createCommentVNode("", true),
        "onActivate" in __props.result ? (openBlock(), createBlock(_sfc_main$4, {
          key: 1,
          "is-active": unref(selected),
          class: "htw-px-6 htw-py-4 htw-gap-4",
          onNavigate: _cache[1] || (_cache[1] = ($event) => action(true))
        }, {
          default: withCtx(() => [
            createVNode(_sfc_main$2, {
              result: __props.result,
              selected: unref(selected)
            }, null, 8, ["result", "selected"])
          ]),
          _: 1
        }, 8, ["is-active"])) : createCommentVNode("", true)
      ], 8, _hoisted_1$1);
    };
  }
});
const SearchItem = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-d75a2748"]]);
let searchData$1 = { "index": { "reg": '{"0":1,"1":1,"2":1,"3":1,"4":1,"5":1,"6":1,"7":1,"8":1,"9":1,"10":1,"11":1,"12":1,"13":1,"14":1,"15":1,"16":1,"17":1,"18":1,"19":1,"20":1,"21":1,"22":1,"23":1,"24":1,"25":1,"26":1,"27":1,"28":1,"29":1,"30":1,"31":1,"32":1,"33":1,"34":1,"35":1,"36":1,"37":1,"38":1,"39":1,"40":1,"41":1,"42":1,"43":1,"44":1,"45":1,"46":1,"47":1,"48":1,"49":1,"50":1,"51":1,"52":1,"53":1,"54":1,"55":1,"56":1,"57":1,"58":1,"59":1,"60":1,"61":1,"62":1,"63":1,"64":1,"65":1,"66":1,"67":1,"68":1,"69":1,"70":1,"71":1,"72":1,"73":1,"74":1,"75":1,"76":1,"77":1,"78":1,"79":1,"80":1,"81":1,"82":1,"83":1,"84":1,"85":1,"86":1,"87":1,"88":1,"89":1,"90":1,"91":1,"92":1,"93":1,"94":1,"95":1,"96":1,"97":1,"98":1,"99":1,"100":1,"101":1,"102":1,"103":1,"104":1,"105":1,"106":1,"107":1,"108":1,"109":1,"110":1,"111":1,"112":1,"113":1,"114":1,"115":1,"116":1,"117":1,"118":1,"119":1,"120":1,"121":1,"122":1,"123":1,"124":1,"125":1,"126":1,"127":1,"128":1,"129":1,"130":1,"131":1,"132":1,"133":1,"134":1,"135":1,"136":1,"137":1,"138":1,"139":1,"140":1,"141":1,"142":1,"143":1,"144":1,"145":1,"146":1,"147":1,"148":1,"149":1,"150":1,"151":1,"152":1,"153":1,"154":1,"155":1,"156":1,"157":1,"158":1,"159":1,"160":1,"161":1,"162":1,"163":1,"164":1,"165":1,"166":1,"167":1,"168":1,"169":1,"170":1,"171":1,"172":1,"173":1,"174":1,"175":1,"176":1,"177":1,"178":1,"179":1,"180":1,"181":1,"182":1,"183":1,"184":1,"185":1,"186":1,"187":1,"188":1,"189":1,"190":1,"191":1,"192":1,"193":1,"194":1,"195":1,"196":1,"197":1,"198":1,"199":1,"200":1}', "text.cfg": '{"doc":0,"opt":1}', "text.map": '[{"a":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],"al":[0,1,2,3,4,5,6],"ale":[0,1,2,3,4,5,6],"aler":[0,1,2,3,4,5,6],"alert":[0,1,2,3,4,5,6],"ao":[7,8,9,10,11,12],"aot":[7,8,9,10,11,12],"aoto":[7,8,9,10,11,12],"aotok":[7,8,9,10,11,12],"aotoko":[7,8,9,10,11,12],"aotokom":[7,8,9,10,11,12],"aotokomp":[7,8,9,10,11,12],"aotokompl":[7,8,9,10,11,12],"aotokomple":[7,8,9,10,11,12],"aotokomplet":[7,8,9,10,11,12],"aotokomplete":[7,8,9,10,11,12],"af":[13,14,15,16,17],"afa":[13,14,15,16,17],"afat":[13,14,15,16,17],"afata":[13,14,15,16,17],"afatar":[13,14,15,16,17],"p":[18,19,20,21,22,23,24,25,26,27,28,29,30,31,114,115,116,117,118,119,120,121,122],"pa":[18,19,20,21,22,114,115],"pat":[18,19,20,21,22],"patk":[18,19,20,21,22],"patke":[18,19,20,21,22],"pr":[23,24,25,26,119,120,121,122],"pre":[23,24,25,26],"prea":[23,24,25,26],"preat":[23,24,25,26],"preatk":[23,24,25,26],"preatkr":[23,24,25,26],"preatkro":[23,24,25,26],"preatkrom":[23,24,25,26],"preatkromp":[23,24,25,26],"preatkromps":[23,24,25,26],"po":[27,28,29,30,31,116,117,118],"pot":[27,28,29,30,31],"poto":[27,28,29,30,31],"potom":[27,28,29,30,31],"k":[32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,177],"ka":[32,33,34,35,36,37,38,39,40,41,42,43,44],"kal":[32,33,34,35],"kale":[32,33,34,35],"kalem":[32,33,34,35],"kalemt":[32,33,34,35],"kalemta":[32,33,34,35],"kalemtar":[32,33,34,35],"kar":[36,37,38,39,40,41,42,43,44],"kart":[36,37,38,39,40,41,42,43,44],"karts":[36,37,38,39,40,41,42,43,44],"ke":[45,46,47,48,49,50,51,52,53,177],"kek":[45,46],"kekp":[45,46],"kekpo":[45,46],"kekpos":[45,46],"ker":[47,48,49,50,51,52,53],"kerk":[47,48,49,50,51,52,53],"kerko":[47,48,49,50,51,52,53],"kerkol":[47,48,49,50,51,52,53],"kerkola":[47,48,49,50,51,52,53],"kerkolar":[47,48,49,50,51,52,53],"ko":[54,55,56,57,58,59,60,61,62,63,64],"kom":[54,55,56,57,58,59,60,61,62,63,64],"komp":[54,55,56,57,58,59,60,61,62,63,64],"kompo":[54,55,56,57,58,59,60,61,62,63,64],"kompop":[54,55,56,57,58,59,60,61,62,63,64],"kompopo":[54,55,56,57,58,59,60,61,62,63,64],"kompopos":[54,55,56,57,58,59,60,61,62,63,64],"t":[65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,179,181,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200],"ta":[65,66,67,68,140,141,142,143,144,145,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200],"tat":[65,66,67,68],"tate":[65,66,67,68],"te":[69,70,71,72,73,74,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,179],"tea":[69,70,71,72,73,74],"teal":[69,70,71,72,73,74],"tealo":[69,70,71,72,73,74],"tealok":[69,70,71,72,73,74],"tr":[75,76,77,78,79,80,81,82,83,175,176],"tro":[75,76,77,78,79,80,81,82,83],"trop":[75,76,77,78,79,80,81,82,83],"tropt":[75,76,77,78,79,80,81,82,83],"tropto":[75,76,77,78,79,80,81,82,83],"troptof":[75,76,77,78,79,80,81,82,83],"troptofm":[75,76,77,78,79,80,81,82,83],"e":[84,85,86,87,178],"er":[84,85,86,87],"ero":[84,85,86,87],"eror":[84,85,86,87],"f":[88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103],"fe":[88,89],"fel":[88,89],"fele":[88,89],"fo":[90,91,92,93,94,95,96,97,98,99,100,101,102,103],"for":[90,91,92,93,94,95,96,97,98,99,100,101,102,103],"form":[90,91,92,93,94,95,96,97,98,99,100,101,102,103],"l":[104,105,106,107,108,109,182],"le":[104,105,106,107,108,109,182],"les":[104,105,106,107,108,109,182],"lest":[104,105,106,107,108,109,182],"m":[110,111,112,113],"mo":[110,111,112,113],"mol":[110,111,112,113],"molt":[110,111,112,113],"molte":[110,111,112,113],"pas":[114,115],"pasf":[114,115],"pasfo":[114,115],"pasfor":[114,115],"pasfort":[114,115],"pop":[116,117,118],"popo":[116,117,118],"popof":[116,117,118],"popofe":[116,117,118],"popofer":[116,117,118],"pro":[119,120,121,122],"prok":[119,120,121,122],"prokr":[119,120,121,122],"prokre":[119,120,121,122],"prokres":[119,120,121,122],"r":[123,124,183],"ra":[123,124],"rat":[123,124],"rate":[123,124],"ratem":[123,124],"ratemk":[123,124],"s":[125,126,127,128,129,130,131,132,133,134,135,136,137,138,139],"se":[125,126,127,128,129],"sel":[125,126,127],"sele":[125,126,127],"selek":[125,126,127],"selekt":[125,126,127],"set":[128,129],"sete":[128,129],"setep":[128,129],"setepa":[128,129],"setepar":[128,129],"sp":[130,131,132],"spe":[130,131,132],"spem":[130,131,132],"speme":[130,131,132],"spemer":[130,131,132],"sf":[133,134,135,136,137,138,139],"sfe":[133,134,135,136,137,138,139],"sfet":[133,134,135,136,137,138,139],"sfetk":[133,134,135,136,137,138,139],"tap":[140,141,142,143,144,145],"taps":[142,143,144,145],"tes":[146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165],"test":[146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165],"testa":[163,164,165],"testar":[163,164,165],"testare":[163,164,165],"testarea":[163,164,165],"tem":[166,167,168,169,170],"teme":[166,167,168,169,170],"to":[171,172,173,174,181],"tol":[171,172,173,174],"tolt":[171,172,173,174],"tolte":[171,172,173,174],"toltep":[171,172,173,174],"tre":[175,176],"ket":[177],"kete":[177],"ketem":[177],"ketemk":[177],"em":[178],"emt":[178],"emtr":[178],"emtro":[178],"emtrot":[178],"emtroto":[178],"emtrotok":[178],"emtrotokt":[178],"emtrotokte":[178],"emtrotokteo":[178],"emtrotokteom":[178],"ter":[179],"tere":[179],"terek":[179],"terekt":[179],"terekte":[179],"terektef":[179],"terektefe":[179],"terektefes":[179],"o":[180],"ot":[180],"ote":[180],"otel":[180],"otele":[180],"otelet":[180],"otelete":[180],"oteletes":[180],"tok":[181],"toko":[181],"tokom":[181],"tokome":[181],"tokomem":[181],"tokomemt":[181],"re":[183],"res":[183],"reso":[183],"resor":[183],"resork":[183],"resorke":[183],"tal":[184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200],"talf":[184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200],"talfe":[184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200],"talfem":[184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200],"talfemt":[184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200]},{"s":[1,8,9,10,15,17,19,20,28,29,38,39,55,110,111,112,113,164,177],"so":[1,19,20,28,29,164],"sok":[1],"soke":[1],"sokes":[1],"f":[2,24,25,26,44,77,78,81,82,83,104,105,106,107,108,109,127,143,144,145,172,174,190,191,192,198,200],"fa":[2],"far":[2],"farm":[2],"farme":[2],"farmem":[2],"farmemk":[2],"e":[3,4,121,122,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,199],"er":[3],"ero":[3],"eror":[3],"em":[4,121,122,149,150,151,152,153,154,155,156,157,158,159,160,161,162],"emf":[4],"emfo":[4],"k":[5,6,14,16,22,31,71,80,90,91,92,93,94,95,96,97,98,99,100,101,102,103,131,132,139],"ko":[5,6,22,31,34,35,71,90,91,92,93,94,95,96,97,98,99,100,101,102,103],"kom":[5,90,91,92,93,94,95,96,97,98,99,100,101,102,103],"komt":[5,90,91,92,93,94,95,96,97,98,99,100,101,102,103],"komtr":[5,90,91,92,93,94,95,96,97,98,99,100,101,102,103],"komtro":[5,90,91,92,93,94,95,96,97,98,99,100,101,102,103],"komtrol":[5,90,91,92,93,94,95,96,97,98,99,100,101,102,103],"komtrole":[5],"komtrolet":[5],"kos":[6,22,31,34,35,62,63,64,71],"kost":[6,22,31,34,35,62,63,64,71],"kosto":[6,34,35,62,63,64,71],"kostom":[6,34,35,62,63,64,71],"se":[8,9,10,38,55,110,111,112,113,137],"sem":[8,9,10,38,55],"semk":[8,9,10],"semkl":[8,9,10],"semkle":[8,9,10],"m":[11,12,37,84,85,86,87,189],"mo":[11,12,37],"mol":[11,12],"molt":[11,12],"molte":[11,12],"moltep":[11,12],"moltepl":[11,12],"molteple":[11,12],"ke":[14,16,80],"ker":[14,16],"kerk":[14,16],"kerkl":[14,16],"kerkle":[14,16],"sk":[15,17],"sko":[15,17],"skoa":[15,17],"skoar":[15,17],"skoare":[15,17],"sol":[19,28],"sole":[19,28],"solet":[19,28],"sop":[20,29,164],"sopt":[20,29,164],"soptl":[20,29,164],"soptle":[20,29,164],"o":[21,30,41,56,57,58,88,89,165],"ot":[21,30,56,165],"otl":[21,30,56,165],"otle":[21,30,56,165],"otlem":[21,30,56,165],"otleme":[21,30,56,165],"fe":[24,25,26,77,78,81,82,83,104,105,106,107,108,109,127,143,144,145,172,174,198],"fet":[24,25,26,77,78,81,82,83,127,143,144,172,174,198],"t":[33,43,46,60,115,117,118,124,126,136,138],"te":[33,46,60,76,115,124,126,136,138,173,176,186],"tef":[33,46,72,76,115,124,126,176],"tefa":[33,46,76,115,124,126,176],"tefao":[33,46,76,115,124,126,176],"tefaol":[33,46,76,115,124,126,176],"tefaolt":[33,46,76,115,124,126,176],"mom":[37],"momp":[37],"mompe":[37],"momper":[37],"semp":[38,55],"sempl":[38,55],"semple":[38,55],"st":[39,177],"sta":[39,177],"stak":[39],"stake":[39],"staket":[39],"p":[40,47,48,49,50,51,52,53,61,65,66,67,68,70,134,140,141,166,167,168,169,170,185,187,188,196,197],"pa":[40,70,185,188],"par":[40],"or":[41],"ore":[41],"ores":[41],"oreso":[41],"oresom":[41],"oresomt":[41],"oresomta":[41],"oresomtal":[41],"a":[42],"ar":[42],"are":[42],"area":[42],"to":[43],"tom":[43],"tomo":[43],"tomot":[43],"fo":[44,190,191,192,200],"fom":[44,190,191,192],"fome":[44],"fomel":[44],"pr":[47,48,49,50,51,52,53,61],"pro":[47,48,49,50,51,52,53],"prok":[47,48,49,50,51,52,53],"prokr":[47,48,49,50,51,52,53],"prokre":[47,48,49,50,51,52,53],"prokres":[47,48,49,50,51,52,53],"op":[57,58,88,89],"opk":[57],"opke":[57],"opkek":[57],"opkekt":[57],"opt":[58],"opte":[58],"opteo":[58],"opteom":[58],"opteoms":[58],"kr":[59],"kro":[59],"krop":[59],"krope":[59],"kropet":[59],"tes":[60,73,136,138,173,186],"tesa":[60,73,138,173],"tesap":[60,73,138,173],"tesapl":[60,73,138,173],"tesaple":[60,73,138,173],"tesaplet":[60,138,173],"pre":[61],"pe":[65,66,67,68,166,167,168,169,170],"pek":[65,66,67,68,166,167,168,169,170],"peke":[65,66,67,68,166,167,168,169,170],"peker":[65,66,67,68,166,167,168,169,170],"pas":[70],"pase":[70],"pasek":[70],"tefe":[72],"tefer":[72],"tefere":[72],"teferem":[72],"teferemt":[72],"r":[79,181,182],"re":[79,181,182],"rek":[79],"rekt":[79],"kem":[80],"kemt":[80],"kemte":[80],"kemter":[80],"me":[84,85,86,87],"mes":[84,85,86,87],"mesa":[84,85,86,87],"mesak":[84,85,86,87],"mesake":[84,85,86,87],"opl":[88,89],"oplo":[88,89],"oploa":[88,89],"oploat":[88,89],"oploate":[88,89],"oploater":[88,89],"fef":[104,105,106,107,108,109],"sel":[110,111,112,113],"sele":[110,111,112,113],"selek":[110,111,112,113],"selekt":[110,111,112,113],"tr":[117,118,195],"tre":[117,118],"trek":[117,118],"treke":[117,118],"treker":[117,118],"l":[120,135,193,194],"la":[120,135],"lap":[120,135],"lape":[120,135],"lapel":[120,135],"emt":[121,122],"emte":[122],"emter":[122],"emterf":[122],"emterfa":[122],"emterfal":[122],"emterfals":[122],"kl":[131,132,139],"kla":[131,132,139],"klas":[131,132,139],"pl":[134],"pla":[134],"plam":[134],"tesk":[136],"teskr":[136],"teskre":[136],"teskrep":[136],"teskrept":[136],"teskrepte":[136],"teskrepteo":[136],"teskrepteom":[136],"ses":[137],"sese":[137],"klase":[139],"klases":[139],"po":[140,141,187,196,197],"pot":[140,141],"poto":[140,141],"potom":[140,141],"potoms":[140,141],"feto":[143],"fetot":[143],"fer":[145],"fert":[145],"ferte":[145],"fertek":[145],"ferteka":[145],"fertekal":[145],"et":[146,147,148],"ete":[146,147,148],"etet":[146,147,148],"eteto":[146,147,148],"etetor":[146,147,148],"emp":[149,150,151,152,153,154,155,156,157,158,159,160,161,162],"empo":[149,150,151,152,153,154,155,156,157,158,159,160,161,162],"empot":[149,150,151,152,153,154,155,156,157,158,159,160,161,162],"star":[177],"start":[177],"starte":[177],"startet":[177],"res":[181,182],"reso":[181,182],"resor":[181,182],"resork":[181,182],"resorke":[181,182],"pak":[185],"pakr":[185],"pakro":[185],"pakrom":[185],"pakromt":[185],"test":[186],"por":[187,196,197],"port":[187,196,197],"porte":[187,196,197],"porter":[187,196,197],"pat":[188],"pate":[188],"patem":[188],"patemk":[188],"ma":[189],"mar":[189],"mark":[189],"marke":[189],"markem":[189],"fomt":[190,191,192],"le":[193,194],"let":[193],"lete":[193],"leter":[193],"lem":[194],"leme":[194],"tro":[195],"trop":[195],"ek":[199],"ekt":[199],"fol":[200]},{"2":[168],"24":[168],"s":[5,6,60,61,72,81,82,85,96,98,102,105,156,161,174,190,193,195],"st":[5,55,60,85],"sta":[5,60],"stat":[5,60],"state":[5,60],"sl":[6,174],"slo":[6,174],"slot":[6,174],"slots":[6],"o":[8,9,10,11,12,25,59,62,63,64,73,112,118,159],"op":[8,9,10,11,12,59,62,63,64,112],"opt":[8,9,10,11,12,57,59,62,63,64,112],"opte":[8,9,10,11,12,57,59,62,63,64,112],"opteo":[8,9,10,11,12,57,59,62,63,64,112],"opteom":[8,9,10,11,12,57,59,62,63,64,112],"opteoms":[11,12,57,59,62,63,64],"r":[24,196],"ro":[24],"rot":[24],"rote":[24],"om":[25],"pref":[26,101,103,127,160,162],"prefe":[26,101,103,127,160,162],"prefes":[26,101,103,127,160,162],"e":[34,93,109,143,144,194],"ea":[34],"eat":[34],"eate":[34],"eater":[34],"kl":[35,117],"kle":[35,117],"klek":[35,117],"p":[38,39,41,95,101,103,127,147,155,160,162],"pa":[38,39,41,47,48,49,50,51,52,53,95,147,155,167],"par":[38,39,41,47,48,49,50,51,52,53],"a":[40,79,80,136],"am":[40,136],"amt":[40,136],"str":[55,85],"stre":[55,85],"strem":[55,85],"stremk":[55,85],"f":[56,58,74,87,113,131,132,164,165,197],"fa":[56,87,164,165,192],"far":[56,164,165],"fare":[56,164,165],"farea":[56,164,165],"faream":[56,164,165],"fareamt":[56,164,165],"fe":[58,74,191,197],"fet":[58,74,197],"se":[61,72,96,98,105,156,190],"sel":[61,98],"sele":[61,98],"selek":[61,98],"selekt":[61,98],"selekte":[61],"selektet":[61],"kom":[71,148,200],"komt":[71],"komte":[71],"komtem":[71],"komtemt":[71],"ses":[72,190],"sese":[72,190],"seses":[72],"ot":[73],"ots":[73],"otse":[73],"otset":[73],"otsete":[73],"k":[77,78,106,107,108,117,148,169,185,186,187,200],"ko":[77,106,148,169,185,186,187,200],"kos":[77,106,169],"kost":[77,106,169],"kosto":[77,106,169],"kostom":[77,106,169],"kr":[78,107],"kro":[78,107],"krop":[78,107],"krops":[78],"al":[79,80],"ale":[79,80],"alek":[79,80],"alekm":[79,80],"alekme":[79,80],"alekmet":[79,80],"so":[81,102,161],"sop":[81],"sopm":[81],"sopme":[81],"sopmem":[81],"sopmemo":[81],"sopmemos":[81],"sf":[82],"sfe":[82],"sfet":[82],"sfetk":[82],"sfetke":[82],"sfetkes":[82],"m":[83,92,151,170],"me":[83,170],"mes":[83],"mest":[83],"meste":[83],"mestet":[83],"fal":[87],"fals":[87],"false":[87],"t":[89,91,94,97,111],"te":[89,91,97,111,172],"tef":[89,111],"tefa":[89,111],"tefao":[89,111],"tefaol":[89,111],"tefaolt":[89,111],"tes":[91,97,172],"test":[91,97,172],"mo":[92,151],"mom":[92,151],"momp":[92,151],"mompe":[92,151],"momper":[92,151],"em":[93,109],"ema":[93,152],"emal":[93,152],"ta":[94,153,154],"tat":[94,153,154],"tate":[94,153,154],"pas":[95,147,155,167],"pasf":[95,155],"pasfo":[95,155],"pasfor":[95,155],"pasfort":[95,155],"sea":[96,156],"sear":[96,156],"seark":[96,156],"testa":[97],"testar":[97],"testare":[97],"testarea":[97],"komp":[99],"kompo":[99],"kompop":[99],"kompopo":[99],"kompopos":[99],"ke":[100,108],"kek":[100],"kekp":[100],"kekpo":[100],"kekpos":[100],"pr":[101,103,127,160,162],"pre":[101,103,127,160,162],"sof":[102,161],"sofe":[102,161],"sofes":[102,161],"sem":[105],"semp":[105],"sempl":[105],"semple":[105],"krope":[107],"kropet":[107],"kel":[108],"emp":[109],"empt":[109],"empte":[109],"fo":[113],"fot":[113],"fote":[113],"foter":[113],"of":[118],"ofe":[118],"ofer":[118],"ek":[143,144,194],"eko":[143,144],"ekom":[143,144],"pase":[147,167],"pasek":[147,167],"kome":[148],"komem":[148],"komemt":[148],"tatet":[154],"tatete":[154],"tatetem":[154],"tateteme":[154],"tel":[157],"tem":[158],"teme":[158],"or":[159],"orl":[159],"mem":[170],"kol":[185,186,187],"kolo":[185,186,187],"kolor":[185,186,187],"fek":[191],"fekt":[191],"fam":[192],"fame":[192],"famel":[192],"famele":[192],"sp":[193],"spa":[193],"spak":[193],"spake":[193],"spakem":[193],"spakemk":[193],"ekt":[194],"sa":[195],"sat":[195],"sato":[195],"satof":[195],"ra":[196],"rat":[196],"rate":[196],"rateo":[196],"rateos":[196],"komf":[200],"komfe":[200],"komfek":[200]},{"4":[131],"8":[132],"f":[9,10,12,61,62,63,64,70,71],"fe":[9,10,12,62,63,64,70,71],"fet":[9,10,12,62,63,64,70,71],"feto":[10,12],"fetot":[10,12],"o":[24,53,55,86,168,169],"op":[24,55,86,169],"opt":[24,55,169],"opte":[24,55,169],"opteo":[24,55,169],"opteom":[24,55,169],"k":[25,73],"kl":[25,73],"kle":[25,73],"klek":[25,73],"s":[26,49,52,83,101,103,108,160,162],"sl":[26,101,102,103,108,112,113,160,161,162],"slo":[26,101,102,103,108,112,113,160,161,162],"slot":[26,101,102,103,108,112,113,160,161,162],"e":[35,58,74,136],"ef":[35],"efe":[35],"efem":[35],"efemt":[35],"efemts":[35],"l":[40,154],"le":[40],"lem":[40],"leme":[40],"t":[48,50],"te":[48,50,67],"tef":[48],"tefa":[48],"tefao":[48],"tefaol":[48],"tefaolt":[48],"se":[49],"ses":[49],"sese":[49],"tem":[50,67],"teme":[50,67],"ko":[51],"kos":[51],"kost":[51],"kosto":[51],"kostom":[51],"so":[52,83],"sol":[52],"sole":[52],"solet":[52],"ot":[53],"otl":[53],"otle":[53],"otlem":[53],"otleme":[53],"opteoms":[55,169],"ek":[58,136],"eko":[58,136],"ekom":[58,136],"ekoms":[58],"fa":[61],"fal":[61],"falo":[61,87],"r":[68,107],"ra":[68],"ram":[68],"ramk":[68],"ramke":[68],"em":[74],"emt":[74],"emte":[74],"emter":[74],"emtera":[74],"emterak":[74],"emterakt":[74],"emterakte":[74],"emteraktef":[74],"emteraktefe":[74],"p":[77,172],"po":[77],"pot":[77],"poto":[77],"potom":[77],"sop":[83],"sopm":[83],"sopme":[83],"sopmem":[83],"sopmemo":[83],"sopmemos":[83],"opk":[86],"opke":[86],"opkek":[86],"opkekt":[86],"ro":[107],"rof":[107],"rofs":[107],"lo":[154],"lok":[154],"loka":[154],"lokal":[154],"or":[168],"ma":[170],"mas":[170],"pr":[172],"pro":[172],"prop":[172]},{"p":[9],"pr":[9],"pre":[9],"pref":[9],"prefe":[9],"prefes":[9],"sea":[10,12],"sear":[10,12],"seark":[10,12],"s":[12,64,71],"se":[12],"op":[25],"opt":[25],"opte":[25],"opteo":[25],"opteom":[25],"ko":[40,74],"kom":[40,74],"komp":[40,74],"kompo":[40,74],"t":[51],"te":[51],"tem":[51],"teme":[51],"f":[52,53,168],"fa":[52,53],"far":[52,53],"fare":[52,53],"farea":[52,53],"faream":[52,53],"fareamt":[52,53],"om":[62],"r":[63,170],"re":[63],"rem":[63],"remt":[63],"remte":[63],"remter":[63],"sl":[64,71],"slo":[64,71],"slot":[64,71],"slots":[64,71],"a":[70,103,162],"ak":[70],"akt":[70],"akte":[70],"akteo":[70],"akteom":[70],"akteoms":[70],"to":[73],"k":[74],"kompom":[74],"kompome":[74],"kompomem":[74],"kompomemt":[74],"kompomemts":[74],"e":[101,102],"ek":[101,102,160,161],"eko":[101,102,160,161],"ekom":[101,102,160,161],"af":[103,162],"afa":[103,162],"afat":[103,162],"afata":[103,162],"afatar":[103,162],"fo":[168],"for":[168],"form":[168],"forma":[168],"format":[168],"m":[169],"mo":[169],"ra":[170],"ram":[170],"ramk":[170],"ramke":[170]},{"sl":[9],"slo":[9],"slot":[9],"slots":[9],"kl":[62],"kle":[62],"klek":[62],"fo":[63],"fom":[63],"fomk":[63],"fomkt":[63],"fomkte":[63],"fomkteo":[63],"fomkteom":[63],"klo":[73],"klos":[73],"klose":[73],"e":[169],"em":[169],"emt":[169],"emte":[169],"emter":[169],"emterf":[169],"emterfa":[169],"emterfal":[169]},{"ke":[169],"kem":[169],"keme":[169],"kemer":[169],"kemera":[169],"kemerat":[169],"kemerate":[169],"kemerateo":[169],"kemerateom":[169]},{},{}]', "text.ctx": "[{}]" }, "idMap": { "0": { "id": "src-components-alert-alert-story-vue", "kind": "story" }, "1": { "id": "src-components-alert-alert-story-vue:src-components-alert-alert-story-vue-0", "kind": "variant" }, "2": { "id": "src-components-alert-alert-story-vue:src-components-alert-alert-story-vue-1", "kind": "variant" }, "3": { "id": "src-components-alert-alert-story-vue:src-components-alert-alert-story-vue-2", "kind": "variant" }, "4": { "id": "src-components-alert-alert-story-vue:src-components-alert-alert-story-vue-3", "kind": "variant" }, "5": { "id": "src-components-alert-alert-story-vue:src-components-alert-alert-story-vue-4", "kind": "variant" }, "6": { "id": "src-components-alert-alert-story-vue:src-components-alert-alert-story-vue-5", "kind": "variant" }, "7": { "id": "src-components-autocomplete-autocomplete-story-vue", "kind": "story" }, "8": { "id": "src-components-autocomplete-autocomplete-story-vue:src-components-autocomplete-autocomplete-story-vue-0", "kind": "variant" }, "9": { "id": "src-components-autocomplete-autocomplete-story-vue:src-components-autocomplete-autocomplete-story-vue-1", "kind": "variant" }, "10": { "id": "src-components-autocomplete-autocomplete-story-vue:src-components-autocomplete-autocomplete-story-vue-2", "kind": "variant" }, "11": { "id": "src-components-autocomplete-autocomplete-story-vue:src-components-autocomplete-autocomplete-story-vue-3", "kind": "variant" }, "12": { "id": "src-components-autocomplete-autocomplete-story-vue:src-components-autocomplete-autocomplete-story-vue-4", "kind": "variant" }, "13": { "id": "src-components-avatar-avatar-story-vue", "kind": "story" }, "14": { "id": "src-components-avatar-avatar-story-vue:src-components-avatar-avatar-story-vue-0", "kind": "variant" }, "15": { "id": "src-components-avatar-avatar-story-vue:src-components-avatar-avatar-story-vue-1", "kind": "variant" }, "16": { "id": "src-components-avatar-avatar-story-vue:src-components-avatar-avatar-story-vue-2", "kind": "variant" }, "17": { "id": "src-components-avatar-avatar-story-vue:src-components-avatar-avatar-story-vue-3", "kind": "variant" }, "18": { "id": "src-components-badge-badge-story-vue", "kind": "story" }, "19": { "id": "src-components-badge-badge-story-vue:src-components-badge-badge-story-vue-0", "kind": "variant" }, "20": { "id": "src-components-badge-badge-story-vue:src-components-badge-badge-story-vue-1", "kind": "variant" }, "21": { "id": "src-components-badge-badge-story-vue:src-components-badge-badge-story-vue-2", "kind": "variant" }, "22": { "id": "src-components-badge-badge-story-vue:src-components-badge-badge-story-vue-3", "kind": "variant" }, "23": { "id": "src-components-breadcrumbs-breadcrumbs-story-vue", "kind": "story" }, "24": { "id": "src-components-breadcrumbs-breadcrumbs-story-vue:src-components-breadcrumbs-breadcrumbs-story-vue-0", "kind": "variant" }, "25": { "id": "src-components-breadcrumbs-breadcrumbs-story-vue:src-components-breadcrumbs-breadcrumbs-story-vue-1", "kind": "variant" }, "26": { "id": "src-components-breadcrumbs-breadcrumbs-story-vue:src-components-breadcrumbs-breadcrumbs-story-vue-2", "kind": "variant" }, "27": { "id": "src-components-button-button-story-vue", "kind": "story" }, "28": { "id": "src-components-button-button-story-vue:src-components-button-button-story-vue-0", "kind": "variant" }, "29": { "id": "src-components-button-button-story-vue:src-components-button-button-story-vue-1", "kind": "variant" }, "30": { "id": "src-components-button-button-story-vue:src-components-button-button-story-vue-2", "kind": "variant" }, "31": { "id": "src-components-button-button-story-vue:src-components-button-button-story-vue-3", "kind": "variant" }, "32": { "id": "src-components-calendar-calendar-story-vue", "kind": "story" }, "33": { "id": "src-components-calendar-calendar-story-vue:src-components-calendar-calendar-story-vue-0", "kind": "variant" }, "34": { "id": "src-components-calendar-calendar-story-vue:src-components-calendar-calendar-story-vue-1", "kind": "variant" }, "35": { "id": "src-components-calendar-calendar-story-vue:src-components-calendar-calendar-story-vue-2", "kind": "variant" }, "36": { "id": "src-components-charts-charts-story-vue", "kind": "story" }, "37": { "id": "src-components-charts-charts-story-vue:src-components-charts-charts-story-vue-0", "kind": "variant" }, "38": { "id": "src-components-charts-charts-story-vue:src-components-charts-charts-story-vue-1", "kind": "variant" }, "39": { "id": "src-components-charts-charts-story-vue:src-components-charts-charts-story-vue-2", "kind": "variant" }, "40": { "id": "src-components-charts-charts-story-vue:src-components-charts-charts-story-vue-3", "kind": "variant" }, "41": { "id": "src-components-charts-charts-story-vue:src-components-charts-charts-story-vue-4", "kind": "variant" }, "42": { "id": "src-components-charts-charts-story-vue:src-components-charts-charts-story-vue-5", "kind": "variant" }, "43": { "id": "src-components-charts-charts-story-vue:src-components-charts-charts-story-vue-6", "kind": "variant" }, "44": { "id": "src-components-charts-charts-story-vue:src-components-charts-charts-story-vue-7", "kind": "variant" }, "45": { "id": "src-components-checkbox-checkbox-story-vue", "kind": "story" }, "46": { "id": "src-components-checkbox-checkbox-story-vue:_default", "kind": "variant" }, "47": { "id": "src-components-circularprogressbar-circularprogressbar-story-vue", "kind": "story" }, "48": { "id": "src-components-circularprogressbar-circularprogressbar-story-vue:src-components-circularprogressbar-circularprogressbar-story-vue-0", "kind": "variant" }, "49": { "id": "src-components-circularprogressbar-circularprogressbar-story-vue:src-components-circularprogressbar-circularprogressbar-story-vue-1", "kind": "variant" }, "50": { "id": "src-components-circularprogressbar-circularprogressbar-story-vue:src-components-circularprogressbar-circularprogressbar-story-vue-2", "kind": "variant" }, "51": { "id": "src-components-circularprogressbar-circularprogressbar-story-vue:src-components-circularprogressbar-circularprogressbar-story-vue-3", "kind": "variant" }, "52": { "id": "src-components-circularprogressbar-circularprogressbar-story-vue:src-components-circularprogressbar-circularprogressbar-story-vue-4", "kind": "variant" }, "53": { "id": "src-components-circularprogressbar-circularprogressbar-story-vue:src-components-circularprogressbar-circularprogressbar-story-vue-5", "kind": "variant" }, "54": { "id": "src-components-combobox-combobox-story-vue", "kind": "story" }, "55": { "id": "src-components-combobox-combobox-story-vue:src-components-combobox-combobox-story-vue-0", "kind": "variant" }, "56": { "id": "src-components-combobox-combobox-story-vue:src-components-combobox-combobox-story-vue-1", "kind": "variant" }, "57": { "id": "src-components-combobox-combobox-story-vue:src-components-combobox-combobox-story-vue-2", "kind": "variant" }, "58": { "id": "src-components-combobox-combobox-story-vue:src-components-combobox-combobox-story-vue-3", "kind": "variant" }, "59": { "id": "src-components-combobox-combobox-story-vue:src-components-combobox-combobox-story-vue-4", "kind": "variant" }, "60": { "id": "src-components-combobox-combobox-story-vue:src-components-combobox-combobox-story-vue-5", "kind": "variant" }, "61": { "id": "src-components-combobox-combobox-story-vue:src-components-combobox-combobox-story-vue-6", "kind": "variant" }, "62": { "id": "src-components-combobox-combobox-story-vue:src-components-combobox-combobox-story-vue-7", "kind": "variant" }, "63": { "id": "src-components-combobox-combobox-story-vue:src-components-combobox-combobox-story-vue-8", "kind": "variant" }, "64": { "id": "src-components-combobox-combobox-story-vue:src-components-combobox-combobox-story-vue-9", "kind": "variant" }, "65": { "id": "src-components-datepicker-datepicker-story-vue", "kind": "story" }, "66": { "id": "src-components-datepicker-datepicker-story-vue:src-components-datepicker-datepicker-story-vue-0", "kind": "variant" }, "67": { "id": "src-components-datepicker-datepicker-story-vue:src-components-datepicker-datepicker-story-vue-1", "kind": "variant" }, "68": { "id": "src-components-datepicker-datepicker-story-vue:src-components-datepicker-datepicker-story-vue-2", "kind": "variant" }, "69": { "id": "src-components-dialog-dialog-story-vue", "kind": "story" }, "70": { "id": "src-components-dialog-dialog-story-vue:src-components-dialog-dialog-story-vue-0", "kind": "variant" }, "71": { "id": "src-components-dialog-dialog-story-vue:src-components-dialog-dialog-story-vue-1", "kind": "variant" }, "72": { "id": "src-components-dialog-dialog-story-vue:src-components-dialog-dialog-story-vue-2", "kind": "variant" }, "73": { "id": "src-components-dialog-dialog-story-vue:src-components-dialog-dialog-story-vue-3", "kind": "variant" }, "74": { "id": "src-components-dialog-dialog-story-vue:src-components-dialog-dialog-story-vue-4", "kind": "variant" }, "75": { "id": "src-components-dropdown-dropdown-story-vue", "kind": "story" }, "76": { "id": "src-components-dropdown-dropdown-story-vue:src-components-dropdown-dropdown-story-vue-0", "kind": "variant" }, "77": { "id": "src-components-dropdown-dropdown-story-vue:src-components-dropdown-dropdown-story-vue-1", "kind": "variant" }, "78": { "id": "src-components-dropdown-dropdown-story-vue:src-components-dropdown-dropdown-story-vue-2", "kind": "variant" }, "79": { "id": "src-components-dropdown-dropdown-story-vue:src-components-dropdown-dropdown-story-vue-3", "kind": "variant" }, "80": { "id": "src-components-dropdown-dropdown-story-vue:src-components-dropdown-dropdown-story-vue-4", "kind": "variant" }, "81": { "id": "src-components-dropdown-dropdown-story-vue:src-components-dropdown-dropdown-story-vue-5", "kind": "variant" }, "82": { "id": "src-components-dropdown-dropdown-story-vue:src-components-dropdown-dropdown-story-vue-6", "kind": "variant" }, "83": { "id": "src-components-dropdown-dropdown-story-vue:src-components-dropdown-dropdown-story-vue-7", "kind": "variant" }, "84": { "id": "src-components-errormessage-errormessage-story-vue", "kind": "story" }, "85": { "id": "src-components-errormessage-errormessage-story-vue:src-components-errormessage-errormessage-story-vue-0", "kind": "variant" }, "86": { "id": "src-components-errormessage-errormessage-story-vue:src-components-errormessage-errormessage-story-vue-1", "kind": "variant" }, "87": { "id": "src-components-errormessage-errormessage-story-vue:src-components-errormessage-errormessage-story-vue-2", "kind": "variant" }, "88": { "id": "src-components-fileuploader-fileuploader-story-vue", "kind": "story" }, "89": { "id": "src-components-fileuploader-fileuploader-story-vue:_default", "kind": "variant" }, "90": { "id": "src-components-formcontrol-formcontrol-story-vue", "kind": "story" }, "91": { "id": "src-components-formcontrol-formcontrol-story-vue:src-components-formcontrol-formcontrol-story-vue-0", "kind": "variant" }, "92": { "id": "src-components-formcontrol-formcontrol-story-vue:src-components-formcontrol-formcontrol-story-vue-1", "kind": "variant" }, "93": { "id": "src-components-formcontrol-formcontrol-story-vue:src-components-formcontrol-formcontrol-story-vue-2", "kind": "variant" }, "94": { "id": "src-components-formcontrol-formcontrol-story-vue:src-components-formcontrol-formcontrol-story-vue-3", "kind": "variant" }, "95": { "id": "src-components-formcontrol-formcontrol-story-vue:src-components-formcontrol-formcontrol-story-vue-4", "kind": "variant" }, "96": { "id": "src-components-formcontrol-formcontrol-story-vue:src-components-formcontrol-formcontrol-story-vue-5", "kind": "variant" }, "97": { "id": "src-components-formcontrol-formcontrol-story-vue:src-components-formcontrol-formcontrol-story-vue-6", "kind": "variant" }, "98": { "id": "src-components-formcontrol-formcontrol-story-vue:src-components-formcontrol-formcontrol-story-vue-7", "kind": "variant" }, "99": { "id": "src-components-formcontrol-formcontrol-story-vue:src-components-formcontrol-formcontrol-story-vue-8", "kind": "variant" }, "100": { "id": "src-components-formcontrol-formcontrol-story-vue:src-components-formcontrol-formcontrol-story-vue-9", "kind": "variant" }, "101": { "id": "src-components-formcontrol-formcontrol-story-vue:src-components-formcontrol-formcontrol-story-vue-10", "kind": "variant" }, "102": { "id": "src-components-formcontrol-formcontrol-story-vue:src-components-formcontrol-formcontrol-story-vue-11", "kind": "variant" }, "103": { "id": "src-components-formcontrol-formcontrol-story-vue:src-components-formcontrol-formcontrol-story-vue-12", "kind": "variant" }, "104": { "id": "src-components-listview-listview-story-vue", "kind": "story" }, "105": { "id": "src-components-listview-listview-story-vue:src-components-listview-listview-story-vue-0", "kind": "variant" }, "106": { "id": "src-components-listview-listview-story-vue:src-components-listview-listview-story-vue-1", "kind": "variant" }, "107": { "id": "src-components-listview-listview-story-vue:src-components-listview-listview-story-vue-2", "kind": "variant" }, "108": { "id": "src-components-listview-listview-story-vue:src-components-listview-listview-story-vue-3", "kind": "variant" }, "109": { "id": "src-components-listview-listview-story-vue:src-components-listview-listview-story-vue-4", "kind": "variant" }, "110": { "id": "src-components-multiselect-multiselect-story-vue", "kind": "story" }, "111": { "id": "src-components-multiselect-multiselect-story-vue:src-components-multiselect-multiselect-story-vue-0", "kind": "variant" }, "112": { "id": "src-components-multiselect-multiselect-story-vue:src-components-multiselect-multiselect-story-vue-1", "kind": "variant" }, "113": { "id": "src-components-multiselect-multiselect-story-vue:src-components-multiselect-multiselect-story-vue-2", "kind": "variant" }, "114": { "id": "src-components-password-password-story-vue", "kind": "story" }, "115": { "id": "src-components-password-password-story-vue:_default", "kind": "variant" }, "116": { "id": "src-components-popover-popover-story-vue", "kind": "story" }, "117": { "id": "src-components-popover-popover-story-vue:src-components-popover-popover-story-vue-0", "kind": "variant" }, "118": { "id": "src-components-popover-popover-story-vue:src-components-popover-popover-story-vue-1", "kind": "variant" }, "119": { "id": "src-components-progress-progress-story-vue", "kind": "story" }, "120": { "id": "src-components-progress-progress-story-vue:src-components-progress-progress-story-vue-0", "kind": "variant" }, "121": { "id": "src-components-progress-progress-story-vue:src-components-progress-progress-story-vue-1", "kind": "variant" }, "122": { "id": "src-components-progress-progress-story-vue:src-components-progress-progress-story-vue-2", "kind": "variant" }, "123": { "id": "src-components-rating-rating-story-vue", "kind": "story" }, "124": { "id": "src-components-rating-rating-story-vue:src-components-rating-rating-story-vue-0", "kind": "variant" }, "125": { "id": "src-components-select-select-story-vue", "kind": "story" }, "126": { "id": "src-components-select-select-story-vue:src-components-select-select-story-vue-0", "kind": "variant" }, "127": { "id": "src-components-select-select-story-vue:src-components-select-select-story-vue-1", "kind": "variant" }, "128": { "id": "src-components-sidebar-sidebar-story-vue", "kind": "story" }, "129": { "id": "src-components-sidebar-sidebar-story-vue:src-components-sidebar-sidebar-story-vue-0", "kind": "variant" }, "130": { "id": "src-components-spinner-spinner-story-vue", "kind": "story" }, "131": { "id": "src-components-spinner-spinner-story-vue:src-components-spinner-spinner-story-vue-0", "kind": "variant" }, "132": { "id": "src-components-spinner-spinner-story-vue:src-components-spinner-spinner-story-vue-1", "kind": "variant" }, "133": { "id": "src-components-switch-switch-story-vue", "kind": "story" }, "134": { "id": "src-components-switch-switch-story-vue:src-components-switch-switch-story-vue-0", "kind": "variant" }, "135": { "id": "src-components-switch-switch-story-vue:src-components-switch-switch-story-vue-1", "kind": "variant" }, "136": { "id": "src-components-switch-switch-story-vue:src-components-switch-switch-story-vue-2", "kind": "variant" }, "137": { "id": "src-components-switch-switch-story-vue:src-components-switch-switch-story-vue-3", "kind": "variant" }, "138": { "id": "src-components-switch-switch-story-vue:src-components-switch-switch-story-vue-4", "kind": "variant" }, "139": { "id": "src-components-switch-switch-story-vue:src-components-switch-switch-story-vue-5", "kind": "variant" }, "140": { "id": "src-components-tabbuttons-tabbuttons-story-vue", "kind": "story" }, "141": { "id": "src-components-tabbuttons-tabbuttons-story-vue:src-components-tabbuttons-tabbuttons-story-vue-0", "kind": "variant" }, "142": { "id": "src-components-tabs-tabs-story-vue", "kind": "story" }, "143": { "id": "src-components-tabs-tabs-story-vue:src-components-tabs-tabs-story-vue-0", "kind": "variant" }, "144": { "id": "src-components-tabs-tabs-story-vue:src-components-tabs-tabs-story-vue-1", "kind": "variant" }, "145": { "id": "src-components-tabs-tabs-story-vue:src-components-tabs-tabs-story-vue-2", "kind": "variant" }, "146": { "id": "src-components-texteditor-texteditor-story-vue", "kind": "story" }, "147": { "id": "src-components-texteditor-texteditor-story-vue:src-components-texteditor-texteditor-story-vue-0", "kind": "variant" }, "148": { "id": "src-components-texteditor-texteditor-story-vue:src-components-texteditor-texteditor-story-vue-1", "kind": "variant" }, "149": { "id": "src-components-textinput-textinput-story-vue", "kind": "story" }, "150": { "id": "src-components-textinput-textinput-story-vue:src-components-textinput-textinput-story-vue-0", "kind": "variant" }, "151": { "id": "src-components-textinput-textinput-story-vue:src-components-textinput-textinput-story-vue-1", "kind": "variant" }, "152": { "id": "src-components-textinput-textinput-story-vue:src-components-textinput-textinput-story-vue-2", "kind": "variant" }, "153": { "id": "src-components-textinput-textinput-story-vue:src-components-textinput-textinput-story-vue-3", "kind": "variant" }, "154": { "id": "src-components-textinput-textinput-story-vue:src-components-textinput-textinput-story-vue-4", "kind": "variant" }, "155": { "id": "src-components-textinput-textinput-story-vue:src-components-textinput-textinput-story-vue-5", "kind": "variant" }, "156": { "id": "src-components-textinput-textinput-story-vue:src-components-textinput-textinput-story-vue-6", "kind": "variant" }, "157": { "id": "src-components-textinput-textinput-story-vue:src-components-textinput-textinput-story-vue-7", "kind": "variant" }, "158": { "id": "src-components-textinput-textinput-story-vue:src-components-textinput-textinput-story-vue-8", "kind": "variant" }, "159": { "id": "src-components-textinput-textinput-story-vue:src-components-textinput-textinput-story-vue-9", "kind": "variant" }, "160": { "id": "src-components-textinput-textinput-story-vue:src-components-textinput-textinput-story-vue-10", "kind": "variant" }, "161": { "id": "src-components-textinput-textinput-story-vue:src-components-textinput-textinput-story-vue-11", "kind": "variant" }, "162": { "id": "src-components-textinput-textinput-story-vue:src-components-textinput-textinput-story-vue-12", "kind": "variant" }, "163": { "id": "src-components-textarea-textarea-story-vue", "kind": "story" }, "164": { "id": "src-components-textarea-textarea-story-vue:src-components-textarea-textarea-story-vue-0", "kind": "variant" }, "165": { "id": "src-components-textarea-textarea-story-vue:src-components-textarea-textarea-story-vue-1", "kind": "variant" }, "166": { "id": "src-components-timepicker-timepicker-story-vue", "kind": "story" }, "167": { "id": "src-components-timepicker-timepicker-story-vue:src-components-timepicker-timepicker-story-vue-0", "kind": "variant" }, "168": { "id": "src-components-timepicker-timepicker-story-vue:src-components-timepicker-timepicker-story-vue-1", "kind": "variant" }, "169": { "id": "src-components-timepicker-timepicker-story-vue:src-components-timepicker-timepicker-story-vue-2", "kind": "variant" }, "170": { "id": "src-components-timepicker-timepicker-story-vue:src-components-timepicker-timepicker-story-vue-3", "kind": "variant" }, "171": { "id": "src-components-tooltip-tooltip-story-vue", "kind": "story" }, "172": { "id": "src-components-tooltip-tooltip-story-vue:src-components-tooltip-tooltip-story-vue-0", "kind": "variant" }, "173": { "id": "src-components-tooltip-tooltip-story-vue:src-components-tooltip-tooltip-story-vue-1", "kind": "variant" }, "174": { "id": "src-components-tooltip-tooltip-story-vue:src-components-tooltip-tooltip-story-vue-2", "kind": "variant" }, "175": { "id": "src-components-tree-tree-story-vue", "kind": "story" }, "176": { "id": "src-components-tree-tree-story-vue:src-components-tree-tree-story-vue-0", "kind": "variant" }, "177": { "id": "docs-getting-started-story-js", "kind": "story" }, "178": { "id": "docs-introduction-story-js", "kind": "story" }, "179": { "id": "docs-other-directives-story-js", "kind": "story" }, "180": { "id": "docs-other-utilities-story-js", "kind": "story" }, "181": { "id": "docs-resources-document-resource-story-js", "kind": "story" }, "182": { "id": "docs-resources-list-resource-story-js", "kind": "story" }, "183": { "id": "docs-resources-resource-story-js", "kind": "story" }, "184": { "id": "tailwind", "kind": "story" }, "185": { "id": "tailwind:background-color", "kind": "variant" }, "186": { "id": "tailwind:text-color", "kind": "variant" }, "187": { "id": "tailwind:border-color", "kind": "variant" }, "188": { "id": "tailwind:padding", "kind": "variant" }, "189": { "id": "tailwind:margin", "kind": "variant" }, "190": { "id": "tailwind:font-size", "kind": "variant" }, "191": { "id": "tailwind:font-weight", "kind": "variant" }, "192": { "id": "tailwind:font-family", "kind": "variant" }, "193": { "id": "tailwind:letter-spacing", "kind": "variant" }, "194": { "id": "tailwind:line-height", "kind": "variant" }, "195": { "id": "tailwind:drop-shadow", "kind": "variant" }, "196": { "id": "tailwind:border-radius", "kind": "variant" }, "197": { "id": "tailwind:border-width", "kind": "variant" }, "198": { "id": "tailwind:width", "kind": "variant" }, "199": { "id": "tailwind:height", "kind": "variant" }, "200": { "id": "tailwind:full-config", "kind": "variant" } } };
const searchData = markRaw(searchData$1);
const _hoisted_1 = {
  key: 1,
  class: "htw-max-h-[400px] htw-overflow-y-auto htw-rounded-b-lg"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SearchPane",
  props: {
    shown: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    close: () => true
  },
  setup(__props, { emit: __emit }) {
    const DocSearchData = () => __vitePreload(() => import("./search-docs-data-CrI_gL82.js"), true ? __vite__mapDeps([0,1]) : void 0);
    const props = __props;
    const emit = __emit;
    function close() {
      emit("close");
    }
    const input = ref();
    const { focused } = useFocus(input, {
      initialValue: true
    });
    watch(() => props.shown, (value) => {
      if (value) {
        requestAnimationFrame(() => {
          focused.value = true;
          input.value.select();
        });
      }
    });
    const searchInputText = ref("");
    const rateLimitedSearch = refDebounced(searchInputText, 50);
    const storyStore = useStoryStore();
    let titleSearchIndex;
    let titleIdMap;
    function createIndex() {
      return new flexsearch_bundleExports.Document({
        preset: "match",
        document: {
          id: "id",
          index: [
            "text"
          ]
        },
        worker: true,
        charset,
        language,
        tokenize: "forward"
      });
    }
    async function loadSearchIndex(data) {
      titleSearchIndex = createIndex();
      for (const key of Object.keys(data.index)) {
        await titleSearchIndex.import(key, data.index[key]);
      }
      titleIdMap = data.idMap;
    }
    loadSearchIndex(searchData);
    let docSearchIndex;
    let docIdMap;
    async function loadDocSearchIndex() {
      async function load(data) {
        docSearchIndex = createIndex();
        for (const key of Object.keys(data.index)) {
          await docSearchIndex.import(key, data.index[key]);
        }
        docIdMap = data.idMap;
        if (rateLimitedSearch.value) {
          searchOnDocField(rateLimitedSearch.value);
        }
      }
      const searchDataModule = await DocSearchData();
      load(searchDataModule.searchData);
      searchDataModule.onUpdate((searchData2) => {
        load(searchData2);
      });
    }
    loadDocSearchIndex();
    const titleResults = ref([]);
    watch(rateLimitedSearch, async (value) => {
      const list = [];
      const raw = await titleSearchIndex.search(value);
      let rank = 0;
      for (const field of raw) {
        for (const id of field.result) {
          const idMapData = titleIdMap[id];
          if (!idMapData)
            continue;
          switch (idMapData.kind) {
            case "story": {
              list.push(storyResultFactory(storyStore.getStoryById(idMapData.id), rank));
              rank++;
              break;
            }
            case "variant": {
              const [storyId] = idMapData.id.split(":");
              const story = storyStore.getStoryById(storyId);
              const variant = storyStore.getVariantById(idMapData.id);
              list.push(variantResultFactory(story, variant, rank));
              rank++;
              break;
            }
          }
        }
      }
      titleResults.value = list;
    });
    const docsResults = ref([]);
    async function searchOnDocField(query) {
      if (docSearchIndex) {
        const list = [];
        const raw = await docSearchIndex.search(query);
        let rank = 0;
        for (const field of raw) {
          for (const id of field.result) {
            const idMapData = docIdMap[id];
            if (!idMapData)
              continue;
            switch (idMapData.kind) {
              case "story": {
                list.push(storyResultFactory(storyStore.getStoryById(idMapData.id), rank, "docs"));
                rank++;
                break;
              }
            }
          }
        }
        docsResults.value = list;
      }
    }
    watch(rateLimitedSearch, searchOnDocField);
    function storyResultFactory(story, rank, type = "title") {
      return {
        kind: "story",
        rank,
        id: `story:${story.id}`,
        title: story.title,
        route: {
          name: "story",
          params: {
            storyId: story.id
          },
          query: {
            ...type === "docs" ? { tab: "docs" } : {}
          }
        },
        path: story.file.path.slice(0, -1),
        icon: story.icon,
        iconColor: story.iconColor
      };
    }
    function variantResultFactory(story, variant, rank, type = "title") {
      return {
        kind: "variant",
        rank,
        id: `variant:${story.id}:${variant.id}`,
        title: variant.title,
        route: {
          name: "story",
          params: {
            storyId: story.id
          },
          query: {
            variantId: variant.id,
            ...type === "docs" ? { tab: "docs" } : {}
          }
        },
        path: [...story.file.path ?? [], story.title],
        icon: variant.icon,
        iconColor: variant.iconColor
      };
    }
    const commandResults = computed(() => {
      return [];
    });
    useCommandStore();
    const results = computed(() => {
      const list = [
        ...commandResults.value,
        ...titleResults.value
      ];
      const seen = {};
      for (const r of titleResults.value) {
        seen[r.id] = true;
      }
      for (const r of docsResults.value) {
        if (!seen[r.id]) {
          list.push(r);
        }
      }
      return list;
    });
    const {
      selectedIndex,
      selectNext,
      selectPrevious
    } = useSelection(results);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createBaseVNode("div", {
          class: "histoire-search-pane htw-flex htw-items-center htw-gap-4 htw-pl-6 htw-border htw-border-transparent focus-visible:htw-border-primary-500",
          onClick: _cache[4] || (_cache[4] = ($event) => focused.value = true)
        }, [
          createVNode(unref(Icon), {
            icon: "carbon:search",
            class: "flex-none htw-w-4 htw-h-4"
          }),
          withDirectives(createBaseVNode("input", {
            ref_key: "input",
            ref: input,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => searchInputText.value = $event),
            placeholder: "Search for stories, variants...",
            class: "htw-bg-transparent htw-w-full htw-flex-1 htw-pl-0 htw-pr-6 htw-py-4 htw-outline-none",
            onKeydown: [
              _cache[1] || (_cache[1] = withKeys(withModifiers(($event) => unref(selectNext)(), ["prevent"]), ["down"])),
              _cache[2] || (_cache[2] = withKeys(withModifiers(($event) => unref(selectPrevious)(), ["prevent"]), ["up"])),
              _cache[3] || (_cache[3] = withKeys(($event) => close(), ["escape"]))
            ]
          }, null, 544), [
            [vModelText, searchInputText.value]
          ])
        ]),
        unref(rateLimitedSearch) && !results.value.length ? (openBlock(), createBlock(BaseEmpty, {
          key: 0,
          class: "no-animation"
        }, {
          default: withCtx(() => [
            createTextVNode(" No results ")
          ]),
          _: 1
        })) : results.value.length ? (openBlock(), createElementBlock("div", _hoisted_1, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(results.value, (result, index) => {
            return openBlock(), createBlock(SearchItem, {
              key: result.id,
              result,
              selected: index === unref(selectedIndex),
              onClose: _cache[5] || (_cache[5] = ($event) => close())
            }, null, 8, ["result", "selected"]);
          }), 128))
        ])) : createCommentVNode("", true)
      ], 64);
    };
  }
});
export {
  _sfc_main as default
};
