import{aj as u,a9 as T,a5 as I,b7 as S,b1 as $,ad as B,r as O,D as e,bd as r,aE as t,o as l,B as R,be as A,bf as b,bh as w,b5 as D}from"./framework.BgCjhnaM.js";import{a3 as F,X as N,N as g,b6 as V,a2 as H}from"./theme.D0iLf53U.js";import{u as L,z as U,x as z,P as C,H as E,g as q,h as M,S as o,c as j,q as K,w as P,d as W,O as X,a as Y,A as G,b as J,F as Q,m as Z,p as ee,n as te,B as se,I as ae,j as oe,o as ne,U as re,R as ie,y as le}from"./kits.w5k8Z4ec.js";import"./index.Vcq4gwWv.js";import"./marked.esm.BaswSlok.js";const pe={class:"h-screen w-full bg-surface-base text-ink-gray-9"},de={class:"flex shrink-0 items-center space-x-2"},ce={class:"w-full overflow-x-auto"},he={class:"mx-auto w-full max-w-[770px] px-3 pt-4 sm:px-5"},me=["onKeydown"],_e={__name:"ComposeDesktop",setup(ue){const v=[{id:"evan",label:"Evan You"},{id:"priya",label:"Priya Nair"},{id:"sam",label:"Sam Rivera"},{id:"ana",label:"Ana Costa"}],_=[L.configure({mention:{items:v}})],x=[C,E,q,M,o,j,K,P,o,W,X,o,Y,G,J,Q,o,Z,ee,te,se,ae,oe,o,ne,o,re,ie],p={light:"/pr-preview/pr-1153/recipes/compose-dashboard-light.png",dark:"/pr-preview/pr-1153/recipes/compose-dashboard-dark.png"},f=()=>document.documentElement.getAttribute("data-theme")==="dark"?"dark":"light",d=u(f()),c=u("Design review: new onboarding flow"),i=u(`
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
`);let h;T(()=>{h=new MutationObserver(()=>{d.value=f()}),h.observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]})}),I(()=>h?.disconnect()),S(d,(n,s)=>{i.value=i.value.replace(p[s],p[n])});const k=async n=>({file_url:URL.createObjectURL(n),file_name:n.name}),{textarea:y}=$({input:c});return(n,s)=>(B(),O("div",pe,[e(t(H),null,{default:r(()=>[e(t(U),{modelValue:i.value,"onUpdate:modelValue":s[1]||(s[1]=a=>i.value=a),extensions:_,"upload-function":k,placeholder:"Type '/' for commands or select text to format"},{default:r(({editor:a})=>[e(t(F),null,{default:r(()=>[e(t(N),{items:[{label:"Drafts"},{label:"New discussion"}]}),l("div",de,[e(t(g),{variant:"ghost",icon:"lucide-trash-2",label:"Delete draft"}),e(t(g),{variant:"solid"},{default:r(()=>[...s[2]||(s[2]=[R("Publish",-1)])]),_:1})])]),_:1}),e(t(V),{class:"flex h-10 items-center border-b bg-surface-base px-3 sm:px-5"},{default:r(()=>[l("div",ce,[e(t(z),{editor:a,items:x},null,8,["editor"])])]),_:2},1024),l("div",he,[A(l("textarea",{ref_key:"titleTextarea",ref:y,class:"mt-1 w-full resize-none border-0 bg-transparent px-0 py-0.5 text-4xl-semibold text-ink-gray-8 placeholder-ink-gray-3 focus:ring-0","onUpdate:modelValue":s[0]||(s[0]=m=>c.value=m),placeholder:"Title",rows:"1",wrap:"soft",maxlength:"140",onKeydown:[b(w(m=>a.commands.focus(),["prevent"]),["enter"]),b(w(m=>a.commands.focus(),["prevent"]),["down"])]},null,40,me),[[D,c.value]]),e(t(le),{editor:a,class:"prose-v3 -mx-2 min-h-[calc(100vh-200px)] max-w-[unset] overflow-auto px-2 pb-40"},null,8,["editor"])])]),_:1},8,["modelValue"])]),_:1})]))}};export{_e as default};
