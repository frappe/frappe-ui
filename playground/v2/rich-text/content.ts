// The document the file shows in its editor (30534:59617): the Frappe
// article, block by block — headings, lists, links, a quote, rules, a
// table, a code block, an image group, coloured and highlighted text, an
// audio bar, mentions, an embed, attachments, strike and quotes, callouts,
// a checklist, an expand/collapse list, sub- and superscript and a
// two-column layout.
import team1 from '../assets/rte/team-1.jpg'
import team2 from '../assets/rte/team-2.jpg'
import team3 from '../assets/rte/team-3.jpg'
import audio from '../assets/rte/sample.wav'
import avatarFaris from '../assets/rte/avatar-faris.png'
import avatarGowtham from '../assets/rte/avatar-gowtham.png'
import avatarHarsha from '../assets/rte/avatar-harsha.png'
import avatarJayaprakash from '../assets/rte/avatar-jayaprakash.png'
import avatarSandeep from '../assets/rte/avatar-sandeep.png'
import avatarShruti from '../assets/rte/avatar-shruti.png'

// the people the "@" list offers, each with the face the file gives them
// (32467:13501): the espresso-2.0 avatars, exported from the list itself
export const people = [
  { value: 'faris', label: 'Faris', image: avatarFaris },
  { value: 'gowtham', label: 'Gowtham', image: avatarGowtham },
  { value: 'harsha', label: 'Harsha', image: avatarHarsha },
  { value: 'jayaprakash', label: 'Jayaprakash', image: avatarJayaprakash },
  { value: 'sandeep', label: 'Sandeep', image: avatarSandeep },
  { value: 'shruti', label: 'Shruti', image: avatarShruti },
]

export const tags = [
  { value: 'design', label: 'design' },
  { value: 'framework', label: 'framework' },
  { value: 'release', label: 'release' },
]

const mention = (id: string, label: string) =>
  `<span class="mention" data-type="mention" data-id="${id}" data-label="${label}">@${label}</span>`

