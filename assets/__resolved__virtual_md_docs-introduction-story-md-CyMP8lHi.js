const html = `<h1 id="what-is-frappe-ui" tabindex="-1">What is Frappe UI? <a class="header-anchor" href="#what-is-frappe-ui" aria-hidden="true">#</a></h1>
<p>Frappe UI is a set of components and utilities to build frontend apps based on
the <a href="https://frappeframework.com" target="_blank">Frappe Framework</a>.</p>
<p>Along with generic components which are required to build a frontend like
Button, Link, Dialog, etc., frappe-ui also contains utilities for handling
server-side data fetching, directives and utilities.</p>
<p><strong>Usage example</strong></p>
<pre><code class="language-vue"><div class="htw-relative htw-not-prose __histoire-code"><div class="htw-absolute htw-top-0 htw-right-0 htw-text-xs htw-text-white/40">vue</div><pre class="shiki github-dark" style="background-color: #0d1117"><code><span class="line"><span style="color: #C9D1D9">&lt;</span><span style="color: #7EE787">script</span><span style="color: #C9D1D9"> </span><span style="color: #79C0FF">setup</span><span style="color: #C9D1D9">&gt;</span></span>
<span class="line"><span style="color: #FF7B72">import</span><span style="color: #C9D1D9"> { Button, LoadingText, createResource } </span><span style="color: #FF7B72">from</span><span style="color: #C9D1D9"> </span><span style="color: #A5D6FF">&#39;frappe-ui&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color: #FF7B72">let</span><span style="color: #C9D1D9"> todos </span><span style="color: #FF7B72">=</span><span style="color: #C9D1D9"> </span><span style="color: #D2A8FF">createResource</span><span style="color: #C9D1D9">({</span></span>
<span class="line"><span style="color: #C9D1D9">  type: </span><span style="color: #A5D6FF">&#39;list&#39;</span><span style="color: #C9D1D9">,</span></span>
<span class="line"><span style="color: #C9D1D9">  doctype: </span><span style="color: #A5D6FF">&#39;ToDo&#39;</span><span style="color: #C9D1D9">,</span></span>
<span class="line"><span style="color: #C9D1D9">  fields: [</span><span style="color: #A5D6FF">&#39;name&#39;</span><span style="color: #C9D1D9">, </span><span style="color: #A5D6FF">&#39;description&#39;</span><span style="color: #C9D1D9">],</span></span>
<span class="line"><span style="color: #C9D1D9">  cache: </span><span style="color: #A5D6FF">&#39;ToDos&#39;</span><span style="color: #C9D1D9">,</span></span>
<span class="line"><span style="color: #C9D1D9">  auto: </span><span style="color: #79C0FF">true</span><span style="color: #C9D1D9">,</span></span>
<span class="line"><span style="color: #C9D1D9">})</span></span>
<span class="line"><span style="color: #C9D1D9">&lt;/</span><span style="color: #7EE787">script</span><span style="color: #C9D1D9">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color: #C9D1D9">&lt;</span><span style="color: #7EE787">template</span><span style="color: #C9D1D9">&gt;</span></span>
<span class="line"><span style="color: #C9D1D9">  &lt;</span><span style="color: #FFA198; font-style: italic">LoadingText</span><span style="color: #C9D1D9"> </span><span style="color: #79C0FF">v-if</span><span style="color: #C9D1D9">=</span><span style="color: #A5D6FF">&quot;todos.loading&quot;</span><span style="color: #C9D1D9"> /&gt;</span></span>
<span class="line"><span style="color: #C9D1D9">  &lt;</span><span style="color: #7EE787">ul</span><span style="color: #C9D1D9"> </span><span style="color: #79C0FF">v-else</span><span style="color: #C9D1D9">&gt;</span></span>
<span class="line"><span style="color: #C9D1D9">    &lt;</span><span style="color: #7EE787">li</span><span style="color: #C9D1D9"> </span><span style="color: #79C0FF">v-for</span><span style="color: #C9D1D9">=</span><span style="color: #A5D6FF">&quot;todo in todos.data&quot;</span><span style="color: #C9D1D9"> </span><span style="color: #79C0FF">:key</span><span style="color: #C9D1D9">=</span><span style="color: #A5D6FF">&quot;todo.name&quot;</span><span style="color: #C9D1D9">&gt;</span></span>
<span class="line"><span style="color: #C9D1D9">      {{ todo.description }}</span></span>
<span class="line"><span style="color: #C9D1D9">    &lt;/</span><span style="color: #7EE787">li</span><span style="color: #C9D1D9">&gt;</span></span>
<span class="line"><span style="color: #C9D1D9">  &lt;/</span><span style="color: #7EE787">ul</span><span style="color: #C9D1D9">&gt;</span></span>
<span class="line"><span style="color: #C9D1D9">  &lt;</span><span style="color: #7EE787">Button</span><span style="color: #C9D1D9">&gt;Add ToDo&lt;/</span><span style="color: #7EE787">Button</span><span style="color: #C9D1D9">&gt;</span></span>
<span class="line"><span style="color: #C9D1D9">&lt;/</span><span style="color: #7EE787">template</span><span style="color: #C9D1D9">&gt;</span></span>
<span class="line"></span></code></pre></div></code></pre>
<h2 id="dependencies" tabindex="-1">Dependencies <a class="header-anchor" href="#dependencies" aria-hidden="true">#</a></h2>
<p>Frappe UI is built on top of the following amazing projects –</p>
<ul>
<li><a href="https://vuejs.org" target="_blank">Vue 3</a></li>
<li><a href="https://tailwindcss.com" target="_blank">TailwindCSS</a></li>
<li><a href="https://headlessui.com" target="_blank">Headless UI</a></li>
<li><a href="https://popper.js.org/" target="_blank">PopperJS</a></li>
<li><a href="https://tiptap.dev" target="_blank">TipTap</a></li>
<li><a href="https://feathericons.com" target="_blank">Feather Icons</a></li>
</ul>
<p>See full list of dependencies:
<a href="https://github.com/frappe/frappe-ui/blob/main/package.json" target="_blank">package.json</a></p>
<h2 id="motivation" tabindex="-1">Motivation <a class="header-anchor" href="#motivation" aria-hidden="true">#</a></h2>
<p>In 2019, I started building <a href="https://frappebooks.com" target="_blank">Frappe Books</a> based on an
experimental design system by <a href="https://timeless.co" target="_blank">Timeless</a>. As the product
got built, a set of small reusable components (like Button, Dialog, Card, etc.)
were also built.</p>
<p>After the launch of Frappe Books (and me dropping the project) I moved on to
building the UI for <a href="https://frappecloud.com" target="_blank">Frappe Cloud</a> in 2020. It also
needed these components, so I copy-pasted them from Frappe Books to Frappe
Cloud. These components evolved over time in Frappe Cloud. After working on the
Frappe Cloud UI for about a year and a half, I moved on to my next project.</p>
<p>At the start of 2022, I started working on
<a href="https://github.com/frappe/gameplan" target="_blank">Gameplan</a>. I didn't want to copy-paste yet
again, so I extracted these components in a separate package called
<a href="https://npm.im/frappe-ui" target="_blank"><code>frappe-ui</code></a>. This package is being developed in
parallel along with the Gameplan project. I keep adding generic components and
utilities useful for frontend development.</p>
<h2 id="products" tabindex="-1">Products <a class="header-anchor" href="#products" aria-hidden="true">#</a></h2>
<p>Frappe UI is now being used in a lot of products by Frappe.</p>
<ul>
<li><a href="https://frappecloud.com" target="_blank">Frappe Cloud</a></li>
<li><a href="https://github.com/frappe/gameplan" target="_blank">Gameplan</a></li>
<li><a href="https://frappedesk.com" target="_blank">Frappe Desk</a></li>
<li><a href="https://github.com/frappe/insights" target="_blank">Frappe Insights</a></li>
<li><a href="https://github.com/frappe/drive" target="_blank">Frappe Drive</a></li>
</ul>
<h2 id="license" tabindex="-1">License <a class="header-anchor" href="#license" aria-hidden="true">#</a></h2>
<p>Frappe UI is MIT licensed</p>
`;
const frontmatter = {};
const relativePath = "docs/Introduction.story.md";
export {
  frontmatter,
  html,
  relativePath
};
