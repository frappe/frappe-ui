import{_ as v}from"./chunks/PropsTable.vue_vue_type_script_setup_true_lang.DV5nidcY.js";import{_ as z}from"./chunks/EmitsTable.vue_vue_type_script_setup_true_lang.D1MqGRtn.js";import{Z as m,c as u}from"./chunks/theme.CbriAEFv.js";import{d as h,o as _,c as r,F as f,b as l,e as t,U as p,a6 as a,t as y,p as w,af as g,a as s}from"./chunks/framework.tKv4a-Ml.js";const x=h({__name:"Example",setup(d){const e=w([10]);return(i,c)=>(_(),r(f,null,[l(t(m),{modelValue:e.value,"onUpdate:modelValue":c[0]||(c[0]=n=>e.value=n)},null,8,["modelValue"]),l(t(u),{class:"w-fit !rounded-sm"},{default:p(()=>[a(y(e.value[0]),1)]),_:1})],64))}}),b=h({__name:"Range",setup(d){const e=w([10,50]);return(i,c)=>(_(),r(f,null,[l(t(m),{modelValue:e.value,"onUpdate:modelValue":c[0]||(c[0]=n=>e.value=n)},null,8,["modelValue"]),l(t(u),{class:"w-fit !rounded-sm"},{default:p(()=>[a(y(e.value.join(" - ")),1)]),_:1})],64))}}),C=JSON.parse('{"title":"Slider","description":"","frontmatter":{},"headers":[],"relativePath":"docs/components/slider.md","filePath":"docs/components/slider.md","lastUpdated":1776722278000}'),j={name:"docs/components/slider.md"},q=Object.assign(j,{setup(d){const e=[{name:"step",description:"Step interval between slider values.",required:!1,type:"number",default:"1"},{name:"max",description:"Maximum allowed slider value.",required:!1,type:"number",default:"100"},{name:"min",description:"Minimum allowed slider value.",required:!1,type:"number",default:"0"},{name:"modelValue",description:"",required:!1,type:"SliderValue",default:void 0}],i=[{name:"update:modelValue",description:"Fired when the model value changes.",type:"[value: SliderValue | undefined]"}];return(c,n)=>{const o=g("ComponentPreview");return _(),r("div",null,[n[3]||(n[3]=s("h1",{id:"slider",tabindex:"-1"},[a("Slider "),s("a",{class:"header-anchor",href:"#slider","aria-label":"Permalink to “Slider”"},"​")],-1)),n[4]||(n[4]=s("p",null,"A slider input for selecting a single value or a range of values within a minimum and maximum.",-1)),n[5]||(n[5]=s("h2",{id:"example",tabindex:"-1"},[a("Example "),s("a",{class:"header-anchor",href:"#example","aria-label":"Permalink to “Example”"},"​")],-1)),l(o,{name:"Slider-Example",css:"grid gap-5 !px-60 !py-32"},{code:p(()=>[...n[0]||(n[0]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"ref"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"Badge"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," Slider"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," val"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_13ahmt"},"(["),s("span",{class:"s_40mev6"},"10"),s("span",{class:"s_13ahmt"},"])")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_wac0bt"},"Slider"),s("span",{class:"s_1i4ay4"}," v-model"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"val"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"}," />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_wac0bt"},"Badge"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"w-fit !rounded-sm"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"}," {{ val[0] }}"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_wac0bt"},"Badge"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:p(()=>[l(x)]),_:1}),n[6]||(n[6]=s("h2",{id:"range",tabindex:"-1"},[a("Range "),s("a",{class:"header-anchor",href:"#range","aria-label":"Permalink to “Range”"},"​")],-1)),l(o,{name:"Slider-Range",css:"grid gap-5 !px-60 !py-32"},{code:p(()=>[...n[1]||(n[1]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"ref"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"Badge"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," Slider"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," val"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_13ahmt"},"(["),s("span",{class:"s_40mev6"},"10"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_40mev6"}," 50"),s("span",{class:"s_13ahmt"},"])")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_wac0bt"},"Slider"),s("span",{class:"s_1i4ay4"}," v-model"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"val"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"}," />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_wac0bt"},"Badge"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"w-fit !rounded-sm"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"}," {{ val.join(' - ') }}"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_wac0bt"},"Badge"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:p(()=>[l(b)]),_:1}),n[7]||(n[7]=s("h2",{id:"api-reference",tabindex:"-1"},[a("API Reference "),s("a",{class:"header-anchor",href:"#api-reference","aria-label":"Permalink to “API Reference”"},"​")],-1)),l(v,{name:"Slider",data:e},{code:p(()=>[...n[2]||(n[2]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),n[8]||(n[8]=a()),l(z,{data:i})])}}});export{C as __pageData,q as default};
