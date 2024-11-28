import { r as ref, k as watch, c as computed, d as defineComponent, o as openBlock, b as createElementBlock, a6 as renderSlot, n as normalizeClass, m as withKeys, q as createBlock, g as unref, I as Icon, e as createVNode, f as createBaseVNode, D as createTextVNode, t as toDisplayString, F as Fragment, p as renderList, h as createCommentVNode, u as useCssVars, aj as toRefs, ak as useRouter, w as withCtx, a2 as markRaw, cm as useFocus, cn as refDebounced, B as withDirectives, ad as vModelText, ac as withModifiers, _ as __vitePreload, co as flexsearch_bundleExports } from "./vendor-7778cb0e.js";
import { u as useStoryStore } from "./story-3d24fa86.js";
import { B as BaseEmpty } from "./BaseEmpty.vue-3a7b4ff3.js";
import "./GenericMountStory.vue2-8b951b9f.js";
import { o as onKeyboardShortcut, u as useCommandStore } from "./bundle-main-55442d36.js";
import { _ as _export_sfc, u as useScrollOnActive, B as BaseListItemLink } from "./MobileOverlay.vue2-d24cde20.js";
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
let searchData$1 = { "index": { "reg": '{"0":1,"1":1,"2":1,"3":1,"4":1,"5":1,"6":1,"7":1,"8":1,"9":1,"10":1,"11":1,"12":1,"13":1,"14":1,"15":1,"16":1,"17":1,"18":1,"19":1,"20":1,"21":1,"22":1,"23":1,"24":1,"25":1,"26":1,"27":1,"28":1,"29":1,"30":1,"31":1,"32":1,"33":1,"34":1,"35":1,"36":1,"37":1,"38":1,"39":1,"40":1,"41":1,"42":1,"43":1,"44":1,"45":1,"46":1,"47":1,"48":1,"49":1,"50":1,"51":1,"52":1,"53":1,"54":1,"55":1,"56":1,"57":1,"58":1,"59":1,"60":1,"61":1,"62":1,"63":1,"64":1,"65":1,"66":1,"67":1,"68":1,"69":1,"70":1,"71":1,"72":1,"73":1,"74":1,"75":1,"76":1,"77":1,"78":1,"79":1,"80":1,"81":1,"82":1,"83":1,"84":1,"85":1,"86":1,"87":1,"88":1,"89":1,"90":1,"91":1,"92":1,"93":1,"94":1,"95":1,"96":1,"97":1,"98":1,"99":1,"100":1,"101":1,"102":1,"103":1,"104":1,"105":1,"106":1,"107":1,"108":1,"109":1,"110":1,"111":1,"112":1,"113":1,"114":1,"115":1,"116":1,"117":1,"118":1,"119":1,"120":1,"121":1,"122":1,"123":1,"124":1,"125":1,"126":1,"127":1,"128":1,"129":1,"130":1,"131":1,"132":1,"133":1,"134":1,"135":1,"136":1,"137":1,"138":1,"139":1,"140":1,"141":1,"142":1,"143":1}', "text.cfg": '{"doc":0,"opt":1}', "text.map": '[{"a":[0,1,2,3,4,5,6,7,8,9,10],"ao":[0,1,2,3,4,5],"aot":[0,1,2,3,4,5],"aoto":[0,1,2,3,4,5],"aotok":[0,1,2,3,4,5],"aotoko":[0,1,2,3,4,5],"aotokom":[0,1,2,3,4,5],"aotokomp":[0,1,2,3,4,5],"aotokompl":[0,1,2,3,4,5],"aotokomple":[0,1,2,3,4,5],"aotokomplet":[0,1,2,3,4,5],"aotokomplete":[0,1,2,3,4,5],"af":[6,7,8,9,10],"afa":[6,7,8,9,10],"afat":[6,7,8,9,10],"afata":[6,7,8,9,10],"afatar":[6,7,8,9,10],"p":[11,12,13,14,15,16,17,18,19,70,71,72,73,74,75,76,107,108,109,110,111],"pa":[11,12,13,14,15],"pat":[11,12,13,14,15],"patk":[11,12,13,14,15],"patke":[11,12,13,14,15],"pr":[16,17,18,19,73,74,75,76],"pre":[16,17,18,19],"prea":[16,17,18,19],"preat":[16,17,18,19],"preatk":[16,17,18,19],"preatkr":[16,17,18,19],"preatkro":[16,17,18,19],"preatkrom":[16,17,18,19],"preatkromp":[16,17,18,19],"preatkromps":[16,17,18,19],"k":[20,21,22,23,24,25,26,27,28,29,30,31,32,120],"ka":[20,21,22,23],"kal":[20,21,22,23],"kale":[20,21,22,23],"kalem":[20,21,22,23],"kalemt":[20,21,22,23],"kalemta":[20,21,22,23],"kalemtar":[20,21,22,23],"ke":[24,25,26,27,28,29,30,31,32,120],"kek":[24,25],"kekp":[24,25],"kekpo":[24,25],"kekpos":[24,25],"ker":[26,27,28,29,30,31,32],"kerk":[26,27,28,29,30,31,32],"kerko":[26,27,28,29,30,31,32],"kerkol":[26,27,28,29,30,31,32],"kerkola":[26,27,28,29,30,31,32],"kerkolar":[26,27,28,29,30,31,32],"t":[33,34,35,36,37,38,39,40,41,42,43,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,114,115,116,117,118,119,122,124,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143],"ta":[33,34,35,36,85,86,87,88,89,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143],"tat":[33,34,35,36],"tate":[33,34,35,36],"te":[37,38,39,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,122],"tea":[37,38,39],"teal":[37,38,39],"tealo":[37,38,39],"tealok":[37,38,39],"tr":[40,41,42,43,118,119],"tro":[40,41,42,43],"trop":[40,41,42,43],"tropt":[40,41,42,43],"tropto":[40,41,42,43],"troptof":[40,41,42,43],"troptofm":[40,41,42,43],"e":[44,45,46,47,121],"er":[44,45,46,47],"ero":[44,45,46,47],"eror":[44,45,46,47],"f":[48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63],"fe":[48,49],"fel":[48,49],"fele":[48,49],"fo":[50,51,52,53,54,55,56,57,58,59,60,61,62,63],"for":[50,51,52,53,54,55,56,57,58,59,60,61,62,63],"form":[50,51,52,53,54,55,56,57,58,59,60,61,62,63],"l":[64,65,66,67,68,69,125],"le":[64,65,66,67,68,69,125],"les":[64,65,66,67,68,69,125],"lest":[64,65,66,67,68,69,125],"po":[70,71,72,107,108,109,110,111],"pop":[70,71,72],"popo":[70,71,72],"popof":[70,71,72],"popofe":[70,71,72],"popofer":[70,71,72],"pro":[73,74,75,76],"prok":[73,74,75,76],"prokr":[73,74,75,76],"prokre":[73,74,75,76],"prokres":[73,74,75,76],"s":[77,78,79,80,81,82,83,84],"se":[77,78],"sel":[77,78],"sele":[77,78],"selek":[77,78],"selekt":[77,78],"sp":[79,80,81],"spe":[79,80,81],"spem":[79,80,81],"speme":[79,80,81],"spemer":[79,80,81],"sf":[82,83,84],"sfe":[82,83,84],"sfet":[82,83,84],"sfetk":[82,83,84],"tap":[85,86,87,88,89],"taps":[87,88,89],"tes":[90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106],"test":[90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106],"testa":[104,105,106],"testar":[104,105,106],"testare":[104,105,106],"testarea":[104,105,106],"pot":[107,108,109,110,111],"poto":[107,108,109,110,111],"potom":[107,108,109,110,111],"r":[112,113,126],"ra":[112,113],"rat":[112,113],"rate":[112,113],"ratem":[112,113],"ratemk":[112,113],"to":[114,115,116,117,124],"tol":[114,115,116,117],"tolt":[114,115,116,117],"tolte":[114,115,116,117],"toltep":[114,115,116,117],"tre":[118,119],"ket":[120],"kete":[120],"ketem":[120],"ketemk":[120],"em":[121],"emt":[121],"emtr":[121],"emtro":[121],"emtrot":[121],"emtroto":[121],"emtrotok":[121],"emtrotokt":[121],"emtrotokte":[121],"emtrotokteo":[121],"emtrotokteom":[121],"ter":[122],"tere":[122],"terek":[122],"terekt":[122],"terekte":[122],"terektef":[122],"terektefe":[122],"terektefes":[122],"o":[123],"ot":[123],"ote":[123],"otel":[123],"otele":[123],"otelet":[123],"otelete":[123],"oteletes":[123],"tok":[124],"toko":[124],"tokom":[124],"tokome":[124],"tokomem":[124],"tokomemt":[124],"re":[126],"res":[126],"reso":[126],"resor":[126],"resork":[126],"resorke":[126],"tal":[127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143],"talf":[127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143],"talfe":[127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143],"talfem":[127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143],"talfemt":[127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143]},{"s":[1,2,3,8,10,12,13,105,108,109,120],"se":[1,2,3],"sem":[1,2,3],"semk":[1,2,3],"semkl":[1,2,3],"semkle":[1,2,3],"m":[4,5,44,45,46,47,132],"mo":[4,5],"mol":[4,5],"molt":[4,5],"molte":[4,5],"moltep":[4,5],"moltepl":[4,5],"molteple":[4,5],"k":[7,9,15,43,50,51,52,53,54,55,56,57,58,59,60,61,62,63,80,81,111],"ke":[7,9],"ker":[7,9],"kerk":[7,9],"kerkl":[7,9],"kerkle":[7,9],"sk":[8,10],"sko":[8,10],"skoa":[8,10],"skoar":[8,10],"skoare":[8,10],"so":[12,13,105,108,109],"sol":[12,108],"sole":[12,108],"solet":[12,108],"sop":[13,105,109],"sopt":[13,105,109],"soptl":[13,105,109],"soptle":[13,105,109],"o":[14,48,49,106,110],"ot":[14,106,110],"otl":[14,106,110],"otle":[14,106,110],"otlem":[14,106,110],"otleme":[14,106,110],"ko":[15,22,23,43,50,51,52,53,54,55,56,57,58,59,60,61,62,63,111],"kos":[15,22,23,43,111],"kost":[15,22,23,43,111],"f":[17,18,19,38,39,64,65,66,67,68,69,88,89,115,117,133,134,135,141,143],"fe":[17,18,19,38,39,64,65,66,67,68,69,88,89,115,117,141],"fet":[17,18,19,38,39,88,89,115,117,141],"t":[21,25,71,72,78,113],"te":[21,25,78,113,116,119,129],"tef":[21,25,78,113,119],"tefa":[21,25,78,113,119],"tefao":[21,25,78,113,119],"tefaol":[21,25,78,113,119],"tefaolt":[21,25,78,113,119],"kosto":[22,23,43],"kostom":[22,23,43],"p":[26,27,28,29,30,31,32,33,34,35,36,41,42,85,86,128,130,131,139,140],"pr":[26,27,28,29,30,31,32],"pro":[26,27,28,29,30,31,32],"prok":[26,27,28,29,30,31,32],"prokr":[26,27,28,29,30,31,32],"prokre":[26,27,28,29,30,31,32],"prokres":[26,27,28,29,30,31,32],"pe":[33,34,35,36],"pek":[33,34,35,36],"peke":[33,34,35,36],"peker":[33,34,35,36],"pa":[41,128,131],"pas":[41],"pase":[41],"pasek":[41],"po":[42,85,86,130,139,140],"pot":[42,85,86],"poto":[42,85,86],"potom":[42,85,86],"me":[44,45,46,47],"mes":[44,45,46,47],"mesa":[44,45,46,47],"mesak":[44,45,46,47],"mesake":[44,45,46,47],"op":[48,49],"opl":[48,49],"oplo":[48,49],"oploa":[48,49],"oploat":[48,49],"oploate":[48,49],"oploater":[48,49],"kom":[50,51,52,53,54,55,56,57,58,59,60,61,62,63],"komt":[50,51,52,53,54,55,56,57,58,59,60,61,62,63],"komtr":[50,51,52,53,54,55,56,57,58,59,60,61,62,63],"komtro":[50,51,52,53,54,55,56,57,58,59,60,61,62,63],"komtrol":[50,51,52,53,54,55,56,57,58,59,60,61,62,63],"fef":[64,65,66,67,68,69],"tr":[71,72,138],"tre":[71,72],"trek":[71,72],"treke":[71,72],"treker":[71,72],"l":[74,83,84,136,137],"la":[74,83,84],"lap":[74,83,84],"lape":[74,83,84],"lapel":[74,83,84],"e":[75,76,90,91,92,93,94,95,96,97,98,99,100,101,102,103,142],"em":[75,76,90,91,92,93,94,95,96,97,98,99,100,101,102,103],"emt":[75,76],"emte":[76],"emter":[76],"emterf":[76],"emterfa":[76],"emterfal":[76],"emterfals":[76],"kl":[80,81],"kla":[80,81],"klas":[80,81],"potoms":[85,86],"feto":[88],"fetot":[88],"emp":[90,91,92,93,94,95,96,97,98,99,100,101,102,103],"empo":[90,91,92,93,94,95,96,97,98,99,100,101,102,103],"empot":[90,91,92,93,94,95,96,97,98,99,100,101,102,103],"tes":[116,129],"tesa":[116],"tesap":[116],"tesapl":[116],"tesaple":[116],"tesaplet":[116],"st":[120],"sta":[120],"star":[120],"start":[120],"starte":[120],"startet":[120],"r":[124,125],"re":[124,125],"res":[124,125],"reso":[124,125],"resor":[124,125],"resork":[124,125],"resorke":[124,125],"pak":[128],"pakr":[128],"pakro":[128],"pakrom":[128],"pakromt":[128],"test":[129],"por":[130,139,140],"port":[130,139,140],"porte":[130,139,140],"porter":[130,139,140],"pat":[131],"pate":[131],"patem":[131],"patemk":[131],"ma":[132],"mar":[132],"mark":[132],"marke":[132],"markem":[132],"fo":[133,134,135,143],"fom":[133,134,135],"fomt":[133,134,135],"le":[136,137],"let":[136],"lete":[136],"leter":[136],"lem":[137],"leme":[137],"tro":[138],"trop":[138],"ek":[142],"ekt":[142],"fol":[143]},{"o":[1,2,3,4,5,18,38,72,100],"op":[1,2,3,4,5,38],"opt":[1,2,3,4,5,38],"opte":[1,2,3,4,5,38],"opteo":[1,2,3,4,5,38],"opteom":[1,2,3,4,5,38],"opteoms":[4,5,38],"r":[17,139],"ro":[17],"rot":[17],"rote":[17],"om":[18],"pref":[19,61,63,101,103],"prefe":[19,61,63,101,103],"prefes":[19,61,63,101,103],"e":[22,53,69,88,89,137],"ea":[22],"eat":[22],"eate":[22],"eater":[22],"kl":[23,71],"kle":[23,71],"klek":[23,71],"pa":[26,27,28,29,30,31,32,55,96],"par":[26,27,28,29,30,31,32],"s":[39,45,56,58,62,65,97,102,117,133,136,138],"sl":[39,117],"slo":[39,117],"slot":[39,117],"slots":[39],"pr":[42,61,63,101,103],"pro":[42],"prop":[42],"p":[43,55,61,63,96,101,103],"po":[43],"pot":[43],"poto":[43],"potom":[43],"st":[45],"str":[45],"stre":[45],"strem":[45],"stremk":[45],"f":[47,80,81,105,106,140],"fa":[47,105,106,135],"fal":[47],"fals":[47],"false":[47],"t":[49,51,54,57],"te":[49,51,57,115],"tef":[49],"tefa":[49],"tefao":[49],"tefaol":[49],"tefaolt":[49],"tes":[51,57,115],"test":[51,57,115],"m":[52,92],"mo":[52,92],"mom":[52,92],"momp":[52,92],"mompe":[52,92],"momper":[52,92],"em":[53,69],"ema":[53,93],"emal":[53,93],"ta":[54,94,95],"tat":[54,94,95],"tate":[54,94,95],"pas":[55,96],"pasf":[55,96],"pasfo":[55,96],"pasfor":[55,96],"pasfort":[55,96],"se":[56,58,65,97,133],"sea":[56,97],"sear":[56,97],"seark":[56,97],"testa":[57],"testar":[57],"testare":[57],"testarea":[57],"sel":[58],"sele":[58],"selek":[58],"selekt":[58],"a":[59,84],"ao":[59],"aot":[59],"aoto":[59],"aotok":[59],"aotoko":[59],"aotokom":[59],"aotokomp":[59],"aotokompl":[59],"aotokomple":[59],"aotokomplet":[59],"aotokomplete":[59],"ke":[60,68],"kek":[60],"kekp":[60],"kekpo":[60],"kekpos":[60],"pre":[61,63,101,103],"so":[62,102],"sof":[62,102],"sofe":[62,102],"sofes":[62,102],"sem":[65],"semp":[65],"sempl":[65],"semple":[65],"k":[66,67,68,71,128,129,130,143],"ko":[66,128,129,130,143],"kos":[66],"kost":[66],"kosto":[66],"kostom":[66],"kr":[67],"kro":[67],"krop":[67],"krope":[67],"kropet":[67],"kel":[68],"emp":[69],"empt":[69],"empte":[69],"of":[72],"ofe":[72],"ofer":[72],"am":[84],"amt":[84],"ek":[88,89,137],"eko":[88,89],"ekom":[88,89],"tatet":[95],"tatete":[95],"tatetem":[95],"tateteme":[95],"tel":[98],"tem":[99],"teme":[99],"or":[100],"orl":[100],"far":[105,106],"fare":[105,106],"farea":[105,106],"faream":[105,106],"fareamt":[105,106],"kol":[128,129,130],"kolo":[128,129,130],"kolor":[128,129,130],"ses":[133],"sese":[133],"fe":[134,140],"fek":[134],"fekt":[134],"fam":[135],"fame":[135],"famel":[135],"famele":[135],"sp":[136],"spa":[136],"spak":[136],"spake":[136],"spakem":[136],"spakemk":[136],"ekt":[137],"sa":[138],"sat":[138],"sato":[138],"satof":[138],"ra":[139],"rat":[139],"rate":[139],"rateo":[139],"rateos":[139],"fet":[140],"kom":[143],"komf":[143],"komfe":[143],"komfek":[143]},{"4":[80],"8":[81],"f":[2,3,5],"fe":[2,3,5],"fet":[2,3,5],"feto":[3,5],"fetot":[3,5],"o":[17,32,46],"op":[17,46],"opt":[17],"opte":[17],"opteo":[17],"opteom":[17],"k":[18],"kl":[18],"kle":[18],"klek":[18],"s":[19,28,31,61,63,68,101,103],"sl":[19,61,62,63,68,101,102,103],"slo":[19,61,62,63,68,101,102,103],"slot":[19,61,62,63,68,101,102,103],"e":[23],"ef":[23],"efe":[23],"efem":[23],"efemt":[23],"efemts":[23],"t":[27,29,84],"te":[27,29,35,84],"tef":[27],"tefa":[27],"tefao":[27],"tefaol":[27],"tefaolt":[27],"se":[28],"ses":[28],"sese":[28],"tem":[29,35],"teme":[29,35],"ko":[30],"kos":[30],"kost":[30],"kosto":[30],"kostom":[30],"so":[31],"sol":[31],"sole":[31],"solet":[31],"ot":[32],"otl":[32],"otle":[32],"otlem":[32],"otleme":[32],"r":[36,67],"ra":[36],"ram":[36],"ramk":[36],"ramke":[36],"a":[43],"am":[43],"amt":[43],"opk":[46],"opke":[46],"opkek":[46],"opkekt":[46],"falo":[47],"ro":[67],"rof":[67],"rofs":[67],"tes":[84],"tesk":[84],"teskr":[84],"teskre":[84],"teskrep":[84],"teskrept":[84],"teskrepte":[84],"teskrepteo":[84],"teskrepteom":[84],"l":[95],"lo":[95],"lok":[95],"loka":[95],"lokal":[95],"p":[115],"pr":[115],"pro":[115],"prop":[115]},{"p":[2],"pr":[2],"pre":[2],"pref":[2],"prefe":[2],"prefes":[2],"sea":[3,5],"sear":[3,5],"seark":[3,5],"s":[5],"se":[5],"op":[18],"opt":[18],"opte":[18],"opteo":[18],"opteom":[18],"t":[30],"te":[30],"tem":[30],"teme":[30],"f":[31,32],"fa":[31,32],"far":[31,32],"fare":[31,32],"farea":[31,32],"faream":[31,32],"fareamt":[31,32],"kr":[43],"kro":[43],"krop":[43],"krops":[43],"e":[61,62],"ek":[61,62,101,102],"eko":[61,62,101,102],"ekom":[61,62,101,102],"a":[63,103],"af":[63,103],"afa":[63,103],"afat":[63,103],"afata":[63,103],"afatar":[63,103]},{"sl":[2],"slo":[2],"slot":[2],"slots":[2]},{},{},{}]', "text.ctx": "[{}]" }, "idMap": { "0": { "id": "src-components-autocomplete-story-vue", "kind": "story" }, "1": { "id": "src-components-autocomplete-story-vue:src-components-autocomplete-story-vue-0", "kind": "variant" }, "2": { "id": "src-components-autocomplete-story-vue:src-components-autocomplete-story-vue-1", "kind": "variant" }, "3": { "id": "src-components-autocomplete-story-vue:src-components-autocomplete-story-vue-2", "kind": "variant" }, "4": { "id": "src-components-autocomplete-story-vue:src-components-autocomplete-story-vue-3", "kind": "variant" }, "5": { "id": "src-components-autocomplete-story-vue:src-components-autocomplete-story-vue-4", "kind": "variant" }, "6": { "id": "src-components-avatar-story-vue", "kind": "story" }, "7": { "id": "src-components-avatar-story-vue:src-components-avatar-story-vue-0", "kind": "variant" }, "8": { "id": "src-components-avatar-story-vue:src-components-avatar-story-vue-1", "kind": "variant" }, "9": { "id": "src-components-avatar-story-vue:src-components-avatar-story-vue-2", "kind": "variant" }, "10": { "id": "src-components-avatar-story-vue:src-components-avatar-story-vue-3", "kind": "variant" }, "11": { "id": "src-components-badge-story-vue", "kind": "story" }, "12": { "id": "src-components-badge-story-vue:src-components-badge-story-vue-0", "kind": "variant" }, "13": { "id": "src-components-badge-story-vue:src-components-badge-story-vue-1", "kind": "variant" }, "14": { "id": "src-components-badge-story-vue:src-components-badge-story-vue-2", "kind": "variant" }, "15": { "id": "src-components-badge-story-vue:src-components-badge-story-vue-3", "kind": "variant" }, "16": { "id": "src-components-breadcrumbs-story-vue", "kind": "story" }, "17": { "id": "src-components-breadcrumbs-story-vue:src-components-breadcrumbs-story-vue-0", "kind": "variant" }, "18": { "id": "src-components-breadcrumbs-story-vue:src-components-breadcrumbs-story-vue-1", "kind": "variant" }, "19": { "id": "src-components-breadcrumbs-story-vue:src-components-breadcrumbs-story-vue-2", "kind": "variant" }, "20": { "id": "src-components-calendar-story-vue", "kind": "story" }, "21": { "id": "src-components-calendar-story-vue:src-components-calendar-story-vue-0", "kind": "variant" }, "22": { "id": "src-components-calendar-story-vue:src-components-calendar-story-vue-1", "kind": "variant" }, "23": { "id": "src-components-calendar-story-vue:src-components-calendar-story-vue-2", "kind": "variant" }, "24": { "id": "src-components-checkbox-story-vue", "kind": "story" }, "25": { "id": "src-components-checkbox-story-vue:_default", "kind": "variant" }, "26": { "id": "src-components-circularprogressbar-story-vue", "kind": "story" }, "27": { "id": "src-components-circularprogressbar-story-vue:src-components-circularprogressbar-story-vue-0", "kind": "variant" }, "28": { "id": "src-components-circularprogressbar-story-vue:src-components-circularprogressbar-story-vue-1", "kind": "variant" }, "29": { "id": "src-components-circularprogressbar-story-vue:src-components-circularprogressbar-story-vue-2", "kind": "variant" }, "30": { "id": "src-components-circularprogressbar-story-vue:src-components-circularprogressbar-story-vue-3", "kind": "variant" }, "31": { "id": "src-components-circularprogressbar-story-vue:src-components-circularprogressbar-story-vue-4", "kind": "variant" }, "32": { "id": "src-components-circularprogressbar-story-vue:src-components-circularprogressbar-story-vue-5", "kind": "variant" }, "33": { "id": "src-components-datepicker-story-vue", "kind": "story" }, "34": { "id": "src-components-datepicker-story-vue:src-components-datepicker-story-vue-0", "kind": "variant" }, "35": { "id": "src-components-datepicker-story-vue:src-components-datepicker-story-vue-1", "kind": "variant" }, "36": { "id": "src-components-datepicker-story-vue:src-components-datepicker-story-vue-2", "kind": "variant" }, "37": { "id": "src-components-dialog-story-vue", "kind": "story" }, "38": { "id": "src-components-dialog-story-vue:src-components-dialog-story-vue-0", "kind": "variant" }, "39": { "id": "src-components-dialog-story-vue:src-components-dialog-story-vue-1", "kind": "variant" }, "40": { "id": "src-components-dropdown-story-vue", "kind": "story" }, "41": { "id": "src-components-dropdown-story-vue:src-components-dropdown-story-vue-0", "kind": "variant" }, "42": { "id": "src-components-dropdown-story-vue:src-components-dropdown-story-vue-1", "kind": "variant" }, "43": { "id": "src-components-dropdown-story-vue:src-components-dropdown-story-vue-2", "kind": "variant" }, "44": { "id": "src-components-errormessage-story-vue", "kind": "story" }, "45": { "id": "src-components-errormessage-story-vue:src-components-errormessage-story-vue-0", "kind": "variant" }, "46": { "id": "src-components-errormessage-story-vue:src-components-errormessage-story-vue-1", "kind": "variant" }, "47": { "id": "src-components-errormessage-story-vue:src-components-errormessage-story-vue-2", "kind": "variant" }, "48": { "id": "src-components-fileuploader-story-vue", "kind": "story" }, "49": { "id": "src-components-fileuploader-story-vue:_default", "kind": "variant" }, "50": { "id": "src-components-formcontrol-story-vue", "kind": "story" }, "51": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-0", "kind": "variant" }, "52": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-1", "kind": "variant" }, "53": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-2", "kind": "variant" }, "54": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-3", "kind": "variant" }, "55": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-4", "kind": "variant" }, "56": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-5", "kind": "variant" }, "57": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-6", "kind": "variant" }, "58": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-7", "kind": "variant" }, "59": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-8", "kind": "variant" }, "60": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-9", "kind": "variant" }, "61": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-10", "kind": "variant" }, "62": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-11", "kind": "variant" }, "63": { "id": "src-components-formcontrol-story-vue:src-components-formcontrol-story-vue-12", "kind": "variant" }, "64": { "id": "src-components-listview-story-vue", "kind": "story" }, "65": { "id": "src-components-listview-story-vue:src-components-listview-story-vue-0", "kind": "variant" }, "66": { "id": "src-components-listview-story-vue:src-components-listview-story-vue-1", "kind": "variant" }, "67": { "id": "src-components-listview-story-vue:src-components-listview-story-vue-2", "kind": "variant" }, "68": { "id": "src-components-listview-story-vue:src-components-listview-story-vue-3", "kind": "variant" }, "69": { "id": "src-components-listview-story-vue:src-components-listview-story-vue-4", "kind": "variant" }, "70": { "id": "src-components-popover-story-vue", "kind": "story" }, "71": { "id": "src-components-popover-story-vue:src-components-popover-story-vue-0", "kind": "variant" }, "72": { "id": "src-components-popover-story-vue:src-components-popover-story-vue-1", "kind": "variant" }, "73": { "id": "src-components-progress-story-vue", "kind": "story" }, "74": { "id": "src-components-progress-story-vue:src-components-progress-story-vue-0", "kind": "variant" }, "75": { "id": "src-components-progress-story-vue:src-components-progress-story-vue-1", "kind": "variant" }, "76": { "id": "src-components-progress-story-vue:src-components-progress-story-vue-2", "kind": "variant" }, "77": { "id": "src-components-select-story-vue", "kind": "story" }, "78": { "id": "src-components-select-story-vue:_default", "kind": "variant" }, "79": { "id": "src-components-spinner-story-vue", "kind": "story" }, "80": { "id": "src-components-spinner-story-vue:src-components-spinner-story-vue-0", "kind": "variant" }, "81": { "id": "src-components-spinner-story-vue:src-components-spinner-story-vue-1", "kind": "variant" }, "82": { "id": "src-components-switch-story-vue", "kind": "story" }, "83": { "id": "src-components-switch-story-vue:src-components-switch-story-vue-0", "kind": "variant" }, "84": { "id": "src-components-switch-story-vue:src-components-switch-story-vue-1", "kind": "variant" }, "85": { "id": "src-components-tabbuttons-story-vue", "kind": "story" }, "86": { "id": "src-components-tabbuttons-story-vue:src-components-tabbuttons-story-vue-0", "kind": "variant" }, "87": { "id": "src-components-tabs-story-vue", "kind": "story" }, "88": { "id": "src-components-tabs-story-vue:src-components-tabs-story-vue-0", "kind": "variant" }, "89": { "id": "src-components-tabs-story-vue:src-components-tabs-story-vue-1", "kind": "variant" }, "90": { "id": "src-components-textinput-story-vue", "kind": "story" }, "91": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-0", "kind": "variant" }, "92": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-1", "kind": "variant" }, "93": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-2", "kind": "variant" }, "94": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-3", "kind": "variant" }, "95": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-4", "kind": "variant" }, "96": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-5", "kind": "variant" }, "97": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-6", "kind": "variant" }, "98": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-7", "kind": "variant" }, "99": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-8", "kind": "variant" }, "100": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-9", "kind": "variant" }, "101": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-10", "kind": "variant" }, "102": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-11", "kind": "variant" }, "103": { "id": "src-components-textinput-story-vue:src-components-textinput-story-vue-12", "kind": "variant" }, "104": { "id": "src-components-textarea-story-vue", "kind": "story" }, "105": { "id": "src-components-textarea-story-vue:src-components-textarea-story-vue-0", "kind": "variant" }, "106": { "id": "src-components-textarea-story-vue:src-components-textarea-story-vue-1", "kind": "variant" }, "107": { "id": "src-components-button-button-story-vue", "kind": "story" }, "108": { "id": "src-components-button-button-story-vue:src-components-button-button-story-vue-0", "kind": "variant" }, "109": { "id": "src-components-button-button-story-vue:src-components-button-button-story-vue-1", "kind": "variant" }, "110": { "id": "src-components-button-button-story-vue:src-components-button-button-story-vue-2", "kind": "variant" }, "111": { "id": "src-components-button-button-story-vue:src-components-button-button-story-vue-3", "kind": "variant" }, "112": { "id": "src-components-rating-rating-story-vue", "kind": "story" }, "113": { "id": "src-components-rating-rating-story-vue:src-components-rating-rating-story-vue-0", "kind": "variant" }, "114": { "id": "src-components-tooltip-tooltip-story-vue", "kind": "story" }, "115": { "id": "src-components-tooltip-tooltip-story-vue:src-components-tooltip-tooltip-story-vue-0", "kind": "variant" }, "116": { "id": "src-components-tooltip-tooltip-story-vue:src-components-tooltip-tooltip-story-vue-1", "kind": "variant" }, "117": { "id": "src-components-tooltip-tooltip-story-vue:src-components-tooltip-tooltip-story-vue-2", "kind": "variant" }, "118": { "id": "src-components-tree-tree-story-vue", "kind": "story" }, "119": { "id": "src-components-tree-tree-story-vue:src-components-tree-tree-story-vue-0", "kind": "variant" }, "120": { "id": "docs-getting-started-story-js", "kind": "story" }, "121": { "id": "docs-introduction-story-js", "kind": "story" }, "122": { "id": "docs-other-directives-story-js", "kind": "story" }, "123": { "id": "docs-other-utilities-story-js", "kind": "story" }, "124": { "id": "docs-resources-document-resource-story-js", "kind": "story" }, "125": { "id": "docs-resources-list-resource-story-js", "kind": "story" }, "126": { "id": "docs-resources-resource-story-js", "kind": "story" }, "127": { "id": "tailwind", "kind": "story" }, "128": { "id": "tailwind:background-color", "kind": "variant" }, "129": { "id": "tailwind:text-color", "kind": "variant" }, "130": { "id": "tailwind:border-color", "kind": "variant" }, "131": { "id": "tailwind:padding", "kind": "variant" }, "132": { "id": "tailwind:margin", "kind": "variant" }, "133": { "id": "tailwind:font-size", "kind": "variant" }, "134": { "id": "tailwind:font-weight", "kind": "variant" }, "135": { "id": "tailwind:font-family", "kind": "variant" }, "136": { "id": "tailwind:letter-spacing", "kind": "variant" }, "137": { "id": "tailwind:line-height", "kind": "variant" }, "138": { "id": "tailwind:drop-shadow", "kind": "variant" }, "139": { "id": "tailwind:border-radius", "kind": "variant" }, "140": { "id": "tailwind:border-width", "kind": "variant" }, "141": { "id": "tailwind:width", "kind": "variant" }, "142": { "id": "tailwind:height", "kind": "variant" }, "143": { "id": "tailwind:full-config", "kind": "variant" } } };
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
    const DocSearchData = () => __vitePreload(() => import("./search-docs-data-6c33c72c.js"), true ? ["assets/search-docs-data-6c33c72c.js","assets/vendor-7778cb0e.js"] : void 0);
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