export const article = `
<h1>Building Better Software with Frappe</h1>
<p>Modern businesses need software that adapts to their processes instead of forcing teams to change the way they work. At Frappe, we believe that business software should be flexible, transparent, and accessible to organizations of all sizes.</p>
<p></p>
<p>For more than a decade, Frappe has been building open-source products that help businesses manage operations, collaborate effectively, and scale with confidence. From startups managing their first customers to enterprises handling complex workflows, thousands of organizations rely on Frappe-powered applications every day.</p>
<p></p>
<p>One of the most widely adopted products built on the framework is ERPNext, an enterprise resource planning system that brings together accounting, sales, purchasing, inventory, manufacturing, customer relationship management, human resources, projects, and support operations into a unified platform. Organizations ranging from startups to large enterprises use ERPNext to streamline workflows, improve visibility across departments, and make data-driven decisions.</p>
<p></p>
<p>Most business software begins with a simple promise: make work easier. Over time, however, many systems become difficult to customize, expensive to maintain, and disconnected from the unique needs of the organizations that use them.</p>
<p></p>
<p>Frappe takes a different approach.</p>
<p></p>
<p>By combining open-source principles with modern <a href="https://frappe.io/design">Product design,</a> Frappe enables businesses to build workflows that fit their operations rather than forcing operations to fit the software.</p>
<h3>Core Principles</h3>
<ul>
  <li><p>Open by default</p></li>
  <li><p>Built for customization</p></li>
  <li><p>Developer-friendly architecture</p></li>
  <li><p>Human-centered design</p></li>
  <li><p>Community-driven innovation</p></li>
  <li><p>Long-term sustainability</p></li>
</ul>
<p></p>
<blockquote><p><em>“Software should empower organisation to innovate, not limit them”</em></p></blockquote>
<hr>
<h2>A Framework Designed for Rapid Development</h2>
<p>The Frappe Framework is a full-stack web application framework that allows developers to build robust business applications with remarkable speed.</p>
<p></p>
<p>Instead of spending months creating common infrastructure such as authentication systems, permission management, dashboards, reporting tools, and APIs, developers can focus <span data-comment="c1"><mark style="background-color: var(--prose-highlight-yellow)">on solving</mark></span> real business problems.</p>
<h3>Key Features</h3>
<ol>
  <li><p>Metadata-driven architecture</p></li>
  <li><p>REST and GraphQL APIs</p></li>
  <li><p>Background job processing</p></li>
  <li><p>Workflow automation</p></li>
  <li><p>Role-based permissions</p></li>
  <li><p>Real-time updates</p></li>
  <li><p>Multi-time updates</p></li>
  <li><p>Responsive user interface</p></li>
</ol>
<hr>
<h2>From Framework to Ecosystem</h2>
<p>What started as a framework has evolved into a complete ecosystem of applications serving organizations across industries.</p>
<h3>From Framework to Ecosystem</h3>
<table>
  <tbody>
    <tr><th><p>Product</p></th><th><p>Purpose</p></th><th><p>Primary Users</p></th></tr>
    <tr><td><p>ERPNext</p></td><td><p>Enterprise Resource Planning</p></td><td><p>Small to Large Businesses</p></td></tr>
    <tr><td><p>Frappe CRM</p></td><td><p>Customer Relationship Manger</p></td><td><p>Sales Teams</p></td></tr>
    <tr><td><p>Frappe Helpdesk</p></td><td><p>Customer Support Operations</p></td><td><p>Support Teams</p></td></tr>
    <tr><td><p>Frappe HR</p></td><td><p>Human Resource Management</p></td><td><p>HR Departments</p></td></tr>
    <tr><td><p>Frappe LMS</p></td><td><p>Learning Management System</p></td><td><p>Educators &amp; Training Teams</p></td></tr>
    <tr><td><p>Frappe Drive</p></td><td><p>Document Management &amp; Collaboration</p></td><td><p>All Teams</p></td></tr>
    <tr><td><p>Frappe Builder</p></td><td><p>No-Code Website Builder</p></td><td><p>Marketers &amp; Designers</p></td></tr>
  </tbody>
</table>
<p></p>
<p>Together, these products help businesses manage critical processes through a unified and consistent experience.</p>
<hr>
<h2>Code Block</h2>
<pre><code class="language-python">def welcome():
    print("Welcome to Frappe!")

welcome()</code></pre>
<hr>
<h2>Frappe Team</h2>
<div data-type="image-group" data-columns="2"><img src="${team1}" alt="Frappeverse talk"><img src="${team2}" alt="What is marketplace?"></div>
<img src="${team3}" alt="Frappeverse 2023 group photo" data-caption="Image with captions provide context">
<div data-type="columns" data-count="2" data-media="true"><div data-type="column"><img src="${team1}" alt="Frappeverse talk"></div><div data-type="column"><img src="${team2}" alt="Frappeverse stage"></div></div>
<div data-type="image-slot"></div>
<hr>
<h2>The Frappe Ecosystem</h2>
<p><span style="color: var(--prose-color-pink)">The Frappe ecosystem is built around the idea that businesses should own and control their software rather than being locked into rigid proprietary systems. By providing open-source tools and platforms, Frappe enables organizations to customize solutions according to their processes while benefiting from a large community of contributors and partners.</span></p>
<p></p>
<p>Developers appreciate the framework’s rapid application development capabilities, while businesses value the integrated experience across products. Whether managing financial transactions, tracking inventory, handling customer support requests, delivering online courses, or collaborating across teams, organizations can leverage a consistent platform and user experience throughout the ecosystem.</p>
<p></p>
<p>As technology continues to evolve, Frappe remains focused on creating software that is accessible, extensible, and sustainable. Its mission is not only to build products but also to foster a collaborative environment where developers and businesses can innovate together, creating solutions that address real-world challenges with transparency and efficiency.</p>
<p></p>
<p>Learn more about all components from the <strong>Frappe</strong></p>
<audio src="${audio}" title="Frappe podcast"></audio>
<hr>
<h2>Why Organizations Choose Frappe</h2>
<p>Businesses today require software that is flexible enough to adapt to changing needs while remaining reliable and easy to use. Frappe addresses these challenges through a combination of open-source technology, thoughtful design, and community-driven development</p>
<p></p>
<p>Key benefits include:</p>
<ul>
  <li><p>Complete ownership and transparency through open-source software.</p></li>
  <li><p>Extensive customization without vendor lock-in.</p></li>
  <li><p>A growing ecosystem of integrated business applications.</p></li>
  <li><p>Modern and intuitive user experiences.</p></li>
  <li><p>Rapid application development capabilities.</p></li>
  <li><p>Strong global community and partner network.</p></li>
  <li><p>Flexible deployment options including cloud and self-hosted environments.</p></li>
</ul>
<p></p>
<p>These principles have helped Frappe become a trusted platform for organizations seeking modern, scalable, and future-ready business software solutions.</p>
<hr>
<h2>Design Team Contributions</h2>
<p>The initial design system was developed by ${mention('shruti', 'Shruti')} and ${mention('harsha', 'Harsha')} who focused on creating a scalable component architecture that could be adopted across multiple products. Over time, the system evolved through contributions from ${mention('jayaprakash', 'Jayaprakash')} ${mention('gowtham', 'Gowtham')} and other team members, resulting in a consistent and reusable design language that supports rapid product development.</p>
<hr>
<h2>Designed for Modern Organizations</h2>
<p>Modern organizations require software that can evolve alongside their business. Growth often introduces new processes, larger teams, additional compliance requirements, and more complex operational challenges. Frappe products are designed with scalability in mind, ensuring organizations can start small and expand their systems as requirements change.</p>
<p></p>
<iframe src="https://www.youtube.com/embed/aqz-KE-bpKQ" title="Big Buck Bunny"></iframe>
<p></p>
<a data-attachment href="#" data-file-name="Default ticket type" data-file-size="12288" data-mime-type="text/plain">Default ticket type</a>
<a data-attachment href="#" data-file-name="Supply_update.doc" data-file-size="49152" data-mime-type="application/msword">Supply_update.doc</a>
<a data-attachment href="#" data-file-name="Frappe logos.zip" data-file-size="2202009" data-mime-type="application/zip">Frappe logos.zip</a>
<hr>
<h2>Empowering Developers and Businesses</h2>
<p>One of Frappe’s unique strengths is its ability to serve both technical and non-technical users. Developers benefit from a modern technology stack, extensive customization capabilities, and a framework that accelerates application development. Business users benefit from intuitive interfaces, configurable workflows, and software that aligns closely with their operational needs.</p>
<p></p>
<p>This balance creates a collaborative environment where business teams and developers can work together to continuously improve processes and adapt systems as requirements evolve. <s>Instead of viewing software as a fixed product</s>, organizations can treat it as a platform for ongoing innovation.</p>
<p></p>
<blockquote><p><em>“The success of Frappe is closely tied to its global community. Thousands of contributors across different countries actively participate in the ecosystem by developing applications, improving documentation, sharing best practices, organizing events, and supporting other users.”</em></p><blockquote><p><em>The ecosystem is further strengthened by implementation partners and consultants who help businesses deploy solutions</em></p></blockquote></blockquote>
<hr>
<h2>Callouts</h2>
<div data-type="callout" data-emoji="💡"><p><strong>Tip</strong></p><p>Frappe applications are highly customisable. Before creating custom features, explore existing workflows, custom fields, and automation tools to avoid unnecessary development effort.</p></div>
<div data-type="callout" data-emoji="🚀"><p><strong>Getting Started</strong></p><p>New to Frappe? Begin with ERPNext to understand the platform’s capabilities, then explore the Framework for building custom applications tailored to your business processes.</p></div>
<div data-type="callout" data-emoji="📅"><p><strong>Upcoming Release</strong></p><p>The next release will focus on performance improvements, accessibility enhancements, and refinements to the overall user experience across the platform.</p></div>
<hr>
<h2>Product Launch Checklist</h2>
<ul data-type="taskList">
  <li data-type="taskItem" data-checked="false"><p>Define project requirements</p></li>
  <li data-type="taskItem" data-checked="false"><p>Create wireframes</p></li>
  <li data-type="taskItem" data-checked="false"><p>Design core componets</p></li>
  <li data-type="taskItem" data-checked="false"><p>Review design system guidelines</p></li>
  <li data-type="taskItem" data-checked="false"><p>Implement responsive layouts</p></li>
  <li data-type="taskItem" data-checked="false"><p>Complete accessibility audit</p></li>
  <li data-type="taskItem" data-checked="false"><p>Perform cross-browser testing</p></li>
  <li data-type="taskItem" data-checked="false"><p>Finalise documentation</p></li>
  <li data-type="taskItem" data-checked="false"><p>Launch beta release</p></li>
  <li data-type="taskItem" data-checked="false"><p>Gather customer feedback</p></li>
</ul>
<hr>
<h2>Expand/Collapse</h2>
<details><summary>ERP Next</summary><div data-type="details-content"><p>ERPNext brings accounting, sales, purchasing, inventory, manufacturing and HR into one platform.</p></div></details>
<details><summary>Framework</summary><div data-type="details-content"><p>A full-stack web application framework for building business apps at speed.</p></div></details>
<details><summary>Frappe HR</summary><div data-type="details-content"><p>Payroll, leave, attendance and performance in one place.</p></div></details>
<details><summary>Frappe CRM</summary><div data-type="details-content"><p>Leads, deals and pipelines with a streamlined, collaborative workflow.</p></div></details>
<details><summary>Frappe Helpdesk</summary><div data-type="details-content"><p>Tickets, SLAs and a knowledge base for support teams.</p></div></details>
<details open><summary>Drive</summary><div data-type="details-content"><p>Frappe Drive is an open-source, self-hosted cloud storage and file management platform that helps teams securely store, organize, share, and collaborate on files while maintaining complete control over their data.</p></div></details>
<details><summary>Frappe Learning</summary><div data-type="details-content"><p>Courses, assessments and certifications online.</p></div></details>
<details><summary>Frappe Builder</summary><div data-type="details-content"><p>A no-code website builder.</p></div></details>
<details><summary>Gameplan</summary><div data-type="details-content"><p>Async discussions for teams.</p></div></details>
<details><summary>Lending</summary><div data-type="details-content"><p>Loan management on ERPNext.</p></div></details>
<hr>
<h2>Super and Subscript</h2>
<ul>
  <li><p>X<sup>2</sup></p></li>
  <li><p>10<sup>3</sup></p></li>
  <li><p>m<sup>2</sup></p></li>
  <li><p>cm<sup>3</sup></p></li>
  <li><p>10<sup>6</sup></p></li>
  <li><p>H2<sub>o</sub></p></li>
  <li><p>CO<sub>2</sub></p></li>
</ul>
<hr>
<h2>Multi-column layout</h2>
<div data-type="columns" data-count="2">
  <div data-type="column"><p>Frappe CRM helps businesses manage leads, customers, and sales opportunities from a single platform. Track every interaction, automate repetitive tasks, and close deals faster with a streamlined, collaborative workflow.</p></div>
  <div data-type="column"><p>Frappe Helpdesk enables teams to deliver fast, efficient customer support from a unified workspace. Manage tickets, automate workflows, track SLAs, and resolve issues seamlessly with powerful collaboration tools.</p></div>
</div>
<p></p>
`
