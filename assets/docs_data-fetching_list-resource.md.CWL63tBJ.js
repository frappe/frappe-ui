import{af as a,o as n,c as p,aw as l}from"./chunks/framework.C5eMwUvB.js";const h=JSON.parse('{"title":"List Resource","description":"","frontmatter":{},"headers":[],"relativePath":"docs/data-fetching/list-resource.md","filePath":"docs/data-fetching/list-resource.md","lastUpdated":1767261019000}'),c={name:"docs/data-fetching/list-resource.md"};function e(t,s,o,_,i,r){return n(),p("div",null,[...s[0]||(s[0]=[l(`<h1 id="list-resource" tabindex="-1">List Resource <a class="header-anchor" href="#list-resource" aria-label="Permalink to “List Resource”">​</a></h1><p>List Resource is a wrapper on top of <a href="./resource">Resource</a> for working with lists. This feature only works with a Frappe Framework backend as of now.</p><h2 id="usage" tabindex="-1">Usage <a class="header-anchor" href="#usage" aria-label="Permalink to “Usage”">​</a></h2><p>A list resource knows how to fetch records of a DocType from a Frappe Framework backend so there is no need to specify the url. Instead you only define <code>doctype</code>, <code>fields</code>, <code>filters</code>, etc. You also get methods like <code>next()</code>, <code>setValue()</code>, etc.</p><div class="language-vue"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes tokyo-night github-light s_2cy0ei" tabindex="0" dir="ltr"><code><span class="line"><span class="s_1zd9e2">&lt;</span><span class="s_1uuh8p">template</span><span class="s_1zd9e2">&gt;</span></span>
<span class="line"><span class="s_1zd9e2">  &lt;</span><span class="s_1uuh8p">div</span><span class="s_1i4ay4"> class</span><span class="s_1jjt6x">=</span><span class="s_w1p9wo">&quot;</span><span class="s_2575z4">space-y-4</span><span class="s_w1p9wo">&quot;</span><span class="s_1zd9e2">&gt;</span></span>
<span class="line"><span class="s_1zd9e2">    &lt;</span><span class="s_1uuh8p">div</span></span>
<span class="line"><span class="s_1i4ay4">      class</span><span class="s_1jjt6x">=</span><span class="s_w1p9wo">&quot;</span><span class="s_2575z4">flex items-center justify-between</span><span class="s_w1p9wo">&quot;</span></span>
<span class="line"><span class="s_1i4ay4">      v-for</span><span class="s_1jjt6x">=</span><span class="s_w1p9wo">&quot;</span><span class="s_2575z4">todo in todos.data</span><span class="s_w1p9wo">&quot;</span></span>
<span class="line"><span class="s_1i4ay4">      :key</span><span class="s_1jjt6x">=</span><span class="s_w1p9wo">&quot;</span><span class="s_2575z4">todo.name</span><span class="s_w1p9wo">&quot;</span></span>
<span class="line"><span class="s_1zd9e2">    &gt;</span></span>
<span class="line"><span class="s_1zd9e2">      &lt;</span><span class="s_1uuh8p">div</span><span class="s_1zd9e2">&gt;</span></span>
<span class="line"><span class="s_6am9cx">        {{ todo.description }}</span></span>
<span class="line"><span class="s_1zd9e2">      &lt;/</span><span class="s_1uuh8p">div</span><span class="s_1zd9e2">&gt;</span></span>
<span class="line"><span class="s_1zd9e2">      &lt;</span><span class="s_wac0bt">Badge</span><span class="s_1zd9e2">&gt;</span><span class="s_6am9cx">{{ todo.status }}</span><span class="s_1zd9e2">&lt;/</span><span class="s_wac0bt">Badge</span><span class="s_1zd9e2">&gt;</span></span>
<span class="line"><span class="s_1zd9e2">    &lt;/</span><span class="s_1uuh8p">div</span><span class="s_1zd9e2">&gt;</span></span>
<span class="line"><span class="s_1zd9e2">  &lt;/</span><span class="s_1uuh8p">div</span><span class="s_1zd9e2">&gt;</span></span>
<span class="line"><span class="s_1zd9e2">  &lt;</span><span class="s_1uuh8p">Button</span><span class="s_1i4ay4"> @click</span><span class="s_1jjt6x">=</span><span class="s_w1p9wo">&quot;</span><span class="s_2575z4">todos.next()</span><span class="s_w1p9wo">&quot;</span><span class="s_1zd9e2">&gt;</span><span class="s_6am9cx"> Next Page </span><span class="s_1zd9e2">&lt;/</span><span class="s_1uuh8p">Button</span><span class="s_1zd9e2">&gt;</span></span>
<span class="line"><span class="s_1zd9e2">&lt;/</span><span class="s_1uuh8p">template</span><span class="s_1zd9e2">&gt;</span></span>
<span class="line"><span class="s_1zd9e2">&lt;</span><span class="s_1uuh8p">script</span><span class="s_1i4ay4"> setup</span><span class="s_1zd9e2">&gt;</span></span>
<span class="line"><span class="s_edvzsf">import</span><span class="s_13ahmt"> { </span><span class="s_4q1z3w">createListResource</span><span class="s_13ahmt"> }</span><span class="s_edvzsf"> from</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">frappe-ui</span><span class="s_w1p9wo">&#39;</span></span>
<span class="line"><span class="s_252irl">let</span><span class="s_2a1oer"> todos</span><span class="s_2ekfrt"> =</span><span class="s_indoxt"> createListResource</span><span class="s_13ahmt">({</span></span>
<span class="line"><span class="s_r4oegk">  doctype</span><span class="s_1jjt6x">:</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">ToDo</span><span class="s_w1p9wo">&#39;</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_r4oegk">  fields</span><span class="s_1jjt6x">:</span><span class="s_13ahmt"> [</span><span class="s_w1p9wo">&#39;</span><span class="s_2575z4">name</span><span class="s_w1p9wo">&#39;</span><span class="s_1jjt6x">,</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">description</span><span class="s_w1p9wo">&#39;</span><span class="s_1jjt6x">,</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">status</span><span class="s_w1p9wo">&#39;</span><span class="s_13ahmt">]</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_r4oegk">  orderBy</span><span class="s_1jjt6x">:</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">creation desc</span><span class="s_w1p9wo">&#39;</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_r4oegk">  start</span><span class="s_1jjt6x">:</span><span class="s_40mev6"> 0</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_r4oegk">  pageLength</span><span class="s_1jjt6x">:</span><span class="s_40mev6"> 5</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_13ahmt">})</span></span>
<span class="line"><span class="s_22m8k2">todos</span><span class="s_1jjt6x">.</span><span class="s_indoxt">fetch</span><span class="s_13ahmt">()</span></span>
<span class="line"><span class="s_1zd9e2">&lt;/</span><span class="s_1uuh8p">script</span><span class="s_1zd9e2">&gt;</span></span></code></pre></div><h2 id="options-api" tabindex="-1">Options API <a class="header-anchor" href="#options-api" aria-label="Permalink to “Options API”">​</a></h2><p>You can also define resources if you are using Options API. You need to register the <code>resourcesPlugin</code> first.</p><p><strong>main.js</strong></p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes tokyo-night github-light s_2cy0ei" tabindex="0" dir="ltr"><code><span class="line"><span class="s_edvzsf">import</span><span class="s_13ahmt"> { </span><span class="s_4q1z3w">resourcesPlugin</span><span class="s_13ahmt"> }</span><span class="s_edvzsf"> from</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">frappe-ui</span><span class="s_w1p9wo">&#39;</span></span>
<span class="line"><span class="s_22m8k2">app</span><span class="s_1jjt6x">.</span><span class="s_indoxt">use</span><span class="s_13ahmt">(</span><span class="s_22m8k2">resourcesPlugin</span><span class="s_13ahmt">)</span></span></code></pre></div><p>In your .vue file, you can declare all your resources under the resources key as functions. The resource object will be available on <code>this.$resources.[name]</code>. In the following example, <code>this.$resources.todos</code> is the resource object.</p><p><strong>Component.vue</strong></p><div class="language-vue"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes tokyo-night github-light s_2cy0ei" tabindex="0" dir="ltr"><code><span class="line"><span class="s_1zd9e2">&lt;</span><span class="s_1uuh8p">script</span><span class="s_1zd9e2">&gt;</span></span>
<span class="line"><span class="s_edvzsf">export</span><span class="s_edvzsf"> default</span><span class="s_13ahmt"> {</span></span>
<span class="line"><span class="s_r4oegk">  resources</span><span class="s_1jjt6x">:</span><span class="s_13ahmt"> {</span></span>
<span class="line"><span class="s_indoxt">    todos</span><span class="s_13ahmt">()</span><span class="s_13ahmt"> {</span></span>
<span class="line"><span class="s_29n2kq">      return</span><span class="s_13ahmt"> {</span></span>
<span class="line"><span class="s_r4oegk">        type</span><span class="s_1jjt6x">:</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">list</span><span class="s_w1p9wo">&#39;</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_r4oegk">        doctype</span><span class="s_1jjt6x">:</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">ToDo</span><span class="s_w1p9wo">&#39;</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_r4oegk">        fields</span><span class="s_1jjt6x">:</span><span class="s_13ahmt"> [</span><span class="s_w1p9wo">&#39;</span><span class="s_2575z4">name</span><span class="s_w1p9wo">&#39;</span><span class="s_1jjt6x">,</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">description</span><span class="s_w1p9wo">&#39;</span><span class="s_1jjt6x">,</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">status</span><span class="s_w1p9wo">&#39;</span><span class="s_13ahmt">]</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_r4oegk">        orderBy</span><span class="s_1jjt6x">:</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">creation desc</span><span class="s_w1p9wo">&#39;</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_r4oegk">        start</span><span class="s_1jjt6x">:</span><span class="s_40mev6"> 0</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_r4oegk">        pageLength</span><span class="s_1jjt6x">:</span><span class="s_40mev6"> 5</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_r4oegk">        auto</span><span class="s_1jjt6x">:</span><span class="s_40mev6"> true</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_13ahmt">      }</span></span>
<span class="line"><span class="s_13ahmt">    }</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_13ahmt">  }</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_13ahmt">}</span></span>
<span class="line"><span class="s_1zd9e2">&lt;/</span><span class="s_1uuh8p">script</span><span class="s_1zd9e2">&gt;</span></span></code></pre></div><h2 id="list-of-options-and-api" tabindex="-1">List of Options and API <a class="header-anchor" href="#list-of-options-and-api" aria-label="Permalink to “List of Options and API”">​</a></h2><p>Here is the list of all options and APIs that are available on a list resource.</p><h3 id="options" tabindex="-1">Options <a class="header-anchor" href="#options" aria-label="Permalink to “Options”">​</a></h3><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes tokyo-night github-light s_2cy0ei" tabindex="0" dir="ltr"><code><span class="line"><span class="s_252irl">let</span><span class="s_2a1oer"> todos</span><span class="s_2ekfrt"> =</span><span class="s_indoxt"> createListResource</span><span class="s_13ahmt">({</span></span>
<span class="line"><span class="s_1th9sy">    // name of the doctype</span></span>
<span class="line"><span class="s_r4oegk">    doctype</span><span class="s_1jjt6x">:</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">ToDo</span><span class="s_w1p9wo">&#39;</span><span class="s_1jjt6x">,</span></span>
<span class="line"></span>
<span class="line"><span class="s_1th9sy">    // list of fields</span></span>
<span class="line"><span class="s_r4oegk">    fields</span><span class="s_1jjt6x">:</span><span class="s_13ahmt"> [</span><span class="s_w1p9wo">&#39;</span><span class="s_2575z4">name</span><span class="s_w1p9wo">&#39;</span><span class="s_1jjt6x">,</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">description</span><span class="s_w1p9wo">&#39;</span><span class="s_1jjt6x">,</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">status</span><span class="s_w1p9wo">&#39;</span><span class="s_1jjt6x">,</span><span class="s_fjrnv8"> ...</span><span class="s_13ahmt">]</span><span class="s_1jjt6x">,</span></span>
<span class="line"></span>
<span class="line"><span class="s_1th9sy">    // object of filters to apply</span></span>
<span class="line"><span class="s_r4oegk">    filters</span><span class="s_1jjt6x">:</span><span class="s_13ahmt"> {</span></span>
<span class="line"><span class="s_r4oegk">        status</span><span class="s_1jjt6x">:</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">Open</span><span class="s_w1p9wo">&#39;</span></span>
<span class="line"><span class="s_13ahmt">    }</span><span class="s_1jjt6x">,</span></span>
<span class="line"></span>
<span class="line"><span class="s_1th9sy">    // the order in which records must be sorted</span></span>
<span class="line"><span class="s_r4oegk">    orderBy</span><span class="s_1jjt6x">:</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">creation desc</span><span class="s_w1p9wo">&#39;</span><span class="s_1jjt6x">,</span></span>
<span class="line"></span>
<span class="line"><span class="s_1th9sy">    // index from which records should be fetched</span></span>
<span class="line"><span class="s_1th9sy">    // default value is 0</span></span>
<span class="line"><span class="s_r4oegk">    start</span><span class="s_1jjt6x">:</span><span class="s_40mev6"> 0</span><span class="s_1jjt6x">,</span></span>
<span class="line"></span>
<span class="line"><span class="s_1th9sy">    // number of records to fetch in a single request</span></span>
<span class="line"><span class="s_1th9sy">    // default value is 20</span></span>
<span class="line"><span class="s_r4oegk">    pageLength</span><span class="s_1jjt6x">:</span><span class="s_40mev6"> 20</span><span class="s_1jjt6x">,</span></span>
<span class="line"></span>
<span class="line"><span class="s_1th9sy">    // parent doctype when you are fetching records of a child doctype</span></span>
<span class="line"><span class="s_r4oegk">    parent</span><span class="s_1jjt6x">:</span><span class="s_40mev6"> null</span><span class="s_1jjt6x">,</span></span>
<span class="line"></span>
<span class="line"><span class="s_1th9sy">    // set to 1 to enable debugging of list query</span></span>
<span class="line"><span class="s_r4oegk">    debug</span><span class="s_1jjt6x">:</span><span class="s_40mev6"> 0</span><span class="s_1jjt6x">,</span></span>
<span class="line"></span>
<span class="line"><span class="s_1th9sy">    // cache key to cache the resource</span></span>
<span class="line"><span class="s_1th9sy">    // can be a string</span></span>
<span class="line"><span class="s_r4oegk">    cache</span><span class="s_1jjt6x">:</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">todos</span><span class="s_w1p9wo">&#39;</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_1th9sy">    // or an array that can be serialized</span></span>
<span class="line"><span class="s_r4oegk">    cache</span><span class="s_1jjt6x">:</span><span class="s_13ahmt"> [</span><span class="s_w1p9wo">&#39;</span><span class="s_2575z4">todos</span><span class="s_w1p9wo">&#39;</span><span class="s_1jjt6x">,</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">faris@frappe.io</span><span class="s_w1p9wo">&#39;</span><span class="s_13ahmt">]</span><span class="s_1jjt6x">,</span></span>
<span class="line"></span>
<span class="line"><span class="s_1th9sy">    // default value for url is &quot;frappe.client.get_list&quot;</span></span>
<span class="line"><span class="s_1th9sy">    // specify url if you want to use a custom API method</span></span>
<span class="line"><span class="s_r4oegk">    url</span><span class="s_1jjt6x">:</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">todo_app.api.get_todos</span><span class="s_w1p9wo">&#39;</span><span class="s_1jjt6x">,</span></span>
<span class="line"></span>
<span class="line"><span class="s_1th9sy">    // make the first request automatically</span></span>
<span class="line"><span class="s_r4oegk">    auto</span><span class="s_1jjt6x">:</span><span class="s_40mev6"> true</span><span class="s_1jjt6x">,</span></span>
<span class="line"></span>
<span class="line"><span class="s_1th9sy">    // events</span></span>
<span class="line"><span class="s_1th9sy">    // error can occur from failed request</span></span>
<span class="line"><span class="s_indoxt">    onError</span><span class="s_13ahmt">(</span><span class="s_fsg3al">error</span><span class="s_13ahmt">)</span><span class="s_13ahmt"> {</span></span>
<span class="line"></span>
<span class="line"><span class="s_13ahmt">    }</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_1th9sy">    // on successful response</span></span>
<span class="line"><span class="s_indoxt">    onSuccess</span><span class="s_13ahmt">(</span><span class="s_fsg3al">data</span><span class="s_13ahmt">)</span><span class="s_13ahmt"> {</span></span>
<span class="line"></span>
<span class="line"><span class="s_13ahmt">    }</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_1th9sy">    // transform data before setting it</span></span>
<span class="line"><span class="s_indoxt">    transform</span><span class="s_13ahmt">(</span><span class="s_fsg3al">data</span><span class="s_13ahmt">)</span><span class="s_13ahmt"> {</span></span>
<span class="line"><span class="s_50ecpt">      for</span><span class="s_13ahmt"> (</span><span class="s_252irl">let</span><span class="s_2a1oer"> d</span><span class="s_2ekfrt"> of</span><span class="s_22m8k2"> data</span><span class="s_13ahmt">) {</span></span>
<span class="line"><span class="s_22m8k2">        d</span><span class="s_1jjt6x">.</span><span class="s_11933w">open</span><span class="s_2ekfrt"> =</span><span class="s_40mev6"> false</span></span>
<span class="line"><span class="s_13ahmt">      }</span></span>
<span class="line"><span class="s_29n2kq">      return</span><span class="s_22m8k2"> data</span></span>
<span class="line"><span class="s_13ahmt">    }</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_1th9sy">    // other events</span></span>
<span class="line"><span class="s_r4oegk">    fetchOne</span><span class="s_1jjt6x">:</span><span class="s_13ahmt"> {</span></span>
<span class="line"><span class="s_indoxt">        onSuccess</span><span class="s_13ahmt">()</span><span class="s_13ahmt"> {}</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_indoxt">        onError</span><span class="s_13ahmt">()</span><span class="s_13ahmt"> {}</span></span>
<span class="line"><span class="s_13ahmt">    }</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_r4oegk">    insert</span><span class="s_1jjt6x">:</span><span class="s_13ahmt"> {</span></span>
<span class="line"><span class="s_indoxt">        onSuccess</span><span class="s_13ahmt">()</span><span class="s_13ahmt"> {}</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_indoxt">        onError</span><span class="s_13ahmt">()</span><span class="s_13ahmt"> {}</span></span>
<span class="line"><span class="s_13ahmt">    }</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_r4oegk">    delete</span><span class="s_1jjt6x">:</span><span class="s_13ahmt"> {</span></span>
<span class="line"><span class="s_indoxt">        onSuccess</span><span class="s_13ahmt">()</span><span class="s_13ahmt"> {}</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_indoxt">        onError</span><span class="s_13ahmt">()</span><span class="s_13ahmt"> {}</span></span>
<span class="line"><span class="s_13ahmt">    }</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_r4oegk">    setValue</span><span class="s_1jjt6x">:</span><span class="s_13ahmt"> {</span></span>
<span class="line"><span class="s_indoxt">        onSuccess</span><span class="s_13ahmt">()</span><span class="s_13ahmt"> {}</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_indoxt">        onError</span><span class="s_13ahmt">()</span><span class="s_13ahmt"> {}</span></span>
<span class="line"><span class="s_13ahmt">    }</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_r4oegk">    runDocMethod</span><span class="s_1jjt6x">:</span><span class="s_13ahmt"> {</span></span>
<span class="line"><span class="s_indoxt">        onSuccess</span><span class="s_13ahmt">()</span><span class="s_13ahmt"> {}</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_indoxt">        onError</span><span class="s_13ahmt">()</span><span class="s_13ahmt"> {}</span></span>
<span class="line"><span class="s_13ahmt">    }</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_13ahmt">})</span></span></code></pre></div><h3 id="api" tabindex="-1">API <a class="header-anchor" href="#api" aria-label="Permalink to “API”">​</a></h3><p>A list resource is made up of multiple individual resources. In our running example, the resource object that fetches the list is at <code>todos.list</code>. So all the <a href="./resource">properties of a resource</a> are available on this object. Similarly, there are resources for <code>fetchOne</code>, <code>setValue</code>, <code>insert</code>, <code>delete</code>, and <code>runDocMethod</code>.</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes tokyo-night github-light s_2cy0ei" tabindex="0" dir="ltr"><code><span class="line"><span class="s_252irl">let</span><span class="s_2a1oer"> todos</span><span class="s_2ekfrt"> =</span><span class="s_indoxt"> createListResource</span><span class="s_13ahmt">({</span><span class="s_fjrnv8">...</span><span class="s_13ahmt">})</span></span>
<span class="line"></span>
<span class="line"><span class="s_22m8k2">todos</span><span class="s_1jjt6x">.</span><span class="s_11933w">data</span><span class="s_1th9sy"> // data returned from request</span></span>
<span class="line"><span class="s_22m8k2">todos</span><span class="s_1jjt6x">.</span><span class="s_11933w">originalData</span><span class="s_1th9sy"> // response data before being transformed</span></span>
<span class="line"><span class="s_22m8k2">todos</span><span class="s_1jjt6x">.</span><span class="s_indoxt">reload</span><span class="s_13ahmt">()</span><span class="s_1th9sy"> // reload the existing list</span></span>
<span class="line"><span class="s_22m8k2">todos</span><span class="s_1jjt6x">.</span><span class="s_indoxt">next</span><span class="s_13ahmt">()</span><span class="s_1th9sy"> // fetch the next page</span></span>
<span class="line"><span class="s_22m8k2">todos</span><span class="s_1jjt6x">.</span><span class="s_11933w">hasNextPage</span><span class="s_1th9sy"> // whether there is next page to fetch</span></span>
<span class="line"></span>
<span class="line"><span class="s_1th9sy">// update list options</span></span>
<span class="line"><span class="s_22m8k2">todos</span><span class="s_1jjt6x">.</span><span class="s_indoxt">update</span><span class="s_13ahmt">({</span></span>
<span class="line"><span class="s_r4oegk">  fields</span><span class="s_1jjt6x">:</span><span class="s_13ahmt"> [</span><span class="s_w1p9wo">&#39;</span><span class="s_2575z4">*</span><span class="s_w1p9wo">&#39;</span><span class="s_13ahmt">]</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_r4oegk">  filters</span><span class="s_1jjt6x">:</span><span class="s_13ahmt"> {</span></span>
<span class="line"><span class="s_r4oegk">    status</span><span class="s_1jjt6x">:</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">Closed</span><span class="s_w1p9wo">&#39;</span></span>
<span class="line"><span class="s_13ahmt">  }</span></span>
<span class="line"><span class="s_13ahmt">})</span></span>
<span class="line"></span>
<span class="line"><span class="s_22m8k2">todos</span><span class="s_1jjt6x">.</span><span class="s_11933w">list</span><span class="s_1th9sy"> // list resource</span></span>
<span class="line"><span class="s_22m8k2">todos</span><span class="s_1jjt6x">.</span><span class="s_22m8k2">list</span><span class="s_1jjt6x">.</span><span class="s_11933w">loading</span><span class="s_1th9sy"> // true when data is being fetched</span></span>
<span class="line"><span class="s_22m8k2">todos</span><span class="s_1jjt6x">.</span><span class="s_22m8k2">list</span><span class="s_1jjt6x">.</span><span class="s_11933w">error</span><span class="s_1th9sy"> // error that occurred from making the request</span></span>
<span class="line"><span class="s_22m8k2">todos</span><span class="s_1jjt6x">.</span><span class="s_22m8k2">list</span><span class="s_1jjt6x">.</span><span class="s_11933w">promise</span><span class="s_1th9sy"> // promise object of the request, can be awaited</span></span>
<span class="line"></span>
<span class="line"><span class="s_1th9sy">// resource to fetch and update a single record in the list</span></span>
<span class="line"><span class="s_22m8k2">todos</span><span class="s_1jjt6x">.</span><span class="s_11933w">fetchOne</span></span>
<span class="line"><span class="s_1th9sy">// pass the name of the record to fetch that record and update the list</span></span>
<span class="line"><span class="s_22m8k2">todos</span><span class="s_1jjt6x">.</span><span class="s_11933w">fetchOne</span><span class="s_1jjt6x">.</span><span class="s_indoxt">submit</span><span class="s_13ahmt">(</span><span class="s_22m8k2">name</span><span class="s_13ahmt">)</span></span>
<span class="line"></span>
<span class="line"><span class="s_1th9sy">// resource to set value(s) for a single record in the list</span></span>
<span class="line"><span class="s_22m8k2">todos</span><span class="s_1jjt6x">.</span><span class="s_11933w">setValue</span></span>
<span class="line"><span class="s_22m8k2">todos</span><span class="s_1jjt6x">.</span><span class="s_11933w">setValue</span><span class="s_1jjt6x">.</span><span class="s_indoxt">submit</span><span class="s_13ahmt">({</span></span>
<span class="line"><span class="s_1th9sy">    // id of the record</span></span>
<span class="line"><span class="s_r4oegk">    name</span><span class="s_1jjt6x">:</span><span class="s_w1p9wo"> &#39;&#39;</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_1th9sy">    // field value pairs to set</span></span>
<span class="line"><span class="s_r4oegk">    status</span><span class="s_1jjt6x">:</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">Closed</span><span class="s_w1p9wo">&#39;</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_r4oegk">    description</span><span class="s_1jjt6x">:</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">Updated description</span><span class="s_w1p9wo">&#39;</span></span>
<span class="line"><span class="s_13ahmt">})</span></span>
<span class="line"></span>
<span class="line"><span class="s_1th9sy">// resource to insert a new record in the list</span></span>
<span class="line"><span class="s_22m8k2">todos</span><span class="s_1jjt6x">.</span><span class="s_11933w">insert</span></span>
<span class="line"><span class="s_22m8k2">todos</span><span class="s_1jjt6x">.</span><span class="s_11933w">insert</span><span class="s_1jjt6x">.</span><span class="s_indoxt">submit</span><span class="s_13ahmt">({</span></span>
<span class="line"><span class="s_r4oegk">    description</span><span class="s_1jjt6x">:</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">New todo</span><span class="s_w1p9wo">&#39;</span></span>
<span class="line"><span class="s_13ahmt">})</span></span>
<span class="line"></span>
<span class="line"><span class="s_1th9sy">// resource to delete a single record</span></span>
<span class="line"><span class="s_22m8k2">todos</span><span class="s_1jjt6x">.</span><span class="s_11933w">delete</span></span>
<span class="line"><span class="s_22m8k2">todos</span><span class="s_1jjt6x">.</span><span class="s_11933w">delete</span><span class="s_1jjt6x">.</span><span class="s_indoxt">submit</span><span class="s_13ahmt">(</span><span class="s_22m8k2">name</span><span class="s_13ahmt">)</span></span>
<span class="line"></span>
<span class="line"><span class="s_1th9sy">// resource to run a doc method</span></span>
<span class="line"><span class="s_22m8k2">todos</span><span class="s_1jjt6x">.</span><span class="s_11933w">runDocMethod</span></span>
<span class="line"><span class="s_22m8k2">todos</span><span class="s_1jjt6x">.</span><span class="s_11933w">runDocMethod</span><span class="s_1jjt6x">.</span><span class="s_indoxt">submit</span><span class="s_13ahmt">({</span></span>
<span class="line"><span class="s_1th9sy">    // name of the doc method</span></span>
<span class="line"><span class="s_r4oegk">    method</span><span class="s_1jjt6x">:</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">send_email</span><span class="s_w1p9wo">&#39;</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_1th9sy">    // name of the record</span></span>
<span class="line"><span class="s_r4oegk">    name</span><span class="s_1jjt6x">:</span><span class="s_w1p9wo"> &#39;&#39;</span><span class="s_1jjt6x">,</span></span>
<span class="line"><span class="s_1th9sy">    // params to pass to the method</span></span>
<span class="line"><span class="s_r4oegk">    email</span><span class="s_1jjt6x">:</span><span class="s_w1p9wo"> &#39;</span><span class="s_2575z4">test@example.com</span><span class="s_w1p9wo">&#39;</span></span>
<span class="line"><span class="s_13ahmt">})</span></span></code></pre></div>`,19)])])}const j=a(c,[["render",e]]);export{h as __pageData,j as default};
