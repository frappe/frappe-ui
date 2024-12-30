const html = `<h2 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-hidden="true">#</a></h2>
<h3 id="row-key" tabindex="-1">Row Key <a class="header-anchor" href="#row-key" aria-hidden="true">#</a></h3>
<p><code>row-key</code> is a unique key which is used to identify each row in the list. It is
required to be passed in the <code>row</code> object.</p>
<h3 id="column" tabindex="-1">Column <a class="header-anchor" href="#column" aria-hidden="true">#</a></h3>
<ol>
<li>
<p><code>label</code> &amp; <code>key</code> is required in column object.</p>
</li>
<li>
<p><code>width</code> is optional and it is used to set column width in list</p>
<ol>
<li>If you need a column to be <code>3</code> times a default column then add <code>3</code>. if
width is not mentioned default will be <code>1</code></li>
<li>You can also add custom width in px and rem e.g <code>300px</code> or <code>12rem</code></li>
<li>Combination of both can also be used.</li>
</ol>
</li>
<li>
<p><code>align</code> is also optional. You can change the alignment of the content in the
column by setting it as.</p>
<ol>
<li><code>start</code> or <code>left</code> (default)</li>
<li><code>center</code> or <code>middle</code></li>
<li><code>end</code> or <code>right</code></li>
</ol>
</li>
<li>
<p>You can add more attributes which can be used to render custom column header
items.</p>
</li>
</ol>
<h3 id="row" tabindex="-1">Row <a class="header-anchor" href="#row" aria-hidden="true">#</a></h3>
<ol>
<li>
<p>The row object must contain a unique_key which was mentioned in ListView
<code>row-key</code></p>
</li>
<li>
<p>Then you can add the row fields as key value pairs and each field can be an
object or a string (to handle custom rendering)</p>
<pre><code><div class="htw-relative htw-not-prose __histoire-code"><div class="htw-absolute htw-top-0 htw-right-0 htw-text-xs htw-text-white/40"></div><pre class="shiki github-dark" style="background-color: #0d1117"><code><span class="line"><span style="color: #c9d1d9">{</span></span>
<span class="line"><span style="color: #c9d1d9">	// unique_key &#39;id&#39;</span></span>
<span class="line"><span style="color: #c9d1d9">	id: 1,</span></span>
<span class="line"><span style="color: #c9d1d9"></span></span>
<span class="line"><span style="color: #c9d1d9">	// row fields</span></span>
<span class="line"><span style="color: #c9d1d9">	name: &#39;John Doe&#39;,</span></span>
<span class="line"><span style="color: #c9d1d9">	age: 25,</span></span>
<span class="line"><span style="color: #c9d1d9">	email: &#39;john@doe.com&#39;,</span></span>
<span class="line"><span style="color: #c9d1d9">}</span></span>
<span class="line"><span style="color: #c9d1d9"></span></span></code></pre></div></code></pre>
<p>E.g field value as an object (to handle custom rendering), but make sure it
has a <code>label</code> attribute which holds the actual value to be shown</p>
<pre><code><div class="htw-relative htw-not-prose __histoire-code"><div class="htw-absolute htw-top-0 htw-right-0 htw-text-xs htw-text-white/40"></div><pre class="shiki github-dark" style="background-color: #0d1117"><code><span class="line"><span style="color: #c9d1d9">row: {</span></span>
<span class="line"><span style="color: #c9d1d9">	name: {</span></span>
<span class="line"><span style="color: #c9d1d9">		label: &#39;John Doe&#39;,</span></span>
<span class="line"><span style="color: #c9d1d9">		image: &#39;/johndoe.jpg&#39;,</span></span>
<span class="line"><span style="color: #c9d1d9">	},</span></span>
<span class="line"><span style="color: #c9d1d9">	age: 25,</span></span>
<span class="line"><span style="color: #c9d1d9">	status: {</span></span>
<span class="line"><span style="color: #c9d1d9">		label: &#39;Active&#39;,</span></span>
<span class="line"><span style="color: #c9d1d9">		color: &#39;green&#39;</span></span>
<span class="line"><span style="color: #c9d1d9">	}</span></span>
<span class="line"><span style="color: #c9d1d9">}</span></span>
<span class="line"><span style="color: #c9d1d9"></span></span></code></pre></div></code></pre>
</li>
</ol>
<h3 id="grouped-rows" tabindex="-1">Grouped Rows <a class="header-anchor" href="#grouped-rows" aria-hidden="true">#</a></h3>
<p>To render grouped rows, you must provide <code>rows</code> in the following format:</p>
<pre><code><div class="htw-relative htw-not-prose __histoire-code"><div class="htw-absolute htw-top-0 htw-right-0 htw-text-xs htw-text-white/40"></div><pre class="shiki github-dark" style="background-color: #0d1117"><code><span class="line"><span style="color: #c9d1d9">[</span></span>
<span class="line"><span style="color: #c9d1d9">    {</span></span>
<span class="line"><span style="color: #c9d1d9">        group: &#39;Group Title 1&#39;,</span></span>
<span class="line"><span style="color: #c9d1d9">        collapsed: false,</span></span>
<span class="line"><span style="color: #c9d1d9">        rows: [</span></span>
<span class="line"><span style="color: #c9d1d9">            {id: 1, key1: value1, key2: value2, ...},</span></span>
<span class="line"><span style="color: #c9d1d9">            {id: 2, key1: value1, key2: value2, ...},</span></span>
<span class="line"><span style="color: #c9d1d9">        ]</span></span>
<span class="line"><span style="color: #c9d1d9">    },</span></span>
<span class="line"><span style="color: #c9d1d9">    {</span></span>
<span class="line"><span style="color: #c9d1d9">        group: &#39;Group Title 2&#39;,</span></span>
<span class="line"><span style="color: #c9d1d9">        collapsed: false,</span></span>
<span class="line"><span style="color: #c9d1d9">        rows: [</span></span>
<span class="line"><span style="color: #c9d1d9">            {id: 3, key1: value1, key2: value2, ...},</span></span>
<span class="line"><span style="color: #c9d1d9">            {id: 4, key1: value1, key2: value2, ...},</span></span>
<span class="line"><span style="color: #c9d1d9">        ]</span></span>
<span class="line"><span style="color: #c9d1d9">    },</span></span>
<span class="line"><span style="color: #c9d1d9">]</span></span>
<span class="line"><span style="color: #c9d1d9"></span></span></code></pre></div></code></pre>
<h3 id="options" tabindex="-1">Options <a class="header-anchor" href="#options" aria-hidden="true">#</a></h3>
<ol>
<li>
<p>If you want to route using router-link just add a <code>getRowRoute</code> function
which returns a route object</p>
<p><code>getRowRoute: (row) =&gt; ({ name: 'User', params: { userId: row.id } })</code></p>
</li>
<li>
<p>if you need to do some action add a <code>onRowClick</code> event handler</p>
<p><code>onRowClick: (row) =&gt; console.log(row.label + ' was clicked')</code></p>
</li>
<li>
<p>selectable (Boolean) - if true, checkbox will be shown in header and rows, to
select/multiselect rows and perform some action on them - default is true</p>
</li>
<li>
<p>showTooltip (Boolean) - if true, tooltip will be shown on hover of row -
default is true</p>
</li>
<li>
<p>resizeColumn (Boolean) - if true, column can be resized by dragging the
resizer on the right side of the column header - default is false</p>
</li>
</ol>
<hr>
<h3 id="selection-banner-will-be-shown-when-selectable-default-is-true-is-true" tabindex="-1">Selection Banner (Will be shown when selectable (default is true) is true) <a class="header-anchor" href="#selection-banner-will-be-shown-when-selectable-default-is-true-is-true" aria-hidden="true">#</a></h3>
<p><strong>Without custom action buttons:</strong>
<img width="1213" alt="image" src="https://github.com/frappe/frappe-ui/assets/30859809/36fafcf5-45c6-43f0-acde-f64afe38b550"></p>
<p><strong>With custom action buttons:</strong>
<img width="1212" alt="image" src="https://github.com/frappe/frappe-ui/assets/30859809/55e751b2-df66-4ff0-b852-af463014463f"></p>
<pre><code><div class="htw-relative htw-not-prose __histoire-code"><div class="htw-absolute htw-top-0 htw-right-0 htw-text-xs htw-text-white/40"></div><pre class="shiki github-dark" style="background-color: #0d1117"><code><span class="line"><span style="color: #c9d1d9">&lt;ListSelectBanner&gt;</span></span>
<span class="line"><span style="color: #c9d1d9">	&lt;template #actions&gt;</span></span>
<span class="line"><span style="color: #c9d1d9">	  &lt;div class=&quot;flex gap-2&quot;&gt;</span></span>
<span class="line"><span style="color: #c9d1d9">	    &lt;Button variant=&quot;ghost&quot; label=&quot;Delete&quot; /&gt;</span></span>
<span class="line"><span style="color: #c9d1d9">	    &lt;Button variant=&quot;ghost&quot; label=&quot;Edit&quot; /&gt;</span></span>
<span class="line"><span style="color: #c9d1d9">	  &lt;/div&gt;</span></span>
<span class="line"><span style="color: #c9d1d9">	&lt;/template&gt;</span></span>
<span class="line"><span style="color: #c9d1d9">&lt;/ListSelectBanner&gt;</span></span>
<span class="line"><span style="color: #c9d1d9"></span></span></code></pre></div></code></pre>
<p>You can also make your own custom selection banner</p>
<img width="629" alt="image" src="https://github.com/frappe/frappe-ui/assets/30859809/38dfa834-96a2-4ac5-ad4b-30b3e6871d3f">
<pre><code><div class="htw-relative htw-not-prose __histoire-code"><div class="htw-absolute htw-top-0 htw-right-0 htw-text-xs htw-text-white/40"></div><pre class="shiki github-dark" style="background-color: #0d1117"><code><span class="line"><span style="color: #c9d1d9">&lt;ListSelectBanner&gt;</span></span>
<span class="line"><span style="color: #c9d1d9">	&lt;div&gt;Custom Banner&lt;/div&gt;</span></span>
<span class="line"><span style="color: #c9d1d9">&lt;/ListSelectBanner&gt;</span></span>
<span class="line"><span style="color: #c9d1d9"></span></span></code></pre></div></code></pre>
`;
const frontmatter = {};
const relativePath = "src/components/ListView.story.md";
export {
  frontmatter,
  html,
  relativePath
};
