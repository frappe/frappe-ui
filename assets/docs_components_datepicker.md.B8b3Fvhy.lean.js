import{_ as R}from"./chunks/PropsTable.SS5iQZrl.js";import{_ as A}from"./chunks/SlotsTable.DoT_0HLF.js";import{_ as O}from"./chunks/EmitsTable.pzMqGeWr.js";import{b9 as t,Y as q,Z as H,$ as S,_ as N}from"./chunks/theme.DYSpmtMP.js";import{I as F,aj as h,ad as C,r as T,D as c,aF as e,be as i,o as s,a0 as d,q as $,av as L,l as E,B as a,ao as B,A as G}from"./chunks/framework.79nw0c7c.js";const K={class:"grid w-full max-w-sm gap-6 py-10"},Q=["onClick"],J=["onClick"],Z=["onClick"],X=["onClick"],ss=["onClick"],as=["onClick"],ns=["onClick"],ls=["onClick"],ps=["onClick"],es={class:"flex flex-col leading-tight"},cs={class:"text-ink-gray-9"},ts=["onClick"],is={class:"flex flex-col leading-tight"},_s={class:"text-ink-gray-9"},D="w-full rounded-4 px-2 py-1.5 text-left text-base hover:bg-surface-gray-2",os=F({__name:"Range",setup(V){const r=t().format("YYYY-MM-DD"),w=t().add(1,"year").format("YYYY-MM-DD"),y=h([]),k=h([]),g=h([t().subtract(29,"day").format("YYYY-MM-DD"),t().format("YYYY-MM-DD")]);function v(){const p=z(5);return[p,p.add(2,"day")]}function P(){const p=z(1);return[p,p.add(4,"day")]}function z(p){const n=t(),_=(p-n.day()+7)%7||7;return n.add(_,"day")}function m(p){return[t().subtract(p-1,"day"),t()]}const x=h([]),l=t().add(60,"day").format("YYYY-MM-DD");function o(p){const n=p.day();return n===0||n===6}const u=h([]),Y=E(()=>u.value[0]?t(u.value[0]).format("ddd, MMM D"):""),j=E(()=>u.value[1]?t(u.value[1]).format("ddd, MMM D"):"");return(p,n)=>(C(),T("div",K,[c(e(q),{modelValue:y.value,"onUpdate:modelValue":n[0]||(n[0]=_=>y.value=_),label:"Time off",placeholder:"Pick your dates",min:e(r)},{prefix:i(()=>[...n[5]||(n[5]=[s("span",{class:"lucide-palmtree size-4 text-ink-gray-5","aria-hidden":"true"},null,-1)])]),actions:i(({setRange:_,close:f})=>[s("button",{type:"button",class:d(D),onClick:()=>{_(v()),f()}}," Long weekend ",8,Q),s("button",{type:"button",class:d(D),onClick:()=>{_(P()),f()}}," Next week ",8,J)]),_:1},8,["modelValue","min"]),c(e(q),{modelValue:k.value,"onUpdate:modelValue":n[1]||(n[1]=_=>k.value=_),label:"Check-in / Check-out",placeholder:"Select your stay","dual-pane":"",min:e(r),max:e(w)},{prefix:i(()=>[...n[6]||(n[6]=[s("span",{class:"lucide-hotel size-4 text-ink-gray-5","aria-hidden":"true"},null,-1)])]),_:1},8,["modelValue","min","max"]),c(e(q),{modelValue:g.value,"onUpdate:modelValue":n[2]||(n[2]=_=>g.value=_),label:"Report range",description:"Defaults to the last 30 days.",format:"MMM D",max:e(r)},{prefix:i(()=>[...n[7]||(n[7]=[s("span",{class:"lucide-chart-line size-4 text-ink-gray-5","aria-hidden":"true"},null,-1)])]),actions:i(({fromDate:_,toDate:f,setRange:b,clear:U,close:M})=>[s("button",{type:"button",class:d(D),onClick:()=>{b([e(t)(),e(t)()]),M()}}," Today ",8,Z),s("button",{type:"button",class:d(D),onClick:()=>{b(m(7)),M()}}," Last 7 days ",8,X),s("button",{type:"button",class:d(D),onClick:()=>{b(m(28)),M()}}," Last 4 weeks ",8,ss),s("button",{type:"button",class:d(D),onClick:()=>{b(m(90)),M()}}," Last 3 months ",8,as),s("button",{type:"button",class:d(D),onClick:()=>{b(m(365)),M()}}," Last 12 months ",8,ns),n[8]||(n[8]=s("hr",{class:"my-1 border-outline-gray-2"},null,-1)),_||f?(C(),T("button",{key:0,type:"button",class:d(D),onClick:()=>{U(),M()}}," Clear ",8,ls)):$("",!0)]),_:1},8,["modelValue","max"]),c(e(q),{modelValue:x.value,"onUpdate:modelValue":n[3]||(n[3]=_=>x.value=_),label:"Sprint window",description:"Pick start and end. Weekends are skipped.",min:e(r),max:e(l),"is-date-unavailable":o},{prefix:i(()=>[...n[9]||(n[9]=[s("span",{class:"lucide-timer-reset size-4 text-ink-gray-5","aria-hidden":"true"},null,-1)])]),_:1},8,["modelValue","min","max"]),c(e(q),{modelValue:u.value,"onUpdate:modelValue":n[4]||(n[4]=_=>u.value=_),"dual-pane":"",min:e(r)},{trigger:i(({setOpen:_,open:f})=>[s("div",{class:d(["grid grid-cols-2 divide-x divide-outline-gray-2 rounded-4 border bg-surface-base text-sm transition-colors",f?"border-outline-gray-4 ring-2 ring-outline-gray-2":"border-outline-gray-2 hover:border-outline-gray-3"])},[s("button",{type:"button",class:"flex items-center gap-2 rounded-l-4 px-3 py-2 text-left hover:bg-surface-gray-1",onClick:b=>_(!f)},[n[11]||(n[11]=s("span",{class:"lucide-plane-takeoff size-4 text-ink-gray-5","aria-hidden":"true"},null,-1)),s("div",es,[n[10]||(n[10]=s("span",{class:"text-xs text-ink-gray-5"},"Depart",-1)),s("span",cs,L(Y.value||"Add date"),1)])],8,ps),s("button",{type:"button",class:"flex items-center gap-2 rounded-r-4 px-3 py-2 text-left hover:bg-surface-gray-1",onClick:b=>_(!f)},[n[13]||(n[13]=s("span",{class:"lucide-plane-landing size-4 text-ink-gray-5","aria-hidden":"true"},null,-1)),s("div",is,[n[12]||(n[12]=s("span",{class:"text-xs text-ink-gray-5"},"Return",-1)),s("span",_s,L(j.value||"Add date"),1)])],8,ts)],2)]),_:1},8,["modelValue","min"])]))}}),rs={class:"grid w-full max-w-sm gap-6 py-10"},ds=["onClick"],hs=["onClick"],us=["onClick"],W="w-full rounded-4 px-2 py-1.5 text-left text-base hover:bg-surface-gray-2",ms=F({__name:"DateTime",setup(V){const r=t(),w=r.minute(r.minute()<30?30:60).second(0).format("YYYY-MM-DD HH:mm:ss"),y=h(w),k=r.format("YYYY-MM-DD HH:mm:ss"),g=h(""),v=t().add(1,"day").startOf("day").format("YYYY-MM-DD HH:mm:ss"),P=t().add(60,"day").endOf("day").format("YYYY-MM-DD HH:mm:ss"),z=h("");function m(){const x=t(),l=(5-x.day()+7)%7||7;return x.add(l,"day").hour(0).minute(0).second(0)}return(x,l)=>(C(),T("div",rs,[c(e(H),{modelValue:y.value,"onUpdate:modelValue":l[0]||(l[0]=o=>y.value=o),label:"Meeting time",placeholder:"When should we meet?",min:e(k),format:"ddd, MMM D · h:mm A"},{prefix:i(()=>[...l[3]||(l[3]=[s("span",{class:"lucide-calendar-clock size-4 text-ink-gray-5"},null,-1)])]),_:1},8,["modelValue","min"]),c(e(H),{modelValue:g.value,"onUpdate:modelValue":l[1]||(l[1]=o=>g.value=o),label:"Maintenance window",description:"Must be scheduled at least 24 hours in advance.",placeholder:"Pick a low-traffic time",min:e(v),max:e(P)},{prefix:i(()=>[...l[4]||(l[4]=[s("span",{class:"lucide-server size-4 text-ink-gray-5"},null,-1)])]),_:1},8,["modelValue","min","max"]),c(e(H),{modelValue:z.value,"onUpdate:modelValue":l[2]||(l[2]=o=>z.value=o),label:"Launch moment",placeholder:"When do we light the candle?",format:"MMMM D, YYYY [at] h:mm A",variant:"outline"},{prefix:i(()=>[...l[5]||(l[5]=[s("span",{class:"lucide-rocket size-4 text-ink-gray-5"},null,-1)])]),actions:i(({setDate:o,close:u})=>[s("button",{type:"button",class:d(W),onClick:()=>{o(e(t)().add(1,"day").hour(12).minute(0)),u()}}," High noon ",8,ds),s("button",{type:"button",class:d(W),onClick:()=>{o(m()),u()}}," Midnight Friday ",8,hs),s("button",{type:"button",class:d(W),onClick:()=>{o(e(t)().add(1,"day").hour(6).minute(15)),u()}}," Sunrise ",8,us)]),_:1},8,["modelValue"])]))}}),fs={class:"grid w-full max-w-sm gap-6 py-10"},ws=["onClick"],ys=["onClick"],ks={class:"flex flex-col gap-1.5"},I="w-full rounded-4 px-2 py-1.5 text-left text-base hover:bg-surface-gray-2",gs=F({__name:"Examples",setup(V){const r=h(""),w=t().format("YYYY-MM-DD"),y=t().add(1,"year").format("YYYY-MM-DD"),k=h("1995-08-14"),g=t().subtract(120,"year").format("YYYY-MM-DD"),v=h(""),P=t().add(30,"day").format("YYYY-MM-DD"),z=new Set([t().add(2,"day").format("YYYY-MM-DD"),t().add(5,"day").format("YYYY-MM-DD"),t().add(11,"day").format("YYYY-MM-DD")]);function m(j){const p=j.day();return p===0||p===6?!0:z.has(j.format("YYYY-MM-DD"))}function x(j=t()){const p=(8-j.day())%7||7;return j.add(p,"day")}const l=h(""),o=t("1800-01-01").format("YYYY-MM-DD"),u=t("2300-12-31").format("YYYY-MM-DD"),Y=h("");return(j,p)=>(C(),T("div",fs,[c(e(S),{modelValue:r.value,"onUpdate:modelValue":p[0]||(p[0]=n=>r.value=n),label:"Departure",placeholder:"When are you flying?",format:"ddd, MMM D",min:e(w),max:e(y)},{prefix:i(()=>[...p[5]||(p[5]=[s("span",{class:"lucide-plane size-4 text-ink-gray-5"},null,-1)])]),_:1},8,["modelValue","min","max"]),c(e(S),{modelValue:k.value,"onUpdate:modelValue":p[1]||(p[1]=n=>k.value=n),label:"Date of birth",placeholder:"MM/DD/YYYY",format:"MMM D, YYYY",min:e(g),max:e(w),clearable:!1},{prefix:i(()=>[...p[6]||(p[6]=[s("span",{class:"lucide-cake size-4 text-ink-gray-5"},null,-1)])]),_:1},8,["modelValue","min","max"]),c(e(S),{modelValue:v.value,"onUpdate:modelValue":p[2]||(p[2]=n=>v.value=n),label:"Book appointment",description:"Weekdays only, next 30 days. Greyed-out slots are full.",placeholder:"Pick a slot",min:e(w),max:e(P),"is-date-unavailable":m},{prefix:i(()=>[...p[7]||(p[7]=[s("span",{class:"lucide-stethoscope size-4 text-ink-gray-5"},null,-1)])]),actions:i(({setDate:n,close:_})=>[s("button",{type:"button",class:d(I),onClick:()=>{n(e(t)().add(1,"day")),_()}}," Tomorrow ",8,ws),s("button",{type:"button",class:d(I),onClick:()=>{n(x()),_()}}," Next Monday ",8,ys)]),_:1},8,["modelValue","min","max"]),c(e(S),{modelValue:l.value,"onUpdate:modelValue":p[3]||(p[3]=n=>l.value=n),label:"Time-travel destination",placeholder:"When to?",format:"[Stardate] YYYY.MM.DD",variant:"outline",min:e(o),max:e(u)},{prefix:i(()=>[...p[8]||(p[8]=[s("span",{class:"lucide-rocket size-4 text-ink-gray-5"},null,-1)])]),_:1},8,["modelValue","min","max"]),s("div",ks,[p[10]||(p[10]=s("span",{class:"text-sm text-ink-gray-7"},"Task card affordance",-1)),c(e(S),{modelValue:Y.value,"onUpdate:modelValue":p[4]||(p[4]=n=>Y.value=n),format:"MMM D"},{trigger:i(({setOpen:n,displayLabel:_,open:f})=>[c(e(N),{variant:Y.value?"subtle":"ghost",onClick:b=>n(!f)},{prefix:i(()=>[...p[9]||(p[9]=[s("span",{class:"lucide-calendar-plus size-4"},null,-1)])]),default:i(()=>[a(" "+L(Y.value?`Due ${_}`:"Add due date"),1)]),_:2},1032,["variant","onClick"])]),_:1},8,["modelValue"])])]))}}),Ps=JSON.parse('{"title":"DatePicker","description":"","frontmatter":{},"headers":[],"relativePath":"docs/components/datepicker.md","filePath":"docs/components/datepicker.md","lastUpdated":1779053387000}'),zs={name:"docs/components/datepicker.md"},Ys=Object.assign(zs,{setup(V){const r=[{name:"side",description:"Preferred popover side relative to the trigger.",required:!1,type:"PopoverSide"},{name:"align",description:"Alignment of the popover along the trigger edge.",required:!1,type:"PopoverAlign"},{name:"offset",description:"Gap between the trigger and popover content in pixels.",required:!1,type:"number"},{name:"format",description:"Display format used for the input text.",required:!1,type:"string"},{name:"size",description:"Size of the trigger input.",required:!1,type:"InputSize"},{name:"variant",description:"Visual style variant passed through to the input.",required:!1,type:"InputVariant",default:'"subtle"'},{name:"placeholder",description:"Placeholder text shown when no value is selected.",required:!1,type:"string",default:'"Select date"'},{name:"open",description:"Controls popover open state (for controlled usage).",required:!1,type:"boolean"},{name:"openOnFocus",description:"Opens the popover when the input receives focus. Default: false.",required:!1,type:"boolean",default:"false"},{name:"openOnClick",description:"Opens the popover when the input is clicked. Default: true.",required:!1,type:"boolean",default:"true"},{name:"typeable",description:"Whether the trigger input accepts typed input. When `false` the user can\nstill open the popover and pick a date, but cannot type a date manually.\nDefault: `true`.",required:!1,type:"boolean",default:"true"},{name:"disabled",description:"Disables the trigger input and calendar interactions.",required:!1,type:"boolean",default:"false"},{name:"clearable",description:"Shows clear and quick-action controls when enabled.",required:!1,type:"boolean",default:"true"},{name:"keepOpen",description:"Keeps the popover open after a date is selected. Default: false.",required:!1,type:"boolean"},{name:"min",description:"Earliest selectable date. Accepts `YYYY-MM-DD` (or, for `DateTimePicker`,\n`YYYY-MM-DD HH:mm:ss` for second-level granularity).",required:!1,type:"string"},{name:"max",description:"Latest selectable date. Accepts `YYYY-MM-DD` (or, for `DateTimePicker`,\n`YYYY-MM-DD HH:mm:ss` for second-level granularity).",required:!1,type:"string"},{name:"isDateUnavailable",description:"Return true to prevent a date from being selected. Combined with `min`/`max`.",required:!1,type:"((date: Dayjs) => boolean)"},{name:"modelValue",description:"Controlled value for the picker.",required:!1,type:"string",default:'""'},{name:"label",description:"Label rendered above (or beside, for binary controls) the input.",required:!1,type:"string"},{name:"description",description:"Helper text rendered below the input.\nHidden when `error` is set. A `#description` slot is not: it renders\nbeside the error, and is referenced alongside it.",required:!1,type:"string"},{name:"error",description:'Error message rendered below the input. When set, the control receives\n`aria-invalid="true"` and `data-state="invalid"`. Takes a string, an\narray of strings, or an `Error` whose `messages` are rendered as stacked\nlines (with `Error.message` as the fallback). This is the same value\n`ErrorMessage.message` takes. An empty array and an empty string both\nmean no error.',required:!1,type:"ErrorMessageValue"},{name:"required",description:"Marks the field as required. Renders an asterisk next to the label, with\n`sr-only` text that announces it, and forwards `required` /\n`aria-required` to the underlying control where the control's role allows\nit. `data-required` is set either way.",required:!1,type:"boolean"},{name:"id",description:"HTML id of the underlying control. Auto-generated via `useId()` if omitted.",required:!1,type:"string"}],w=[{name:"trigger",description:"Custom trigger renderer for the picker.",type:"DatePickerTriggerSlotProps"},{name:"prefix",description:"Content rendered before the trigger input value.",type:"DatePickerTriggerSlotProps"},{name:"suffix",description:"Content rendered after the trigger input value.",type:"DatePickerTriggerSlotProps"},{name:"actions",description:`Sidebar rendered to the left of the calendar. Use for date shortcuts
("Today", "Tomorrow", "Last 7 days") and other preset actions. When
omitted, the popover shows the calendar only.`,type:"DatePickerActionsSlotProps"}],y=[{name:"update:open",description:"Fired when the open state changes.",type:"[value: boolean]"},{name:"change",description:"Fired after the value is committed.",type:"[value: string]"},{name:"update:modelValue",description:"Fired when the model value changes.",type:"[value: string]"}],k=[{name:"side",description:"Preferred popover side relative to the trigger.",required:!1,type:"PopoverSide"},{name:"align",description:"Alignment of the popover along the trigger edge.",required:!1,type:"PopoverAlign"},{name:"offset",description:"Gap between the trigger and popover content in pixels.",required:!1,type:"number"},{name:"format",description:"Display format used for the input text.",required:!1,type:"string"},{name:"size",description:"Size of the trigger input.",required:!1,type:"InputSize"},{name:"variant",description:"Visual style variant passed through to the input.",required:!1,type:"InputVariant",default:'"subtle"'},{name:"placeholder",description:"Placeholder text shown when no value is selected.",required:!1,type:"string",default:'"Select range"'},{name:"open",description:"Controls popover open state (for controlled usage).",required:!1,type:"boolean"},{name:"openOnFocus",description:"Opens the popover when the input receives focus. Default: false.",required:!1,type:"boolean",default:"false"},{name:"openOnClick",description:"Opens the popover when the input is clicked. Default: true.",required:!1,type:"boolean",default:"true"},{name:"typeable",description:"Whether the trigger input accepts typed input. When `false` the user can\nstill open the popover and pick a date, but cannot type a date manually.\nDefault: `true`.",required:!1,type:"boolean",default:"true"},{name:"disabled",description:"Disables the trigger input and calendar interactions.",required:!1,type:"boolean",default:"false"},{name:"clearable",description:"Shows clear and quick-action controls when enabled.",required:!1,type:"boolean",default:"true"},{name:"keepOpen",description:"Keeps the popover open after a date is selected. Default: false.",required:!1,type:"boolean"},{name:"min",description:"Earliest selectable date. Accepts `YYYY-MM-DD` (or, for `DateTimePicker`,\n`YYYY-MM-DD HH:mm:ss` for second-level granularity).",required:!1,type:"string"},{name:"max",description:"Latest selectable date. Accepts `YYYY-MM-DD` (or, for `DateTimePicker`,\n`YYYY-MM-DD HH:mm:ss` for second-level granularity).",required:!1,type:"string"},{name:"isDateUnavailable",description:"Return true to prevent a date from being selected. Combined with `min`/`max`.",required:!1,type:"((date: Dayjs) => boolean)"},{name:"modelValue",description:"Controlled range value as `[from, to]` in `YYYY-MM-DD` format, or `[]` for\nno selection. `DateRangeValue` types both sides of `v-model` (INP-Q12): the\nprop was `string[]`, which let a one-element array in and made a round-trip\nthrough the model fail to type-check.",required:!1,type:"DateRangeValue",default:"[]"},{name:"dualPane",description:"Render two calendar panels side by side (current month + next month).",required:!1,type:"boolean",default:"false"},{name:"label",description:"Label rendered above (or beside, for binary controls) the input.",required:!1,type:"string"},{name:"description",description:"Helper text rendered below the input.\nHidden when `error` is set. A `#description` slot is not: it renders\nbeside the error, and is referenced alongside it.",required:!1,type:"string"},{name:"error",description:'Error message rendered below the input. When set, the control receives\n`aria-invalid="true"` and `data-state="invalid"`. Takes a string, an\narray of strings, or an `Error` whose `messages` are rendered as stacked\nlines (with `Error.message` as the fallback). This is the same value\n`ErrorMessage.message` takes. An empty array and an empty string both\nmean no error.',required:!1,type:"ErrorMessageValue"},{name:"required",description:"Marks the field as required. Renders an asterisk next to the label, with\n`sr-only` text that announces it, and forwards `required` /\n`aria-required` to the underlying control where the control's role allows\nit. `data-required` is set either way.",required:!1,type:"boolean"},{name:"id",description:"HTML id of the underlying control. Auto-generated via `useId()` if omitted.",required:!1,type:"string"}],g=[{name:"trigger",description:"",type:"DatePickerTriggerSlotProps"},{name:"prefix",description:"",type:"DatePickerTriggerSlotProps"},{name:"suffix",description:"",type:"DatePickerTriggerSlotProps"},{name:"actions",description:`Sidebar rendered to the left of the calendar. Use for range shortcuts
("Last 7 days", "Last 12 months") and other preset actions. When
omitted, the popover shows the calendar only.`,type:"DateRangePickerActionsSlotProps"}],v=[{name:"update:open",description:"Fired when the open state changes.",type:"[value: boolean]"},{name:"change",description:"Fired after the value is committed.",type:"[value: DateRangeValue]"},{name:"update:modelValue",description:"Fired when the model value changes.",type:"[value: DateRangeValue]"}],P=[{name:"side",description:"Preferred popover side relative to the trigger.",required:!1,type:"PopoverSide"},{name:"align",description:"Alignment of the popover along the trigger edge.",required:!1,type:"PopoverAlign"},{name:"offset",description:"Gap between the trigger and popover content in pixels.",required:!1,type:"number"},{name:"format",description:"Display format used for the input text.",required:!1,type:"string"},{name:"size",description:"Size of the trigger input.",required:!1,type:"InputSize"},{name:"variant",description:"Visual style variant passed through to the input.",required:!1,type:"InputVariant",default:'"subtle"'},{name:"placeholder",description:"Placeholder text shown when no value is selected.",required:!1,type:"string",default:'"Select date & time"'},{name:"open",description:"Controls popover open state (for controlled usage).",required:!1,type:"boolean"},{name:"openOnFocus",description:"Opens the popover when the input receives focus. Default: false.",required:!1,type:"boolean",default:"false"},{name:"openOnClick",description:"Opens the popover when the input is clicked. Default: true.",required:!1,type:"boolean",default:"true"},{name:"typeable",description:"Whether the trigger input accepts typed input. When `false` the user can\nstill open the popover and pick a date, but cannot type a date manually.\nDefault: `true`.",required:!1,type:"boolean",default:"true"},{name:"disabled",description:"Disables the trigger input and calendar interactions.",required:!1,type:"boolean",default:"false"},{name:"clearable",description:"Shows clear and quick-action controls when enabled.",required:!1,type:"boolean",default:"true"},{name:"keepOpen",description:"Keeps the popover open after a date is selected. Default: false.",required:!1,type:"boolean"},{name:"min",description:"Earliest selectable date. Accepts `YYYY-MM-DD` (or, for `DateTimePicker`,\n`YYYY-MM-DD HH:mm:ss` for second-level granularity).",required:!1,type:"string"},{name:"max",description:"Latest selectable date. Accepts `YYYY-MM-DD` (or, for `DateTimePicker`,\n`YYYY-MM-DD HH:mm:ss` for second-level granularity).",required:!1,type:"string"},{name:"isDateUnavailable",description:"Return true to prevent a date from being selected. Combined with `min`/`max`.",required:!1,type:"((date: Dayjs) => boolean)"},{name:"modelValue",description:"Controlled value for the picker.",required:!1,type:"string",default:'""'},{name:"label",description:"Label rendered above (or beside, for binary controls) the input.",required:!1,type:"string"},{name:"description",description:"Helper text rendered below the input.\nHidden when `error` is set. A `#description` slot is not: it renders\nbeside the error, and is referenced alongside it.",required:!1,type:"string"},{name:"error",description:'Error message rendered below the input. When set, the control receives\n`aria-invalid="true"` and `data-state="invalid"`. Takes a string, an\narray of strings, or an `Error` whose `messages` are rendered as stacked\nlines (with `Error.message` as the fallback). This is the same value\n`ErrorMessage.message` takes. An empty array and an empty string both\nmean no error.',required:!1,type:"ErrorMessageValue"},{name:"required",description:"Marks the field as required. Renders an asterisk next to the label, with\n`sr-only` text that announces it, and forwards `required` /\n`aria-required` to the underlying control where the control's role allows\nit. `data-required` is set either way.",required:!1,type:"boolean"},{name:"id",description:"HTML id of the underlying control. Auto-generated via `useId()` if omitted.",required:!1,type:"string"}],z=[{name:"trigger",description:"",type:"DatePickerTriggerSlotProps"},{name:"prefix",description:"",type:"DatePickerTriggerSlotProps"},{name:"suffix",description:"",type:"DatePickerTriggerSlotProps"},{name:"actions",description:`Sidebar rendered to the left of the calendar. Use for date-time
shortcuts ("Now", "Tomorrow 9am") and other preset actions. When
omitted, the popover shows the calendar and time picker only.`,type:"DateTimePickerActionsSlotProps"}],m=[{name:"update:open",description:"Fired when the open state changes.",type:"[value: boolean]"},{name:"change",description:"Fired after the value is committed.",type:"[value: string]"},{name:"update:modelValue",description:"Fired when the model value changes.",type:"[value: string]"}];return(x,l)=>{const o=B("ComponentPreview");return C(),T("div",null,[l[6]||(l[6]=s("h1",{id:"datepicker",tabindex:"-1"},[a("DatePicker "),s("a",{class:"header-anchor",href:"#datepicker","aria-label":"Permalink to “DatePicker”"},"​")],-1)),l[7]||(l[7]=s("p",null,"A set of pickers for selecting dates, date ranges, or date and time. Smooth, intuitive interfaces make choosing and adjusting values quick and precise.",-1)),l[8]||(l[8]=s("h2",{id:"date-picker",tabindex:"-1"},[a("Date Picker "),s("a",{class:"header-anchor",href:"#date-picker","aria-label":"Permalink to “Date Picker”"},"​")],-1)),c(o,{name:"DatePicker-Examples"},{code:i(()=>[...l[0]||(l[0]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"ref"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"DatePicker"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," Button"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"dayjs"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"../../../utils/dayjs"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"Dayjs"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"dayjs/esm"),s("span",{class:"s_w1p9wo"},"'")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// 3. Appointment — weekdays only, next 30 days, with quick actions and")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"//    a few slots already taken.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," appointment"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"''"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," inThirtyDays"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," dayjs"),s("span",{class:"s_13ahmt"},"()"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"add"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_40mev6"},"30"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"day"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"format"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"YYYY-MM-DD"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," fullyBooked"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_2ekfrt"}," new"),s("span",{class:"s_indoxt"}," Set"),s("span",{class:"s_13ahmt"},"([")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  dayjs"),s("span",{class:"s_13ahmt"},"()"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"add"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_40mev6"},"2"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"day"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"format"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"YYYY-MM-DD"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  dayjs"),s("span",{class:"s_13ahmt"},"()"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"add"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_40mev6"},"5"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"day"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"format"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"YYYY-MM-DD"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  dayjs"),s("span",{class:"s_13ahmt"},"()"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"add"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_40mev6"},"11"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"day"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"format"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"YYYY-MM-DD"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"])")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_50ecpt"},"function"),s("span",{class:"s_indoxt"}," isUnavailable"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_fsg3al"},"date"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Dayjs"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"  const"),s("span",{class:"s_295sjd"}," day"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_22m8k2"}," date"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"day"),s("span",{class:"s_13ahmt"},"()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_50ecpt"},"  if"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_22m8k2"},"day"),s("span",{class:"s_50ecpt"}," ==="),s("span",{class:"s_40mev6"}," 0"),s("span",{class:"s_50ecpt"}," ||"),s("span",{class:"s_22m8k2"}," day"),s("span",{class:"s_50ecpt"}," ==="),s("span",{class:"s_40mev6"}," 6"),s("span",{class:"s_13ahmt"},") "),s("span",{class:"s_29n2kq"},"return"),s("span",{class:"s_40mev6"}," true")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_29n2kq"},"  return"),s("span",{class:"s_22m8k2"}," fullyBooked"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"has"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_22m8k2"},"date"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"format"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"YYYY-MM-DD"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},"))")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_50ecpt"},"function"),s("span",{class:"s_indoxt"}," nextMonday"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_fsg3al"},"from"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Dayjs"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," dayjs"),s("span",{class:"s_13ahmt"},"())"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"  const"),s("span",{class:"s_295sjd"}," diff"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_40mev6"},"8"),s("span",{class:"s_2ekfrt"}," -"),s("span",{class:"s_22m8k2"}," from"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"day"),s("span",{class:"s_13ahmt"},"()) "),s("span",{class:"s_2ekfrt"},"%"),s("span",{class:"s_40mev6"}," 7"),s("span",{class:"s_50ecpt"}," ||"),s("span",{class:"s_40mev6"}," 7")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_29n2kq"},"  return"),s("span",{class:"s_22m8k2"}," from"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"add"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_22m8k2"},"diff"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"day"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// 4. Fun — pick a Stardate for a time-travel destination")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," stardate"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"''"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," stardateFloor"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," dayjs"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"1800-01-01"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"format"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"YYYY-MM-DD"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," stardateCeil"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," dayjs"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"2300-12-31"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"format"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"YYYY-MM-DD"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'// 5. Custom trigger — "Add due date" button on a task card')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," dueDate"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"''"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," rowCls"),s("span",{class:"s_2ekfrt"}," =")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},"  '"),s("span",{class:"s_2575z4"},"w-full rounded-4 px-2 py-1.5 text-left text-base hover:bg-surface-gray-2"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"grid w-full max-w-sm gap-6 py-10"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    <!-- 1. Flight booking -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_wac0bt"},"DatePicker")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      v-model"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"departure"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Departure"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      placeholder"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"When are you flying?"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      format"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ddd, MMM D"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :min"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"today"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :max"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"oneYearOut"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"prefix"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"lucide-plane size-4 text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_28rvie"}," /"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_wac0bt"},"DatePicker"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    <!-- 2. Date of birth -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_wac0bt"},"DatePicker")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      v-model"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"dob"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Date of birth"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      placeholder"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"MM/DD/YYYY"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      format"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"MMM D, YYYY"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :min"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"longAgo"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :max"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"today"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :clearable"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"false"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"prefix"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"lucide-cake size-4 text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_28rvie"}," /"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_wac0bt"},"DatePicker"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    <!-- 3. Appointment booking -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_wac0bt"},"DatePicker")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      v-model"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"appointment"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Book appointment"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      description"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Weekdays only, next 30 days. Greyed-out slots are full."),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      placeholder"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Pick a slot"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :min"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"today"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :max"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"inThirtyDays"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :is-date-unavailable"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"isUnavailable"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"prefix"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"lucide-stethoscope size-4 text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_28rvie"}," /"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"actions"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_13ahmt"},"{"),s("span",{class:"s_22m8k2"}," setDate"),s("span",{class:"s_1jjt6x"},", "),s("span",{class:"s_22m8k2"},"close"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          type"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"button"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"rowCls"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"            () => {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              setDate(dayjs().add(1, 'day'))")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              close()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"            }")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},'          "')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"          Tomorrow")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          type"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"button"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"rowCls"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"            () => {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              setDate(nextMonday())")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              close()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"            }")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},'          "')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"          Next Monday")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_wac0bt"},"DatePicker"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    <!-- 4. Fun: Time-travel destination -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_wac0bt"},"DatePicker")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      v-model"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"stardate"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Time-travel destination"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      placeholder"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"When to?"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      format"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"[Stardate] YYYY.MM.DD"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      variant"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"outline"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :min"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"stardateFloor"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :max"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"stardateCeil"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"prefix"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"lucide-rocket size-4 text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_28rvie"}," /"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_wac0bt"},"DatePicker"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    <!-- 5. Custom trigger — feels like a task-card affordance -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"flex flex-col gap-1.5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"text-sm text-ink-gray-7"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"},"Task card affordance"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"DatePicker"),s("span",{class:"s_1i4ay4"}," v-model"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"dueDate"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1i4ay4"}," format"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"MMM D"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"trigger"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_13ahmt"},"{"),s("span",{class:"s_22m8k2"}," setOpen"),s("span",{class:"s_1jjt6x"},", "),s("span",{class:"s_22m8k2"},"displayLabel"),s("span",{class:"s_1jjt6x"},", "),s("span",{class:"s_22m8k2"},"open"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"Button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            :variant"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"dueDate ? 'subtle' : 'ghost'"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"setOpen(!open)"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"prefix"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"              <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"lucide-calendar-plus size-4"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_28rvie"}," /"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"            {{ dueDate ? `Due ${displayLabel}` : 'Add due date' }}")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          </"),s("span",{class:"s_1uuh8p"},"Button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_wac0bt"},"DatePicker"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:i(()=>[c(gs)]),_:1}),l[9]||(l[9]=s("h2",{id:"datetime-picker",tabindex:"-1"},[a("DateTime Picker "),s("a",{class:"header-anchor",href:"#datetime-picker","aria-label":"Permalink to “DateTime Picker”"},"​")],-1)),c(o,{name:"DatePicker-DateTime"},{code:i(()=>[...l[1]||(l[1]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"ref"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"DateTimePicker"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"dayjs"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"../../../utils/dayjs"),s("span",{class:"s_w1p9wo"},"'")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},"  '"),s("span",{class:"s_2575z4"},"w-full rounded-4 px-2 py-1.5 text-left text-base hover:bg-surface-gray-2"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"grid w-full max-w-sm gap-6 py-10"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    <!-- 1. Meeting scheduler -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_wac0bt"},"DateTimePicker")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      v-model"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"meeting"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Meeting time"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      placeholder"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"When should we meet?"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :min"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"minMeetingTime"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      format"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ddd, MMM D · h:mm A"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"prefix"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"lucide-calendar-clock size-4 text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_28rvie"}," /"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_wac0bt"},"DateTimePicker"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    <!-- 2. Maintenance window -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_wac0bt"},"DateTimePicker")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      v-model"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"maintenance"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Maintenance window"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      description"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Must be scheduled at least 24 hours in advance."),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      placeholder"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Pick a low-traffic time"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :min"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"tomorrow"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :max"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"sixtyDaysOut"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"prefix"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"lucide-server size-4 text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_28rvie"}," /"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_wac0bt"},"DateTimePicker"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    <!-- 3. Fun: dramatic launch moment -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_wac0bt"},"DateTimePicker")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      v-model"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"launch"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Launch moment"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      placeholder"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"When do we light the candle?"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      format"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"MMMM D, YYYY [at] h:mm A"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      variant"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"outline"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"prefix"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"lucide-rocket size-4 text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_28rvie"}," /"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"actions"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_13ahmt"},"{"),s("span",{class:"s_22m8k2"}," setDate"),s("span",{class:"s_1jjt6x"},", "),s("span",{class:"s_22m8k2"},"close"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          type"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"button"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"rowCls"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"            () => {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              setDate(dayjs().add(1, 'day').hour(12).minute(0))")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              close()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"            }")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},'          "')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"          High noon")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          type"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"button"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"rowCls"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"            () => {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              setDate(nextFridayMidnight())")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              close()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"            }")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},'          "')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"          Midnight Friday")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          type"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"button"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"rowCls"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"            () => {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              setDate(dayjs().add(1, 'day').hour(6).minute(15))")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              close()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"            }")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},'          "')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"          Sunrise")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_wac0bt"},"DateTimePicker"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:i(()=>[c(ms)]),_:1}),l[10]||(l[10]=s("h2",{id:"date-range-picker",tabindex:"-1"},[a("Date Range Picker "),s("a",{class:"header-anchor",href:"#date-range-picker","aria-label":"Permalink to “Date Range Picker”"},"​")],-1)),c(o,{name:"DatePicker-Range"},{code:i(()=>[...l[2]||(l[2]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"computed"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," ref"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"DateRangePicker"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_4q1z3w"}," DateRangeValue"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"dayjs"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"../../../utils/dayjs"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"Dayjs"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"dayjs/esm"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," today"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," dayjs"),s("span",{class:"s_13ahmt"},"()"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"format"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"YYYY-MM-DD"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," oneYearOut"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," dayjs"),s("span",{class:"s_13ahmt"},"()"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"add"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_40mev6"},"1"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"year"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"format"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"YYYY-MM-DD"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// 1. PTO request — quick presets feel native to HR tools")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," timeOff"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_euu481"},"DateRangeValue"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_13ahmt"},"([])")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// 2. Hotel booking — dual pane, check-in must be today or later")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," stay"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_euu481"},"DateRangeValue"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_13ahmt"},"([])")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// 3. Analytics filter — preset-driven, displays compact format")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," analyticsRange"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_euu481"},"DateRangeValue"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_13ahmt"},"([")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},"  '"),s("span",{class:"s_2575z4"},"w-full rounded-4 px-2 py-1.5 text-left text-base hover:bg-surface-gray-2"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// 4. Project sprint — weekdays only, span limited to ~2 weeks via `max`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," sprint"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_euu481"},"DateRangeValue"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_13ahmt"},"([])")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," sprintEnd"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," dayjs"),s("span",{class:"s_13ahmt"},"()"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"add"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_40mev6"},"60"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"day"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"format"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"YYYY-MM-DD"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_50ecpt"},"function"),s("span",{class:"s_indoxt"}," isWeekend"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_fsg3al"},"date"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Dayjs"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"  const"),s("span",{class:"s_295sjd"}," d"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_22m8k2"}," date"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"day"),s("span",{class:"s_13ahmt"},"()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_29n2kq"},"  return"),s("span",{class:"s_22m8k2"}," d"),s("span",{class:"s_50ecpt"}," ==="),s("span",{class:"s_40mev6"}," 0"),s("span",{class:"s_50ecpt"}," ||"),s("span",{class:"s_22m8k2"}," d"),s("span",{class:"s_50ecpt"}," ==="),s("span",{class:"s_40mev6"}," 6")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// 5. Flight booking — custom #trigger renders two side-by-side inputs")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// that share one popover, so the calendar still visualizes the range.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," flight"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_euu481"},"DateRangeValue"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_13ahmt"},"([])")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," depart"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," computed"),s("span",{class:"s_13ahmt"},"(()"),s("span",{class:"s_50ecpt"}," =>")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_22m8k2"},"  flight"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"value"),s("span",{class:"s_13ahmt"},"["),s("span",{class:"s_40mev6"},"0"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_50ecpt"}," ?"),s("span",{class:"s_indoxt"}," dayjs"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_22m8k2"},"flight"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"value"),s("span",{class:"s_13ahmt"},"["),s("span",{class:"s_40mev6"},"0"),s("span",{class:"s_13ahmt"},"])"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"format"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"ddd, MMM D"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," :"),s("span",{class:"s_w1p9wo"}," ''"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," ret"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," computed"),s("span",{class:"s_13ahmt"},"(()"),s("span",{class:"s_50ecpt"}," =>")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_22m8k2"},"  flight"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"value"),s("span",{class:"s_13ahmt"},"["),s("span",{class:"s_40mev6"},"1"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_50ecpt"}," ?"),s("span",{class:"s_indoxt"}," dayjs"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_22m8k2"},"flight"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"value"),s("span",{class:"s_13ahmt"},"["),s("span",{class:"s_40mev6"},"1"),s("span",{class:"s_13ahmt"},"])"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"format"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"ddd, MMM D"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," :"),s("span",{class:"s_w1p9wo"}," ''"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"grid w-full max-w-sm gap-6 py-10"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    <!-- 1. PTO request -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_wac0bt"},"DateRangePicker")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      v-model"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"timeOff"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Time off"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      placeholder"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Pick your dates"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :min"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"today"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"prefix"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"span")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"lucide-palmtree size-4 text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          aria-hidden"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"true"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_28rvie"},"        /"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"actions"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_13ahmt"},"{"),s("span",{class:"s_22m8k2"}," setRange"),s("span",{class:"s_1jjt6x"},", "),s("span",{class:"s_22m8k2"},"close"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          type"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"button"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"rowCls"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"            () => {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              setRange(longWeekend())")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              close()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"            }")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},'          "')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"          Long weekend")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          type"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"button"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"rowCls"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"            () => {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              setRange(workWeek())")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              close()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"            }")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},'          "')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"          Next week")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_wac0bt"},"DateRangePicker"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    <!-- 2. Hotel booking — dual pane shines for >1 month stays -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_wac0bt"},"DateRangePicker")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      v-model"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"stay"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Check-in / Check-out"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      placeholder"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Select your stay"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      dual-pane")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :min"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"today"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :max"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"oneYearOut"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"prefix"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"lucide-hotel size-4 text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1i4ay4"}," aria-hidden"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"true"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_28rvie"}," /"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_wac0bt"},"DateRangePicker"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    <!-- 3. Analytics date range filter -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_wac0bt"},"DateRangePicker")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      v-model"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"analyticsRange"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Report range"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      description"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Defaults to the last 30 days."),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      format"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"MMM D"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :max"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"today"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"prefix"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"span")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"lucide-chart-line size-4 text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          aria-hidden"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"true"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_28rvie"},"        /"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"actions"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_13ahmt"},"{"),s("span",{class:"s_22m8k2"}," fromDate"),s("span",{class:"s_1jjt6x"},", "),s("span",{class:"s_22m8k2"},"toDate"),s("span",{class:"s_1jjt6x"},", "),s("span",{class:"s_22m8k2"},"setRange"),s("span",{class:"s_1jjt6x"},", "),s("span",{class:"s_22m8k2"},"clear"),s("span",{class:"s_1jjt6x"},", "),s("span",{class:"s_22m8k2"},"close"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          type"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"button"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"rowCls"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"            () => {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              setRange([dayjs(), dayjs()])")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              close()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"            }")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},'          "')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"          Today")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          type"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"button"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"rowCls"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"            () => {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              setRange(lastNDays(7))")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              close()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"            }")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},'          "')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"          Last 7 days")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          type"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"button"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"rowCls"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"            () => {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              setRange(lastNDays(28))")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              close()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"            }")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},'          "')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"          Last 4 weeks")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          type"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"button"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"rowCls"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"            () => {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              setRange(lastNDays(90))")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              close()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"            }")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},'          "')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"          Last 3 months")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          type"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"button"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"rowCls"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"            () => {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              setRange(lastNDays(365))")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              close()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"            }")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},'          "')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"          Last 12 months")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"hr"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"my-1 border-outline-gray-2"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"}," />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          v-if"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"fromDate || toDate"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          type"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"button"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"rowCls"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"            () => {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              clear()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              close()")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"            }")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},'          "')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"          Clear")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_wac0bt"},"DateRangePicker"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    <!-- 4. Sprint window — weekdays only -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_wac0bt"},"DateRangePicker")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      v-model"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"sprint"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Sprint window"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      description"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Pick start and end. Weekends are skipped."),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :min"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"today"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :max"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"sprintEnd"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"      :is-date-unavailable"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"isWeekend"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"prefix"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"span")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"lucide-timer-reset size-4 text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          aria-hidden"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"true"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_28rvie"},"        /"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_wac0bt"},"DateRangePicker"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    <!-- 5. Flight booking — split trigger over one shared popover -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_wac0bt"},"DateRangePicker"),s("span",{class:"s_1i4ay4"}," v-model"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"flight"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1i4ay4"}," dual-pane"),s("span",{class:"s_1i4ay4"}," :min"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"today"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"trigger"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_13ahmt"},"{"),s("span",{class:"s_22m8k2"}," setOpen"),s("span",{class:"s_1jjt6x"},", "),s("span",{class:"s_22m8k2"},"open"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"div")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"grid grid-cols-2 divide-x divide-outline-gray-2 rounded-4 border bg-surface-base text-sm transition-colors"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"            open")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              ? 'border-outline-gray-4 ring-2 ring-outline-gray-2'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"              : 'border-outline-gray-2 hover:border-outline-gray-3'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},'          "')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            type"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"button"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"flex items-center gap-2 rounded-l-4 px-3 py-2 text-left hover:bg-surface-gray-1"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"setOpen(!open)"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            <"),s("span",{class:"s_1uuh8p"},"span")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"              class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"lucide-plane-takeoff size-4 text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"              aria-hidden"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"true"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_28rvie"},"            /"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"flex flex-col leading-tight"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"              <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"text-xs text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"},"Depart"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"              <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"text-ink-gray-9"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"                {{ depart || 'Add date' }}")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"              </"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          </"),s("span",{class:"s_1uuh8p"},"button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            type"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"button"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"flex items-center gap-2 rounded-r-4 px-3 py-2 text-left hover:bg-surface-gray-1"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"setOpen(!open)"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            <"),s("span",{class:"s_1uuh8p"},"span")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"              class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"lucide-plane-landing size-4 text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"              aria-hidden"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"true"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_28rvie"},"            /"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"flex flex-col leading-tight"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"              <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"text-xs text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"},"Return"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"              <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"text-ink-gray-9"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"                {{ ret || 'Add date' }}")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"              </"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          </"),s("span",{class:"s_1uuh8p"},"button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_wac0bt"},"DateRangePicker"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:i(()=>[c(os)]),_:1}),l[11]||(l[11]=G("",8)),c(R,{name:"DatePicker",data:r},{code:i(()=>[...l[3]||(l[3]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"Dayjs"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"dayjs/esm"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"InputSize"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," InputVariant"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"../../composables/inputTypes"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"InputLabelingProps"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"../../composables/useInputLabeling"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// Re-exported, not redeclared: `index.ts` does `export * from './types'`, so a")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// local copy publishes a second structurally identical `PopoverSide` at the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// package root that can drift from `Popover`'s without a compile error.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"PopoverAlign"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," PopoverSide"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"../Popover/types"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"PopoverAlign"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," PopoverSide"),s("span",{class:"s_13ahmt"}," }")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Disables the trigger input and calendar interactions. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  disabled"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Shows clear and quick-action controls when enabled. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  clearable"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Keeps the popover open after a date is selected. Default: false. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  keepOpen"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DatePickerProps"),s("span",{class:"s_252irl"}," extends"),s("span",{class:"s_1i4ay4"}," CommonDatePickerProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Controlled value for the picker. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  modelValue"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** A range value: a `[from, to]` tuple in `YYYY-MM-DD` format, or `[]` when cleared. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," DateRangeValue"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_13ahmt"}," []")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DateRangePickerProps"),s("span",{class:"s_252irl"}," extends"),s("span",{class:"s_1i4ay4"}," CommonDatePickerProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Controlled range value as `[from, to]` in `YYYY-MM-DD` format, or `[]` for")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * no selection. `DateRangeValue` types both sides of `v-model` (INP-Q12): the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * prop was `string[]`, which let a one-element array in and made a round-trip")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * through the model fail to type-check.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  modelValue"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," DateRangeValue")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired after the picker commits a normalized value. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"change"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," DateRangePickerEmits"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired when the range value changes. Emits `[from, to]` or `[]` when cleared. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"update:modelValue"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DateRangeValue"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired when the popover open state changes. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"update:open"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired after the picker commits a normalized range value. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"change"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DateRangeValue"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DateTimePickerProps"),s("span",{class:"s_252irl"}," extends"),s("span",{class:"s_1i4ay4"}," CommonDatePickerProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Controlled value for the picker. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  modelValue"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," DateTimePickerEmits"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," DatePickerEmits")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// ── Slot prop shapes ─────────────────────────────────────────────────────────")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** Props bound to the trigger / prefix / suffix slots on all three pickers. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Whether the popover is currently open. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  open"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Whether the picker is disabled. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  disabled"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Sets the popover open state. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  setOpen"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Closes the popover. Equivalent to `setOpen(false)`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  close"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  open"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  disabled"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  setOpen"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  setRange"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"range"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Date"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Dayjs"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Date"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Dayjs"),s("span",{class:"s_13ahmt"},"])"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  clear"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  close"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  open"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  disabled"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  setOpen"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** Props bound to the `actions` slot on `DateTimePicker`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DateTimePickerActionsSlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  selected"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  time"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  setDate"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"date"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Date"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Dayjs"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  clear"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  close"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  open"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  disabled"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  setOpen"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DatePickerSlots"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Custom trigger renderer for the picker. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  trigger"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," DatePickerViewMode"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"date"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"monthYear"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DatePickerDateObj"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  date"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Dayjs")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  key"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  inMonth"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  isToday"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  isSelected"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),c(A,{data:w}),c(O,{data:y}),l[12]||(l[12]=s("h3",{id:"daterangepicker",tabindex:"-1"},[a("DateRangePicker "),s("a",{class:"header-anchor",href:"#daterangepicker","aria-label":"Permalink to “DateRangePicker”"},"​")],-1)),c(R,{name:"DateRangePicker",data:k},{code:i(()=>[...l[4]||(l[4]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"Dayjs"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"dayjs/esm"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"InputSize"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," InputVariant"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"../../composables/inputTypes"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"InputLabelingProps"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"../../composables/useInputLabeling"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// Re-exported, not redeclared: `index.ts` does `export * from './types'`, so a")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// local copy publishes a second structurally identical `PopoverSide` at the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// package root that can drift from `Popover`'s without a compile error.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"PopoverAlign"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," PopoverSide"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"../Popover/types"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"PopoverAlign"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," PopoverSide"),s("span",{class:"s_13ahmt"}," }")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Disables the trigger input and calendar interactions. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  disabled"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Shows clear and quick-action controls when enabled. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  clearable"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Keeps the popover open after a date is selected. Default: false. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  keepOpen"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DatePickerProps"),s("span",{class:"s_252irl"}," extends"),s("span",{class:"s_1i4ay4"}," CommonDatePickerProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Controlled value for the picker. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  modelValue"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** A range value: a `[from, to]` tuple in `YYYY-MM-DD` format, or `[]` when cleared. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," DateRangeValue"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_13ahmt"}," []")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DateRangePickerProps"),s("span",{class:"s_252irl"}," extends"),s("span",{class:"s_1i4ay4"}," CommonDatePickerProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Controlled range value as `[from, to]` in `YYYY-MM-DD` format, or `[]` for")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * no selection. `DateRangeValue` types both sides of `v-model` (INP-Q12): the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * prop was `string[]`, which let a one-element array in and made a round-trip")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * through the model fail to type-check.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  modelValue"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," DateRangeValue")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired after the picker commits a normalized value. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"change"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," DateRangePickerEmits"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired when the range value changes. Emits `[from, to]` or `[]` when cleared. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"update:modelValue"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DateRangeValue"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired when the popover open state changes. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"update:open"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired after the picker commits a normalized range value. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"change"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DateRangeValue"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DateTimePickerProps"),s("span",{class:"s_252irl"}," extends"),s("span",{class:"s_1i4ay4"}," CommonDatePickerProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Controlled value for the picker. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  modelValue"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," DateTimePickerEmits"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," DatePickerEmits")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// ── Slot prop shapes ─────────────────────────────────────────────────────────")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** Props bound to the trigger / prefix / suffix slots on all three pickers. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Whether the popover is currently open. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  open"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Whether the picker is disabled. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  disabled"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Sets the popover open state. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  setOpen"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Closes the popover. Equivalent to `setOpen(false)`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  close"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  open"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  disabled"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  setOpen"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  setRange"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"range"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Date"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Dayjs"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Date"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Dayjs"),s("span",{class:"s_13ahmt"},"])"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  clear"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  close"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  open"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  disabled"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  setOpen"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** Props bound to the `actions` slot on `DateTimePicker`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DateTimePickerActionsSlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  selected"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  time"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  setDate"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"date"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Date"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Dayjs"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  clear"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  close"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  open"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  disabled"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  setOpen"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DatePickerSlots"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Custom trigger renderer for the picker. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  trigger"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," DatePickerViewMode"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"date"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"monthYear"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DatePickerDateObj"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  date"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Dayjs")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  key"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  inMonth"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  isToday"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  isSelected"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),c(A,{data:g}),c(O,{data:v}),l[13]||(l[13]=s("h3",{id:"datetimepicker",tabindex:"-1"},[a("DateTimePicker "),s("a",{class:"header-anchor",href:"#datetimepicker","aria-label":"Permalink to “DateTimePicker”"},"​")],-1)),c(R,{name:"DateTimePicker",data:P},{code:i(()=>[...l[5]||(l[5]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"Dayjs"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"dayjs/esm"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"InputSize"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," InputVariant"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"../../composables/inputTypes"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"InputLabelingProps"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"../../composables/useInputLabeling"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// Re-exported, not redeclared: `index.ts` does `export * from './types'`, so a")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// local copy publishes a second structurally identical `PopoverSide` at the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// package root that can drift from `Popover`'s without a compile error.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"PopoverAlign"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," PopoverSide"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"../Popover/types"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"PopoverAlign"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," PopoverSide"),s("span",{class:"s_13ahmt"}," }")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Disables the trigger input and calendar interactions. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  disabled"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Shows clear and quick-action controls when enabled. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  clearable"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Keeps the popover open after a date is selected. Default: false. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  keepOpen"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DatePickerProps"),s("span",{class:"s_252irl"}," extends"),s("span",{class:"s_1i4ay4"}," CommonDatePickerProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Controlled value for the picker. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  modelValue"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** A range value: a `[from, to]` tuple in `YYYY-MM-DD` format, or `[]` when cleared. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," DateRangeValue"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_13ahmt"}," []")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DateRangePickerProps"),s("span",{class:"s_252irl"}," extends"),s("span",{class:"s_1i4ay4"}," CommonDatePickerProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Controlled range value as `[from, to]` in `YYYY-MM-DD` format, or `[]` for")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * no selection. `DateRangeValue` types both sides of `v-model` (INP-Q12): the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * prop was `string[]`, which let a one-element array in and made a round-trip")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * through the model fail to type-check.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  modelValue"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," DateRangeValue")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired after the picker commits a normalized value. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"change"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," DateRangePickerEmits"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired when the range value changes. Emits `[from, to]` or `[]` when cleared. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"update:modelValue"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DateRangeValue"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired when the popover open state changes. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"update:open"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired after the picker commits a normalized range value. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"change"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_fsg3al"}," value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DateRangeValue"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DateTimePickerProps"),s("span",{class:"s_252irl"}," extends"),s("span",{class:"s_1i4ay4"}," CommonDatePickerProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Controlled value for the picker. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  modelValue"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," DateTimePickerEmits"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_euu481"}," DatePickerEmits")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// ── Slot prop shapes ─────────────────────────────────────────────────────────")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** Props bound to the trigger / prefix / suffix slots on all three pickers. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Whether the popover is currently open. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  open"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Whether the picker is disabled. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  disabled"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Sets the popover open state. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  setOpen"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Closes the popover. Equivalent to `setOpen(false)`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  close"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  open"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  disabled"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  setOpen"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  setRange"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"range"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_i592pt"},"string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Date"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Dayjs"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Date"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Dayjs"),s("span",{class:"s_13ahmt"},"])"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  clear"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  close"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  open"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  disabled"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  setOpen"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** Props bound to the `actions` slot on `DateTimePicker`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DateTimePickerActionsSlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  selected"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  time"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  setDate"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"date"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Date"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Dayjs"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  clear"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  close"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  open"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  disabled"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  setOpen"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"value"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DatePickerSlots"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Custom trigger renderer for the picker. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  trigger"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," DatePickerTriggerSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," DatePickerViewMode"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"date"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"monthYear"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," DatePickerDateObj"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  date"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," Dayjs")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  key"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  inMonth"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  isToday"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  isSelected"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),c(A,{data:z}),c(O,{data:m})])}}});export{Ps as __pageData,Ys as default};
