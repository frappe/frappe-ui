import{_ as w}from"./chunks/PropsTable.vue_vue_type_script_setup_true_lang.ImaRUcB3.js";import{_ as v}from"./chunks/EmitsTable.vue_vue_type_script_setup_true_lang.CWvQ1iCk.js";import{$ as o,c as m}from"./chunks/theme.4h0R34f5.js";import{d as u,o as _,c as r,F as h,b as l,e as t,U as c,a6 as a,t as f,p as y,ae as z,a as s}from"./chunks/framework.Bo3zwgXD.js";const x=u({__name:"Example",setup(d){const e=y([10]);return(n,p)=>(_(),r(h,null,[l(t(o),{modelValue:e.value,"onUpdate:modelValue":p[0]||(p[0]=i=>e.value=i)},null,8,["modelValue"]),l(t(m),{class:"w-fit !rounded-sm"},{default:c(()=>[a(f(e.value[0]),1)]),_:1})],64))}}),g=u({__name:"Range",setup(d){const e=y([10,50]);return(n,p)=>(_(),r(h,null,[l(t(o),{modelValue:e.value,"onUpdate:modelValue":p[0]||(p[0]=i=>e.value=i)},null,8,["modelValue"]),l(t(m),{class:"w-fit !rounded-sm"},{default:c(()=>[a(f(e.value.join(" - ")),1)]),_:1})],64))}}),P=JSON.parse('{"title":"Slider","description":"","frontmatter":{},"headers":[],"relativePath":"docs/components/slider.md","filePath":"docs/components/slider.md","lastUpdated":1776722278000}'),b={name:"docs/components/slider.md"},C=Object.assign(b,{setup(d){return(e,n)=>{const p=z("ComponentPreview");return _(),r("div",null,[n[3]||(n[3]=s("h1",{id:"slider",tabindex:"-1"},[a("Slider "),s("a",{class:"header-anchor",href:"#slider","aria-label":"Permalink to “Slider”"},"​")],-1)),n[4]||(n[4]=s("p",null,"A slider input for selecting a single value or a range of values within a minimum and maximum.",-1)),n[5]||(n[5]=s("h2",{id:"example",tabindex:"-1"},[a("Example "),s("a",{class:"header-anchor",href:"#example","aria-label":"Permalink to “Example”"},"​")],-1)),l(p,{name:"Slider-Example",css:"grid gap-5 !px-60 !py-32"},{code:c(()=>[...n[0]||(n[0]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"ref"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"Badge"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," Slider"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," val"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_13ahmt"},"(["),s("span",{class:"s_40mev6"},"10"),s("span",{class:"s_13ahmt"},"])")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_wac0bt"},"Slider"),s("span",{class:"s_1i4ay4"}," v-model"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"val"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"}," />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_wac0bt"},"Badge"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"w-fit !rounded-sm"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"}," {{ val[0] }}"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_wac0bt"},"Badge"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:c(()=>[l(x)]),_:1}),n[6]||(n[6]=s("h2",{id:"range",tabindex:"-1"},[a("Range "),s("a",{class:"header-anchor",href:"#range","aria-label":"Permalink to “Range”"},"​")],-1)),l(p,{name:"Slider-Range",css:"grid gap-5 !px-60 !py-32"},{code:c(()=>[...n[1]||(n[1]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"ref"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"Badge"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," Slider"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," val"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_13ahmt"},"(["),s("span",{class:"s_40mev6"},"10"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 50"),s("span",{class:"s_13ahmt"},"])")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_wac0bt"},"Slider"),s("span",{class:"s_1i4ay4"}," v-model"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"val"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"}," />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_wac0bt"},"Badge"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"w-fit !rounded-sm"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"}," {{ val.join(' - ') }}"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_wac0bt"},"Badge"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:c(()=>[l(g)]),_:1}),n[7]||(n[7]=s("h2",{id:"api-reference",tabindex:"-1"},[a("API Reference "),s("a",{class:"header-anchor",href:"#api-reference","aria-label":"Permalink to “API Reference”"},"​")],-1)),l(w,{name:"Slider",data:[{name:"step",description:"Step interval between slider values.",required:!1,type:"number",default:"1"},{name:"max",description:"Maximum allowed slider value.",required:!1,type:"number",default:"100"},{name:"min",description:"Minimum allowed slider value.",required:!1,type:"number",default:"0"},{name:"modelValue",description:"",required:!1,type:"SliderValue"}]},{code:c(()=>[...n[2]||(n[2]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Value model for the Slider component.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Use one number for a single-value slider or two numbers for a range slider.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," *")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * "),s("span",{class:"s_y1rh3e"},"@example")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * const single: SliderValue = [25]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," *")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * "),s("span",{class:"s_y1rh3e"},"@example")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * const range: SliderValue = [20, 80]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," SliderValue"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_i592pt"}," number"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Props for the Slider component.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," *")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * "),s("span",{class:"s_y1rh3e"},"@example")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * const props: SliderProps = {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," *   min: 0,")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," *   max: 100,")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," *   step: 5,")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * }")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," SliderProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Step interval between slider values.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   *")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@example")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * 5")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  step"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Maximum allowed slider value.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   *")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@example")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * 100")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  max"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Minimum allowed slider value.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   *")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@example")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * 0")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  min"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),l(v,{data:[{name:"update:modelValue",description:"",type:"[value: SliderValue | undefined]"}]})])}}});export{P as __pageData,C as default};
