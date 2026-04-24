import{_ as z}from"./chunks/PropsTable.vue_vue_type_script_setup_true_lang.CRSFTfqQ.js";import{_ as x}from"./chunks/SlotsTable.vue_vue_type_script_setup_true_lang.DI9fmR8Z.js";import{_ as b}from"./chunks/EmitsTable.vue_vue_type_script_setup_true_lang.vObi4Fuu.js";import{a4 as m,a5 as y,a as u,a6 as g}from"./chunks/theme.DsE5v2Vp.js";import{d as f,o as _,i as w,e as c,p as h,U as p,a as s,b as l,a6 as a,ae as v,c as j}from"./chunks/framework.DuDrp9yv.js";const k=f({__name:"Example",setup(r){const t=h(`
<div>
  <h2>Heading 2</h2>
  <p>
    This is a paragraph with <strong>bold</strong> and <em>italic</em> text.
  </p>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
  <p>
    <a href="https://frappe.io">Frappe</a>
  </p>
  <pre><code class="language-javascript">import { Button } from 'frappe-ui'
const value = ref(true);</code></pre>
</div>
`);return(o,i)=>(_(),w(c(m),{"editor-class":"prose-sm min-h-[4rem] border rounded-b-lg border-t-0 p-2",content:t.value,placeholder:"Type something...",onChange:i[0]||(i[0]=e=>t.value.value=e),bubbleMenu:!0,"fixed-menu":!0},null,8,["content"]))}}),C={class:"mt-2 flex flex-col justify-between sm:flex-row sm:items-center"},E={class:"mt-2 flex items-center justify-end space-x-2 sm:mt-0"},T=f({__name:"Comment",setup(r){const t=h(""),o=["Paragraph",["Heading 2","Heading 3","Heading 4"],"Separator","Bold","Italic","Separator","Bullet List","Numbered List","Separator","Link","Image"];return(i,e)=>(_(),w(c(m),{ref:"textEditor","editor-class":"prose-sm max-w-none min-h-[4rem]",content:t.value,onChange:e[0]||(e[0]=n=>t.value.value=n),"starterkit-options":{heading:{levels:[2,3,4]}},placeholder:"Write something amazing..."},{editor:p(({editor:n})=>[l(c(g),{class:"max-h-[50vh] overflow-y-auto border rounded-lg p-4",editor:n},null,8,["editor"])]),bottom:p(()=>[s("div",C,[l(c(y),{class:"-ml-1 overflow-x-auto",buttons:o}),s("div",E,[l(c(u),null,{default:p(()=>[...e[1]||(e[1]=[a("Cancel",-1)])]),_:1}),l(c(u),{variant:"solid"},{default:p(()=>[...e[2]||(e[2]=[a("Submit",-1)])]),_:1})])])]),_:1},8,["content"]))}}),S=JSON.parse('{"title":"TextEditor","description":"","frontmatter":{},"headers":[],"relativePath":"docs/components/texteditor.md","filePath":"docs/components/texteditor.md","lastUpdated":1768439812000}'),q={name:"docs/components/texteditor.md"},O=Object.assign(q,{setup(r){const t=[{name:"content",description:"Initial editor content (HTML/string). `null` renders an empty editor",required:!1,type:"string | null",default:"null"},{name:"placeholder",description:"Placeholder text or dynamic placeholder resolver",required:!1,type:"string | (() => string)",default:'""'},{name:"editorClass",description:"Custom classes applied to the editor root",required:!1,type:"string | object | string[]",default:'"prose-sm"'},{name:"editable",description:"Toggles editability of the editor",required:!1,type:"boolean",default:"true"},{name:"autofocus",description:"Autofocus the editor on mount",required:!1,type:"boolean",default:"false"},{name:"bubbleMenu",description:"Enables bubble menu or provides custom bubble menu items",required:!1,type:"boolean | any[]",default:"false"},{name:"bubbleMenuOptions",description:"Configuration options for the bubble menu",required:!1,type:"object",default:"{}"},{name:"fixedMenu",description:"Enables fixed menu or provides custom fixed menu items",required:!1,type:"boolean | any[]",default:"false"},{name:"floatingMenu",description:"Enables floating menu or provides custom floating menu items",required:!1,type:"boolean | any[]",default:"false"},{name:"extensions",description:"Custom TipTap extensions",required:!1,type:"any[]",default:"[]"},{name:"starterkitOptions",description:"Options passed to TipTap StarterKit",required:!1,type:"any",default:"{}"},{name:"mentions",description:"Mention extension configuration",required:!1,type:"ConfigureMentionOptions",default:"null"},{name:"tags",description:"Tag / hashtag configuration",required:!1,type:"any[] | null",default:"null"},{name:"uploadFunction",description:"Async file upload handler (used for images, files, etc.)",required:!1,type:"((file: File) => Promise<UploadedFile>)",default:void 0},{name:"uploadArgs",description:"Extra arguments passed to the upload function",required:!1,type:"object",default:void 0}],o=[{name:"top",description:"",type:"{ editor: { contentComponent: { uid: number; type: FunctionalComponent<{}, {}, any, {}> | { [x: stri"},{name:"editor",description:"",type:"{ editor: { contentComponent: { uid: number; type: FunctionalComponent<{}, {}, any, {}> | { [x: stri"},{name:"bottom",description:"",type:"{ editor: { contentComponent: { uid: number; type: FunctionalComponent<{}, {}, any, {}> | { [x: stri"}],i=[{name:"change",description:"Fired after the value is committed.",type:"[content: string]"},{name:"focus",description:"",type:"[event: FocusEvent]"},{name:"blur",description:"",type:"[event: FocusEvent]"},{name:"transaction",description:"",type:"[editor: object]"}];return(e,n)=>{const d=v("ComponentPreview");return _(),j("div",null,[n[3]||(n[3]=s("h1",{id:"texteditor",tabindex:"-1"},[a("TextEditor "),s("a",{class:"header-anchor",href:"#texteditor","aria-label":"Permalink to “TextEditor”"},"​")],-1)),n[4]||(n[4]=s("p",null,"A rich text editor based on TipTap for creating and formatting content. Offers intuitive controls, styling options, and smooth editing experience.",-1)),n[5]||(n[5]=s("h2",{id:"default",tabindex:"-1"},[a("Default "),s("a",{class:"header-anchor",href:"#default","aria-label":"Permalink to “Default”"},"​")],-1)),l(d,{name:"TextEditor-Example"},{code:p(()=>[...n[0]||(n[0]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"ref"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"TextEditor"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," value"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"`")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"<div>")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"  <h2>Heading 2</h2>")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"  <p>")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"    This is a paragraph with <strong>bold</strong> and <em>italic</em> text.")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"  </p>")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"  <ul>")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"    <li>Item 1</li>")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"    <li>Item 2</li>")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"  </ul>")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"  <p>")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},'    <a href="https://frappe.io">Frappe</a>')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"  </p>")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},`  <pre><code class="language-javascript">import { Button } from 'frappe-ui'`)]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"const value = ref(true);</code></pre>")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2575z4"},"</div>")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},"`"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_wac0bt"},"TextEditor")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"    editor-class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"prose-sm min-h-[4rem] border rounded-b-lg border-t-0 p-2"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"    :content"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"value"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"    placeholder"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Type something..."),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"    @change"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"(val) => (value.value = val)"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"    :bubbleMenu"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"true"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"    :fixed-menu"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"true"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:p(()=>[l(k)]),_:1}),n[6]||(n[6]=s("h2",{id:"comment-editor",tabindex:"-1"},[a("Comment Editor "),s("a",{class:"header-anchor",href:"#comment-editor","aria-label":"Permalink to “Comment Editor”"},"​")],-1)),l(d,{name:"TextEditor-Comment"},{code:p(()=>[...n[1]||(n[1]=[s("div",{class:"language-vue"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"vue"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1i4ay4"}," setup"),s("span",{class:"s_1i4ay4"}," lang"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"ts"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"ref"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"EditorContent"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"@tiptap/vue-3"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_4q1z3w"},"Button"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," TextEditor"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_4q1z3w"}," TextEditorFixedMenu"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"frappe-ui"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," customValue"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_indoxt"}," ref"),s("span",{class:"s_13ahmt"},"("),s("span",{class:"s_w1p9wo"},"''"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_252irl"},"const"),s("span",{class:"s_295sjd"}," customButtons"),s("span",{class:"s_2ekfrt"}," ="),s("span",{class:"s_13ahmt"}," [")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},"  '"),s("span",{class:"s_2575z4"},"Paragraph"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"  ["),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_2575z4"},"Heading 2"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Heading 3"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},","),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"Heading 4"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_13ahmt"},"]"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},"  '"),s("span",{class:"s_2575z4"},"Separator"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},"  '"),s("span",{class:"s_2575z4"},"Bold"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},"  '"),s("span",{class:"s_2575z4"},"Italic"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},"  '"),s("span",{class:"s_2575z4"},"Separator"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},"  '"),s("span",{class:"s_2575z4"},"Bullet List"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},"  '"),s("span",{class:"s_2575z4"},"Numbered List"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},"  '"),s("span",{class:"s_2575z4"},"Separator"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},"  '"),s("span",{class:"s_2575z4"},"Link"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_w1p9wo"},"  '"),s("span",{class:"s_2575z4"},"Image"),s("span",{class:"s_w1p9wo"},"'"),s("span",{class:"s_1jjt6x"},",")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"script"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"<"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  <"),s("span",{class:"s_wac0bt"},"TextEditor")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"    ref"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"textEditor"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"    editor-class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"prose-sm max-w-none min-h-[4rem]"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"    :content"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"customValue"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"    @change"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"(val) => (customValue.value = val)"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"    :starterkit-options"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"{ heading: { levels: [2, 3, 4] } }"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"    placeholder"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"Write something amazing..."),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1i4ay4"}," v-slot"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_1i4ay4"},"editor"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_13ahmt"},"{"),s("span",{class:"s_22m8k2"}," editor"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_wac0bt"},"EditorContent")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"max-h-[50vh] overflow-y-auto border rounded-lg p-4"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        :editor"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"editor"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    <"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1i4ay4"}," v-slot"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_1i4ay4"},"bottom"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      <"),s("span",{class:"s_1uuh8p"},"div")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"        class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"mt-2 flex flex-col justify-between sm:flex-row sm:items-center"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      >")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_wac0bt"},"TextEditorFixedMenu")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"-ml-1 overflow-x-auto"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1i4ay4"},"          :buttons"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"customButtons"),s("span",{class:"s_w1p9wo"},'"')]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        />")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        <"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1i4ay4"}," class"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"mt-2 flex items-center justify-end space-x-2 sm:mt-0"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"Button"),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"},"Cancel"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"Button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"          <"),s("span",{class:"s_1uuh8p"},"Button"),s("span",{class:"s_1i4ay4"}," variant"),s("span",{class:"s_1jjt6x"},"="),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_2575z4"},"solid"),s("span",{class:"s_w1p9wo"},'"'),s("span",{class:"s_1zd9e2"},">"),s("span",{class:"s_6am9cx"},"Submit"),s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"Button"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"        </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"      </"),s("span",{class:"s_1uuh8p"},"div"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"    </"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"  </"),s("span",{class:"s_wac0bt"},"TextEditor"),s("span",{class:"s_1zd9e2"},">")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1zd9e2"},"</"),s("span",{class:"s_1uuh8p"},"template"),s("span",{class:"s_1zd9e2"},">")])])])],-1)])]),default:p(()=>[l(T)]),_:1}),n[7]||(n[7]=s("h2",{id:"api-reference",tabindex:"-1"},[a("API Reference "),s("a",{class:"header-anchor",href:"#api-reference","aria-label":"Permalink to “API Reference”"},"​")],-1)),l(z,{name:"TextEditor",data:t},{code:p(()=>[...n[2]||(n[2]=[s("div",{class:"language-typescript"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"typescript"),s("pre",{class:"shiki shiki-themes tokyo-night github-light s_2cy0ei",tabindex:"0",dir:"ltr"},[s("code",null,[s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_50ecpt"},"type"),s("span",{class:"s_4q1z3w"}," Component"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"vue"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_50ecpt"},"type"),s("span",{class:"s_4q1z3w"}," UploadedFile"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"../../utils/useFileUpload"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"import"),s("span",{class:"s_13ahmt"}," { "),s("span",{class:"s_50ecpt"},"type"),s("span",{class:"s_4q1z3w"}," MentionSuggestionItem"),s("span",{class:"s_13ahmt"}," }"),s("span",{class:"s_edvzsf"}," from"),s("span",{class:"s_w1p9wo"}," '"),s("span",{class:"s_2575z4"},"./extensions/mention/mention-extension"),s("span",{class:"s_w1p9wo"},"'")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_50ecpt"},"type"),s("span",{class:"s_euu481"}," ConfigureMentionOptions"),s("span",{class:"s_2ekfrt"}," =")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2ekfrt"},"  |"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"      mentions"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," MentionSuggestionItem"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"      component"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," Component")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"    }")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2ekfrt"},"  |"),s("span",{class:"s_euu481"}," MentionSuggestionItem"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_2ekfrt"},"  |"),s("span",{class:"s_i592pt"}," null")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," TextEditorProps"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Initial editor content (HTML/string). `null` renders an empty editor */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  content"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," null")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Placeholder text or dynamic placeholder resolver */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  placeholder"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_13ahmt"}," (()"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},")")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Custom classes applied to the editor root */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  editorClass"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"[]"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," object")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Toggles editability of the editor */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  editable"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Autofocus the editor on mount */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  autofocus"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Enables bubble menu or provides custom bubble menu items */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  bubbleMenu"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," any"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Configuration options for the bubble menu */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  bubbleMenuOptions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," object")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Enables fixed menu or provides custom fixed menu items */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  fixedMenu"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," any"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Enables floating menu or provides custom floating menu items */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  floatingMenu"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," boolean"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," any"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Custom TipTap extensions */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  extensions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," any"),s("span",{class:"s_13ahmt"},"[]")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Options passed to TipTap StarterKit */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  starterkitOptions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," any")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Mention extension configuration */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  mentions"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_euu481"}," ConfigureMentionOptions")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Tag / hashtag configuration */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  tags"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," any"),s("span",{class:"s_13ahmt"},"[]"),s("span",{class:"s_2ekfrt"}," |"),s("span",{class:"s_i592pt"}," null")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Async file upload handler (used for images, files, etc.) */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_indoxt"},"  uploadFunction"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_13ahmt"}," ("),s("span",{class:"s_fsg3al"},"file"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_euu481"}," File"),s("span",{class:"s_13ahmt"},")"),s("span",{class:"s_50ecpt"}," =>"),s("span",{class:"s_euu481"}," Promise"),s("span",{class:"s_1jjt6x"},"<"),s("span",{class:"s_euu481"},"UploadedFile"),s("span",{class:"s_1jjt6x"},">")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Extra arguments passed to the upload function */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  uploadArgs"),s("span",{class:"s_2ekfrt"},"?:"),s("span",{class:"s_i592pt"}," object")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_edvzsf"},"export"),s("span",{class:"s_50ecpt"}," interface"),s("span",{class:"s_euu481"}," TextEditorEmits"),s("span",{class:"s_13ahmt"}," {")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired whenever editor content changes */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  change"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_euu481"},"content"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_i592pt"}," string"),s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired when the editor gains focus */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  focus"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_euu481"},"event"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_euu481"}," FocusEvent"),s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired when the editor loses focus */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  blur"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_euu481"},"event"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_euu481"}," FocusEvent"),s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"}),a(`
`),s("span",{class:"line"},[s("span",{class:"s_1th9sy"},"  /** Fired on every editor transaction */")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_bsv8nz"},"  transaction"),s("span",{class:"s_2ekfrt"},":"),s("span",{class:"s_13ahmt"}," ["),s("span",{class:"s_euu481"},"editor"),s("span",{class:"s_1jjt6x"},":"),s("span",{class:"s_i592pt"}," object"),s("span",{class:"s_13ahmt"},"]")]),a(`
`),s("span",{class:"line"},[s("span",{class:"s_13ahmt"},"}")])])])],-1)])]),_:1}),n[8]||(n[8]=a()),l(x,{data:o}),n[9]||(n[9]=a()),l(b,{data:i})])}}});export{S as __pageData,O as default};
