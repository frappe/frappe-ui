<template>
  <footer class="border-t p-10 text-gray-50 bg-gray-900 mt-auto">
    <div class="max-w-7xl flex flex-col lg:flex-row [&_a]:text-ink-gray-3 [&_a]:dark:text-ink-gray-5
			gap-10 mx-auto ">
      <section class="flex flex-col gap-4 flex-1">
        <div class="flex gap-3 items-center">
          <img src="/logo.svg" class="w-8" />
          <h2 class="text-3xl">Frappe UI</h2>
        </div>

        <p class="text-lg text-ink-gray-3 dark:text-ink-gray-5 max-w-sm leading-relaxed">
          A powerful UI component library made and used with ease. Consistent
          design system.
        </p>
      </section>

      <section class="flex flex-col gap-4 ">
        <b> Product </b>
        <a href="/docs/badge"> Components </a>
        <a href="/docs/design-system/bg-color"> Design system </a>
				<a href='https://www.npmjs.com/package/frappe-ui' target="_blank">Npm package</a>
      </section>

      <section class="flex flex-col gap-4">
        <b>Resources </b>
        <a>Documentation</a>
        <a>Blog</a>
        <a>Changelog</a>
      </section>
    </div>
  </footer>
</template>
