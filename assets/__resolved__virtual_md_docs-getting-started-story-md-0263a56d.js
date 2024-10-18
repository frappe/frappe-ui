const html = `<h1 id="getting-started" tabindex="-1">Getting Started <a class="header-anchor" href="#getting-started" aria-hidden="true">#</a></h1>
<p>This page will help you with setting up <code>frappe-ui</code> in a new project as well as
an existing Frappe project.</p>
<h2 id="quick-start" tabindex="-1">Quick start <a class="header-anchor" href="#quick-start" aria-hidden="true">#</a></h2>
<p>You can quickly setup <code>frappe-ui</code> using
<a href="https://github.com/netchampfaris/frappe-ui-starter" target="_blank"><code>frappe-ui-starter</code></a>. If
you already have a Frappe app for which you want to build a frontend you can
start with <strong>Step 2</strong>.</p>
<h3 id="_1-create-your-frappe-app" tabindex="-1">1. Create your Frappe app <a class="header-anchor" href="#_1-create-your-frappe-app" aria-hidden="true">#</a></h3>
<pre><code class="language-sh"><div class="htw-relative htw-not-prose __histoire-code"><div class="htw-absolute htw-top-0 htw-right-0 htw-text-xs htw-text-white/40">sh</div><pre class="shiki github-dark" style="background-color: #0d1117"><code><span class="line"><span style="color: #FFA657">bench</span><span style="color: #C9D1D9"> </span><span style="color: #A5D6FF">new-app</span><span style="color: #C9D1D9"> </span><span style="color: #A5D6FF">todo</span></span>
<span class="line"></span></code></pre></div></code></pre>
<h3 id="_2-setup-frappe-ui" tabindex="-1">2. Setup frappe-ui <a class="header-anchor" href="#_2-setup-frappe-ui" aria-hidden="true">#</a></h3>
<pre><code class="language-sh"><div class="htw-relative htw-not-prose __histoire-code"><div class="htw-absolute htw-top-0 htw-right-0 htw-text-xs htw-text-white/40">sh</div><pre class="shiki github-dark" style="background-color: #0d1117"><code><span class="line"><span style="color: #79C0FF">cd</span><span style="color: #C9D1D9"> </span><span style="color: #A5D6FF">apps/todo</span></span>
<span class="line"><span style="color: #8B949E"># this will setup a vue project with frappe-ui set up</span></span>
<span class="line"><span style="color: #8B949E"># inside the frontend directory</span></span>
<span class="line"><span style="color: #FFA657">npx</span><span style="color: #C9D1D9"> </span><span style="color: #A5D6FF">degit</span><span style="color: #C9D1D9"> </span><span style="color: #A5D6FF">netchampfaris/frappe-ui-starter</span><span style="color: #C9D1D9"> </span><span style="color: #A5D6FF">frontend</span></span>
<span class="line"></span></code></pre></div></code></pre>
<p>Refer <a href="https://github.com/netchampfaris/frappe-ui-starter" target="_blank">frappe-ui-starter</a>
for more details.</p>
<h3 id="_3-ignore-csrf-config" tabindex="-1">3. ignore_csrf config <a class="header-anchor" href="#_3-ignore-csrf-config" aria-hidden="true">#</a></h3>
<pre><code class="language-sh"><div class="htw-relative htw-not-prose __histoire-code"><div class="htw-absolute htw-top-0 htw-right-0 htw-text-xs htw-text-white/40">sh</div><pre class="shiki github-dark" style="background-color: #0d1117"><code><span class="line"><span style="color: #FFA657">bench</span><span style="color: #C9D1D9"> </span><span style="color: #79C0FF">--site</span><span style="color: #C9D1D9"> </span><span style="color: #A5D6FF">todo.test</span><span style="color: #C9D1D9"> </span><span style="color: #A5D6FF">set-config</span><span style="color: #C9D1D9"> </span><span style="color: #A5D6FF">ignore_csrf</span><span style="color: #C9D1D9"> </span><span style="color: #79C0FF">1</span></span>
<span class="line"></span></code></pre></div></code></pre>
<p>This will prevent CSRFToken errors while using the vite dev server. In
production environment, the csrf_token is attached to the window object in
index.html for you.</p>
<h3 id="_4-start-dev-server" tabindex="-1">4. Start dev server <a class="header-anchor" href="#_4-start-dev-server" aria-hidden="true">#</a></h3>
<pre><code class="language-sh"><div class="htw-relative htw-not-prose __histoire-code"><div class="htw-absolute htw-top-0 htw-right-0 htw-text-xs htw-text-white/40">sh</div><pre class="shiki github-dark" style="background-color: #0d1117"><code><span class="line"><span style="color: #79C0FF">cd</span><span style="color: #C9D1D9"> </span><span style="color: #A5D6FF">frontend</span></span>
<span class="line"><span style="color: #FFA657">yarn</span></span>
<span class="line"><span style="color: #FFA657">yarn</span><span style="color: #C9D1D9"> </span><span style="color: #A5D6FF">dev</span></span>
<span class="line"></span></code></pre></div></code></pre>
<p>The Vite dev server will start on the port <code>8080</code>. This can be changed from
<code>vite.config.js</code>. The development server is configured to proxy your frappe app
(usually running on port 8000). If you have a site named <code>todo.test</code>, open
<code>http://todo.test:8080</code> in your browser. If you see a button named &quot;Click to
send 'ping' request&quot;, congratulations!</p>
<p>If you notice the browser URL is <code>/frontend</code>, this is the base URL where your
frontend app will run in production. To change this, open <code>src/router.js</code> and
change the base URL passed to <code>createWebHistory</code>.</p>
`;
const frontmatter = {};
const relativePath = "docs/Getting Started.story.md";
export {
  frontmatter,
  html,
  relativePath
};
