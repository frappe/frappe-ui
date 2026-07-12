import{_ as j}from"./chunks/PropsTable.CaBa_nKX.js";import{_ as b}from"./chunks/SlotsTable.cxZkCWLH.js";import{_ as T}from"./chunks/EmitsTable.DBSzqU_u.js";import{aJ as x,aK as P,aL as I,bp as D,bq as M,q as z,aq as g}from"./chunks/theme.Bbh7Af2Q.js";import{J as v,ad as r,r as d,D as l,aE as t,bg as p,o as s,B as a,F as L,am as R,aj as m,q as k,au as S,a2 as W,ao as B,A as C}from"./chunks/framework.CWIjRn0F.js";const O={class:"flex h-[420px] w-fit overflow-hidden rounded-md border"},E=v({__name:"Legacy",setup(y){const _={title:"Frappe CRM",subtitle:"crm.frappe.io",menuItems:[{label:"Settings"},{label:"Log out"}]},o=[{label:"",items:[{label:"Leads",to:"/leads",icon:"lucide-user-plus"},{label:"Deals",to:"/deals",icon:"lucide-handshake"},{label:"Contacts",to:"/contacts",icon:"lucide-contact"}]},{label:"Views",collapsible:!0,items:[{label:"My Open Deals",to:"/my-open-deals",icon:"lucide-flame"},{label:"Unassigned",to:"/unassigned",icon:"lucide-circle-dashed"}]}];return(h,w)=>(r(),d("div",O,[l(t(x),{header:_,sections:o,"disable-collapse":""})]))}}),H={class:"flex h-[360px] w-fit overflow-hidden rounded-md border"},N={class:"flex-1 overflow-y-auto px-2 pt-2"},$={class:"mt-auto px-2 pb-2"},U=v({__name:"Collapsed",setup(y){const _=m(!0),o=m("inbox"),h=[{id:"inbox",label:"Inbox",icon:"lucide-inbox"},{id:"starred",label:"Starred",icon:"lucide-star"},{id:"sent",label:"Sent",icon:"lucide-send"}];return(w,i)=>(r(),d("div",H,[l(t(x),{collapsed:_.value,"onUpdate:collapsed":i[0]||(i[0]=e=>_.value=e)},{default:p(()=>[s("div",N,[l(t(P),{divider:""},{default:p(()=>[...i[1]||(i[1]=[a("Mail",-1)])]),_:1}),(r(),d(L,null,R(h,e=>l(t(I),{key:e.id,icon:e.icon,label:e.label,active:o.value===e.id,onClick:c=>o.value=e.id},null,8,["icon","label","active","onClick"])),64))]),s("div",$,[l(t(D))])]),_:1},8,["collapsed"])]))}}),G={class:"flex h-[560px] w-fit overflow-hidden rounded-md border"},F={class:"flex h-7 items-center justify-between"},V={class:"flex items-center"},J={class:"mt-0.5 space-y-0.5"},Q={class:"flex-1 inline-flex items-center gap-1 truncate text-sm"},X={key:0,class:"lucide-lock size-3 shrink-0 text-ink-gray-5"},Y={class:"relative mr-1 flex size-7 shrink-0 items-center justify-end"},Z={key:0,class:"absolute right-1 text-xs text-ink-gray-5 transition-opacity group-hover/sidebar-item:opacity-0 group-focus-within/sidebar-item:opacity-0"},ss=v({__name:"Default",setup(y){const _=m("product"),o=m("Recent activity"),h=[{id:"product",title:"Product",icon:"lucide-rocket",unread:0,private:!1},{id:"design",title:"Design",icon:"lucide-palette",unread:3,private:!1},{id:"engineering",title:"Engineering",icon:"lucide-code",unread:12,private:!1},{id:"marketing",title:"Marketing",icon:"lucide-megaphone",unread:0,private:!1},{id:"sales",title:"Sales",icon:"lucide-trending-up",unread:1,private:!1},{id:"support",title:"Customer Support",icon:"lucide-headphones",unread:0,private:!1},{id:"people",title:"People & Culture",icon:"lucide-users",unread:0,private:!1},{id:"finance",title:"Finance",icon:"lucide-wallet",unread:0,private:!0},{id:"leadership",title:"Leadership",icon:"lucide-crown",unread:2,private:!0},{id:"design-system",title:"Design System",icon:"lucide-component",unread:0,private:!1},{id:"research",title:"User Research",icon:"lucide-microscope",unread:5,private:!1},{id:"ops",title:"Operations",icon:"lucide-settings-2",unread:0,private:!1},{id:"events",title:"Events",icon:"lucide-party-popper",unread:0,private:!1},{id:"data",title:"Data & Analytics",icon:"lucide-database",unread:8,private:!1},{id:"brand",title:"Brand",icon:"lucide-sparkles",unread:0,private:!1},{id:"partnerships",title:"Partnerships",icon:"lucide-handshake",unread:0,private:!1},{id:"security",title:"Security",icon:"lucide-shield",unread:0,private:!0},{id:"onboarding",title:"Onboarding",icon:"lucide-graduation-cap",unread:0,private:!1},{id:"random",title:"Random",icon:"lucide-shuffle",unread:0,private:!1}],w=[{group:"Sort by",options:["Recent activity","Alphabetical"].map(i=>({label:i,icon:o.value===i?"lucide-check":null,onClick:()=>o.value=i}))}];return(i,e)=>(r(),d("div",G,[l(t(x),{"disable-collapse":"",width:"14rem"},{default:p(()=>[e[1]||(e[1]=s("div",{class:"flex shrink-0 items-center p-2"},[s("button",{class:"flex h-8 w-full items-center gap-2 rounded px-1 transition hover:bg-surface-gray-2"},[s("div",{class:"grid size-6 shrink-0 place-items-center rounded bg-surface-gray-7 text-xs font-medium text-ink-white"}," F "),s("span",{class:"flex-1 truncate text-left text-base text-ink-gray-8"},"Frappe"),s("span",{class:"lucide-chevrons-up-down size-4 shrink-0 text-ink-gray-5"})])],-1)),l(t(M),{class:"min-h-0 flex-1","viewport-class":"px-2 pt-0.5 pb-10"},{default:p(()=>[s("div",F,[l(t(P),null,{default:p(()=>[...e[0]||(e[0]=[a("Spaces",-1)])]),_:1}),s("div",V,[l(t(z),{options:w,align:"end"},{trigger:p(({open:c})=>[l(t(g),{variant:"ghost",size:"sm",icon:"lucide-arrow-up-down text-ink-gray-5",label:"Sort spaces",tooltip:"Sort spaces",active:c},null,8,["active"])]),_:1}),l(t(g),{variant:"ghost",size:"sm",icon:"lucide-plus text-ink-gray-5",label:"New space"})])]),s("nav",J,[(r(),d(L,null,R(h,c=>l(t(I),{key:c.id,icon:c.icon,active:_.value===c.id,onClick:u=>_.value=c.id},{suffix:p(()=>[s("div",Y,[c.unread>0?(r(),d("span",Z,S(c.unread),1)):k("",!0),l(t(z),{options:[{label:"Mark all as read"},{label:"Leave space"}],align:"start",side:"right"},{default:p(({open:u})=>[l(t(g),{variant:u?"subtle":"ghost",size:"xs",icon:"lucide-more-horizontal text-ink-gray-5",label:`${c.title} options`,class:W(["absolute right-0 -mr-0.5 opacity-0 group-hover/sidebar-item:opacity-100 group-focus-within/sidebar-item:opacity-100",u?"opacity-100":""])},null,8,["variant","label","class"])]),_:2},1024)])]),default:p(()=>[s("span",Q,[c.private?(r(),d("span",X)):k("",!0),a(" "+S(c.title),1)])]),_:2},1032,["icon","active","onClick"])),64))])]),_:1})]),_:1})]))}}),is=JSON.parse('{"title":"Sidebar","description":"","frontmatter":{},"headers":[],"relativePath":"docs/components/sidebar.md","filePath":"docs/components/sidebar.md","lastUpdated":1779053387000}'),as={name:"docs/components/sidebar.md"},_s=Object.assign(as,{setup(y){const _=[{name:"header",description:"",required:!1,type:"SidebarHeaderProps",deprecated:`Config-object header. Prefer composing your own header in the
default slot. Kept for one release for backward compatibility.`},{name:"sections",description:"",required:!1,type:"SidebarSectionProps[]",deprecated:"Config-object sections. Prefer composing `SidebarLabel` +\n`SidebarItem` in the default slot. Kept for one release."},{name:"disableCollapse",description:"Disables collapsing entirely (fixed width, no built-in toggle).",required:!1,type:"boolean"},{name:"width",description:"Expanded width as a CSS length. Applied inline so apps can override it.",required:!1,type:"string",default:'"15rem"'},{name:"collapsedWidth",description:"Collapsed width as a CSS length.",required:!1,type:"string",default:'"3rem"'},{name:"collapsed",description:"",required:!1,type:"boolean | null",default:"null"}],o=[{name:"default",description:"",type:"{}"},{name:"header-logo",description:"",type:"{}"},{name:"footer-items",description:"",type:"{}"}],h=[{name:"update:collapsed",description:"Fired when the collapsed changes.",type:"[value: boolean | null]"}],w=[{name:"label",description:"Row label. Used as the accessible name and the default slot fallback.",required:!1,type:"string"},{name:"accessKey",description:"`accesskey` attribute for a keyboard shortcut.",required:!1,type:"string"},{name:"icon",description:"Leading icon: a CSS class (e.g. `lucide-box`), plain text, or a component.\nIgnored when the `#prefix` slot is used.",required:!1,type:"string | Component"},{name:"suffix",description:"Trailing text. Ignored when the `#suffix` slot is used.",required:!1,type:"string"},{name:"to",description:"Navigation target. When set the row's main area renders as a router link;\notherwise it renders as a button. A click still invokes `onClick`.",required:!1,type:"string | kt | Tt"},{name:"active",description:'Marks the row active (`data-state="active"`). When omitted, active state is\ninferred by matching `to` against the current route.',required:!1,type:"boolean"},{name:"isActive",description:"",required:!1,type:"boolean",deprecated:"Use `active`. Alias kept for the config-object path."},{name:"onClick",description:"Click handler. Bound from `@click` in composition and from `item.onClick`\nin the config-object path — both resolve to this prop.",required:!1,type:"((event: MouseEvent) => void)"},{name:"condition",description:"",required:!1,type:"MaybeRefOrGetter<boolean>",deprecated:"Config-object visibility flag; filtered by the legacy adapter."}],i=[{name:"prefix",description:"",type:"{}"},{name:"default",description:"",type:"{}"},{name:"suffix",description:"",type:"{}"}],e=[{name:"divider",description:"When true, collapses to a horizontal divider while the sidebar is collapsed\n(matches the previous `SidebarSection` label behavior).",required:!1,type:"boolean"}],c=[{name:"default",description:"",type:"{}"}],u=[{name:"title",description:"",required:!0,type:"string"},{name:"subtitle",description:"",required:!1,type:"string"},{name:"logo",description:"",required:!1,type:"string | Component"},{name:"showLogo",description:"Whether to render the leading logo/avatar box. Defaults to `true`. Set to\n`false` when workspace identity is already shown elsewhere (e.g. a left\nrail) to avoid a duplicate avatar; the title then sits flush-left. Best\npaired with a non-collapsing sidebar, since a collapsed header with no logo\nhas nothing to show.",required:!1,type:"boolean",default:"true"},{name:"menuItems",description:"",required:!1,type:"{ label: string; icon?: string | Component; onClick?: (() => void) | undefined; }[] | undefined"}],q=[{name:"logo",description:"",type:"{}"}],K=[{name:"label",description:"",required:!1,type:"string"},{name:"items",description:"",required:!0,type:"SidebarItemProps[]"},{name:"collapsible",description:"",required:!1,type:"boolean"}],A=[{name:"sidebar-item",description:"",type:"{ item: SidebarItemProps; isCollapsed: boolean; }"}];return(ns,n)=>{const f=B("ComponentPreview");return r(),d("div",null,[n[8]||(n[8]=s("h1",{id:"sidebar",tabindex:"-1"},[a("Sidebar "),s("a",{class:"header-anchor",href:"#sidebar","aria-label":"Permalink to “Sidebar”"},"​")],-1)),n[9]||(n[9]=s("p",null,[a("The wide navigation panel of an app shell. "),s("code",null,"Sidebar"),a(" is a bare frame — a fixed-width column with the collapse machinery and a single slot — and you compose the body from "),s("code",null,"SidebarItem"),a(", "),s("code",null,"SidebarLabel"),a(", and your own markup. The app owns its header, scroll region, and empty state; lay them out with plain flex utilities.")],-1)),l(f,{name:"Sidebar-Default"},{code:p(()=>[...n[0]||(n[0]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"flex h-[560px] w-fit overflow-hidden rounded-md border"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_wac0bt"},"Sidebar"),s("span",{class:"s_1i4ay4"}," disable-collapse"),s("span",{class:"s_1i4ay4"}," width"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"14rem"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"      <!-- App switcher — the app owns the header. -->")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"flex shrink-0 items-center p-2"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"button")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"flex h-8 w-full items-center gap-2 rounded px-1 transition hover:bg-surface-gray-2"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"div")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"            class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"grid size-6 shrink-0 place-items-center rounded bg-surface-gray-7 text-xs font-medium text-ink-white"),s("span",{class:"s_w1p9wo"},'"')]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:p(()=>[l(ss)]),_:1}),n[10]||(n[10]=C('<p>There are no layout slots and no built-in scrolling in composition mode. Put a header as a direct child, wrap the middle list in your own <code>overflow-y-auto</code> container, and push a footer down with <code>mt-auto</code>.</p><h2 id="collapse" tabindex="-1">Collapse <a class="header-anchor" href="#collapse" aria-label="Permalink to “Collapse”">​</a></h2><p><code>Sidebar</code> owns collapse. Bind <code>v-model:collapsed</code> to control it, or leave it unset to collapse automatically below the <code>sm</code> breakpoint. <code>disableCollapse</code> pins it open. Width comes from the <code>width</code> / <code>collapsedWidth</code> props (CSS lengths, applied inline so an app can override them). Drop a <code>SidebarCollapseToggle</code> anywhere inside to flip the state; <code>SidebarLabel divider</code> turns a section label into a divider line while collapsed.</p>',3)),l(f,{name:"Sidebar-Collapsed"},{code:p(()=>[...n[1]||(n[1]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"flex h-[360px] w-fit overflow-hidden rounded-md border"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:p(()=>[l(U)]),_:1}),n[11]||(n[11]=C('<h2 id="sidebaritem" tabindex="-1">SidebarItem <a class="header-anchor" href="#sidebaritem" aria-label="Permalink to “SidebarItem”">​</a></h2><p>A single row. It renders a container with a navigable main area and a <strong>sibling</strong> trailing zone, so an options menu in <code>#suffix</code> isn&#39;t nested inside the link (which anchors and buttons disallow).</p><ul><li><code>#prefix</code> — a leading icon or avatar (falls back to the <code>icon</code> prop: a lucide class, text, or a component).</li><li>default slot — the label region (falls back to the <code>label</code> prop). Put inline adornments like a lock icon here next to the text.</li><li><code>#suffix</code> — the trailing zone: an unread count, an options <code>…</code> menu, etc.</li></ul><p>Set <code>to</code> to render a router link; omit it for a button. <code>active</code> drives <code>data-state</code>; when omitted it&#39;s inferred by matching <code>to</code> against the current route. A click invokes <code>onClick</code> (bound from <code>@click</code>) in both cases.</p><h2 id="legacy-config-api" tabindex="-1">Legacy config API <a class="header-anchor" href="#legacy-config-api" aria-label="Permalink to “Legacy config API”">​</a></h2><div class="warning custom-block"><p class="custom-block-title">Deprecated</p><p>The config-object API (<code>:header</code> and <code>:sections=&quot;[{ items }]&quot;</code>) still works for one release, reimplemented on top of the new sub-components. Prefer the composition API above for new code.</p></div>',6)),l(f,{name:"Sidebar-Legacy"},{code:p(()=>[...n[2]||(n[2]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// The deprecated config-object API, kept working for one release on top of the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"// new sub-components. Prefer the composition API (see Default) for new code.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"Sidebar"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," header"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"  title"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Frappe CRM"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"  subtitle"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"crm.frappe.io"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"  menuItems"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_13ahmt"}," [{"),s("span",{class:"s_r4oegk"}," label"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Settings"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_13ahmt"}," {"),s("span",{class:"s_r4oegk"}," label"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Log out"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }]"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," sections"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," [")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    label"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," ''"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    items"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_13ahmt"}," [")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"      {"),s("span",{class:"s_r4oegk"}," label"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Leads"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," to"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"/leads"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," icon"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-user-plus"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"      {"),s("span",{class:"s_r4oegk"}," label"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Deals"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," to"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"/deals"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," icon"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-handshake"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"      {"),s("span",{class:"s_r4oegk"}," label"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Contacts"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," to"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"/contacts"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," icon"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-contact"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"    ]"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    label"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Views"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    collapsible"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_40mev6"}," true"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_r4oegk"},"    items"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_13ahmt"}," [")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"      {"),s("span",{class:"s_r4oegk"}," label"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"My Open Deals"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," to"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"/my-open-deals"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," icon"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-flame"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"      {"),s("span",{class:"s_r4oegk"}," label"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Unassigned"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," to"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"/unassigned"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_r4oegk"}," icon"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"lucide-circle-dashed"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"    ]"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"flex h-[420px] w-fit overflow-hidden rounded-md border"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_wac0bt"},"Sidebar"),s("span",{class:"s_1i4ay4"}," :header"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"header"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1i4ay4"}," :sections"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"sections"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1i4ay4"}," disable-collapse"),s("span",{class:"s_1zd9e2"}," />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:p(()=>[l(E)]),_:1}),n[12]||(n[12]=s("h2",{id:"api-reference",tabindex:"-1"},[a("API Reference "),s("a",{class:"header-anchor",href:"#api-reference","aria-label":"Permalink to “API Reference”"},"​")],-1)),n[13]||(n[13]=s("h3",{id:"sidebar-1",tabindex:"-1"},[a("Sidebar "),s("a",{class:"header-anchor",href:"#sidebar-1","aria-label":"Permalink to “Sidebar”"},"​")],-1)),l(j,{name:"Sidebar",data:_},{code:p(()=>[...n[3]||(n[3]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  Component"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  ComputedRef"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  InjectionKey"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  MaybeRefOrGetter"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"RouteLocationRaw"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue-router"),s("span",{class:"s_w1p9wo"},"'")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Config-object header. Prefer composing your own header in the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * default slot. Kept for one release for backward compatibility.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  header"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," SidebarHeaderProps")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Config-object sections. Prefer composing `SidebarLabel` +")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `SidebarItem` in the default slot. Kept for one release.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  sections"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," SidebarSectionProps"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"}),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `active`. Alias kept for the config-object path. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  isActive"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Click handler. Bound from `@click` in composition and from `item.onClick`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * in the config-object path — both resolve to this prop.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  onClick"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," MouseEvent"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Config-object visibility flag; filtered by the legacy adapter. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  condition"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," MaybeRefOrGetter"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"boolean"),s("span",{class:"s_1jjt6x"},">")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  subtitle"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  logo"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Whether to render the leading logo/avatar box. Defaults to `true`. Set to")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `false` when workspace identity is already shown elsewhere (e.g. a left")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * rail) to avoid a duplicate avatar; the title then sits flush-left. Best")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * paired with a non-collapsing sidebar, since a collapsed header with no logo")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * has nothing to show.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  showLogo"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  menuItems"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    label"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    icon"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"    onClick"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Legacy config-object section shape. Rendered by the internal")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * `SidebarSection` adapter for `Sidebar`'s `sections` prop. New code composes")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * `SidebarLabel` + `SidebarItem` directly.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," SidebarSectionProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  items"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," SidebarItemProps"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  collapsible"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),l(b,{data:o}),l(T,{data:h}),n[14]||(n[14]=s("h3",{id:"sidebaritem-1",tabindex:"-1"},[a("SidebarItem "),s("a",{class:"header-anchor",href:"#sidebaritem-1","aria-label":"Permalink to “SidebarItem”"},"​")],-1)),l(j,{name:"SidebarItem",data:w},{code:p(()=>[...n[4]||(n[4]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  Component"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  ComputedRef"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  InjectionKey"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  MaybeRefOrGetter"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"RouteLocationRaw"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue-router"),s("span",{class:"s_w1p9wo"},"'")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Config-object header. Prefer composing your own header in the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * default slot. Kept for one release for backward compatibility.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  header"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," SidebarHeaderProps")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Config-object sections. Prefer composing `SidebarLabel` +")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `SidebarItem` in the default slot. Kept for one release.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  sections"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," SidebarSectionProps"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"}),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `active`. Alias kept for the config-object path. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  isActive"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Click handler. Bound from `@click` in composition and from `item.onClick`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * in the config-object path — both resolve to this prop.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  onClick"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," MouseEvent"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Config-object visibility flag; filtered by the legacy adapter. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  condition"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," MaybeRefOrGetter"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"boolean"),s("span",{class:"s_1jjt6x"},">")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  subtitle"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  logo"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Whether to render the leading logo/avatar box. Defaults to `true`. Set to")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `false` when workspace identity is already shown elsewhere (e.g. a left")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * rail) to avoid a duplicate avatar; the title then sits flush-left. Best")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * paired with a non-collapsing sidebar, since a collapsed header with no logo")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * has nothing to show.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  showLogo"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  menuItems"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    label"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    icon"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"    onClick"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Legacy config-object section shape. Rendered by the internal")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * `SidebarSection` adapter for `Sidebar`'s `sections` prop. New code composes")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * `SidebarLabel` + `SidebarItem` directly.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," SidebarSectionProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  items"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," SidebarItemProps"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  collapsible"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),l(b,{data:i}),n[15]||(n[15]=s("h3",{id:"sidebarlabel",tabindex:"-1"},[a("SidebarLabel "),s("a",{class:"header-anchor",href:"#sidebarlabel","aria-label":"Permalink to “SidebarLabel”"},"​")],-1)),l(j,{name:"SidebarLabel",data:e},{code:p(()=>[...n[5]||(n[5]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  Component"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  ComputedRef"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  InjectionKey"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  MaybeRefOrGetter"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"RouteLocationRaw"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue-router"),s("span",{class:"s_w1p9wo"},"'")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Config-object header. Prefer composing your own header in the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * default slot. Kept for one release for backward compatibility.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  header"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," SidebarHeaderProps")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Config-object sections. Prefer composing `SidebarLabel` +")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `SidebarItem` in the default slot. Kept for one release.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  sections"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," SidebarSectionProps"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"}),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `active`. Alias kept for the config-object path. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  isActive"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Click handler. Bound from `@click` in composition and from `item.onClick`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * in the config-object path — both resolve to this prop.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  onClick"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," MouseEvent"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Config-object visibility flag; filtered by the legacy adapter. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  condition"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," MaybeRefOrGetter"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"boolean"),s("span",{class:"s_1jjt6x"},">")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  subtitle"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  logo"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Whether to render the leading logo/avatar box. Defaults to `true`. Set to")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `false` when workspace identity is already shown elsewhere (e.g. a left")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * rail) to avoid a duplicate avatar; the title then sits flush-left. Best")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * paired with a non-collapsing sidebar, since a collapsed header with no logo")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * has nothing to show.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  showLogo"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  menuItems"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    label"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    icon"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"    onClick"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Legacy config-object section shape. Rendered by the internal")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * `SidebarSection` adapter for `Sidebar`'s `sections` prop. New code composes")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * `SidebarLabel` + `SidebarItem` directly.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," SidebarSectionProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  items"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," SidebarItemProps"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  collapsible"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),l(b,{data:c}),n[16]||(n[16]=s("h3",{id:"sidebarheader",tabindex:"-1"},[a("SidebarHeader "),s("a",{class:"header-anchor",href:"#sidebarheader","aria-label":"Permalink to “SidebarHeader”"},"​")],-1)),l(j,{name:"SidebarHeader",data:u},{code:p(()=>[...n[6]||(n[6]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  Component"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  ComputedRef"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  InjectionKey"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  MaybeRefOrGetter"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"RouteLocationRaw"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue-router"),s("span",{class:"s_w1p9wo"},"'")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Config-object header. Prefer composing your own header in the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * default slot. Kept for one release for backward compatibility.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  header"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," SidebarHeaderProps")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Config-object sections. Prefer composing `SidebarLabel` +")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `SidebarItem` in the default slot. Kept for one release.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  sections"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," SidebarSectionProps"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"}),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `active`. Alias kept for the config-object path. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  isActive"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Click handler. Bound from `@click` in composition and from `item.onClick`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * in the config-object path — both resolve to this prop.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  onClick"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," MouseEvent"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Config-object visibility flag; filtered by the legacy adapter. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  condition"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," MaybeRefOrGetter"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"boolean"),s("span",{class:"s_1jjt6x"},">")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  subtitle"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  logo"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Whether to render the leading logo/avatar box. Defaults to `true`. Set to")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `false` when workspace identity is already shown elsewhere (e.g. a left")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * rail) to avoid a duplicate avatar; the title then sits flush-left. Best")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * paired with a non-collapsing sidebar, since a collapsed header with no logo")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * has nothing to show.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  showLogo"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  menuItems"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    label"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    icon"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"    onClick"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Legacy config-object section shape. Rendered by the internal")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * `SidebarSection` adapter for `Sidebar`'s `sections` prop. New code composes")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * `SidebarLabel` + `SidebarItem` directly.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," SidebarSectionProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  items"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," SidebarItemProps"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  collapsible"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),l(b,{data:q}),n[17]||(n[17]=s("h3",{id:"sidebarsection",tabindex:"-1"},[a("SidebarSection "),s("a",{class:"header-anchor",href:"#sidebarsection","aria-label":"Permalink to “SidebarSection”"},"​")],-1)),l(j,{name:"SidebarSection",data:K},{code:p(()=>[...n[7]||(n[7]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  Component"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  ComputedRef"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  InjectionKey"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_4q1z3w"},"  MaybeRefOrGetter"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"RouteLocationRaw"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue-router"),s("span",{class:"s_w1p9wo"},"'")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Config-object header. Prefer composing your own header in the")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * default slot. Kept for one release for backward compatibility.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  header"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," SidebarHeaderProps")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Config-object sections. Prefer composing `SidebarLabel` +")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `SidebarItem` in the default slot. Kept for one release.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  sections"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," SidebarSectionProps"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"}),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Use `active`. Alias kept for the config-object path. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  isActive"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Click handler. Bound from `@click` in composition and from `item.onClick`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * in the config-object path — both resolve to this prop.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  onClick"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"event"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," MouseEvent"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Config-object visibility flag; filtered by the legacy adapter. */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  condition"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," MaybeRefOrGetter"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_i592pt"},"boolean"),s("span",{class:"s_1jjt6x"},">")]),a(`
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
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  title"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  subtitle"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  logo"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * Whether to render the leading logo/avatar box. Defaults to `true`. Set to")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * `false` when workspace identity is already shown elsewhere (e.g. a left")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * rail) to avoid a duplicate avatar; the title then sits flush-left. Best")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * paired with a non-collapsing sidebar, since a collapsed header with no logo")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   * has nothing to show.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"   */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  showLogo"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  menuItems"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    label"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"    icon"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"    onClick"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," void")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  }[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"/**")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * "),s("span",{class:"s_y1rh3e"},"@deprecated"),s("span",{class:"s_1th9sy"}," Legacy config-object section shape. Rendered by the internal")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * `SidebarSection` adapter for `Sidebar`'s `sections` prop. New code composes")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," * `SidebarLabel` + `SidebarItem` directly.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"}," */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," type"),s("span",{class:"s_euu481"}," SidebarSectionProps"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  label"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  items"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," SidebarItemProps"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  collapsible"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),l(b,{data:A})])}}});export{is as __pageData,_s as default};
