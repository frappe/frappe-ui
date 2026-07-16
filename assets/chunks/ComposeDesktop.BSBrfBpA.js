import{b2 as x,ad as k,r as v,D as e,bg as n,aE as t,o as i,B as y,bh as T,bi as c,bk as h,b8 as I,aj as m}from"./framework.CWIjRn0F.js";import{aI as S,au as $,aq as u,bI as R,aH as B}from"./theme.CtL7_5eV.js";import{r as D,w as F,u as H,P as V,H as A,f as L,g as N,S as o,c as O,p as q,t as z,d as C,O as U,a as K,A as P,b as j,F as E,l as M,o as W,m as Y,B as G,I as J,i as Q,n as X,U as Z,R as ee,v as te}from"./kits.CNkUwmLe.js";const se={class:"h-screen w-full bg-surface-base text-ink-gray-9"},ae={class:"flex shrink-0 items-center space-x-2"},oe={class:"w-full overflow-x-auto"},ne={class:"mx-auto w-full max-w-[770px] px-3 pt-4 sm:px-5"},ie=["onKeydown"],ce={__name:"ComposeDesktop",setup(le){const f=[{id:"evan",label:"Evan You"},{id:"priya",label:"Priya Nair"},{id:"sam",label:"Sam Rivera"},{id:"ana",label:"Ana Costa"}],w=[D.configure({mention:{items:f}})],b=[V,A,L,N,o,O,q,z,o,C,U,o,K,P,j,E,o,M,W,Y,G,J,Q,o,X,o,Z,ee],l=m("Design review: new onboarding flow"),d=m(`
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
`),g=async r=>({file_url:URL.createObjectURL(r),file_name:r.name}),{textarea:_}=x({input:l});return(r,s)=>(k(),v("div",se,[e(t(B),null,{default:n(()=>[e(t(F),{modelValue:d.value,"onUpdate:modelValue":s[1]||(s[1]=a=>d.value=a),extensions:w,"upload-function":g,placeholder:"Type '/' for commands or select text to format"},{default:n(({editor:a})=>[e(t(S),null,{default:n(()=>[e(t($),{items:[{label:"Drafts"},{label:"New discussion"}]}),i("div",ae,[e(t(u),{variant:"ghost",icon:"lucide-trash-2",label:"Delete draft"}),e(t(u),{variant:"solid"},{default:n(()=>[...s[2]||(s[2]=[y("Publish",-1)])]),_:1})])]),_:1}),e(t(R),{class:"flex h-10 items-center border-b bg-surface-base px-3 sm:px-5"},{default:n(()=>[i("div",oe,[e(t(H),{editor:a,items:b},null,8,["editor"])])]),_:2},1024),i("div",ne,[T(i("textarea",{ref_key:"titleTextarea",ref:_,class:"mt-1 w-full resize-none border-0 bg-transparent px-0 py-0.5 text-4xl-semibold text-ink-gray-8 placeholder-ink-gray-3 focus:ring-0","onUpdate:modelValue":s[0]||(s[0]=p=>l.value=p),placeholder:"Title",rows:"1",wrap:"soft",maxlength:"140",onKeydown:[c(h(p=>a.commands.focus(),["prevent"]),["enter"]),c(h(p=>a.commands.focus(),["prevent"]),["down"])]},null,40,ie),[[I,l.value]]),e(t(te),{editor:a,class:"prose-v3 -mx-2 min-h-[calc(100vh-200px)] max-w-[unset] overflow-auto px-2 pb-40"},null,8,["editor"])])]),_:1},8,["modelValue"])]),_:1})]))}};export{ce as default};
