import{aj as m,a9 as T,a5 as I,b7 as S,b1 as $,ad as B,p as O,bd as r,D as s,aE as t,B as R,o as l,be as A,bf as b,bh as w,b5 as F}from"./framework.ThItcJMt.js";import{au as V,_ as g,at as z}from"./theme.DKvOXdfz.js";import{u as H,z as L,x as N,P as U,H as C,g as M,h as q,S as o,c as D,q as E,w as j,d as K,O as P,a as W,A as Y,b as G,F as J,m as Q,p as X,n as Z,B as ee,I as te,j as ae,o as se,U as oe,R as ne,y as re}from"./kits.B2jcfZ3g.js";import"./index.Vcq4gwWv.js";import"./marked.esm.BaswSlok.js";const ie={class:"sticky top-0 z-10 border-b bg-surface-base"},le={class:"overflow-x-auto px-2 py-1"},pe={class:"px-4 pb-40 pt-4"},de=["onKeydown"],we={__name:"ComposeMobile",setup(ce){const v=[{id:"evan",label:"Evan You"},{id:"priya",label:"Priya Nair"},{id:"sam",label:"Sam Rivera"},{id:"ana",label:"Ana Costa"}],k=[H.configure({mention:{items:v}})],_=[U,C,M,q,o,D,E,j,o,K,P,o,W,Y,G,J,o,Q,X,Z,ee,te,ae,o,se,o,oe,ne],p={light:"/pr-preview/pr-1154/recipes/compose-dashboard-light.png",dark:"/pr-preview/pr-1154/recipes/compose-dashboard-dark.png"},f=()=>document.documentElement.getAttribute("data-theme")==="dark"?"dark":"light",d=m(f()),c=m("Design review: new onboarding flow"),i=m(`
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
`);let h;T(()=>{h=new MutationObserver(()=>{d.value=f()}),h.observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]})}),I(()=>h?.disconnect()),S(d,(n,e)=>{i.value=i.value.replace(p[e],p[n])});const y=async n=>({file_url:URL.createObjectURL(n),file_name:n.name}),{textarea:x}=$({input:c});return(n,e)=>(B(),O(t(z),null,{default:r(()=>[s(t(L),{modelValue:i.value,"onUpdate:modelValue":e[1]||(e[1]=a=>i.value=a),extensions:k,"upload-function":y,placeholder:"Type '/' for commands or select text to format"},{default:r(({editor:a})=>[s(t(V),{title:"New discussion"},{prefix:r(()=>[s(t(g),{variant:"ghost",icon:"lucide-chevron-left",label:"Back"})]),suffix:r(()=>[s(t(g),{variant:"solid"},{default:r(()=>[...e[2]||(e[2]=[R("Publish",-1)])]),_:1})]),_:1}),l("div",ie,[l("div",le,[s(t(N),{editor:a,items:_},null,8,["editor"])])]),l("div",pe,[A(l("textarea",{ref_key:"titleTextarea",ref:x,class:"w-full resize-none border-0 bg-transparent px-0 py-0.5 text-3xl-semibold text-ink-gray-8 placeholder-ink-gray-3 focus:ring-0","onUpdate:modelValue":e[0]||(e[0]=u=>c.value=u),placeholder:"Title",rows:"1",wrap:"soft",maxlength:"140",onKeydown:[b(w(u=>a.commands.focus(),["prevent"]),["enter"]),b(w(u=>a.commands.focus(),["prevent"]),["down"])]},null,40,de),[[F,c.value]]),s(t(re),{editor:a,class:"prose-v3 mt-1 max-w-[unset] overflow-auto"},null,8,["editor"])])]),_:1},8,["modelValue"])]),_:1}))}};export{we as default};
