import{_ as L}from"./chunks/PropsTable.vue_vue_type_script_setup_true_lang.Cx4qXVvy.js";import{_ as R}from"./chunks/SlotsTable.vue_vue_type_script_setup_true_lang.udYNRByN.js";import{_ as H}from"./chunks/EmitsTable.vue_vue_type_script_setup_true_lang.DD7xOCJV.js";import{a9 as c,t as T,u as O,m as C,h as N}from"./chunks/theme.BPmHO8dN.js";import{y as E,a6 as h,a1 as S,o as q,l as s,u as p,an as l,aI as t,Q as w,n as G,af as W,j as I,E as D,t as a,aa as K}from"./chunks/framework.B6jTn2VX.js";const J={class:"w-full items-center grid *:w-fit justify-center !py-20 !gap-1"},Q={class:"grid w-full max-w-3xl grid-cols-1 gap-6"},X=["onClick"],Z=["onClick"],ss=["onClick"],as=["onClick"],ns=["onClick"],ls=["onClick"],ps=["onClick"],es=["onClick"],cs=["onClick"],ts={class:"flex flex-col leading-tight"},is={class:"text-ink-gray-9"},_s=["onClick"],rs={class:"flex flex-col leading-tight"},os={class:"text-ink-gray-9"},Y="w-full rounded px-2 py-1.5 text-left text-base hover:bg-surface-gray-2",ds=E({__name:"Range",setup(U){const u=c().format("YYYY-MM-DD"),g=c().add(1,"year").format("YYYY-MM-DD"),z=h([]),x=h([]),v=h([c().subtract(29,"day").format("YYYY-MM-DD"),c().format("YYYY-MM-DD")]);function P(){const m=j(5);return[m,m.add(2,"day")]}function M(){const m=j(1);return[m,m.add(4,"day")]}function j(m){const e=c(),_=(m-e.day()+7)%7||7;return e.add(_,"day")}function y(m){return[c().subtract(m-1,"day"),c()]}const b=h([]),n=c().add(60,"day").format("YYYY-MM-DD");function o(m){const e=m.day();return e===0||e===6}const f=h([]),A=I(()=>f.value[0]?c(f.value[0]).format("ddd, MMM D"):""),V=I(()=>f.value[1]?c(f.value[1]).format("ddd, MMM D"):"");return(m,e)=>(S(),q("div",J,[s("div",Q,[p(l(T),{modelValue:z.value,"onUpdate:modelValue":e[0]||(e[0]=_=>z.value=_),label:"Time off",placeholder:"Pick your dates",min:l(u)},{prefix:t(()=>[...e[5]||(e[5]=[s("span",{class:"lucide-palmtree size-4 text-ink-gray-5","aria-hidden":"true"},null,-1)])]),actions:t(({setRange:_,close:d})=>[s("button",{type:"button",class:w(Y),onClick:()=>{_(P()),d()}}," Long weekend ",8,X),s("button",{type:"button",class:w(Y),onClick:()=>{_(M()),d()}}," Next week ",8,Z)]),_:1},8,["modelValue","min"]),p(l(T),{modelValue:x.value,"onUpdate:modelValue":e[1]||(e[1]=_=>x.value=_),label:"Check-in / Check-out",placeholder:"Select your stay","dual-pane":"",min:l(u),max:l(g)},{prefix:t(()=>[...e[6]||(e[6]=[s("span",{class:"lucide-hotel size-4 text-ink-gray-5","aria-hidden":"true"},null,-1)])]),_:1},8,["modelValue","min","max"]),p(l(T),{modelValue:v.value,"onUpdate:modelValue":e[2]||(e[2]=_=>v.value=_),label:"Report range",description:"Defaults to the last 30 days.",format:"MMM D",max:l(u)},{prefix:t(()=>[...e[7]||(e[7]=[s("span",{class:"lucide-chart-line size-4 text-ink-gray-5","aria-hidden":"true"},null,-1)])]),actions:t(({fromDate:_,toDate:d,setRange:i,clear:r,close:k})=>[s("button",{type:"button",class:w(Y),onClick:()=>{i([l(c)(),l(c)()]),k()}}," Today ",8,ss),s("button",{type:"button",class:w(Y),onClick:()=>{i(y(7)),k()}}," Last 7 days ",8,as),s("button",{type:"button",class:w(Y),onClick:()=>{i(y(28)),k()}}," Last 4 weeks ",8,ns),s("button",{type:"button",class:w(Y),onClick:()=>{i(y(90)),k()}}," Last 3 months ",8,ls),s("button",{type:"button",class:w(Y),onClick:()=>{i(y(365)),k()}}," Last 12 months ",8,ps),e[8]||(e[8]=s("hr",{class:"my-1 border-outline-gray-2"},null,-1)),_||d?(S(),q("button",{key:0,type:"button",class:w(Y),onClick:()=>{r(),k()}}," Clear ",8,es)):G("",!0)]),_:1},8,["modelValue","max"]),p(l(T),{modelValue:b.value,"onUpdate:modelValue":e[3]||(e[3]=_=>b.value=_),label:"Sprint window",description:"Pick start and end. Weekends are skipped.",min:l(u),max:l(n),"is-date-unavailable":o},{prefix:t(()=>[...e[9]||(e[9]=[s("span",{class:"lucide-timer-reset size-4 text-ink-gray-5","aria-hidden":"true"},null,-1)])]),_:1},8,["modelValue","min","max"]),p(l(T),{modelValue:f.value,"onUpdate:modelValue":e[4]||(e[4]=_=>f.value=_),"dual-pane":"",min:l(u)},{trigger:t(({togglePopover:_,isOpen:d})=>[s("div",{class:w(["grid grid-cols-2 divide-x divide-outline-gray-2 rounded border bg-surface-white text-sm transition-colors",d?"border-outline-gray-4 ring-2 ring-outline-gray-2":"border-outline-gray-2 hover:border-outline-gray-3"])},[s("button",{type:"button",class:"flex items-center gap-2 rounded-l px-3 py-2 text-left hover:bg-surface-gray-1",onClick:_},[e[11]||(e[11]=s("span",{class:"lucide-plane-takeoff size-4 text-ink-gray-5","aria-hidden":"true"},null,-1)),s("div",ts,[e[10]||(e[10]=s("span",{class:"text-xs text-ink-gray-5"},"Depart",-1)),s("span",is,W(A.value||"Add date"),1)])],8,cs),s("button",{type:"button",class:"flex items-center gap-2 rounded-r px-3 py-2 text-left hover:bg-surface-gray-1",onClick:_},[e[13]||(e[13]=s("span",{class:"lucide-plane-landing size-4 text-ink-gray-5","aria-hidden":"true"},null,-1)),s("div",rs,[e[12]||(e[12]=s("span",{class:"text-xs text-ink-gray-5"},"Return",-1)),s("span",os,W(V.value||"Add date"),1)])],8,_s)],2)]),_:1},8,["modelValue","min"])])]))}}),hs={inheritAttrs:!1,render(){return D("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"1.5","stroke-linecap":"round","stroke-linejoin":"round",...this.$attrs,innerHTML:'<path d="M16 14v2.2l1.6 1" /><path d="M16 2v4" /><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" /><path d="M3 10h5" /><path d="M8 2v4" /><circle cx="16" cy="16" r="6" />'})}},us={inheritAttrs:!1,render(){return D("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"1.5","stroke-linecap":"round","stroke-linejoin":"round",...this.$attrs,innerHTML:'<rect width="20" height="8" x="2" y="2" rx="2" ry="2" /><rect width="20" height="8" x="2" y="14" rx="2" ry="2" /><line x1="6" x2="6.01" y1="6" y2="6" /><line x1="6" x2="6.01" y1="18" y2="18" />'})}},B={inheritAttrs:!1,render(){return D("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"1.5","stroke-linecap":"round","stroke-linejoin":"round",...this.$attrs,innerHTML:'<path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09" /><path d="M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05" />'})}},ms={class:"w-full items-center grid *:w-fit justify-center !py-20 !gap-1"},ws={class:"grid w-full max-w-2xl grid-cols-1 gap-6"},fs=["onClick"],ys=["onClick"],ks=["onClick"],F="w-full rounded px-2 py-1.5 text-left text-base hover:bg-surface-gray-2",gs=E({__name:"DateTime",setup(U){const u=c(),g=u.minute(u.minute()<30?30:60).second(0).format("YYYY-MM-DD HH:mm:ss"),z=h(g),x=u.format("YYYY-MM-DD HH:mm:ss"),v=h(""),P=c().add(1,"day").startOf("day").format("YYYY-MM-DD HH:mm:ss"),M=c().add(60,"day").endOf("day").format("YYYY-MM-DD HH:mm:ss"),j=h("");function y(){const b=c(),n=(5-b.day()+7)%7||7;return b.add(n,"day").hour(0).minute(0).second(0)}return(b,n)=>(S(),q("div",ms,[s("div",ws,[p(l(O),{modelValue:z.value,"onUpdate:modelValue":n[0]||(n[0]=o=>z.value=o),label:"Meeting time",placeholder:"When should we meet?",min:l(x),format:"ddd, MMM D · h:mm A"},{prefix:t(()=>[p(l(hs),{class:"size-4 text-ink-gray-5"})]),_:1},8,["modelValue","min"]),p(l(O),{modelValue:v.value,"onUpdate:modelValue":n[1]||(n[1]=o=>v.value=o),label:"Maintenance window",description:"Must be scheduled at least 24 hours in advance.",placeholder:"Pick a low-traffic time",min:l(P),max:l(M)},{prefix:t(()=>[p(l(us),{class:"size-4 text-ink-gray-5"})]),_:1},8,["modelValue","min","max"]),p(l(O),{modelValue:j.value,"onUpdate:modelValue":n[2]||(n[2]=o=>j.value=o),label:"Launch moment",placeholder:"When do we light the candle?",format:"MMMM D, YYYY [at] h:mm A",variant:"outline"},{prefix:t(()=>[p(l(B),{class:"size-4 text-ink-gray-5"})]),actions:t(({setDate:o,close:f})=>[s("button",{type:"button",class:w(F),onClick:()=>{o(l(c)().add(1,"day").hour(12).minute(0)),f()}}," High noon ",8,fs),s("button",{type:"button",class:w(F),onClick:()=>{o(y()),f()}}," Midnight Friday ",8,ys),s("button",{type:"button",class:w(F),onClick:()=>{o(l(c)().add(1,"day").hour(6).minute(15)),f()}}," Sunrise ",8,ks)]),_:1},8,["modelValue"])])]))}}),zs={inheritAttrs:!1,render(){return D("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"1.5","stroke-linecap":"round","stroke-linejoin":"round",...this.$attrs,innerHTML:'<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />'})}},xs={inheritAttrs:!1,render(){return D("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"1.5","stroke-linecap":"round","stroke-linejoin":"round",...this.$attrs,innerHTML:'<path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" /><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" /><path d="M2 21h20" /><path d="M7 8v3" /><path d="M12 8v3" /><path d="M17 8v3" /><path d="M7 4h.01" /><path d="M12 4h.01" /><path d="M17 4h.01" />'})}},vs={inheritAttrs:!1,render(){return D("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"1.5","stroke-linecap":"round","stroke-linejoin":"round",...this.$attrs,innerHTML:'<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" />'})}},js={inheritAttrs:!1,render(){return D("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"1.5","stroke-linecap":"round","stroke-linejoin":"round",...this.$attrs,innerHTML:'<path d="M11 2v2" /><path d="M5 2v2" /><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1" /><path d="M8 15a6 6 0 0 0 12 0v-3" /><circle cx="20" cy="10" r="2" />'})}},bs={inheritAttrs:!1,render(){return D("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"1.5","stroke-linecap":"round","stroke-linejoin":"round",...this.$attrs,innerHTML:'<path d="M9 10h.01" /><path d="M15 10h.01" /><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z" />'})}},Ds={inheritAttrs:!1,render(){return D("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"1.5","stroke-linecap":"round","stroke-linejoin":"round",...this.$attrs,innerHTML:'<path d="M16 19h6" /><path d="M16 2v4" /><path d="M19 16v6" /><path d="M21 12.598V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8.5" /><path d="M3 10h18" /><path d="M8 2v4" />'})}},Ps={class:"w-full items-center grid *:w-fit justify-center !py-20 !gap-1"},Ys={class:"grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2"},Ms=["onClick"],Cs=["onClick"],Ts={class:"flex flex-col gap-1.5 sm:col-span-2"},$="w-full rounded px-2 py-1.5 text-left text-base hover:bg-surface-gray-2",Ss=E({__name:"Examples",setup(U){const u=h(""),g=c().format("YYYY-MM-DD"),z=c().add(1,"year").format("YYYY-MM-DD"),x=h("1995-08-14"),v=c().subtract(120,"year").format("YYYY-MM-DD"),P=h("");function M(d){const i=d.day();return i===0||i===6}function j(d=c()){const i=(8-d.day())%7||7;return d.add(i,"day")}const y=h(""),b=c().add(30,"day").format("YYYY-MM-DD"),n=new Set([c().add(2,"day").format("YYYY-MM-DD"),c().add(5,"day").format("YYYY-MM-DD"),c().add(11,"day").format("YYYY-MM-DD"),c().add(18,"day").format("YYYY-MM-DD")]);function o(d){return n.has(d.format("YYYY-MM-DD"))}const f=h("");function A(d){return!(d.day()===5&&d.date()===13)}const V=h(""),m=c("1800-01-01").format("YYYY-MM-DD"),e=c("2300-12-31").format("YYYY-MM-DD"),_=h("");return(d,i)=>(S(),q("div",Ps,[s("div",Ys,[p(l(C),{modelValue:u.value,"onUpdate:modelValue":i[0]||(i[0]=r=>u.value=r),label:"Departure",placeholder:"When are you flying?",format:"ddd, MMM D",min:l(g),max:l(z)},{prefix:t(()=>[p(l(zs),{class:"size-4 text-ink-gray-5"})]),_:1},8,["modelValue","min","max"]),p(l(C),{modelValue:x.value,"onUpdate:modelValue":i[1]||(i[1]=r=>x.value=r),label:"Date of birth",placeholder:"MM/DD/YYYY",format:"MMM D, YYYY",min:l(v),max:l(g),clearable:!1},{prefix:t(()=>[p(l(xs),{class:"size-4 text-ink-gray-5"})]),_:1},8,["modelValue","min","max"]),p(l(C),{modelValue:P.value,"onUpdate:modelValue":i[2]||(i[2]=r=>P.value=r),label:"Delivery date",placeholder:"Weekdays only",min:l(g),"is-date-unavailable":M},{prefix:t(()=>[p(l(vs),{class:"size-4 text-ink-gray-5"})]),actions:t(({setDate:r,close:k})=>[s("button",{type:"button",class:w($),onClick:()=>{r(l(c)().add(1,"day")),k()}}," Tomorrow ",8,Ms),s("button",{type:"button",class:w($),onClick:()=>{r(j()),k()}}," Next Monday ",8,Cs)]),_:1},8,["modelValue","min"]),p(l(C),{modelValue:y.value,"onUpdate:modelValue":i[3]||(i[3]=r=>y.value=r),label:"Book appointment",description:"Next 30 days. Greyed-out slots are full.",placeholder:"Pick a slot",min:l(g),max:l(b),"is-date-unavailable":o},{prefix:t(()=>[p(l(js),{class:"size-4 text-ink-gray-5"})]),_:1},8,["modelValue","min","max"]),p(l(C),{modelValue:f.value,"onUpdate:modelValue":i[4]||(i[4]=r=>f.value=r),label:"Spooky date",description:"Only Friday the 13ths qualify.",placeholder:"Pick if you dare",format:"dddd, MMM D, YYYY","is-date-unavailable":A},{prefix:t(()=>[p(l(bs),{class:"size-4 text-ink-gray-5"})]),_:1},8,["modelValue"]),p(l(C),{modelValue:V.value,"onUpdate:modelValue":i[5]||(i[5]=r=>V.value=r),label:"Time-travel destination",placeholder:"When to?",format:"[Stardate] YYYY.MM.DD",variant:"outline",min:l(m),max:l(e)},{prefix:t(()=>[p(l(B),{class:"size-4 text-ink-gray-5"})]),_:1},8,["modelValue","min","max"]),s("div",Ts,[i[7]||(i[7]=s("span",{class:"text-sm text-ink-gray-7"},"Task card affordance",-1)),p(l(C),{modelValue:_.value,"onUpdate:modelValue":i[6]||(i[6]=r=>_.value=r),format:"MMM D"},{trigger:t(({togglePopover:r,displayLabel:k})=>[p(l(N),{variant:_.value?"subtle":"ghost",onClick:r},{prefix:t(()=>[p(l(Ds),{class:"size-4"})]),default:t(()=>[a(" "+W(_.value?`Due ${k}`:"Add due date"),1)]),_:2},1032,["variant","onClick"])]),_:1},8,["modelValue"])])])]))}}),Hs=JSON.parse('{"title":"DatePicker","description":"","frontmatter":{},"headers":[],"relativePath":"docs/components/datepicker.md","filePath":"docs/components/datepicker.md","lastUpdated":1779053387000}'),qs={name:"docs/components/datepicker.md"},Os=Object.assign(qs,{setup(U){const u=[{name:"value",description:"Uncontrolled initial value for the picker.",required:!1,type:"string",default:'""',deprecated:"Use `modelValue` with `v-model` instead."},{name:"modelValue",description:"Controlled value for the picker.",required:!1,type:"string",default:'""'},{name:"side",description:"Preferred popover side relative to the trigger.",required:!1,type:"PopoverSide"},{name:"align",description:"Alignment of the popover along the trigger edge.",required:!1,type:"PopoverAlign"},{name:"offset",description:"Gap between the trigger and popover content in pixels.",required:!1,type:"number"},{name:"placement",description:"Preferred popover placement relative to the trigger.",required:!1,type:"DatePickerPlacement",deprecated:"Use `side` and `align` instead."},{name:"format",description:"Display format used for the input text.",required:!1,type:"string"},{name:"size",description:"Size of the trigger input.",required:!1,type:"InputSize"},{name:"variant",description:"Visual style variant passed through to the input.",required:!1,type:"InputVariant",default:'"subtle"'},{name:"placeholder",description:"Placeholder text shown when no value is selected.",required:!1,type:"string",default:'"Select date"'},{name:"open",description:"Controls popover open state (for controlled usage).",required:!1,type:"boolean"},{name:"openOnFocus",description:"Opens the popover when the input receives focus. Default: false.",required:!1,type:"boolean",default:"false"},{name:"openOnClick",description:"Opens the popover when the input is clicked. Default: true.",required:!1,type:"boolean",default:"true"},{name:"typeable",description:"Whether the trigger input accepts typed input. When `false` the user can\nstill open the popover and pick a date, but cannot type a date manually.\nDefault: `true`.",required:!1,type:"boolean",default:"true"},{name:"readonly",description:"Prevents manual typing while keeping the picker interactive.",required:!1,type:"boolean",default:"false",deprecated:"Use `typeable: false` instead."},{name:"disabled",description:"Disables the trigger input and calendar interactions.",required:!1,type:"boolean",default:"false"},{name:"clearable",description:"Shows clear and quick-action controls when enabled.",required:!1,type:"boolean",default:"true"},{name:"keepOpen",description:"Keeps the popover open after a date is selected. Default: false.",required:!1,type:"boolean"},{name:"autoClose",description:"Closes the popover after a value is picked.",required:!1,type:"boolean",default:"true",deprecated:"Use `keepOpen` instead (inverse semantics: `autoClose: false` → `keepOpen: true`)."},{name:"min",description:"Earliest selectable date. Accepts `YYYY-MM-DD` (or, for `DateTimePicker`,\n`YYYY-MM-DD HH:mm:ss` for second-level granularity).",required:!1,type:"string"},{name:"max",description:"Latest selectable date. Accepts `YYYY-MM-DD` (or, for `DateTimePicker`,\n`YYYY-MM-DD HH:mm:ss` for second-level granularity).",required:!1,type:"string"},{name:"isDateUnavailable",description:"Return true to prevent a date from being selected. Combined with `min`/`max`.",required:!1,type:"((date: Dayjs) => boolean)"},{name:"allowCustom",description:"Allows users to type custom date text into the input.",required:!1,type:"boolean",default:"true",deprecated:"Use `typeable: false` instead."},{name:"inputClass",description:"Additional classes applied to the trigger input.",required:!1,type:"string | string[] | Record<string, boolean>",deprecated:"Apply `class` directly to the DatePicker component element to control width."},{name:"label",description:"Label rendered above (or beside, for binary controls) the input.",required:!1,type:"string"},{name:"description",description:"Helper text rendered below the input.\nHidden when `error` is set.",required:!1,type:"string"},{name:"error",description:'Error message rendered below the input. When set, the control receives\n`aria-invalid="true"` and `data-state="invalid"`. May be either a string\nor an `Error` object whose `messages?: string[]` is rendered as stacked\nlines (with `Error.message` as the fallback).',required:!1,type:"string | FrappeUIError"},{name:"required",description:"Marks the field as required. Renders an asterisk next to the label and\nforwards `required` / `aria-required` to the underlying control.",required:!1,type:"boolean"},{name:"id",description:"HTML id of the underlying control. Auto-generated via `useId()` if omitted.",required:!1,type:"string"}],g=[{name:"trigger",description:"Custom trigger renderer for the picker.",type:"DatePickerTriggerSlotProps"},{name:"target",description:"Custom trigger renderer for the picker.",type:"DatePickerTriggerSlotProps",deprecated:"Use `#trigger` instead. `#target` remains as a back-compat alias through v1.x."},{name:"prefix",description:"Content rendered before the trigger input value.",type:"DatePickerTriggerSlotProps"},{name:"suffix",description:"Content rendered after the trigger input value.",type:"DatePickerTriggerSlotProps"},{name:"actions",description:`Sidebar rendered to the left of the calendar. Use for date shortcuts
("Today", "Tomorrow", "Last 7 days") and other preset actions. When
omitted, the popover shows the calendar only.`,type:"DatePickerActionsSlotProps"}],z=[{name:"update:modelValue",description:"Fired when the model value changes.",type:"[value: string]"},{name:"change",description:"Fired after the value is committed.",type:"[value: string]"},{name:"update:open",description:"Fired when the open state changes.",type:"[value: boolean]"}],x=[{name:"value",description:"Uncontrolled initial range value as `[from, to]` in `YYYY-MM-DD` format.",required:!1,type:"string[]",default:"[]",deprecated:"Use `modelValue` with `v-model` instead."},{name:"modelValue",description:"Controlled range value as `[from, to]` in `YYYY-MM-DD` format, or `[]` for no selection.",required:!1,type:"string[]",default:"[]"},{name:"dualPane",description:"Render two calendar panels side by side (current month + next month).",required:!1,type:"boolean",default:"false"},{name:"side",description:"Preferred popover side relative to the trigger.",required:!1,type:"PopoverSide"},{name:"align",description:"Alignment of the popover along the trigger edge.",required:!1,type:"PopoverAlign"},{name:"offset",description:"Gap between the trigger and popover content in pixels.",required:!1,type:"number"},{name:"placement",description:"Preferred popover placement relative to the trigger.",required:!1,type:"DatePickerPlacement",deprecated:"Use `side` and `align` instead."},{name:"format",description:"Display format used for the input text.",required:!1,type:"string"},{name:"size",description:"Size of the trigger input.",required:!1,type:"InputSize"},{name:"variant",description:"Visual style variant passed through to the input.",required:!1,type:"InputVariant",default:'"subtle"'},{name:"placeholder",description:"Placeholder text shown when no value is selected.",required:!1,type:"string",default:'"Select range"'},{name:"open",description:"Controls popover open state (for controlled usage).",required:!1,type:"boolean"},{name:"openOnFocus",description:"Opens the popover when the input receives focus. Default: false.",required:!1,type:"boolean",default:"false"},{name:"openOnClick",description:"Opens the popover when the input is clicked. Default: true.",required:!1,type:"boolean",default:"true"},{name:"typeable",description:"Whether the trigger input accepts typed input. When `false` the user can\nstill open the popover and pick a date, but cannot type a date manually.\nDefault: `true`.",required:!1,type:"boolean",default:"true"},{name:"readonly",description:"Prevents manual typing while keeping the picker interactive.",required:!1,type:"boolean",default:"false",deprecated:"Use `typeable: false` instead."},{name:"disabled",description:"Disables the trigger input and calendar interactions.",required:!1,type:"boolean",default:"false"},{name:"clearable",description:"Shows clear and quick-action controls when enabled.",required:!1,type:"boolean",default:"true"},{name:"keepOpen",description:"Keeps the popover open after a date is selected. Default: false.",required:!1,type:"boolean"},{name:"autoClose",description:"Closes the popover after a value is picked.",required:!1,type:"boolean",default:"true",deprecated:"Use `keepOpen` instead (inverse semantics: `autoClose: false` → `keepOpen: true`)."},{name:"min",description:"Earliest selectable date. Accepts `YYYY-MM-DD` (or, for `DateTimePicker`,\n`YYYY-MM-DD HH:mm:ss` for second-level granularity).",required:!1,type:"string"},{name:"max",description:"Latest selectable date. Accepts `YYYY-MM-DD` (or, for `DateTimePicker`,\n`YYYY-MM-DD HH:mm:ss` for second-level granularity).",required:!1,type:"string"},{name:"isDateUnavailable",description:"Return true to prevent a date from being selected. Combined with `min`/`max`.",required:!1,type:"((date: Dayjs) => boolean)"},{name:"allowCustom",description:"Allows users to type custom date text into the input.",required:!1,type:"boolean",default:"true",deprecated:"Use `typeable: false` instead."},{name:"inputClass",description:"Additional classes applied to the trigger input.",required:!1,type:"string | string[] | Record<string, boolean>",deprecated:"Apply `class` directly to the DatePicker component element to control width."},{name:"label",description:"Label rendered above (or beside, for binary controls) the input.",required:!1,type:"string"},{name:"description",description:"Helper text rendered below the input.\nHidden when `error` is set.",required:!1,type:"string"},{name:"error",description:'Error message rendered below the input. When set, the control receives\n`aria-invalid="true"` and `data-state="invalid"`. May be either a string\nor an `Error` object whose `messages?: string[]` is rendered as stacked\nlines (with `Error.message` as the fallback).',required:!1,type:"string | FrappeUIError"},{name:"required",description:"Marks the field as required. Renders an asterisk next to the label and\nforwards `required` / `aria-required` to the underlying control.",required:!1,type:"boolean"},{name:"id",description:"HTML id of the underlying control. Auto-generated via `useId()` if omitted.",required:!1,type:"string"}],v=[{name:"trigger",description:"",type:"DatePickerTriggerSlotProps"},{name:"target",description:"",type:"DatePickerTriggerSlotProps",deprecated:"Use `#trigger` instead."},{name:"prefix",description:"",type:"DatePickerTriggerSlotProps"},{name:"suffix",description:"",type:"DatePickerTriggerSlotProps"},{name:"actions",description:`Sidebar rendered to the left of the calendar. Use for range shortcuts
("Last 7 days", "Last 12 months") and other preset actions. When
omitted, the popover shows the calendar only.`,type:"DateRangePickerActionsSlotProps"}],P=[{name:"update:modelValue",description:"Fired when the model value changes.",type:"[value: DateRangeValue]"},{name:"change",description:"Fired after the value is committed.",type:"[value: DateRangeValue]"},{name:"update:open",description:"Fired when the open state changes.",type:"[value: boolean]"}],M=[{name:"value",description:"Uncontrolled initial value for the picker.",required:!1,type:"string",default:'""',deprecated:"Use `modelValue` with `v-model` instead."},{name:"modelValue",description:"Controlled value for the picker.",required:!1,type:"string",default:'""'},{name:"minDateTime",description:"Earliest selectable date-time in `YYYY-MM-DD HH:mm:ss` format.",required:!1,type:"string",deprecated:"Use `min` instead."},{name:"maxDateTime",description:"Latest selectable date-time in `YYYY-MM-DD HH:mm:ss` format.",required:!1,type:"string",deprecated:"Use `max` instead."},{name:"allowCustomTime",description:"Allows typing a custom time into the embedded time picker.",required:!1,type:"boolean",default:"true"},{name:"side",description:"Preferred popover side relative to the trigger.",required:!1,type:"PopoverSide"},{name:"align",description:"Alignment of the popover along the trigger edge.",required:!1,type:"PopoverAlign"},{name:"offset",description:"Gap between the trigger and popover content in pixels.",required:!1,type:"number"},{name:"placement",description:"Preferred popover placement relative to the trigger.",required:!1,type:"DatePickerPlacement",deprecated:"Use `side` and `align` instead."},{name:"format",description:"Display format used for the input text.",required:!1,type:"string"},{name:"size",description:"Size of the trigger input.",required:!1,type:"InputSize"},{name:"variant",description:"Visual style variant passed through to the input.",required:!1,type:"InputVariant",default:'"subtle"'},{name:"placeholder",description:"Placeholder text shown when no value is selected.",required:!1,type:"string",default:'"Select date & time"'},{name:"open",description:"Controls popover open state (for controlled usage).",required:!1,type:"boolean"},{name:"openOnFocus",description:"Opens the popover when the input receives focus. Default: false.",required:!1,type:"boolean",default:"false"},{name:"openOnClick",description:"Opens the popover when the input is clicked. Default: true.",required:!1,type:"boolean",default:"true"},{name:"typeable",description:"Whether the trigger input accepts typed input. When `false` the user can\nstill open the popover and pick a date, but cannot type a date manually.\nDefault: `true`.",required:!1,type:"boolean",default:"true"},{name:"readonly",description:"Prevents manual typing while keeping the picker interactive.",required:!1,type:"boolean",default:"false",deprecated:"Use `typeable: false` instead."},{name:"disabled",description:"Disables the trigger input and calendar interactions.",required:!1,type:"boolean",default:"false"},{name:"clearable",description:"Shows clear and quick-action controls when enabled.",required:!1,type:"boolean",default:"true"},{name:"keepOpen",description:"Keeps the popover open after a date is selected. Default: false.",required:!1,type:"boolean"},{name:"autoClose",description:"Closes the popover after a value is picked.",required:!1,type:"boolean",default:"true",deprecated:"Use `keepOpen` instead (inverse semantics: `autoClose: false` → `keepOpen: true`)."},{name:"min",description:"Earliest selectable date. Accepts `YYYY-MM-DD` (or, for `DateTimePicker`,\n`YYYY-MM-DD HH:mm:ss` for second-level granularity).",required:!1,type:"string"},{name:"max",description:"Latest selectable date. Accepts `YYYY-MM-DD` (or, for `DateTimePicker`,\n`YYYY-MM-DD HH:mm:ss` for second-level granularity).",required:!1,type:"string"},{name:"isDateUnavailable",description:"Return true to prevent a date from being selected. Combined with `min`/`max`.",required:!1,type:"((date: Dayjs) => boolean)"},{name:"allowCustom",description:"Allows users to type custom date text into the input.",required:!1,type:"boolean",default:"true",deprecated:"Use `typeable: false` instead."},{name:"inputClass",description:"Additional classes applied to the trigger input.",required:!1,type:"string | string[] | Record<string, boolean>",deprecated:"Apply `class` directly to the DatePicker component element to control width."},{name:"label",description:"Label rendered above (or beside, for binary controls) the input.",required:!1,type:"string"},{name:"description",description:"Helper text rendered below the input.\nHidden when `error` is set.",required:!1,type:"string"},{name:"error",description:'Error message rendered below the input. When set, the control receives\n`aria-invalid="true"` and `data-state="invalid"`. May be either a string\nor an `Error` object whose `messages?: string[]` is rendered as stacked\nlines (with `Error.message` as the fallback).',required:!1,type:"string | FrappeUIError"},{name:"required",description:"Marks the field as required. Renders an asterisk next to the label and\nforwards `required` / `aria-required` to the underlying control.",required:!1,type:"boolean"},{name:"id",description:"HTML id of the underlying control. Auto-generated via `useId()` if omitted.",required:!1,type:"string"}],j=[{name:"trigger",description:"",type:"DatePickerTriggerSlotProps"},{name:"target",description:"",type:"DatePickerTriggerSlotProps",deprecated:"Use `#trigger` instead."},{name:"prefix",description:"",type:"DatePickerTriggerSlotProps"},{name:"suffix",description:"",type:"DatePickerTriggerSlotProps"},{name:"actions",description:`Sidebar rendered to the left of the calendar. Use for date-time
shortcuts ("Now", "Tomorrow 9am") and other preset actions. When
omitted, the popover shows the calendar and time picker only.`,type:"DateTimePickerActionsSlotProps"}],y=[{name:"update:modelValue",description:"Fired when the model value changes.",type:"[value: string]"},{name:"change",description:"Fired after the value is committed.",type:"[value: string]"},{name:"update:open",description:"Fired when the open state changes.",type:"[value: boolean]"}];return(b,n)=>{const o=K("ComponentPreview");return S(),q("div",null,[n[6]||(n[6]=s("h1",{id:"datepicker",tabindex:"-1"},[a("DatePicker "),s("a",{class:"header-anchor",href:"#datepicker","aria-label":"Permalink to “DatePicker”"},"​")],-1)),n[7]||(n[7]=s("p",null,"A set of pickers for selecting dates, date ranges, or date and time. Smooth, intuitive interfaces make choosing and adjusting values quick and precise.",-1)),n[8]||(n[8]=s("h2",{id:"date-picker",tabindex:"-1"},[a("Date Picker "),s("a",{class:"header-anchor",href:"#date-picker","aria-label":"Permalink to “Date Picker”"},"​")],-1)),p(o,{name:"DatePicker-Examples"},{code:t(()=>[...n[0]||(n[0]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"ref"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"DatePicker"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," Button"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"dayjs"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"../../../utils/dayjs"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"Dayjs"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"dayjs/esm"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_4q1z3w"}," LucidePlane"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"~icons/lucide/plane"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_4q1z3w"}," LucideCake"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"~icons/lucide/cake"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_4q1z3w"}," LucideTruck"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"~icons/lucide/truck"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_4q1z3w"}," LucideStethoscope"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"~icons/lucide/stethoscope"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_4q1z3w"}," LucideGhost"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"~icons/lucide/ghost"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_4q1z3w"}," LucideRocket"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"~icons/lucide/rocket"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_4q1z3w"}," LucideCalendarPlus"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"~icons/lucide/calendar-plus"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// 1. Flight booking — can't fly into the past")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," departure"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"''"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," today"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," dayjs"),s("span",{class:"s_13ahmt"},"()"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"format"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"YYYY-MM-DD"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," oneYearOut"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," dayjs"),s("span",{class:"s_13ahmt"},"()"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"add"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_40mev6"},"1"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"year"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"format"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"YYYY-MM-DD"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// 2. Date of birth — can't be born in the future")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," dob"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"1995-08-14"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," longAgo"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," dayjs"),s("span",{class:"s_13ahmt"},"()"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"subtract"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_40mev6"},"120"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"year"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"format"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"YYYY-MM-DD"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// 3. Delivery — weekdays only with custom quick actions")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," delivery"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"''"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_50ecpt"},"function"),s("span",{class:"s_indoxt"}," isWeekend"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_fsg3al"},"date"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Dayjs"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"  const"),s("span",{class:"s_295sjd"}," day"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_22m8k2"}," date"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"day"),s("span",{class:"s_13ahmt"},"()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_29n2kq"},"  return"),s("span",{class:"s_22m8k2"}," day"),s("span",{class:"s_50ecpt"}," ==="),s("span",{class:"s_40mev6"}," 0"),s("span",{class:"s_50ecpt"}," ||"),s("span",{class:"s_22m8k2"}," day"),s("span",{class:"s_50ecpt"}," ==="),s("span",{class:"s_40mev6"}," 6")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_50ecpt"},"function"),s("span",{class:"s_indoxt"}," nextMonday"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_fsg3al"},"from"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Dayjs"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," dayjs"),s("span",{class:"s_13ahmt"},"())"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"  const"),s("span",{class:"s_295sjd"}," diff"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_40mev6"},"8"),s("span",{class:"s_2ekfrt"}," -"),s("span",{class:"s_22m8k2"}," from"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"day"),s("span",{class:"s_13ahmt"},"()) "),s("span",{class:"s_2ekfrt"},"%"),s("span",{class:"s_40mev6"}," 7"),s("span",{class:"s_50ecpt"}," ||"),s("span",{class:"s_40mev6"}," 7")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_29n2kq"},"  return"),s("span",{class:"s_22m8k2"}," from"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"add"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_22m8k2"},"diff"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"day"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// 4. Appointment — bookable in next 30 days, doc unavailable on a few dates")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," appointment"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"''"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," inThirtyDays"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," dayjs"),s("span",{class:"s_13ahmt"},"()"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"add"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_40mev6"},"30"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"day"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"format"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"YYYY-MM-DD"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," fullyBooked"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_2ekfrt"}," new"),s("span",{class:"s_indoxt"}," Set"),s("span",{class:"s_13ahmt"},"([")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  dayjs"),s("span",{class:"s_13ahmt"},"()"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"add"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_40mev6"},"2"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"day"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"format"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"YYYY-MM-DD"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  dayjs"),s("span",{class:"s_13ahmt"},"()"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"add"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_40mev6"},"5"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"day"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"format"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"YYYY-MM-DD"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  dayjs"),s("span",{class:"s_13ahmt"},"()"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"add"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_40mev6"},"11"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"day"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"format"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"YYYY-MM-DD"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  dayjs"),s("span",{class:"s_13ahmt"},"()"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"add"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_40mev6"},"18"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"day"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"format"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"YYYY-MM-DD"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"])")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_50ecpt"},"function"),s("span",{class:"s_indoxt"}," isFullyBooked"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_fsg3al"},"date"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Dayjs"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_29n2kq"},"  return"),s("span",{class:"s_22m8k2"}," fullyBooked"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"has"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_22m8k2"},"date"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"format"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"YYYY-MM-DD"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},"))")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// 5. Fun — only Friday the 13ths are pickable")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," spookyDate"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"''"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_50ecpt"},"function"),s("span",{class:"s_indoxt"}," notFridayThe13th"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_fsg3al"},"date"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Dayjs"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_29n2kq"},"  return"),s("span",{class:"s_50ecpt"}," !"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_22m8k2"},"date"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"day"),s("span",{class:"s_13ahmt"},"() "),s("span",{class:"s_50ecpt"},"==="),s("span",{class:"s_40mev6"}," 5"),s("span",{class:"s_50ecpt"}," &&"),s("span",{class:"s_22m8k2"}," date"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"date"),s("span",{class:"s_13ahmt"},"() "),s("span",{class:"s_50ecpt"},"==="),s("span",{class:"s_40mev6"}," 13"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// 6. Fun — pick a Stardate for a time-travel destination")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," stardate"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"''"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," stardateFloor"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," dayjs"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"1800-01-01"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"format"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"YYYY-MM-DD"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," stardateCeil"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," dayjs"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"2300-12-31"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"format"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"YYYY-MM-DD"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'// 7. Custom trigger — "Add due date" button on a task card')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," dueDate"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"''"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// Canonical sidebar row styling for #actions.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," rowCls"),s("span",{class:"s_2ekfrt"}," =")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},"  '"),s("span",{class:"s_2575z4"},"w-full rounded px-2 py-1.5 text-left text-base hover:bg-surface-gray-2"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"w-full items-center grid *:w-fit justify-center !py-20 !gap-1"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"      <!-- 1. Flight booking -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"DatePicker")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        v-model"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"departure"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Departure"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        placeholder"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"When are you flying?"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        format"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ddd, MMM D"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        :min"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"today"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        :max"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"oneYearOut"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"prefix"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_wac0bt"},"LucidePlane"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"size-4 text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"}," />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_wac0bt"},"DatePicker"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"      <!-- 2. Date of birth -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"DatePicker")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        v-model"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"dob"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Date of birth"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        placeholder"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"MM/DD/YYYY"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        format"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"MMM D, YYYY"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        :min"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"longAgo"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        :max"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"today"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        :clearable"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"false"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"prefix"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_wac0bt"},"LucideCake"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"size-4 text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"}," />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_wac0bt"},"DatePicker"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"      <!-- 3. Delivery scheduling -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"DatePicker")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        v-model"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"delivery"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Delivery date"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        placeholder"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Weekdays only"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        :min"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"today"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        :is-date-unavailable"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"isWeekend"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"prefix"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_wac0bt"},"LucideTruck"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"size-4 text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"}," />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"actions"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_13ahmt"},"{"),s("span",{class:"s_22m8k2"}," setDate"),s("span",{class:"s_1jjt6x"},", "),s("span",{class:"s_22m8k2"},"close"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            type"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"button"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"rowCls"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              () => {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"                setDate(dayjs().add(1, 'day'))")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"                close()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              }")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},'            "')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"            Tomorrow")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          </"),s("span",{class:"s_1uuh8p"},"button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            type"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"button"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"rowCls"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              () => {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"                setDate(nextMonday())")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"                close()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              }")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},'            "')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"            Next Monday")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          </"),s("span",{class:"s_1uuh8p"},"button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_wac0bt"},"DatePicker"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"      <!-- 4. Doctor's appointment -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"DatePicker")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        v-model"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"appointment"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Book appointment"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        description"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Next 30 days. Greyed-out slots are full."),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        placeholder"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Pick a slot"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        :min"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"today"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        :max"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"inThirtyDays"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        :is-date-unavailable"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"isFullyBooked"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"prefix"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_wac0bt"},"LucideStethoscope"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"size-4 text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"}," />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_wac0bt"},"DatePicker"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"      <!-- 5. Fun: Friday the 13th -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"DatePicker")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        v-model"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"spookyDate"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Spooky date"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        description"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Only Friday the 13ths qualify."),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        placeholder"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Pick if you dare"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        format"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"dddd, MMM D, YYYY"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        :is-date-unavailable"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"notFridayThe13th"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"prefix"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_wac0bt"},"LucideGhost"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"size-4 text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"}," />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_wac0bt"},"DatePicker"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"      <!-- 6. Fun: Time-travel destination -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"DatePicker")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        v-model"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"stardate"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Time-travel destination"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        placeholder"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"When to?"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        format"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"[Stardate] YYYY.MM.DD"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        variant"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"outline"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        :min"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"stardateFloor"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        :max"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"stardateCeil"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"prefix"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_wac0bt"},"LucideRocket"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"size-4 text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"}," />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_wac0bt"},"DatePicker"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"      <!-- 7. Custom trigger — feels like a task-card affordance -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"flex flex-col gap-1.5 sm:col-span-2"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"text-sm text-ink-gray-7"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"},"Task card affordance"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_wac0bt"},"DatePicker"),s("span",{class:"s_1i4ay4"}," v-model"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"dueDate"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1i4ay4"}," format"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"MMM D"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"trigger"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_13ahmt"},"{"),s("span",{class:"s_22m8k2"}," togglePopover"),s("span",{class:"s_1jjt6x"},", "),s("span",{class:"s_22m8k2"},"displayLabel"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            <"),s("span",{class:"s_1uuh8p"},"Button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"              :variant"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"dueDate ? 'subtle' : 'ghost'"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"              @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"togglePopover"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"              <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"prefix"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"                <"),s("span",{class:"s_wac0bt"},"LucideCalendarPlus"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"size-4"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"}," />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"              </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"              {{ dueDate ? `Due ${displayLabel}` : 'Add due date' }}")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            </"),s("span",{class:"s_1uuh8p"},"Button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_wac0bt"},"DatePicker"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:t(()=>[p(Ss)]),_:1}),n[9]||(n[9]=s("h2",{id:"datetime-picker",tabindex:"-1"},[a("DateTime Picker "),s("a",{class:"header-anchor",href:"#datetime-picker","aria-label":"Permalink to “DateTime Picker”"},"​")],-1)),p(o,{name:"DatePicker-DateTime"},{code:t(()=>[...n[1]||(n[1]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"ref"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"DateTimePicker"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"dayjs"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"../../../utils/dayjs"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_4q1z3w"}," LucideCalendarClock"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"~icons/lucide/calendar-clock"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_4q1z3w"}," LucideServer"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"~icons/lucide/server"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_4q1z3w"}," LucideRocket"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"~icons/lucide/rocket"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// 1. Meeting — can't schedule in the past, default to the next 30-min slot")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," now"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," dayjs"),s("span",{class:"s_13ahmt"},"()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," nextSlot"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_22m8k2"}," now")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1jjt6x"},"  ."),s("span",{class:"s_indoxt"},"minute"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_22m8k2"},"now"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"minute"),s("span",{class:"s_13ahmt"},"()"),s("span",{class:"s_50ecpt"}," <"),s("span",{class:"s_40mev6"}," 30"),s("span",{class:"s_50ecpt"}," ?"),s("span",{class:"s_40mev6"}," 30"),s("span",{class:"s_50ecpt"}," :"),s("span",{class:"s_40mev6"}," 60"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1jjt6x"},"  ."),s("span",{class:"s_indoxt"},"second"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_40mev6"},"0"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1jjt6x"},"  ."),s("span",{class:"s_indoxt"},"format"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"YYYY-MM-DD HH:mm:ss"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," meeting"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_22m8k2"},"nextSlot"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," minMeetingTime"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_22m8k2"}," now"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"format"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"YYYY-MM-DD HH:mm:ss"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// 2. Server maintenance window — must be at least 24h out, max 60 days")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," maintenance"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"''"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," tomorrow"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," dayjs"),s("span",{class:"s_13ahmt"},"()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1jjt6x"},"  ."),s("span",{class:"s_indoxt"},"add"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_40mev6"},"1"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"day"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1jjt6x"},"  ."),s("span",{class:"s_indoxt"},"startOf"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"day"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1jjt6x"},"  ."),s("span",{class:"s_indoxt"},"format"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"YYYY-MM-DD HH:mm:ss"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," sixtyDaysOut"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," dayjs"),s("span",{class:"s_13ahmt"},"()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1jjt6x"},"  ."),s("span",{class:"s_indoxt"},"add"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_40mev6"},"60"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"day"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1jjt6x"},"  ."),s("span",{class:"s_indoxt"},"endOf"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"day"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1jjt6x"},"  ."),s("span",{class:"s_indoxt"},"format"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"YYYY-MM-DD HH:mm:ss"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'// 3. Fun — schedule the great launch (with a "Pick a dramatic moment" preset)')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," launch"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"''"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_50ecpt"},"function"),s("span",{class:"s_indoxt"}," nextFridayMidnight"),s("span",{class:"s_13ahmt"},"()"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"  const"),s("span",{class:"s_295sjd"}," today"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," dayjs"),s("span",{class:"s_13ahmt"},"()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"  const"),s("span",{class:"s_295sjd"}," diff"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_40mev6"},"5"),s("span",{class:"s_2ekfrt"}," -"),s("span",{class:"s_22m8k2"}," today"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"day"),s("span",{class:"s_13ahmt"},"() "),s("span",{class:"s_2ekfrt"},"+"),s("span",{class:"s_40mev6"}," 7"),s("span",{class:"s_13ahmt"},") "),s("span",{class:"s_2ekfrt"},"%"),s("span",{class:"s_40mev6"}," 7"),s("span",{class:"s_50ecpt"}," ||"),s("span",{class:"s_40mev6"}," 7")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_29n2kq"},"  return"),s("span",{class:"s_22m8k2"}," today"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"add"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_22m8k2"},"diff"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"day"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"hour"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_40mev6"},"0"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"minute"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_40mev6"},"0"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"second"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_40mev6"},"0"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," rowCls"),s("span",{class:"s_2ekfrt"}," =")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},"  '"),s("span",{class:"s_2575z4"},"w-full rounded px-2 py-1.5 text-left text-base hover:bg-surface-gray-2"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"w-full items-center grid *:w-fit justify-center !py-20 !gap-1"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"grid w-full max-w-2xl grid-cols-1 gap-6"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"      <!-- 1. Meeting scheduler -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"DateTimePicker")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        v-model"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"meeting"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Meeting time"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        placeholder"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"When should we meet?"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        :min"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"minMeetingTime"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        format"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ddd, MMM D · h:mm A"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"prefix"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_wac0bt"},"LucideCalendarClock"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"size-4 text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"}," />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_wac0bt"},"DateTimePicker"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"      <!-- 2. Maintenance window -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"DateTimePicker")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        v-model"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"maintenance"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Maintenance window"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        description"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Must be scheduled at least 24 hours in advance."),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        placeholder"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Pick a low-traffic time"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        :min"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"tomorrow"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        :max"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"sixtyDaysOut"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"prefix"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_wac0bt"},"LucideServer"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"size-4 text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"}," />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_wac0bt"},"DateTimePicker"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"      <!-- 3. Fun: dramatic launch moment -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"DateTimePicker")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        v-model"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"launch"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Launch moment"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        placeholder"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"When do we light the candle?"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        format"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"MMMM D, YYYY [at] h:mm A"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        variant"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"outline"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"prefix"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_wac0bt"},"LucideRocket"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"size-4 text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"}," />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"actions"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_13ahmt"},"{"),s("span",{class:"s_22m8k2"}," setDate"),s("span",{class:"s_1jjt6x"},", "),s("span",{class:"s_22m8k2"},"close"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            type"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"button"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"rowCls"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              () => {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"                setDate(dayjs().add(1, 'day').hour(12).minute(0))")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"                close()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              }")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},'            "')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"            High noon")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          </"),s("span",{class:"s_1uuh8p"},"button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            type"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"button"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"rowCls"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              () => {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"                setDate(nextFridayMidnight())")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"                close()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              }")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},'            "')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"            Midnight Friday")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          </"),s("span",{class:"s_1uuh8p"},"button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            type"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"button"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"rowCls"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              () => {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"                setDate(dayjs().add(1, 'day').hour(6).minute(15))")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"                close()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              }")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},'            "')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"            Sunrise")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          </"),s("span",{class:"s_1uuh8p"},"button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_wac0bt"},"DateTimePicker"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:t(()=>[p(gs)]),_:1}),n[10]||(n[10]=s("h2",{id:"date-range-picker",tabindex:"-1"},[a("Date Range Picker "),s("a",{class:"header-anchor",href:"#date-range-picker","aria-label":"Permalink to “Date Range Picker”"},"​")],-1)),p(o,{name:"DatePicker-Range"},{code:t(()=>[...n[2]||(n[2]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"computed"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," ref"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"DateRangePicker"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"dayjs"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"../../../utils/dayjs"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"Dayjs"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"dayjs/esm"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," today"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," dayjs"),s("span",{class:"s_13ahmt"},"()"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"format"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"YYYY-MM-DD"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," oneYearOut"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," dayjs"),s("span",{class:"s_13ahmt"},"()"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"add"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_40mev6"},"1"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"year"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"format"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"YYYY-MM-DD"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// 1. PTO request — quick presets feel native to HR tools")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," timeOff"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_13ahmt"},"[]"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_13ahmt"},"([])")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// 2. Hotel booking — dual pane, check-in must be today or later")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," stay"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_13ahmt"},"[]"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_13ahmt"},"([])")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// 3. Analytics filter — preset-driven, displays compact format")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," analyticsRange"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_13ahmt"},"[]"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_13ahmt"},"([")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  dayjs"),s("span",{class:"s_13ahmt"},"()"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"subtract"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_40mev6"},"29"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"day"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"format"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"YYYY-MM-DD"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  dayjs"),s("span",{class:"s_13ahmt"},"()"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"format"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"YYYY-MM-DD"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"])")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_50ecpt"},"function"),s("span",{class:"s_indoxt"}," longWeekend"),s("span",{class:"s_13ahmt"},"()"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_euu481"},"Dayjs"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_euu481"}," Dayjs"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"  const"),s("span",{class:"s_295sjd"}," fri"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," upcomingDay"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_40mev6"},"5"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_29n2kq"},"  return"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_11933w"},"fri"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_22m8k2"}," fri"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"add"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_40mev6"},"2"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"day"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_50ecpt"},"function"),s("span",{class:"s_indoxt"}," workWeek"),s("span",{class:"s_13ahmt"},"()"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_euu481"},"Dayjs"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_euu481"}," Dayjs"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"  const"),s("span",{class:"s_295sjd"}," mon"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," upcomingDay"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_40mev6"},"1"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_29n2kq"},"  return"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_11933w"},"mon"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_22m8k2"}," mon"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"add"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_40mev6"},"4"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"day"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_50ecpt"},"function"),s("span",{class:"s_indoxt"}," upcomingDay"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_fsg3al"},"weekday"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"  const"),s("span",{class:"s_295sjd"}," t"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," dayjs"),s("span",{class:"s_13ahmt"},"()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"  const"),s("span",{class:"s_295sjd"}," diff"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_22m8k2"},"weekday"),s("span",{class:"s_2ekfrt"}," -"),s("span",{class:"s_22m8k2"}," t"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"day"),s("span",{class:"s_13ahmt"},"() "),s("span",{class:"s_2ekfrt"},"+"),s("span",{class:"s_40mev6"}," 7"),s("span",{class:"s_13ahmt"},") "),s("span",{class:"s_2ekfrt"},"%"),s("span",{class:"s_40mev6"}," 7"),s("span",{class:"s_50ecpt"}," ||"),s("span",{class:"s_40mev6"}," 7")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_29n2kq"},"  return"),s("span",{class:"s_22m8k2"}," t"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"add"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_22m8k2"},"diff"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"day"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_50ecpt"},"function"),s("span",{class:"s_indoxt"}," lastNDays"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_fsg3al"},"days"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," number"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_euu481"},"Dayjs"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_euu481"}," Dayjs"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_29n2kq"},"  return"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_indoxt"},"dayjs"),s("span",{class:"s_13ahmt"},"()"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"subtract"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_11933w"},"days"),s("span",{class:"s_2ekfrt"}," -"),s("span",{class:"s_40mev6"}," 1"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"day"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_indoxt"}," dayjs"),s("span",{class:"s_13ahmt"},"()]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// Canonical sidebar row styling.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," rowCls"),s("span",{class:"s_2ekfrt"}," =")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},"  '"),s("span",{class:"s_2575z4"},"w-full rounded px-2 py-1.5 text-left text-base hover:bg-surface-gray-2"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// 4. Project sprint — weekdays only, span limited to ~2 weeks via `max`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," sprint"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_13ahmt"},"[]"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_13ahmt"},"([])")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," sprintEnd"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," dayjs"),s("span",{class:"s_13ahmt"},"()"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"add"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_40mev6"},"60"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"day"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"format"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"YYYY-MM-DD"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_50ecpt"},"function"),s("span",{class:"s_indoxt"}," isWeekend"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_fsg3al"},"date"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Dayjs"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"  const"),s("span",{class:"s_295sjd"}," d"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_22m8k2"}," date"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"day"),s("span",{class:"s_13ahmt"},"()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_29n2kq"},"  return"),s("span",{class:"s_22m8k2"}," d"),s("span",{class:"s_50ecpt"}," ==="),s("span",{class:"s_40mev6"}," 0"),s("span",{class:"s_50ecpt"}," ||"),s("span",{class:"s_22m8k2"}," d"),s("span",{class:"s_50ecpt"}," ==="),s("span",{class:"s_40mev6"}," 6")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// 5. Flight booking — custom #trigger renders two side-by-side inputs")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// that share one popover, so the calendar still visualizes the range.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," flight"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_13ahmt"},"[]"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_13ahmt"},"([])")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," depart"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," computed"),s("span",{class:"s_13ahmt"},"(()"),s("span",{class:"s_50ecpt"}," =>")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_22m8k2"},"  flight"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"value"),s("span",{class:"s_13ahmt"},"["),s("span",{class:"s_40mev6"},"0"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_50ecpt"}," ?"),s("span",{class:"s_indoxt"}," dayjs"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_22m8k2"},"flight"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"value"),s("span",{class:"s_13ahmt"},"["),s("span",{class:"s_40mev6"},"0"),s("span",{class:"s_13ahmt"},"])"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"format"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"ddd, MMM D"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," :"),s("span",{class:"s_w1p9wo"}," ''"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," ret"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," computed"),s("span",{class:"s_13ahmt"},"(()"),s("span",{class:"s_50ecpt"}," =>")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_22m8k2"},"  flight"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"value"),s("span",{class:"s_13ahmt"},"["),s("span",{class:"s_40mev6"},"1"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_50ecpt"}," ?"),s("span",{class:"s_indoxt"}," dayjs"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_22m8k2"},"flight"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"value"),s("span",{class:"s_13ahmt"},"["),s("span",{class:"s_40mev6"},"1"),s("span",{class:"s_13ahmt"},"])"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"format"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"ddd, MMM D"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," :"),s("span",{class:"s_w1p9wo"}," ''"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"w-full items-center grid *:w-fit justify-center !py-20 !gap-1"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"grid w-full max-w-3xl grid-cols-1 gap-6"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"      <!-- 1. PTO request -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"DateRangePicker")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        v-model"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"timeOff"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Time off"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        placeholder"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Pick your dates"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        :min"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"today"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"prefix"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"span")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"lucide-palmtree size-4 text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            aria-hidden"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"true"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_28rvie"},"          /"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"actions"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_13ahmt"},"{"),s("span",{class:"s_22m8k2"}," setRange"),s("span",{class:"s_1jjt6x"},", "),s("span",{class:"s_22m8k2"},"close"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            type"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"button"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"rowCls"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              () => {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"                setRange(longWeekend())")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"                close()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              }")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},'            "')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"            Long weekend")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          </"),s("span",{class:"s_1uuh8p"},"button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            type"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"button"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"rowCls"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              () => {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"                setRange(workWeek())")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"                close()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              }")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},'            "')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"            Next week")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          </"),s("span",{class:"s_1uuh8p"},"button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_wac0bt"},"DateRangePicker"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"      <!-- 2. Hotel booking — dual pane shines for >1 month stays -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"DateRangePicker")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        v-model"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"stay"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Check-in / Check-out"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        placeholder"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Select your stay"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        dual-pane")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        :min"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"today"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        :max"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"oneYearOut"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"prefix"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"lucide-hotel size-4 text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1i4ay4"}," aria-hidden"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"true"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_28rvie"}," /"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_wac0bt"},"DateRangePicker"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"      <!-- 3. Analytics date range filter -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"DateRangePicker")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        v-model"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"analyticsRange"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Report range"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        description"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Defaults to the last 30 days."),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        format"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"MMM D"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        :max"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"today"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"prefix"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"span")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"lucide-chart-line size-4 text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            aria-hidden"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"true"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_28rvie"},"          /"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"actions"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_13ahmt"},"{"),s("span",{class:"s_22m8k2"}," fromDate"),s("span",{class:"s_1jjt6x"},", "),s("span",{class:"s_22m8k2"},"toDate"),s("span",{class:"s_1jjt6x"},", "),s("span",{class:"s_22m8k2"},"setRange"),s("span",{class:"s_1jjt6x"},", "),s("span",{class:"s_22m8k2"},"clear"),s("span",{class:"s_1jjt6x"},", "),s("span",{class:"s_22m8k2"},"close"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            type"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"button"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"rowCls"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              () => {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"                setRange([dayjs(), dayjs()])")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"                close()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              }")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},'            "')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"            Today")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          </"),s("span",{class:"s_1uuh8p"},"button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            type"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"button"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"rowCls"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              () => {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"                setRange(lastNDays(7))")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"                close()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              }")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},'            "')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"            Last 7 days")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          </"),s("span",{class:"s_1uuh8p"},"button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            type"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"button"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"rowCls"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              () => {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"                setRange(lastNDays(28))")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"                close()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              }")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},'            "')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"            Last 4 weeks")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          </"),s("span",{class:"s_1uuh8p"},"button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            type"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"button"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"rowCls"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              () => {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"                setRange(lastNDays(90))")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"                close()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              }")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},'            "')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"            Last 3 months")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          </"),s("span",{class:"s_1uuh8p"},"button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            type"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"button"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"rowCls"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              () => {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"                setRange(lastNDays(365))")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"                close()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              }")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},'            "')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"            Last 12 months")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          </"),s("span",{class:"s_1uuh8p"},"button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"hr"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"my-1 border-outline-gray-2"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"}," />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            v-if"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"fromDate || toDate"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            type"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"button"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"rowCls"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              () => {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"                clear()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"                close()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              }")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},'            "')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"            Clear")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          </"),s("span",{class:"s_1uuh8p"},"button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_wac0bt"},"DateRangePicker"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"      <!-- 4. Sprint window — weekdays only -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"DateRangePicker")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        v-model"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"sprint"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Sprint window"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        description"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Pick start and end. Weekends are skipped."),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        :min"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"today"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        :max"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"sprintEnd"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        :is-date-unavailable"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"isWeekend"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"prefix"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"span")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"lucide-timer-reset size-4 text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            aria-hidden"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"true"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_28rvie"},"          /"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_wac0bt"},"DateRangePicker"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"      <!-- 5. Flight booking — split trigger over one shared popover -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"DateRangePicker"),s("span",{class:"s_1i4ay4"}," v-model"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"flight"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1i4ay4"}," dual-pane"),s("span",{class:"s_1i4ay4"}," :min"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"today"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"trigger"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_13ahmt"},"{"),s("span",{class:"s_22m8k2"}," togglePopover"),s("span",{class:"s_1jjt6x"},", "),s("span",{class:"s_22m8k2"},"isOpen"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"div")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"grid grid-cols-2 divide-x divide-outline-gray-2 rounded border bg-surface-white text-sm transition-colors"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              isOpen")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"                ? 'border-outline-gray-4 ring-2 ring-outline-gray-2'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"                : 'border-outline-gray-2 hover:border-outline-gray-3'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},'            "')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            <"),s("span",{class:"s_1uuh8p"},"button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"              type"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"button"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"              class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"flex items-center gap-2 rounded-l px-3 py-2 text-left hover:bg-surface-gray-1"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"              @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"togglePopover"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"              <"),s("span",{class:"s_1uuh8p"},"span")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"                class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"lucide-plane-takeoff size-4 text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"                aria-hidden"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"true"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_28rvie"},"              /"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"              <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"flex flex-col leading-tight"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"                <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"text-xs text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"},"Depart"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"                <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"text-ink-gray-9"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"                  {{ depart || 'Add date' }}")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"                </"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"              </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            </"),s("span",{class:"s_1uuh8p"},"button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            <"),s("span",{class:"s_1uuh8p"},"button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"              type"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"button"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"              class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"flex items-center gap-2 rounded-r px-3 py-2 text-left hover:bg-surface-gray-1"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"              @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"togglePopover"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"              <"),s("span",{class:"s_1uuh8p"},"span")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"                class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"lucide-plane-landing size-4 text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"                aria-hidden"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"true"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_28rvie"},"              /"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"              <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"flex flex-col leading-tight"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"                <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"text-xs text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"},"Return"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"                <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"text-ink-gray-9"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"                  {{ ret || 'Add date' }}")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"                </"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"              </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            </"),s("span",{class:"s_1uuh8p"},"button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_wac0bt"},"DateRangePicker"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:t(()=>[p(ds)]),_:1}),n[11]||(n[11]=s("h2",{id:"api-reference",tabindex:"-1"},[a("API Reference "),s("a",{class:"header-anchor",href:"#api-reference","aria-label":"Permalink to “API Reference”"},"​")],-1)),n[12]||(n[12]=s("h3",{id:"datepicker-1",tabindex:"-1"},[a("DatePicker "),s("a",{class:"header-anchor",href:"#datepicker-1","aria-label":"Permalink to “DatePicker”"},"​")],-1)),p(L,{name:"DatePicker",data:u},{code:t(()=>[...n[3]||(n[3]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"Dayjs"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"dayjs/esm"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"InputSize"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," InputVariant"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"../../composables/inputTypes"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"InputLabelingProps"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"../../composables/useInputLabeling"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," PopoverSide"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"top"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"right"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"bottom"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"left"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," PopoverAlign"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"start"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"center"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"end"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// Shared props for both single date and range pickers")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommonDatePickerProps"),s("span",{class:"s_252irl"}," extends"),s("span",{class:"s_1i4ay4"}," InputLabelingProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  // Positioning — aligned with Combobox/Dropdown vocabulary")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Preferred popover side relative to the trigger. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  side"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," PopoverSide")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Alignment of the popover along the trigger edge. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  align"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," PopoverAlign")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Gap between the trigger and popover content in pixels. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  offset"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Preferred popover placement relative to the trigger.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `side` and `align` instead.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  placement"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," DatePickerPlacement")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  // Display")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Display format used for the input text. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  format"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Size of the trigger input. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  size"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," InputSize")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Visual style variant passed through to the input. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  variant"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," InputVariant")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Placeholder text shown when no value is selected. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  placeholder"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  // Interaction")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Controls popover open state (for controlled usage). */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  open"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Opens the popover when the input receives focus. Default: false. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  openOnFocus"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Opens the popover when the input is clicked. Default: true. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  openOnClick"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Whether the trigger input accepts typed input. When `false` the user can")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * still open the popover and pick a date, but cannot type a date manually.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Default: `true`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  typeable"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Prevents manual typing while keeping the picker interactive.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `typeable: false` instead.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  readonly"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Disables the trigger input and calendar interactions. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  disabled"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Shows clear and quick-action controls when enabled. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  clearable"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Keeps the popover open after a date is selected. Default: false. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  keepOpen"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Closes the popover after a value is picked.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `keepOpen` instead (inverse semantics: `autoClose: false` → `keepOpen: true`).")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  autoClose"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  // Constraints")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Earliest selectable date. Accepts `YYYY-MM-DD` (or, for `DateTimePicker`,")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `YYYY-MM-DD HH:mm:ss` for second-level granularity).")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  min"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Latest selectable date. Accepts `YYYY-MM-DD` (or, for `DateTimePicker`,")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `YYYY-MM-DD HH:mm:ss` for second-level granularity).")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  max"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Return true to prevent a date from being selected. Combined with `min`/`max`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  isDateUnavailable"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"date"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Dayjs"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  // Deprecated")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Allows users to type custom date text into the input.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `typeable: false` instead.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  allowCustom"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Additional classes applied to the trigger input.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Apply `class` directly to the DatePicker component element to control width.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  inputClass"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Array"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Record"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," boolean"),s("span",{class:"s_1jjt6x"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DatePickerProps"),s("span",{class:"s_252irl"}," extends"),s("span",{class:"s_1i4ay4"}," CommonDatePickerProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Uncontrolled initial value for the picker.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `modelValue` with `v-model` instead.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Controlled value for the picker. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  modelValue"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DateRangePickerProps"),s("span",{class:"s_252irl"}," extends"),s("span",{class:"s_1i4ay4"}," CommonDatePickerProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Uncontrolled initial range value as `[from, to]` in `YYYY-MM-DD` format.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `modelValue` with `v-model` instead.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Controlled range value as `[from, to]` in `YYYY-MM-DD` format, or `[]` for no selection. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  modelValue"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Render two calendar panels side by side (current month + next month). */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  dualPane"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," DatePickerEmits"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired when the picker value changes. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"update:modelValue"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired when the popover open state changes. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"update:open"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Fired after the picker commits a normalized value.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Functionally identical to `update:modelValue`. Bind via `v-model` instead.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"change"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** Emitted range value: a `[from, to]` tuple in `YYYY-MM-DD` format, or `[]` when cleared. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," DateRangeValue"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_13ahmt"}," []")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," DateRangePickerEmits"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired when the range value changes. Emits `[from, to]` or `[]` when cleared. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"update:modelValue"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DateRangeValue"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired when the popover open state changes. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"update:open"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Fired after the picker commits a normalized range value.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Functionally identical to `update:modelValue`. Bind via `v-model` instead.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"change"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DateRangeValue"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DateTimePickerProps"),s("span",{class:"s_252irl"}," extends"),s("span",{class:"s_1i4ay4"}," CommonDatePickerProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Uncontrolled initial value for the picker.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `modelValue` with `v-model` instead.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Controlled value for the picker. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  modelValue"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Earliest selectable date-time in `YYYY-MM-DD HH:mm:ss` format.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `min` instead.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  minDateTime"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Latest selectable date-time in `YYYY-MM-DD HH:mm:ss` format.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `max` instead.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  maxDateTime"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Allows typing a custom time into the embedded time picker. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  allowCustomTime"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," DateTimePickerEmits"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," DatePickerEmits")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," DatePickerPlacement"),s("span",{class:"s_2ekfrt"}," =")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2ekfrt"},"  |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"top-start"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2ekfrt"},"  |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"top-end"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2ekfrt"},"  |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"bottom-start"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2ekfrt"},"  |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"bottom-end"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2ekfrt"},"  |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"right-start"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2ekfrt"},"  |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"right-end"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2ekfrt"},"  |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"left-start"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2ekfrt"},"  |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"left-end"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// ── Slot prop shapes ─────────────────────────────────────────────────────────")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** Props bound to the trigger / prefix / suffix slots on all three pickers. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  togglePopover"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  isOpen"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  displayLabel"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  inputValue"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** Props bound to the `actions` slot on `DatePicker`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DatePickerActionsSlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  selected"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  setDate"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"date"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Date"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Dayjs"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  clear"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  close"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** Props bound to the `actions` slot on `DateRangePicker`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DateRangePickerActionsSlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  fromDate"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  toDate"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Commits one endpoint, mirroring a calendar cell click:")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * first call sets `from`, second call sets `to`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  setDate"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"date"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Date"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Dayjs"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Commits both endpoints atomically. Normalizes order so the earlier")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'   * date becomes `from`. Use for fixed-window presets ("Last 7 days").')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  setRange"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," (")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_fsg3al"},"    range"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Date"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Dayjs"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Date"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Dayjs"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  )"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  clear"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  close"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** Props bound to the `actions` slot on `DateTimePicker`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DateTimePickerActionsSlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  selected"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  time"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  setDate"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"date"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Date"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Dayjs"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  clear"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  close"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DatePickerSlots"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Custom trigger renderer for the picker. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  trigger"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Custom trigger renderer for the picker.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `#trigger` instead. `#target` remains as a back-compat alias through v1.x.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  target"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Content rendered before the trigger input value. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  prefix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Content rendered after the trigger input value. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  suffix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Sidebar rendered to the left of the calendar. Use for date shortcuts")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'   * ("Today", "Tomorrow", "Last 7 days") and other preset actions. When')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * omitted, the popover shows the calendar only.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  actions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerActionsSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DateRangePickerSlots"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  trigger"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `#trigger` instead. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  target"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  prefix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  suffix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Sidebar rendered to the left of the calendar. Use for range shortcuts")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'   * ("Last 7 days", "Last 12 months") and other preset actions. When')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * omitted, the popover shows the calendar only.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  actions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DateRangePickerActionsSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DateTimePickerSlots"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  trigger"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `#trigger` instead. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  target"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  prefix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  suffix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Sidebar rendered to the left of the calendar. Use for date-time")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'   * shortcuts ("Now", "Tomorrow 9am") and other preset actions. When')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * omitted, the popover shows the calendar and time picker only.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  actions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DateTimePickerActionsSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," DatePickerViewMode"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"date"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"month"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"year"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DatePickerDateObj"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  date"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Dayjs")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  key"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  inMonth"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  isToday"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  isSelected"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),n[13]||(n[13]=a()),p(R,{data:g}),n[14]||(n[14]=a()),p(H,{data:z}),n[15]||(n[15]=a()),n[16]||(n[16]=s("h3",{id:"daterangepicker",tabindex:"-1"},[a("DateRangePicker "),s("a",{class:"header-anchor",href:"#daterangepicker","aria-label":"Permalink to “DateRangePicker”"},"​")],-1)),p(L,{name:"DateRangePicker",data:x},{code:t(()=>[...n[4]||(n[4]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"Dayjs"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"dayjs/esm"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"InputSize"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," InputVariant"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"../../composables/inputTypes"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"InputLabelingProps"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"../../composables/useInputLabeling"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," PopoverSide"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"top"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"right"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"bottom"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"left"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," PopoverAlign"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"start"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"center"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"end"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// Shared props for both single date and range pickers")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommonDatePickerProps"),s("span",{class:"s_252irl"}," extends"),s("span",{class:"s_1i4ay4"}," InputLabelingProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  // Positioning — aligned with Combobox/Dropdown vocabulary")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Preferred popover side relative to the trigger. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  side"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," PopoverSide")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Alignment of the popover along the trigger edge. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  align"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," PopoverAlign")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Gap between the trigger and popover content in pixels. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  offset"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Preferred popover placement relative to the trigger.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `side` and `align` instead.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  placement"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," DatePickerPlacement")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  // Display")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Display format used for the input text. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  format"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Size of the trigger input. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  size"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," InputSize")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Visual style variant passed through to the input. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  variant"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," InputVariant")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Placeholder text shown when no value is selected. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  placeholder"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  // Interaction")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Controls popover open state (for controlled usage). */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  open"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Opens the popover when the input receives focus. Default: false. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  openOnFocus"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Opens the popover when the input is clicked. Default: true. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  openOnClick"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Whether the trigger input accepts typed input. When `false` the user can")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * still open the popover and pick a date, but cannot type a date manually.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Default: `true`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  typeable"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Prevents manual typing while keeping the picker interactive.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `typeable: false` instead.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  readonly"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Disables the trigger input and calendar interactions. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  disabled"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Shows clear and quick-action controls when enabled. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  clearable"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Keeps the popover open after a date is selected. Default: false. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  keepOpen"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Closes the popover after a value is picked.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `keepOpen` instead (inverse semantics: `autoClose: false` → `keepOpen: true`).")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  autoClose"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  // Constraints")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Earliest selectable date. Accepts `YYYY-MM-DD` (or, for `DateTimePicker`,")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `YYYY-MM-DD HH:mm:ss` for second-level granularity).")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  min"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Latest selectable date. Accepts `YYYY-MM-DD` (or, for `DateTimePicker`,")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `YYYY-MM-DD HH:mm:ss` for second-level granularity).")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  max"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Return true to prevent a date from being selected. Combined with `min`/`max`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  isDateUnavailable"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"date"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Dayjs"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  // Deprecated")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Allows users to type custom date text into the input.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `typeable: false` instead.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  allowCustom"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Additional classes applied to the trigger input.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Apply `class` directly to the DatePicker component element to control width.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  inputClass"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Array"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Record"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," boolean"),s("span",{class:"s_1jjt6x"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DatePickerProps"),s("span",{class:"s_252irl"}," extends"),s("span",{class:"s_1i4ay4"}," CommonDatePickerProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Uncontrolled initial value for the picker.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `modelValue` with `v-model` instead.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Controlled value for the picker. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  modelValue"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DateRangePickerProps"),s("span",{class:"s_252irl"}," extends"),s("span",{class:"s_1i4ay4"}," CommonDatePickerProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Uncontrolled initial range value as `[from, to]` in `YYYY-MM-DD` format.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `modelValue` with `v-model` instead.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Controlled range value as `[from, to]` in `YYYY-MM-DD` format, or `[]` for no selection. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  modelValue"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Render two calendar panels side by side (current month + next month). */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  dualPane"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," DatePickerEmits"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired when the picker value changes. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"update:modelValue"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired when the popover open state changes. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"update:open"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Fired after the picker commits a normalized value.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Functionally identical to `update:modelValue`. Bind via `v-model` instead.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"change"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** Emitted range value: a `[from, to]` tuple in `YYYY-MM-DD` format, or `[]` when cleared. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," DateRangeValue"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_13ahmt"}," []")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," DateRangePickerEmits"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired when the range value changes. Emits `[from, to]` or `[]` when cleared. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"update:modelValue"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DateRangeValue"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired when the popover open state changes. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"update:open"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Fired after the picker commits a normalized range value.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Functionally identical to `update:modelValue`. Bind via `v-model` instead.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"change"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DateRangeValue"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DateTimePickerProps"),s("span",{class:"s_252irl"}," extends"),s("span",{class:"s_1i4ay4"}," CommonDatePickerProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Uncontrolled initial value for the picker.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `modelValue` with `v-model` instead.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Controlled value for the picker. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  modelValue"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Earliest selectable date-time in `YYYY-MM-DD HH:mm:ss` format.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `min` instead.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  minDateTime"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Latest selectable date-time in `YYYY-MM-DD HH:mm:ss` format.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `max` instead.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  maxDateTime"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Allows typing a custom time into the embedded time picker. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  allowCustomTime"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," DateTimePickerEmits"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," DatePickerEmits")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," DatePickerPlacement"),s("span",{class:"s_2ekfrt"}," =")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2ekfrt"},"  |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"top-start"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2ekfrt"},"  |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"top-end"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2ekfrt"},"  |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"bottom-start"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2ekfrt"},"  |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"bottom-end"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2ekfrt"},"  |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"right-start"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2ekfrt"},"  |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"right-end"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2ekfrt"},"  |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"left-start"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2ekfrt"},"  |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"left-end"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// ── Slot prop shapes ─────────────────────────────────────────────────────────")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** Props bound to the trigger / prefix / suffix slots on all three pickers. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  togglePopover"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  isOpen"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  displayLabel"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  inputValue"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** Props bound to the `actions` slot on `DatePicker`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DatePickerActionsSlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  selected"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  setDate"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"date"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Date"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Dayjs"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  clear"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  close"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** Props bound to the `actions` slot on `DateRangePicker`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DateRangePickerActionsSlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  fromDate"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  toDate"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Commits one endpoint, mirroring a calendar cell click:")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * first call sets `from`, second call sets `to`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  setDate"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"date"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Date"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Dayjs"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Commits both endpoints atomically. Normalizes order so the earlier")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'   * date becomes `from`. Use for fixed-window presets ("Last 7 days").')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  setRange"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," (")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_fsg3al"},"    range"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Date"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Dayjs"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Date"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Dayjs"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  )"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  clear"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  close"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** Props bound to the `actions` slot on `DateTimePicker`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DateTimePickerActionsSlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  selected"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  time"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  setDate"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"date"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Date"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Dayjs"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  clear"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  close"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DatePickerSlots"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Custom trigger renderer for the picker. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  trigger"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Custom trigger renderer for the picker.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `#trigger` instead. `#target` remains as a back-compat alias through v1.x.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  target"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Content rendered before the trigger input value. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  prefix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Content rendered after the trigger input value. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  suffix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Sidebar rendered to the left of the calendar. Use for date shortcuts")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'   * ("Today", "Tomorrow", "Last 7 days") and other preset actions. When')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * omitted, the popover shows the calendar only.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  actions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerActionsSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DateRangePickerSlots"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  trigger"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `#trigger` instead. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  target"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  prefix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  suffix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Sidebar rendered to the left of the calendar. Use for range shortcuts")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'   * ("Last 7 days", "Last 12 months") and other preset actions. When')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * omitted, the popover shows the calendar only.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  actions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DateRangePickerActionsSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DateTimePickerSlots"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  trigger"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `#trigger` instead. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  target"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  prefix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  suffix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Sidebar rendered to the left of the calendar. Use for date-time")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'   * shortcuts ("Now", "Tomorrow 9am") and other preset actions. When')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * omitted, the popover shows the calendar and time picker only.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  actions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DateTimePickerActionsSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," DatePickerViewMode"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"date"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"month"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"year"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DatePickerDateObj"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  date"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Dayjs")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  key"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  inMonth"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  isToday"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  isSelected"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),n[17]||(n[17]=a()),p(R,{data:v}),n[18]||(n[18]=a()),p(H,{data:P}),n[19]||(n[19]=a()),n[20]||(n[20]=s("h3",{id:"datetimepicker",tabindex:"-1"},[a("DateTimePicker "),s("a",{class:"header-anchor",href:"#datetimepicker","aria-label":"Permalink to “DateTimePicker”"},"​")],-1)),p(L,{name:"DateTimePicker",data:M},{code:t(()=>[...n[5]||(n[5]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"Dayjs"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"dayjs/esm"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"InputSize"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," InputVariant"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"../../composables/inputTypes"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"InputLabelingProps"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"../../composables/useInputLabeling"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," PopoverSide"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"top"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"right"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"bottom"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"left"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," PopoverAlign"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"start"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"center"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"end"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// Shared props for both single date and range pickers")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," CommonDatePickerProps"),s("span",{class:"s_252irl"}," extends"),s("span",{class:"s_1i4ay4"}," InputLabelingProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  // Positioning — aligned with Combobox/Dropdown vocabulary")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Preferred popover side relative to the trigger. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  side"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," PopoverSide")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Alignment of the popover along the trigger edge. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  align"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," PopoverAlign")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Gap between the trigger and popover content in pixels. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  offset"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," number")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Preferred popover placement relative to the trigger.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `side` and `align` instead.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  placement"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," DatePickerPlacement")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  // Display")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Display format used for the input text. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  format"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Size of the trigger input. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  size"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," InputSize")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Visual style variant passed through to the input. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  variant"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," InputVariant")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Placeholder text shown when no value is selected. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  placeholder"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  // Interaction")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Controls popover open state (for controlled usage). */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  open"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Opens the popover when the input receives focus. Default: false. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  openOnFocus"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Opens the popover when the input is clicked. Default: true. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  openOnClick"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Whether the trigger input accepts typed input. When `false` the user can")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * still open the popover and pick a date, but cannot type a date manually.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Default: `true`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  typeable"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Prevents manual typing while keeping the picker interactive.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `typeable: false` instead.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  readonly"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Disables the trigger input and calendar interactions. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  disabled"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Shows clear and quick-action controls when enabled. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  clearable"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Keeps the popover open after a date is selected. Default: false. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  keepOpen"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Closes the popover after a value is picked.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `keepOpen` instead (inverse semantics: `autoClose: false` → `keepOpen: true`).")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  autoClose"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  // Constraints")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Earliest selectable date. Accepts `YYYY-MM-DD` (or, for `DateTimePicker`,")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `YYYY-MM-DD HH:mm:ss` for second-level granularity).")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  min"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Latest selectable date. Accepts `YYYY-MM-DD` (or, for `DateTimePicker`,")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `YYYY-MM-DD HH:mm:ss` for second-level granularity).")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  max"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Return true to prevent a date from being selected. Combined with `min`/`max`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  isDateUnavailable"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"date"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Dayjs"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  // Deprecated")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Allows users to type custom date text into the input.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `typeable: false` instead.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  allowCustom"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Additional classes applied to the trigger input.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Apply `class` directly to the DatePicker component element to control width.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  inputClass"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Array"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Record"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," boolean"),s("span",{class:"s_1jjt6x"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DatePickerProps"),s("span",{class:"s_252irl"}," extends"),s("span",{class:"s_1i4ay4"}," CommonDatePickerProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Uncontrolled initial value for the picker.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `modelValue` with `v-model` instead.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Controlled value for the picker. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  modelValue"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DateRangePickerProps"),s("span",{class:"s_252irl"}," extends"),s("span",{class:"s_1i4ay4"}," CommonDatePickerProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Uncontrolled initial range value as `[from, to]` in `YYYY-MM-DD` format.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `modelValue` with `v-model` instead.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Controlled range value as `[from, to]` in `YYYY-MM-DD` format, or `[]` for no selection. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  modelValue"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Render two calendar panels side by side (current month + next month). */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  dualPane"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," DatePickerEmits"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired when the picker value changes. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"update:modelValue"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired when the popover open state changes. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"update:open"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Fired after the picker commits a normalized value.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Functionally identical to `update:modelValue`. Bind via `v-model` instead.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"change"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** Emitted range value: a `[from, to]` tuple in `YYYY-MM-DD` format, or `[]` when cleared. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," DateRangeValue"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_13ahmt"}," []")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," DateRangePickerEmits"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired when the range value changes. Emits `[from, to]` or `[]` when cleared. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"update:modelValue"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DateRangeValue"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired when the popover open state changes. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"update:open"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Fired after the picker commits a normalized range value.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Functionally identical to `update:modelValue`. Bind via `v-model` instead.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"change"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DateRangeValue"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DateTimePickerProps"),s("span",{class:"s_252irl"}," extends"),s("span",{class:"s_1i4ay4"}," CommonDatePickerProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Uncontrolled initial value for the picker.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `modelValue` with `v-model` instead.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  value"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Controlled value for the picker. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  modelValue"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Earliest selectable date-time in `YYYY-MM-DD HH:mm:ss` format.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `min` instead.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  minDateTime"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Latest selectable date-time in `YYYY-MM-DD HH:mm:ss` format.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `max` instead.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  maxDateTime"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Allows typing a custom time into the embedded time picker. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  allowCustomTime"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," DateTimePickerEmits"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," DatePickerEmits")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," DatePickerPlacement"),s("span",{class:"s_2ekfrt"}," =")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2ekfrt"},"  |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"top-start"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2ekfrt"},"  |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"top-end"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2ekfrt"},"  |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"bottom-start"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2ekfrt"},"  |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"bottom-end"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2ekfrt"},"  |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"right-start"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2ekfrt"},"  |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"right-end"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2ekfrt"},"  |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"left-start"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2ekfrt"},"  |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"left-end"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// ── Slot prop shapes ─────────────────────────────────────────────────────────")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** Props bound to the trigger / prefix / suffix slots on all three pickers. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  togglePopover"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  isOpen"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  displayLabel"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  inputValue"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** Props bound to the `actions` slot on `DatePicker`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DatePickerActionsSlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  selected"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  setDate"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"date"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Date"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Dayjs"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  clear"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  close"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** Props bound to the `actions` slot on `DateRangePicker`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DateRangePickerActionsSlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  fromDate"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  toDate"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Commits one endpoint, mirroring a calendar cell click:")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * first call sets `from`, second call sets `to`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  setDate"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"date"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Date"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Dayjs"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Commits both endpoints atomically. Normalizes order so the earlier")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'   * date becomes `from`. Use for fixed-window presets ("Last 7 days").')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  setRange"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," (")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_fsg3al"},"    range"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Date"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Dayjs"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Date"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Dayjs"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  )"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  clear"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  close"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** Props bound to the `actions` slot on `DateTimePicker`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DateTimePickerActionsSlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  selected"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  time"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  setDate"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"date"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Date"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Dayjs"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  clear"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  close"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DatePickerSlots"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Custom trigger renderer for the picker. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  trigger"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Custom trigger renderer for the picker.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `#trigger` instead. `#target` remains as a back-compat alias through v1.x.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  target"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Content rendered before the trigger input value. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  prefix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Content rendered after the trigger input value. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  suffix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Sidebar rendered to the left of the calendar. Use for date shortcuts")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'   * ("Today", "Tomorrow", "Last 7 days") and other preset actions. When')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * omitted, the popover shows the calendar only.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  actions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerActionsSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DateRangePickerSlots"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  trigger"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `#trigger` instead. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  target"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  prefix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  suffix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Sidebar rendered to the left of the calendar. Use for range shortcuts")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'   * ("Last 7 days", "Last 12 months") and other preset actions. When')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * omitted, the popover shows the calendar only.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  actions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DateRangePickerActionsSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DateTimePickerSlots"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  trigger"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `#trigger` instead. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  target"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  prefix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  suffix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Sidebar rendered to the left of the calendar. Use for date-time")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'   * shortcuts ("Now", "Tomorrow 9am") and other preset actions. When')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * omitted, the popover shows the calendar and time picker only.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  actions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DateTimePickerActionsSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," DatePickerViewMode"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"date"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"month"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"year"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DatePickerDateObj"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  date"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Dayjs")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  key"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  inMonth"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  isToday"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  isSelected"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),n[21]||(n[21]=a()),p(R,{data:j}),n[22]||(n[22]=a()),p(H,{data:y})])}}});export{Hs as __pageData,Os as default};
