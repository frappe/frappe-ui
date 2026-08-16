import{_ as m}from"./chunks/PropsTable.CCTP4Juf.js";import{_ as b}from"./chunks/SlotsTable.B3KVVSxm.js";import{_ as x}from"./chunks/EmitsTable.O4_ruINC.js";import{aL as z,a2 as P,a4 as R,a5 as f,aM as $,aN as M,aB as F,K as T,J as k}from"./chunks/theme.B-b3Kllu.js";import{I as j,ad as d,r as h,o as s,D as l,aE as p,p as U,au as C,q as I,aj as w,be as e,B as a,F as A,am as L,a0 as N,ao as H,A as S}from"./chunks/framework.CK2aBVEu.js";const V={class:"grid w-full max-w-lg grid-cols-2 items-start gap-4"},J={class:"rounded-5 bg-surface-gray-1 p-3"},Y={class:"rounded-5 bg-surface-gray-1 p-3"},G={class:"rounded-5 bg-surface-gray-1 p-3"},Q={class:"rounded-5 bg-surface-gray-1 p-3"},X={key:0,class:"col-span-2 text-sm text-ink-gray-5"},Z=j({__name:"Card",setup(g){const i=w(!0),_=w("");return(u,c)=>(d(),h("div",V,[s("div",J,[l(p(z),{title:"Your trial ends soon!",description:"Upgrade to keep enjoying features.",action:{label:"Update now",onClick:()=>{_.value="Billing page opened"}}},null,8,["action"])]),s("div",Y,[i.value?(d(),U(p(z),{key:0,theme:"blue",dismissible:"",title:"New feature available",description:"Discover the new board view for your deals.",action:{label:"Explore now",onClick:({dismiss:t})=>(_.value="Board view opened",t())},onDismiss:c[0]||(c[0]=t=>i.value=!1)},null,8,["action"])):(d(),h("button",{key:1,class:"text-sm text-ink-gray-5 underline",onClick:c[1]||(c[1]=t=>i.value=!0)}," Bring the card back "))]),s("div",G,[l(p(z),{theme:"amber",title:"Storage is almost full",description:"Free up space or upgrade your plan.",action:{label:"Manage storage",onClick:()=>{_.value="Storage settings opened"}}},null,8,["action"])]),s("div",Q,[l(p(z),{theme:"red",title:"Payment failed",description:"Update your card to avoid interruption.",action:{label:"Fix billing",onClick:()=>{_.value="Card details opened"}}},null,8,["action"])]),_.value?(d(),h("p",X,C(_.value),1)):I("",!0)]))}}),ss={class:"flex h-[360px] w-fit overflow-hidden rounded-5 border"},as={class:"flex-1 overflow-y-auto px-2 pt-2"},ns=j({__name:"Section",setup(g){const i=w("leads"),_=w(!1);return(u,c)=>(d(),h("div",ss,[l(p(P),{"disable-collapse":"",width:"14rem"},{default:e(()=>[s("div",as,[l(p(R),null,{default:e(()=>[...c[5]||(c[5]=[a("Pipeline",-1)])]),_:1}),l(p(f),{label:"Leads",icon:"lucide-user-plus",active:i.value==="leads",onClick:c[0]||(c[0]=t=>i.value="leads")},null,8,["active"]),l(p(f),{label:"Deals",icon:"lucide-handshake",active:i.value==="deals",onClick:c[1]||(c[1]=t=>i.value="deals")},null,8,["active"]),l(p($),{label:"Views",collapsible:"",collapsed:_.value,"onUpdate:collapsed":c[4]||(c[4]=t=>_.value=t)},{default:e(()=>[l(p(f),{label:"My Open Deals",icon:"lucide-flame",active:i.value==="my-open-deals",onClick:c[2]||(c[2]=t=>i.value="my-open-deals")},null,8,["active"]),l(p(f),{label:"Unassigned",icon:"lucide-circle-dashed",active:i.value==="unassigned",onClick:c[3]||(c[3]=t=>i.value="unassigned")},null,8,["active"])]),_:1},8,["collapsed"])])]),_:1})]))}}),ls={class:"flex h-[360px] w-fit overflow-hidden rounded-5 border"},es={class:"flex-1 overflow-y-auto px-2 pt-2"},ps={class:"mt-auto px-2 pb-2"},cs=j({__name:"Collapsed",setup(g){const i=w(!0),_=w("inbox"),u=[{id:"inbox",label:"Inbox",icon:"lucide-inbox"},{id:"starred",label:"Starred",icon:"lucide-star"},{id:"sent",label:"Sent",icon:"lucide-send"}];return(c,t)=>(d(),h("div",ls,[l(p(P),{collapsed:i.value,"onUpdate:collapsed":t[0]||(t[0]=o=>i.value=o)},{default:e(()=>[s("div",es,[l(p(R),{divider:""},{default:e(()=>[...t[1]||(t[1]=[a("Mail",-1)])]),_:1}),(d(),h(A,null,L(u,o=>l(p(f),{key:o.id,icon:o.icon,label:o.label,active:_.value===o.id,onClick:r=>_.value=o.id},null,8,["icon","label","active","onClick"])),64))]),s("div",ps,[l(p(M))])]),_:1},8,["collapsed"])]))}}),ts={class:"flex h-[560px] w-fit overflow-hidden rounded-5 border"},is={class:"flex h-7 items-center justify-between"},_s={class:"flex items-center"},os={class:"mt-0.5 space-y-0.5"},rs={class:"flex-1 inline-flex items-center gap-1 truncate text-sm"},ds={key:0,class:"lucide-lock size-3 shrink-0 text-ink-gray-5"},hs={class:"relative mr-1 flex size-7 shrink-0 items-center justify-end"},ws={key:0,class:"absolute right-1 text-xs text-ink-gray-5 transition-opacity group-hover/sidebar-item:opacity-0 group-focus-within/sidebar-item:opacity-0"},us=j({__name:"Default",setup(g){const i=w("product"),_=w("Recent activity"),u=[{id:"product",title:"Product",icon:"lucide-rocket",unread:0,private:!1},{id:"design",title:"Design",icon:"lucide-palette",unread:3,private:!1},{id:"engineering",title:"Engineering",icon:"lucide-code",unread:12,private:!1},{id:"marketing",title:"Marketing",icon:"lucide-megaphone",unread:0,private:!1},{id:"sales",title:"Sales",icon:"lucide-trending-up",unread:1,private:!1},{id:"support",title:"Customer Support",icon:"lucide-headphones",unread:0,private:!1},{id:"people",title:"People & Culture",icon:"lucide-users",unread:0,private:!1},{id:"finance",title:"Finance",icon:"lucide-wallet",unread:0,private:!0},{id:"leadership",title:"Leadership",icon:"lucide-crown",unread:2,private:!0},{id:"design-system",title:"Design System",icon:"lucide-component",unread:0,private:!1},{id:"research",title:"User Research",icon:"lucide-microscope",unread:5,private:!1},{id:"ops",title:"Operations",icon:"lucide-settings-2",unread:0,private:!1},{id:"events",title:"Events",icon:"lucide-party-popper",unread:0,private:!1},{id:"data",title:"Data & Analytics",icon:"lucide-database",unread:8,private:!1},{id:"brand",title:"Brand",icon:"lucide-sparkles",unread:0,private:!1},{id:"partnerships",title:"Partnerships",icon:"lucide-handshake",unread:0,private:!1},{id:"security",title:"Security",icon:"lucide-shield",unread:0,private:!0},{id:"onboarding",title:"Onboarding",icon:"lucide-graduation-cap",unread:0,private:!1},{id:"random",title:"Random",icon:"lucide-shuffle",unread:0,private:!1}],c=[{group:"Sort by",options:["Recent activity","Alphabetical"].map(t=>({label:t,icon:_.value===t?"lucide-check":null,onClick:()=>_.value=t}))}];return(t,o)=>(d(),h("div",ts,[l(p(P),{"disable-collapse":"",width:"14rem"},{default:e(()=>[o[1]||(o[1]=s("div",{class:"flex shrink-0 items-center p-2"},[s("button",{class:"flex h-8 w-full items-center gap-2 rounded-4 px-1 transition hover:bg-surface-gray-2"},[s("div",{class:"grid size-6 shrink-0 place-items-center rounded-4 bg-surface-gray-7 text-xs font-medium text-ink-white"}," F "),s("span",{class:"flex-1 truncate text-left text-base text-ink-gray-8"},"Frappe"),s("span",{class:"lucide-chevrons-up-down size-4 shrink-0 text-ink-gray-5"})])],-1)),l(p(F),{class:"min-h-0 flex-1","viewport-class":"px-2 pt-0.5 pb-10"},{default:e(()=>[s("div",is,[l(p(R),null,{default:e(()=>[...o[0]||(o[0]=[a("Spaces",-1)])]),_:1}),s("div",_s,[l(p(T),{options:c,align:"end"},{trigger:e(({open:r})=>[l(p(k),{variant:"ghost",size:"sm",icon:"lucide-arrow-up-down text-ink-gray-5",label:"Sort spaces",tooltip:"Sort spaces",active:r},null,8,["active"])]),_:1}),l(p(k),{variant:"ghost",size:"sm",icon:"lucide-plus text-ink-gray-5",label:"New space"})])]),s("nav",os,[(d(),h(A,null,L(u,r=>l(p(f),{key:r.id,icon:r.icon,active:i.value===r.id,onClick:y=>i.value=r.id},{suffix:e(()=>[s("div",hs,[r.unread>0?(d(),h("span",ws,C(r.unread),1)):I("",!0),l(p(T),{options:[{label:"Mark all as read"},{label:"Leave space"}],align:"start",side:"right"},{default:e(({open:y})=>[l(p(k),{variant:y?"subtle":"ghost",size:"xs",icon:"lucide-more-horizontal text-ink-gray-5",label:`${r.title} options`,class:N(["absolute right-0 -mr-0.5 opacity-0 group-hover/sidebar-item:opacity-100 group-focus-within/sidebar-item:opacity-100",y?"opacity-100":""])},null,8,["variant","label","class"])]),_:2},1024)])]),default:e(()=>[s("span",rs,[r.private?(d(),h("span",ds)):I("",!0),a(" "+C(r.title),1)])]),_:2},1032,["icon","active","onClick"])),64))])]),_:1})]),_:1})]))}}),js=JSON.parse('{"title":"Sidebar","description":"","frontmatter":{},"headers":[],"relativePath":"docs/components/sidebar.md","filePath":"docs/components/sidebar.md","lastUpdated":1779053387000}'),ms={name:"docs/components/sidebar.md"},xs=Object.assign(ms,{setup(g){const i=[{name:"disableCollapse",description:"Disables collapsing entirely (fixed width, no built-in toggle).",required:!1,type:"boolean"},{name:"width",description:"Expanded width as a CSS length. Applied inline so apps can override it.",required:!1,type:"string",default:'"15rem"'},{name:"collapsedWidth",description:"Collapsed width as a CSS length.",required:!1,type:"string",default:'"3rem"'},{name:"collapsed",description:"v-model. Whether the sidebar is collapsed. Left unset, it collapses automatically below the `sm` breakpoint.",required:!1,type:"boolean | null",default:"null"}],_=[{name:"default",description:"The sidebar body — header, scroll region, footer, all composed by the app.",type:"any"}],u=[{name:"update:collapsed",description:"Fired when the sidebar is collapsed or expanded.",type:"[value: boolean | null]"}],c=[{name:"label",description:"Row label. Used as the accessible name and the default slot fallback.",required:!1,type:"string"},{name:"accessKey",description:"`accesskey` attribute for a keyboard shortcut.",required:!1,type:"string"},{name:"icon",description:"Leading icon: a CSS class (e.g. `lucide-box`), plain text, or a component.\nIgnored when the `#prefix` slot is used.",required:!1,type:"string | Component"},{name:"suffix",description:"Trailing text. Ignored when the `#suffix` slot is used.",required:!1,type:"string"},{name:"to",description:"Navigation target. When set the row's main area renders as a router link;\notherwise it renders as a button. A click still invokes `onClick`.",required:!1,type:"string | kt | Tt"},{name:"active",description:'Marks the row active (`data-state="active"`). When omitted, active state is\ninferred by matching `to` against the current route.',required:!1,type:"boolean"},{name:"onClick",description:"Click handler. Bound from `@click`.",required:!1,type:"((event: MouseEvent) => void)"}],t=[{name:"prefix",description:"Leading icon or avatar. Overrides the `icon` prop.",type:"any"},{name:"default",description:"The label region. Overrides the `label` prop; put inline adornments here.",type:"any"},{name:"suffix",description:"The trailing zone — a sibling of the link/button, not nested inside it. Overrides the `suffix` prop.",type:"any"}],o=[{name:"divider",description:"When true, collapses to a horizontal divider while the sidebar is collapsed\n(matches the previous `SidebarSection` label behavior).",required:!1,type:"boolean"}],r=[{name:"default",description:"The label text.",type:"any"}],y=[{name:"title",description:"Workspace or app title.",required:!0,type:"string"},{name:"subtitle",description:"Secondary line under the title, e.g. a domain or workspace slug.",required:!1,type:"string"},{name:"logo",description:"Leading logo: an image URL, or a component. Overridden by the `#prefix` slot.",required:!1,type:"string | Component"},{name:"showLogo",description:"Whether to render the leading logo/avatar box. Defaults to `true`. Set to\n`false` when workspace identity is already shown elsewhere (e.g. a left\nrail) to avoid a duplicate avatar; the title then sits flush-left. Best\npaired with a non-collapsing sidebar, since a collapsed header with no logo\nhas nothing to show.",required:!1,type:"boolean",default:"true"},{name:"menuItems",description:"Options rendered in the trigger's dropdown — the same shape `Dropdown` itself takes.",required:!1,type:"{ label: string; icon?: string | Component; onClick?: (() => void) | undefined; }[] | undefined"}],q=[{name:"prefix",description:"Fills the default logo/initial box (a `size-7 overflow-hidden` frame — wide content clips). Falls back to the `logo` prop, then the title's first letter.",type:"any"}],W=[{name:"label",description:"Section label. Renders nothing when omitted (a label-less group).",required:!1,type:"string"},{name:"collapsible",description:"Whether clicking the label toggles the group's visibility.",required:!1,type:"boolean"},{name:"collapsed",description:"v-model. Whether the section is collapsed. Bind it to own the state (start a section collapsed, persist the choice); left unbound the section manages it internally, starting expanded.",required:!1,type:"boolean",default:"false"}],K=[{name:"default",description:"The group's rows — compose `SidebarItem` (or anything else) here.",type:"any"}],B=[{name:"update:collapsed",description:"Fired when the section is collapsed or expanded.",type:"[value: boolean]"}],D=[{name:"title",description:"Main heading text of the card. Optional when the `#title` slot is used",required:!1,type:"string"},{name:"description",description:"Supporting text below the title",required:!1,type:"string"},{name:"theme",description:"Color theme of the icon and the tinted action button; the white container never changes with theme",required:!1,type:"StatusTheme",default:'"gray"'},{name:"icon",description:"Icon next to the title: unset shows the theme's auto icon (gray shows the info glyph in black ink), `false` hides it, a `lucide-*` string or Component renders a custom theme-colored glyph",required:!1,type:"boolean | string | Component"},{name:"action",description:"The full-width tinted action button (`ButtonProps` plus `onClick({ dismiss })`)",required:!1,type:"AlertAction"},{name:"dismissible",description:"Shows the dismiss (×) button, which emits `dismiss`",required:!1,type:"boolean",default:"false"}],O=[{name:"prefix",description:"Overrides the icon area next to the title",type:"any"},{name:"title",description:"Rich title content (overrides the `title` prop)",type:"any"},{name:"description",description:"Rich description content (overrides the `description` prop)",type:"any"},{name:"actions",description:"Replaces the auto-rendered action button; receives `{ dismiss }`",type:"SidebarCardActionsSlotProps"}],E=[{name:"dismiss",description:"Fired when the user dismisses the card — the × button or the action's `context.dismiss()`. The parent owns hiding.",type:"[]"}];return(bs,n)=>{const v=H("ComponentPreview");return d(),h("div",null,[n[10]||(n[10]=s("h1",{id:"sidebar",tabindex:"-1"},[a("Sidebar "),s("a",{class:"header-anchor",href:"#sidebar","aria-label":"Permalink to “Sidebar”"},"​")],-1)),n[11]||(n[11]=s("p",null,[a("The wide navigation panel of an app shell. "),s("code",null,"Sidebar"),a(" is a bare frame — a fixed-width column with the collapse machinery and a single slot — and you compose the body from "),s("code",null,"SidebarItem"),a(", "),s("code",null,"SidebarLabel"),a(", and your own markup. The app owns its header, scroll region, and empty state; lay them out with plain flex utilities.")],-1)),l(v,{name:"Sidebar-Default"},{code:e(()=>[...n[0]||(n[0]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"ref"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  Sidebar"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  SidebarItem"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  SidebarLabel"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  ScrollArea"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  Button"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  Dropdown"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// A faithful Gameplan sidebar: an app switcher up top, then a scrolling list of")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// spaces with lucide icons, unread counts, private locks, and a hover-reveal")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// options menu. Only <Sidebar>/<SidebarItem>/<SidebarLabel> come from the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// family — the header, the ScrollArea, and the spaces markup are the app's own.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," active"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"product"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," sort"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"Recent activity"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," spaces"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," [")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," id"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"product"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Product"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," icon"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-rocket"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," unread"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 0"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," private"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," false"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," id"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"design"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Design"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," icon"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-palette"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," unread"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 3"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," private"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," false"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," id"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"engineering"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Engineering"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," icon"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-code"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," unread"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 12"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," private"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," false"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," id"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"marketing"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Marketing"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," icon"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-megaphone"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," unread"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 0"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," private"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," false"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," id"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"sales"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Sales"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," icon"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-trending-up"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," unread"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 1"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," private"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," false"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," id"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"support"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Customer Support"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," icon"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-headphones"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," unread"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 0"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," private"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," false"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," id"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"people"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"People & Culture"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," icon"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-users"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," unread"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 0"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," private"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," false"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," id"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"finance"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Finance"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," icon"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-wallet"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," unread"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 0"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," private"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," true"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," id"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"leadership"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Leadership"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," icon"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-crown"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," unread"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 2"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," private"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," true"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," id"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"design-system"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Design System"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," icon"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-component"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," unread"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 0"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," private"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," false"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," id"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"research"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"User Research"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," icon"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-microscope"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," unread"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 5"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," private"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," false"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," id"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"ops"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Operations"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," icon"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-settings-2"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," unread"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 0"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," private"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," false"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," id"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"events"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Events"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," icon"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-party-popper"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," unread"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 0"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," private"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," false"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," id"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"data"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Data & Analytics"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," icon"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-database"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," unread"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 8"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," private"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," false"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," id"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"brand"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Brand"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," icon"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-sparkles"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," unread"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 0"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," private"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," false"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," id"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"partnerships"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Partnerships"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," icon"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-handshake"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," unread"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 0"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," private"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," false"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," id"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"security"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Security"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," icon"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-shield"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," unread"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 0"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," private"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," true"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," id"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"onboarding"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Onboarding"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," icon"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-graduation-cap"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," unread"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 0"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," private"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," false"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," id"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"random"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Random"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," icon"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-shuffle"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," unread"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," 0"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," private"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," false"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," sortOptions"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," [")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    group"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Sort by"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    options"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"Recent activity"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Alphabetical"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_indoxt"},"map"),s("span",{class:"s_13ahmt"},"(("),s("span",{class:"s_fsg3al"},"label"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_13ahmt"}," ({")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_11933w"},"      label"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"      icon"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_22m8k2"}," sort"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"value"),s("span",{class:"s_50ecpt"}," ==="),s("span",{class:"s_11933w"}," label"),s("span",{class:"s_50ecpt"}," ?"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-check"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_50ecpt"}," :"),s("span",{class:"s_40mev6"}," null"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"      onClick"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_22m8k2"},"sort"),s("span",{class:"s_1jjt6x"},"."),s("span",{class:"s_11933w"},"value"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_11933w"}," label"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"    }))"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"flex h-[560px] w-fit overflow-hidden rounded-5 border"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_wac0bt"},"Sidebar"),s("span",{class:"s_1i4ay4"}," disable-collapse"),s("span",{class:"s_1i4ay4"}," width"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"14rem"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"      <!-- App switcher — the app owns the header. -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"flex shrink-0 items-center p-2"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"flex h-8 w-full items-center gap-2 rounded-4 px-1 transition hover:bg-surface-gray-2"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"div")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"grid size-6 shrink-0 place-items-center rounded-4 bg-surface-gray-7 text-xs font-medium text-ink-white"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"            F")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"flex-1 truncate text-left text-base text-ink-gray-8"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"},"Frappe"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"lucide-chevrons-up-down size-4 shrink-0 text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_28rvie"}," /"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"      <!--")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"        The app owns the scroll region. frappe-ui's ScrollArea keeps the thin,")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"        auto-hiding overlay scrollbar; padding the viewport (px-2) gives the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"        active row's shadow room so overflow-hidden doesn't clip it.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"      -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"ScrollArea"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"min-h-0 flex-1"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1i4ay4"}," viewport-class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"px-2 pt-0.5 pb-10"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"flex h-7 items-center justify-between"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_wac0bt"},"SidebarLabel"),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"},"Spaces"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_wac0bt"},"SidebarLabel"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"flex items-center"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            <"),s("span",{class:"s_wac0bt"},"Dropdown"),s("span",{class:"s_1i4ay4"}," :options"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"sortOptions"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_suc1p8"}," align"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"end"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"              <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"trigger"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_13ahmt"},"{"),s("span",{class:"s_22m8k2"}," open"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"                <"),s("span",{class:"s_1uuh8p"},"Button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"                  variant"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ghost"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"                  size"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"sm"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"                  icon"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"lucide-arrow-up-down text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"                  label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Sort spaces"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"                  tooltip"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Sort spaces"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"                  :active"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"open"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_28rvie"},"                /"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"              </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            </"),s("span",{class:"s_wac0bt"},"Dropdown"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            <"),s("span",{class:"s_1uuh8p"},"Button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"              variant"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ghost"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"              size"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"sm"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"              icon"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"lucide-plus text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"              label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"New space"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_28rvie"},"            /"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"nav"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"mt-0.5 space-y-0.5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_wac0bt"},"SidebarItem")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            v-for"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"space in spaces"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            :key"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"space.id"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            :icon"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"space.icon"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            :active"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"active === space.id"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"active = space.id"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            <"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"flex-1 inline-flex items-center gap-1 truncate text-sm"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"              <"),s("span",{class:"s_1uuh8p"},"span")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"                v-if"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"space.private"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"                class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"lucide-lock size-3 shrink-0 text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_28rvie"},"              /"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"              {{ space.title }}")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            </"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"suffix"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"              <!--")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"                Count and options menu share one cell: the count fades out on row")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'                hover/focus while the "…" menu fades in. The group is')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"                SidebarItem's root (`group/sidebar-item`).")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"              -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"              <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"relative mr-1 flex size-7 shrink-0 items-center justify-end"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"                <"),s("span",{class:"s_1uuh8p"},"span")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"                  v-if"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"space.unread > 0"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"                  class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"absolute right-1 text-xs text-ink-gray-5 transition-opacity group-hover/sidebar-item:opacity-0 group-focus-within/sidebar-item:opacity-0"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"                >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"                  {{ space.unread }}")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"                </"),s("span",{class:"s_1uuh8p"},"span"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"                <"),s("span",{class:"s_wac0bt"},"Dropdown")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"                  :options"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"[{ label: 'Mark all as read' }, { label: 'Leave space' }]"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_suc1p8"},"                  align"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"start"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"                  side"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"right"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"                >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"                  <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1jjt6x"}," #"),s("span",{class:"s_1i4ay4"},"default"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_13ahmt"},"{"),s("span",{class:"s_22m8k2"}," open"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"                    <"),s("span",{class:"s_1uuh8p"},"Button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"                      :variant"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"open ? 'subtle' : 'ghost'"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"                      size"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"xs"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"                      icon"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"lucide-more-horizontal text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"                      :label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"`${space.title} options`"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"                      class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"absolute right-0 -mr-0.5 opacity-0 group-hover/sidebar-item:opacity-100 group-focus-within/sidebar-item:opacity-100"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"                      :class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"open ? 'opacity-100' : ''"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_28rvie"},"                    /"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"                  </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"                </"),s("span",{class:"s_wac0bt"},"Dropdown"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"              </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"            </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          </"),s("span",{class:"s_wac0bt"},"SidebarItem"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"nav"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_wac0bt"},"ScrollArea"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_wac0bt"},"Sidebar"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:e(()=>[l(us)]),_:1}),n[12]||(n[12]=S("",3)),l(v,{name:"Sidebar-Collapsed"},{code:e(()=>[...n[1]||(n[1]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"ref"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  Sidebar"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  SidebarItem"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  SidebarLabel"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  SidebarCollapseToggle"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," collapsed"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_40mev6"},"true"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," active"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"inbox"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," items"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," [")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," id"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"inbox"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," label"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Inbox"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," icon"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-inbox"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," id"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"starred"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," label"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Starred"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," icon"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-star"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {"),s("span",{class:"s_r4oegk"}," id"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"sent"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," label"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Sent"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," icon"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-send"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"flex h-[360px] w-fit overflow-hidden rounded-5 border"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"    <!-- v-model:collapsed is app state; SidebarCollapseToggle flips it. -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_wac0bt"},"Sidebar"),s("span",{class:"s_1i4ay4"}," v-model:collapsed"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"collapsed"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"flex-1 overflow-y-auto px-2 pt-2"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_wac0bt"},"SidebarLabel"),s("span",{class:"s_1i4ay4"}," divider"),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"},"Mail"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_wac0bt"},"SidebarLabel"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_wac0bt"},"SidebarItem")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          v-for"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"item in items"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          :key"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"item.id"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          :icon"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"item.icon"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          :label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"item.label"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          :active"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"active === item.id"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"active = item.id"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"mt-auto px-2 pb-2"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_wac0bt"},"SidebarCollapseToggle"),s("span",{class:"s_1zd9e2"}," />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_wac0bt"},"Sidebar"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:e(()=>[l(cs)]),_:1}),n[13]||(n[13]=S("",9)),l(v,{name:"Sidebar-Section"},{code:e(()=>[...n[2]||(n[2]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"ref"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"Sidebar"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," SidebarSection"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," SidebarItem"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," SidebarLabel"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// Non-collapsible groups skip SidebarSection entirely: SidebarLabel +")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// SidebarItem, composed directly. SidebarSection is only for groups that")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// collapse — `viewsCollapsed` is app state its `v-model:collapsed` writes")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// back to, so the app can persist the choice.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," active"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"leads"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," viewsCollapsed"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_40mev6"},"false"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"flex h-[360px] w-fit overflow-hidden rounded-5 border"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_wac0bt"},"Sidebar"),s("span",{class:"s_1i4ay4"}," disable-collapse"),s("span",{class:"s_1i4ay4"}," width"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"14rem"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"flex-1 overflow-y-auto px-2 pt-2"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_wac0bt"},"SidebarLabel"),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"},"Pipeline"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_wac0bt"},"SidebarLabel"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_wac0bt"},"SidebarItem")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Leads"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          icon"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"lucide-user-plus"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          :active"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"active === 'leads'"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"active = 'leads'"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_wac0bt"},"SidebarItem")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Deals"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          icon"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"lucide-handshake"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          :active"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"active === 'deals'"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"active = 'deals'"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        />")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_wac0bt"},"SidebarSection")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Views"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          collapsible")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          v-model:collapsed"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"viewsCollapsed"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_wac0bt"},"SidebarItem")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"My Open Deals"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            icon"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"lucide-flame"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            :active"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"active === 'my-open-deals'"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"active = 'my-open-deals'"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_wac0bt"},"SidebarItem")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            label"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Unassigned"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            icon"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"lucide-circle-dashed"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            :active"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"active === 'unassigned'"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"active = 'unassigned'"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_wac0bt"},"SidebarSection"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_wac0bt"},"Sidebar"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:e(()=>[l(ns)]),_:1}),n[14]||(n[14]=s("p",null,[a("Bind "),s("code",null,"v-model:collapsed"),a(" to own a section's state (start a section collapsed, persist the choice); left unbound the section manages it internally, starting expanded.")],-1)),n[15]||(n[15]=s("h2",{id:"sidebarcard",tabindex:"-1"},[a("SidebarCard "),s("a",{class:"header-anchor",href:"#sidebarcard","aria-label":"Permalink to “SidebarCard”"},"​")],-1)),n[16]||(n[16]=s("p",null,[a(`A promotional or onboarding card for the sidebar footer — a trial notice, an upgrade prompt, a "what's new" pointer. A white card with an optional theme-colored icon and one full-width tinted action button. Like `),s("code",null,"Alert"),a(", it is stateless: "),s("code",null,"dismiss"),a(" is an event and the parent owns hiding the card. It is not a status announcement, so it has no live-region role.")],-1)),l(v,{name:"Sidebar-Card"},{code:e(()=>[...n[3]||(n[3]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"ref"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"SidebarCard"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// Cards as they sit in a sidebar footer: on the sidebar's gray surface,")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// at sidebar width. The parent owns hiding — dismiss just flips a flag.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// Actions report what they did in the status line below the grid.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," showFeatureCard"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_40mev6"},"true"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," status"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"''"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"grid w-full max-w-lg grid-cols-2 items-start gap-4"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"rounded-5 bg-surface-gray-1 p-3"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"SidebarCard")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        title"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Your trial ends soon!"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        description"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Upgrade to keep enjoying features."),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        :action"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"{")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"          label: 'Update now',")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"          onClick: () => {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"            status = 'Billing page opened'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"          },")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"        }"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"rounded-5 bg-surface-gray-1 p-3"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"SidebarCard")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        v-if"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"showFeatureCard"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        theme"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"blue"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        dismissible")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        title"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"New feature available"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        description"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Discover the new board view for your deals."),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        :action"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"{")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"          label: 'Explore now',")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"          onClick: ({ dismiss }) => ((status = 'Board view opened'), dismiss()),")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"        }"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        @dismiss"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"showFeatureCard = false"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_1uuh8p"},"button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        v-else")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"text-sm text-ink-gray-5 underline"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        @click"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"showFeatureCard = true"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"        Bring the card back")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_1uuh8p"},"button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"rounded-5 bg-surface-gray-1 p-3"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"SidebarCard")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        theme"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"amber"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        title"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Storage is almost full"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        description"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Free up space or upgrade your plan."),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        :action"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"{")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"          label: 'Manage storage',")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"          onClick: () => {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"            status = 'Storage settings opened'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"          },")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"        }"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"rounded-5 bg-surface-gray-1 p-3"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"SidebarCard")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        theme"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"red"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        title"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Payment failed"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        description"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Update your card to avoid interruption."),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        :action"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"{")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"          label: 'Fix billing',")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"          onClick: () => {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"            status = 'Card details opened'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"          },")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"        }"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_1uuh8p"},"p"),s("span",{class:"s_1i4ay4"}," v-if"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"status"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"col-span-2 text-sm text-ink-gray-5"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_6am9cx"},"      {{ status }}")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_1uuh8p"},"p"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:e(()=>[l(Z)]),_:1}),n[17]||(n[17]=S("",3)),l(m,{name:"Sidebar",data:i},{code:e(()=>[...n[4]||(n[4]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"Component"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," ComputedRef"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," InjectionKey"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"RouteLocationRaw"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue-router"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"AlertAction"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"../Alert"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"StatusTheme"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"../shared/statusIcon"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Read-only collapsed state, provided by `Sidebar` and consumed by")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * `SidebarItem` / `SidebarLabel` / `SidebarHeader` to shrink to icon-only.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_252irl"}," const"),s("span",{class:"s_295sjd"}," sidebarCollapsedKey"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," InjectionKey"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_euu481"},"ComputedRef"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"boolean"),s("span",{class:"s_1jjt6x"},">>"),s("span",{class:"s_2ekfrt"}," =")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  Symbol"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"sidebarCollapsed"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Toggles the sidebar's collapsed state, provided by `Sidebar` and consumed by")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * `SidebarCollapseToggle`. Kept separate from "),s("span",{class:"s_1zp9pn"},"{"),s("span",{class:"s_1v9gwm"},"@"),s("span",{class:"s_y1rh3e"},"link"),s("span",{class:"s_1cpno3"}," sidebarCollapsedKey"),s("span",{class:"s_1zp9pn"},"}"),s("span",{class:"s_1th9sy"}," so")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * existing read-only consumers need no change.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_252irl"}," const"),s("span",{class:"s_295sjd"}," sidebarToggleKey"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," InjectionKey"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_13ahmt"},"()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_2ekfrt"}," =")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  Symbol"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"sidebarToggle"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," SidebarProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Disables collapsing entirely (fixed width, no built-in toggle). */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  disableCollapse"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Expanded width as a CSS length. Applied inline so apps can override it. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  width"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Collapsed width as a CSS length. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  collapsedWidth"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," SidebarItemProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row label. Used as the accessible name and the default slot fallback. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** `accesskey` attribute for a keyboard shortcut. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  accessKey"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Leading icon: a CSS class (e.g. `lucide-box`), plain text, or a component.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Ignored when the `#prefix` slot is used.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  icon"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Trailing text. Ignored when the `#suffix` slot is used. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  suffix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Navigation target. When set the row's main area renders as a router link;")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * otherwise it renders as a button. A click still invokes `onClick`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  to"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," RouteLocationRaw")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'   * Marks the row active (`data-state="active"`). When omitted, active state is')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * inferred by matching `to` against the current route.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  active"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Click handler. Bound from `@click`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  onClick"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," MouseEvent"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," SidebarLabelProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * When true, collapses to a horizontal divider while the sidebar is collapsed")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * (matches the previous `SidebarSection` label behavior).")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  divider"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," SidebarHeaderProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Workspace or app title. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Secondary line under the title, e.g. a domain or workspace slug. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  subtitle"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Leading logo: an image URL, or a component. Overridden by the `#prefix` slot. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  logo"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Whether to render the leading logo/avatar box. Defaults to `true`. Set to")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `false` when workspace identity is already shown elsewhere (e.g. a left")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * rail) to avoid a duplicate avatar; the title then sits flush-left. Best")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * paired with a non-collapsing sidebar, since a collapsed header with no logo")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * has nothing to show.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  showLogo"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Options rendered in the trigger's dropdown — the same shape `Dropdown` itself takes. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  menuItems"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    label"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    icon"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"    onClick"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Promotional or onboarding card for the sidebar footer — a trial notice, an")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},' * upgrade prompt, a "what\'s new" pointer. Stateless: `dismiss` is an event and')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * the parent owns hiding the card.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," SidebarCardProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Main heading text of the card. Optional when the `#title` slot is used */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Supporting text below the title */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  description"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Color theme of the icon and the tinted action button; the white container never changes with theme */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  theme"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," StatusTheme")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Icon next to the title: unset shows the theme's auto icon (gray shows the info glyph in black ink), `false` hides it, a `lucide-*` string or Component renders a custom theme-colored glyph */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  icon"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The full-width tinted action button (`ButtonProps` plus `onClick({ dismiss })`) */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  action"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," AlertAction")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Shows the dismiss (×) button, which emits `dismiss` */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  dismissible"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," SidebarCardEmits"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired when the user dismisses the card — the × button or the action's `context.dismiss()`. The parent owns hiding. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  dismiss"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," []")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** Scoped payload for the card's `#actions` slot. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," SidebarCardActionsSlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Emits the card's `dismiss` event. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  dismiss"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," SidebarCardSlots"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Overrides the icon area next to the title */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  prefix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Rich title content (overrides the `title` prop) */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  title"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Rich description content (overrides the `description` prop) */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  description"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Replaces the auto-rendered action button; receives `{ dismiss }` */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  actions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," SidebarCardActionsSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Building block for a collapsible group of `SidebarItem`s. Compose children")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * in the default slot — `SidebarSection` owns only the label + collapse")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * chrome, not the rows inside it.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," SidebarSectionProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Section label. Renders nothing when omitted (a label-less group). */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Whether clicking the label toggles the group's visibility. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  collapsible"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),l(b,{data:_}),l(x,{data:u}),n[18]||(n[18]=s("h3",{id:"sidebaritem-1",tabindex:"-1"},[a("SidebarItem "),s("a",{class:"header-anchor",href:"#sidebaritem-1","aria-label":"Permalink to “SidebarItem”"},"​")],-1)),l(m,{name:"SidebarItem",data:c},{code:e(()=>[...n[5]||(n[5]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"Component"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," ComputedRef"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," InjectionKey"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"RouteLocationRaw"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue-router"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"AlertAction"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"../Alert"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"StatusTheme"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"../shared/statusIcon"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Read-only collapsed state, provided by `Sidebar` and consumed by")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * `SidebarItem` / `SidebarLabel` / `SidebarHeader` to shrink to icon-only.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_252irl"}," const"),s("span",{class:"s_295sjd"}," sidebarCollapsedKey"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," InjectionKey"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_euu481"},"ComputedRef"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"boolean"),s("span",{class:"s_1jjt6x"},">>"),s("span",{class:"s_2ekfrt"}," =")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  Symbol"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"sidebarCollapsed"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Toggles the sidebar's collapsed state, provided by `Sidebar` and consumed by")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * `SidebarCollapseToggle`. Kept separate from "),s("span",{class:"s_1zp9pn"},"{"),s("span",{class:"s_1v9gwm"},"@"),s("span",{class:"s_y1rh3e"},"link"),s("span",{class:"s_1cpno3"}," sidebarCollapsedKey"),s("span",{class:"s_1zp9pn"},"}"),s("span",{class:"s_1th9sy"}," so")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * existing read-only consumers need no change.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_252irl"}," const"),s("span",{class:"s_295sjd"}," sidebarToggleKey"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," InjectionKey"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_13ahmt"},"()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_2ekfrt"}," =")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  Symbol"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"sidebarToggle"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," SidebarProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Disables collapsing entirely (fixed width, no built-in toggle). */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  disableCollapse"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Expanded width as a CSS length. Applied inline so apps can override it. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  width"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Collapsed width as a CSS length. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  collapsedWidth"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," SidebarItemProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row label. Used as the accessible name and the default slot fallback. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** `accesskey` attribute for a keyboard shortcut. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  accessKey"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Leading icon: a CSS class (e.g. `lucide-box`), plain text, or a component.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Ignored when the `#prefix` slot is used.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  icon"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Trailing text. Ignored when the `#suffix` slot is used. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  suffix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Navigation target. When set the row's main area renders as a router link;")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * otherwise it renders as a button. A click still invokes `onClick`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  to"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," RouteLocationRaw")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'   * Marks the row active (`data-state="active"`). When omitted, active state is')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * inferred by matching `to` against the current route.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  active"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Click handler. Bound from `@click`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  onClick"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," MouseEvent"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," SidebarLabelProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * When true, collapses to a horizontal divider while the sidebar is collapsed")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * (matches the previous `SidebarSection` label behavior).")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  divider"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," SidebarHeaderProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Workspace or app title. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Secondary line under the title, e.g. a domain or workspace slug. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  subtitle"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Leading logo: an image URL, or a component. Overridden by the `#prefix` slot. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  logo"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Whether to render the leading logo/avatar box. Defaults to `true`. Set to")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `false` when workspace identity is already shown elsewhere (e.g. a left")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * rail) to avoid a duplicate avatar; the title then sits flush-left. Best")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * paired with a non-collapsing sidebar, since a collapsed header with no logo")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * has nothing to show.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  showLogo"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Options rendered in the trigger's dropdown — the same shape `Dropdown` itself takes. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  menuItems"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    label"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    icon"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"    onClick"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Promotional or onboarding card for the sidebar footer — a trial notice, an")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},' * upgrade prompt, a "what\'s new" pointer. Stateless: `dismiss` is an event and')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * the parent owns hiding the card.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," SidebarCardProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Main heading text of the card. Optional when the `#title` slot is used */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Supporting text below the title */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  description"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Color theme of the icon and the tinted action button; the white container never changes with theme */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  theme"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," StatusTheme")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Icon next to the title: unset shows the theme's auto icon (gray shows the info glyph in black ink), `false` hides it, a `lucide-*` string or Component renders a custom theme-colored glyph */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  icon"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The full-width tinted action button (`ButtonProps` plus `onClick({ dismiss })`) */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  action"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," AlertAction")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Shows the dismiss (×) button, which emits `dismiss` */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  dismissible"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," SidebarCardEmits"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired when the user dismisses the card — the × button or the action's `context.dismiss()`. The parent owns hiding. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  dismiss"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," []")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** Scoped payload for the card's `#actions` slot. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," SidebarCardActionsSlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Emits the card's `dismiss` event. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  dismiss"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," SidebarCardSlots"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Overrides the icon area next to the title */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  prefix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Rich title content (overrides the `title` prop) */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  title"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Rich description content (overrides the `description` prop) */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  description"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Replaces the auto-rendered action button; receives `{ dismiss }` */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  actions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," SidebarCardActionsSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Building block for a collapsible group of `SidebarItem`s. Compose children")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * in the default slot — `SidebarSection` owns only the label + collapse")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * chrome, not the rows inside it.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," SidebarSectionProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Section label. Renders nothing when omitted (a label-less group). */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Whether clicking the label toggles the group's visibility. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  collapsible"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),l(b,{data:t}),n[19]||(n[19]=s("h3",{id:"sidebarlabel",tabindex:"-1"},[a("SidebarLabel "),s("a",{class:"header-anchor",href:"#sidebarlabel","aria-label":"Permalink to “SidebarLabel”"},"​")],-1)),l(m,{name:"SidebarLabel",data:o},{code:e(()=>[...n[6]||(n[6]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"Component"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," ComputedRef"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," InjectionKey"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"RouteLocationRaw"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue-router"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"AlertAction"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"../Alert"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"StatusTheme"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"../shared/statusIcon"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Read-only collapsed state, provided by `Sidebar` and consumed by")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * `SidebarItem` / `SidebarLabel` / `SidebarHeader` to shrink to icon-only.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_252irl"}," const"),s("span",{class:"s_295sjd"}," sidebarCollapsedKey"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," InjectionKey"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_euu481"},"ComputedRef"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"boolean"),s("span",{class:"s_1jjt6x"},">>"),s("span",{class:"s_2ekfrt"}," =")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  Symbol"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"sidebarCollapsed"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Toggles the sidebar's collapsed state, provided by `Sidebar` and consumed by")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * `SidebarCollapseToggle`. Kept separate from "),s("span",{class:"s_1zp9pn"},"{"),s("span",{class:"s_1v9gwm"},"@"),s("span",{class:"s_y1rh3e"},"link"),s("span",{class:"s_1cpno3"}," sidebarCollapsedKey"),s("span",{class:"s_1zp9pn"},"}"),s("span",{class:"s_1th9sy"}," so")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * existing read-only consumers need no change.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_252irl"}," const"),s("span",{class:"s_295sjd"}," sidebarToggleKey"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," InjectionKey"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_13ahmt"},"()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_2ekfrt"}," =")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  Symbol"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"sidebarToggle"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," SidebarProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Disables collapsing entirely (fixed width, no built-in toggle). */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  disableCollapse"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Expanded width as a CSS length. Applied inline so apps can override it. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  width"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Collapsed width as a CSS length. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  collapsedWidth"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," SidebarItemProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row label. Used as the accessible name and the default slot fallback. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** `accesskey` attribute for a keyboard shortcut. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  accessKey"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Leading icon: a CSS class (e.g. `lucide-box`), plain text, or a component.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Ignored when the `#prefix` slot is used.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  icon"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Trailing text. Ignored when the `#suffix` slot is used. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  suffix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Navigation target. When set the row's main area renders as a router link;")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * otherwise it renders as a button. A click still invokes `onClick`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  to"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," RouteLocationRaw")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'   * Marks the row active (`data-state="active"`). When omitted, active state is')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * inferred by matching `to` against the current route.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  active"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Click handler. Bound from `@click`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  onClick"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," MouseEvent"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," SidebarLabelProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * When true, collapses to a horizontal divider while the sidebar is collapsed")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * (matches the previous `SidebarSection` label behavior).")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  divider"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," SidebarHeaderProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Workspace or app title. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Secondary line under the title, e.g. a domain or workspace slug. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  subtitle"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Leading logo: an image URL, or a component. Overridden by the `#prefix` slot. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  logo"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Whether to render the leading logo/avatar box. Defaults to `true`. Set to")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `false` when workspace identity is already shown elsewhere (e.g. a left")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * rail) to avoid a duplicate avatar; the title then sits flush-left. Best")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * paired with a non-collapsing sidebar, since a collapsed header with no logo")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * has nothing to show.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  showLogo"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Options rendered in the trigger's dropdown — the same shape `Dropdown` itself takes. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  menuItems"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    label"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    icon"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"    onClick"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Promotional or onboarding card for the sidebar footer — a trial notice, an")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},' * upgrade prompt, a "what\'s new" pointer. Stateless: `dismiss` is an event and')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * the parent owns hiding the card.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," SidebarCardProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Main heading text of the card. Optional when the `#title` slot is used */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Supporting text below the title */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  description"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Color theme of the icon and the tinted action button; the white container never changes with theme */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  theme"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," StatusTheme")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Icon next to the title: unset shows the theme's auto icon (gray shows the info glyph in black ink), `false` hides it, a `lucide-*` string or Component renders a custom theme-colored glyph */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  icon"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The full-width tinted action button (`ButtonProps` plus `onClick({ dismiss })`) */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  action"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," AlertAction")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Shows the dismiss (×) button, which emits `dismiss` */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  dismissible"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," SidebarCardEmits"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired when the user dismisses the card — the × button or the action's `context.dismiss()`. The parent owns hiding. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  dismiss"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," []")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** Scoped payload for the card's `#actions` slot. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," SidebarCardActionsSlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Emits the card's `dismiss` event. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  dismiss"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," SidebarCardSlots"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Overrides the icon area next to the title */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  prefix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Rich title content (overrides the `title` prop) */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  title"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Rich description content (overrides the `description` prop) */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  description"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Replaces the auto-rendered action button; receives `{ dismiss }` */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  actions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," SidebarCardActionsSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Building block for a collapsible group of `SidebarItem`s. Compose children")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * in the default slot — `SidebarSection` owns only the label + collapse")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * chrome, not the rows inside it.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," SidebarSectionProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Section label. Renders nothing when omitted (a label-less group). */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Whether clicking the label toggles the group's visibility. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  collapsible"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),l(b,{data:r}),n[20]||(n[20]=s("h3",{id:"sidebarheader-1",tabindex:"-1"},[a("SidebarHeader "),s("a",{class:"header-anchor",href:"#sidebarheader-1","aria-label":"Permalink to “SidebarHeader”"},"​")],-1)),l(m,{name:"SidebarHeader",data:y},{code:e(()=>[...n[7]||(n[7]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"Component"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," ComputedRef"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," InjectionKey"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"RouteLocationRaw"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue-router"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"AlertAction"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"../Alert"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"StatusTheme"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"../shared/statusIcon"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Read-only collapsed state, provided by `Sidebar` and consumed by")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * `SidebarItem` / `SidebarLabel` / `SidebarHeader` to shrink to icon-only.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_252irl"}," const"),s("span",{class:"s_295sjd"}," sidebarCollapsedKey"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," InjectionKey"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_euu481"},"ComputedRef"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"boolean"),s("span",{class:"s_1jjt6x"},">>"),s("span",{class:"s_2ekfrt"}," =")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  Symbol"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"sidebarCollapsed"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Toggles the sidebar's collapsed state, provided by `Sidebar` and consumed by")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * `SidebarCollapseToggle`. Kept separate from "),s("span",{class:"s_1zp9pn"},"{"),s("span",{class:"s_1v9gwm"},"@"),s("span",{class:"s_y1rh3e"},"link"),s("span",{class:"s_1cpno3"}," sidebarCollapsedKey"),s("span",{class:"s_1zp9pn"},"}"),s("span",{class:"s_1th9sy"}," so")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * existing read-only consumers need no change.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_252irl"}," const"),s("span",{class:"s_295sjd"}," sidebarToggleKey"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," InjectionKey"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_13ahmt"},"()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_2ekfrt"}," =")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  Symbol"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"sidebarToggle"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," SidebarProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Disables collapsing entirely (fixed width, no built-in toggle). */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  disableCollapse"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Expanded width as a CSS length. Applied inline so apps can override it. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  width"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Collapsed width as a CSS length. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  collapsedWidth"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," SidebarItemProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row label. Used as the accessible name and the default slot fallback. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** `accesskey` attribute for a keyboard shortcut. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  accessKey"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Leading icon: a CSS class (e.g. `lucide-box`), plain text, or a component.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Ignored when the `#prefix` slot is used.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  icon"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Trailing text. Ignored when the `#suffix` slot is used. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  suffix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Navigation target. When set the row's main area renders as a router link;")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * otherwise it renders as a button. A click still invokes `onClick`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  to"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," RouteLocationRaw")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'   * Marks the row active (`data-state="active"`). When omitted, active state is')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * inferred by matching `to` against the current route.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  active"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Click handler. Bound from `@click`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  onClick"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," MouseEvent"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," SidebarLabelProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * When true, collapses to a horizontal divider while the sidebar is collapsed")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * (matches the previous `SidebarSection` label behavior).")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  divider"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," SidebarHeaderProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Workspace or app title. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Secondary line under the title, e.g. a domain or workspace slug. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  subtitle"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Leading logo: an image URL, or a component. Overridden by the `#prefix` slot. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  logo"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Whether to render the leading logo/avatar box. Defaults to `true`. Set to")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `false` when workspace identity is already shown elsewhere (e.g. a left")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * rail) to avoid a duplicate avatar; the title then sits flush-left. Best")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * paired with a non-collapsing sidebar, since a collapsed header with no logo")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * has nothing to show.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  showLogo"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Options rendered in the trigger's dropdown — the same shape `Dropdown` itself takes. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  menuItems"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    label"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    icon"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"    onClick"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Promotional or onboarding card for the sidebar footer — a trial notice, an")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},' * upgrade prompt, a "what\'s new" pointer. Stateless: `dismiss` is an event and')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * the parent owns hiding the card.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," SidebarCardProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Main heading text of the card. Optional when the `#title` slot is used */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Supporting text below the title */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  description"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Color theme of the icon and the tinted action button; the white container never changes with theme */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  theme"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," StatusTheme")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Icon next to the title: unset shows the theme's auto icon (gray shows the info glyph in black ink), `false` hides it, a `lucide-*` string or Component renders a custom theme-colored glyph */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  icon"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The full-width tinted action button (`ButtonProps` plus `onClick({ dismiss })`) */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  action"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," AlertAction")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Shows the dismiss (×) button, which emits `dismiss` */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  dismissible"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," SidebarCardEmits"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired when the user dismisses the card — the × button or the action's `context.dismiss()`. The parent owns hiding. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  dismiss"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," []")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** Scoped payload for the card's `#actions` slot. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," SidebarCardActionsSlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Emits the card's `dismiss` event. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  dismiss"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," SidebarCardSlots"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Overrides the icon area next to the title */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  prefix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Rich title content (overrides the `title` prop) */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  title"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Rich description content (overrides the `description` prop) */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  description"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Replaces the auto-rendered action button; receives `{ dismiss }` */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  actions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," SidebarCardActionsSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Building block for a collapsible group of `SidebarItem`s. Compose children")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * in the default slot — `SidebarSection` owns only the label + collapse")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * chrome, not the rows inside it.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," SidebarSectionProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Section label. Renders nothing when omitted (a label-less group). */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Whether clicking the label toggles the group's visibility. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  collapsible"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),l(b,{data:q}),n[21]||(n[21]=s("h3",{id:"sidebarsection-1",tabindex:"-1"},[a("SidebarSection "),s("a",{class:"header-anchor",href:"#sidebarsection-1","aria-label":"Permalink to “SidebarSection”"},"​")],-1)),l(m,{name:"SidebarSection",data:W},{code:e(()=>[...n[8]||(n[8]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"Component"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," ComputedRef"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," InjectionKey"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"RouteLocationRaw"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue-router"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"AlertAction"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"../Alert"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"StatusTheme"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"../shared/statusIcon"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Read-only collapsed state, provided by `Sidebar` and consumed by")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * `SidebarItem` / `SidebarLabel` / `SidebarHeader` to shrink to icon-only.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_252irl"}," const"),s("span",{class:"s_295sjd"}," sidebarCollapsedKey"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," InjectionKey"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_euu481"},"ComputedRef"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"boolean"),s("span",{class:"s_1jjt6x"},">>"),s("span",{class:"s_2ekfrt"}," =")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  Symbol"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"sidebarCollapsed"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Toggles the sidebar's collapsed state, provided by `Sidebar` and consumed by")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * `SidebarCollapseToggle`. Kept separate from "),s("span",{class:"s_1zp9pn"},"{"),s("span",{class:"s_1v9gwm"},"@"),s("span",{class:"s_y1rh3e"},"link"),s("span",{class:"s_1cpno3"}," sidebarCollapsedKey"),s("span",{class:"s_1zp9pn"},"}"),s("span",{class:"s_1th9sy"}," so")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * existing read-only consumers need no change.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_252irl"}," const"),s("span",{class:"s_295sjd"}," sidebarToggleKey"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," InjectionKey"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_13ahmt"},"()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_2ekfrt"}," =")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  Symbol"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"sidebarToggle"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," SidebarProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Disables collapsing entirely (fixed width, no built-in toggle). */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  disableCollapse"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Expanded width as a CSS length. Applied inline so apps can override it. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  width"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Collapsed width as a CSS length. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  collapsedWidth"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," SidebarItemProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row label. Used as the accessible name and the default slot fallback. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** `accesskey` attribute for a keyboard shortcut. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  accessKey"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Leading icon: a CSS class (e.g. `lucide-box`), plain text, or a component.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Ignored when the `#prefix` slot is used.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  icon"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Trailing text. Ignored when the `#suffix` slot is used. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  suffix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Navigation target. When set the row's main area renders as a router link;")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * otherwise it renders as a button. A click still invokes `onClick`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  to"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," RouteLocationRaw")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'   * Marks the row active (`data-state="active"`). When omitted, active state is')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * inferred by matching `to` against the current route.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  active"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Click handler. Bound from `@click`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  onClick"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," MouseEvent"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," SidebarLabelProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * When true, collapses to a horizontal divider while the sidebar is collapsed")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * (matches the previous `SidebarSection` label behavior).")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  divider"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," SidebarHeaderProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Workspace or app title. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Secondary line under the title, e.g. a domain or workspace slug. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  subtitle"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Leading logo: an image URL, or a component. Overridden by the `#prefix` slot. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  logo"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Whether to render the leading logo/avatar box. Defaults to `true`. Set to")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `false` when workspace identity is already shown elsewhere (e.g. a left")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * rail) to avoid a duplicate avatar; the title then sits flush-left. Best")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * paired with a non-collapsing sidebar, since a collapsed header with no logo")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * has nothing to show.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  showLogo"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Options rendered in the trigger's dropdown — the same shape `Dropdown` itself takes. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  menuItems"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    label"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    icon"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"    onClick"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Promotional or onboarding card for the sidebar footer — a trial notice, an")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},' * upgrade prompt, a "what\'s new" pointer. Stateless: `dismiss` is an event and')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * the parent owns hiding the card.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," SidebarCardProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Main heading text of the card. Optional when the `#title` slot is used */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Supporting text below the title */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  description"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Color theme of the icon and the tinted action button; the white container never changes with theme */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  theme"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," StatusTheme")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Icon next to the title: unset shows the theme's auto icon (gray shows the info glyph in black ink), `false` hides it, a `lucide-*` string or Component renders a custom theme-colored glyph */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  icon"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The full-width tinted action button (`ButtonProps` plus `onClick({ dismiss })`) */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  action"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," AlertAction")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Shows the dismiss (×) button, which emits `dismiss` */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  dismissible"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," SidebarCardEmits"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired when the user dismisses the card — the × button or the action's `context.dismiss()`. The parent owns hiding. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  dismiss"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," []")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** Scoped payload for the card's `#actions` slot. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," SidebarCardActionsSlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Emits the card's `dismiss` event. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  dismiss"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," SidebarCardSlots"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Overrides the icon area next to the title */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  prefix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Rich title content (overrides the `title` prop) */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  title"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Rich description content (overrides the `description` prop) */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  description"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Replaces the auto-rendered action button; receives `{ dismiss }` */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  actions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," SidebarCardActionsSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Building block for a collapsible group of `SidebarItem`s. Compose children")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * in the default slot — `SidebarSection` owns only the label + collapse")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * chrome, not the rows inside it.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," SidebarSectionProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Section label. Renders nothing when omitted (a label-less group). */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Whether clicking the label toggles the group's visibility. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  collapsible"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),l(b,{data:K}),l(x,{data:B}),n[22]||(n[22]=s("h3",{id:"sidebarcard-1",tabindex:"-1"},[a("SidebarCard "),s("a",{class:"header-anchor",href:"#sidebarcard-1","aria-label":"Permalink to “SidebarCard”"},"​")],-1)),l(m,{name:"SidebarCard",data:D},{code:e(()=>[...n[9]||(n[9]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"Component"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," ComputedRef"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," InjectionKey"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"RouteLocationRaw"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue-router"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"AlertAction"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"../Alert"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"StatusTheme"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"../shared/statusIcon"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Read-only collapsed state, provided by `Sidebar` and consumed by")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * `SidebarItem` / `SidebarLabel` / `SidebarHeader` to shrink to icon-only.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_252irl"}," const"),s("span",{class:"s_295sjd"}," sidebarCollapsedKey"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," InjectionKey"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_euu481"},"ComputedRef"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"boolean"),s("span",{class:"s_1jjt6x"},">>"),s("span",{class:"s_2ekfrt"}," =")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  Symbol"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"sidebarCollapsed"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Toggles the sidebar's collapsed state, provided by `Sidebar` and consumed by")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * `SidebarCollapseToggle`. Kept separate from "),s("span",{class:"s_1zp9pn"},"{"),s("span",{class:"s_1v9gwm"},"@"),s("span",{class:"s_y1rh3e"},"link"),s("span",{class:"s_1cpno3"}," sidebarCollapsedKey"),s("span",{class:"s_1zp9pn"},"}"),s("span",{class:"s_1th9sy"}," so")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * existing read-only consumers need no change.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_252irl"}," const"),s("span",{class:"s_295sjd"}," sidebarToggleKey"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," InjectionKey"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_13ahmt"},"()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void"),s("span",{class:"s_1jjt6x"},">"),s("span",{class:"s_2ekfrt"}," =")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  Symbol"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"sidebarToggle"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," SidebarProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Disables collapsing entirely (fixed width, no built-in toggle). */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  disableCollapse"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Expanded width as a CSS length. Applied inline so apps can override it. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  width"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Collapsed width as a CSS length. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  collapsedWidth"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," SidebarItemProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Row label. Used as the accessible name and the default slot fallback. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** `accesskey` attribute for a keyboard shortcut. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  accessKey"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Leading icon: a CSS class (e.g. `lucide-box`), plain text, or a component.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Ignored when the `#prefix` slot is used.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  icon"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Trailing text. Ignored when the `#suffix` slot is used. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  suffix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Navigation target. When set the row's main area renders as a router link;")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * otherwise it renders as a button. A click still invokes `onClick`.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  to"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," RouteLocationRaw")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},'   * Marks the row active (`data-state="active"`). When omitted, active state is')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * inferred by matching `to` against the current route.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  active"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Click handler. Bound from `@click`. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  onClick"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," MouseEvent"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," SidebarLabelProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * When true, collapses to a horizontal divider while the sidebar is collapsed")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * (matches the previous `SidebarSection` label behavior).")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  divider"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," SidebarHeaderProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Workspace or app title. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Secondary line under the title, e.g. a domain or workspace slug. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  subtitle"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Leading logo: an image URL, or a component. Overridden by the `#prefix` slot. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  logo"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Whether to render the leading logo/avatar box. Defaults to `true`. Set to")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `false` when workspace identity is already shown elsewhere (e.g. a left")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * rail) to avoid a duplicate avatar; the title then sits flush-left. Best")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * paired with a non-collapsing sidebar, since a collapsed header with no logo")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * has nothing to show.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  showLogo"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Options rendered in the trigger's dropdown — the same shape `Dropdown` itself takes. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  menuItems"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    label"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    icon"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"    onClick"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Promotional or onboarding card for the sidebar footer — a trial notice, an")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},' * upgrade prompt, a "what\'s new" pointer. Stateless: `dismiss` is an event and')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * the parent owns hiding the card.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," SidebarCardProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Main heading text of the card. Optional when the `#title` slot is used */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Supporting text below the title */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  description"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Color theme of the icon and the tinted action button; the white container never changes with theme */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  theme"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," StatusTheme")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Icon next to the title: unset shows the theme's auto icon (gray shows the info glyph in black ink), `false` hides it, a `lucide-*` string or Component renders a custom theme-colored glyph */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  icon"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** The full-width tinted action button (`ButtonProps` plus `onClick({ dismiss })`) */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  action"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," AlertAction")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Shows the dismiss (×) button, which emits `dismiss` */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  dismissible"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," SidebarCardEmits"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired when the user dismisses the card — the × button or the action's `context.dismiss()`. The parent owns hiding. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  dismiss"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," []")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/** Scoped payload for the card's `#actions` slot. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," SidebarCardActionsSlotProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Emits the card's `dismiss` event. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  dismiss"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," SidebarCardSlots"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Overrides the icon area next to the title */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  prefix"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Rich title content (overrides the `title` prop) */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  title"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Rich description content (overrides the `description` prop) */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  description"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Replaces the auto-rendered action button; receives `{ dismiss }` */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  actions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"props"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," SidebarCardActionsSlotProps"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * Building block for a collapsible group of `SidebarItem`s. Compose children")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * in the default slot — `SidebarSection` owns only the label + collapse")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * chrome, not the rows inside it.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," SidebarSectionProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Section label. Renders nothing when omitted (a label-less group). */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Whether clicking the label toggles the group's visibility. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  collapsible"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),l(b,{data:O}),l(x,{data:E})])}}});export{js as __pageData,xs as default};
