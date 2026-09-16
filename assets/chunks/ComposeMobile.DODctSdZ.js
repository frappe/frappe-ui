import{aj as u,b7 as y,b1 as x,ad as T,p as I,bd as i,D as o,aE as t,B as S,o as l,be as $,bf as m,bh as f,b5 as R}from"./framework.BdL874pW.js";import{bC as B,au as C,_ as b,at as V}from"./theme.BZKFMJwx.js";import{u as z,z as A,x as F,P as H,H as L,g as N,h as O,S as a,c as U,q,w as D,d as j,O as K,a as M,A as P,b as E,F as W,m as Y,p as G,n as J,B as Q,I as X,j as Z,o as ee,U as te,R as se,y as oe}from"./kits.CffflaX0.js";import"./index.Vcq4gwWv.js";import"./marked.esm.BaswSlok.js";const ae={class:"sticky top-0 z-10 border-b bg-surface-base"},ne={class:"overflow-x-auto px-2 py-1"},ie={class:"px-4 pb-40 pt-4"},re=["onKeydown"],me={__name:"ComposeMobile",setup(le){const w=[{id:"evan",label:"Evan You"},{id:"priya",label:"Priya Nair"},{id:"sam",label:"Sam Rivera"},{id:"ana",label:"Ana Costa"}],g=[z.configure({mention:{items:w}})],v=[H,L,N,O,a,U,q,D,a,j,K,a,M,P,E,W,a,Y,G,J,Q,X,Z,a,ee,a,te,se],p={light:"/recipes/compose-dashboard-light.png",dark:"/recipes/compose-dashboard-dark.png"},h=B(),d=u("Design review: new onboarding flow"),r=u(`
  <p>I went through the latest onboarding prototype this morning and left inline comments in Figma. It is close to shippable. The new checklist makes the first run much clearer than the old three-step wizard, and the empty states no longer look broken when someone skips a step.</p>
  <p>Here is a walkthrough of what I saw, plus a few things we need to decide before this ships.</p>
  <img src="${p[h.value]}" alt="Subscription overview dashboard after the redesign" />
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
`);y(h,(n,e)=>{r.value=r.value.replace(p[e],p[n])});const _=async n=>({file_url:URL.createObjectURL(n),file_name:n.name}),{textarea:k}=x({input:d});return(n,e)=>(T(),I(t(V),null,{default:i(()=>[o(t(A),{modelValue:r.value,"onUpdate:modelValue":e[1]||(e[1]=s=>r.value=s),extensions:g,"upload-function":_,placeholder:"Type '/' for commands or select text to format"},{default:i(({editor:s})=>[o(t(C),{title:"New discussion"},{prefix:i(()=>[o(t(b),{variant:"ghost",icon:"lucide-chevron-left",label:"Back"})]),suffix:i(()=>[o(t(b),{variant:"solid"},{default:i(()=>[...e[2]||(e[2]=[S("Publish",-1)])]),_:1})]),_:1}),l("div",ae,[l("div",ne,[o(t(F),{editor:s,items:v},null,8,["editor"])])]),l("div",ie,[$(l("textarea",{ref_key:"titleTextarea",ref:k,class:"w-full resize-none border-0 bg-transparent px-0 py-0.5 text-3xl-semibold text-ink-gray-8 placeholder-ink-gray-3 focus:ring-0","onUpdate:modelValue":e[0]||(e[0]=c=>d.value=c),placeholder:"Title",rows:"1",wrap:"soft",maxlength:"140",onKeydown:[m(f(c=>s.commands.focus(),["prevent"]),["enter"]),m(f(c=>s.commands.focus(),["prevent"]),["down"])]},null,40,re),[[R,d.value]]),o(t(oe),{editor:s,class:"prose-v3 mt-1 max-w-[unset] overflow-auto"},null,8,["editor"])])]),_:1},8,["modelValue"])]),_:1}))}};export{me as default};
