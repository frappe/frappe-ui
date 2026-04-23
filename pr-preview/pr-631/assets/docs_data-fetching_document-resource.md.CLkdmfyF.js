import{af as a,o as n,c as p,aw as l}from"./chunks/framework.Bo3zwgXD.js";const h=JSON.parse('{"title":"Document Resource","description":"","frontmatter":{},"headers":[],"relativePath":"docs/data-fetching/document-resource.md","filePath":"docs/data-fetching/document-resource.md","lastUpdated":1767261019000}'),c={name:"docs/data-fetching/document-resource.md"};function e(t,s,o,_,i,d){return n(),p("div",null,[...s[0]||(s[0]=[l(`<h1 id="document-resource" tabindex="-1">Document Resource <a class="header-anchor" href="#document-resource" aria-label="Permalink to “Document Resource”">​</a></h1><p>Document Resource is a wrapper on top of <a href="./resource">Resource</a> for working with a single document. This feature only works with a Frappe Framework backend as of now.</p><h2 id="usage" tabindex="-1">Usage <a class="header-anchor" href="#usage" aria-label="Permalink to “Usage”">​</a></h2><p>Create a document resource by specifying <code>doctype</code> and <code>name</code> of the record. It will be fetched automatically. The <code>todo.doc</code> is the document object with all the fields of the document. Along with this, you get <code>todo.setValue</code> and <code>todo.delete</code> resources.</p><div class="language-vue"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes tokyo-night github-light s_2cy0ei" tabindex="0" dir="ltr"><code><span class="line"><span class="s_1zd9e2">&lt;</span><span class="s_1uuh8p">template</span><span class="s_1zd9e2">&gt;</span></span>
<span class="line"><span class="s_1zd9e2">  &lt;</span><span class="s_1uuh8p">div</span><span class="s_1i4ay4"> v-if</span><span class="s_1jjt6x">=</span><span class="s_w1p9wo">&quot;</span><span class="s_2575z4">todo.doc</span><span class="s_w1p9wo">&quot;</span><span class="s_1zd9e2">&gt;</span></span>
<span class="line"><span class="s_1zd9e2">    &lt;</span><span class="s_1uuh8p">div</span><span class="s_1zd9e2">&gt;</span></span>
<span class="line"><span class="s_6am9cx">      # {{ todo.description }}</span></span>
<span class="line"><span class="s_1zd9e2">      &lt;</span><span class="s_wac0bt">Badge</span><span class="s_1zd9e2">&gt;</span><span class="s_6am9cx">{{ todo.status }}</span><span class="s_1zd9e2">&lt;/</span><span class="s_wac0bt">Badge</span><span class="s_1zd9e2">&gt;</span></span>
<span class="line"><span class="s_1zd9e2">    &lt;/</span><span class="s_1uuh8p">div</span><span class="s_1zd9e2">&gt;</span></span>
<span class="line"><span class="s_1zd9e2">    &lt;</span><span class="s_1uuh8p">Button</span><span class="s_1i4ay4"> @click</span><span class="s_1jjt6x">=</span><span class="s_w1p9wo">&quot;</span><span class="s_2575z4">todo.setValue.submit({ status: &#39;Closed&#39; })</span><span class="s_w1p9wo">&quot;</span><span class="s_1zd9e2">&gt;</span></span>
<span class="line"><span class="s_6am9cx">      Mark as Closed</span></span>
<span class="line"><span class="s_1zd9e2">    &lt;/</span><span class="s_1uuh8p">Button</span><span class="s_1zd9e2">&gt;</span></span>
<span class="line"><span class="s_1zd9e2">    &lt;</span><span class="s_1uuh8p">Button</span><span class="s_1i4ay4"> @click</span><span class="s_1jjt6x">=</span><span class="s_w1p9wo">&quot;</span><span class="s_2575z4">todo.sendEmail.submit({ email: todo.owner })</span><span class="s_w1p9wo">&quot;</span><span class="s_1zd9e2">&gt;</span></span>
<span class="line"><span class="s_6am9cx">      Send email</span></span>
<span class="line"><span class="s_1zd9e2">    &lt;/</span><span class="s_1uuh8p">Button</span><span class="s_1zd9e2">&gt;</span></span>
<span class="line"><span class="s_1zd9e2">  &lt;/</span><span class="s_1uuh8p">div</span><span class="s_1zd9e2">&gt;</span></span>
<span class="line"><span class="s_1zd9e2">&lt;/</span><span class="s_1uuh8p">template</span><span class="s_1zd9e2">&gt;</span></span>
<span class="line"><span class="s_1zd9e2">&lt;</span><span class="s_1uuh8p">script</span><span class="s_1i4ay4"> setup</span><span class="s_1zd9e2">&gt;</span></span>
<span class="line"><span class="s_edvzsf">import</span><span class="s_13ahmt"> { </span><span class="s_4q1z3w">createDocumentResource</span><span class="s_1jjt6x">,</span><span class="s_4q1z3w"> Button</span><span class="s_13ahmt"> }</span><span class="s_edvzsf"> from</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">frappe-ui</span><span class="s_w1p9wo">&#39;</span></span>
<span class="line"><span class="s_252irl">let</span><span class="s_2a1oer"> todo</span><span class="s_2ekfrt"> =</span><span class="s_indoxt"> createDocumentResource</span><span class="s_13ahmt">({</span></span>
<span class="line"><span class="s_r4oegk">  doctype</span><span class="s_1jjt6x">:</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">ToDo</span><span class="s_w1p9wo">&#39;</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_r4oegk">  name</span><span class="s_1jjt6x">:</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">1</span><span class="s_w1p9wo">&#39;</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_r4oegk">  whitelistedMethods</span><span class="s_1jjt6x">:</span><span class="s_13ahmt"> {</span></span>
<span class="line"><span class="s_r4oegk">    sendEmail</span><span class="s_1jjt6x">:</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">send_email</span><span class="s_w1p9wo">&#39;</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_13ahmt">  }</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_13ahmt">})</span></span>
<span class="line"><span class="s_1zd9e2">&lt;/</span><span class="s_1uuh8p">script</span><span class="s_1zd9e2">&gt;</span></span></code></pre></div><h2 id="options-api" tabindex="-1">Options API <a class="header-anchor" href="#options-api" aria-label="Permalink to “Options API”">​</a></h2><p>You can also define resources if you are using Options API. You need to register the <code>resourcesPlugin</code> first.</p><p><strong>main.js</strong></p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes tokyo-night github-light s_2cy0ei" tabindex="0" dir="ltr"><code><span class="line"><span class="s_edvzsf">import</span><span class="s_13ahmt"> { </span><span class="s_4q1z3w">resourcesPlugin</span><span class="s_13ahmt"> }</span><span class="s_edvzsf"> from</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">frappe-ui</span><span class="s_w1p9wo">&#39;</span></span>
<span class="line"><span class="s_22m8k2">app</span><span class="s_1jjt6x">.</span><span class="s_indoxt">use</span><span class="s_13ahmt">(</span><span class="s_22m8k2">resourcesPlugin</span><span class="s_13ahmt">)</span></span></code></pre></div><p>In your .vue file, you can declare all your resources under the resources key as functions. The resource object will be available on <code>this.$resources.[name]</code>. In the following example, <code>this.$resources.todo</code> is the resource object.</p><p><strong>Component.vue</strong></p><div class="language-vue"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes tokyo-night github-light s_2cy0ei" tabindex="0" dir="ltr"><code><span class="line"><span class="s_1zd9e2">&lt;</span><span class="s_1uuh8p">script</span><span class="s_1zd9e2">&gt;</span></span>
<span class="line"><span class="s_edvzsf">export</span><span class="s_edvzsf"> default</span><span class="s_13ahmt"> {</span></span>
<span class="line"><span class="s_r4oegk">  resources</span><span class="s_1jjt6x">:</span><span class="s_13ahmt"> {</span></span>
<span class="line"><span class="s_indoxt">    todo</span><span class="s_13ahmt">()</span><span class="s_13ahmt"> {</span></span>
<span class="line"><span class="s_29n2kq">      return</span><span class="s_13ahmt"> {</span></span>
<span class="line"><span class="s_r4oegk">        type</span><span class="s_1jjt6x">:</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">document</span><span class="s_w1p9wo">&#39;</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_r4oegk">        doctype</span><span class="s_1jjt6x">:</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">ToDo</span><span class="s_w1p9wo">&#39;</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_r4oegk">        name</span><span class="s_1jjt6x">:</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">1</span><span class="s_w1p9wo">&#39;</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_13ahmt">      }</span></span>
<span class="line"><span class="s_13ahmt">    }</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_13ahmt">  }</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_13ahmt">}</span></span>
<span class="line"><span class="s_1zd9e2">&lt;/</span><span class="s_1uuh8p">script</span><span class="s_1zd9e2">&gt;</span></span></code></pre></div><h2 id="list-of-options-and-api" tabindex="-1">List of Options and API <a class="header-anchor" href="#list-of-options-and-api" aria-label="Permalink to “List of Options and API”">​</a></h2><p>Here is the list of all options and APIs that are available on a list resource.</p><h3 id="options" tabindex="-1">Options <a class="header-anchor" href="#options" aria-label="Permalink to “Options”">​</a></h3><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes tokyo-night github-light s_2cy0ei" tabindex="0" dir="ltr"><code><span class="line"><span class="s_252irl">let</span><span class="s_2a1oer"> todo</span><span class="s_2ekfrt"> =</span><span class="s_indoxt"> createDocumentResource</span><span class="s_13ahmt">({</span></span>
<span class="line"><span class="s_1th9sy">  // name of the doctype</span></span>
<span class="line"><span class="s_r4oegk">  doctype</span><span class="s_1jjt6x">:</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">ToDo</span><span class="s_w1p9wo">&#39;</span><span class="s_1jjt6x">,</span></span>
<span class="line"></span>
<span class="line"><span class="s_1th9sy">  // name of the record</span></span>
<span class="line"><span class="s_r4oegk">  name</span><span class="s_1jjt6x">:</span><span class="s_w1p9wo"> &#39;&#39;</span><span class="s_1jjt6x">,</span></span>
<span class="line"></span>
<span class="line"><span class="s_1th9sy">  // define doc methods to use as resources</span></span>
<span class="line"><span class="s_r4oegk">  whitelistedMethods</span><span class="s_1jjt6x">:</span><span class="s_13ahmt"> {</span></span>
<span class="line"><span class="s_r4oegk">    sendEmail</span><span class="s_1jjt6x">:</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">send_email</span><span class="s_w1p9wo">&#39;</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_13ahmt">  }</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_1th9sy">  // the above configuration enables the following API</span></span>
<span class="line"><span class="s_1th9sy">  // todo.sendEmail.submit()</span></span>
<span class="line"></span>
<span class="line"><span class="s_1th9sy">  // events</span></span>
<span class="line"><span class="s_1th9sy">  // error can occur from failed request</span></span>
<span class="line"><span class="s_indoxt">  onError</span><span class="s_13ahmt">(</span><span class="s_fsg3al">error</span><span class="s_13ahmt">)</span><span class="s_13ahmt"> {}</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_1th9sy">  // on successful response</span></span>
<span class="line"><span class="s_indoxt">  onSuccess</span><span class="s_13ahmt">(</span><span class="s_fsg3al">data</span><span class="s_13ahmt">)</span><span class="s_13ahmt"> {}</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_1th9sy">  // transform data before setting it</span></span>
<span class="line"><span class="s_indoxt">  transform</span><span class="s_13ahmt">(</span><span class="s_fsg3al">doc</span><span class="s_13ahmt">)</span><span class="s_13ahmt"> {</span></span>
<span class="line"><span class="s_22m8k2">    doc</span><span class="s_1jjt6x">.</span><span class="s_11933w">open</span><span class="s_2ekfrt"> =</span><span class="s_40mev6"> false</span></span>
<span class="line"><span class="s_29n2kq">    return</span><span class="s_22m8k2"> doc</span></span>
<span class="line"><span class="s_13ahmt">  }</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_1th9sy">  // other events</span></span>
<span class="line"><span class="s_r4oegk">  delete</span><span class="s_1jjt6x">:</span><span class="s_13ahmt"> {</span></span>
<span class="line"><span class="s_indoxt">    onSuccess</span><span class="s_13ahmt">()</span><span class="s_13ahmt"> {}</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_indoxt">    onError</span><span class="s_13ahmt">()</span><span class="s_13ahmt"> {}</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_13ahmt">  }</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_r4oegk">  setValue</span><span class="s_1jjt6x">:</span><span class="s_13ahmt"> {</span></span>
<span class="line"><span class="s_indoxt">    onSuccess</span><span class="s_13ahmt">()</span><span class="s_13ahmt"> {}</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_indoxt">    onError</span><span class="s_13ahmt">()</span><span class="s_13ahmt"> {}</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_13ahmt">  }</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_13ahmt">})</span></span></code></pre></div><h3 id="api" tabindex="-1">API <a class="header-anchor" href="#api" aria-label="Permalink to “API”">​</a></h3><p>A document resource is made up of multiple individual resources. In our running example, the resource object that fetches the document is at <code>todos.get</code>. So all the <a href="./resource">properties of a resource</a> are available on this object. Similarly, there are resources for <code>setValue</code>, and <code>delete</code>.</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes tokyo-night github-light s_2cy0ei" tabindex="0" dir="ltr"><code><span class="line"><span class="s_252irl">let</span><span class="s_2a1oer"> todo</span><span class="s_2ekfrt"> =</span><span class="s_indoxt"> createDocumentResource</span><span class="s_13ahmt">({</span><span class="s_fjrnv8">...</span><span class="s_13ahmt">})</span></span>
<span class="line"></span>
<span class="line"><span class="s_22m8k2">todo</span><span class="s_1jjt6x">.</span><span class="s_11933w">doc</span><span class="s_1th9sy"> // doc returned from request</span></span>
<span class="line"><span class="s_22m8k2">todo</span><span class="s_1jjt6x">.</span><span class="s_indoxt">reload</span><span class="s_13ahmt">()</span><span class="s_1th9sy"> // reload the doc</span></span>
<span class="line"></span>
<span class="line"><span class="s_1th9sy">// update options</span></span>
<span class="line"><span class="s_22m8k2">todo</span><span class="s_1jjt6x">.</span><span class="s_indoxt">update</span><span class="s_13ahmt">({</span></span>
<span class="line"><span class="s_r4oegk">  doctype</span><span class="s_1jjt6x">:</span><span class="s_w1p9wo"> &#39;&#39;</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_r4oegk">  name</span><span class="s_1jjt6x">:</span><span class="s_w1p9wo"> &#39;&#39;</span></span>
<span class="line"><span class="s_13ahmt">})</span></span>
<span class="line"></span>
<span class="line"><span class="s_22m8k2">todo</span><span class="s_1jjt6x">.</span><span class="s_11933w">get</span><span class="s_1th9sy"> // doc resource</span></span>
<span class="line"><span class="s_22m8k2">todos</span><span class="s_1jjt6x">.</span><span class="s_22m8k2">get</span><span class="s_1jjt6x">.</span><span class="s_11933w">loading</span><span class="s_1th9sy"> // true when data is being fetched</span></span>
<span class="line"><span class="s_22m8k2">todos</span><span class="s_1jjt6x">.</span><span class="s_22m8k2">get</span><span class="s_1jjt6x">.</span><span class="s_11933w">error</span><span class="s_1th9sy"> // error that occurred from making the request</span></span>
<span class="line"><span class="s_22m8k2">todos</span><span class="s_1jjt6x">.</span><span class="s_22m8k2">get</span><span class="s_1jjt6x">.</span><span class="s_11933w">promise</span><span class="s_1th9sy"> // promise object of the request, can be awaited</span></span>
<span class="line"></span>
<span class="line"><span class="s_1th9sy">// resource to set value(s) on the document</span></span>
<span class="line"><span class="s_22m8k2">todos</span><span class="s_1jjt6x">.</span><span class="s_11933w">setValue</span></span>
<span class="line"><span class="s_22m8k2">todos</span><span class="s_1jjt6x">.</span><span class="s_11933w">setValue</span><span class="s_1jjt6x">.</span><span class="s_indoxt">submit</span><span class="s_13ahmt">({</span></span>
<span class="line"><span class="s_1th9sy">    // field value pairs to set</span></span>
<span class="line"><span class="s_r4oegk">    status</span><span class="s_1jjt6x">:</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">Closed</span><span class="s_w1p9wo">&#39;</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_r4oegk">    description</span><span class="s_1jjt6x">:</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">Updated description</span><span class="s_w1p9wo">&#39;</span></span>
<span class="line"><span class="s_13ahmt">})</span></span>
<span class="line"></span>
<span class="line"><span class="s_1th9sy">// same as setValue but debounced</span></span>
<span class="line"><span class="s_22m8k2">todos</span><span class="s_1jjt6x">.</span><span class="s_11933w">setValueDebounced</span></span>
<span class="line"><span class="s_1th9sy">// will run once after 500ms</span></span>
<span class="line"><span class="s_22m8k2">todos</span><span class="s_1jjt6x">.</span><span class="s_11933w">setValueDebounced</span><span class="s_1jjt6x">.</span><span class="s_indoxt">submit</span><span class="s_13ahmt">({</span></span>
<span class="line"><span class="s_r4oegk">    description</span><span class="s_1jjt6x">:</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">Updated description</span><span class="s_w1p9wo">&#39;</span></span>
<span class="line"><span class="s_13ahmt">})</span></span>
<span class="line"></span>
<span class="line"><span class="s_1th9sy">// resource to delete the document</span></span>
<span class="line"><span class="s_22m8k2">todos</span><span class="s_1jjt6x">.</span><span class="s_11933w">delete</span></span>
<span class="line"><span class="s_22m8k2">todos</span><span class="s_1jjt6x">.</span><span class="s_11933w">delete</span><span class="s_1jjt6x">.</span><span class="s_indoxt">submit</span><span class="s_13ahmt">()</span></span>
<span class="line"></span>
<span class="line"><span class="s_1th9sy">// if whitelistedMethods is defined</span></span>
<span class="line"><span class="s_1th9sy">// you get a resource for each whitelisted method</span></span>
<span class="line"><span class="s_22m8k2">todos</span><span class="s_1jjt6x">.</span><span class="s_11933w">sendEmail</span></span>
<span class="line"><span class="s_22m8k2">todos</span><span class="s_1jjt6x">.</span><span class="s_22m8k2">sendEmail</span><span class="s_1jjt6x">.</span><span class="s_11933w">submit</span></span>
<span class="line"><span class="s_22m8k2">todos</span><span class="s_1jjt6x">.</span><span class="s_22m8k2">sendEmail</span><span class="s_1jjt6x">.</span><span class="s_11933w">loading</span></span></code></pre></div>`,19)])])}const u=a(c,[["render",e]]);export{h as __pageData,u as default};
