import{aj as m,b8 as k,b2 as y,ad as T,r as I,D as e,be as r,aF as t,o as l,B as S,bf as $,bg as u,bi as f,b6 as R}from"./framework.79nw0c7c.js";import{bC as B,a1 as C,U as D,_ as b,b4 as F,a0 as V}from"./theme.DYSpmtMP.js";import{u as A,z as H,x as L,P as N,H as O,g as U,h as z,S as o,c as q,q as j,w as K,d as P,O as E,a as M,A as W,b as Y,F as G,m as J,p as Q,n as X,B as Z,I as ee,j as te,o as se,U as ae,R as oe,y as ne}from"./kits.SjS1Oha8.js";import"./index.Vcq4gwWv.js";import"./marked.esm.BaswSlok.js";const re={class:"h-screen w-full bg-surface-base text-ink-gray-9"},ie={class:"flex shrink-0 items-center space-x-2"},le={class:"w-full overflow-x-auto"},pe={class:"mx-auto w-full max-w-[770px] px-3 pt-4 sm:px-5"},de=["onKeydown"],we={__name:"ComposeDesktop",setup(ce){const w=[{id:"evan",label:"Evan You"},{id:"priya",label:"Priya Nair"},{id:"sam",label:"Sam Rivera"},{id:"ana",label:"Ana Costa"}],g=[A.configure({mention:{items:w}})],v=[N,O,U,z,o,q,j,K,o,P,E,o,M,W,Y,G,o,J,Q,X,Z,ee,te,o,se,o,ae,oe],p={light:"/recipes/compose-dashboard-light.png",dark:"/recipes/compose-dashboard-dark.png"},h=B(),d=m("Design review: new onboarding flow"),i=m(`
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
`);k(h,(n,s)=>{i.value=i.value.replace(p[s],p[n])});const _=async n=>({file_url:URL.createObjectURL(n),file_name:n.name}),{textarea:x}=y({input:d});return(n,s)=>(T(),I("div",re,[e(t(V),null,{default:r(()=>[e(t(H),{modelValue:i.value,"onUpdate:modelValue":s[1]||(s[1]=a=>i.value=a),extensions:g,"upload-function":_,placeholder:"Type '/' for commands or select text to format"},{default:r(({editor:a})=>[e(t(C),null,{default:r(()=>[e(t(D),{items:[{label:"Drafts"},{label:"New discussion"}]}),l("div",ie,[e(t(b),{variant:"ghost",icon:"lucide-trash-2",label:"Delete draft"}),e(t(b),{variant:"solid"},{default:r(()=>[...s[2]||(s[2]=[S("Publish",-1)])]),_:1})])]),_:1}),e(t(F),{class:"flex h-10 items-center border-b bg-surface-base px-3 sm:px-5"},{default:r(()=>[l("div",le,[e(t(L),{editor:a,items:v},null,8,["editor"])])]),_:2},1024),l("div",pe,[$(l("textarea",{ref_key:"titleTextarea",ref:x,class:"mt-1 w-full resize-none border-0 bg-transparent px-0 py-0.5 text-4xl-semibold text-ink-gray-8 placeholder-ink-gray-3 focus:ring-0","onUpdate:modelValue":s[0]||(s[0]=c=>d.value=c),placeholder:"Title",rows:"1",wrap:"soft",maxlength:"140",onKeydown:[u(f(c=>a.commands.focus(),["prevent"]),["enter"]),u(f(c=>a.commands.focus(),["prevent"]),["down"])]},null,40,de),[[R,d.value]]),e(t(ne),{editor:a,class:"prose-v3 -mx-2 min-h-[calc(100vh-200px)] max-w-[unset] overflow-auto px-2 pb-40"},null,8,["editor"])])]),_:1},8,["modelValue"])]),_:1})]))}};export{we as default};
