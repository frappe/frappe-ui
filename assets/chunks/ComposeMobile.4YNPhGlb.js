import{b2 as v,ad as _,p as y,bg as n,D as o,aE as e,B as x,o as i,bh as T,bi as h,bk as c,b8 as I,aj as u}from"./framework.CWIjRn0F.js";import{b6 as S,aq as m,b5 as B}from"./theme.CtL7_5eV.js";import{r as R,w as F,u as V,P as $,H as z,f as A,g as H,S as a,c as L,p as N,t as O,d as q,O as C,a as U,A as D,b as K,F as M,l as P,o as j,m as E,B as W,I as Y,i as G,n as J,U as Q,R as X,v as Z}from"./kits.CNkUwmLe.js";const ee={class:"sticky top-0 z-10 border-b bg-surface-base"},te={class:"overflow-x-auto px-2 py-1"},se={class:"px-4 pb-40 pt-4"},oe=["onKeydown"],le={__name:"ComposeMobile",setup(ae){const f=[{id:"evan",label:"Evan You"},{id:"priya",label:"Priya Nair"},{id:"sam",label:"Sam Rivera"},{id:"ana",label:"Ana Costa"}],w=[R.configure({mention:{items:f}})],b=[$,z,A,H,a,L,N,O,a,q,C,a,U,D,K,M,a,P,j,E,W,Y,G,a,J,a,Q,X],r=u("Design review: new onboarding flow"),d=u(`
  <p>I went through the latest onboarding prototype this morning and left inline comments in Figma. It is close to shippable. The new checklist makes the first run much clearer than the old three-step wizard, and the empty states no longer look broken when someone skips a step.</p>
  <p>Here is a walkthrough of what I saw, plus a few things we need to decide before this ships.</p>
  <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&amp;fit=crop&amp;w=1200&amp;q=80" alt="First-run screen with the new setup checklist" />
  <p>The new first-run screen. The checklist on the right replaces the old modal wizard.</p>
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
`),g=async l=>({file_url:URL.createObjectURL(l),file_name:l.name}),{textarea:k}=v({input:r});return(l,t)=>(_(),y(e(B),null,{default:n(()=>[o(e(F),{modelValue:d.value,"onUpdate:modelValue":t[1]||(t[1]=s=>d.value=s),extensions:w,"upload-function":g,placeholder:"Type '/' for commands or select text to format"},{default:n(({editor:s})=>[o(e(S),{title:"New discussion"},{left:n(()=>[o(e(m),{variant:"ghost",icon:"lucide-chevron-left",label:"Back"})]),right:n(()=>[o(e(m),{variant:"solid"},{default:n(()=>[...t[2]||(t[2]=[x("Publish",-1)])]),_:1})]),_:1}),i("div",ee,[i("div",te,[o(e(V),{editor:s,items:b},null,8,["editor"])])]),i("div",se,[T(i("textarea",{ref_key:"titleTextarea",ref:k,class:"w-full resize-none border-0 bg-transparent px-0 py-0.5 text-3xl-semibold text-ink-gray-8 placeholder-ink-gray-3 focus:ring-0","onUpdate:modelValue":t[0]||(t[0]=p=>r.value=p),placeholder:"Title",rows:"1",wrap:"soft",maxlength:"140",onKeydown:[h(c(p=>s.commands.focus(),["prevent"]),["enter"]),h(c(p=>s.commands.focus(),["prevent"]),["down"])]},null,40,oe),[[I,r.value]]),o(e(Z),{editor:s,class:"prose-v3 mt-1 max-w-[unset] overflow-auto"},null,8,["editor"])])]),_:1},8,["modelValue"])]),_:1}))}};export{le as default};
