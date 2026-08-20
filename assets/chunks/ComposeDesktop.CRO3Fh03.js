import{aj as m,a9 as T,a5 as I,b8 as S,b1 as $,ad as B,r as O,D as e,be as r,aE as t,o as l,B as R,bf as D,bg as f,bi as b,b6 as F}from"./framework.CK2aBVEu.js";import{bp as w,a1 as U,U as V,J as g,b3 as A,a0 as C}from"./theme.BDBsgCMD.js";import{u as H,z as L,x as N,P as z,H as q,g as E,h as M,S as o,c as j,q as K,w as P,d as W,O as J,a as Y,A as G,b as Q,F as X,m as Z,p as ee,n as te,B as se,I as ae,j as oe,o as ne,U as re,R as ie,y as le}from"./kits.Cc7qiQEv.js";import"./index.Vcq4gwWv.js";import"./marked.esm.BaswSlok.js";const pe={class:"h-screen w-full bg-surface-base text-ink-gray-9"},de={class:"flex shrink-0 items-center space-x-2"},ce={class:"w-full overflow-x-auto"},he={class:"mx-auto w-full max-w-[770px] px-3 pt-4 sm:px-5"},ue=["onKeydown"],_e={__name:"ComposeDesktop",setup(me){const v=[{id:"evan",label:"Evan You"},{id:"priya",label:"Priya Nair"},{id:"sam",label:"Sam Rivera"},{id:"ana",label:"Ana Costa"}],_=[H.configure({mention:{items:v}})],x=[z,q,E,M,o,j,K,P,o,W,J,o,Y,G,Q,X,o,Z,ee,te,se,ae,oe,o,ne,o,re,ie],p={light:"/recipes/compose-dashboard-light.png",dark:"/recipes/compose-dashboard-dark.png"},d=m(w()),c=m("Design review: new onboarding flow"),i=m(`
  <p>I went through the latest onboarding prototype this morning and left inline comments in Figma. It is close to shippable. The new checklist makes the first run much clearer than the old three-step wizard, and the empty states no longer look broken when someone skips a step.</p>
  <p>Here is a walkthrough of what I saw, plus a few things we need to decide before this ships.</p>
  <img src="${p[d.value]}" alt="Subscription overview dashboard after the redesign" />
  <p>The redesigned overview. Every card now reads from the one date range at the top.</p>
  <h2>What works well</h2>
  <ul>
    <li><p>The progress bar shows how many steps are left, so nobody feels stuck.</p></li>
    <li><p>Skipping a step now lands you on a useful screen instead of a blank one.</p></li>
    <li><p>Sample data loads fast enough that the workspace feels alive on the first visit.</p></li>
  </ul>
  <h3>Numbers from the last test round</h3>
  <p>Five people ran through both versions. The new flow won on every measure we tracked.</p>
  <table>
    <tbody>
      <tr><th><p>Metric</p></th><th><p>Old wizard</p></th><th><p>New checklist</p></th></tr>
      <tr><td><p>Setup completion</p></td><td><p>61%</p></td><td><p>78%</p></td></tr>
      <tr><td><p>Time to first post</p></td><td><p>4m 12s</p></td><td><p>2m 30s</p></td></tr>
      <tr><td><p>Dropped at invite step</p></td><td><p>3 of 5</p></td><td><p>1 of 5</p></td></tr>
    </tbody>
  </table>
  <h3>Open questions</h3>
  <ol>
    <li><p>Should sample data seed automatically, or sit behind a button?</p></li>
    <li><p>The invite step assumes email. What do we show for SSO-only workspaces?</p></li>
    <li><p>Do we keep the tour for returning users, or show it only once?</p></li>
  </ol>
  <p>One thing to sort out on the backend: the checklist state has to persist per user, not per session. Right now the prototype reads it from <code>localStorage</code>, which resets when you switch devices. Here is the response shape I am proposing:</p>
  <pre><code class="language-json">{
  "onboarding": {
    "completed": ["create_space", "invite_team"],
    "skipped": ["import_data"],
    "dismissed": false
  }
}</code></pre>
  <blockquote><p>Let's timebox this to one more revision and ship it behind the <code>new_onboarding</code> flag next week.</p></blockquote>
  <p>Full comments are in the design channel. Add anything I missed before Friday.</p>
`);let h;T(()=>{h=new MutationObserver(()=>{d.value=w()}),h.observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]})}),I(()=>h?.disconnect()),S(d,(n,s)=>{i.value=i.value.replace(p[s],p[n])});const k=async n=>({file_url:URL.createObjectURL(n),file_name:n.name}),{textarea:y}=$({input:c});return(n,s)=>(B(),O("div",pe,[e(t(C),null,{default:r(()=>[e(t(L),{modelValue:i.value,"onUpdate:modelValue":s[1]||(s[1]=a=>i.value=a),extensions:_,"upload-function":k,placeholder:"Type '/' for commands or select text to format"},{default:r(({editor:a})=>[e(t(U),null,{default:r(()=>[e(t(V),{items:[{label:"Drafts"},{label:"New discussion"}]}),l("div",de,[e(t(g),{variant:"ghost",icon:"lucide-trash-2",label:"Delete draft"}),e(t(g),{variant:"solid"},{default:r(()=>[...s[2]||(s[2]=[R("Publish",-1)])]),_:1})])]),_:1}),e(t(A),{class:"flex h-10 items-center border-b bg-surface-base px-3 sm:px-5"},{default:r(()=>[l("div",ce,[e(t(N),{editor:a,items:x},null,8,["editor"])])]),_:2},1024),l("div",he,[D(l("textarea",{ref_key:"titleTextarea",ref:y,class:"mt-1 w-full resize-none border-0 bg-transparent px-0 py-0.5 text-4xl-semibold text-ink-gray-8 placeholder-ink-gray-3 focus:ring-0","onUpdate:modelValue":s[0]||(s[0]=u=>c.value=u),placeholder:"Title",rows:"1",wrap:"soft",maxlength:"140",onKeydown:[f(b(u=>a.commands.focus(),["prevent"]),["enter"]),f(b(u=>a.commands.focus(),["prevent"]),["down"])]},null,40,ue),[[F,c.value]]),e(t(le),{editor:a,class:"prose-v3 -mx-2 min-h-[calc(100vh-200px)] max-w-[unset] overflow-auto px-2 pb-40"},null,8,["editor"])])]),_:1},8,["modelValue"])]),_:1})]))}};export{_e as default};
